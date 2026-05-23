"use client";

import { useTranslation } from "@/i18n/useTranslation";

/**
 * MobileProcessSection — clean vertical timeline, no rotating hex rings,
 * no sparkles, no per-step framer-motion entrances. Just a dotted line
 * and four steps. CSS handles the staggered fade-in.
 *
 * Why separate from ProcessSection: the desktop variant has four continuous
 * conic-gradient rotations and two sparkle pulse animations going at all
 * times. Six concurrent framer-motion loops eat phone battery and stutter
 * during scroll.
 */
export default function MobileProcessSection() {
    const { t } = useTranslation();

    const steps = [0, 1, 2, 3].map((i) => ({
        number: t(`process.step.${i}.number`),
        title: t(`process.step.${i}.title`),
        description: t(`process.step.${i}.description`),
    }));

    return (
        <section className="relative py-20">
            <div className="mx-auto max-w-md px-5">
                {/* Heading */}
                <div className="mb-12 text-center">
                    <div className="mb-4 flex items-center justify-center gap-2.5">
                        <span aria-hidden="true" className="h-px w-8 bg-gradient-to-r from-transparent to-gold/60" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold/85">
                            Štyri kroky
                        </span>
                        <span aria-hidden="true" className="h-px w-8 bg-gradient-to-l from-transparent to-gold/60" />
                    </div>
                    <h2 className="font-display text-[2.1rem] font-bold leading-[1.1] tracking-tight text-cream">
                        {t("process.heading")}
                    </h2>
                    <p className="mx-auto mt-4 max-w-[22rem] text-[14px] font-light leading-relaxed text-cream/55">
                        {t("process.subheading")}
                    </p>
                </div>

                {/* Timeline */}
                <ol className="relative space-y-10 pl-12">
                    {/* Dotted backbone */}
                    <span
                        aria-hidden="true"
                        className="absolute left-[19px] top-2 bottom-2 w-px [background-image:radial-gradient(circle,rgba(201,168,117,0.4)_1px,transparent_1px)] [background-size:1px_7px] [background-repeat:repeat-y]"
                    />

                    {steps.map((step, i) => (
                        <li key={i} className="relative">
                            {/* Step circle on the line */}
                            <span
                                aria-hidden="true"
                                className="absolute -left-[44px] top-0 flex h-10 w-10 items-center justify-center rounded-full border border-gold/35 bg-char text-gold shadow-[0_0_20px_rgba(201,168,117,0.18)]"
                            >
                                <span className="font-mono text-[11px] font-bold tracking-[0.14em]">
                                    {step.number}
                                </span>
                            </span>

                            <h3 className="mb-2 font-display text-[20px] font-bold leading-tight tracking-tight text-cream">
                                {step.title}
                            </h3>
                            <p className="text-[14px] font-light leading-relaxed text-cream/60">
                                {step.description}
                            </p>
                        </li>
                    ))}

                    {/* Terminal marker */}
                    <li className="relative pt-2 text-[10px] font-bold uppercase tracking-[0.32em] text-gold/70" aria-hidden="true">
                        <span
                            className="absolute -left-[31px] top-3.5 h-2 w-2 rounded-full bg-gold shadow-[0_0_10px_rgba(201,168,117,0.6)]"
                        />
                        Hotovo
                    </li>
                </ol>
            </div>
        </section>
    );
}
