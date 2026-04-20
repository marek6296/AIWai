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
        <section
            className="relative min-h-screen w-full overflow-hidden flex items-center justify-center"
        >
            {/* ── Gradient Mesh Background ── */}
            <div className="absolute inset-0 gradient-mesh" />

            {/* ── Floating Orbs — pure CSS, no JS required ── */}
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
                    className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] object-contain opacity-[0.12] mix-blend-multiply select-none"
                    aria-hidden
                />
            </div>

            {/* ── Subtle Grid ── */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(28,31,58,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(28,31,58,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

            {/* ── Content — CSS-only animations, visible immediately ── */}
            <div className="relative z-10 container mx-auto text-center px-6 pt-20 pb-32 md:py-32">
                <div className="max-w-5xl mx-auto space-y-8">
                    <div className="space-y-0">
                        <div>
                            <h1 className="hero-line text-center font-display font-bold tracking-tight text-brand-indigo leading-[1.15] whitespace-nowrap" style={{fontSize:"clamp(1.75rem,8.5vw,6rem)"}}>
                                {t("hero.line1").split("|").map((word, i, arr) => (
                                    <span key={i}>
                                        {word}
                                        {i < arr.length - 1 && (
                                            <span className="inline-block text-brand-indigo align-middle" style={{fontSize:"0.45em", verticalAlign:"middle", position:"relative", top:"-0.05em", margin:"0 0.3em"}}>▲</span>
                                        )}
                                    </span>
                                ))}
                            </h1>
                        </div>
                        <div>
                            <div className="hero-line text-center font-display font-bold tracking-tight text-brand-indigo/45 leading-[1.15]" style={{fontSize:"clamp(1.75rem,8.5vw,6rem)"}}>
                                <span className="block text-center">{t("hero.line2.light")}</span>
                                <span className="block text-center">{t("hero.line2.gradient")}</span>
                            </div>
                        </div>
                    </div>

                    <p className="hero-sub text-lg md:text-xl text-brand-indigo/50 max-w-2xl md:max-w-4xl mx-auto leading-relaxed font-light md:whitespace-nowrap">
                        {t("hero.subtitle")}
                    </p>

                    <div className="hero-cta flex items-center justify-center gap-4 pt-4">
                        <MagneticButton onClick={() => smoothScrollTo("contact")}>
                            {t("hero.cta.start")}
                        </MagneticButton>
                        <button
                            onClick={() => smoothScrollTo("services")}
                            className="px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-brand-indigo/40 hover:text-brand-indigo transition-colors"
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
