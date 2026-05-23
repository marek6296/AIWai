"use client";

import FlowLines from "@/components/backgrounds/FlowLines";
import GrainOverlay from "@/components/backgrounds/GrainOverlay";

/**
 * HomeBackdrop — single fixed-viewport background for the homepage.
 *
 * Sits behind every section as a continuous layer so scrolling does not
 * reveal section seams. Composed of: solid char base, flow-field gold
 * streaks (FlowLines), a single subtle ambient glow, and film grain.
 */
export default function HomeBackdrop() {
    return (
        <div
            aria-hidden="true"
            className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-char"
        >
            {/* Gold flow lines — diagonal streaks drifting across, scroll accelerates */}
            <div className="absolute inset-0">
                <FlowLines />
            </div>

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
