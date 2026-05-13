"use client";

import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function GridLines() {
    const positions = ["0%", "16.6667%", "33.3333%", "50%", "66.6667%", "83.3333%", "100%"];

    return (
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
            <div className="relative max-w-7xl mx-auto h-full px-4 md:px-8">
                {positions.map((left, i) => (
                    <motion.span
                        key={i}
                        initial={{ scaleY: 0, opacity: 0 }}
                        animate={{ scaleY: 1, opacity: 1 }}
                        transition={{ duration: 1.4, ease: EASE, delay: 0.2 + i * 0.06 }}
                        style={{ originY: 0, left }}
                        className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/15 to-transparent"
                    />
                ))}
            </div>
        </div>
    );
}
