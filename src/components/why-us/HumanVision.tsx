"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/useTranslation";

export default function HumanVision() {
    const { t } = useTranslation();

    return (
        <div className="relative w-full py-12 px-6 sm:px-12">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                    
                    {/* ── Left: Artistic Human Element (Smaller) ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-5 relative"
                    >
                        <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-[0_30px_70px_-20px_rgba(28,31,58,0.1)]">
                            {/* Premium Artistic Visual */}
                            <div className="absolute inset-0 bg-brand-indigo/5 flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-indigo/20 to-transparent z-10" />
                                <div className="relative z-20 p-8 text-center">
                                    <div className="w-16 h-16 rounded-full border border-brand-indigo/10 flex items-center justify-center mb-4 mx-auto backdrop-blur-sm">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-brand-indigo/40" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/>
                                        </svg>
                                    </div>
                                    <div className="text-brand-indigo/30 font-display text-xs tracking-[0.4em] uppercase">Vision</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Right: Philosophy Story ── */}
                    <div className="lg:col-span-7 flex flex-col justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-brand-indigo mb-6 tracking-tight leading-tight">
                                {t("whyUs.philosophy.title")}
                            </h2>
                            
                            <div className="space-y-5 text-brand-indigo/50 text-base md:text-lg leading-relaxed font-light">
                                <p>
                                    {t("whyUs.philosophy.text1")}
                                </p>
                                <p>
                                    {t("whyUs.philosophy.text2")}
                                </p>
                            </div>

                            {/* Signature */}
                            <div className="mt-10 pt-8 border-t border-brand-indigo/[0.03]">
                                <div className="font-display text-xl italic text-brand-indigo opacity-70 mb-1">
                                    {t("whyUs.philosophy.signature")}
                                </div>
                                <div className="text-[9px] uppercase tracking-[0.3em] font-bold text-brand-sand/60">
                                    Founder & Visionary
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
