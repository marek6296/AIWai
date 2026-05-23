"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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

export default function ServiceModal({ isOpen, onClose, service }: ServiceModalProps) {
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
            {/* Backdrop — deep blur, near-black */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-char/85 backdrop-blur-xl transition-opacity duration-300"
                style={{ opacity: visible ? 1 : 0 }}
            />

            {/* Modal */}
            <div
                className="relative w-full md:max-w-2xl max-h-[92vh] md:max-h-[85vh] rounded-t-3xl md:rounded-3xl overflow-hidden flex flex-col transition-all duration-500 ease-out"
                style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(40px)",
                    background: "linear-gradient(180deg, #0E0E14 0%, #0A0A0F 100%)",
                    border: "1px solid rgba(201, 168, 117, 0.18)",
                    boxShadow: "0 40px 120px -20px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255,255,255,0.03) inset",
                }}
            >
                {/* Subtle gold ambient glow inside the modal — top-left + bottom-right */}
                <div aria-hidden="true" className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(201,168,117,0.10) 0%, transparent 65%)" }} />
                <div aria-hidden="true" className="absolute -bottom-32 -right-32 w-[420px] h-[420px] rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(201,168,117,0.06) 0%, transparent 70%)" }} />

                {/* Drag handle — mobile only */}
                <div className="md:hidden flex justify-center pt-4 pb-2 shrink-0 relative z-10">
                    <div className="w-12 h-1 bg-gold/30" />
                </div>

                {/* Header */}
                <div className="relative z-10 px-7 md:px-10 pt-4 md:pt-9 pb-6 md:pb-7 flex items-start justify-between shrink-0">
                    <div className="flex-1 pr-4">
                        <div className="mb-3 flex items-center gap-3">
                            <span className="h-px w-10 bg-gold/70" />
                            <span className="text-[10px] font-bold tracking-[0.35em] text-gold uppercase">
                                {service.tag}
                            </span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-display font-bold text-cream tracking-tight leading-[1.15]">
                            {service.title}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Zavrieť"
                        className="shrink-0 w-10 h-10 rounded-full border border-cream/15 hover:border-gold/60 hover:bg-gold/10 transition-all duration-200 flex items-center justify-center group"
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            className="text-cream/50 group-hover:text-gold group-hover:rotate-90 transition-all duration-300"
                        >
                            <path d="M6 6L18 18M6 18L18 6" />
                        </svg>
                    </button>
                </div>

                {/* Thin gold divider with center fade */}
                <div aria-hidden="true" className="relative z-10 mx-7 md:mx-10 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

                {/* Scrollable body */}
                <div className="relative z-10 flex-1 overflow-y-auto px-7 md:px-10 py-7 md:py-9 space-y-9">
                    {/* What it is */}
                    <p className="text-cream/75 text-[15px] md:text-lg leading-relaxed font-light">
                        {service.details?.whatIsIt || service.description}
                    </p>

                    {/* Includes */}
                    {service.details?.includes && service.details.includes.length > 0 && (
                        <div>
                            <div className="flex items-center gap-3 mb-5">
                                <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-gold/80">
                                    {t("modal.keyFeatures")}
                                </span>
                                <span className="h-px flex-1 bg-gradient-to-r from-gold/25 to-transparent" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {service.details.includes.map((item, i) => (
                                    <div
                                        key={i}
                                        className="group relative flex items-center gap-3 py-3 pl-4 pr-4 rounded-xl bg-cream/[0.025] border border-cream/[0.08] hover:border-gold/40 hover:bg-cream/[0.045] transition-all duration-300 overflow-hidden"
                                    >
                                        {/* Vertical gold accent — animates wider on hover */}
                                        <span
                                            aria-hidden="true"
                                            className="absolute left-0 top-3 bottom-3 w-[2px] bg-gold/60 group-hover:bg-gold group-hover:top-1.5 group-hover:bottom-1.5 transition-all duration-300"
                                        />
                                        <span className="text-cream/80 group-hover:text-cream text-[13px] md:text-sm font-light tracking-wide transition-colors duration-200 pl-2">
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="relative z-10 px-7 md:px-10 py-5 md:py-6 shrink-0 border-t border-cream/[0.08]">
                    <button
                        onClick={() => {
                            onClose();
                            const element = document.getElementById("contact");
                            element?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="relative w-full py-4 font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-3 group overflow-hidden text-ink"
                        style={{
                            background: "linear-gradient(135deg, #D4B27F 0%, #B49364 55%, #8C6F3F 100%)",
                            boxShadow: "0 10px 30px -8px rgba(140,111,63,0.5), 0 1px 0 rgba(255,255,255,0.18) inset, 0 -2px 6px rgba(0,0,0,0.25) inset",
                        }}
                    >
                        {/* Subtle shine sweep on hover */}
                        <span
                            aria-hidden="true"
                            className="absolute inset-y-0 -left-[80%] w-1/3 skew-x-[-20deg] bg-white/20 group-hover:left-[120%] transition-all duration-700 ease-out pointer-events-none"
                        />
                        <span className="relative">{t("modal.getStarted")}</span>
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            className="relative group-hover:translate-x-1 transition-transform duration-300"
                        >
                            <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
