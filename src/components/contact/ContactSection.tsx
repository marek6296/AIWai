"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import MagneticButton from "@/components/ui/MagneticButton";
import TextReveal from "@/components/animations/TextReveal";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { useTranslation } from "@/i18n/useTranslation";

export default function ContactSection() {
    const { t } = useTranslation();
    const [focused, setFocused] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        projectType: "Web Development",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        try {
            // 1. Save to Supabase via our local API (Server-side)
            const dbPromise = fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            // 2. Send to Make.com Webhook (Trigger AI automation)
            const webhookPromise = fetch("https://hook.eu1.make.com/pmxc2wt7srxq6bv6qc6jezd11tb7a3qk", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    source: "Web Form",
                    timestamp: new Date().toISOString()
                })
            });

            const [dbRes, webhookRes] = await Promise.all([dbPromise, webhookPromise]);

            if (dbRes.ok || webhookRes.ok) {
                setStatus('success');
                setFormData({ name: "", email: "", projectType: "Web Development", message: "" });
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Submission error:', error);
            setStatus('error');
        }
    };

    const projectTypes = [
        { value: "Web Development", label: t("contact.projectType.web") },
        { value: "AI Integration", label: t("contact.projectType.ai") },
        { value: "Design System", label: t("contact.projectType.design") },
        { value: "Other", label: t("contact.projectType.other") },
    ];

    return (
        <section id="contact" className="py-28 md:py-36 bg-white relative overflow-hidden">
            {/* Top border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-indigo/10 to-transparent" />

            {/* Background Orbs */}
            <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-brand-sand/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[10%] left-[-5%] w-[300px] h-[300px] bg-brand-indigo/[0.03] rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center relative z-10">

                {/* Text Content */}
                <ScrollReveal direction="left">
                    <div>
                        <TextReveal
                            as="h2"
                            className="text-5xl md:text-7xl font-display font-bold text-brand-indigo mb-8 tracking-tight"
                        >
                            {t("contact.heading")}
                        </TextReveal>
                        <p className="text-lg text-brand-indigo/40 max-w-lg mb-12 font-light leading-relaxed">
                            {t("contact.subheading")}
                        </p>

                        <div className="flex flex-col gap-3 text-brand-indigo/50">
                            <a href="mailto:dony.jaij.sk@gmail.com" className="hover:text-brand-indigo transition-colors text-base">dony.jaij.sk@gmail.com</a>
                            <a href="tel:+421902876198" className="hover:text-brand-indigo transition-colors text-base">+421 902 876 198</a>
                        </div>
                    </div>
                </ScrollReveal>

                {/* Form */}
                <ScrollReveal direction="right" delay={0.15}>
                    <motion.form
                        onSubmit={handleSubmit}
                        className="space-y-8 p-8 md:p-10 rounded-2xl border border-brand-indigo/[0.06] bg-white/60 backdrop-blur-sm relative shadow-[0_10px_40px_-10px_rgba(28,31,58,0.04)]"
                    >
                        {status === 'success' && (
                            <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-20 flex flex-col items-center justify-center text-center p-6 rounded-2xl">
                                <div className="w-14 h-14 bg-brand-indigo text-white rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <h3 className="text-2xl font-display font-bold text-brand-indigo mb-2">{t("contact.success.title")}</h3>
                                <p className="text-brand-indigo/50 text-sm">{t("contact.success.text")}</p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="mt-6 text-brand-indigo font-medium underline text-sm"
                                >
                                    {t("contact.success.again")}
                                </button>
                            </div>
                        )}

                        {/* Name */}
                        <div className="relative group">
                            <label className={`absolute left-0 transition-all duration-300 pointer-events-none text-sm ${focused === 'name' || formData.name ? '-top-6 text-brand-indigo' : 'top-2.5 text-brand-indigo/30'}`}>
                                {t("contact.label.name")}
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                onFocus={() => setFocused('name')}
                                onBlur={(e) => !e.target.value && setFocused(null)}
                                className="w-full bg-transparent border-b border-brand-indigo/10 py-2.5 text-brand-indigo outline-none focus:border-brand-indigo/40 transition-all"
                            />
                        </div>

                        {/* Email */}
                        <div className="relative group">
                            <label className={`absolute left-0 transition-all duration-300 pointer-events-none text-sm ${focused === 'email' || formData.email ? '-top-6 text-brand-indigo' : 'top-2.5 text-brand-indigo/30'}`}>
                                {t("contact.label.email")}
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                onFocus={() => setFocused('email')}
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
                                {projectTypes.map((pt) => (
                                    <option key={pt.value} value={pt.value}>{pt.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Message */}
                        <div className="relative group">
                            <label className={`absolute left-0 transition-all duration-300 pointer-events-none text-sm ${focused === 'message' || formData.message ? '-top-6 text-brand-indigo' : 'top-2.5 text-brand-indigo/30'}`}>
                                {t("contact.label.message")}
                            </label>
                            <textarea
                                rows={4}
                                required
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                onFocus={() => setFocused('message')}
                                onBlur={(e) => !e.target.value && setFocused(null)}
                                className="w-full bg-transparent border-b border-brand-indigo/10 py-2.5 text-brand-indigo outline-none focus:border-brand-indigo/40 transition-all resize-none"
                            ></textarea>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <MagneticButton type="submit" disabled={status === 'sending'} className="cursor-pointer">
                                {status === 'sending' ? t("contact.sending") : t("contact.button")}
                            </MagneticButton>
                        </div>
                    </motion.form>
                </ScrollReveal>
            </div>
        </section>
    );
}
