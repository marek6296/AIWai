"use client";
import { useLayoutEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
    useLayoutEffect(() => {
        // 1. Immediate intervention: Force scroll back to top before first paint
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 2.5,
            smoothWheel: true,
        });

        // Expose lenis globally so Navbar and other components can use it
        (window as unknown as { __lenis: typeof lenis }).__lenis = lenis;

        lenis.scrollTo(0, { immediate: true });

        let rafId: number;
        function raf(time: number) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);

        // 2. Secondary check to catch edge cases during hydration
        const timer = setTimeout(() => {
            window.scrollTo(0, 0);
            lenis.scrollTo(0, { immediate: true });
        }, 0);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
            clearTimeout(timer);
        };
    }, []);

    return null;
}
