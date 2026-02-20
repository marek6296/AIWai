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
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 2,
        });

        lenis.scrollTo(0, { immediate: true });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // 2. Secondary check to catch edge cases during hydration
        const timer = setTimeout(() => {
            window.scrollTo(0, 0);
            lenis.scrollTo(0, { immediate: true });
        }, 0);

        return () => {
            lenis.destroy();
            clearTimeout(timer);
        };
    }, []);

    return null;
}
