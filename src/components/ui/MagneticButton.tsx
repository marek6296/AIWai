"use client";
import { useRef, useState } from "react";
import clsx from "clsx";

type Variant = "dark" | "gold";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
    variant?: Variant;
}

/**
 * Premium CTA button — liquid fill hover via CSS, click ripple via vanilla JS.
 * variant="dark" (default) = indigo border, fills with indigo on hover
 * variant="gold" = gold border on cream, fills with gold on hover (for dark backgrounds)
 */
export default function MagneticButton({ children, className, variant = "dark", ...props }: MagneticButtonProps) {
    const ref = useRef<HTMLButtonElement>(null);
    const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top, key: Date.now() });
        }
        props.onClick?.(e);
    };

    const variantClasses =
        variant === "gold"
            ? "magnetic-btn magnetic-btn--gold border-2 border-gold text-cream hover:text-ink"
            : "magnetic-btn border-2 border-brand-indigo text-brand-indigo hover:text-white";

    return (
        <button
            ref={ref}
            className={clsx(
                "relative px-10 py-4",
                "uppercase tracking-[0.2em] text-xs font-bold overflow-hidden",
                "transition-colors duration-300 shadow-sm",
                variantClasses,
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
