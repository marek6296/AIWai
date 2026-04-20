"use client";
import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import ServiceModal from "@/components/services/ServiceModal";
import TextReveal from "@/components/animations/TextReveal";
import FadeIn from "@/components/animations/FadeIn";
import { useTranslation } from "@/i18n/useTranslation";

export default function ServicesSection() {
    const { t } = useTranslation();
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const services = [0, 1, 2, 3, 4].map((i) => ({
        title: t(`services.${i}.title`),
        description: t(`services.${i}.description`),
        details: {
            whatIsIt: t(`services.${i}.whatIsIt`),
            includes: t(`services.${i}.includes`).split("|"),
        },
    }));

    const selectedService = selectedIndex !== null ? services[selectedIndex] : null;

    return (
        <section id="services" className="py-20 md:py-28 bg-white relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-indigo/10 to-transparent" />
            <div className="absolute top-[30%] right-[-5%] w-[500px] h-[500px] bg-brand-sand/[0.04] rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="mb-16 md:mb-20 max-w-3xl">
                    <TextReveal
                        as="h2"
                        className="text-4xl md:text-6xl font-display font-bold tracking-tight text-brand-indigo mb-5"
                    >
                        {t("services.heading")}
                    </TextReveal>
                    <p className="text-brand-indigo/40 text-lg font-light">
                        {t("services.subheading")}
                    </p>
                </div>

                {/* Services list */}
                <div>
                    {services.map((service, index) => (
                        <FadeIn key={index} delay={index * 0.06}>
                            <button
                                onClick={() => setSelectedIndex(index)}
                                className={`group w-full text-left border-t border-brand-indigo/[0.07] py-7 md:py-10 flex items-center gap-5 md:gap-10 hover:bg-brand-indigo/[0.02] -mx-6 px-6 transition-all duration-300 ${index === 4 ? "border-b" : ""}`}
                            >
                                {/* Number */}
                                <span className="text-[11px] font-bold tracking-[0.25em] text-brand-sand/50 group-hover:text-brand-sand transition-colors duration-300 shrink-0 w-7">
                                    {String(index + 1).padStart(2, "0")}
                                </span>

                                {/* Title */}
                                <h3 className="font-display font-bold text-brand-indigo tracking-tight text-xl md:text-3xl group-hover:translate-x-1 transition-transform duration-300 shrink-0 w-44 md:w-72">
                                    {service.title}
                                </h3>

                                {/* Description — hidden on mobile */}
                                <p className="hidden md:block text-brand-indigo/35 text-base font-light leading-relaxed flex-1 group-hover:text-brand-indigo/60 transition-colors duration-300">
                                    {service.description}
                                </p>

                                {/* Arrow */}
                                <div className="ml-auto shrink-0 w-9 h-9 md:w-11 md:h-11 rounded-full border border-brand-indigo/10 group-hover:border-brand-indigo group-hover:bg-brand-indigo flex items-center justify-center transition-all duration-300">
                                    <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-brand-indigo/25 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" />
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
