"use client";
// Simplified TextReveal — no word-splitting, no GSAP.
// Just a FadeIn wrapper for heading elements.
import FadeIn from "@/components/animations/FadeIn";

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
}: TextRevealProps) {
    return (
        <FadeIn delay={delay} as="div">
            <Tag className={className}>{children}</Tag>
        </FadeIn>
    );
}
