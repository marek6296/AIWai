"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/useTranslation";

interface ProcessStepProps {
    number: string;
    title: string;
    description: string;
    className: string;
    delay: number;
    icon: React.ReactNode;
}

function ProcessStep({ number, title, description, className, delay, icon }: ProcessStepProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay, duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
            className={`relative group ${className}`}
        >
            <div className="relative p-8 md:p-10 rounded-[40px] bg-white/70 backdrop-blur-xl border border-brand-indigo/[0.05] shadow-[0_30px_80px_-20px_rgba(28,31,58,0.08)] hover:shadow-[0_40px_100px_-10px_rgba(10,12,40,0.12)] transition-all duration-700 hover:border-brand-sand/30 hover:-translate-y-2 max-w-sm md:max-w-md">
                {/* Background Number */}
                <div className="absolute -top-10 -right-4 text-[120px] font-display font-bold text-brand-indigo/[0.03] select-none pointer-events-none group-hover:text-brand-indigo/[0.05] transition-colors duration-700">
                    {number}
                </div>
                
                {/* Icon Header */}
                <div className="mb-8 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-brand-indigo/5 flex items-center justify-center text-brand-indigo group-hover:bg-brand-indigo/10 group-hover:scale-110 transition-all duration-500">
                        {icon}
                    </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                    <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-sand mb-3">
                        Phase {number}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-brand-indigo mb-4 tracking-tight">
                        {title}
                    </h3>
                    <p className="text-brand-indigo/50 text-sm md:text-base leading-relaxed font-light">
                        {description}
                    </p>
                </div>

                {/* Interactive Accent */}
                <div className="absolute bottom-6 right-8 w-12 h-[1px] bg-brand-indigo/10 group-hover:w-20 group-hover:bg-brand-sand transition-all duration-700" />
            </div>
        </motion.div>
    );
}

export default function ProcessArchitecture() {
    const { t } = useTranslation();

    return (
        <div className="relative w-full py-20 px-6 overflow-visible min-h-[1000px] md:min-h-[1100px]">
            {/* ── Neural Paths (Background SVG) ── */}
            <svg 
                className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden lg:block"
                viewBox="0 0 1000 1000"
                preserveAspectRatio="xMidYMid slice"
            >
                <defs>
                    <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--brand-sand)" stopOpacity="0" />
                        <stop offset="50%" stopColor="var(--brand-sand)" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="var(--brand-sand)" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <motion.path 
                    d="M150 250 Q 500 300 850 450" 
                    fill="none" stroke="url(#pathGrad)" strokeWidth="1" strokeDasharray="5 5"
                    initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.5 }}
                />
                <motion.path 
                    d="M850 450 Q 500 700 150 850" 
                    fill="none" stroke="url(#pathGrad)" strokeWidth="1" strokeDasharray="5 5"
                    initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 2, delay: 1.2 }}
                />
            </svg>

            {/* ── Process Steps (Asymmetrical Cluster) ── */}
            <div className="relative z-10 max-w-7xl mx-auto h-full">
                {/* Step 1: Top Left */}
                <ProcessStep 
                    number="01"
                    title={t("whyUs.process.0.title")}
                    description={t("whyUs.process.0.description")}
                    className="lg:ml-[5%] lg:mt-0"
                    delay={0.2}
                    icon={
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                        </svg>
                    }
                />

                {/* Step 2: Center Right */}
                <ProcessStep 
                    number="02"
                    title={t("whyUs.process.1.title")}
                    description={t("whyUs.process.1.description")}
                    className="lg:ml-auto lg:mr-[5%] mt-24 lg:-mt-12"
                    delay={0.5}
                    icon={
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 22 4-10 4 10"/>
                        </svg>
                    }
                />

                {/* Step 3: Bottom Left / Center */}
                <ProcessStep 
                    number="03"
                    title={t("whyUs.process.2.title")}
                    description={t("whyUs.process.2.description")}
                    className="lg:ml-[15%] mt-24 lg:mt-12"
                    delay={0.8}
                    icon={
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                        </svg>
                    }
                />
            </div>

            {/* Bottom Accent Orbs */}
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-sand/5 rounded-full blur-[120px] pointer-events-none" />
        </div>
    );
}
