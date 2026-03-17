"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const dotX = useMotionValue(-100);
    const dotY = useMotionValue(-100);

    // Smooth spring for the outer ring
    const springX = useSpring(cursorX, { damping: 28, stiffness: 220, mass: 0.5 });
    const springY = useSpring(cursorY, { damping: 28, stiffness: 220, mass: 0.5 });

    const [cursorState, setCursorState] = useState<"default" | "hover" | "text" | "hidden">("default");
    const [isMobile, setIsMobile] = useState(true); // start hidden

    // Throttled mouseover — only fire at ~60fps to avoid layout thrash
    const lastHoverTime = useRef(0);

    const handleMouseOver = useCallback((e: MouseEvent) => {
        const now = performance.now();
        // Skip if we already updated within 16ms
        if (now - lastHoverTime.current < 16) return;
        lastHoverTime.current = now;

        const target = e.target as HTMLElement;
        const interactive = target.closest("a, button, [role='button'], input, textarea, select, [data-cursor='pointer']");
        const textBlock = !interactive && target.closest("p, h1, h2, h3, h4, h5, h6, span, li, label");

        if (interactive) {
            setCursorState("hover");
        } else if (textBlock) {
            setCursorState("text");
        } else {
            setCursorState("default");
        }
    }, []);

    useEffect(() => {
        // Only show custom cursor on desktop
        const mq = window.matchMedia("(pointer: fine) and (min-width: 769px)");
        setIsMobile(!mq.matches);

        const handleChange = (e: MediaQueryListEvent) => setIsMobile(!e.matches);
        mq.addEventListener("change", handleChange);

        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            dotX.set(e.clientX);
            dotY.set(e.clientY);
        };

        const handleMouseLeave = () => setCursorState("hidden");
        const handleMouseEnter = () => setCursorState("default");

        window.addEventListener("mousemove", moveCursor, { passive: true });
        document.addEventListener("mouseover", handleMouseOver, { passive: true });
        document.documentElement.addEventListener("mouseleave", handleMouseLeave);
        document.documentElement.addEventListener("mouseenter", handleMouseEnter);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            document.removeEventListener("mouseover", handleMouseOver);
            document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
            document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
            mq.removeEventListener("change", handleChange);
        };
    }, [cursorX, cursorY, dotX, dotY, handleMouseOver]);

    if (isMobile) return null;

    const sizeMap = {
        default: 36,
        hover: 56,
        text: 4,
        hidden: 0,
    };

    const opacityMap = {
        default: 1,
        hover: 1,
        text: 0.5,
        hidden: 0,
    };

    const ringSize = sizeMap[cursorState];
    const dotSize = cursorState === "hidden" ? 0 : cursorState === "hover" ? 4 : 6;

    return (
        <>
            {/* Global style to hide the default cursor */}
            <style jsx global>{`
                *, *::before, *::after {
                    cursor: none !important;
                }
            `}</style>

            {/* Outer ring — follows with spring lag */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    x: springX,
                    y: springY,
                    translateX: "-50%",
                    translateY: "-50%",
                    willChange: "transform",
                }}
            >
                <motion.div
                    animate={{
                        width: ringSize,
                        height: ringSize,
                        opacity: opacityMap[cursorState],
                    }}
                    transition={{
                        type: "spring",
                        damping: 22,
                        stiffness: 320,
                        mass: 0.3,
                    }}
                    className="rounded-full border border-white"
                    style={{
                        background: cursorState === "hover"
                            ? "rgba(255, 255, 255, 0.06)"
                            : "transparent",
                        willChange: "width, height, opacity",
                    }}
                />
            </motion.div>

            {/* Inner dot — follows instantly */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    x: dotX,
                    y: dotY,
                    translateX: "-50%",
                    translateY: "-50%",
                    willChange: "transform",
                }}
            >
                <motion.div
                    animate={{
                        width: dotSize,
                        height: dotSize,
                        opacity: cursorState === "hidden" ? 0 : 1,
                    }}
                    transition={{ duration: 0.12 }}
                    className="rounded-full bg-white"
                    style={{ willChange: "width, height, opacity" }}
                />
            </motion.div>
        </>
    );
}
