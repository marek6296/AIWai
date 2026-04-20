"use client";

import { useState } from "react";
import MagneticButton from "@/components/ui/MagneticButton";
import TextReveal from "@/components/animations/TextReveal";
import FadeIn from "@/components/animations/FadeIn";
import { useTranslation } from "@/i18n/useTranslation";

export default function ContactSection() {
    const { t } = useTranslation();
    const [focused, setFocused] = useState<string | null>(null);
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        projectType: "Company Website",
        message: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");
        try {
            const [dbRes, webhookRes] = await Promise.all([
                fetch("/api/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }),
                fetch("https://hook.eu1.make.com/pmxc2wt7srxq6bv6qc6jezd11tb7a3qk", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...formData, source: "Web Form", timestamp: new Date().toISOString() }),
                }),
            ]);
            if (dbRes.ok || webhookRes.ok) {
                setStatus("success");
                setFormData({ name: "", email: "", projectType: "Company Website", message: "" });
            } else {
                setStatus("error");
            }
        } catch {
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
        <section id="contact" className="py-28 md:py-36 bg-white relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-indigo/10 to-transparent" />
            <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-brand-sand/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[10%] left-[-5%] w-[300px] h-[300px] bg-brand-indigo/[0.03] rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center relative z-10">

                {/* Text */}
                <FadeIn>
                    <TextReveal
                        as="h2"
                        className="text-5xl md:text-7xl font-display font-bold text-brand-indigo mb-8 tracking-tight"
                    >
                        {t("contact.heading")}
                    </TextReveal>
                    <p className="text-lg text-brand-indigo/40 max-w-lg mb-12 font-light leading-relaxed">
                        {t("contact.subheading")}
                    </p>
                    <div className="flex flex-col gap-3">
                        <a href="mailto:marek@aiwai.app" className="inline-flex items-center gap-3 px-5 py-3 rounded-xl border border-brand-indigo/10 bg-brand-indigo/[0.03] hover:bg-brand-indigo hover:text-white hover:border-brand-indigo text-brand-indigo transition-all duration-200 group w-fit">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                            <span className="text-sm font-medium">marek@aiwai.app</span>
                        </a>
                        <a href="tel:+421902876198" className="inline-flex items-center gap-3 px-5 py-3 rounded-xl border border-brand-indigo/10 bg-brand-indigo/[0.03] hover:bg-brand-indigo hover:text-white hover:border-brand-indigo text-brand-indigo transition-all duration-200 group w-fit">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.61 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                            <span className="text-sm font-medium">+421 902 876 198</span>
                        </a>
                    </div>
                </FadeIn>

                {/* Form */}
                <FadeIn delay={0.1}>
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-8 p-8 md:p-10 rounded-2xl border border-brand-indigo/[0.06] bg-white/60 backdrop-blur-sm relative shadow-[0_10px_40px_-10px_rgba(28,31,58,0.04)]"
                    >
                        {/* Success overlay */}
                        {status === "success" && (
                            <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-20 flex flex-col items-center justify-center text-center p-6 rounded-2xl">
                                <div className="w-14 h-14 bg-brand-indigo text-white rounded-full flex items-center justify-center mb-4">
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
                                <h3 className="text-2xl font-display font-bold text-brand-indigo mb-2">{t("contact.success.title")}</h3>
                                <p className="text-brand-indigo/50 text-sm">{t("contact.success.text")}</p>
                                <button onClick={() => setStatus("idle")} className="mt-6 text-brand-indigo font-medium underline text-sm">
                                    {t("contact.success.again")}
                                </button>
                            </div>
                        )}

                        {/* Name */}
                        <div className="relative group">
                            <label className={`absolute left-0 transition-all duration-300 pointer-events-none text-sm ${focused === "name" || formData.name ? "-top-6 text-brand-indigo" : "top-2.5 text-brand-indigo/30"}`}>
                                {t("contact.label.name")}
                            </label>
                            <input
                                type="text" required value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                onFocus={() => setFocused("name")}
                                onBlur={(e) => !e.target.value && setFocused(null)}
                                className="w-full bg-transparent border-b border-brand-indigo/10 py-2.5 text-brand-indigo outline-none focus:border-brand-indigo/40 transition-all"
                            />
                        </div>

                        {/* Email */}
                        <div className="relative group">
                            <label className={`absolute left-0 transition-all duration-300 pointer-events-none text-sm ${focused === "email" || formData.email ? "-top-6 text-brand-indigo" : "top-2.5 text-brand-indigo/30"}`}>
                                {t("contact.label.email")}
                            </label>
                            <input
                                type="email" required value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                onFocus={() => setFocused("email")}
                                onBlur={(e) => !e.target.value && setFocused(null)}
                                className="w-full bg-transparent border-b border-brand-indigo/10 py-2.5 text-brand-indigo outline-none focus:border-brand-indigo/40 transition-all"
                            />
                        </div>

                        {/* Project Type */}
                        <div className="relative">
                            <label className="text-sm text-brand-indigo/40 block mb-2">{t("contact.label.projectType")}</label>
                            <select
                                value={formData.projectType}
                                onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                                className="w-full bg-transparent border-b border-brand-indigo/10 py-2.5 text-brand-indigo outline-none focus:border-brand-indigo/40 transition-all appearance-none cursor-pointer"
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
                            <label className={`absolute left-0 transition-all duration-300 pointer-events-none text-sm ${focused === "message" || formData.message ? "-top-6 text-brand-indigo" : "top-2.5 text-brand-indigo/30"}`}>
                                {t("contact.label.message")}
                            </label>
                            <textarea
                                rows={4} required value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                onFocus={() => setFocused("message")}
                                onBlur={(e) => !e.target.value && setFocused(null)}
                                className="w-full bg-transparent border-b border-brand-indigo/10 py-2.5 text-brand-indigo outline-none focus:border-brand-indigo/40 transition-all resize-none"
                            />
                        </div>

                        <div className="pt-4 flex justify-end">
                            <MagneticButton type="submit" disabled={status === "sending"}>
                                {status === "sending" ? t("contact.sending") : t("contact.button")}
                            </MagneticButton>
                        </div>
                    </form>
                </FadeIn>
            </div>
        </section>
    );
}
