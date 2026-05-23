"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import MagneticButton from "@/components/ui/MagneticButton";
import { useTranslation } from "@/i18n/useTranslation";
import { scrollToPageSection } from "@/lib/scrollToPageSection";
import { TypewriterEffect } from "@/components/ui/TypewriterEffect";
import { GooeyText } from "@/components/ui/GooeyText";

const MORPH_WORDS = ["WEB", "DESIGN", "AI", "MARKETING", "AUTOMATIZÁCIA"];

const HIGHLIGHT_WORDS = new Set([
    "Web,", "Dizajn,", "AI", "chatboty,", "Marketing", "Automatizácia",
    "design,", "chatbots,", "automation", "automatizace",
    "AI", "chatboti,", "Automatizácia",
]);

export default function HeroSection() {
    const { t } = useTranslation();
    const [ctaReady, setCtaReady] = useState(false);

    useEffect(() => {
        const id = setTimeout(() => setCtaReady(true), 3500);
        return () => clearTimeout(id);
    }, []);

    return (
        <section className="relative min-h-[100dvh] w-full overflow-hidden">
            {/* Background lives at page level (HomeBackdrop). */}

            {/* ── Content ── */}
            <div className="relative z-10 container mx-auto px-5 text-center
                flex flex-col justify-center gap-6 sm:gap-7
                min-h-[100dvh] pt-24 pb-28
                md:px-6 md:h-auto md:justify-center md:items-center md:gap-0 md:py-32 md:pb-32">

                {/* Mobile logo — only shown above headline on small screens */}
                <div className="hero-logo md:hidden flex justify-center">
                    <Image
                        src="/logo-v2.png"
                        alt="AIWai"
                        width={160}
                        height={160}
                        priority
                        className="w-24 h-24 sm:w-32 sm:h-32 object-contain drop-shadow-[0_6px_22px_rgba(201,168,117,0.3)]"
                    />
                </div>

                {/* Headline — gooey morph through services */}
                <motion.div
                    initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                    style={{ opacity: 0 }}
                    className="w-full max-w-5xl md:mx-auto"
                >
                    <GooeyText
                        texts={MORPH_WORDS}
                        morphTime={1.1}
                        cooldownTime={0.7}
                        className="h-[clamp(3.5rem,13vw,7rem)] w-full"
                        textClassName="font-display font-bold tracking-tight text-cream leading-none text-[clamp(2.1rem,9.2vw,6rem)]"
                    />
                </motion.div>

                {/* Subtitle + CTA */}
                <div className="w-full max-w-4xl md:mx-auto space-y-6 md:space-y-8 md:mt-10">
                    <div className="hero-sub mx-auto max-w-[20rem] sm:max-w-[24rem] md:max-w-none md:whitespace-nowrap">
                        <TypewriterEffect
                            speed={0.04}
                            startDelayMs={1600}
                            words={t("hero.subtitle").split(" ").map((word) => ({
                                text: word,
                                className: HIGHLIGHT_WORDS.has(word) ? "text-gold" : "text-cream/70",
                            }))}
                            className="text-[15px] md:text-xl font-light leading-relaxed text-center"
                            cursorClassName="h-4 md:h-5 w-[2px]"
                        />
                    </div>
                    <div className="hero-cta min-h-[56px] flex items-center justify-center">
                        {ctaReady && (
                            <motion.div
                                initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                                className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto px-2 sm:px-0"
                            >
                                <MagneticButton
                                    onClick={() => scrollToPageSection("contact")}
                                    variant="gold"
                                    className="whitespace-nowrap w-full sm:w-auto !px-6 sm:!px-10"
                                >
                                    {t("hero.cta.start")}
                                </MagneticButton>
                                <button
                                    onClick={() => scrollToPageSection("services")}
                                    className="px-8 py-3.5 md:py-3 text-[12px] md:text-xs font-bold uppercase tracking-[0.18em] text-cream/60 hover:text-gold active:text-gold transition-colors whitespace-nowrap"
                                >
                                    {t("hero.cta.explore")}
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

        </section>
    );
}
