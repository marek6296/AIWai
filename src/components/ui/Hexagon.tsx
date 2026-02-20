import React from "react";
import clsx from "clsx";

interface HexagonProps {
    children?: React.ReactNode;
    className?: string;
    borderColor?: string;
    glow?: boolean;
}

export default function Hexagon({ children, className, borderColor = "#D8B98A", glow = false }: HexagonProps) {
    return (
        <div className={clsx("relative flex items-center justify-center", className)}>
            {/* SVG Border */}
            <svg
                viewBox="0 0 100 100"
                className={clsx(
                    "absolute inset-0 w-full h-full pointer-events-none transition-all duration-300",
                    glow && "drop-shadow-[0_0_10px_rgba(216,185,138,0.5)]"
                )}
            >
                <path
                    d="M50 5 L89 27.5 L89 72.5 L50 95 L11 72.5 L11 27.5 Z"
                    fill="none"
                    stroke={borderColor}
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                />
            </svg>

            {/* Content Mask */}
            <div
                className="relative w-full h-full flex items-center justify-center overflow-hidden"
                style={{ clipPath: "polygon(50% 5%, 89% 27.5%, 89% 72.5%, 50% 95%, 11% 72.5%, 11% 27.5%)" }}
            >
                {children}
            </div>
        </div>
    );
}
