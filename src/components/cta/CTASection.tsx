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
        <section className="py-28 md:py-36 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-brand-indigo" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
            <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-brand-sand/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto relative z-10 text-center">
                <ScrollReveal>
                    <p className="text-brand-sand/80 uppercase tracking-[0.2em] text-xs font-bold mb-6">
                        {t("cta.label")}
                    </p>
                </ScrollReveal>

                <TextReveal
                    as="h2"
                    className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white tracking-tight mb-8"
                >
                    {t("cta.heading")}
                </TextReveal>

                <ScrollReveal delay={0.1}>
                    <p className="text-white/40 text-lg max-w-xl mx-auto mb-12 font-light">
                        {t("cta.subheading")}
                    </p>
                </ScrollReveal>

                <ScrollReveal delay={0.18}>
                    <button
                        onClick={scrollToContact}
                        className="inline-flex items-center gap-3 px-10 py-4 bg-white text-brand-indigo rounded-full text-sm font-bold uppercase tracking-[0.15em] hover:bg-white/90 transition-all shadow-2xl shadow-black/10 hover:shadow-black/20 group"
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
