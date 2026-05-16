"use client";

import { useEffect, useId, useRef, ReactNode, CSSProperties } from "react";

interface GlowHeadlineProps {
    children: ReactNode;
    className?: string;
}

export default function GlowHeadline({ children, className = "" }: GlowHeadlineProps) {
    const ref = useRef<HTMLDivElement>(null);
    const id = useId().replace(/:/g, "");
    const scopeClass = `glowh-${id}`;

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const onMove = (e: PointerEvent) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            el.style.setProperty("--x", `${x.toFixed(1)}px`);
            el.style.setProperty("--y", `${y.toFixed(1)}px`);
            const xp = rect.width > 0 ? (x / rect.width).toFixed(3) : "0.5";
            el.style.setProperty("--xp", xp);
        };

        document.addEventListener("pointermove", onMove);
        return () => document.removeEventListener("pointermove", onMove);
    }, []);

    const wrapperStyle: CSSProperties = {
        ["--size" as never]: "230",
        ["--spot" as never]: "calc(var(--size) * 1px)",
        ["--gold" as never]: "#E4C896",
        ["--blue" as never]: "#C9A875",
    };

    const css = `
        @property --glow-active {
            syntax: '<number>';
            inherits: true;
            initial-value: 0;
        }
        .${scopeClass} {
            --glow-active: 0;
            transition: --glow-active 500ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .${scopeClass}:hover {
            --glow-active: 1;
        }
        .${scopeClass} .hero-line {
            --glow-c: color-mix(in srgb,
                var(--blue) calc(var(--glow-active, 0) * 100%),
                transparent);
            background-image:
                radial-gradient(var(--spot) var(--spot) at var(--x, 50%) var(--y, 50%),
                    var(--glow-c) 0%,
                    var(--glow-c) 12%,
                    transparent 55%),
                linear-gradient(#F5EDDC, #F5EDDC);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent !important;
            -webkit-text-fill-color: transparent;
        }
        .${scopeClass} div.hero-line {
            background-image:
                radial-gradient(var(--spot) var(--spot) at var(--x, 50%) var(--y, 50%),
                    var(--glow-c) 0%,
                    var(--glow-c) 12%,
                    transparent 55%),
                linear-gradient(rgba(245, 237, 220, 0.55), rgba(245, 237, 220, 0.55));
        }
        .${scopeClass} .hero-line .text-gold {
            -webkit-text-fill-color: #C9A875;
            color: #C9A875;
            background-image: none;
            -webkit-background-clip: border-box;
            background-clip: border-box;
        }
    `;

    return (
        <div ref={ref} className={`relative group ${scopeClass} ${className}`} style={wrapperStyle}>
            <style dangerouslySetInnerHTML={{ __html: css }} />
            {children}
        </div>
    );
}
