"use client";

import Link from "next/link";
import RealizacieGallery from "@/components/portfolio/RealizacieGallery";
import SectionBackground from "@/components/backgrounds/SectionBackground";
import { useTranslation } from "@/i18n/useTranslation";

export default function RealizacieClient() {
    const { t } = useTranslation();

    return (
        <main className="relative min-h-[100dvh] bg-char overflow-hidden">
            {/* Pozadie — jemné gold radial glows */}
            <div className="absolute inset-0 pointer-events-none">
                <SectionBackground variant="soft" topFade={false} />
            </div>

            {/* Gallery — filter chips + grid + lightbox */}
            <section className="relative z-10 pt-20 md:pt-28">
                <RealizacieGallery />
            </section>

            {/* Spodný CTA */}
            <section className="relative z-10 pb-24 md:pb-32 px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-cream mb-3">
                    {t("realizacie.bottomCta.title")}
                </h2>
                <p className="text-cream/55 text-base mb-8 font-light max-w-xl mx-auto">
                    {t("realizacie.bottomCta.text")}
                </p>
                <Link
                    href="/#contact"
                    className="inline-flex items-center gap-3 px-8 md:px-10 py-3.5 md:py-4 bg-gold text-ink text-xs font-bold uppercase tracking-[0.2em] hover:bg-gold-bright transition-all shadow-lg shadow-black/20"
                >
                    {t("realizacie.bottomCta.button")}
                </Link>
            </section>
        </main>
    );
}
