"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/useTranslation";

export default function HumanVision() {
    const { t } = useTranslation();

    return (
        <div className="relative w-full py-20 px-6 sm:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    
                    {/* ── Left: Artistic Human Element ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.215, 0.61, 0.355, 1] }}
                        className="relative"
                    >
                        <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden group shadow-[0_40px_100px_-20px_rgba(28,31,58,0.15)]">
                            {/* Premium Artistic Visual (Placeholder for a human-centric photo) */}
                            <div className="absolute inset-0 bg-brand-indigo/10 flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-indigo/40 to-transparent z-10" />
                                <motion.div 
                                    className="relative z-20 p-12 text-center"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <div className="w-24 h-24 rounded-full border border-white/30 flex items-center justify-center mb-6 mx-auto backdrop-blur-md">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/>
                                        </svg>
                                    </div>
                                    <div className="text-white font-display text-xl tracking-widest uppercase">Human Intent</div>
                                </motion.div>
                            </div>
                            
                            {/* Decorative Elements */}
                            <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-white/20 z-20" />
                            <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-white/20 z-20" />
                        </div>

                        {/* Floating Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="absolute -bottom-10 -right-6 lg:-right-12 bg-white p-8 rounded-3xl shadow-[0_20px_50px_-10px_rgba(28,31,58,0.1)] border border-brand-indigo/[0.03] z-30 hidden sm:block"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-brand-sand/10 flex items-center justify-center text-brand-sand">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                                    </svg>
                                </div>
                                <div className="text-sm font-bold tracking-tight text-brand-indigo">
                                    Est. 2024
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* ── Right: Philosophy Story ── */}
                    <div className="flex flex-col justify-center">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: [0.215, 0.61, 0.355, 1] }}
                        >
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-brand-indigo mb-8 tracking-tight leading-[1.1]">
                                {t("whyUs.philosophy.title")}
                            </h2>
                            
                            <div className="space-y-6 text-brand-indigo/60 text-lg leading-relaxed font-light">
                                <p>
                                    {t("whyUs.philosophy.text1")}
                                </p>
                                <p>
                                    {t("whyUs.philosophy.text2")}
                                </p>
                            </div>

                            {/* Signature */}
                            <div className="mt-12 pt-12 border-t border-brand-indigo/[0.05]">
                                <div className="font-display text-2xl italic text-brand-indigo mb-1 opacity-80">
                                    {t("whyUs.philosophy.signature")}
                                </div>
                                <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-sand">
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
