"use client";

import Link from "next/link";
import SectionBackground from "@/components/backgrounds/SectionBackground";
import PricingSection, { type PricingCategory } from "@/components/cennik/PricingSection";
import { useTranslation } from "@/i18n/useTranslation";

export default function CennikClient() {
    const { t } = useTranslation();
    const cta = t("cennik.cta.button");
    const splitFeatures = (key: string) => t(key).split("|");

    const categories: PricingCategory[] = [
        {
            id: "dizajn",
            label: t("cennik.section.design.title"),
            plans: [
                {
                    name: t("cennik.card.logoBasic.name"),
                    price: t("cennik.card.logoBasic.price"),
                    priceNote: t("cennik.priceNote.oneTime"),
                    serviceValue: "Logo Basic",
                    features: splitFeatures("cennik.card.logoBasic.features"),
                    cta,
                },
                {
                    name: t("cennik.card.logoBrand.name"),
                    price: t("cennik.card.logoBrand.price"),
                    priceNote: t("cennik.priceNote.oneTime"),
                    serviceValue: "Logo + Brand",
                    features: splitFeatures("cennik.card.logoBrand.features"),
                    isPopular: true,
                    badge: t("cennik.badge.popular"),
                    cta,
                },
                {
                    name: t("cennik.card.socialGraphics.name"),
                    price: t("cennik.card.socialGraphics.price"),
                    priceNote: t("cennik.priceNote.templateBundle"),
                    serviceValue: "Social Media Graphics",
                    features: splitFeatures("cennik.card.socialGraphics.features"),
                    cta,
                },
            ],
        },
        {
            id: "web",
            label: t("cennik.section.web.title"),
            plans: [
                {
                    name: t("cennik.card.presentationWeb.name"),
                    price: t("cennik.card.presentationWeb.price"),
                    priceNote: t("cennik.priceNote.oneTime"),
                    serviceValue: "Presentation Website",
                    features: splitFeatures("cennik.card.presentationWeb.features"),
                    cta,
                },
                {
                    name: t("cennik.card.companyWeb.name"),
                    price: t("cennik.card.companyWeb.price"),
                    priceNote: t("cennik.priceNote.oneTime"),
                    serviceValue: "Company Website",
                    features: splitFeatures("cennik.card.companyWeb.features"),
                    isPopular: true,
                    badge: t("cennik.badge.bestseller"),
                    cta,
                },
                {
                    name: t("cennik.card.eshop.name"),
                    price: t("cennik.card.eshop.price"),
                    priceNote: t("cennik.priceNote.oneTime"),
                    serviceValue: "E-shop",
                    features: splitFeatures("cennik.card.eshop.features"),
                    cta,
                },
            ],
        },
        {
            id: "chatbot",
            label: t("cennik.section.chatbot.title"),
            plans: [
                {
                    name: t("cennik.card.chatbotBasic.name"),
                    price: t("cennik.card.chatbotBasic.price"),
                    priceNote: t("cennik.priceNote.oneTime"),
                    serviceValue: "Chatbot Basic",
                    features: splitFeatures("cennik.card.chatbotBasic.features"),
                    cta,
                },
                {
                    name: t("cennik.card.chatbotPro.name"),
                    price: t("cennik.card.chatbotPro.price"),
                    priceNote: t("cennik.priceNote.oneTime"),
                    serviceValue: "Chatbot Pro",
                    features: splitFeatures("cennik.card.chatbotPro.features"),
                    isPopular: true,
                    cta,
                },
            ],
        },
        {
            id: "automatizacia",
            label: t("cennik.section.automation.title"),
            plans: [
                {
                    name: t("cennik.card.automationStarter.name"),
                    price: t("cennik.card.automationStarter.price"),
                    priceNote: t("cennik.priceNote.oneTime"),
                    serviceValue: "Automation Starter",
                    features: splitFeatures("cennik.card.automationStarter.features"),
                    cta,
                },
                {
                    name: t("cennik.card.automationPro.name"),
                    price: t("cennik.card.automationPro.price"),
                    priceNote: t("cennik.priceNote.byProject"),
                    serviceValue: "Automation Pro / Enterprise",
                    features: splitFeatures("cennik.card.automationPro.features"),
                    isPopular: true,
                    cta,
                },
            ],
        },
        {
            id: "marketing",
            label: t("cennik.section.marketing.title"),
            plans: [
                {
                    name: t("cennik.card.marketingStarter.name"),
                    price: t("cennik.card.marketingStarter.price"),
                    priceNote: t("cennik.priceNote.monthly"),
                    serviceValue: "Social Starter",
                    features: splitFeatures("cennik.card.marketingStarter.features"),
                    badge: t("cennik.badge.new"),
                    cta,
                },
                {
                    name: t("cennik.card.marketingPro.name"),
                    price: t("cennik.card.marketingPro.price"),
                    priceNote: t("cennik.priceNote.monthlyAds"),
                    serviceValue: "Social Pro + Ads",
                    features: splitFeatures("cennik.card.marketingPro.features"),
                    isPopular: true,
                    badge: t("cennik.badge.recommended"),
                    cta,
                },
            ],
        },
    ];

    return (
        <main className="min-h-screen bg-char relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <SectionBackground variant="soft" topFade={false} />
            </div>

            {/* Hero */}
            <section className="pt-24 pb-8 md:pt-28 md:pb-10 relative z-10">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="mx-auto mb-4 font-display font-bold text-cream text-4xl md:text-6xl tracking-tight leading-[1.05]">
                        {t("cennik.h1")}
                    </h1>
                    <p className="mx-auto max-w-2xl text-cream/65 text-base md:text-lg font-light leading-relaxed">
                        {t("cennik.lead")}
                    </p>
                </div>
            </section>

            {/* Interactive pricing — category toggle + starfield + grid */}
            <section className="relative z-10">
                <PricingSection categories={categories} />
            </section>

            {/* Note */}
            <section className="py-8 relative z-10">
                <div className="container mx-auto px-6 max-w-3xl">
                    <div className="rounded-2xl border border-cream/10 bg-cream/[0.03] backdrop-blur-sm p-8 text-center">
                        <p className="text-cream/60 text-sm leading-relaxed">
                            {t("cennik.note.line1")}<br />
                            <strong className="text-gold">{t("cennik.note.line2")}</strong>
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 md:py-28 relative z-10">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-cream mb-4">{t("cennik.bottomCta.title")}</h2>
                    <p className="text-cream/55 text-lg mb-10 font-light">{t("cennik.bottomCta.text")}</p>
                    <Link
                        href="/#contact"
                        className="inline-flex items-center gap-3 px-10 py-4 bg-gold text-ink text-xs font-bold uppercase tracking-[0.2em] hover:bg-gold-bright transition-all shadow-lg shadow-black/20"
                    >
                        {t("cennik.bottomCta.button")}
                    </Link>
                </div>
            </section>
        </main>
    );
}
