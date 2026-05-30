"use client";

import Image from "next/image";
import { useTranslation } from "@/i18n/useTranslation";
import { scrollToPageSection } from "@/lib/scrollToPageSection";
import MobileMorphText from "@/components/home/MobileMorphText";

const MORPH_WORDS = ["WEB", "DESIGN", "AI", "MARKETING", "AUTOMATIZÁCIA"];

/**
 * MobileHero — built for phones from scratch.
 *
 * Why this exists separately from HeroSection:
 *  - The desktop hero also packs TypewriterEffect (60+ animated spans) and a
 *    canvas flow-field — too heavy for phones. This variant keeps the layout
 *    light (static backdrop, no typewriter) but shares the EXACT desktop word
 *    morph via <GooeyText variant="gooey"> so the headline animation matches
 *    PC 1:1 (the user asked for the same melt, not a plain crossfade).
 *  - The logo is a clean transparent PNG with no drop-shadow / will-change, so
 *    iOS Safari never leaves a composited square plate behind it.
 */
export default function MobileHero() {
    const { t } = useTranslation();

    return (
        <section className="relative min-h-[100dvh] w-full overflow-hidden">
            <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-md flex-col items-center justify-center gap-6 px-6 pt-20 pb-24 text-center">
                {/* Logo + morph cluster — tight inner gap so the words sit
                    close under the logo, then larger gap to subtitle / CTAs. */}
                <div className="flex w-full flex-col items-center gap-2">
                    <div className="mobile-rise-logo flex justify-center">
                        <Image
                            src="/logo-v2.png"
                            alt="AIWai"
                            width={360}
                            height={360}
                            priority
                            className="h-56 w-56 sm:h-64 sm:w-64 object-contain"
                        />
                    </div>

                    {/* Headline — phone-native melt (transform + opacity + gentle
                        blur, 60fps on mobile Safari). See MobileMorphText. */}
                    <div className="mobile-rise mobile-rise-d2 w-full">
                        <MobileMorphText
                            words={MORPH_WORDS}
                            interval={1900}
                            className="h-[clamp(3.25rem,12.5vw,5rem)]"
                            textClassName="font-display font-bold tracking-tight text-cream leading-none text-[clamp(2rem,9.2vw,3.25rem)]"
                        />
                    </div>
                </div>

                {/* Subtitle — static, fades in once */}
                <p className="mobile-rise mobile-rise-d3 mx-auto max-w-[22rem] text-[15px] font-light leading-relaxed text-cream/70">
                    {t("hero.subtitle")}
                </p>

                {/* CTAs — full-width primary, ghost secondary. Big tap areas. */}
                <div className="mobile-rise mobile-rise-d4 mt-1 flex w-full flex-col items-center gap-3">
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
