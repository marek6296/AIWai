"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, ArrowRight } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

interface ServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    index: number;
    service: {
        title: string;
        description: string;
        details?: {
            whatIsIt: string;
            includes: string[];
        };
    } | null;
}

export default function ServiceModal({ isOpen, onClose, service, index }: ServiceModalProps) {
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (isOpen) {
            const id = requestAnimationFrame(() => setVisible(true));
            return () => cancelAnimationFrame(id);
        } else {
            setVisible(false);
        }
    }, [isOpen]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        document.documentElement.style.overflow = isOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
        };
    }, [isOpen]);

    if (!service || !mounted) return null;
    if (!isOpen && !visible) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center md:p-6">
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-brand-indigo/25 backdrop-blur-xl transition-opacity duration-300"
                style={{ opacity: visible ? 1 : 0 }}
            />

            {/* Modal */}
            <div
                className="relative w-full md:max-w-2xl max-h-[92vh] md:max-h-[85vh] bg-white rounded-t-3xl md:rounded-3xl shadow-[0_-20px_80px_-10px_rgba(28,31,58,0.12)] md:shadow-[0_30px_100px_-20px_rgba(28,31,58,0.15)] overflow-hidden flex flex-col border-t border-white/50 md:border transition-all duration-400"
                style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(40px)",
                }}
            >
                {/* Drag handle — mobile only */}
                <div className="md:hidden flex justify-center pt-4 pb-2 shrink-0">
                    <div className="w-10 h-1 rounded-full bg-brand-indigo/10" />
                </div>

                {/* Header */}
                <div className="px-8 md:px-10 pt-4 md:pt-8 pb-6 md:pb-7 border-b border-brand-indigo/[0.06] flex items-start justify-between shrink-0">
                    <div>
                        <span className="text-[10px] font-bold tracking-[0.3em] text-brand-sand/60 uppercase">
                            {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-2xl md:text-3xl font-display font-bold text-brand-indigo tracking-tight mt-1">
                            {service.title}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2.5 hover:bg-brand-indigo/5 rounded-xl transition-colors text-brand-indigo/30 hover:text-brand-indigo mt-1"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-8 md:px-10 py-7 md:py-8 space-y-8">
                    {/* What it is */}
                    <p className="text-brand-indigo/60 text-base md:text-lg leading-relaxed font-light">
                        {service.details?.whatIsIt || service.description}
                    </p>

                    {/* Includes */}
                    {service.details?.includes && service.details.includes.length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-indigo/30 mb-4">
                                {t("modal.keyFeatures")}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {service.details.includes.map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3 py-3 px-4 rounded-xl bg-brand-indigo/[0.025] border border-brand-indigo/[0.04] hover:border-brand-sand/30 transition-colors"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-sand shrink-0" />
                                        <span className="text-brand-indigo/65 text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 md:px-10 py-5 md:py-6 border-t border-brand-indigo/[0.06] shrink-0">
                    <button
                        onClick={() => {
                            onClose();
                            const element = document.getElementById("contact");
                            element?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="w-full py-4 bg-brand-indigo text-white rounded-2xl font-bold text-xs tracking-[0.15em] uppercase hover:bg-brand-indigo/90 transition-all shadow-lg shadow-brand-indigo/10 flex items-center justify-center gap-2 group"
                    >
                        {t("modal.getStarted")} <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
