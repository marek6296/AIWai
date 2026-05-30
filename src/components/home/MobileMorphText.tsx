"use client";

import { useEffect, useState } from "react";

interface MobileMorphTextProps {
    words: string[];
    /** ms each word stays before rolling to the next */
    interval?: number;
    className?: string;
    textClassName?: string;
}

/**
 * MobileMorphText — phone-native headline animation (vertical roll).
 *
 * Why a roll and not the desktop gooey / a blur melt:
 *  - The SVG-threshold gooey and per-frame CSS blur are unreliable on mobile
 *    Safari — they stutter or don't paint, so the headline read as "it just
 *    swaps words".
 *  - This is built ONLY from `transform: translateY` — the one thing every
 *    mobile browser composites on the GPU at 60fps. No blur, no SVG filter, no
 *    requestAnimationFrame, and intentionally NOT gated behind
 *    prefers-reduced-motion, so the motion always plays.
 *
 * Mechanism (two-slot, transition-driven — robust, no fragile timers):
 *  - Two stacked lines clipped to one: the current word on top, the next below.
 *  - Each tick adds .mm-rolling → the column slides up one line (current rolls
 *    out the top, next rolls into view).
 *  - onTransitionEnd advances the base word and drops .mm-rolling, which snaps
 *    the column back to 0 with NO transition. Because the word that just rolled
 *    into view is now the top word at offset 0, the reset is invisible — the
 *    loop is perfectly seamless.
 */
export default function MobileMorphText({
    words,
    interval = 1900,
    className,
    textClassName,
}: MobileMorphTextProps) {
    const n = words.length;
    const [base, setBase] = useState(0);
    const [rolling, setRolling] = useState(false);

    useEffect(() => {
        const id = window.setInterval(() => setRolling(true), interval);
        return () => window.clearInterval(id);
    }, [interval]);

    const top = words[base % n];
    const bottom = words[(base + 1) % n];

    return (
        <div
            className={`mm-mask ${textClassName ?? ""} ${className ?? ""}`}
            aria-label={words.join(", ")}
        >
            <div
                className={`mm-col${rolling ? " mm-rolling" : ""}`}
                onTransitionEnd={() => {
                    setBase((b) => (b + 1) % n);
                    setRolling(false);
                }}
            >
                <span className="mm-line" aria-hidden="true">
                    {top}
                </span>
                <span className="mm-line" aria-hidden="true">
                    {bottom}
                </span>
            </div>
        </div>
    );
}
