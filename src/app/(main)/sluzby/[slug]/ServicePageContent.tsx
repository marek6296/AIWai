"use client";

import Link from "next/link";
import { useTranslation } from "@/i18n/useTranslation";
import type { ServiceCatalogEntry } from "@/lib/seo/services";
import { SERVICE_ICONS, SERVICE_TAGS } from "@/lib/seo/serviceMeta";

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-cream/40">
            <span className="h-px w-8 bg-gold/70" aria-hidden />
            <span>{children}</span>
        </div>
    );
}

export default function ServicePageContent({
    service,
    related,
}: {
    service: ServiceCatalogEntry;
    related: ServiceCatalogEntry[];
}) {
    const { t } = useTranslation();
    const tag = SERVICE_TAGS[service.slug] ?? "";

    return (
        <>
            {/* HERO ─────────────────────────────────────────────────────── */}
            <section className="border-b border-cream/[0.07]">
                <div className="container mx-auto px-6 pt-32 pb-20 md:pt-44 md:pb-28">
                    <div className="grid grid-cols-12 gap-x-6 gap-y-10">
                        <div className="col-span-12 md:col-span-3 md:pt-4">
                            <Link
                                href="/sluzby"
                                className="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-cream/55 transition-colors hover:text-gold"
                            >
                                <span
                                    aria-hidden="true"
                                    className="relative inline-flex h-px w-10 bg-cream/30 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-14 group-hover:bg-gold"
                                >
                                    <span className="absolute left-0 -top-[3px] h-[7px] w-[7px] -rotate-45 border-l border-b border-cream/40 transition-colors duration-500 group-hover:border-gold" />
                                </span>
                                <span>{t("sluzbyDetail.back")}</span>
                            </Link>
                            {tag && (
                                <div className="mt-7 inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-cream/40">
                                    <span aria-hidden className="h-px w-6 bg-cream/20" />
                                    <span>{tag}</span>
                                </div>
                            )}
                        </div>

                        <div className="col-span-12 md:col-span-9">
                            <h1 className="font-display font-medium tracking-[-0.035em] text-cream text-[2.5rem] sm:text-5xl lg:text-[4.75rem] leading-[0.98] max-w-[20ch]">
                                {service.h1}
                            </h1>
                            <p className="mt-10 max-w-[55ch] text-base md:text-lg text-cream/65 leading-[1.65]">
                                {service.tagline}
                            </p>

                            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
                                <Link
                                    href="/#contact"
                                    className="group inline-flex items-center gap-4 border-b border-gold/60 pb-2 text-[13px] font-mono uppercase tracking-[0.22em] text-cream hover:text-gold hover:border-gold transition-colors"
                                >
                                    <span>{t("sluzbyDetail.cta.consult")}</span>
                                    <span
                                        aria-hidden="true"
                                        className="inline-block h-px w-8 bg-gold/70 group-hover:w-12 group-hover:bg-gold transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                                    />
                                </Link>
                                <Link
                                    href="/cennik"
                                    className="inline-flex items-center text-[13px] font-mono uppercase tracking-[0.22em] text-cream/60 hover:text-cream transition-colors"
                                >
                                    {t("sluzbyDetail.cta.pricing")}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* INTRO ────────────────────────────────────────────────────── */}
            <section className="border-b border-cream/[0.07]">
                <div className="container mx-auto px-6 py-20 md:py-28">
                    <div className="grid grid-cols-12 gap-x-6 gap-y-10">
                        <div className="col-span-12 md:col-span-3 md:pt-3">
                            <SectionLabel>{t("sluzbyDetail.label.why")}</SectionLabel>
                        </div>
                        <div className="col-span-12 md:col-span-9 max-w-[58ch]">
                            <div className="space-y-7 text-[17px] md:text-[18px] text-cream/75 leading-[1.7] font-light">
                                {service.intro.map((para, i) => (
                                    <p
                                        key={i}
                                        className={
                                            i === 0
                                                ? "text-cream/90 text-[19px] md:text-[20px] leading-[1.55]"
                                                : ""
                                        }
                                    >
                                        {para}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* DELIVERABLES ─────────────────────────────────────────────── */}
            <section className="border-b border-cream/[0.07]">
                <div className="container mx-auto px-6 py-20 md:py-28">
                    <div className="grid grid-cols-12 gap-x-6 gap-y-10">
                        <div className="col-span-12 md:col-span-3 md:pt-3">
                            <SectionLabel>
                                {t("sluzbyDetail.label.deliverables")}
                            </SectionLabel>
                            <h2 className="mt-5 font-display font-medium tracking-[-0.025em] text-cream text-2xl md:text-[2rem] leading-[1.1] max-w-[14ch]">
                                {t("sluzbyDetail.deliverables.subtitle")}
                            </h2>
                        </div>
                        <ul className="col-span-12 md:col-span-9 -mt-4">
                            {service.deliverables.map((item, i) => (
                                <li
                                    key={i}
                                    className="flex items-baseline gap-5 border-t border-cream/[0.07] py-4 first:border-t-0 md:py-5"
                                >
                                    <span
                                        aria-hidden="true"
                                        className="mt-[10px] inline-block h-[5px] w-[5px] flex-none rounded-full bg-gold/80"
                                    />
                                    <span className="text-[16px] md:text-[17px] text-cream/85 leading-[1.5]">
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* FOR WHOM ─────────────────────────────────────────────────── */}
            <section className="border-b border-cream/[0.07]">
                <div className="container mx-auto px-6 py-20 md:py-28">
                    <div className="grid grid-cols-12 gap-x-6 gap-y-10">
                        <div className="col-span-12 md:col-span-3 md:pt-3">
                            <SectionLabel>{t("sluzbyDetail.label.forWhom")}</SectionLabel>
                        </div>
                        <div className="col-span-12 md:col-span-9">
                            <ul className="grid gap-x-10 gap-y-3 md:grid-cols-2 max-w-[64ch]">
                                {service.forWhom.map((item, i) => (
                                    <li
                                        key={i}
                                        className="flex items-baseline gap-4 text-[16px] md:text-[17px] text-cream/80 leading-[1.55]"
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="mt-[10px] inline-block h-[5px] w-[5px] flex-none rounded-full bg-gold/80"
                                        />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* PROCESS ──────────────────────────────────────────────────── */}
            <section className="border-b border-cream/[0.07]">
                <div className="container mx-auto px-6 py-20 md:py-28">
                    <div className="grid grid-cols-12 gap-x-6 gap-y-10">
                        <div className="col-span-12 md:col-span-3 md:pt-3">
                            <SectionLabel>{t("sluzbyDetail.label.process")}</SectionLabel>
                            <p className="mt-5 max-w-[28ch] text-[14px] text-cream/55 leading-[1.6]">
                                {t("sluzbyDetail.process.subtitle")}
                            </p>
                        </div>
                        <ol className="col-span-12 md:col-span-9">
                            {service.process.map((step, i) => (
                                <li
                                    key={i}
                                    className="grid grid-cols-12 gap-x-6 border-t border-cream/[0.07] py-6 md:py-8 first:border-t-0"
                                >
                                    <h3 className="col-span-12 md:col-span-5 font-display font-medium text-cream text-lg md:text-xl tracking-[-0.015em] leading-[1.3]">
                                        {step.title}
                                    </h3>
                                    <p className="col-span-12 md:col-span-7 mt-2 md:mt-0 text-[15px] text-cream/60 leading-[1.65] max-w-[48ch]">
                                        {step.description}
                                    </p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </section>

            {/* PRICING ──────────────────────────────────────────────────── */}
            <section className="border-b border-cream/[0.07]">
                <div className="container mx-auto px-6 py-20 md:py-28">
                    <div className="grid grid-cols-12 gap-x-6 gap-y-12">
                        <div className="col-span-12 md:col-span-3 md:pt-3">
                            <SectionLabel>{t("sluzbyDetail.label.pricing")}</SectionLabel>
                            <p className="mt-5 max-w-[28ch] text-[14px] text-cream/55 leading-[1.6]">
                                {t("sluzbyDetail.pricing.subtitle")}
                            </p>
                        </div>
                        <div className="col-span-12 md:col-span-9">
                            <div className="grid gap-x-10 gap-y-12 md:grid-cols-3 border-t border-cream/[0.07] pt-10">
                                {service.pricing.map((tier, i) => (
                                    <div key={i} className="relative">
                                        <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-cream/55 mb-4">
                                            {tier.name}
                                        </h3>
                                        <div className="font-display font-medium text-cream text-[2.25rem] md:text-[2.5rem] tracking-[-0.03em] leading-none mb-5">
                                            {tier.price.replace(/^od\s+/i, "")}
                                            {/od\s+/i.test(tier.price) && (
                                                <span className="block mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-cream/35">
                                                    {t("sluzbyHub.priceFrom")}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[14px] text-cream/60 leading-[1.65] max-w-[28ch]">
                                            {tier.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ ──────────────────────────────────────────────────────── */}
            <section className="border-b border-cream/[0.07]">
                <div className="container mx-auto px-6 py-20 md:py-28">
                    <div className="grid grid-cols-12 gap-x-6 gap-y-10">
                        <div className="col-span-12 md:col-span-3 md:pt-3">
                            <SectionLabel>{t("sluzbyDetail.label.faq")}</SectionLabel>
                            <h2 className="mt-5 font-display font-medium tracking-[-0.025em] text-cream text-2xl md:text-[2rem] leading-[1.1] max-w-[14ch]">
                                {t("sluzbyDetail.faq.title")}
                            </h2>
                        </div>
                        <div className="col-span-12 md:col-span-9">
                            <ul className="-mt-4">
                                {service.faq.map((item, i) => (
                                    <li
                                        key={i}
                                        className="border-t border-cream/[0.07] first:border-t-0"
                                    >
                                        <details className="group">
                                            <summary className="flex cursor-pointer items-start justify-between gap-6 py-6 md:py-7 list-none [&::-webkit-details-marker]:hidden">
                                                <span className="font-display font-medium text-cream text-lg md:text-xl tracking-[-0.015em] leading-[1.35]">
                                                    {item.q}
                                                </span>
                                                <span
                                                    aria-hidden="true"
                                                    className="mt-2 flex-none text-cream/40 font-mono text-lg leading-none transition-transform duration-300 group-open:rotate-45"
                                                >
                                                    +
                                                </span>
                                            </summary>
                                            <div className="pb-7 max-w-[60ch]">
                                                <p className="text-[15px] md:text-[16px] text-cream/65 leading-[1.7]">
                                                    {item.a}
                                                </p>
                                            </div>
                                        </details>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* RELATED ──────────────────────────────────────────────────── */}
            <section className="border-b border-cream/[0.07]">
                <div className="container mx-auto px-6 py-20 md:py-28">
                    <div className="grid grid-cols-12 gap-x-6 gap-y-10">
                        <div className="col-span-12 md:col-span-3 md:pt-3">
                            <SectionLabel>{t("sluzbyDetail.label.related")}</SectionLabel>
                        </div>
                        <ul className="col-span-12 md:col-span-9 -mt-4">
                            {related.map((s) => {
                                const RelIcon = SERVICE_ICONS[s.slug];
                                const relTag = SERVICE_TAGS[s.slug] ?? "";
                                return (
                                    <li
                                        key={s.slug}
                                        className="border-t border-cream/[0.07] first:border-t-0"
                                    >
                                        <Link
                                            href={`/sluzby/${s.slug}`}
                                            className="group flex items-center justify-between gap-6 py-6 md:py-7"
                                        >
                                            <div className="flex items-center gap-5 min-w-0">
                                                {RelIcon && (
                                                    <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-full border border-cream/12 text-cream/60 transition-colors duration-300 group-hover:border-gold/45 group-hover:text-gold">
                                                        <RelIcon className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                                                    </span>
                                                )}
                                                <div className="flex flex-col gap-1 min-w-0">
                                                    {relTag && (
                                                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream/40">
                                                            {relTag}
                                                        </span>
                                                    )}
                                                    <span className="font-display font-medium text-cream text-xl md:text-2xl tracking-[-0.02em] leading-[1.2] truncate transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
                                                        {s.title}
                                                    </span>
                                                </div>
                                            </div>
                                            <span
                                                aria-hidden="true"
                                                className="relative inline-flex h-px w-10 flex-none bg-cream/25 group-hover:w-16 group-hover:bg-gold transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                                            >
                                                <span className="absolute right-0 -top-[3px] h-[7px] w-[7px] rotate-45 border-t border-r border-cream/40 group-hover:border-gold transition-colors duration-500" />
                                            </span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </section>

            {/* FINAL CTA ────────────────────────────────────────────────── */}
            <section className="container mx-auto px-6 py-28 md:py-40">
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="col-span-12 md:col-span-3 md:pt-3">
                        <SectionLabel>{t("sluzbyDetail.label.contact")}</SectionLabel>
                    </div>
                    <div className="col-span-12 md:col-span-9">
                        <h2 className="font-display font-medium tracking-[-0.035em] text-cream text-4xl md:text-6xl lg:text-[4.5rem] leading-[0.98] max-w-[16ch]">
                            {t("sluzbyDetail.contact.titleStart")}{" "}
                            <span className="text-cream/35">
                                {t("sluzbyDetail.contact.titleEnd")}
                            </span>
                        </h2>
                        <p className="mt-8 max-w-[52ch] text-[15px] text-cream/60 leading-[1.7]">
                            {t("sluzbyDetail.contact.text")}
                        </p>
                        <Link
                            href="/#contact"
                            className="group mt-10 inline-flex items-center gap-4 border-b border-gold/60 pb-2 text-[13px] font-mono uppercase tracking-[0.22em] text-cream hover:text-gold hover:border-gold transition-colors"
                        >
                            <span>{t("sluzbyDetail.contact.cta")}</span>
                            <span
                                aria-hidden="true"
                                className="inline-block h-px w-8 bg-gold/70 group-hover:w-12 group-hover:bg-gold transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                            />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
