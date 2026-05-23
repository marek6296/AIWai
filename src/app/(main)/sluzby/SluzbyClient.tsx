"use client";

import Link from "next/link";
import { SERVICES } from "@/lib/seo/services";
import { useTranslation } from "@/i18n/useTranslation";

export default function SluzbyClient() {
    const { t } = useTranslation();

    return (
        <main className="relative min-h-screen bg-char text-cream selection:bg-gold/30 selection:text-cream">
            {/* HERO ─────────────────────────────────────────────────────── */}
            <section className="border-b border-cream/[0.07]">
                <div className="container mx-auto px-6 pt-32 pb-20 md:pt-44 md:pb-28">
                    <div className="grid grid-cols-12 gap-x-6 gap-y-10">
                        <div className="col-span-12 md:col-span-3 md:pt-3">
                            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-cream/40">
                                <span className="h-px w-8 bg-gold/70" aria-hidden />
                                <span>{t("sluzbyHub.breadcrumb")}</span>
                            </div>
                        </div>

                        <div className="col-span-12 md:col-span-9">
                            <h1 className="font-display font-medium tracking-[-0.035em] text-cream text-[2.75rem] sm:text-6xl lg:text-[5.25rem] leading-[0.95]">
                                {t("sluzbyHub.h1.line1")}
                                <br />
                                <span className="text-cream/35">
                                    {t("sluzbyHub.h1.line2")}
                                </span>
                            </h1>
                            <p className="mt-10 max-w-[52ch] text-[15px] md:text-base text-cream/65 leading-[1.7]">
                                {t("sluzbyHub.lead")}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SERVICE LIST ─────────────────────────────────────────────── */}
            <section aria-label={t("nav.services")} className="border-b border-cream/[0.07]">
                <ul className="container mx-auto px-6">
                    {SERVICES.map((service, idx) => (
                        <li
                            key={service.slug}
                            className="border-b border-cream/[0.07] last:border-b-0"
                        >
                            <Link
                                href={`/sluzby/${service.slug}`}
                                className="group grid grid-cols-12 items-baseline gap-x-6 gap-y-3 py-10 md:py-12 transition-colors duration-300"
                                aria-label={`${t(`services.${idx}.title`)} — detail`}
                            >
                                <h2 className="col-span-12 md:col-span-6 font-display font-medium tracking-[-0.02em] text-cream text-[1.75rem] md:text-4xl leading-[1.05] group-hover:translate-x-1.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
                                    {t(`services.${idx}.title`)}
                                </h2>

                                <p className="col-span-12 md:col-span-4 text-[14px] md:text-[15px] text-cream/55 leading-[1.65] md:pl-2">
                                    {t(`services.${idx}.description`)}
                                </p>

                                <div className="col-span-12 md:col-span-2 flex items-center justify-between md:justify-end gap-4 md:pl-2">
                                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/40">
                                        <span className="mr-1.5">
                                            {t("sluzbyHub.priceFrom")}
                                        </span>
                                        <span className="text-cream/85">
                                            {service.pricing[0]?.price
                                                ?.replace(/^od\s*/i, "")
                                                .replace(/^from\s*/i, "") ?? ""}
                                        </span>
                                    </span>
                                    <span
                                        aria-hidden="true"
                                        className="relative inline-flex h-px w-10 bg-cream/25 group-hover:w-16 group-hover:bg-gold transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                                    >
                                        <span className="absolute right-0 -top-[3px] h-[7px] w-[7px] rotate-45 border-t border-r border-cream/40 group-hover:border-gold transition-colors duration-500" />
                                    </span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>

            {/* BOTTOM CTA ───────────────────────────────────────────────── */}
            <section className="container mx-auto px-6 py-28 md:py-40">
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="col-span-12 md:col-span-3 md:pt-3">
                        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-cream/40">
                            <span className="h-px w-8 bg-gold/70" aria-hidden />
                            <span>{t("nav.contact")}</span>
                        </div>
                    </div>

                    <div className="col-span-12 md:col-span-9">
                        <h2 className="font-display font-medium tracking-[-0.03em] text-cream text-3xl md:text-5xl lg:text-[3.5rem] leading-[1.02] max-w-[18ch]">
                            {t("sluzbyHub.bottomCta.title")}
                        </h2>
                        <p className="mt-8 max-w-[52ch] text-[15px] text-cream/60 leading-[1.7]">
                            {t("sluzbyHub.bottomCta.text")}
                        </p>
                        <Link
                            href="/#contact"
                            className="group mt-10 inline-flex items-center gap-4 border-b border-gold/60 pb-2 text-[13px] font-mono uppercase tracking-[0.22em] text-cream hover:text-gold hover:border-gold transition-colors"
                        >
                            <span>{t("sluzbyHub.bottomCta.button").replace(/→\s*$/, "")}</span>
                            <span
                                aria-hidden="true"
                                className="inline-block h-px w-8 bg-gold/70 group-hover:w-12 group-hover:bg-gold transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                            />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
