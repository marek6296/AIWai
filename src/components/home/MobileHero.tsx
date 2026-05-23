"use client";

import Image from "next/image";
import { useTranslation } from "@/i18n/useTranslation";
import { scrollToPageSection } from "@/lib/scrollToPageSection";

const MORPH_WORDS = ["WEB", "DESIGN", "AI", "MARKETING", "AUTOMATIZÁCIA"];

/**
 * MobileHero — built for phones from scratch.
 *
 * Why this exists separately from HeroSection:
 *  - The desktop hero relies on GooeyText (SVG threshold filter + per-frame
 *    blur) and TypewriterEffect (60+ animated spans). Both stutter on iOS
 *    Safari and the blur filter makes text rasterize blurry under GPU
 *    compositing.
 *  - This variant uses CSS keyframes only — no framer-motion on the text,
 *    no SVG filters, no per-character animation. Text stays crisp.
 *  - The morph headline cycles five words via overlapping opacity
 *    keyframes; never two visible at once, no transforms, GPU stays out.
 */
export default function MobileHero() {
    const { t } = useTranslation();

    return (
        <section className="relative min-h-[100dvh] w-full overflow-hidden">
            <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-md flex-col items-center justify-center gap-7 px-6 pt-24 pb-28 text-center">
                {/* Logo */}
                <div className="mobile-hero-fade-in-1 flex justify-center">
                    <Image
                        src="/logo-v2.png"
                        alt="AIWai"
                        width={144}
                        height={144}
                        priority
                        className="h-24 w-24 object-contain drop-shadow-[0_6px_22px_rgba(201,168,117,0.3)]"
                    />
                </div>

                {/* Headline — CSS-only morph cycle */}
                <div
                    className="mobile-morph-stage w-full"
                    style={{ height: "clamp(3.25rem, 12.5vw, 5rem)" }}
                    aria-label={MORPH_WORDS.join(", ")}
                >
                    {MORPH_WORDS.map((word) => (
                        <span
                            key={word}
                            className="mobile-morph-word font-display font-bold tracking-tight text-cream"
                            style={{
                                fontSize: "clamp(2rem, 9.2vw, 3.25rem)",
                                lineHeight: 1,
                                whiteSpace: "nowrap",
                            }}
                        >
                            {word}
                        </span>
                    ))}
                </div>

                {/* Subtitle — static, fades in once */}
                <p className="mobile-hero-fade-in-2 mx-auto max-w-[22rem] text-[15px] font-light leading-relaxed text-cream/70">
                    {t("hero.subtitle")}
                </p>

                {/* CTAs — full-width primary, ghost secondary. Big tap areas. */}
                <div className="mobile-hero-fade-in-3 mt-1 flex w-full flex-col items-center gap-3">
                    <button
                        type="button"
                        onClick={() => scrollToPageSection("contact")}
                        className="w-full rounded-none border-2 border-gold bg-gold px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-ink shadow-lg shadow-black/30 transition-colors active:bg-gold-bright"
                    >
                        {t("hero.cta.start")}
                    </button>
                    <button
                        type="button"
                        onClick={() => scrollToPageSection("services")}
                        className="px-6 py-3 text-[12px] font-bold uppercase tracking-[0.18em] text-cream/65 transition-colors active:text-gold"
                    >
                        {t("hero.cta.explore")}
                    </button>
                </div>
            </div>
        </section>
    );
}
