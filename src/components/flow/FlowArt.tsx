"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function cx(...parts: Array<string | undefined | false | null>) {
    return parts.filter(Boolean).join(" ");
}

interface FlowSectionProps {
    children: React.ReactNode;
    className?: string;
    flowId?: string;
    "aria-label"?: string;
}

export function FlowSection({ children, className, flowId, "aria-label": ariaLabel }: FlowSectionProps) {
    return (
        <section
            data-flow-section
            data-flow-anchor={flowId}
            aria-label={ariaLabel}
            className={cx("relative min-h-[100svh] w-full overflow-hidden bg-char", className)}
        >
            <div
                data-flow-inner
                className="flow-art-container relative min-h-[100svh] w-full will-change-transform"
                style={{ transformOrigin: "bottom left" }}
            >
                {children}
            </div>
        </section>
    );
}

interface FlowArtProps {
    children: React.ReactNode;
    className?: string;
    "aria-label"?: string;
}

export default function FlowArt({
    children,
    className,
    "aria-label": ariaLabel = "AIWai homepage",
}: FlowArtProps) {
    const containerRef = useRef<HTMLElement>(null);
    const [reducedMotion, setReducedMotion] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const sectionCount = React.Children.count(children);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const mqMobile = window.matchMedia("(max-width: 767px)");
        const update = () => setReducedMotion(mq.matches);
        const updateMobile = () => setIsMobile(mqMobile.matches);

        update();
        updateMobile();
        mq.addEventListener("change", update);
        mqMobile.addEventListener("change", updateMobile);
        return () => {
            mq.removeEventListener("change", update);
            mqMobile.removeEventListener("change", updateMobile);
        };
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || reducedMotion || isMobile) return;

        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            const sections = Array.from(container.querySelectorAll<HTMLElement>("[data-flow-section]"));
            if (sections.length === 0) return;

            sections.forEach((section) => {
                section.dataset.flowScrollTop = String(section.offsetTop);
            });

            sections.forEach((section, index) => {
                gsap.set(section, { zIndex: index + 1 });

                const inner = section.querySelector<HTMLElement>("[data-flow-inner]");
                if (!inner) return;

                if (index > 0) {
                    gsap.set(inner, {
                        rotation: 30,
                        transformOrigin: "bottom left",
                    });

                    gsap.to(inner, {
                        rotation: 0,
                        ease: "none",
                        scrollTrigger: {
                            trigger: section,
                            start: "top bottom",
                            end: "top 25%",
                            scrub: true,
                        },
                    });
                }

                if (index < sections.length - 1) {
                    ScrollTrigger.create({
                        trigger: section,
                        start: "bottom bottom",
                        end: "bottom top",
                        pin: true,
                        pinSpacing: false,
                    });
                }
            });

            ScrollTrigger.refresh();
        }, container);

        return () => {
            ctx.revert();
        };
    }, [sectionCount, reducedMotion, isMobile]);

    return (
        <main
            ref={containerRef}
            aria-label={ariaLabel}
            className={cx("w-full overflow-x-hidden bg-char", className)}
        >
            {children}
        </main>
    );
}
