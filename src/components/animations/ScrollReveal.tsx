"use client";
// Thin wrapper around FadeIn for backwards-compat.
// direction="left"/"right" is collapsed to "up" — horizontal slides caused jank.
import FadeIn from "@/components/animations/FadeIn";

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
    delay = 0,
}: ScrollRevealProps) {
    return (
        <FadeIn className={className} delay={delay}>
            {children}
        </FadeIn>
    );
}
