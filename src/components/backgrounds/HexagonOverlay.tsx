"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

function Hex({
    className,
    duration,
    opacity = 0.5,
    strokeWidth = 0.8,
    reverse = false,
}: {
    className: string;
    duration: number;
    opacity?: number;
    strokeWidth?: number;
    reverse?: boolean;
}) {
    const reduced = useReducedMotion();
    // boosted=true → fast initial spin; switches to normal slow rotation after the burst
    const [boosted, setBoosted] = useState(true);

    useEffect(() => {
        if (reduced) {
            setBoosted(false);
            return;
        }
        // Let the fast intro run for ~1.1s, then ease into the normal slow loop.
        const id = setTimeout(() => setBoosted(false), 1100);
        return () => clearTimeout(id);
    }, [reduced]);

    const sign = reverse ? -1 : 1;
    // Fast intro: ~1 turn over 1.1s, then handoff to slow loop.
    const introTransition = { duration: 1.1, ease: "easeOut" as const };
    const loopTransition = { duration, ease: "linear" as const, repeat: Infinity };

    return (
        <motion.svg
            viewBox="0 0 100 100"
            className={`absolute pointer-events-none ${className}`}
            style={{ opacity }}
            animate={
                reduced
                    ? undefined
                    : boosted
                        ? { rotate: sign * 360 }   // 1 turn in 1.1s — quick swoosh
                        : { rotate: sign * 360 }
            }
            transition={reduced ? undefined : boosted ? introTransition : loopTransition}
            aria-hidden="true"
        >
            <path
                d="M50 4 L91 27 L91 73 L50 96 L9 73 L9 27 Z"
                fill="none"
                stroke="#C9A875"
                strokeWidth={strokeWidth}
            />
        </motion.svg>
    );
}

export default function HexagonOverlay() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <Hex
                className="w-[55vw] h-[55vw] -top-[15vw] -left-[15vw]"
                duration={120}
                opacity={0.16}
                strokeWidth={0.4}
            />
            <Hex
                className="w-[40vw] h-[40vw] -bottom-[10vw] -right-[10vw]"
                duration={90}
                opacity={0.14}
                strokeWidth={0.5}
                reverse
            />
            <Hex
                className="w-32 h-32 top-24 right-12"
                duration={50}
                opacity={0.45}
                strokeWidth={1}
            />
            <Hex
                className="w-24 h-24 bottom-32 left-8"
                duration={70}
                opacity={0.4}
                strokeWidth={1}
                reverse
            />
            <Hex
                className="w-[28vw] h-[28vw] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                duration={200}
                opacity={0.06}
                strokeWidth={0.3}
            />
        </div>
    );
}
