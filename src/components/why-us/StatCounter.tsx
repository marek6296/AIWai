"use client";
import { useEffect, useRef } from "react";

interface StatCounterProps {
    value: number;
    label: string;
    suffix?: string;
}

export default function StatCounter({ value, label, suffix = "" }: StatCounterProps) {
    const ref = useRef<HTMLDivElement>(null);
    const spanRef = useRef<HTMLSpanElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const el = ref.current;
        const span = spanRef.current;
        if (!el || !span) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    observer.disconnect();
                    // Animate count up with RAF
                    const duration = 1500;
                    const start = performance.now();
                    const animate = (now: number) => {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        // ease-out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        span.textContent = Math.floor(eased * value).toLocaleString() + suffix;
                        if (progress < 1) requestAnimationFrame(animate);
                    };
                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.3, rootMargin: "0px 0px -100px 0px" }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [value, suffix]);

    return (
        <div ref={ref} className="text-center">
            <div className="text-4xl md:text-6xl font-bold text-brand-indigo mb-2 font-mono">
                <span ref={spanRef}>{`0${suffix}`}</span>
            </div>
            <div className="text-brand-indigo/60 uppercase tracking-widest text-sm">{label}</div>
        </div>
    );
}
