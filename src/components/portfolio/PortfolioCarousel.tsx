"use client";

/**
 * PortfolioCarousel — horizontálny karusel projektov nad Embla Carousel.
 *
 * Header: nadpis + lead + ovládacie šípky (vľavo / vpravo) + CTA link na kontakt.
 * Slides: karta s obrázkom (aspect 3:2, hover scale), kategória, názov, popis,
 *         link "Zobraziť →".
 *
 * Mobile (<640 px): dragFree (voľný swipe, prirodzený iOS feel).
 * Desktop (>=640 px): snap (slidesToScroll: 1).
 *
 * Šípky sa disablujú na začiatku/konci podľa `canScrollPrev/Next`.
 */

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

export interface PortfolioItem {
    slug: string;
    name: string;
    category: string;
    description: string;
    image: string;
    url: string;
    private?: boolean;
}

interface Props {
    items: PortfolioItem[];
}

export default function PortfolioCarousel({ items }: Props) {
    const { t } = useTranslation();

    // Embla setup. Breakpoints prepnú dragFree → snap pri >= 640 px.
    // align:'start' — prvý slide v rade je doľava zarovnaný, lepšie pre header počítanie.
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "start",
        loop: false,
        dragFree: true,
        slidesToScroll: 1,
        containScroll: "trimSnaps",
        breakpoints: {
            "(min-width: 640px)": { dragFree: false },
        },
    });

    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        const update = () => {
            setCanPrev(emblaApi.canScrollPrev());
            setCanNext(emblaApi.canScrollNext());
        };
        update();
        emblaApi.on("select", update);
        emblaApi.on("reInit", update);
        return () => {
            emblaApi.off("select", update);
            emblaApi.off("reInit", update);
        };
    }, [emblaApi]);

    return (
        <section className="relative w-full">
            {/* Header — nadpis, popis, šípky + CTA na kontakt */}
            <div className="container mx-auto px-6 flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14">
                <div className="max-w-2xl">
                    <span className="text-[10px] uppercase tracking-[0.35em] font-bold text-gold/80">
                        {t("realizacie.portfolio")} · {items.length} {t("realizacie.projectsCount")}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-cream mt-3 leading-[1.0]">
                        {t("realizacie.h1.line1")}{" "}
                        <span className="text-gold">{t("realizacie.h1.line2")}</span>
                    </h2>
                    <p className="text-cream/60 mt-4 text-sm md:text-base font-light leading-relaxed">
                        {t("realizacie.lead")}
                    </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <Link
                        href="/#contact"
                        className="hidden sm:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gold hover:text-gold-bright transition-colors"
                    >
                        {t("realizacie.bottomCta.button")}
                        <ArrowRight size={14} />
                    </Link>
                    <div className="flex items-center gap-2">
                        <ArrowButton
                            direction="prev"
                            onClick={scrollPrev}
                            disabled={!canPrev}
                            label={t("realizacie.arrow.prev")}
                        />
                        <ArrowButton
                            direction="next"
                            onClick={scrollNext}
                            disabled={!canNext}
                            label={t("realizacie.arrow.next")}
                        />
                    </div>
                </div>
            </div>

            {/* Embla viewport */}
            <div className="overflow-hidden" ref={emblaRef}>
                {/* Slides container — Embla potrebuje flex layout.
                    Padding na okrajoch sa stará o vzdialenosť prvej/poslednej karty od kraja viewportu. */}
                <div className="flex gap-4 md:gap-6 pl-6 pr-6 md:pl-[max(1.5rem,calc((100vw-1280px)/2))]">
                    {items.map((item) => (
                        <ProjectCard key={item.slug} item={item} t={t} />
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── arrow button ───────────────────────────────────────────── */

function ArrowButton({
    direction,
    onClick,
    disabled,
    label,
}: {
    direction: "prev" | "next";
    onClick: () => void;
    disabled: boolean;
    label: string;
}) {
    const Icon = direction === "prev" ? ArrowLeft : ArrowRight;
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            className={`w-10 h-10 md:w-11 md:h-11 rounded-full border flex items-center justify-center transition-all duration-200 ${
                disabled
                    ? "border-cream/15 text-cream/25 cursor-not-allowed"
                    : "border-gold/40 text-gold hover:border-gold hover:bg-gold/10 active:scale-95"
            }`}
        >
            <Icon size={16} />
        </button>
    );
}

/* ─── card ───────────────────────────────────────────────────── */

function ProjectCard({
    item,
    t,
}: {
    item: PortfolioItem;
    t: (key: string) => string;
}) {
    const isPrivate = !!item.private;

    // Šírka slide-u — mobile-first peek, desktop tri karty vidno naraz.
    // flex-[0_0_X] = flex-basis:X, flex-grow:0, flex-shrink:0 (Embla potrebuje fixed basis).
    const slideWidthClass =
        "flex-[0_0_82%] sm:flex-[0_0_55%] md:flex-[0_0_44%] lg:flex-[0_0_32%] xl:flex-[0_0_30%]";

    const inner = (
        <>
            {/* Obrázok */}
            <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-char-soft border border-gold/15 group-hover:border-gold/35 transition-colors">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width:640px) 82vw, (max-width:1024px) 44vw, 32vw"
                    className={`object-cover object-top transition-transform duration-700 ease-out ${
                        isPrivate ? "" : "group-hover:scale-[1.05]"
                    }`}
                />
                {/* Tenký vignette dole pre čitateľnosť kategórie */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-char/70 to-transparent" />

                {isPrivate && (
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-char/85 backdrop-blur-md flex items-center justify-center border border-gold/25">
                        <Lock size={13} className="text-gold/80" />
                    </div>
                )}

                {/* Kategória v dolnom rohu */}
                <span className="absolute bottom-3 left-4 text-[10px] uppercase tracking-[0.25em] font-bold text-gold/90">
                    {item.category}
                </span>
            </div>

            {/* Text pod obrázkom */}
            <div className="pt-4 px-1">
                <h3 className="text-lg md:text-xl font-display font-bold text-cream leading-tight group-hover:text-gold-bright transition-colors">
                    {item.name}
                </h3>
                <p className="text-sm text-cream/55 line-clamp-2 mt-1.5 font-light leading-relaxed">
                    {item.description}
                </p>

                {/* CTA na karte */}
                <div className="mt-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gold group-hover:text-gold-bright transition-colors">
                    {isPrivate ? t("realizacie.privateLabel") : t("realizacie.viewProject")}
                    {!isPrivate && (
                        <ArrowRight
                            size={14}
                            className="transition-transform duration-200 group-hover:translate-x-1"
                        />
                    )}
                </div>
            </div>
        </>
    );

    if (isPrivate) {
        return (
            <div
                className={`group min-w-0 ${slideWidthClass}`}
                aria-label={`${item.name} — ${t("realizacie.privateLabel")}`}
            >
                {inner}
            </div>
        );
    }

    return (
        <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group min-w-0 ${slideWidthClass} cursor-pointer`}
            aria-label={`${item.name} — open project in new tab`}
        >
            {inner}
        </a>
    );
}
