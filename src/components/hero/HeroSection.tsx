"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import MagneticButton from "@/components/ui/MagneticButton";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollToPlugin);
}

export default function HeroSection() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            // Set initial states
            gsap.set(".hero-line", { y: 80, opacity: 0 });
            gsap.set(".hero-sub", { y: 30, opacity: 0 });
            gsap.set(".hero-cta", { y: 30, opacity: 0 });
            gsap.set(".hero-orb", { scale: 0.5, opacity: 0 });

            // Staggered entrance
            tl.to(".hero-orb", {
                scale: 1,
                opacity: 1,
                duration: 2,
                stagger: 0.3,
                ease: "power2.out",
            })
            .to(
                ".hero-line",
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.15,
                },
                "-=1.5"
            )
            .to(
                ".hero-sub",
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                },
                "-=0.6"
            )
            .to(
                ".hero-cta",
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                },
                "-=0.4"
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const scrollToContact = () => {
        const el = document.getElementById("contact");
        if (el) {
            gsap.to(window, {
                duration: 2.5,
                scrollTo: { y: el, offsetY: 0 },
                ease: "power4.inOut",
            });
        }
    };

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen w-full overflow-hidden flex items-center justify-center"
        >
            {/* ── Gradient Mesh Background ── */}
            <div className="absolute inset-0 gradient-mesh" />

            {/* ── Floating Orbs ── */}
            <div className="hero-orb absolute top-[10%] left-[15%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-brand-sand/10 blur-[80px] md:blur-[120px] animate-float-slow pointer-events-none" />
            <div className="hero-orb absolute bottom-[15%] right-[10%] w-[250px] h-[250px] md:w-[400px] md:h-[400px] rounded-full bg-brand-indigo/5 blur-[80px] md:blur-[100px] animate-float-slower pointer-events-none" />
            <div className="hero-orb absolute top-[50%] right-[30%] w-[150px] h-[150px] md:w-[250px] md:h-[250px] rounded-full bg-brand-sand/8 blur-[60px] md:blur-[80px] animate-float pointer-events-none" />

            {/* ── Subtle Grid Overlay ── */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(28,31,58,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(28,31,58,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

            {/* ── Content ── */}
            <div className="relative z-10 container mx-auto text-center px-6 py-32">
                <div className="max-w-5xl mx-auto space-y-8">
                    {/* Headline */}
                    <div className="space-y-0">
                        <div>
                            <h1 className="hero-line text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-brand-indigo leading-[1.2]">
                                Intelligent
                            </h1>
                        </div>
                        <div>
                            <h1 className="hero-line text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight leading-[1.2]">
                                <span className="text-brand-indigo/40 italic font-light">Digital</span>{" "}
                                <span className="text-gradient">Architecture</span>
                            </h1>
                        </div>
                    </div>

                    {/* Subtitle */}
                    <p className="hero-sub text-lg md:text-xl text-brand-indigo/50 max-w-2xl mx-auto leading-relaxed font-light">
                        We design and build AI-powered digital experiences that transform businesses.
                        Premium design meets intelligent automation.
                    </p>

                    {/* CTA */}
                    <div className="hero-cta flex items-center justify-center gap-4 pt-4">
                        <MagneticButton onClick={scrollToContact}>
                            Start a Project
                        </MagneticButton>
                        <button
                            onClick={() => {
                                const el = document.getElementById("services");
                                if (el) {
                                    gsap.to(window, {
                                        duration: 2,
                                        scrollTo: { y: el, offsetY: 0 },
                                        ease: "power4.inOut",
                                    });
                                }
                            }}
                            className="px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-brand-indigo/60 hover:text-brand-indigo transition-colors"
                        >
                            Explore Services ↓
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Bottom Gradient Fade ── */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </section>
    );
}
