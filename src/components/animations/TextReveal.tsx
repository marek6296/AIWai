"use client";
import { useRef, useEffect, useState } from "react";

interface TextRevealProps {
    children: string;
    className?: string;
    as?: "h1" | "h2" | "h3" | "p" | "span";
    delay?: number;
    staggerAmount?: number;
    splitBy?: "word" | "char";
}

export default function TextReveal({
    children,
    className = "",
    as: Tag = "h2",
    delay = 0,
    staggerAmount = 0.028,
    splitBy = "word",
}: TextRevealProps) {
    const containerRef = useRef<HTMLElement>(null);

    // Detect mobile / reduced-motion synchronously — component is always client-only.
    const [skipAnimation] = useState(() => {
        if (typeof window === "undefined") return true;
        return (
            window.innerWidth < 768 ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        );
    });

    useEffect(() => {
        const el = containerRef.current;
        if (!el || skipAnimation) return;

        let tween: { kill: () => void; scrollTrigger?: { kill: () => void } } | undefined;

        const init = async () => {
            const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
                import("gsap"),
                import("gsap/ScrollTrigger"),
            ]);
            if (!containerRef.current) return;
            gsap.registerPlugin(ScrollTrigger);

            const elements = el.querySelectorAll<HTMLElement>(".reveal-unit");
            elements.forEach((e) => { e.style.willChange = "transform, opacity"; });

            tween = gsap.fromTo(
                elements,
                { opacity: 0, y: 12 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    delay,
                    stagger: staggerAmount,
                    ease: "power3.out",
                    onComplete: () => {
                        elements.forEach((e) => { e.style.willChange = "auto"; });
                    },
                    scrollTrigger: {
                        trigger: el,
                        start: "top 92%",
                        toggleActions: "play none none none",
                    },
                }
            );
        };

        init();

        return () => {
            tween?.scrollTrigger?.kill();
            tween?.kill();
        };
    }, [children, delay, staggerAmount, skipAnimation]);

    // Mobile / reduced-motion: plain text, no splitting, no invisible spans.
    if (skipAnimation) {
        return <Tag className={className}>{children}</Tag>;
    }

    // Desktop: split into animated units.
    const units =
        splitBy === "word"
            ? children.split(" ").map((word, i, arr) => (
                  <span
                      key={`${word}-${i}`}
                      className="reveal-unit inline-block"
                      style={{ opacity: 0 }}
                  >
                      {word}
                      {i < arr.length - 1 ? "\u00A0" : ""}
                  </span>
              ))
            : children.split("").map((char, i) => (
                  <span
                      key={`${char}-${i}`}
                      className="reveal-unit inline-block"
                      style={{ opacity: 0 }}
                  >
                      {char === " " ? "\u00A0" : char}
                  </span>
              ));

    return (
        <Tag
            ref={containerRef as React.RefObject<HTMLHeadingElement>}
            className={className}
            key={children}
        >
            {units}
        </Tag>
    );
}
