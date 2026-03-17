"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

interface ServiceCardProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    index?: number;
}

export default function ServiceCard({ title, description, icon, onClick, index = 0 }: ServiceCardProps) {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                delay: index * 0.12,
                duration: 0.7,
                ease: [0.215, 0.61, 0.355, 1],
            }}
            onClick={onClick}
            className="group relative cursor-pointer"
        >
            <div className="relative p-8 md:p-10 rounded-2xl border border-brand-indigo/[0.06] bg-white/60 backdrop-blur-sm hover:bg-white/90 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-10px_rgba(28,31,58,0.08)] hover:border-brand-sand/30 h-full">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-sand/0 to-brand-indigo/0 group-hover:from-brand-sand/5 group-hover:to-brand-indigo/[0.02] transition-all duration-500 pointer-events-none" />

                <div className="relative z-10 flex flex-col h-full">
                    {/* Icon */}
                    {icon && (
                        <div className="mb-6 p-3.5 bg-brand-indigo/[0.03] rounded-xl inline-flex w-fit text-brand-indigo group-hover:bg-brand-indigo group-hover:text-white transition-all duration-400">
                            {icon}
                        </div>
                    )}

                    {/* Title */}
                    <h3 className="text-xl font-display font-bold text-brand-indigo mb-3 tracking-tight group-hover:text-brand-indigo/90 transition-colors">
                        {title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-brand-indigo/50 leading-relaxed flex-1 group-hover:text-brand-indigo/70 transition-colors">
                        {description}
                    </p>

                    {/* Arrow */}
                    <div className="mt-6 flex items-center gap-2 text-brand-indigo/30 group-hover:text-brand-indigo transition-all duration-300">
                        <span className="text-xs font-bold uppercase tracking-[0.15em]">{t("services.learnMore")}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
