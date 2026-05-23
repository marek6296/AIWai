"use client";

import Link from "next/link";
import SectionBackground from "@/components/backgrounds/SectionBackground";
import FloatingServiceIcons from "@/components/services/FloatingServiceIcons";
import { SERVICES } from "@/lib/seo/services";
import { SERVICE_ICONS, SERVICE_TAGS } from "@/lib/seo/serviceMeta";
import { useTranslation } from "@/i18n/useTranslation";

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-cream/40">
            <span className="h-px w-8 bg-gold/70" aria-hidden />
            <span>{children}</span>
        </div>
    );
}

export default function SluzbyClient() {
    const { t } = useTranslation();

    return (
        <main className="relative min-h-screen bg-char text-cream selection:bg-gold/30 selection:text-cream">
            {/* HERO — fullscreen ───────────────────────────────────────── */}
            <section className="relative flex min-h-screen min-h-[100svh] items-center overflow-hidden border-b border-cream/[0.07]">
                <SectionBackground variant="soft" />
                <FloatingServiceIcons />
                <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-32 md:py-40">
                    <SectionLabel>{t("sluzbyHub.breadcrumb")}</SectionLabel>

                    <h1 className="mt-8 max-w-[18ch] font-display font-medium tracking-[-0.035em] text-cream text-[2.75rem] sm:text-6xl lg:text-[5.25rem] leading-[0.95]">
                        {t("sluzbyHub.h1.line1")}
                        <br />
                        <span className="text-cream/35">
                            {t("sluzbyHub.h1.line2")}
                        </span>
                    </h1>

                    <p className="mt-8 max-w-[55ch] text-[15px] md:text-base text-cream/65 leading-[1.7]">
                        {t("sluzbyHub.lead")}
                    </p>
                </div>

            </section>

            {/* SERVICES — fullscreen chapter sections ───────────────────── */}
            <ul aria-label={t("nav.services")}>
                {SERVICES.map((service, idx) => {
                    const Icon = SERVICE_ICONS[service.slug];
                    const tag = SERVICE_TAGS[service.slug] ?? "";
                    const price = service.pricing[0]?.price
                        ?.replace(/^od\s*/i, "")
                        .replace(/^from\s*/i, "") ?? "";
                    const features = t(`services.${idx}.includes`)
                        .split("|")
                        .slice(0, 3);

                    return (
                        <li
                            key={service.slug}
                            className="relative flex min-h-screen min-h-[100svh] items-center border-b border-cream/[0.07]"
                        >
                            <Link
                                href={`/sluzby/${service.slug}`}
                                className="group block w-full"
                                aria-label={`${t(`services.${idx}.title`)} — detail`}
                            >
                                <div className="mx-auto w-full max-w-7xl px-6 py-24 md:py-28">
                                    {/* Label row */}
                                    <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-cream/40">
                                        <span
                                            className="h-px w-8 bg-gold/70 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-12"
                                            aria-hidden
                                        />
                                        <span>{tag}</span>
                                        <span aria-hidden className="text-cream/20">·</span>
                                        <span className="text-cream/35">
                                            {String(idx + 1).padStart(2, "0")}
                                        </span>
                                    </div>

                                    {/* Icon badge */}
                                    <div className="mt-8 inline-flex h-14 w-14 items-center justify-center rounded-full border border-cream/12 text-cream/65 transition-colors duration-300 group-hover:border-gold/45 group-hover:text-gold">
                                        {Icon && <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />}
                                    </div>

                                    {/* Title */}
                                    <h2 className="mt-8 max-w-[18ch] font-display font-medium tracking-[-0.025em] text-cream text-[2.5rem] sm:text-6xl lg:text-[5.25rem] leading-[0.95] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
                                        {t(`services.${idx}.title`)}
                                    </h2>

                                    {/* Lead */}
                                    <p className="mt-8 max-w-[55ch] text-[15px] md:text-base text-cream/65 leading-[1.7]">
                                        {t(`services.${idx}.description`)}
                                    </p>

                                    {/* Feature chips */}
                                    <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-2.5">
                                        {features.map((f, i) => (
                                            <li
                                                key={i}
                                                className="flex items-baseline gap-2.5 text-[13px] md:text-[14px] text-cream/60"
                                            >
                                                <span
                                                    aria-hidden
                                                    className="inline-block h-[4px] w-[4px] flex-none rounded-full bg-gold/70"
                                                />
                                                <span>{f}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Footer: price + CTA */}
                                    <div className="mt-10 flex max-w-[55ch] flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-cream/[0.07] pt-7">
                                        <div className="flex items-baseline gap-3">
                                            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream/40">
                                                {t("sluzbyHub.priceFrom")}
                                            </span>
                                            <span className="font-display text-xl md:text-2xl tracking-[-0.02em] text-cream/90 transition-colors duration-300 group-hover:text-gold">
                                                {price}
                                            </span>
                                        </div>

                                        <span className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-cream/55 transition-colors duration-300 group-hover:text-gold">
                                            <span>Detail</span>
                                            <span
                                                aria-hidden
                                                className="relative inline-flex h-px w-10 bg-cream/25 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-16 group-hover:bg-gold"
                                            >
                                                <span className="absolute right-0 -top-[3px] h-[7px] w-[7px] rotate-45 border-t border-r border-cream/40 transition-colors duration-500 group-hover:border-gold" />
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                            </li>
                        );
                    })}
                </ul>

            {/* BOTTOM CTA ───────────────────────────────────────────────── */}
            <section className="mx-auto w-full max-w-7xl px-6 py-28 md:py-40">
                <SectionLabel>{t("nav.contact")}</SectionLabel>

                <h2 className="mt-8 max-w-[18ch] font-display font-medium tracking-[-0.03em] text-cream text-3xl md:text-5xl lg:text-[3.5rem] leading-[1.02]">
                    {t("sluzbyHub.bottomCta.title")}
                </h2>
                <p className="mt-8 max-w-[55ch] text-[15px] md:text-base text-cream/65 leading-[1.7]">
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
            </section>
        </main>
    );
}
