"use client";

import StarField from "@/components/backgrounds/StarField";
import GrainOverlay from "@/components/backgrounds/GrainOverlay";

/**
 * HomeBackdrop — single fixed-viewport background for the homepage.
 *
 * Sits behind every section as a continuous layer so scrolling does not
 * reveal section seams. Composed of: solid char base, twinkling StarField
 * canvas, vertical gold guide lines, two soft radial glows, and film grain.
 */
export default function HomeBackdrop() {
    return (
        <div
            aria-hidden="true"
            className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-char"
        >
            {/* Twinkling gold particles — desktop only; mobile gets a
                static star field via CSS to avoid canvas/rAF overhead. */}
            <div className="hidden md:block absolute inset-0">
                <StarField />
            </div>
            <div
                aria-hidden="true"
                className="md:hidden absolute inset-0 opacity-35"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 12% 18%, rgba(201,168,117,0.55) 0.5px, transparent 1.5px)," +
                        "radial-gradient(circle at 78% 30%, rgba(201,168,117,0.45) 0.5px, transparent 1.5px)," +
                        "radial-gradient(circle at 34% 70%, rgba(201,168,117,0.40) 0.5px, transparent 1.5px)," +
                        "radial-gradient(circle at 88% 82%, rgba(201,168,117,0.50) 0.5px, transparent 1.5px)," +
                        "radial-gradient(circle at 55% 12%, rgba(228,200,150,0.30) 0.5px, transparent 1.5px)," +
                        "radial-gradient(circle at 22% 55%, rgba(228,200,150,0.30) 0.5px, transparent 1.5px)",
                    backgroundSize: "320px 320px",
                    backgroundRepeat: "repeat",
                }}
            />

            {/* Single very subtle ambient glow — top-right only */}
            <div
                className="absolute -top-40 -right-40 w-[560px] h-[560px] rounded-full"
                style={{
                    background:
                        "radial-gradient(circle, rgba(201,168,117,0.025) 0%, transparent 65%)",
                }}
            />

            {/* Film grain */}
            <GrainOverlay />

            {/* Navbar fade — softens area behind sticky navbar */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-char/80 to-transparent" />
        </div>
    );
}
