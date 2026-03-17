"use client";

import ScrollReveal from "@/components/animations/ScrollReveal";
import TextReveal from "@/components/animations/TextReveal";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ArrowRight } from "lucide-react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollToPlugin);
}

export default function CTASection() {
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
        <section className="py-28 md:py-36 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-brand-indigo" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
            <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-brand-sand/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto relative z-10 text-center">
                <ScrollReveal>
                    <p className="text-brand-sand/80 uppercase tracking-[0.2em] text-xs font-bold mb-6">
                        Ready to start?
                    </p>
                </ScrollReveal>

                <TextReveal
                    as="h2"
                    className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white tracking-tight mb-8"
                >
                    Let&apos;s build something intelligent together
                </TextReveal>

                <ScrollReveal delay={0.3}>
                    <p className="text-white/40 text-lg max-w-xl mx-auto mb-12 font-light">
                        Transform your digital presence with AI-powered solutions designed for measurable impact.
                    </p>
                </ScrollReveal>

                <ScrollReveal delay={0.5}>
                    <button
                        onClick={scrollToContact}
                        className="inline-flex items-center gap-3 px-10 py-4 bg-white text-brand-indigo rounded-full text-sm font-bold uppercase tracking-[0.15em] hover:bg-white/90 transition-all shadow-2xl shadow-black/10 hover:shadow-black/20 group"
                    >
                        Start a Project
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </ScrollReveal>
            </div>
        </section>
    );
}
