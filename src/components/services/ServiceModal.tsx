"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, ArrowRight } from "lucide-react";

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
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
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
                        onClick={onClose}
                        className="absolute inset-0 bg-brand-indigo/40 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-8 md:p-10 border-b border-brand-indigo/5 flex items-start justify-between bg-brand-offwhite/50">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-white rounded-2xl shadow-sm text-brand-indigo border border-brand-indigo/5">
                                    {React.cloneElement(service.icon as React.ReactElement, { size: 40 })}
                                </div>
                                <div>
                                    <h3 className="text-3xl md:text-4xl font-bold text-brand-indigo tracking-tight">
                                        {service.title}
                                    </h3>
                                    <p className="text-brand-indigo/60 mt-1 uppercase tracking-widest text-xs font-bold">Service Overview</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-brand-indigo/5 rounded-full transition-colors text-brand-indigo/40 hover:text-brand-indigo"
                            >
                                <X size={28} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12">
                            {/* What is it */}
                            <section className="space-y-4">
                                <h4 className="text-xl font-bold text-brand-indigo flex items-center gap-2">
                                    <div className="w-8 h-px bg-brand-sand" /> What is it?
                                </h4>
                                <p className="text-brand-indigo/70 text-lg leading-relaxed">
                                    {service.details?.whatIsIt || service.description}
                                </p>
                            </section>

                            {/* How it works */}
                            <section className="space-y-4">
                                <h4 className="text-xl font-bold text-brand-indigo flex items-center gap-2">
                                    <div className="w-8 h-px bg-brand-sand" /> How it works
                                </h4>
                                <p className="text-brand-indigo/70 text-lg leading-relaxed">
                                    {service.details?.howItWorks}
                                </p>
                            </section>

                            {/* What's included */}
                            <section className="space-y-6">
                                <h4 className="text-xl font-bold text-brand-indigo flex items-center gap-2">
                                    <div className="w-8 h-px bg-brand-sand" /> Key Features
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {service.details?.includes.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 p-4 bg-brand-offwhite rounded-xl border border-brand-indigo/5 hover:border-brand-sand/30 transition-colors group">
                                            <CheckCircle2 size={18} className="text-brand-sand shrink-0" />
                                            <span className="text-brand-indigo/80 text-sm font-medium">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Footer / CTA */}
                        <div className="p-8 border-t border-brand-indigo/5 bg-brand-offwhite/50 flex flex-col md:flex-row items-center justify-between gap-6">
                            <p className="text-sm text-brand-indigo/60 font-medium">Ready to transform your business?</p>
                            <button
                                onClick={() => {
                                    onClose();
                                    const element = document.getElementById('contact');
                                    element?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="w-full md:w-auto px-8 py-4 bg-brand-indigo text-white rounded-full font-bold text-sm tracking-widest uppercase hover:bg-brand-indigo/90 transition-all shadow-lg hover:shadow-brand-indigo/20 flex items-center justify-center gap-2 group"
                            >
                                Get Started <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
