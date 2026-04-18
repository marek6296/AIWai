"use client";
import { useRef, useEffect, useState } from "react";

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    direction?: "up" | "down" | "left" | "right";
    delay?: number;
    duration?: number;
    distance?: number;
    once?: boolean;
}

export default function ScrollReveal({
    children,
    className = "",
    direction = "up",
    delay = 0,
    duration = 0.65,
    distance = 22,
    once = true,
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);

    // Detect mobile / reduced-motion synchronously on first render.
    // This component is always client-only (parent sections use ssr:false),
    // so window is always defined here.
    const [skipAnimation] = useState(() => {
        if (typeof window === "undefined") return true;
        return (
            window.innerWidth < 768 ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        );
    });

    useEffect(() => {
        const el = ref.current;
        if (!el || skipAnimation) return;

        const dirMap = {
            up:    { y: distance, x: 0 },
            down:  { y: -distance, x: 0 },
            left:  { x: distance, y: 0 },
            right: { x: -distance, y: 0 },
        };
        const from = dirMap[direction];

        let tween: { kill: () => void; scrollTrigger?: { kill: () => void } } | undefined;

        const init = async () => {
            const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
                import("gsap"),
                import("gsap/ScrollTrigger"),
            ]);
            if (!ref.current) return;
            gsap.registerPlugin(ScrollTrigger);

            el.style.willChange = "transform, opacity";

            tween = gsap.fromTo(
                el,
                { opacity: 0, x: from.x, y: from.y },
                {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    duration,
                    delay,
                    ease: "power3.out",
                    clearProps: "willChange",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 92%",
                        toggleActions: once ? "play none none none" : "play none none reverse",
                    },
                }
            );
        };

        init();

        return () => {
            tween?.scrollTrigger?.kill();
            tween?.kill();
        };
    }, [direction, delay, duration, distance, once, skipAnimation]);

    return (
        // On mobile / reduced-motion: no initial opacity — content always visible.
        // On desktop: start hidden so GSAP can animate it in.
        <div
            ref={ref}
            className={className}
            style={skipAnimation ? undefined : { opacity: 0 }}
        >
            {children}
        </div>
    );
}
