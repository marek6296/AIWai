"use client";

/**
 * CircularGallery — 3D rotujúca galéria projektov.
 *
 * Karty sú rozmiestnené po obvode kruhu okolo Y-osi (rotateY + translateZ).
 * Rotácia má dva zdroje:
 *   • scroll užívateľa (rotácia mapovaná na scrollY / scrollableHeight)
 *   • jemný auto-rotate keď scroll stojí
 *
 * Karty oproti používateľovi sú plne viditeľné, karty na druhej strane
 * sú stmavnuté (opacity klesá s uhlovou vzdialenosťou od kamery).
 *
 * Mobile responsive: radius a veľkosť kariet sa prispôsobí šírke okna.
 */

import { useState, useEffect, useRef, useMemo } from "react";
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
    /** Po koľkých ms od posledného scrollu sa pustí auto-rotate (default 200). */
    scrollIdleMs?: number;
}

/**
 * Vypočíta optimálne rozmery podľa šírky okna.
 * Mobile: malé karty + malý radius (lebo viewport je úzky).
 * Desktop: veľké karty + veľký radius (viac drámy).
 */
function getGeometry(width: number) {
    if (width < 640) {
        return { radius: 230, cardW: 180, cardH: 240, perspective: 1200 };
    }
    if (width < 1024) {
        return { radius: 380, cardW: 240, cardH: 320, perspective: 1600 };
    }
    return { radius: 560, cardW: 300, cardH: 400, perspective: 2000 };
}

export default function CircularGallery({
    items,
    autoRotateSpeed = 0.025,
    scrollIdleMs = 200,
}: Props) {
    const [rotation, setRotation] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const [isHoverPaused, setIsHoverPaused] = useState(false);
    const [windowWidth, setWindowWidth] = useState<number>(
        typeof window === "undefined" ? 1280 : window.innerWidth
    );

    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const rafRef = useRef<number | null>(null);

    // ─── Mapuj rotáciu na vertikálny scroll dokumentu ───
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolling(true);
            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
            setRotation(progress * 360);

            scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), scrollIdleMs);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        // Inicializácia z aktuálneho scroll-u (napr. pri F5 v strede stránky).
        handleScroll();
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        };
    }, [scrollIdleMs]);

    // ─── Sleduj šírku okna pre responsívny radius ───
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // ─── Auto-rotácia keď user nescrolluje a nehoveruje ───
    useEffect(() => {
        const tick = () => {
            if (!isScrolling && !isHoverPaused) {
                setRotation((prev) => prev + autoRotateSpeed);
            }
            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [isScrolling, isHoverPaused, autoRotateSpeed]);

    const { radius, cardW, cardH, perspective } = useMemo(
        () => getGeometry(windowWidth),
        [windowWidth]
    );

    const anglePerItem = items.length > 0 ? 360 / items.length : 0;

    return (
        <div
            className="relative w-full h-full flex items-center justify-center select-none"
            style={{ perspective: `${perspective}px` }}
            onMouseEnter={() => setIsHoverPaused(true)}
            onMouseLeave={() => setIsHoverPaused(false)}
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
                    const relative = (itemAngle + (rotation % 360) + 360) % 360;
                    const normalized = relative > 180 ? 360 - relative : relative;
                    // Karty za sebou stmavnuté, predné plne viditeľné.
                    const opacity = Math.max(0.18, 1 - normalized / 180);
                    const isFront = normalized < 30;

                    return (
                        <GalleryCard
                            key={item.slug}
                            item={item}
                            angle={itemAngle}
                            radius={radius}
                            cardW={cardW}
                            cardH={cardH}
                            opacity={opacity}
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
    isFront: boolean;
}

function GalleryCard({ item, angle, radius, cardW, cardH, opacity, isFront }: CardProps) {
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
        // Tieto transitions nesmú zasiahnuť `transform` — to riadi parent rotácia.
        transition: "opacity 0.3s linear, box-shadow 0.4s ease",
        boxShadow: isFront
            ? "0 30px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,117,0.35) inset, 0 0 40px rgba(201,168,117,0.15)"
            : "0 20px 50px -25px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,237,220,0.08) inset",
        backfaceVisibility: "hidden",
    };

    const cardClass =
        "absolute rounded-2xl overflow-hidden backdrop-blur-md bg-gradient-to-b from-char/40 to-char-soft/95 border border-gold/20";

    const content = (
        <>
            {/* Obrázok — vrchné 2/3 karty */}
            <div className="relative w-full" style={{ height: "62%" }}>
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes={`${cardW}px`}
                    className="object-cover object-top"
                    draggable={false}
                    // Pre 3D rotáciu nemá zmysel priorita — server lazy-loaduje.
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

            {/* Text — spodná 1/3 karty */}
            <div className="relative h-[38%] p-4 flex flex-col gap-1.5">
                <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-gold/80 truncate">
                    {item.category}
                </span>
                <h3 className="text-base md:text-lg font-display font-bold text-cream leading-tight truncate">
                    {item.name}
                </h3>
                <p className="text-[11px] md:text-xs text-cream/55 leading-relaxed line-clamp-2 font-light">
                    {item.description}
                </p>
            </div>

            {/* Jemný gold glow na fronte — naznačuje že "ide klik" */}
            {isFront && !isPrivate && (
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-2xl"
                    style={{
                        boxShadow: "0 0 24px rgba(228, 200, 150, 0.18) inset",
                    }}
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
            >
                {content}
            </div>
        );
    }

    // Klikateľné karty otvárajú projekt v novej karte. Backside karty (isFront=false)
    // sa stále dajú klinúť, ale zámerne necháme pointer-events lebo počas auto-rotácie
    // sa otáčajú a používateľ ich uvidí v fronte za chvíľu.
    return (
        <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${cardClass} block hover:border-gold/60 transition-colors duration-300`}
            style={sharedStyle}
            aria-label={`${item.name} — open project in new tab`}
        >
            {content}
        </a>
    );
}
