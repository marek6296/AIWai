"use client";

import Link from "next/link";
import { useState } from "react";
import SectionBackground from "@/components/backgrounds/SectionBackground";
import RealizacieHeroParallax from "@/components/portfolio/RealizacieHeroParallax";
import ProjectLightbox from "@/components/portfolio/ProjectLightbox";
import { REALIZACIE_PROJECTS } from "./data";
import { useTranslation } from "@/i18n/useTranslation";

export default function RealizacieClient() {
    const { t } = useTranslation();
    const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

    return (
        <main className="relative min-h-[100dvh] bg-char overflow-hidden">
            <div className="pointer-events-none absolute inset-0">
                <SectionBackground variant="soft" topFade={false} />
            </div>

            <div className="relative z-10">
                <RealizacieHeroParallax
                    projects={REALIZACIE_PROJECTS}
                    onSelect={setSelectedSlug}
                />

                {/* Bottom CTA */}
                <section className="border-t border-cream/[0.07] px-6 py-24 md:py-32 text-center">
                    <h2 className="mb-4 font-display text-3xl md:text-5xl font-medium tracking-[-0.03em] text-cream max-w-[18ch] mx-auto leading-[1.02]">
                        {t("realizacie.bottomCta.title")}
                    </h2>
                    <p className="mx-auto mb-10 max-w-[52ch] text-[15px] text-cream/60 leading-[1.7]">
                        {t("realizacie.bottomCta.text")}
                    </p>
                    <Link
                        href="/#contact"
                        className="group inline-flex items-center gap-4 border-b border-gold/60 pb-2 text-[13px] font-mono uppercase tracking-[0.22em] text-cream hover:text-gold hover:border-gold transition-colors"
                    >
                        <span>{t("realizacie.bottomCta.button")}</span>
                        <span
                            aria-hidden
                            className="inline-block h-px w-8 bg-gold/70 group-hover:w-12 group-hover:bg-gold transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        />
                    </Link>
                </section>
            </div>

            <ProjectLightbox
                projects={REALIZACIE_PROJECTS}
                selectedSlug={selectedSlug}
                onChange={setSelectedSlug}
            />
        </main>
    );
}
