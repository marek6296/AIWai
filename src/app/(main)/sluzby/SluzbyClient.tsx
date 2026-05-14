"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/seo/services";
import { useTranslation } from "@/i18n/useTranslation";

export default function SluzbyClient() {
    const { t } = useTranslation();

    return (
        <main className="min-h-screen bg-char text-cream">
            <section className="container mx-auto px-6 pt-32 pb-16 md:pt-40 md:pb-24">
                <nav aria-label="Breadcrumb" className="mb-8 text-sm text-cream/60">
                    <ol className="flex gap-2">
                        <li>
                            <Link href="/" className="hover:text-cream transition-colors">
                                AIWai
                            </Link>
                        </li>
                        <li aria-hidden="true">/</li>
                        <li aria-current="page" className="text-cream">
                            {t("sluzbyHub.breadcrumb")}
                        </li>
                    </ol>
                </nav>

                <h1 className="font-display font-bold tracking-tight text-cream leading-[1.05] text-[2.5rem] md:text-7xl mb-6">
                    {t("sluzbyHub.h1.line1")}
                    <br />
                    {t("sluzbyHub.h1.line2")}
                </h1>
                <p className="max-w-2xl text-lg md:text-xl text-cream/75 leading-relaxed">
                    {t("sluzbyHub.lead")}
                </p>
            </section>

            <section className="container mx-auto px-6 pb-24 md:pb-32">
                <div className="grid gap-6 md:grid-cols-2">
                    {SERVICES.map((service, idx) => (
                        <Link
                            key={service.slug}
                            href={`/sluzby/${service.slug}`}
                            className="group relative overflow-hidden rounded-2xl border border-cream/10 bg-char/50 p-8 md:p-10 transition-all hover:border-gold/40 hover:bg-char/80"
                        >
                            <div
                                className="mb-6 text-5xl text-gold opacity-80 transition-transform group-hover:scale-110"
                                aria-hidden="true"
                            >
                                {service.glyph}
                            </div>

                            <h2 className="font-display font-bold text-cream text-2xl md:text-3xl tracking-tight leading-tight mb-3">
                                {t(`services.${idx}.title`)}
                            </h2>
                            <p className="text-cream/70 mb-6 leading-relaxed">
                                {t(`services.${idx}.description`)}
                            </p>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-cream/50">
                                    {t("sluzbyHub.priceFrom")}{" "}
                                    <span className="text-gold">
                                        {service.pricing[0]?.price ?? ""}
                                    </span>
                                </span>
                                <span className="flex items-center gap-2 text-cream/80 group-hover:text-gold transition-colors">
                                    {t("sluzbyHub.detail")}
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="container mx-auto px-6 pb-24 md:pb-32 text-center">
                <h2 className="font-display font-bold text-cream text-3xl md:text-5xl mb-4">
                    {t("sluzbyHub.bottomCta.title")}
                </h2>
                <p className="text-cream/70 max-w-2xl mx-auto mb-8">
                    {t("sluzbyHub.bottomCta.text")}
                </p>
                <Link
                    href="/#contact"
                    className="inline-block rounded-full bg-gold px-8 py-4 font-semibold text-char hover:bg-gold/90 transition-colors"
                >
                    {t("sluzbyHub.bottomCta.button")}
                </Link>
            </section>
        </main>
    );
}
