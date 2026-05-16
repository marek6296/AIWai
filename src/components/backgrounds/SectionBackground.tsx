"use client";

import HexagonOverlay from "@/components/backgrounds/HexagonOverlay";
import GrainOverlay from "@/components/backgrounds/GrainOverlay";

type Variant = "default" | "soft" | "footer";

/**
 * SectionBackground — reusable hero-style animated overlay for dark sections.
 *
 * Variants:
 *  - default: full hero feel (rotating hexagons + grain + radial glows + gold vlines)
 *  - soft:    lighter feel (no rotating hexagons, just glows + grain + vlines)
 *  - footer:  even lighter, top-fade to blend from contact section
 *
 * Performance:
 *  - HexagonOverlay uses 5 SVGs with framer-motion. Keep it on a single section per "burst".
 *  - Grain + gold-vlines are static CSS, free.
 */
export default function SectionBackground({
    variant = "default",
    topFade = true,
    bottomFade = false,
}: {
    variant?: Variant;
    topFade?: boolean;
    bottomFade?: boolean;
}) {
    const showHex = variant === "default";

    return (
        <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{ transform: "translateZ(0)", willChange: "transform" }}
        >
            {/* Static gold vertical guide lines (matches Process / CTA sections) */}
            <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none gold-vlines opacity-40"
            />

            {/* Rotating hexagons */}
            {showHex && <HexagonOverlay />}

            {/* Radial glows */}
            <div
                aria-hidden="true"
                className="absolute -top-40 -right-40 w-[640px] h-[640px] rounded-full pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle, rgba(201,168,117,0.12) 0%, transparent 65%)",
                }}
            />
            <div
                aria-hidden="true"
                className="absolute -bottom-40 -left-40 w-[560px] h-[560px] rounded-full pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle, rgba(201,168,117,0.08) 0%, transparent 65%)",
                }}
            />
            <div
                aria-hidden="true"
                className="absolute top-1/3 left-1/3 w-[480px] h-[480px] rounded-full pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle, rgba(228,200,150,0.05) 0%, transparent 70%)",
                }}
            />

            {/* Grain — sits above glows for that film-like texture */}
            <GrainOverlay />

            {/* Soft section seams — fade to char so sections blend visually */}
            {topFade && (
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-char/80 to-transparent pointer-events-none"
                />
            )}
            {bottomFade && (
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-char/80 to-transparent pointer-events-none"
                />
            )}
        </div>
    );
}
