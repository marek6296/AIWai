"use client";

import ScrollReveal from "@/components/animations/ScrollReveal";
import TextReveal from "@/components/animations/TextReveal";
import { useTranslation } from "@/i18n/useTranslation";

export default function CTASection() {
    const { t } = useTranslation();

    const scrollToContact = () => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section className="py-20 md:py-36 bg-char relative overflow-hidden">
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none gold-vlines opacity-40" />
            <div aria-hidden="true" className="absolute top-[10%] right-[5%] w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(201,168,117,0.15) 0%, transparent 65%)" }} />
            <div aria-hidden="true" className="absolute bottom-[10%] left-[5%] w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(201,168,117,0.08) 0%, transparent 65%)" }} />

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
                        onClick={scrollToContact}
                        className="inline-flex items-center gap-3 px-8 md:px-10 py-4 bg-white text-brand-indigo rounded-full text-sm font-bold uppercase tracking-[0.15em] hover:bg-white/90 transition-all shadow-2xl shadow-black/10 hover:shadow-black/20 group"
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
