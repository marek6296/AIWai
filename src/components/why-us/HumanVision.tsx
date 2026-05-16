"use client";

import React from "react";
import Image from "next/image";
import FadeIn from "@/components/animations/FadeIn";
import { useTranslation } from "@/i18n/useTranslation";

export default function HumanVision() {
    const { t } = useTranslation();

    return (
        <div className="relative w-full py-8 md:py-12 px-4 sm:px-12">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-20 items-center">

                    {/* ── Left: Artistic Human Element ── */}
                    <FadeIn className="lg:col-span-5 relative">
                        <div className="relative aspect-[4/5] md:aspect-[3/4] max-h-[200px] md:max-h-none mx-auto md:mx-0 max-w-[180px] md:max-w-none rounded-3xl overflow-hidden shadow-[0_30px_70px_-20px_rgba(0,0,0,0.5)] ring-1 ring-gold/20">
                            <Image
                                src="/marek.jpg"
                                alt="Marek AIWai"
                                fill
                                className="object-cover object-top"
                                sizes="(max-width: 768px) 90vw, 40vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-char/70 via-char/10 to-transparent" />
                        </div>
                    </FadeIn>

                    {/* ── Right: Philosophy Story ── */}
                    <FadeIn className="lg:col-span-7 flex flex-col justify-center" delay={0.1}>
                        <div className="space-y-4 md:space-y-5 text-cream/70 text-[15px] md:text-lg leading-relaxed font-light">
                            <p>{t("whyUs.philosophy.text1")}</p>
                            <p className="hidden md:block">{t("whyUs.philosophy.text2")}</p>
                        </div>
                        <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-cream/10">
                            <div className="font-display text-lg md:text-xl italic text-gold">
                                Marek AIWai
                            </div>
                        </div>

                        {/* 3 Feature blocks */}
                        <div className="hidden md:grid mt-8 md:mt-10 grid-cols-1 gap-3.5 md:gap-4 pt-6 md:pt-8 border-t border-cream/10">
                            {[0, 1, 2].map((i) => (
                                <div key={i} className="flex gap-3 md:gap-4">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gold/80 mt-2 md:mt-2.5 flex-shrink-0" />
                                    <div>
                                        <span className="text-[13px] md:text-sm font-semibold text-cream">{t(`whyUs.feature.${i}.title`)} — </span>
                                        <span className="text-[13px] md:text-sm text-cream/60 font-light">{t(`whyUs.feature.${i}.description`)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
}
