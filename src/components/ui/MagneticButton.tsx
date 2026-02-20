"use client";
import { motion, HTMLMotionProps } from "framer-motion";
import clsx from "clsx";

interface MagneticButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
    className?: string;
}

/**
 * A stable, high-contrast CTA button with a premium hover effect.
 * Formerly "Magnetic", now stabilized for better user experience.
 */
export default function MagneticButton({ children, className, ...props }: MagneticButtonProps) {
    return (
        <motion.button
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
            className={clsx(
                "relative px-10 py-4 border-2 border-brand-indigo text-brand-indigo uppercase tracking-[0.2em] text-xs font-bold transition-colors duration-300",
                "hover:text-white overflow-hidden group shadow-sm",
                className
            )}
            {...props}
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
        </motion.button>
    );
}
