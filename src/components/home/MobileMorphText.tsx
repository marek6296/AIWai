"use client";

import { useEffect, useState } from "react";

interface MobileMorphTextProps {
    words: string[];
    /** ms each word stays before morphing to the next */
    interval?: number;
    className?: string;
    textClassName?: string;
}

/**
 * MobileMorphText — the phone-native headline morph.
 *
 * Why not the desktop <GooeyText>:
 *  - GooeyText leans on an SVG threshold filter + per-frame blur up to ~100px.
 *    On mobile Safari that either stutters or, on the small phone headline,
 *    swallows the word into a blob and pops the next one in — it reads as a
 *    hard "it just changes", not a melt.
 *
 * How this works instead:
 *  - All words are stacked in one grid cell (no reflow, no layout thrash) and
 *    only ONE is ever active. State changes just flip CSS classes; the browser
 *    runs the tween on the compositor.
 *  - The morph is built from opacity + scale (both GPU-accelerated) plus a
 *    gentle, short blur as the "melt" accent. The outgoing word dissolves and
 *    expands outward while the incoming word condenses into focus and sharpens
 *    — they cross in the middle, reading as a smooth premium melt close to the
 *    desktop gooey, but at a rock-solid 60fps on phones.
 *  - Exactly N stable DOM nodes — nothing mounts/unmounts mid-animation, so no
 *    ghost words or lingering smudge. Honors prefers-reduced-motion via CSS.
 */
export default function MobileMorphText({
    words,
    interval = 1900,
    className,
    textClassName,
}: MobileMorphTextProps) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const id = window.setInterval(() => {
            setIndex((v) => (v + 1) % words.length);
        }, interval);
        return () => window.clearInterval(id);
    }, [words.length, interval]);

    return (
        <div
            className={`mm-stage relative grid w-full place-items-center ${className ?? ""}`}
            aria-label={words.join(", ")}
        >
            {words.map((word, i) => (
                <span
                    key={word}
                    aria-hidden={i !== index}
                    data-active={i === index ? "true" : "false"}
                    className={`mm-word ${textClassName ?? ""}`}
                >
                    {word}
                </span>
            ))}
        </div>
    );
}
