"use client";

interface ParallaxLayerProps {
    children: React.ReactNode;
    className?: string;
    speed?: number;
}

// GSAP removed — native scroll is faster. This is now a passthrough wrapper.
export default function ParallaxLayer({ children, className = "" }: ParallaxLayerProps) {
    return <div className={className}>{children}</div>;
}
