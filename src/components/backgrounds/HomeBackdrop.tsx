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
            {/* Twinkling gold particles */}
            <StarField />

            {/* Vertical gold guide lines */}
            <div className="absolute inset-0 gold-vlines opacity-30" />

            {/* Soft ambient glow — top-right */}
            <div
                className="absolute -top-40 -right-40 w-[720px] h-[720px] rounded-full"
                style={{
                    background:
                        "radial-gradient(circle, rgba(201,168,117,0.10) 0%, transparent 65%)",
                }}
            />
            {/* Soft ambient glow — bottom-left */}
            <div
                className="absolute -bottom-40 -left-40 w-[640px] h-[640px] rounded-full"
                style={{
                    background:
                        "radial-gradient(circle, rgba(10,22,40,0.55) 0%, transparent 70%)",
                }}
            />

            {/* Film grain */}
            <GrainOverlay />

            {/* Navbar fade — softens area behind sticky navbar */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-char/80 to-transparent" />
        </div>
    );
}
