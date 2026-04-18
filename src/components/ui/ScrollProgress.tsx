"use client";
import { useEffect, useRef } from "react";

/** Thin scroll-progress bar — vanilla JS, no Framer Motion. */
export default function ScrollProgress() {
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const bar = barRef.current;
        if (!bar) return;

        const update = () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            const progress = scrollTop / Math.max(scrollHeight - clientHeight, 1);
            bar.style.transform = `scaleX(${progress})`;
            bar.style.opacity = scrollTop > 200 ? "1" : "0";
        };

        window.addEventListener("scroll", update, { passive: true });
        return () => window.removeEventListener("scroll", update);
    }, []);

    return (
        <div
            ref={barRef}
            className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-sand via-brand-indigo/40 to-brand-sand z-[101] origin-left"
            style={{ transform: "scaleX(0)", opacity: 0, transition: "opacity 0.3s ease" }}
        />
    );
}
