"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// Framer Motion removed — vanilla JS cursor with RAF for smooth tracking.
export default function CustomCursor() {
    const ringRef = useRef<HTMLDivElement>(null);
    const dotRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(true);
    const [cursorState, setCursorState] = useState<"default" | "hover" | "text" | "hidden">("default");

    // Smooth ring position with lerp
    const target = useRef({ x: -100, y: -100 });
    const current = useRef({ x: -100, y: -100 });
    const rafId = useRef<number | null>(null);
    const lastHoverTime = useRef(0);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = useCallback(() => {
        current.current.x = lerp(current.current.x, target.current.x, 0.18);
        current.current.y = lerp(current.current.y, target.current.y, 0.18);
        if (ringRef.current) {
            ringRef.current.style.transform = `translate(${current.current.x}px, ${current.current.y}px) translate(-50%, -50%)`;
        }
        rafId.current = requestAnimationFrame(animate);
    }, []);

    const handleMouseOver = useCallback((e: MouseEvent) => {
        const now = performance.now();
        if (now - lastHoverTime.current < 16) return;
        lastHoverTime.current = now;
        const t = e.target as HTMLElement;
        const interactive = t.closest("a, button, [role='button'], input, textarea, select");
        const textBlock = !interactive && t.closest("p, h1, h2, h3, h4, h5, h6, span, li, label");
        setCursorState(interactive ? "hover" : textBlock ? "text" : "default");
    }, []);

    useEffect(() => {
        const mq = window.matchMedia("(pointer: fine) and (min-width: 769px)");
        setIsMobile(!mq.matches);
        const onChange = (e: MediaQueryListEvent) => setIsMobile(!e.matches);
        mq.addEventListener("change", onChange);

        const onMove = (e: MouseEvent) => {
            target.current = { x: e.clientX, y: e.clientY };
            if (dotRef.current) dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
        };
        const onLeave = () => setCursorState("hidden");
        const onEnter = () => setCursorState("default");

        window.addEventListener("mousemove", onMove, { passive: true });
        document.addEventListener("mouseover", handleMouseOver, { passive: true });
        document.documentElement.addEventListener("mouseleave", onLeave);
        document.documentElement.addEventListener("mouseenter", onEnter);
        rafId.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseover", handleMouseOver);
            document.documentElement.removeEventListener("mouseleave", onLeave);
            document.documentElement.removeEventListener("mouseenter", onEnter);
            mq.removeEventListener("change", onChange);
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, [animate, handleMouseOver]);

    if (isMobile) return null;

    const sizeMap = { default: 36, hover: 56, text: 4, hidden: 0 };
    const opacityMap = { default: 1, hover: 1, text: 0.5, hidden: 0 };
    const ringSize = sizeMap[cursorState];
    const dotSize = cursorState === "hidden" ? 0 : cursorState === "hover" ? 4 : 6;

    return (
        <>
            <style>{`*, *::before, *::after { cursor: none !important; }`}</style>
            {/* Outer ring with lerp lag */}
            <div
                ref={ringRef}
                className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference rounded-full border border-white"
                style={{
                    width: ringSize,
                    height: ringSize,
                    opacity: opacityMap[cursorState],
                    background: cursorState === "hover" ? "rgba(255,255,255,0.06)" : "transparent",
                    transition: "width 0.15s ease, height 0.15s ease, opacity 0.15s ease",
                    willChange: "transform",
                    marginLeft: -ringSize / 2,
                    marginTop: -ringSize / 2,
                }}
            />
            {/* Inner dot — instant follow */}
            <div
                ref={dotRef}
                className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference rounded-full bg-white"
                style={{
                    width: dotSize,
                    height: dotSize,
                    opacity: cursorState === "hidden" ? 0 : 1,
                    transition: "width 0.1s ease, height 0.1s ease, opacity 0.1s ease",
                    willChange: "transform",
                }}
            />
        </>
    );
}
