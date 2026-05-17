"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/seo/services";
import { useTranslation } from "@/i18n/useTranslation";

export default function SluzbyClient() {
    const { t } = useTranslation();

    return (
        <main className="relative min-h-screen bg-char text-cream overflow-hidden">
            {/* Background decoration */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-40 -right-40 h-[820px] w-[820px] rounded-full"
                style={{ background: "radial-gradient(circle, rgba(10, 22, 40, 0.75) 0%, transparent 65%)" }}
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-40 -left-40 h-[720px] w-[720px] rounded-full"
                style={{ background: "radial-gradient(circle, rgba(201, 168, 117, 0.18) 0%, transparent 65%)" }}
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 gold-vlines opacity-25" />

            {/* Hero */}
            <section className="container relative z-10 mx-auto px-6 pt-24 pb-8 md:pt-28 md:pb-10 text-center">
                <h1 className="mx-auto mb-4 font-display font-bold tracking-tight text-cream text-4xl md:text-6xl leading-[1.05] sluzby-fade-in">
                    {t("sluzbyHub.h1.line1")}{" "}
                    <span className="text-gold">{t("sluzbyHub.h1.line2")}</span>
                </h1>
                <p className="mx-auto max-w-2xl text-base md:text-lg text-cream/65 leading-relaxed font-light sluzby-fade-in [animation-delay:120ms]">
                    {t("sluzbyHub.lead")}
                </p>
            </section>

            {/* Service grid */}
            <section className="container relative z-10 mx-auto px-6 pb-24 md:pb-32">
                <div className="grid gap-5 md:gap-6 md:grid-cols-2">
                    {SERVICES.map((service, idx) => (
                        <Link
                            key={service.slug}
                            href={`/sluzby/${service.slug}`}
                            className="group relative overflow-hidden border border-cream/10 bg-char-soft/60 p-7 md:p-10 transition-all duration-500 hover:border-gold/40 hover:bg-char-soft/85 hover:-translate-y-1 sluzby-fade-in"
                            style={{ animationDelay: `${200 + idx * 80}ms` }}
                        >
                            {/* Gold corner accent on hover */}
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute -top-px -right-px h-12 w-12 origin-top-right scale-0 bg-gold transition-transform duration-500 group-hover:scale-100"
                                style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
                            />
                            {/* Glow on hover */}
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute -bottom-32 -right-32 h-72 w-72 rounded-full opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                                style={{ background: "radial-gradient(circle, rgba(201,168,117,0.18) 0%, transparent 65%)" }}
                            />

                            <div className="relative flex items-start justify-between mb-7">
                                <div
                                    className="text-5xl text-gold opacity-90 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[6deg]"
                                    aria-hidden="true"
                                >
                                    {service.glyph}
                                </div>
                                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-cream/30 group-hover:text-gold/80 transition-colors">
                                    {String(idx + 1).padStart(2, "0")} / {String(SERVICES.length).padStart(2, "0")}
                                </span>
                            </div>

                            <h2 className="font-display font-bold text-cream text-2xl md:text-[1.75rem] tracking-tight leading-tight mb-3">
                                {t(`services.${idx}.title`)}
                            </h2>
                            <p className="text-cream/65 mb-7 leading-relaxed text-[15px] font-light">
                                {t(`services.${idx}.description`)}
                            </p>

                            <div className="flex items-center justify-between pt-5 border-t border-cream/10 text-sm">
                                <span className="text-cream/55">
                                    <span className="uppercase tracking-[0.15em] text-[10px] font-bold text-cream/40 mr-2">
                                        {t("sluzbyHub.priceFrom")}
                                    </span>
                                    <span className="text-gold font-bold tracking-tight">
                                        {service.pricing[0]?.price ?? ""}
                                    </span>
                                </span>
                                <span className="flex items-center gap-2 uppercase tracking-[0.18em] text-[11px] font-bold text-cream/65 group-hover:text-gold transition-colors">
                                    {t("sluzbyHub.detail")}
                                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="container relative z-10 mx-auto px-6 pb-28 md:pb-36 text-center">
                <h2 className="font-display font-bold text-cream text-3xl md:text-5xl leading-tight mb-5">
                    {t("sluzbyHub.bottomCta.title")}
                </h2>
                <p className="text-cream/65 max-w-xl mx-auto mb-10 font-light leading-relaxed">
                    {t("sluzbyHub.bottomCta.text")}
                </p>
                <Link
                    href="/#contact"
                    className="inline-flex items-center gap-3 bg-gold px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-ink hover:bg-gold-bright transition-colors shadow-lg shadow-black/30"
                >
                    {t("sluzbyHub.bottomCta.button")}
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </section>

            <style>{`
                @keyframes sluzbyFadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .sluzby-fade-in {
                    opacity: 0;
                    animation: sluzbyFadeIn 700ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }
                @media (prefers-reduced-motion: reduce) {
                    .sluzby-fade-in { opacity: 1; animation: none; }
                }
            `}</style>
        </main>
    );
}
