"use client";
import React, { useState } from "react";
import ServiceCard from "@/components/services/ServiceCard";
import ServiceModal from "@/components/services/ServiceModal";
import TextReveal from "@/components/animations/TextReveal";
import { Bot, Cpu, Palette, Sparkles } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

const ICONS = [
    <Bot size={28} key="bot" />,
    <Sparkles size={28} key="sparkles" />,
    <Cpu size={28} key="cpu" />,
    <Palette size={28} key="palette" />,
];

export default function ServicesSection() {
    const { t } = useTranslation();
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const services = [0, 1, 2, 3].map((i) => ({
        title: t(`services.${i}.title`),
        description: t(`services.${i}.description`),
        icon: ICONS[i],
        details: {
            whatIsIt: t(`services.${i}.whatIsIt`),
            howItWorks: t(`services.${i}.howItWorks`),
            includes: t(`services.${i}.includes`).split("|"),
        },
    }));

    const selectedService = selectedIndex !== null ? services[selectedIndex] : null;

    return (
        <section id="services" className="py-16 md:py-24 bg-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-indigo/10 to-transparent" />
            <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-brand-sand/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center mb-20 space-y-5">
                    <TextReveal
                        as="h2"
                        className="text-4xl md:text-6xl font-display font-bold tracking-tight text-brand-indigo"
                    >
                        {t("services.heading")}
                    </TextReveal>
                    <p className="text-brand-indigo/40 max-w-xl mx-auto text-lg font-light">
                        {t("services.subheading")}
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {services.map((service, index) => (
                        <ServiceCard
                            key={index}
                            {...service}
                            index={index}
                            onClick={() => setSelectedIndex(index)}
                        />
                    ))}
                </div>
            </div>

            <ServiceModal
                isOpen={selectedIndex !== null}
                onClose={() => setSelectedIndex(null)}
                service={selectedService}
            />
        </section>
    );
}
