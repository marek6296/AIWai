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
            {/* Rotating hexagons */}
            {showHex && <HexagonOverlay />}

            {/* Single subtle radial glow */}
            <div
                aria-hidden="true"
                className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle, rgba(201,168,117,0.035) 0%, transparent 65%)",
                }}
            />

            {/* Grain — sits above glows for that film-like texture */}
            <GrainOverlay />

            {/* Soft section seams — fade to char so sections blend visually */}
            {topFade && (
                <div
                    aria-hidden="true"
                    className="hidden md:block absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-char/80 to-transparent pointer-events-none"
                />
            )}
            {bottomFade && (
                <div
                    aria-hidden="true"
                    className="hidden md:block absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-char/80 to-transparent pointer-events-none"
                />
            )}
        </div>
    );
}
