"use client";

import { motion, useReducedMotion } from "framer-motion";

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
    return (
        <motion.svg
            viewBox="0 0 100 100"
            className={`absolute pointer-events-none ${className}`}
            style={{ opacity }}
            animate={reduced ? undefined : { rotate: reverse ? -360 : 360 }}
            transition={reduced ? undefined : { duration, ease: "linear", repeat: Infinity }}
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
