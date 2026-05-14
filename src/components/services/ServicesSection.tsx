"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ServiceModal from "@/components/services/ServiceModal";
import TextReveal from "@/components/animations/TextReveal";
import FadeIn from "@/components/animations/FadeIn";
import SectionBackground from "@/components/backgrounds/SectionBackground";
import { useTranslation } from "@/i18n/useTranslation";

const TAGS = ["WEB", "AI", "AI", "DIZAJN", "MARKETING"];

// Maps homepage service index (translations services.0..4) to SEO landing page slug.
const SERVICE_SLUGS = [
    "tvorba-webu",
    "ai-chatbot",
    "ai-automatizacia",
    "logo-branding",
    "sprava-socialnych-sieti",
];

export default function ServicesSection() {
    const { t } = useTranslation();
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const services = [0, 1, 2, 3, 4].map((i) => ({
        title: t(`services.${i}.title`),
        description: t(`services.${i}.description`),
        tag: TAGS[i],
        slug: SERVICE_SLUGS[i],
        details: {
            whatIsIt: t(`services.${i}.whatIsIt`),
            includes: t(`services.${i}.includes`).split("|"),
        },
    }));

    const selectedService = selectedIndex !== null ? services[selectedIndex] : null;

    return (
        <section id="services" className="py-16 md:py-28 bg-char relative overflow-hidden">
            <SectionBackground variant="default" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="mb-12 md:mb-20 max-w-3xl">
                    <TextReveal
                        as="h2"
                        className="text-[2.25rem] md:text-6xl font-display font-bold tracking-tight text-cream mb-4 md:mb-5 leading-[1.1]"
                    >
                        {t("services.heading")}
                    </TextReveal>
                    <p className="text-cream/55 text-base md:text-lg font-light">
                        {t("services.subheading")}
                    </p>
                </div>

                {/* Services list */}
                <div>
                    {services.map((service, index) => (
                        <FadeIn key={index} delay={index * 0.06}>
                            <button
                                onClick={() => setSelectedIndex(index)}
                                className={`group w-full text-left border-t border-cream/10 py-6 md:py-9 flex items-start md:items-center gap-4 md:gap-10 hover:bg-cream/[0.03] -mx-6 px-6 transition-all duration-300 ${index === 4 ? "border-b" : ""}`}
                            >
                                {/* Number */}
                                <span className="text-[11px] font-bold tracking-[0.25em] text-gold/70 group-hover:text-gold transition-colors duration-300 shrink-0 w-6 md:w-7 pt-1 md:pt-0">
                                    {String(index + 1).padStart(2, "0")}
                                </span>

                                {/* Title + mobile description */}
                                <div className="flex-1 min-w-0 md:w-72 md:flex-none md:shrink-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-display font-bold text-cream tracking-tight text-lg md:text-3xl group-hover:translate-x-1 transition-transform duration-300">
                                            {service.title}
                                        </h3>
                                        <span className="text-[9px] font-bold tracking-[0.25em] text-gold/80 bg-gold/10 border border-gold/25 px-2 py-0.5 rounded-full hidden sm:inline-block group-hover:border-gold/60 group-hover:text-gold transition-colors duration-300">
                                            {service.tag}
                                        </span>
                                    </div>
                                    <p className="md:hidden text-cream/55 text-[13px] font-light leading-snug mt-1 group-hover:text-cream/70 transition-colors duration-300">
                                        {service.description}
                                    </p>
                                </div>

                                {/* Description — desktop inline */}
                                <p className="hidden md:block text-cream/40 text-base font-light leading-relaxed flex-1 group-hover:text-cream/70 transition-colors duration-300">
                                    {service.description}
                                </p>

                                {/* Arrow */}
                                <div className="ml-auto shrink-0 w-9 h-9 md:w-11 md:h-11 rounded-full border border-cream/15 group-hover:border-gold group-hover:bg-gold flex items-center justify-center transition-all duration-300">
                                    <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-cream/50 group-hover:text-ink group-hover:translate-x-0.5 transition-all duration-300" />
                                </div>
                            </button>
                            {/* SEO-friendly crawlable link to the service landing page.
                                Visible to users as a discreet "Detail" link, indexed by Google. */}
                            <div className="-mx-6 px-6 md:pl-[88px] -mt-2 mb-1">
                                <Link
                                    href={`/sluzby/${service.slug}`}
                                    className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.18em] uppercase text-cream/40 hover:text-gold transition-colors"
                                >
                                    Detail služby
                                    <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
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
