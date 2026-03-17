"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface ParallaxLayerProps {
    children: React.ReactNode;
    className?: string;
    speed?: number; // 0 = no movement, 1 = full scroll speed. Default 0.3
}

export default function ParallaxLayer({
    children,
    className = "",
    speed = 0.3,
}: ParallaxLayerProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // On mobile, disable parallax for performance
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        if (isMobile) return;

        gsap.to(el, {
            yPercent: -speed * 30,
            ease: "none",
            scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach((t) => {
                if (t.trigger === el) t.kill();
            });
        };
    }, [speed]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}
