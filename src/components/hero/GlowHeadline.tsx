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
        .${scopeClass} { position: relative; }

        /* ─── BASE LAYER: outline-only text (always visible) ─── */
        .${scopeClass} .glowh-base .hero-line {
            color: transparent !important;
            -webkit-text-fill-color: transparent !important;
            -webkit-text-stroke: 1px #F5EDDC;
            paint-order: stroke fill;
        }
        .${scopeClass} .glowh-base div.hero-line {
            -webkit-text-stroke-color: rgba(245, 237, 220, 0.55);
            transition: -webkit-text-stroke-color 500ms ease-out;
        }
        .${scopeClass}:hover .glowh-base div.hero-line {
            -webkit-text-stroke-color: rgba(245, 237, 220, 0.85);
        }
        /* keep gold ▲ filled in base layer */
        .${scopeClass} .glowh-base .hero-line .text-gold {
            -webkit-text-fill-color: #C9A875 !important;
            color: #C9A875 !important;
            -webkit-text-stroke: 0;
        }

        /* ─── GLOW LAYER: duplicate outline, masked by cursor spotlight ─── */
        .${scopeClass} .glowh-glow {
            position: absolute;
            inset: 0;
            pointer-events: none;
            opacity: 0;
            transition: opacity 400ms cubic-bezier(0.22, 1, 0.36, 1);
            -webkit-mask-image: radial-gradient(
                var(--spot) var(--spot) at var(--x, 50%) var(--y, 50%),
                #000 0%,
                rgba(0,0,0,0.85) 25%,
                transparent 60%);
            mask-image: radial-gradient(
                var(--spot) var(--spot) at var(--x, 50%) var(--y, 50%),
                #000 0%,
                rgba(0,0,0,0.85) 25%,
                transparent 60%);
        }
        .${scopeClass}:hover .glowh-glow { opacity: 1; }

        .${scopeClass} .glowh-glow .hero-line {
            color: transparent !important;
            -webkit-text-fill-color: transparent !important;
            -webkit-text-stroke: 1.4px var(--blue);
            paint-order: stroke fill;
            filter:
                drop-shadow(0 0 3px rgba(201,168,117,0.9))
                drop-shadow(0 0 10px rgba(201,168,117,0.55));
        }
        /* hide gold ▲ in glow layer (keeps layout, no double-render) */
        .${scopeClass} .glowh-glow .hero-line .text-gold {
            -webkit-text-fill-color: transparent !important;
            color: transparent !important;
            -webkit-text-stroke: 0 !important;
            filter: none !important;
        }
    `;

    return (
        <div ref={ref} className={`relative group ${scopeClass} ${className}`} style={wrapperStyle}>
            <style dangerouslySetInnerHTML={{ __html: css }} />
            <div className="glowh-base">{children}</div>
            <div className="glowh-glow" aria-hidden="true">{children}</div>
        </div>
    );
}
