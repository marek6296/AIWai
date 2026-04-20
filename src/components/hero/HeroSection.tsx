"use client";

import Image from "next/image";
import MagneticButton from "@/components/ui/MagneticButton";
import { useTranslation } from "@/i18n/useTranslation";

const smoothScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

export default function HeroSection() {
    const { t } = useTranslation();

    return (
        <section className="relative min-h-[100dvh] w-full overflow-hidden">
            {/* ── Gradient Mesh Background ── */}
            <div className="absolute inset-0 gradient-mesh" />

            {/* ── Floating Orbs ── */}
            <div className="hero-orb absolute top-[10%] left-[15%] w-[200px] h-[200px] md:w-[500px] md:h-[500px] rounded-full bg-brand-sand/10 blur-[30px] md:blur-[120px] animate-float-slow pointer-events-none" />
            <div className="hero-orb absolute bottom-[15%] right-[10%] w-[150px] h-[150px] md:w-[400px] md:h-[400px] rounded-full bg-brand-indigo/5 blur-[25px] md:blur-[100px] animate-float-slower pointer-events-none" />
            <div className="hero-orb absolute top-[50%] right-[30%] w-[100px] h-[100px] md:w-[250px] md:h-[250px] rounded-full bg-brand-sand/8 blur-[20px] md:blur-[80px] animate-float pointer-events-none hidden md:block" />

            {/* ── Logo background ── */}
            <div className="absolute inset-0 flex items-center justify-center z-[2] pointer-events-none">
                <Image
                    src="/logo.png"
                    alt=""
                    width={600}
                    height={600}
                    className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] object-contain opacity-[0.22] md:opacity-[0.12] mix-blend-multiply select-none"
                    aria-hidden
                />
            </div>

            {/* ── Subtle Grid ── */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(28,31,58,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(28,31,58,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

            {/* ── Content ── */}
            <div className="relative z-10 container mx-auto px-6 text-center
                flex flex-col justify-between
                h-[100dvh] pt-24 pb-16
                md:h-auto md:justify-center md:items-center md:py-32">

                {/* Headline block — stays near top on mobile */}
                <div className="w-full max-w-5xl md:mx-auto space-y-0">
                    <h1
                        className="hero-line font-display font-bold tracking-tight text-brand-indigo leading-[1.1] whitespace-nowrap"
                        style={{ fontSize: "clamp(2rem,9vw,6rem)" }}
                    >
                        {t("hero.line1").split("|").map((word, i, arr) => (
                            <span key={i}>
                                {word}
                                {i < arr.length - 1 && (
                                    <span
                                        className="inline-block text-brand-indigo align-middle"
                                        style={{ fontSize: "0.45em", verticalAlign: "middle", position: "relative", top: "-0.05em", margin: "0 0.3em" }}
                                    >▲</span>
                                )}
                            </span>
                        ))}
                    </h1>
                    <div
                        className="hero-line font-display font-bold tracking-tight text-brand-indigo/40 leading-[1.1]"
                        style={{ fontSize: "clamp(2rem,9vw,6rem)" }}
                    >
                        <span className="block">{t("hero.line2.light")}</span>
                        <span className="block">{t("hero.line2.gradient")}</span>
                    </div>
                </div>

                {/* Subtitle + CTA — pinned to bottom on mobile */}
                <div className="w-full max-w-4xl md:mx-auto space-y-5 md:space-y-8 md:mt-10">
                    <p className="hero-sub text-base md:text-xl text-brand-indigo/50 mx-auto leading-relaxed font-light md:whitespace-nowrap">
                        {t("hero.subtitle")}
                    </p>
                    <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                        <MagneticButton
                            onClick={() => smoothScrollTo("contact")}
                            className="whitespace-nowrap w-full sm:w-auto"
                        >
                            {t("hero.cta.start")}
                        </MagneticButton>
                        <button
                            onClick={() => smoothScrollTo("services")}
                            className="px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-indigo/40 hover:text-brand-indigo transition-colors whitespace-nowrap"
                        >
                            {t("hero.cta.explore")}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Bottom Fade ── */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </section>
    );
}
