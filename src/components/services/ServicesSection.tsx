"use client";
import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import ServiceModal from "@/components/services/ServiceModal";
import TextReveal from "@/components/animations/TextReveal";
import FadeIn from "@/components/animations/FadeIn";
import SectionBackground from "@/components/backgrounds/SectionBackground";
import { useTranslation } from "@/i18n/useTranslation";

const TAGS = ["WEB", "AI", "AI", "DIZAJN", "MARKETING"];

export default function ServicesSection() {
    const { t } = useTranslation();
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const services = [0, 1, 2, 3, 4].map((i) => ({
        title: t(`services.${i}.title`),
        description: t(`services.${i}.description`),
        tag: TAGS[i],
        details: {
            whatIsIt: t(`services.${i}.whatIsIt`),
            includes: t(`services.${i}.includes`).split("|"),
        },
    }));

    const selectedService = selectedIndex !== null ? services[selectedIndex] : null;

    return (
        <section id="services" className="py-20 md:py-28 bg-char relative overflow-hidden">
            <SectionBackground variant="default" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="mb-16 md:mb-20 max-w-3xl">
                    <TextReveal
                        as="h2"
                        className="text-4xl md:text-6xl font-display font-bold tracking-tight text-cream mb-5"
                    >
                        {t("services.heading")}
                    </TextReveal>
                    <p className="text-cream/50 text-lg font-light">
                        {t("services.subheading")}
                    </p>
                </div>

                {/* Services list */}
                <div>
                    {services.map((service, index) => (
                        <FadeIn key={index} delay={index * 0.06}>
                            <button
                                onClick={() => setSelectedIndex(index)}
                                className={`group w-full text-left border-t border-cream/10 py-7 md:py-9 flex items-start md:items-center gap-5 md:gap-10 hover:bg-cream/[0.03] -mx-6 px-6 transition-all duration-300 ${index === 4 ? "border-b" : ""}`}
                            >
                                {/* Number */}
                                <span className="text-[11px] font-bold tracking-[0.25em] text-gold/60 group-hover:text-gold transition-colors duration-300 shrink-0 w-7 pt-1 md:pt-0">
                                    {String(index + 1).padStart(2, "0")}
                                </span>

                                {/* Title + mobile description */}
                                <div className="flex-1 min-w-0 md:w-72 md:flex-none md:shrink-0">
                                    <div className="flex items-center gap-3 mb-0.5">
                                        <h3 className="font-display font-bold text-cream tracking-tight text-xl md:text-3xl group-hover:translate-x-1 transition-transform duration-300">
                                            {service.title}
                                        </h3>
                                        <span className="text-[9px] font-bold tracking-[0.25em] text-gold/80 bg-gold/10 border border-gold/25 px-2 py-0.5 rounded-full hidden sm:inline-block group-hover:border-gold/60 group-hover:text-gold transition-colors duration-300">
                                            {service.tag}
                                        </span>
                                    </div>
                                    <p className="md:hidden text-cream/45 text-sm font-light leading-snug mt-1.5 group-hover:text-cream/70 transition-colors duration-300">
                                        {service.description}
                                    </p>
                                </div>

                                {/* Description — desktop inline */}
                                <p className="hidden md:block text-cream/40 text-base font-light leading-relaxed flex-1 group-hover:text-cream/70 transition-colors duration-300">
                                    {service.description}
                                </p>

                                {/* Arrow */}
                                <div className="ml-auto shrink-0 w-9 h-9 md:w-11 md:h-11 rounded-full border border-cream/15 group-hover:border-gold group-hover:bg-gold flex items-center justify-center transition-all duration-300">
                                    <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-cream/40 group-hover:text-ink group-hover:translate-x-0.5 transition-all duration-300" />
                                </div>
                            </button>
                        </FadeIn>
                    ))}
                </div>
            </div>

            <ServiceModal
                isOpen={selectedIndex !== null}
                onClose={() => setSelectedIndex(null)}
                service={selectedService}
                index={selectedIndex ?? 0}
            />
        </section>
    );
}
