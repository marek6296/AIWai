"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import MagneticButton from "@/components/ui/MagneticButton";

export default function ContactSection() {
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

            // 2. Send Email via Web3Forms directly from Client (Bypasses Cloudflare bot block)
            const mailFormData = new FormData();
            mailFormData.append("access_key", "0f1dc3b9-37d0-4e0d-aa3e-0601ec0a675d");
            mailFormData.append("name", formData.name);
            mailFormData.append("email", formData.email);
            mailFormData.append("project_type", formData.projectType);
            mailFormData.append("message", formData.message);
            mailFormData.append("subject", `Nová správa z AIWai od ${formData.name}`);
            mailFormData.append("from_name", "AIWai Web");

            const mailPromise = fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: mailFormData
            });

            const [dbRes, mailRes] = await Promise.all([dbPromise, mailPromise]);

            if (dbRes.ok || mailRes.ok) {
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

    return (
        <section id="contact" className="py-32 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <h2 className="text-5xl md:text-7xl font-bold text-brand-indigo mb-8 tracking-tight">
                        Let&apos;s build <br />
                        <span className="text-brand-sand">something smart.</span>
                    </h2>
                    <p className="text-xl text-brand-indigo/60 max-w-lg mb-12">
                        Ready to elevate your digital presence? Tell us about your project and we&apos;ll help you architect the perfect solution.
                    </p>

                    <div className="flex flex-col gap-4 text-brand-indigo/80">
                        <a href="mailto:dony.jaij.sk@gmail.com" className="hover:text-brand-indigo transition-colors text-lg">dony.jaij.sk@gmail.com</a>
                        <a href="tel:+421000000000" className="hover:text-brand-indigo transition-colors text-lg">+421 XXX XXX XXX</a>
                    </div>
                </motion.div>

                {/* Form */}
                <motion.form
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="space-y-8 bg-brand-indigo/5 p-10 rounded-2xl backdrop-blur-sm border border-brand-indigo/10 relative"
                >
                    {status === 'success' && (
                        <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-20 flex flex-col items-center justify-center text-center p-6 rounded-2xl">
                            <div className="w-16 h-16 bg-brand-indigo text-white rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-brand-indigo mb-2">Message Sent!</h3>
                            <p className="text-brand-indigo/60">Thank you for reaching out. We will get back to you shortly at {formData.email}.</p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="mt-6 text-brand-indigo font-medium underline"
                            >
                                Send another message
                            </button>
                        </div>
                    )}

                    {/* Name */}
                    <div className="relative group">
                        <label className={`absolute left-0 transition-all duration-300 pointer-events-none ${focused === 'name' || formData.name ? '-top-6 text-sm text-brand-indigo' : 'top-2 text-brand-indigo/40'
                            }`}>
                            Your Name
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            onFocus={() => setFocused('name')}
                            onBlur={(e) => !e.target.value && setFocused(null)}
                            className="w-full bg-transparent border-b border-brand-indigo/20 py-2 text-brand-indigo outline-none focus:border-brand-indigo transition-all"
                        />
                    </div>

                    {/* Email */}
                    <div className="relative group">
                        <label className={`absolute left-0 transition-all duration-300 pointer-events-none ${focused === 'email' || formData.email ? '-top-6 text-sm text-brand-indigo' : 'top-2 text-brand-indigo/40'
                            }`}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            onFocus={() => setFocused('email')}
                            onBlur={(e) => !e.target.value && setFocused(null)}
                            className="w-full bg-transparent border-b border-brand-indigo/20 py-2 text-brand-indigo outline-none focus:border-brand-indigo transition-all"
                        />
                    </div>

                    {/* Project Type Dropdown */}
                    <div className="relative">
                        <label className="text-sm text-brand-indigo/60 block mb-2">Project Type</label>
                        <select
                            value={formData.projectType}
                            onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                            className="w-full bg-transparent border-b border-brand-indigo/20 py-2 text-brand-indigo outline-none focus:border-brand-indigo transition-all appearance-none cursor-pointer"
                        >
                            <option value="Web Development">Web Development</option>
                            <option value="AI Integration">AI Integration</option>
                            <option value="Design System">Design System</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Message */}
                    <div className="relative group">
                        <label className={`absolute left-0 transition-all duration-300 pointer-events-none ${focused === 'message' || formData.message ? '-top-6 text-sm text-brand-indigo' : 'top-2 text-brand-indigo/40'
                            }`}>
                            Tell us about your project
                        </label>
                        <textarea
                            rows={4}
                            required
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            onFocus={() => setFocused('message')}
                            onBlur={(e) => !e.target.value && setFocused(null)}
                            className="w-full bg-transparent border-b border-brand-indigo/20 py-2 text-brand-indigo outline-none focus:border-brand-indigo transition-all resize-none"
                        ></textarea>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <MagneticButton type="submit" disabled={status === 'sending'} className="cursor-pointer">
                            {status === 'sending' ? 'Sending...' : 'Send Message'}
                        </MagneticButton>
                    </div>
                </motion.form>
            </div>

            {/* Background Decoration */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/2 h-1/2 bg-brand-sand/5 blur-[120px] rounded-full pointer-events-none" />
        </section>
    );
}
