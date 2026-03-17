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
    staggerAmount = 0.04,
    splitBy = "word",
}: TextRevealProps) {
    const containerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const elements = el.querySelectorAll(".reveal-unit");

        gsap.fromTo(
            elements,
            {
                opacity: 0,
                y: 40,
                rotateX: -20,
            },
            {
                opacity: 1,
                y: 0,
                rotateX: 0,
                duration: 0.8,
                delay,
                stagger: staggerAmount,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none none",
                },
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach((t) => {
                if (t.trigger === el) t.kill();
            });
        };
    }, [delay, staggerAmount]);

    const units =
        splitBy === "word"
            ? children.split(" ").map((word, i) => (
                  <span
                      key={i}
                      className="reveal-unit inline-block"
                      style={{ opacity: 0 }}
                  >
                      {word}
                      {i < children.split(" ").length - 1 ? "\u00A0" : ""}
                  </span>
              ))
            : children.split("").map((char, i) => (
                  <span
                      key={i}
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
            style={{ perspective: "500px" }}
        >
            {units}
        </Tag>
    );
}
