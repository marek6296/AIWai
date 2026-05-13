"use client";
import { useEffect, useRef } from "react";

/** Thin scroll-progress bar — vanilla JS, gold accent. */
export default function ScrollProgress() {
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const bar = barRef.current;
        if (!bar) return;

        const update = () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            const progress = scrollTop / Math.max(scrollHeight - clientHeight, 1);
            bar.style.transform = `scaleX(${progress})`;
            bar.style.opacity = scrollTop > 100 ? "1" : "0";
        };

        update();
        window.addEventListener("scroll", update, { passive: true });
        return () => window.removeEventListener("scroll", update);
    }, []);

    return (
        <div
            ref={barRef}
            className="fixed top-0 left-0 right-0 h-[1.5px] bg-gold z-[101] origin-left"
            style={{ transform: "scaleX(0)", opacity: 0, transition: "opacity 0.3s ease" }}
        />
    );
}
