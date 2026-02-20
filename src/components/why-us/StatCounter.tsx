"use client";
import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

interface StatCounterProps {
    value: number;
    label: string;
    suffix?: string;
}

export default function StatCounter({ value, label, suffix = "" }: StatCounterProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { stiffness: 50, damping: 20 });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [isInView, value, motionValue]);

    return (
        <div ref={ref} className="text-center">
            <div className="text-4xl md:text-6xl font-bold text-brand-indigo mb-2 font-mono">
                <span ref={(span) => {
                    if (!span) return;
                    // Subscribe to spring upates
                    const unsubscribe = springValue.on("change", (latest) => {
                        span.textContent = Math.floor(latest).toLocaleString() + suffix;
                    });
                    return () => unsubscribe();
                }}>{0 + suffix}</span>
            </div>
            <div className="text-brand-indigo/60 uppercase tracking-widest text-sm">{label}</div>
        </div>
    );
}
