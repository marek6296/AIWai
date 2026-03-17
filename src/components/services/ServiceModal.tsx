"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, ArrowRight } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

interface ServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    service: {
        title: string;
        description: string;
        icon: React.ReactNode;
        details?: {
            whatIsIt: string;
            howItWorks: string;
            includes: string[];
        };
    } | null;
}

export default function ServiceModal({ isOpen, onClose, service }: ServiceModalProps) {
    const { t } = useTranslation();

    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, [isOpen]);

    if (!service) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-brand-indigo/30 backdrop-blur-xl"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 30, stiffness: 350 }}
                        className="relative w-full max-w-3xl max-h-[90vh] bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_30px_100px_-20px_rgba(28,31,58,0.15)] overflow-hidden flex flex-col border border-white/50"
                    >
                        {/* Header */}
                        <div className="p-8 md:p-10 border-b border-brand-indigo/[0.06] flex items-start justify-between">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-brand-indigo rounded-2xl text-white shadow-lg shadow-brand-indigo/20">
                                    {React.cloneElement(service.icon as React.ReactElement, { size: 32 })}
                                </div>
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-display font-bold text-brand-indigo tracking-tight">
                                        {service.title}
                                    </h3>
                                    <p className="text-brand-indigo/40 mt-1 uppercase tracking-[0.15em] text-[11px] font-bold">{t("modal.serviceOverview")}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2.5 hover:bg-brand-indigo/5 rounded-xl transition-colors text-brand-indigo/30 hover:text-brand-indigo"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div
                            data-lenis-prevent
                            className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10"
                        >
                            {/* What is it */}
                            <section className="space-y-4">
                                <h4 className="text-lg font-display font-bold text-brand-indigo flex items-center gap-3">
                                    <div className="w-8 h-px bg-brand-sand" /> {t("modal.whatIsIt")}
                                </h4>
                                <p className="text-brand-indigo/60 text-base leading-relaxed">
                                    {service.details?.whatIsIt || service.description}
                                </p>
                            </section>

                            {/* How it works */}
                            <section className="space-y-4">
                                <h4 className="text-lg font-display font-bold text-brand-indigo flex items-center gap-3">
                                    <div className="w-8 h-px bg-brand-sand" /> {t("modal.howItWorks")}
                                </h4>
                                <p className="text-brand-indigo/60 text-base leading-relaxed">
                                    {service.details?.howItWorks}
                                </p>
                            </section>

                            {/* Features */}
                            <section className="space-y-5">
                                <h4 className="text-lg font-display font-bold text-brand-indigo flex items-center gap-3">
                                    <div className="w-8 h-px bg-brand-sand" /> {t("modal.keyFeatures")}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {service.details?.includes.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 p-4 bg-brand-indigo/[0.02] rounded-xl border border-brand-indigo/[0.04] hover:border-brand-sand/30 transition-all group">
                                            <CheckCircle2 size={16} className="text-brand-sand shrink-0" />
                                            <span className="text-brand-indigo/70 text-sm">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Footer CTA */}
                        <div className="p-8 border-t border-brand-indigo/[0.06] flex flex-col md:flex-row items-center justify-between gap-5">
                            <p className="text-sm text-brand-indigo/40 font-medium">{t("modal.readyToTransform")}</p>
                            <button
                                onClick={() => {
                                    onClose();
                                    const element = document.getElementById('contact');
                                    element?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="w-full md:w-auto px-8 py-3.5 bg-brand-indigo text-white rounded-full font-bold text-xs tracking-[0.15em] uppercase hover:bg-brand-indigo/90 transition-all shadow-lg shadow-brand-indigo/10 hover:shadow-brand-indigo/20 flex items-center justify-center gap-2 group"
                            >
                                {t("modal.getStarted")} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
