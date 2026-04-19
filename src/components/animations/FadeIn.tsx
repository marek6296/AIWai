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

        // If already visible or near viewport on mount, skip animation entirely.
        // Generous buffer so fast-scroll users never see blank gaps.
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 400) {
            el.dataset.fiVisible = "true";
            return;
        }

        // Set initial hidden state via data attribute (not inline style or SSR class)
        // so SSR HTML is always visible and there's no hydration mismatch.
        el.dataset.fiReady = direction;
        if (delay > 0) el.style.transitionDelay = `${delay}s`;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.dataset.fiVisible = "true";
                    observer.disconnect();
                    clearTimeout(safety);
                }
            },
            // Fire 400px before element enters viewport — gives fast-scrollers
            // time to see content revealed rather than a blank gap.
            { threshold: 0, rootMargin: "0px 0px 400px 0px" }
        );

        // Safety net — guarantees content never stays hidden longer than 900ms
        // after mount, even if IO misfires during aggressive scroll.
        const safety = window.setTimeout(() => {
            el.dataset.fiVisible = "true";
            observer.disconnect();
        }, 900);

        observer.observe(el);
        return () => { observer.disconnect(); clearTimeout(safety); };
    }, [delay, direction]);

    return (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <Tag ref={ref as any} className={className}>
            {children}
        </Tag>
    );
}
