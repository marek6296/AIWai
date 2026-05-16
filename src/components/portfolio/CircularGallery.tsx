"use client";

/**
 * CircularGallery — verejné API.
 *
 * Na mobile (< 640 px) vyrenderuje plochý horizontálny karusel s CSS scroll-snap
 * (`MobileFlatCarousel`). 3D rotujúca galéria sa pri 320–414 px viewportoch
 * správa nespoľahlivo — bočné karty pretkávajú alebo sa orezávajú aj pri tesnej
 * geometrii. Plochý karusel je predvídateľný a používa natívny iOS-style scroll.
 *
 * Na desktope (≥ 640 px) renderuje pôvodnú 3D `Circular3DGallery` s rotateY +
 * translateZ kartami, auto-driftom a snap-to-card swipe gestom.
 *
 * Detekcia: jediný hook v hornom komponente sleduje `window.innerWidth` a
 * podľa neho rozhoduje, ktorý sub-komponent sa namountuje. Sub-komponenty nezdieľajú
 * stav, takže prepnutie pri resize jednoducho zhasne jeden a rozsvieti druhý.
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
    /** Rýchlosť plynulého auto-driftu v stupňoch za frame (default 0.012). Iba desktop. */
    autoDriftSpeed?: number;
    /** Trvanie snap animácie v ms (default 450). Iba desktop. */
    snapDurationMs?: number;
    /** Pauza auto-driftu po manuálnom swipe v ms (default 5000). */
    autoPauseMs?: number;
}

const MOBILE_BREAKPOINT = 640;

export default function CircularGallery(props: Props) {
    // SSR-safe default — keď ešte nepoznáme šírku, predpokladáme desktop.
    // Na klientovi sa hneď po mount-e updatne.
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const update = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    if (isMobile) {
        return <MobileFlatCarousel items={props.items} autoPauseMs={props.autoPauseMs ?? 5000} />;
    }
    return <Circular3DGallery {...props} />;
}

/* ═════════════════════════════════════════════════════════════════════════════
   MOBILE — flat horizontal carousel s natívnym CSS scroll-snap
   ═════════════════════════════════════════════════════════════════════════════ */

interface MobileProps {
    items: GalleryItem[];
    autoPauseMs: number;
}

function MobileFlatCarousel({ items, autoPauseMs }: MobileProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    // Timestamp poslednej user interakcie — auto-advance ho rešpektuje.
    const lastInteractRef = useRef(0);

    // Auto-advance: každých 5 s posunie scroll o jednu kartu, pri konci wrap na začiatok.
    useEffect(() => {
        const interval = setInterval(() => {
            const el = scrollRef.current;
            if (!el) return;
            // Ak user nedávno interagoval, dopraj mu čas na čítanie karty.
            if (performance.now() - lastInteractRef.current < autoPauseMs) return;

            const firstCard = el.firstElementChild as HTMLElement | null;
            if (!firstCard) return;
            const styles = getComputedStyle(el);
            const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;
            const step = firstCard.offsetWidth + gap;

            const maxLeft = el.scrollWidth - el.clientWidth;
            const next = el.scrollLeft + step;
            if (next > maxLeft - 4) {
                // Na konci sa vrátime na začiatok cez krátky reset (bez smooth, aby to nebol
                // 10 s spätný "presun"); user to zaregistruje ako jemný cykel.
                el.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                el.scrollTo({ left: next, behavior: "smooth" });
            }
        }, 4500);

        return () => clearInterval(interval);
    }, [autoPauseMs]);

    // Označ user interakciu pri každom touch / wheel / pointer geste.
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const mark = () => {
            lastInteractRef.current = performance.now();
        };
        el.addEventListener("touchstart", mark, { passive: true });
        el.addEventListener("wheel", mark, { passive: true });
        el.addEventListener("pointerdown", mark);
        return () => {
            el.removeEventListener("touchstart", mark);
            el.removeEventListener("wheel", mark);
            el.removeEventListener("pointerdown", mark);
        };
    }, []);

    return (
        <div
            className="relative w-full h-full flex items-center"
            style={{ maxWidth: "100vw" }}
        >
            <div
                ref={scrollRef}
                className="w-full overflow-x-auto overflow-y-hidden flex gap-3"
                style={{
                    // Skry scrollbar — Firefox + IE; iOS Safari aj tak zobrazí overlay scrollbar.
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    // CSS scroll-snap — natívny iOS-style snap na každú kartu pri swipe-e.
                    // scrollSnapStop:'always' znamená že rýchly flick neprejde viac kariet naraz.
                    scrollSnapType: "x mandatory",
                    scrollSnapStop: "always",
                    WebkitOverflowScrolling: "touch",
                    // Padding zaručí, že prvá a posledná karta sa dajú centrovať.
                    // 7.5vw na oboch stranách = každá karta má rovnaký peek susedov.
                    paddingLeft: "7.5vw",
                    paddingRight: "7.5vw",
                    scrollPaddingLeft: "7.5vw",
                    scrollPaddingRight: "7.5vw",
                }}
            >
                {items.map((item) => (
                    <MobileCard key={item.slug} item={item} />
                ))}
            </div>
        </div>
    );
}

function MobileCard({ item }: { item: GalleryItem }) {
    const isPrivate = !!item.private;

    const inner = (
        <>
            {/* Obrázok — aspect 3:2, object-contain s tmavým letterbox pozadím */}
            <div className="relative w-full bg-char-soft" style={{ aspectRatio: "3 / 2" }}>
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="85vw"
                    className="object-contain"
                    draggable={false}
                />
                {/* Subtílny prechod do tela karty */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-char-soft to-transparent" />

                {isPrivate ? (
                    <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-char/85 backdrop-blur-md flex items-center justify-center border border-gold/25">
                        <Lock size={13} className="text-gold/80" />
                    </div>
                ) : (
                    <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-char/85 backdrop-blur-md flex items-center justify-center border border-gold/25">
                        <ExternalLink size={13} className="text-gold" />
                    </div>
                )}
            </div>

            {/* Text */}
            <div className="p-4 flex flex-col gap-1.5">
                <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-gold/80 truncate">
                    {item.category}
                </span>
                <h3 className="text-base font-display font-bold text-cream leading-tight truncate">
                    {item.name}
                </h3>
                <p className="text-xs text-cream/60 leading-relaxed line-clamp-3 font-light">
                    {item.description}
                </p>
            </div>
        </>
    );

    // flex-shrink-0 + scroll-snap-align center → karta sa odsadí do stredu pri snap-e.
    const sharedStyle: React.CSSProperties = {
        scrollSnapAlign: "center",
        flexShrink: 0,
        width: "85vw",
        maxWidth: "320px",
    };
    const sharedClass =
        "rounded-2xl overflow-hidden bg-gradient-to-b from-char/40 to-char-soft/95 border border-gold/20 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]";

    if (isPrivate) {
        return (
            <div
                style={sharedStyle}
                className={sharedClass}
                role="img"
                aria-label={`${item.name} — private project`}
            >
                {inner}
            </div>
        );
    }

    return (
        <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            style={sharedStyle}
            className={`${sharedClass} block`}
            aria-label={`${item.name} — open project in new tab`}
        >
            {inner}
        </a>
    );
}

/* ═════════════════════════════════════════════════════════════════════════════
   DESKTOP — 3D circular gallery
   ═════════════════════════════════════════════════════════════════════════════
   Karty po obvode kruhu okolo Y osi. Snap-to-card swipe + plynulý auto-drift.
   Karty s uhlom od kamery > 90° sa skryjú (visibility:hidden) aby neprekrývali predné.
*/

function getGeometry(width: number) {
    if (width < 1024) {
        return { radius: 480, cardW: 260, cardH: 300, perspective: 1600 };
    }
    return { radius: 640, cardW: 340, cardH: 380, perspective: 2000 };
}

function modAngle(deg: number): number {
    return ((deg % 360) + 360) % 360;
}

function easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
}

function Circular3DGallery({
    items,
    autoDriftSpeed = 0.012,
    snapDurationMs = 450,
    autoPauseMs = 5000,
}: Props) {
    const [rotation, setRotation] = useState(0);
    const rotationRef = useRef(0);
    const [windowWidth, setWindowWidth] = useState<number>(
        typeof window === "undefined" ? 1280 : window.innerWidth
    );

    const isDraggingRef = useRef(false);
    const isHoverPausedRef = useRef(false);
    const isAnimatingRef = useRef(false);
    const snapRafRef = useRef<number | null>(null);
    const driftRafRef = useRef<number | null>(null);
    const autoResumeAtRef = useRef(0);
    const swipeDebounceUntilRef = useRef(0);

    const dragStartXRef = useRef(0);
    const dragStartYRef = useRef(0);
    const dragLastXRef = useRef(0);
    const dragAxisLockedRef = useRef<"x" | "y" | null>(null);
    const wasDragRef = useRef(false);
    const wasDragTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const anglePerItem = items.length > 0 ? 360 / items.length : 0;
    const anglePerItemRef = useRef(anglePerItem);
    anglePerItemRef.current = anglePerItem;

    const applyRotation = useCallback((next: number) => {
        rotationRef.current = next;
        setRotation(next);
    }, []);

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

    const snapBy = useCallback(
        (offsetSteps: number) => {
            const step = anglePerItemRef.current;
            if (step === 0) return;
            const nearest = Math.round(rotationRef.current / step) * step;
            animateTo(nearest + offsetSteps * step);
        },
        [animateTo]
    );

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Plynulý auto-drift — pauzne počas drag/hover/animácie/po-swipe okna.
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

    const AXIS_LOCK_THRESHOLD = 8;
    const DRAG_SENSITIVITY = 0.4;
    const SWIPE_COMMIT_THRESHOLD = 30;

    const beginPointer = useCallback((clientX: number, clientY: number): boolean => {
        if (performance.now() < swipeDebounceUntilRef.current) return false;
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

            if (dragAxisLockedRef.current === "y") return false;

            isDraggingRef.current = true;
            const stepDx = clientX - dragLastXRef.current;
            dragLastXRef.current = clientX;
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
            wasDragRef.current = true;
            if (wasDragTimeoutRef.current) clearTimeout(wasDragTimeoutRef.current);
            wasDragTimeoutRef.current = setTimeout(() => {
                wasDragRef.current = false;
            }, 200);

            let offset = 0;
            if (Math.abs(totalDx) >= SWIPE_COMMIT_THRESHOLD) {
                offset = totalDx > 0 ? 1 : -1;
            }
            snapBy(offset);

            const now = performance.now();
            autoResumeAtRef.current = now + autoPauseMs;
            swipeDebounceUntilRef.current = now + 300;
        }
    }, [snapBy, autoPauseMs]);

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
        if (wantsDrag && e.cancelable) e.preventDefault();
    };
    const onTouchEnd = () => {
        if (!touchActiveRef.current) return;
        touchActiveRef.current = false;
        endPointer();
    };

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

    const isTouchDevice = typeof window !== "undefined" && "ontouchstart" in window;

    return (
        <div
            className="relative w-full h-full flex items-center justify-center select-none overflow-hidden"
            style={{
                perspective: `${perspective}px`,
                touchAction: "pan-y",
                maxWidth: "100vw",
            }}
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
                        <GalleryCard3D
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

interface CardProps3D {
    item: GalleryItem;
    angle: number;
    radius: number;
    cardW: number;
    cardH: number;
    opacity: number;
    hidden: boolean;
    isFront: boolean;
}

function GalleryCard3D({
    item, angle, radius, cardW, cardH, opacity, hidden, isFront,
}: CardProps3D) {
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
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-char-soft to-transparent" />

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
