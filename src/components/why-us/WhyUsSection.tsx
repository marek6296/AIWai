"use client";
import React from "react";
import { motion } from "framer-motion";
import TextReveal from "@/components/animations/TextReveal";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { useTranslation } from "@/i18n/useTranslation";
import PremiumIcon from "@/components/ui/PremiumIcon";
import PremiumStats from "./PremiumStats";

const ICONS: ("premium-design" | "ai-agents" | "growth")[] = [
    "premium-design",
    "ai-agents",
    "growth",
];

export default function WhyUsSection() {
    const { t } = useTranslation();

    const features = [0, 1, 2].map((i) => ({
        title: t(`whyUs.feature.${i}.title`),
        description: t(`whyUs.feature.${i}.description`),
        icon: <PremiumIcon type={ICONS[i]} size={42} />,
    }));

    return (
        <section id="about" className="py-16 md:py-24 bg-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(28,31,58,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(28,31,58,0.015)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
            <div className="absolute top-[30%] left-[-5%] w-[350px] h-[350px] bg-brand-sand/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[10%] right-[-5%] w-[300px] h-[300px] bg-brand-indigo/[0.03] rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto relative z-10">
                {/* Header */}
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <TextReveal
                        as="h2"
                        className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-brand-indigo mb-6 tracking-tight"
                    >
                        {t("whyUs.heading")}
                    </TextReveal>
                    <ScrollReveal delay={0.2}>
                        <p className="text-brand-indigo/40 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
                            {t("whyUs.subheading")}
                        </p>
                    </ScrollReveal>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-24">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: i * 0.15, duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
                        >
                            <div className="p-8 md:p-10 rounded-2xl border border-brand-indigo/[0.06] bg-white/60 backdrop-blur-sm hover:bg-white/90 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-10px_rgba(28,31,58,0.08)] hover:border-brand-sand/30 h-full group">
                                <div className="mb-6 p-4 bg-brand-indigo/[0.03] rounded-xl inline-flex group-hover:bg-brand-indigo/[0.06] transition-colors duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-display font-bold text-brand-indigo mb-4 tracking-tight">{feature.title}</h3>
                                <p className="text-brand-indigo/50 leading-relaxed text-[15px] group-hover:text-brand-indigo/70 transition-colors">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Premium Neural Stats Section - UNIQUE & BEAUTIFUL */}
                <PremiumStats />
            </div>
        </section>
    );
}
