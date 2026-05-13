"use client";

import MagneticButton from "@/components/ui/MagneticButton";
import StarField from "@/components/backgrounds/StarField";
import HexagonOverlay from "@/components/backgrounds/HexagonOverlay";
import GridLines from "@/components/backgrounds/GridLines";
import GrainOverlay from "@/components/backgrounds/GrainOverlay";
import { useTranslation } from "@/i18n/useTranslation";

const smoothScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

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
                flex flex-col justify-between
                h-[100dvh] pt-24 pb-16
                md:h-auto md:justify-center md:items-center md:py-32">

                {/* Headline block */}
                <div className="group w-full max-w-5xl md:mx-auto space-y-0 cursor-default
                    transition-transform duration-500 ease-out hover:-translate-y-2">
                    <h1
                        className="hero-line font-display font-bold tracking-tight text-cream leading-[1.1] whitespace-nowrap
                            transition-transform duration-500 ease-out group-hover:scale-[1.015] origin-center"
                        style={{ fontSize: "clamp(2rem,9vw,6rem)" }}
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
                        className="hero-line font-display font-bold tracking-tight leading-[1.1]
                            text-cream/40 group-hover:text-cream/75
                            transition-[color,opacity] duration-500 ease-out"
                        style={{ fontSize: "clamp(2rem,9vw,6rem)" }}
                    >
                        <span className="block">{t("hero.line2.light")}</span>
                        <span className="block">{t("hero.line2.gradient")}</span>
                    </div>
                </div>

                {/* Subtitle + CTA */}
                <div className="w-full max-w-4xl md:mx-auto space-y-5 md:space-y-8 md:mt-10">
                    <p className="hero-sub text-base md:text-xl text-cream/60 mx-auto leading-relaxed font-light md:whitespace-nowrap">
                        {t("hero.subtitle")}
                    </p>
                    <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                        <MagneticButton
                            onClick={() => smoothScrollTo("contact")}
                            variant="gold"
                            className="whitespace-nowrap w-full sm:w-auto"
                        >
                            {t("hero.cta.start")}
                        </MagneticButton>
                        <button
                            onClick={() => smoothScrollTo("services")}
                            className="px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] text-cream/40 hover:text-gold transition-colors whitespace-nowrap"
                        >
                            {t("hero.cta.explore")}
                        </button>
                    </div>
                </div>
            </div>

        </section>
    );
}
