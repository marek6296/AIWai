"use client";
import { useRef, useState } from "react";
import clsx from "clsx";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
}

/**
 * Premium CTA button — liquid fill hover via CSS, click ripple via vanilla JS.
 * No Framer Motion.
 */
export default function MagneticButton({ children, className, ...props }: MagneticButtonProps) {
    const ref = useRef<HTMLButtonElement>(null);
    const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top, key: Date.now() });
        }
        props.onClick?.(e);
    };

    return (
        <button
            ref={ref}
            className={clsx(
                "magnetic-btn relative px-10 py-4 border-2 border-brand-indigo text-brand-indigo",
                "uppercase tracking-[0.2em] text-xs font-bold overflow-hidden",
                "hover:text-white transition-colors duration-300 shadow-sm",
                className
            )}
            {...props}
            onClick={handleClick}
        >
            <span className="relative z-10">{children}</span>

            {/* Click Ripple */}
            {ripple && (
                <span
                    key={ripple.key}
                    className="absolute rounded-full bg-white/20 animate-[ping_0.6s_ease-out_forwards] pointer-events-none z-20"
                    style={{ left: ripple.x - 10, top: ripple.y - 10, width: 20, height: 20 }}
                    onAnimationEnd={() => setRipple(null)}
                />
            )}
        </button>
    );
}
