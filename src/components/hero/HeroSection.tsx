"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";
import StarField from "@/components/backgrounds/StarField";
import HexagonOverlay from "@/components/backgrounds/HexagonOverlay";
import GridLines from "@/components/backgrounds/GridLines";
import GrainOverlay from "@/components/backgrounds/GrainOverlay";
import { useTranslation } from "@/i18n/useTranslation";
import GlowHeadline from "./GlowHeadline";
import { scrollToPageSection } from "@/lib/scrollToPageSection";

export default function HeroSection() {
    const { t } = useTranslation();

    return (
        <section className="relative min-h-[100dvh] w-full overflow-hidden bg-char">
            {/* ── Background stack (from AIWai-redesign) ── */}
            <StarField />
            <HexagonOverlay />
            <GridLines />
            <GrainOverlay />

            {/* Dramatic radial glows */}
            <div
                className="absolute -bottom-40 -left-40 w-[720px] h-[720px] rounded-full pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle, rgba(201, 168, 117, 0.22) 0%, transparent 65%)",
                }}
            />
            <div
                className="absolute -top-40 -right-40 w-[820px] h-[820px] rounded-full pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle, rgba(10, 22, 40, 0.75) 0%, transparent 65%)",
                }}
            />
            <div
                className="absolute top-1/3 left-1/4 w-[520px] h-[520px] rounded-full pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle, rgba(228, 200, 150, 0.06) 0%, transparent 70%)",
                }}
            />

            {/* Top fade — softens area behind navbar */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-char/80 to-transparent pointer-events-none z-[3]" />

            {/* ── Content ── */}
            <div className="relative z-10 container mx-auto px-6 text-center
                flex flex-col justify-center gap-10
                min-h-[100dvh] pt-24 pb-36
                md:h-auto md:justify-center md:items-center md:gap-0 md:py-32 md:pb-32">

                {/* Mobile logo — only shown above headline on small screens */}
                <div className="hero-logo md:hidden flex justify-center">
                    <Image
                        src="/logo.png"
                        alt="AIWai"
                        width={160}
                        height={160}
                        priority
                        className="w-32 h-32 sm:w-36 sm:h-36 object-contain drop-shadow-[0_6px_22px_rgba(201,168,117,0.3)]"
                    />
                </div>

                {/* Headline block */}
                <GlowHeadline className="w-full max-w-5xl md:mx-auto space-y-0 cursor-default">
                    <h1
                        className="hero-line font-display font-bold tracking-tight text-cream leading-[1.05] md:whitespace-nowrap"
                        style={{ fontSize: "clamp(2.25rem,9.5vw,6rem)" }}
                    >
                        {t("hero.line1").split("|").map((word, i, arr) => (
                            <span key={i}>
                                {word}
                                {i < arr.length - 1 && (
                                    <span
                                        className="inline-block text-gold align-middle"
                                        style={{ fontSize: "0.45em", verticalAlign: "middle", position: "relative", top: "-0.05em", margin: "0 0.3em" }}
                                    >▲</span>
                                )}
                            </span>
                        ))}
                    </h1>
                    <div
                        className="hero-line font-display font-bold tracking-tight leading-[1.05]
                            text-cream/40 group-hover:text-cream/75
                            transition-[color,opacity] duration-500 ease-out"
                        style={{ fontSize: "clamp(2.25rem,9.5vw,6rem)" }}
                    >
                        <span className="block">{t("hero.line2.light")}</span>
                        <span className="block">{t("hero.line2.gradient")}</span>
                    </div>
                </GlowHeadline>

                {/* Subtitle + CTA */}
                <div className="w-full max-w-4xl md:mx-auto space-y-6 md:space-y-8 md:mt-10">
                    <p className="hero-sub text-[15px] md:text-xl text-cream/65 mx-auto leading-relaxed font-light max-w-md md:max-w-none md:whitespace-nowrap">
                        {t("hero.subtitle")}
                    </p>
                    <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-4">
                        <MagneticButton
                            onClick={() => scrollToPageSection("contact")}
                            variant="gold"
                            className="whitespace-nowrap w-full sm:w-auto"
                        >
                            {t("hero.cta.start")}
                        </MagneticButton>
                        <button
                            onClick={() => scrollToPageSection("services")}
                            className="px-8 py-4 md:py-3 text-sm md:text-xs font-bold uppercase tracking-[0.2em] text-cream/60 hover:text-gold transition-colors whitespace-nowrap"
                        >
                            {t("hero.cta.explore")}
                        </button>
                    </div>
                </div>
            </div>

            {/* vertical scroll indicator — right edge */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
                className="hidden lg:flex absolute right-6 bottom-6 flex-col items-center gap-2 z-10"
                aria-hidden="true"
            >
                <span
                    className="font-mono uppercase text-[10px] tracking-[0.4em] text-cream/40 whitespace-nowrap"
                    style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                >
                    scroll ↓
                </span>
                <motion.span
                    animate={{ scaleY: [1, 0.3, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    className="block w-px h-10 bg-gradient-to-b from-gold to-transparent origin-top"
                />
            </motion.div>

        </section>
    );
}
