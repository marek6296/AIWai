"use client";

/**
 * CircularGallery — 3D rotujúca galéria projektov.
 *
 * Karty sú rozmiestnené po obvode kruhu okolo Y-osi (rotateY + translateZ).
 *
 * Zdroje rotácie:
 *   • horizontálny swipe / mouse drag → po release snap presne o JEDNU kartu
 *     v smere swipe-u (ak |dx| >= 30 px), alebo návrat na pôvodnú kartu.
 *     Po snap-e 300 ms debounce, aby sa nedalo náhodne preskočiť viac kariet.
 *   • plynulý auto-drift 0.012°/frame keď user nezasahuje (~7 minút na celý kruh).
 *     Po manuálnom swipe sa drift pauzne na 5 s a potom sa rozbehne plynule ďalej.
 *
 * Vertikálny page scroll rotáciu neovplyvňuje.
 *
 * Karty s uhlom od kamery > 90° (zadná polovica) majú visibility:hidden +
 * pointer-events:none + aria-hidden, aby neprekrývali predné na mobile.
 *
 * Mobile responsive: cardW/cardH/radius/perspective sa prispôsobí šírke okna.
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
    /** Rýchlosť plynulého auto-driftu v stupňoch za frame (default 0.012). */
    autoDriftSpeed?: number;
    /** Trvanie snap animácie v ms (default 450). */
    snapDurationMs?: number;
    /** Pauza auto-driftu po manuálnom swipe v ms (default 5000). */
    autoPauseMs?: number;
}

/**
 * Vypočíta optimálne rozmery podľa šírky okna.
 *
 * Karty sú širšie ako vysoké, aby sa do nich zmestil contained screenshot
 * (typicky 16:9 alebo 16:10) bez veľkého letterboxu. Image zaberá horných 55 %
 * výšky karty, text spodných 45 %.
 *
 * Min radius pri 10 kartách: `(cardW + ~30) / (2·sin(π/10))` ≈ 1.62·(cardW + 30).
 */
function getGeometry(width: number) {
    if (width < 640) {
        // Mobile: karta sa MUSÍ zmestiť do viewportu vrátane textovej časti — typický
        // mobil má 360–414 px šírku, karta 140 nechá pohodlne okraj na obe strany.
        return { radius: 250, cardW: 140, cardH: 190, perspective: 900 };
    }
    if (width < 1024) {
        return { radius: 480, cardW: 260, cardH: 300, perspective: 1600 };
    }
    return { radius: 640, cardW: 340, cardH: 380, perspective: 2000 };
}

/** Wrap zľava aj sprava — angle (0,360] s 360 = 0. */
function modAngle(deg: number): number {
    return ((deg % 360) + 360) % 360;
}

/** Ease-out cubic — rýchly štart, mäkký dojazd. Štandardný pre snap karusely. */
function easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
}

export default function CircularGallery({
    items,
    autoDriftSpeed = 0.012,
    snapDurationMs = 450,
    autoPauseMs = 5000,
}: Props) {
    // Jedna pravda — finálny rotation aplikovaný na 3D wrapper.
    const [rotation, setRotation] = useState(0);
    const rotationRef = useRef(0);
    // Šírka okna pre responsívny radius.
    const [windowWidth, setWindowWidth] = useState<number>(
        typeof window === "undefined" ? 1280 : window.innerWidth
    );

    // Stavy interakcií.
    const isDraggingRef = useRef(false);
    const isHoverPausedRef = useRef(false);
    const isAnimatingRef = useRef(false);   // počas snap tween-u
    const snapRafRef = useRef<number | null>(null);
    const driftRafRef = useRef<number | null>(null);
    // Timestamp do akého času je auto-drift pauznutý (po manuálnom swipe).
    const autoResumeAtRef = useRef(0);
    // Timestamp do akého času ignorujeme nové drag-y (debounce po snap-e).
    const swipeDebounceUntilRef = useRef(0);

    // Drag tracking
    const dragStartXRef = useRef(0);
    const dragStartYRef = useRef(0);
    const dragLastXRef = useRef(0);
    const dragAxisLockedRef = useRef<"x" | "y" | null>(null);
    // Po skončení dragu krátko držíme true — onClickCapture potom anuluje klik na kartu.
    const wasDragRef = useRef(false);
    const wasDragTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const anglePerItem = items.length > 0 ? 360 / items.length : 0;
    const anglePerItemRef = useRef(anglePerItem);
    anglePerItemRef.current = anglePerItem;

    // Helper: aktualizuje aj state aj ref naraz, aby callbacky vedeli čítať najnovšiu hodnotu.
    const applyRotation = useCallback((next: number) => {
        rotationRef.current = next;
        setRotation(next);
    }, []);

    // ─── Snap tween: animuje rotation z aktuálneho na `target` s ease-out cubic ───
    const animateTo = useCallback(
        (target: number) => {
            if (snapRafRef.current !== null) {
                cancelAnimationFrame(snapRafRef.current);
            }
            isAnimatingRef.current = true;
            const start = rotationRef.current;
            const startTime = performance.now();

            const step = (now: number) => {
                const elapsed = now - startTime;
                const t = Math.min(1, elapsed / snapDurationMs);
                const eased = easeOutCubic(t);
                applyRotation(start + (target - start) * eased);
                if (t < 1) {
                    snapRafRef.current = requestAnimationFrame(step);
                } else {
                    snapRafRef.current = null;
                    isAnimatingRef.current = false;
                }
            };
            snapRafRef.current = requestAnimationFrame(step);
        },
        [applyRotation, snapDurationMs]
    );

    /**
     * Snap na najbližšiu kartu, prípadne o `offsetSteps` posunutú (pre swipe = ±1).
     * Pri 10 kartách je angle 36° — round(rotation/36)*36 dá najbližší snap.
     */
    const snapBy = useCallback(
        (offsetSteps: number) => {
            const step = anglePerItemRef.current;
            if (step === 0) return;
            const nearest = Math.round(rotationRef.current / step) * step;
            animateTo(nearest + offsetSteps * step);
        },
        [animateTo]
    );

    // ─── Sleduj šírku okna pre responsívny radius ───
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // ─── Plynulý auto-drift: RAF loop pridáva ~0.012°/frame ───
    // Drift sa pauzne počas: drag, hover (desktop), snap animation, alebo prvých
    // autoPauseMs ms po skončení manuálneho swipe-u (autoResumeAtRef timestamp).
    useEffect(() => {
        const tick = () => {
            const now = performance.now();
            if (
                !isDraggingRef.current &&
                !isHoverPausedRef.current &&
                !isAnimatingRef.current &&
                now >= autoResumeAtRef.current
            ) {
                applyRotation(rotationRef.current + autoDriftSpeed);
            }
            driftRafRef.current = requestAnimationFrame(tick);
        };
        driftRafRef.current = requestAnimationFrame(tick);
        return () => {
            if (driftRafRef.current !== null) cancelAnimationFrame(driftRafRef.current);
        };
    }, [applyRotation, autoDriftSpeed]);

    // ─── Touch / mouse drag handlers ───
    const AXIS_LOCK_THRESHOLD = 8;       // px — kedy sa rozhodne x vs y os
    const DRAG_SENSITIVITY = 0.4;         // stupne rotácie na 1 px swipe
    const SWIPE_COMMIT_THRESHOLD = 30;    // celkový px za swipe na to, aby sa rátal ako 1 karta

    const beginPointer = useCallback((clientX: number, clientY: number): boolean => {
        // Debounce: ak je v okne 300 ms po predchádzajúcom snape, ignoruj nový drag.
        if (performance.now() < swipeDebounceUntilRef.current) {
            return false;
        }
        // Ak práve beží snap animation, zastav ju — user prevezme kontrolu.
        if (snapRafRef.current !== null) {
            cancelAnimationFrame(snapRafRef.current);
            snapRafRef.current = null;
            isAnimatingRef.current = false;
        }
        dragStartXRef.current = clientX;
        dragStartYRef.current = clientY;
        dragLastXRef.current = clientX;
        dragAxisLockedRef.current = null;
        return true;
    }, []);

    /**
     * Vráti true ak prebehol horizontálny drag (treba zablokovať default touch scroll).
     * Vráti false ak je gesto vertikálne alebo ešte nepresiahlo threshold.
     */
    const movePointer = useCallback(
        (clientX: number, clientY: number): boolean => {
            const dx = clientX - dragStartXRef.current;
            const dy = clientY - dragStartYRef.current;

            if (dragAxisLockedRef.current === null) {
                if (Math.abs(dx) < AXIS_LOCK_THRESHOLD && Math.abs(dy) < AXIS_LOCK_THRESHOLD) {
                    return false;
                }
                dragAxisLockedRef.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
            }

            // Vertikálny scroll — necháme prejsť na default page scroll.
            if (dragAxisLockedRef.current === "y") {
                return false;
            }

            isDraggingRef.current = true;
            const stepDx = clientX - dragLastXRef.current;
            dragLastXRef.current = clientX;

            // Plynulé sledovanie prsta počas dragu — vizuálny feedback.
            // Skutočný "commit" o jednu kartu prichádza až v endPointer podľa totalDx.
            applyRotation(rotationRef.current + stepDx * DRAG_SENSITIVITY);
            return true;
        },
        [applyRotation]
    );

    const endPointer = useCallback(() => {
        const wasReallyDragging = isDraggingRef.current;
        const totalDx = dragLastXRef.current - dragStartXRef.current;
        isDraggingRef.current = false;
        dragAxisLockedRef.current = null;

        if (wasReallyDragging) {
            // Anuluj nasledujúci klik (swipe končiaci nad kartou by inak otvoril link).
            wasDragRef.current = true;
            if (wasDragTimeoutRef.current) clearTimeout(wasDragTimeoutRef.current);
            wasDragTimeoutRef.current = setTimeout(() => {
                wasDragRef.current = false;
            }, 200);

            // Vždy presne JEDNA karta. Smer podľa znamienka totalDx; ak swipe je príliš
            // krátky (< 30 px), vrátime sa na pôvodnú kartu (no-op snap na najbližší).
            let offset = 0;
            if (Math.abs(totalDx) >= SWIPE_COMMIT_THRESHOLD) {
                offset = totalDx > 0 ? 1 : -1;
            }
            snapBy(offset);

            // Pauzni auto-drift na autoPauseMs a debouncni ďalšie swipe-y na 300 ms.
            const now = performance.now();
            autoResumeAtRef.current = now + autoPauseMs;
            swipeDebounceUntilRef.current = now + 300;
        }
    }, [snapBy, autoPauseMs]);

    // Touch
    const touchActiveRef = useRef(false);
    const onTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length !== 1) return;
        const t = e.touches[0];
        touchActiveRef.current = beginPointer(t.clientX, t.clientY);
    };
    const onTouchMove = (e: React.TouchEvent) => {
        if (!touchActiveRef.current || e.touches.length !== 1) return;
        const t = e.touches[0];
        const wantsDrag = movePointer(t.clientX, t.clientY);
        if (wantsDrag && e.cancelable) {
            e.preventDefault();
        }
    };
    const onTouchEnd = () => {
        if (!touchActiveRef.current) return;
        touchActiveRef.current = false;
        endPointer();
    };

    // Mouse (desktop)
    const isMouseDownRef = useRef(false);
    const onMouseDown = (e: React.MouseEvent) => {
        isMouseDownRef.current = beginPointer(e.clientX, e.clientY);
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

    // Cleanup pri unmount
    useEffect(() => {
        return () => {
            if (wasDragTimeoutRef.current) clearTimeout(wasDragTimeoutRef.current);
            if (snapRafRef.current !== null) cancelAnimationFrame(snapRafRef.current);
        };
    }, []);

    const { radius, cardW, cardH, perspective } = useMemo(
        () => getGeometry(windowWidth),
        [windowWidth]
    );

    // Hover pause iba na desktope.
    const isTouchDevice =
        typeof window !== "undefined" && "ontouchstart" in window;

    return (
        <div
            className="relative w-full h-full flex items-center justify-center select-none"
            style={{ perspective: `${perspective}px`, touchAction: "pan-y" }}
            onMouseEnter={isTouchDevice ? undefined : () => { isHoverPausedRef.current = true; }}
            onMouseLeave={isTouchDevice ? undefined : () => { isHoverPausedRef.current = false; }}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onTouchCancel={onTouchEnd}
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
                    const relative = modAngle(itemAngle + rotation);
                    const normalized = relative > 180 ? 360 - relative : relative;

                    const hidden = normalized > 90;
                    const opacity = hidden ? 0 : Math.max(0.25, 1 - normalized / 90);
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
            {/* Obrázok — 55% výšky karty.
                bg-char-soft slúži ako tmavé letterbox pozadie, lebo Image má object-contain
                (zámerne, aby bolo vidno celý screenshot, nie iba orezaný horný frame). */}
            <div
                className="relative w-full overflow-hidden bg-char-soft"
                style={{ height: "55%" }}
            >
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes={`${cardW}px`}
                    className="object-contain"
                    draggable={false}
                />

                {/* Jemný gradient hore aj dole — splynie obrázok s telom karty.
                    Slabý opacity, nech screenshot zostane čitateľný. */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-char-soft to-transparent" />

                {/* Badge v rohu */}
                {isPrivate ? (
                    <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-char/85 backdrop-blur-md flex items-center justify-center border border-gold/25">
                        <Lock size={13} className="text-gold/80" />
                    </div>
                ) : (
                    <div
                        className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-char/85 backdrop-blur-md flex items-center justify-center border border-gold/25 transition-opacity duration-300 ${
                            isFront ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        <ExternalLink size={13} className="text-gold" />
                    </div>
                )}
            </div>

            {/* Text — spodných 45% karty */}
            <div className="relative h-[45%] p-3 sm:p-4 flex flex-col gap-1 sm:gap-1.5">
                <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-gold/80 truncate">
                    {item.category}
                </span>
                <h3 className="text-sm sm:text-base md:text-lg font-display font-bold text-cream leading-tight truncate">
                    {item.name}
                </h3>
                <p className="text-[10px] sm:text-[11px] md:text-xs text-cream/55 leading-relaxed line-clamp-3 font-light">
                    {item.description}
                </p>
            </div>

            {/* Jemný gold glow na fronte */}
            {isFront && !isPrivate && (
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-2xl"
                    style={{ boxShadow: "0 0 24px rgba(228, 200, 150, 0.18) inset" }}
                />
            )}
        </>
    );

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
        >
            {content}
        </a>
    );
}
