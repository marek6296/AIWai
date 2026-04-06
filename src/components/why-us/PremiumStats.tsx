"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/useTranslation";

interface StatItemProps {
    value: string;
    label: string;
    className: string;
    delay: number;
}

function StatNode({ value, label, className, delay }: StatItemProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.8, ease: "easeOut" }}
            className={`absolute z-20 group pointer-events-auto ${className}`}
        >
            <motion.div
                animate={{ 
                    y: [0, -8, 0],
                }}
                transition={{ 
                    duration: 4 + Math.random() * 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                }}
                className="relative p-7 md:p-9 rounded-[40px] bg-white/80 backdrop-blur-xl border border-brand-indigo/[0.05] shadow-[0_20px_50px_-15px_rgba(28,31,58,0.06)] hover:shadow-[0_30px_70px_-10px_rgba(10,12,40,0.1)] transition-all duration-700 hover:border-brand-sand/30 hover:scale-105 cursor-default min-w-[160px] md:min-w-[200px] text-center"
            >
                {/* Glow behind */}
                <div className="absolute inset-0 bg-brand-sand/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[40px] blur-xl -z-10" />
                
                <div className="text-4xl md:text-6xl font-display font-bold text-brand-indigo mb-1 tracking-tighter">
                    {value}
                </div>
                <div className="text-[10px] md:text-[12px] text-brand-indigo/40 uppercase tracking-[0.25em] font-bold leading-none">
                    {label}
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function PremiumStats() {
    const { t } = useTranslation();
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div 
            ref={containerRef}
            className="relative w-full h-[550px] md:h-[750px] flex items-center justify-center overflow-visible my-12"
        >
            {/* ── Central Neural Core ── */}
            <div className="relative z-10 scale-75 md:scale-100">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-48 h-48 md:w-64 md:h-64 bg-brand-indigo/[0.05] rounded-full blur-[80px]" 
                />
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                >
                    <svg width="140" height="140" viewBox="0 0 100 100" className="text-brand-indigo/15">
                        <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="3 3" />
                        <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.8" fill="none" />
                        <motion.circle 
                            cx="50" cy="50" r="2" fill="currentColor" 
                            animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                    </svg>
                </motion.div>
            </div>

            {/* ── Connecting Neural Paths (Desktop Only) ── */}
            <svg 
                className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden lg:block"
                viewBox="0 0 1000 1000"
            >
                <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
                        <stop offset="50%" stopColor="currentColor" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <g className="text-brand-indigo/10">
                    <motion.path 
                        d="M500 500 Q 300 400 150 250" fill="none" stroke="url(#lineGrad)" strokeWidth="1" 
                        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 2 }}
                    />
                    <motion.path 
                        d="M500 500 Q 700 350 850 200" fill="none" stroke="url(#lineGrad)" strokeWidth="1" 
                        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.2 }}
                    />
                    <motion.path 
                        d="M500 500 Q 350 700 200 850" fill="none" stroke="url(#lineGrad)" strokeWidth="1" 
                        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.4 }}
                    />
                    <motion.path 
                        d="M500 500 Q 650 650 800 800" fill="none" stroke="url(#lineGrad)" strokeWidth="1" 
                        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.6 }}
                    />
                </g>
            </svg>

            {/* ── Floating Stat Nodes ── */}
            <div className="absolute inset-0 container mx-auto pointer-events-none">
                {/* Node 1: Top Left */}
                <StatNode 
                    value="30+" 
                    label={t("whyUs.stat.0")}
                    className="top-[5%] left-[5%] md:top-[12%] md:left-[8%]"
                    delay={0.3} 
                />
                {/* Node 2: Top Right */}
                <StatNode 
                    value="98%" 
                    label={t("whyUs.stat.1")}
                    className="top-[15%] right-[5%] md:top-[18%] md:right-[10%]"
                    delay={0.5} 
                />
                {/* Node 3: Bottom Left */}
                <StatNode 
                    value="24/7" 
                    label={t("whyUs.stat.2")}
                    className="bottom-[15%] left-[5%] md:bottom-[20%] md:left-[12%]"
                    delay={0.7} 
                />
                {/* Node 4: Bottom Right */}
                <StatNode 
                    value="3x" 
                    label={t("whyUs.stat.3")}
                    className="bottom-[5%] right-[5%] md:bottom-[10%] md:right-[15%]"
                    delay={0.9} 
                />
            </div>
        </div>
    );
}
