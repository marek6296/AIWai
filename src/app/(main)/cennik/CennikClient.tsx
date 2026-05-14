"use client";

import Link from "next/link";
import SectionBackground from "@/components/backgrounds/SectionBackground";
import { useTranslation } from "@/i18n/useTranslation";

const CheckIcon = ({ highlight }: { highlight?: boolean }) => (
    <svg
        className={`w-4 h-4 flex-shrink-0 mt-0.5 ${highlight ? "text-ink" : "text-gold"}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

interface PricingCardProps {
    name: string;
    price: string;
    priceNote?: string;
    features: string[];
    highlight?: boolean;
    badge?: string;
    serviceValue: string;
    cta: string;
}

function PricingCard({ name, price, priceNote, features, highlight, badge, serviceValue, cta }: PricingCardProps) {
    return (
        <div className={`relative rounded-2xl p-7 flex flex-col gap-6 transition-all duration-300 ${
            highlight
                ? "bg-gold text-ink shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)] ring-1 ring-gold-deep/40"
                : "bg-cream/[0.03] border border-cream/10 backdrop-blur-sm hover:border-gold/30 hover:bg-cream/[0.05]"
        }`}>
            {badge && (
                <div className="absolute -top-3 left-6">
                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full ${
                        highlight ? "bg-ink text-gold" : "bg-gold text-ink"
                    }`}>
                        {badge}
                    </span>
                </div>
            )}
            <div>
                <h3 className={`text-base font-semibold uppercase tracking-[0.1em] mb-3 ${highlight ? "text-ink/70" : "text-cream/60"}`}>
                    {name}
                </h3>
                <div className={`text-3xl font-display font-bold ${highlight ? "text-ink" : "text-cream"}`}>
                    {price}
                </div>
                {priceNote && (
                    <div className={`text-xs mt-1 ${highlight ? "text-ink/50" : "text-cream/40"}`}>
                        {priceNote}
                    </div>
                )}
            </div>
            <ul className="flex flex-col gap-2.5 flex-1">
                {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                        <CheckIcon highlight={highlight} />
                        <span className={`text-sm leading-snug ${highlight ? "text-ink/85" : "text-cream/70"}`}>{f}</span>
                    </li>
                ))}
            </ul>
            <Link
                href={`/?service=${encodeURIComponent(serviceValue)}#contact`}
                className={`mt-2 text-center py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-[0.15em] transition-all duration-200 ${
                    highlight
                        ? "bg-ink text-gold hover:bg-char hover:text-gold-bright"
                        : "bg-cream/[0.05] text-cream border border-cream/15 hover:bg-gold hover:text-ink hover:border-gold"
                }`}
            >
                {cta}
            </Link>
        </div>
    );
}

function SectionHeader({ index, title, description }: { index: string; title: string; description: string }) {
    return (
        <div className="mb-10">
            <span className="text-[10px] uppercase tracking-[0.35em] font-bold text-gold/80">{index}</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-cream mt-1">{title}</h2>
            <p className="text-cream/55 mt-2 max-w-xl font-light">{description}</p>
        </div>
    );
}

export default function CennikClient() {
    const { t } = useTranslation();
    const cta = t("cennik.cta.button");
    const splitFeatures = (key: string) => t(key).split("|");

    return (
        <main className="min-h-screen bg-char relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <SectionBackground variant="soft" topFade={false} />
            </div>

            {/* Hero */}
            <section className="pt-28 pb-6 md:pt-32 md:pb-8 relative z-10">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h1 className="font-display font-bold text-cream text-[2.5rem] md:text-6xl lg:text-7xl tracking-tight leading-[1.05] mb-5">
                        {t("cennik.h1")}
                    </h1>
                    <p className="text-cream/65 text-lg md:text-xl font-light leading-relaxed max-w-3xl">
                        {t("cennik.lead")}
                    </p>
                </div>
            </section>

            {/* DIZAJN */}
            <section className="pt-12 pb-10 md:pt-16 md:pb-14 relative z-10">
                <div className="container mx-auto px-6">
                    <SectionHeader
                        index="01"
                        title={t("cennik.section.design.title")}
                        description={t("cennik.section.design.desc")}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <PricingCard
                            name={t("cennik.card.logoBasic.name")}
                            price={t("cennik.card.logoBasic.price")}
                            priceNote={t("cennik.priceNote.oneTime")}
                            serviceValue="Logo Basic"
                            features={splitFeatures("cennik.card.logoBasic.features")}
                            cta={cta}
                        />
                        <PricingCard
                            name={t("cennik.card.logoBrand.name")}
                            price={t("cennik.card.logoBrand.price")}
                            priceNote={t("cennik.priceNote.oneTime")}
                            badge={t("cennik.badge.popular")}
                            highlight
                            serviceValue="Logo + Brand"
                            features={splitFeatures("cennik.card.logoBrand.features")}
                            cta={cta}
                        />
                        <PricingCard
                            name={t("cennik.card.socialGraphics.name")}
                            price={t("cennik.card.socialGraphics.price")}
                            priceNote={t("cennik.priceNote.templateBundle")}
                            serviceValue="Social Media Graphics"
                            features={splitFeatures("cennik.card.socialGraphics.features")}
                            cta={cta}
                        />
                    </div>
                </div>
            </section>

            {/* MARKETING */}
            <section className="py-16 md:py-20 relative z-10">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
                <div className="container mx-auto px-6">
                    <SectionHeader
                        index="02"
                        title={t("cennik.section.marketing.title")}
                        description={t("cennik.section.marketing.desc")}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <PricingCard
                            name={t("cennik.card.marketingStarter.name")}
                            price={t("cennik.card.marketingStarter.price")}
                            priceNote={t("cennik.priceNote.monthly")}
                            badge={t("cennik.badge.new")}
                            serviceValue="Social Starter"
                            features={splitFeatures("cennik.card.marketingStarter.features")}
                            cta={cta}
                        />
                        <PricingCard
                            name={t("cennik.card.marketingPro.name")}
                            price={t("cennik.card.marketingPro.price")}
                            priceNote={t("cennik.priceNote.monthlyAds")}
                            highlight
                            badge={t("cennik.badge.recommended")}
                            serviceValue="Social Pro + Ads"
                            features={splitFeatures("cennik.card.marketingPro.features")}
                            cta={cta}
                        />
                    </div>
                </div>
            </section>

            {/* WEB */}
            <section className="py-16 md:py-20 relative z-10">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
                <div className="container mx-auto px-6">
                    <SectionHeader
                        index="03"
                        title={t("cennik.section.web.title")}
                        description={t("cennik.section.web.desc")}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <PricingCard
                            name={t("cennik.card.presentationWeb.name")}
                            price={t("cennik.card.presentationWeb.price")}
                            priceNote={t("cennik.priceNote.oneTime")}
                            serviceValue="Presentation Website"
                            features={splitFeatures("cennik.card.presentationWeb.features")}
                            cta={cta}
                        />
                        <PricingCard
                            name={t("cennik.card.companyWeb.name")}
                            price={t("cennik.card.companyWeb.price")}
                            priceNote={t("cennik.priceNote.oneTime")}
                            badge={t("cennik.badge.bestseller")}
                            highlight
                            serviceValue="Company Website"
                            features={splitFeatures("cennik.card.companyWeb.features")}
                            cta={cta}
                        />
                        <PricingCard
                            name={t("cennik.card.eshop.name")}
                            price={t("cennik.card.eshop.price")}
                            priceNote={t("cennik.priceNote.oneTime")}
                            serviceValue="E-shop"
                            features={splitFeatures("cennik.card.eshop.features")}
                            cta={cta}
                        />
                    </div>
                </div>
            </section>

            {/* CHATBOT */}
            <section className="py-16 md:py-20 relative z-10">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
                <div className="container mx-auto px-6">
                    <SectionHeader
                        index="04"
                        title={t("cennik.section.chatbot.title")}
                        description={t("cennik.section.chatbot.desc")}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <PricingCard
                            name={t("cennik.card.chatbotBasic.name")}
                            price={t("cennik.card.chatbotBasic.price")}
                            priceNote={t("cennik.priceNote.oneTime")}
                            serviceValue="Chatbot Basic"
                            features={splitFeatures("cennik.card.chatbotBasic.features")}
                            cta={cta}
                        />
                        <PricingCard
                            name={t("cennik.card.chatbotPro.name")}
                            price={t("cennik.card.chatbotPro.price")}
                            priceNote={t("cennik.priceNote.oneTime")}
                            highlight
                            serviceValue="Chatbot Pro"
                            features={splitFeatures("cennik.card.chatbotPro.features")}
                            cta={cta}
                        />
                    </div>
                </div>
            </section>

            {/* AUTOMATIZÁCIA */}
            <section className="py-16 md:py-20 relative z-10">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
                <div className="container mx-auto px-6">
                    <SectionHeader
                        index="05"
                        title={t("cennik.section.automation.title")}
                        description={t("cennik.section.automation.desc")}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <PricingCard
                            name={t("cennik.card.automationStarter.name")}
                            price={t("cennik.card.automationStarter.price")}
                            priceNote={t("cennik.priceNote.oneTime")}
                            serviceValue="Automation Starter"
                            features={splitFeatures("cennik.card.automationStarter.features")}
                            cta={cta}
                        />
                        <PricingCard
                            name={t("cennik.card.automationPro.name")}
                            price={t("cennik.card.automationPro.price")}
                            priceNote={t("cennik.priceNote.byProject")}
                            highlight
                            serviceValue="Automation Pro / Enterprise"
                            features={splitFeatures("cennik.card.automationPro.features")}
                            cta={cta}
                        />
                    </div>
                </div>
            </section>

            {/* Note */}
            <section className="py-12 relative z-10">
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
                        className="inline-flex items-center gap-3 px-10 py-4 bg-gold text-ink rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-gold-bright transition-all shadow-lg shadow-black/20"
                    >
                        {t("cennik.bottomCta.button")}
                    </Link>
                </div>
            </section>
        </main>
    );
}
