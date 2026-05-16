"use client";

/**
 * CircularGallery — 3D rotujúca galéria projektov.
 *
 * Karty sú rozmiestnené po obvode kruhu okolo Y-osi (rotateY + translateZ).
 * Rotácia má dva zdroje, ktoré sa sčítavajú do finálneho `rotation`:
 *   • horizontálne swipe / mouse drag (s momentum decay po uvoľnení)
 *   • jemný auto-rotate keď sa neťahá a (na desktope) nie je hover
 *
 * Vertikálny scroll stránku neovplyvňuje rotáciu — galéria sa točí iba
 * cez gesto alebo auto-drift. Bolo to dezorientujúce, keď sa karty
 * otáčali len preto, že user scroloval stránku k CTA.
 *
 * Karty oproti kamere sú plne viditeľné. Karty s uhlom od kamery > 90°
 * sa skryjú cez `visibility: hidden` + `pointer-events: none`, aby
 * neprekrývali predné karty na mobile s malým radiusom.
 *
 * Mobile responsive: radius a veľkosť kariet sa prispôsobí šírke okna.
 */

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import { Lock, ExternalLink } from "lucide-react";

export interface GalleryItem {
    slug: string;
    name: string;
    category: string;
    description: string;
    image: string;   // /portfolio/{slug}.jpg
    url: string;
    private?: boolean;
}

interface Props {
    items: GalleryItem[];
    /** Rýchlosť auto-rotácie v stupňoch za frame (default 0.025 ≈ pomalý drift). */
    autoRotateSpeed?: number;
}

/**
 * Vypočíta optimálne rozmery podľa šírky okna.
 * Mobile: úzke karty + radius dosť veľký, aby sa nepretkávali viditeľné karty na fronte.
 * Desktop: veľké karty + veľký radius (viac drámy).
 *
 * Pri 10 kartách obvod kruhu / 10 musí byť aspoň cardW + malý gap, inak sa karty
 * v prednom oblúku prekrývajú. Pre 10 kariet to znamená:
 *   2·π·radius / 10 >= cardW + 24
 *   radius >= 10·(cardW + 24) / (2·π) ≈ 1.59·(cardW + 24)
 */
function getGeometry(width: number) {
    if (width < 640) {
        return { radius: 300, cardW: 160, cardH: 220, perspective: 1100 };
    }
    if (width < 1024) {
        return { radius: 420, cardW: 230, cardH: 310, perspective: 1600 };
    }
    return { radius: 600, cardW: 300, cardH: 400, perspective: 2000 };
}

/** Wrap zľava aj sprava — angle (0,360] s 360 = 0. */
function modAngle(deg: number): number {
    return ((deg % 360) + 360) % 360;
}

export default function CircularGallery({
    items,
    autoRotateSpeed = 0.025,
}: Props) {
    // Jedna pravda — finálny rotation aplikovaný na 3D wrapper.
    const [rotation, setRotation] = useState(0);
    // Šírka okna pre responsívny radius.
    const [windowWidth, setWindowWidth] = useState<number>(
        typeof window === "undefined" ? 1280 : window.innerWidth
    );

    // Stavy interakcií — držíme cez useRef aby sa nespúšťali re-rendery v RAF loope.
    const isDraggingRef = useRef(false);
    const isHoverPausedRef = useRef(false);
    const dragVelocityRef = useRef(0);
    const rafRef = useRef<number | null>(null);

    // Drag tracking
    const dragStartXRef = useRef(0);
    const dragStartYRef = useRef(0);
    const dragLastXRef = useRef(0);
    const dragLastTimeRef = useRef(0);
    const dragAxisLockedRef = useRef<"x" | "y" | null>(null);
    // Po skončení dragu krátko držíme true — onClickCapture potom anuluje klik na kartu.
    const wasDragRef = useRef(false);
    const wasDragTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ─── Sleduj šírku okna pre responsívny radius ───
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // ─── Auto-rotácia + momentum decay v jednom RAF loope ───
    useEffect(() => {
        const tick = () => {
            // Momentum z drag-u dobehne aj počas hover-pause — user to čaká.
            if (dragVelocityRef.current !== 0 && !isDraggingRef.current) {
                setRotation((prev) => prev + dragVelocityRef.current);
                dragVelocityRef.current *= 0.94; // decay
                if (Math.abs(dragVelocityRef.current) < 0.02) {
                    dragVelocityRef.current = 0;
                }
            } else if (!isDraggingRef.current && !isHoverPausedRef.current) {
                setRotation((prev) => prev + autoRotateSpeed);
            }
            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [autoRotateSpeed]);

    // ─── Touch / mouse drag handlers ───
    // Threshold: aby sa drag nezačal na náhodný klik na kartu.
    const DRAG_THRESHOLD = 8;
    // Citlivosť: koľko stupňov rotácie na 1 pixel pohybu. ~0.4° = 90° na 225 px swipe.
    const DRAG_SENSITIVITY = 0.4;

    const beginPointer = useCallback((clientX: number, clientY: number) => {
        dragStartXRef.current = clientX;
        dragStartYRef.current = clientY;
        dragLastXRef.current = clientX;
        dragLastTimeRef.current = performance.now();
        dragAxisLockedRef.current = null;
        // Pri začatí dragu zastavíme prípadný momentum z minulého swipe.
        dragVelocityRef.current = 0;
    }, []);

    /**
     * Vráti true ak sa drag začal a treba zablokovať default (scroll).
     * Vráti false ak sa pohyb javí ako vertikálny scroll — necháme prejsť.
     */
    const movePointer = useCallback((clientX: number, clientY: number): boolean => {
        const dx = clientX - dragStartXRef.current;
        const dy = clientY - dragStartYRef.current;

        // Axis lock: ak ešte nie je rozhodnuté, počkaj kým prekročíme threshold.
        if (dragAxisLockedRef.current === null) {
            if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) {
                return false;
            }
            dragAxisLockedRef.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
        }

        // Pri vertikálnom geste necháme stránku scrolovať (galériu vertikálny scroll
        // neovplyvňuje — zámerne, aby user mohol prejsť k spodnému CTA bez krútenia).
        if (dragAxisLockedRef.current === "y") {
            return false;
        }

        // Horizontálny drag — otáčame galériu.
        isDraggingRef.current = true;
        const stepDx = clientX - dragLastXRef.current;
        const now = performance.now();
        const dt = Math.max(1, now - dragLastTimeRef.current);
        dragLastXRef.current = clientX;
        dragLastTimeRef.current = now;

        // Swipe doprava (pozitívny dx) → karty idú v smere prsta doprava
        // → rotateY rastie, pretože pravá karta sa otáča dopredu cez ľavý okraj.
        const rotDelta = stepDx * DRAG_SENSITIVITY;
        setRotation((prev) => prev + rotDelta);

        // Drž si momentum (stupne / 16 ms — približne stupne za frame pri 60 fps).
        dragVelocityRef.current = (rotDelta / dt) * 16;
        return true;
    }, []);

    const endPointer = useCallback(() => {
        // Drag skončil. Momentum už máme v dragVelocityRef.
        const wasReallyDragging = isDraggingRef.current;
        isDraggingRef.current = false;
        dragAxisLockedRef.current = null;

        // Ak naozaj prebehol horizontálny drag, podrž "wasDrag" flag krátko,
        // aby sa nasledujúci klick na kartu nezarátal ako klik (= swipe by inak
        // otvoril link).
        if (wasReallyDragging) {
            wasDragRef.current = true;
            if (wasDragTimeoutRef.current) clearTimeout(wasDragTimeoutRef.current);
            wasDragTimeoutRef.current = setTimeout(() => {
                wasDragRef.current = false;
            }, 200);
        }
    }, []);

    // Touch
    const onTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length !== 1) return;
        const t = e.touches[0];
        beginPointer(t.clientX, t.clientY);
    };
    const onTouchMove = (e: React.TouchEvent) => {
        if (e.touches.length !== 1) return;
        const t = e.touches[0];
        const wantsDrag = movePointer(t.clientX, t.clientY);
        if (wantsDrag && e.cancelable) {
            e.preventDefault(); // blokuj scroll iba ak naozaj ťaháme horizontálne
        }
    };
    const onTouchEnd = () => endPointer();

    // Mouse (desktop) — drag len keď je button stlačený.
    const isMouseDownRef = useRef(false);
    const onMouseDown = (e: React.MouseEvent) => {
        isMouseDownRef.current = true;
        beginPointer(e.clientX, e.clientY);
    };
    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            if (!isMouseDownRef.current) return;
            movePointer(e.clientX, e.clientY);
        };
        const handleUp = () => {
            if (!isMouseDownRef.current) return;
            isMouseDownRef.current = false;
            endPointer();
        };
        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseup", handleUp);
        return () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseup", handleUp);
        };
    }, [movePointer, endPointer]);

    const { radius, cardW, cardH, perspective } = useMemo(
        () => getGeometry(windowWidth),
        [windowWidth]
    );

    const anglePerItem = items.length > 0 ? 360 / items.length : 0;

    // Hover pause iba na desktope — na touch zariadeniach by hover-event po tap-e zostal "stuck".
    const isTouchDevice =
        typeof window !== "undefined" && "ontouchstart" in window;

    // Cleanup wasDrag timeout pri unmount.
    useEffect(() => {
        return () => {
            if (wasDragTimeoutRef.current) clearTimeout(wasDragTimeoutRef.current);
        };
    }, []);

    return (
        <div
            className="relative w-full h-full flex items-center justify-center select-none"
            // touch-action: pan-y povolí vertikálny scroll; horizontálne gestá si chytáme sami
            // cez preventDefault v onTouchMove (až keď je drag potvrdený ako horizontálny).
            style={{ perspective: `${perspective}px`, touchAction: "pan-y" }}
            onMouseEnter={isTouchDevice ? undefined : () => { isHoverPausedRef.current = true; }}
            onMouseLeave={isTouchDevice ? undefined : () => { isHoverPausedRef.current = false; }}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onTouchCancel={onTouchEnd}
            // Capture klik na karte, ak práve prebehol swipe — inak by sa otvoril odkaz.
            onClickCapture={(e) => {
                if (wasDragRef.current) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }}
        >
            <div
                className="relative w-full h-full"
                style={{
                    transform: `rotateY(${rotation}deg)`,
                    transformStyle: "preserve-3d",
                    willChange: "transform",
                }}
            >
                {items.map((item, i) => {
                    const itemAngle = i * anglePerItem;
                    // Normalizovaný uhol od kamery (0° = priamo predo mnou, 180° = za mnou).
                    const relative = modAngle(itemAngle + rotation);
                    const normalized = relative > 180 ? 360 - relative : relative;

                    // Karty so > 90° od kamery (zadná polovica kruhu) skryjeme úplne —
                    // riešia sa tým prekryvy na mobile s malým radiusom, a aj
                    // neviditeľné karty zbytočne nemenia layout pre screen readery.
                    const hidden = normalized > 90;
                    const opacity = hidden ? 0 : Math.max(0.2, 1 - normalized / 90);
                    const isFront = normalized < 25;

                    return (
                        <GalleryCard
                            key={item.slug}
                            item={item}
                            angle={itemAngle}
                            radius={radius}
                            cardW={cardW}
                            cardH={cardH}
                            opacity={opacity}
                            hidden={hidden}
                            isFront={isFront}
                        />
                    );
                })}
            </div>
        </div>
    );
}

/* ─── jedna karta ────────────────────────────────────────────── */

interface CardProps {
    item: GalleryItem;
    angle: number;
    radius: number;
    cardW: number;
    cardH: number;
    opacity: number;
    hidden: boolean;
    isFront: boolean;
}

function GalleryCard({ item, angle, radius, cardW, cardH, opacity, hidden, isFront }: CardProps) {
    const isPrivate = !!item.private;
    const transform = `rotateY(${angle}deg) translateZ(${radius}px)`;

    const sharedStyle: React.CSSProperties = {
        transform,
        left: "50%",
        top: "50%",
        marginLeft: `-${cardW / 2}px`,
        marginTop: `-${cardH / 2}px`,
        width: `${cardW}px`,
        height: `${cardH}px`,
        opacity,
        // Skryté karty za kamerou: nezasahujú do hit-testingu ani sa nečítajú screen readerom.
        visibility: hidden ? "hidden" : "visible",
        pointerEvents: hidden ? "none" : "auto",
        transition: "opacity 0.25s linear, box-shadow 0.4s ease",
        boxShadow: isFront
            ? "0 30px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,117,0.35) inset, 0 0 40px rgba(201,168,117,0.15)"
            : "0 20px 50px -25px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,237,220,0.08) inset",
        backfaceVisibility: "hidden",
    };

    const cardClass =
        "absolute rounded-2xl overflow-hidden backdrop-blur-md bg-gradient-to-b from-char/40 to-char-soft/95 border border-gold/20";

    const content = (
        <>
            {/* Obrázok — vrchné 62% karty */}
            <div className="relative w-full" style={{ height: "62%" }}>
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes={`${cardW}px`}
                    className="object-cover object-top"
                    draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-char via-char/30 to-transparent" />

                {/* Badge v rohu */}
                {isPrivate ? (
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-char/80 backdrop-blur-md flex items-center justify-center border border-gold/25">
                        <Lock size={13} className="text-gold/80" />
                    </div>
                ) : (
                    <div
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-char/80 backdrop-blur-md flex items-center justify-center border border-gold/25 transition-opacity duration-300 ${
                            isFront ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        <ExternalLink size={13} className="text-gold" />
                    </div>
                )}
            </div>

            {/* Text — spodná 38% karty */}
            <div className="relative h-[38%] p-3 sm:p-4 flex flex-col gap-1 sm:gap-1.5">
                <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-gold/80 truncate">
                    {item.category}
                </span>
                <h3 className="text-sm sm:text-base md:text-lg font-display font-bold text-cream leading-tight truncate">
                    {item.name}
                </h3>
                <p className="text-[10px] sm:text-[11px] md:text-xs text-cream/55 leading-relaxed line-clamp-2 font-light">
                    {item.description}
                </p>
            </div>

            {/* Jemný gold glow na fronte — naznačuje že "ide klik" */}
            {isFront && !isPrivate && (
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-2xl"
                    style={{ boxShadow: "0 0 24px rgba(228, 200, 150, 0.18) inset" }}
                />
            )}
        </>
    );

    // Private projekty nie sú clickable.
    if (isPrivate) {
        return (
            <div
                className={cardClass}
                style={sharedStyle}
                aria-label={`${item.name} — private project`}
                role="img"
                aria-hidden={hidden}
            >
                {content}
            </div>
        );
    }

    return (
        <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${cardClass} block hover:border-gold/60 transition-colors duration-300`}
            style={sharedStyle}
            aria-label={`${item.name} — open project in new tab`}
            aria-hidden={hidden}
            // Suppresion kliku počas swipe rieši onClickCapture na rodičovskom wrapperi.
        >
            {content}
        </a>
    );
}
