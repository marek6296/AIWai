"use client";
import React, { useRef, MouseEvent } from "react";

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export default function TiltCard({ children, className = "", onClick }: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width - 0.5;
        const yPct = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(1000px) rotateX(${(-yPct * 7).toFixed(2)}deg) rotateY(${(xPct * 7).toFixed(2)}deg)`;
    };

    const handleMouseLeave = () => {
        if (ref.current) ref.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    };

    return (
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            className={className}
            style={{ transition: "transform 0.15s ease", transformStyle: "preserve-3d" }}
        >
            <div style={{ transform: "translateZ(20px)" }} className="h-full w-full">
                {children}
            </div>
        </div>
    );
}
