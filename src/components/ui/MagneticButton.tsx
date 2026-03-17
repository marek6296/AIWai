"use client";
import { motion, HTMLMotionProps } from "framer-motion";
import { useRef, useState } from "react";
import clsx from "clsx";

interface MagneticButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
    className?: string;
}

/**
 * Premium CTA button with liquid fill hover and click ripple.
 */
export default function MagneticButton({ children, className, ...props }: MagneticButtonProps) {
    const ref = useRef<HTMLButtonElement>(null);
    const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        setRipple({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            key: Date.now(),
        });
        props.onClick?.(e);
    };

    return (
        <motion.button
            ref={ref}
            whileHover="hover"
            whileTap={{ scale: 0.97 }}
            className={clsx(
                "relative px-10 py-4 border-2 border-brand-indigo text-brand-indigo uppercase tracking-[0.2em] text-xs font-bold transition-colors duration-300",
                "hover:text-white overflow-hidden group shadow-sm",
                className
            )}
            {...props}
            onClick={handleClick}
        >
            <span className="relative z-10">{children}</span>

            {/* Liquid Fill Hover Effect */}
            <motion.div
                variants={{
                    hover: { y: 0 }
                }}
                initial={{ y: "101%" }}
                transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                className="absolute inset-0 bg-brand-indigo"
            />

            {/* Click Ripple */}
            {ripple && (
                <span
                    key={ripple.key}
                    className="absolute rounded-full bg-white/20 animate-[ping_0.6s_ease-out_forwards] pointer-events-none z-20"
                    style={{
                        left: ripple.x - 10,
                        top: ripple.y - 10,
                        width: 20,
                        height: 20,
                    }}
                    onAnimationEnd={() => setRipple(null)}
                />
            )}
        </motion.button>
    );
}
