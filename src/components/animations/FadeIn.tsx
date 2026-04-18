"use client";
import { useRef, useEffect } from "react";

interface FadeInProps {
    children: React.ReactNode;
    className?: string;
    /** Extra transition delay in seconds */
    delay?: number;
    /** "up" adds a subtle 16px translateY; "none" is opacity-only */
    direction?: "up" | "none";
    as?: "div" | "section" | "article";
}

/**
 * Pure CSS + IntersectionObserver scroll reveal.
 * No GSAP, no Framer Motion — just the browser.
 *
 * Progressive-enhancement pattern:
 *   1. SSR renders content fully visible (no opacity:0 in HTML).
 *   2. JS runs useEffect, marks element [data-fi-ready] → CSS hides it.
 *   3. IntersectionObserver fires → [data-fi-visible] → CSS transitions in.
 *   4. If JS fails or is slow: content stays visible. Zero blank page risk.
 */
export default function FadeIn({
    children,
    className = "",
    delay = 0,
    direction = "up",
    as: Tag = "div",
}: FadeInProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Skip on mobile (native rendering is fine) and reduced-motion
        if (
            window.innerWidth < 768 ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            return;
        }

        // If already visible in viewport on mount, skip animation entirely.
        // Avoids the brief opacity:0 flash for above-the-fold content on
        // client-side navigation or fast hydration.
        const rect = el.getBoundingClientRect();
        if (rect.top >= 0 && rect.top < window.innerHeight) return;

        // Set initial hidden state via data attribute (not inline style or SSR class)
        // so SSR HTML is always visible and there's no hydration mismatch.
        el.dataset.fiReady = direction;
        if (delay > 0) el.style.transitionDelay = `${delay}s`;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.dataset.fiVisible = "true";
                    observer.disconnect();
                }
            },
            { threshold: 0.06, rootMargin: "0px 0px -24px 0px" }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [delay, direction]);

    return (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <Tag ref={ref as any} className={className}>
            {children}
        </Tag>
    );
}
