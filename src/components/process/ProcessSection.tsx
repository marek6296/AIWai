"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ReactNode, useRef } from "react";
import { useTranslation } from "@/i18n/useTranslation";

const STEP_ICONS: ReactNode[] = [
    // 01 Discovery — speech bubble
    <svg key="0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>,
    // 02 Proposal — document
    <svg key="1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="12" y2="17" />
    </svg>,
    // 03 Build — code
    <svg key="2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
    </svg>,
    // 04 Launch — rocket
    <svg key="3" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>,
];

// Hexagon clip-path — flat-top, matches AIWai logo hexagon orientation
const HEX_CLIP = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

function HexagonNode({ icon, index }: { icon: ReactNode; index: number }) {
    const reduced = useReducedMotion();

    return (
        <motion.div
            initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
            whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{
                type: "spring",
                stiffness: 220,
                damping: 18,
                delay: 0.1 + index * 0.05,
            }}
            className="relative h-[60px] w-[60px] md:h-[68px] md:w-[68px] flex items-center justify-center"
        >
            {/* Outer halo — atmospheric glow */}
            <span
                aria-hidden="true"
                className="absolute inset-[-14px] rounded-full bg-gold/25 blur-2xl"
            />

            {/* Slow rotating outer ring — decorative */}
            {!reduced && (
                <motion.span
                    aria-hidden="true"
                    className="absolute inset-[-8px]"
                    style={{
                        clipPath: HEX_CLIP,
                        background:
                            "conic-gradient(from 0deg, transparent 0deg, rgba(201,168,117,0.45) 60deg, transparent 120deg, transparent 360deg)",
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                />
            )}

            {/* Hex border (gold) */}
            <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-br from-gold via-gold-deep to-gold/50"
                style={{ clipPath: HEX_CLIP }}
            />
            {/* Hex inner (char bg — visually "punches through" the timeline) */}
            <span
                aria-hidden="true"
                className="absolute inset-[1.5px] bg-char"
                style={{ clipPath: HEX_CLIP }}
            />

            {/* Icon */}
            <span className="relative z-10 text-gold drop-shadow-[0_0_6px_rgba(201,168,117,0.4)]">
                {icon}
            </span>
        </motion.div>
    );
}

export default function ProcessSection() {
    const { t } = useTranslation();
    const trackRef = useRef<HTMLDivElement>(null);
    const reduced = useReducedMotion();

    // Scroll-bound line draw — gold thread fills from top to bottom as user scrolls
    const { scrollYProgress } = useScroll({
        target: trackRef,
        offset: ["start 75%", "end 35%"],
    });
    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    const steps = [0, 1, 2, 3].map((i) => ({
        number: t(`process.step.${i}.number`),
        title: t(`process.step.${i}.title`),
        description: t(`process.step.${i}.description`),
        icon: STEP_ICONS[i],
    }));

    return (
        <section className="relative bg-char py-20 md:py-32 overflow-hidden isolate">
            {/* Atmospheric layers */}
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none gold-vlines opacity-25" />
            <div
                aria-hidden="true"
                className="absolute -top-40 left-1/2 -translate-x-1/2 w-[820px] h-[420px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(ellipse, rgba(201,168,117,0.10) 0%, transparent 70%)" }}
            />
            <div
                aria-hidden="true"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[640px] h-[320px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(ellipse, rgba(201,168,117,0.06) 0%, transparent 70%)" }}
            />

            <div className="container relative z-10 mx-auto px-6">
                {/* Heading — editorial header with rule */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center mb-16 md:mb-24"
                >
                    <div className="mb-6 flex items-center justify-center gap-3">
                        <span aria-hidden="true" className="h-px w-10 bg-gradient-to-r from-transparent to-gold/60" />
                        <span className="text-[10px] uppercase tracking-[0.45em] font-bold text-gold/85">
                            Štyri kroky
                        </span>
                        <span aria-hidden="true" className="h-px w-10 bg-gradient-to-l from-transparent to-gold/60" />
                    </div>
                    <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-cream leading-[1.05]">
                        {t("process.heading")}
                    </h2>
                    <p className="mt-5 max-w-xl mx-auto text-cream/55 text-base md:text-lg font-light leading-relaxed">
                        {t("process.subheading")}
                    </p>
                </motion.div>

                {/* Timeline */}
                <div ref={trackRef} className="relative max-w-3xl mx-auto">
                    {/* Dotted backbone — quiet rhythm */}
                    <div
                        aria-hidden="true"
                        className="absolute left-[29px] md:left-[33px] top-[30px] bottom-[30px] w-px [background-image:radial-gradient(circle,rgba(201,168,117,0.28)_1px,transparent_1px)] [background-size:1px_7px] [background-repeat:repeat-y]"
                    />

                    {/* Animated solid gold line — draws on scroll */}
                    <motion.div
                        aria-hidden="true"
                        className="absolute left-[29px] md:left-[33px] top-[30px] w-[1.5px] bg-gradient-to-b from-gold via-gold to-gold/40 origin-top"
                        style={{
                            height: reduced ? "calc(100% - 60px)" : lineHeight,
                            boxShadow: "0 0 12px rgba(201,168,117,0.5)",
                        }}
                    />

                    {/* Sparkle particles along the line — subtle echo of starfield */}
                    {!reduced && (
                        <>
                            <motion.span
                                aria-hidden="true"
                                className="absolute left-[28px] md:left-[32px] top-[20%] w-[3px] h-[3px] rounded-full bg-gold"
                                style={{ boxShadow: "0 0 8px rgba(201,168,117,0.8)" }}
                                animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.4, 1] }}
                                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <motion.span
                                aria-hidden="true"
                                className="absolute left-[28px] md:left-[32px] top-[65%] w-[3px] h-[3px] rounded-full bg-gold"
                                style={{ boxShadow: "0 0 8px rgba(201,168,117,0.8)" }}
                                animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.4, 1] }}
                                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                            />
                        </>
                    )}

                    <div className="flex flex-col gap-14 md:gap-20">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 28 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.45 }}
                                transition={{
                                    duration: 0.7,
                                    delay: i * 0.06,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="relative flex items-start gap-5 md:gap-10"
                            >
                                {/* Hex node — sits ON the timeline */}
                                <div className="relative z-10 flex-shrink-0 -translate-x-[0px]">
                                    <HexagonNode icon={step.icon} index={i} />
                                </div>

                                {/* Content — editorial card with hairline accents */}
                                <div className="flex-1 pt-2 md:pt-3">
                                    {/* Step meta row */}
                                    <div className="mb-3 flex items-center gap-3">
                                        <span className="font-mono text-[11px] font-bold tracking-[0.22em] text-gold">
                                            {step.number}
                                        </span>
                                        <span aria-hidden="true" className="h-px w-8 bg-gradient-to-r from-gold/60 to-transparent" />
                                    </div>

                                    {/* Title */}
                                    <h3 className="font-display text-2xl md:text-[2rem] font-bold tracking-tight text-cream leading-[1.15] mb-3">
                                        {step.title}
                                    </h3>

                                    {/* Body */}
                                    <p className="max-w-lg text-[15px] md:text-base font-light leading-relaxed text-cream/60">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Terminal marker — closes the line elegantly */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 18 }}
                        className="relative mt-12 md:mt-16 flex items-center gap-4 pl-[18px] md:pl-[22px]"
                        aria-hidden="true"
                    >
                        <span className="relative flex h-5 w-5 items-center justify-center">
                            <span className="absolute inset-0 rounded-full bg-gold/20 blur-md" />
                            <span className="relative h-2 w-2 rounded-full bg-gold shadow-[0_0_12px_rgba(201,168,117,0.7)]" />
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-gold/70">
                            Hotovo
                        </span>
                        <span className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-gold/40 to-transparent" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
