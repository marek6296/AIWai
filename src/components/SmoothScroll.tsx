"use client";
import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
    // useEffect (not useLayoutEffect) — lets browser paint first frame before
    // Lenis initialises. Critical for Safari where useLayoutEffect delays FCP.
    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 2.5,
            smoothWheel: true,
        });

        (window as unknown as { __lenis: typeof lenis }).__lenis = lenis;

        let rafId: number;
        function raf(time: number) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, []);

    return null;
}
