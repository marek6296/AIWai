"use client";

import Link from "next/link";
import { useMemo } from "react";
import CircularGallery, { type GalleryItem } from "@/components/portfolio/CircularGallery";
import SectionBackground from "@/components/backgrounds/SectionBackground";
import { useTranslation } from "@/i18n/useTranslation";
import { REALIZACIE_GROUPS } from "./data";

export default function RealizacieClient() {
    const { t } = useTranslation();

    // Sploštíme všetky skupiny do jedného poľa GalleryItem-ov.
    // Poradie ostáva podľa data.ts → vizuálne sú projekty rozmiestnené v rovnakých
    // sekvenciách (najprv ekosystém, potom biznis, apps, personal).
    const items = useMemo<GalleryItem[]>(
        () =>
            REALIZACIE_GROUPS.flatMap((group) =>
                group.projects.map((p) => ({
                    slug: p.slug,
                    name: p.name,
                    category: p.category,
                    description: p.description,
                    image: `/portfolio/${p.slug}.jpg`,
                    url: p.url,
                    private: p.private,
                }))
            ),
        []
    );

    const totalCount = items.length;

    return (
        <main className="relative min-h-[100dvh] bg-char overflow-hidden">
            {/* Pozadie — jemné gold radial glows + grain */}
            <div className="absolute inset-0 pointer-events-none">
                <SectionBackground variant="soft" topFade={false} />
            </div>

            {/* Dramatické gold radial glow zo stredu — podčiarkuje kruhovú kompozíciu */}
            <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vmin] h-[120vmin] rounded-full pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle, rgba(201, 168, 117, 0.10) 0%, rgba(201, 168, 117, 0.04) 35%, transparent 65%)",
                }}
                aria-hidden
            />

            {/* Hero header — sticky/floating nad galériou */}
            <section className="relative z-20 pt-28 md:pt-36 pb-6 md:pb-8 text-center px-6">
                <span className="text-[10px] uppercase tracking-[0.35em] font-bold text-gold/80">
                    {t("realizacie.portfolio")} · {totalCount} {t("realizacie.projectsCount")}
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-cream mt-3 leading-[0.95]">
                    {t("realizacie.h1.line1")}{" "}
                    <span className="text-gold">{t("realizacie.h1.line2")}</span>
                </h1>
                <p className="text-cream/55 mt-4 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
                    {t("realizacie.lead")}
                </p>
            </section>

            {/* Circular gallery — vyplní zvyšok viewportu.
                min-h zaručí, že aj keď stránka má málo obsahu, galéria má dosť priestoru
                a scroll-driven rotácia funguje. 130vh nech je čo otáčať pri scrollovaní. */}
            <section
                className="relative z-10 w-full"
                style={{ height: "min(820px, 130vh)" }}
            >
                <CircularGallery items={items} />
            </section>

            {/* Hint pod galériou — tlmený text vysvetľujúci interakciu */}
            <p className="relative z-20 text-center text-[10px] sm:text-xs uppercase tracking-[0.3em] text-cream/35 pb-8 md:pb-12 px-6">
                {t("realizacie.gallery.hint")}
            </p>

            {/* CTA na konci — ostáva, aby bol zachovaný konverzný flow */}
            <section className="relative z-20 pb-24 md:pb-32 px-6 text-center">
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
