"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    direction?: "up" | "down" | "left" | "right";
    delay?: number;
    duration?: number;
    stagger?: number;
    distance?: number;
    once?: boolean;
}

export default function ScrollReveal({
    children,
    className = "",
    direction = "up",
    delay = 0,
    duration = 0.9,
    distance = 50,
    once = true,
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const dirMap = {
            up: { y: distance, x: 0 },
            down: { y: -distance, x: 0 },
            left: { x: distance, y: 0 },
            right: { x: -distance, y: 0 },
        };

        const from = dirMap[direction];

        // Hint the browser this element will be transformed
        el.style.willChange = "transform, opacity";

        const tween = gsap.fromTo(
            el,
            {
                opacity: 0,
                x: from.x,
                y: from.y,
            },
            {
                opacity: 1,
                x: 0,
                y: 0,
                duration,
                delay,
                ease: "power3.out",
                onComplete: () => {
                    // Release will-change after animation — avoid keeping GPU layer forever
                    el.style.willChange = "auto";
                },
                scrollTrigger: {
                    trigger: el,
                    start: "top 88%",
                    end: "bottom 20%",
                    toggleActions: once
                        ? "play none none none"
                        : "play none none reverse",
                },
            }
        );

        return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
            el.style.willChange = "auto";
        };
    }, [direction, delay, duration, distance, once]);

    return (
        <div ref={ref} className={className} style={{ opacity: 0 }}>
            {children}
        </div>
    );
}
