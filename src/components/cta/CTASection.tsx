"use client";

import ScrollReveal from "@/components/animations/ScrollReveal";
import TextReveal from "@/components/animations/TextReveal";
import { useTranslation } from "@/i18n/useTranslation";
import { scrollToPageSection } from "@/lib/scrollToPageSection";

export default function CTASection() {
    const { t } = useTranslation();

    return (
        <section className="bg-char relative overflow-hidden flex items-center justify-center min-h-[100svh] py-16 md:py-24">
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none gold-vlines opacity-30" />
            {/* Single centered soft radial — no hard clipped edges */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,168,117,0.18) 0%, rgba(201,168,117,0.06) 35%, transparent 70%)",
                }}
            />
            {/* Top & bottom char fades — smooth blend into adjacent sections */}
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-char to-transparent pointer-events-none" />
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-char to-transparent pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 text-center">
                <ScrollReveal>
                    <p className="text-gold/80 uppercase tracking-[0.2em] text-xs font-bold mb-4 md:mb-6">
                        {t("cta.label")}
                    </p>
                </ScrollReveal>

                <TextReveal
                    as="h2"
                    className="text-[2.25rem] md:text-6xl lg:text-7xl font-display font-bold text-white tracking-tight mb-6 md:mb-8 leading-[1.1]"
                >
                    {t("cta.heading")}
                </TextReveal>

                <ScrollReveal delay={0.1}>
                    <p className="text-white/50 text-base md:text-lg max-w-xl mx-auto mb-10 md:mb-12 font-light">
                        {t("cta.subheading")}
                    </p>
                </ScrollReveal>

                <ScrollReveal delay={0.18}>
                    <button
                        onClick={() => scrollToPageSection("contact")}
                        className="inline-flex items-center gap-3 px-8 md:px-10 py-4 bg-gold text-ink text-sm font-bold uppercase tracking-[0.15em] hover:bg-gold-bright transition-all shadow-2xl shadow-black/30 group"
                    >
                        {t("cta.button")}
                        <svg
                            className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-1"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M5 12H19M19 12L13 6M19 12L13 18"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </ScrollReveal>
            </div>
        </section>
    );
}
