"use client";

import Link from "next/link";
import { useMemo } from "react";
import PortfolioCarousel, { type PortfolioItem } from "@/components/portfolio/PortfolioCarousel";
import SectionBackground from "@/components/backgrounds/SectionBackground";
import { useTranslation } from "@/i18n/useTranslation";
import { REALIZACIE_PROJECTS } from "./data";

export default function RealizacieClient() {
    const { t } = useTranslation();

    // Mapujeme plochý zoznam projektov na PortfolioItem-y pre karusel.
    // Poradie definuje data.ts → highlight (AIWai News, Morak, Zaidans, DoprAi) ide prvé.
    const items = useMemo<PortfolioItem[]>(
        () =>
            REALIZACIE_PROJECTS.map((p) => ({
                slug: p.slug,
                name: p.name,
                category: p.category,
                description: p.description,
                image: `/portfolio/${p.slug}.jpg`,
                url: p.url,
                private: p.private,
            })),
        []
    );

    return (
        <main className="relative min-h-[100dvh] bg-char overflow-hidden">
            {/* Pozadie — jemné gold radial glows + grain */}
            <div className="absolute inset-0 pointer-events-none">
                <SectionBackground variant="soft" topFade={false} />
            </div>

            {/* Portfolio carousel — vlastný header (nadpis + lead + šípky + CTA) je súčasťou komponentu */}
            <section className="relative z-10 pt-28 md:pt-36 pb-20 md:pb-28">
                <PortfolioCarousel items={items} />
            </section>

            {/* Spodný CTA — silnejší konverzný blok pre návštevníkov, ktorí prešli celý karusel */}
            <section className="relative z-10 pb-24 md:pb-32 px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-cream mb-3">
                    {t("realizacie.bottomCta.title")}
                </h2>
                <p className="text-cream/55 text-base mb-8 font-light max-w-xl mx-auto">
                    {t("realizacie.bottomCta.text")}
                </p>
                <Link
                    href="/#contact"
                    className="inline-flex items-center gap-3 px-8 md:px-10 py-3.5 md:py-4 bg-gold text-ink rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-gold-bright transition-all shadow-lg shadow-black/20"
                >
                    {t("realizacie.bottomCta.button")}
                </Link>
            </section>
        </main>
    );
}
