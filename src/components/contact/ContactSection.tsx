"use client";

import { useEffect, useState } from "react";
import MagneticButton from "@/components/ui/MagneticButton";
import TextReveal from "@/components/animations/TextReveal";
import FadeIn from "@/components/animations/FadeIn";
import SectionBackground from "@/components/backgrounds/SectionBackground";
import { useTranslation } from "@/i18n/useTranslation";

export default function ContactSection() {
    const { t } = useTranslation();
    const [focused, setFocused] = useState<string | null>(null);
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        projectType: "Company Website",
        message: "",
    });

    useEffect(() => {
        if (typeof window === "undefined") return;
        const params = new URLSearchParams(window.location.search);
        const service = params.get("service");
        if (!service) return;
        const validValues = new Set([
            "Logo Basic", "Logo + Brand", "Social Media Graphics",
            "Presentation Website", "Company Website", "E-shop",
            "Chatbot Basic", "Chatbot Pro",
            "Automation Starter", "Automation Pro / Enterprise",
            "Social Starter", "Social Pro + Ads", "Other",
        ]);
        if (validValues.has(service)) {
            setFormData((prev) => ({ ...prev, projectType: service }));
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");
        setErrorMessage("");
        try {
            // Fire Make webhook in background (non-blocking)
            fetch("https://hook.eu1.make.com/pmxc2wt7srxq6bv6qc6jezd11tb7a3qk", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, source: "Web Form", timestamp: new Date().toISOString() }),
            }).catch(() => {/* webhook failure is non-critical */});

            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (data.success) {
                setStatus("success");
                setFormData({ name: "", email: "", phone: "", projectType: "Company Website", message: "" });
            } else {
                setErrorMessage(data.error ?? t("contact.error.unknown"));
                setStatus("error");
            }
        } catch {
            setErrorMessage(t("contact.error.network"));
            setStatus("error");
        }
    };

    const projectGroups = [
        {
            group: t("contact.group.design"),
            options: [
                { value: "Logo Basic", label: t("contact.product.logoBasic") },
                { value: "Logo + Brand", label: t("contact.product.logoBrand") },
                { value: "Social Media Graphics", label: t("contact.product.socialGraphics") },
            ],
        },
        {
            group: t("contact.group.web"),
            options: [
                { value: "Presentation Website", label: t("contact.product.landingPage") },
                { value: "Company Website", label: t("contact.product.companyWeb") },
                { value: "E-shop", label: t("contact.product.eshop") },
            ],
        },
        {
            group: t("contact.group.chatbot"),
            options: [
                { value: "Chatbot Basic", label: t("contact.product.chatbotBasic") },
                { value: "Chatbot Pro", label: t("contact.product.chatbotPro") },
            ],
        },
        {
            group: t("contact.group.automation"),
            options: [
                { value: "Automation Starter", label: t("contact.product.automationStarter") },
                { value: "Automation Pro / Enterprise", label: t("contact.product.automationPro") },
            ],
        },
        {
            group: t("contact.group.social"),
            options: [
                { value: "Social Starter", label: t("contact.product.socialStarter") },
                { value: "Social Pro + Ads", label: t("contact.product.socialPro") },
            ],
        },
    ];

    return (
        <section id="contact" className="py-20 md:py-36 bg-char relative overflow-hidden">
            <SectionBackground variant="default" />

            <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">

                {/* Text */}
                <FadeIn>
                    <TextReveal
                        as="h2"
                        className="text-[2.5rem] md:text-7xl font-display font-bold text-cream mb-6 md:mb-8 tracking-tight leading-[1.05]"
                    >
                        {t("contact.heading")}
                    </TextReveal>
                    <p className="text-base md:text-lg text-cream/60 max-w-lg mb-8 md:mb-12 font-light leading-relaxed">
                        {t("contact.subheading")}
                    </p>
                    <div className="flex flex-col gap-3">
                        <a href="mailto:marek@aiwai.app" className="inline-flex items-center gap-3 px-5 py-3 rounded-xl border border-cream/15 bg-cream/[0.04] hover:bg-gold hover:text-ink hover:border-gold text-cream transition-all duration-200 group w-fit">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                            <span className="text-sm font-medium">marek@aiwai.app</span>
                        </a>
                        <a href="tel:+421902876198" className="inline-flex items-center gap-3 px-5 py-3 rounded-xl border border-cream/15 bg-cream/[0.04] hover:bg-gold hover:text-ink hover:border-gold text-cream transition-all duration-200 group w-fit">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.61 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                            <span className="text-sm font-medium">+421 902 876 198</span>
                        </a>
                    </div>
                </FadeIn>

                {/* Form */}
                <FadeIn delay={0.1}>
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-7 md:space-y-8 p-6 md:p-10 rounded-2xl border border-cream/10 bg-cream/[0.03] backdrop-blur-md relative shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]"
                    >
                        {/* Success overlay */}
                        {status === "success" && (
                            <div className="absolute inset-0 bg-char/95 backdrop-blur-md z-20 flex flex-col items-center justify-center text-center p-6 rounded-2xl border border-cream/10">
                                <div className="w-14 h-14 bg-gold text-ink rounded-full flex items-center justify-center mb-4">
                                    <svg
                                        className="w-8 h-8 checkmark-draw"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-display font-bold text-cream mb-2">{t("contact.success.title")}</h3>
                                <p className="text-cream/60 text-sm">{t("contact.success.text")}</p>
                                <button onClick={() => setStatus("idle")} className="mt-6 text-gold font-medium underline text-sm">
                                    {t("contact.success.again")}
                                </button>
                            </div>
                        )}

                        {/* Error overlay */}
                        {status === "error" && (
                            <div className="absolute inset-0 bg-char/95 backdrop-blur-md z-20 flex flex-col items-center justify-center text-center p-6 rounded-2xl border border-cream/10">
                                <div className="w-14 h-14 bg-red-500/10 border border-red-500/30 text-red-400 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-display font-bold text-cream mb-2">{t("contact.error.title")}</h3>
                                <p className="text-cream/60 text-sm max-w-xs">{errorMessage}</p>
                                <button
                                    onClick={() => setStatus("idle")}
                                    className="mt-6 px-5 py-2.5 bg-gold text-ink rounded-full text-sm font-medium hover:bg-gold-bright transition-colors"
                                >
                                    {t("contact.error.retry")}
                                </button>
                            </div>
                        )}

                        {/* Name */}
                        <div className="relative group">
                            <label className={`absolute left-0 transition-all duration-300 pointer-events-none text-sm ${focused === "name" || formData.name ? "-top-6 text-gold" : "top-2.5 text-cream/40"}`}>
                                {t("contact.label.name")}
                            </label>
                            <input
                                type="text" required value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                onFocus={() => setFocused("name")}
                                onBlur={(e) => !e.target.value && setFocused(null)}
                                className="w-full bg-transparent border-b border-cream/15 py-2.5 text-cream outline-none focus:border-gold/60 transition-all"
                            />
                        </div>

                        {/* Email */}
                        <div className="relative group">
                            <label className={`absolute left-0 transition-all duration-300 pointer-events-none text-sm ${focused === "email" || formData.email ? "-top-6 text-gold" : "top-2.5 text-cream/40"}`}>
                                {t("contact.label.email")}
                            </label>
                            <input
                                type="email" required value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                onFocus={() => setFocused("email")}
                                onBlur={(e) => !e.target.value && setFocused(null)}
                                className="w-full bg-transparent border-b border-cream/15 py-2.5 text-cream outline-none focus:border-gold/60 transition-all"
                            />
                        </div>

                        {/* Phone */}
                        <div className="relative group">
                            <label className={`absolute left-0 transition-all duration-300 pointer-events-none text-sm ${focused === "phone" || formData.phone ? "-top-6 text-gold" : "top-2.5 text-cream/40"}`}>
                                {t("contact.label.phone.optional")}
                            </label>
                            <input
                                type="tel" value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                onFocus={() => setFocused("phone")}
                                onBlur={(e) => !e.target.value && setFocused(null)}
                                className="w-full bg-transparent border-b border-cream/15 py-2.5 text-cream outline-none focus:border-gold/60 transition-all"
                            />
                        </div>

                        {/* Project Type */}
                        <div className="relative">
                            <label className="text-sm text-cream/50 block mb-2">{t("contact.label.projectType")}</label>
                            <select
                                value={formData.projectType}
                                onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                                className="w-full bg-transparent border-b border-cream/15 py-2.5 text-cream outline-none focus:border-gold/60 transition-all appearance-none cursor-pointer [&>option]:bg-char [&>option]:text-cream [&>optgroup]:bg-char [&>optgroup]:text-gold"
                            >
                                {projectGroups.map((g) => (
                                    <optgroup key={g.group} label={g.group}>
                                        {g.options.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </optgroup>
                                ))}
                                <option value="Other">{t("contact.projectType.other")}</option>
                            </select>
                        </div>

                        {/* Message */}
                        <div className="relative group">
                            <label className={`absolute left-0 transition-all duration-300 pointer-events-none text-sm ${focused === "message" || formData.message ? "-top-6 text-gold" : "top-2.5 text-cream/40"}`}>
                                {t("contact.label.message")}
                            </label>
                            <textarea
                                rows={4} required value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                onFocus={() => setFocused("message")}
                                onBlur={(e) => !e.target.value && setFocused(null)}
                                className="w-full bg-transparent border-b border-cream/15 py-2.5 text-cream outline-none focus:border-gold/60 transition-all resize-none"
                            />
                        </div>

                        <div className="pt-4 flex justify-end">
                            <MagneticButton type="submit" variant="gold" disabled={status === "sending"}>
                                {status === "sending" ? t("contact.sending") : t("contact.button")}
                            </MagneticButton>
                        </div>
                    </form>
                </FadeIn>
            </div>
        </section>
    );
}
