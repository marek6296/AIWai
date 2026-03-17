"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

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
    staggerAmount = 0.035,
    splitBy = "word",
}: TextRevealProps) {
    const containerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const elements = el.querySelectorAll<HTMLElement>(".reveal-unit");

        // Hint GPU promotion before animation
        elements.forEach((e) => { e.style.willChange = "transform, opacity"; });

        // Simple translateY only — no rotateX (avoids expensive 3D layer per word)
        const tween = gsap.fromTo(
            elements,
            {
                opacity: 0,
                y: 30,
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.75,
                delay,
                stagger: staggerAmount,
                ease: "power3.out",
                onComplete: () => {
                    elements.forEach((e) => { e.style.willChange = "auto"; });
                },
                scrollTrigger: {
                    trigger: el,
                    start: "top 88%",
                    toggleActions: "play none none none",
                },
            }
        );

        return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
            elements.forEach((e) => { e.style.willChange = "auto"; });
        };
    }, [children, delay, staggerAmount]);

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
        // perspective removed from here — was creating expensive 3D stacking context per element
        <Tag
            ref={containerRef as React.RefObject<HTMLHeadingElement>}
            className={className}
            key={children}
        >
            {units}
        </Tag>
    );
}
