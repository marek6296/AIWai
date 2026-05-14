"use client";

import FadeIn from "@/components/animations/FadeIn";
import TextReveal from "@/components/animations/TextReveal";
import { useTranslation } from "@/i18n/useTranslation";

const STEP_ICONS = [
    // 01 Discovery — speech bubble
    <svg key="0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>,
    // 02 Proposal — document
    <svg key="1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="12" y2="17" />
    </svg>,
    // 03 Build — code
    <svg key="2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
    </svg>,
    // 04 Launch — rocket
    <svg key="3" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>,
];

export default function ProcessSection() {
    const { t } = useTranslation();

    const steps = [0, 1, 2, 3].map((i) => ({
        number: t(`process.step.${i}.number`),
        title: t(`process.step.${i}.title`),
        description: t(`process.step.${i}.description`),
        icon: STEP_ICONS[i],
    }));

    return (
        <section className="py-20 md:py-28 bg-char relative overflow-hidden">
            {/* Static CSS grid — no framer-motion, no data URL → no hydration mismatch */}
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none gold-vlines opacity-40" />
            <div aria-hidden="true" className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(201,168,117,0.12) 0%, transparent 65%)" }} />
            <div aria-hidden="true" className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(201,168,117,0.08) 0%, transparent 65%)" }} />

            <div className="container mx-auto relative z-10">
                <FadeIn className="text-center mb-16 space-y-4">
                    <TextReveal
                        as="h2"
                        className="text-4xl md:text-5xl font-display font-bold tracking-tight text-white"
                    >
                        {t("process.heading")}
                    </TextReveal>
                    <p className="text-white/40 max-w-xl mx-auto text-lg font-light">
                        {t("process.subheading")}
                    </p>
                </FadeIn>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden">
                    {steps.map((step, i) => (
                        <FadeIn key={i} delay={i * 0.08}>
                            <div className="bg-char p-8 md:p-10 h-full flex flex-col gap-6 hover:bg-white/[0.03] transition-colors duration-300">
                                <div className="flex items-start justify-between">
                                    <div className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-brand-sand/70">
                                        {step.icon}
                                    </div>
                                    <span className="text-5xl font-display font-bold text-white/[0.06] leading-none select-none">
                                        {step.number}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-display font-semibold text-white mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-white/40 text-sm leading-relaxed font-light">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
