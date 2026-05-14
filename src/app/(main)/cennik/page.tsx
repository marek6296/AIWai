import type { Metadata } from "next";
import Link from "next/link";
import SectionBackground from "@/components/backgrounds/SectionBackground";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, SITE_URL } from "@/lib/seo/schemas";

export const metadata: Metadata = {
    title: "Cenník — Web, AI chatbot, automatizácia, logo, marketing",
    description:
        "Transparentné ceny: logo od €99, web od €299, e-shop od €999, chatbot od €249, automatizácia od €299, marketing od €200/mes.",
    alternates: { canonical: "/cennik" },
    openGraph: {
        title: "Cenník AIWai — Transparentné ceny bez prekvapení",
        description:
            "Logo od €99, web od €299, e-shop od €999, AI chatbot od €249. Jasná cena pred začatím.",
        url: `${SITE_URL}/cennik`,
        type: "website",
        locale: "sk_SK",
        siteName: "AIWai",
        images: ["/og-image.png"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Cenník AIWai — Transparentné ceny",
        description:
            "Logo od €99, web od €299, e-shop od €999, AI chatbot od €249.",
        images: ["/og-image.png"],
    },
};

const cennikBreadcrumbs = breadcrumbSchema([
    { name: "AIWai", url: "/" },
    { name: "Cenník", url: "/cennik" },
]);

const cennikOffers = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": `${SITE_URL}/cennik#catalog`,
    name: "Cenník AIWai",
    url: `${SITE_URL}/cennik`,
    provider: { "@id": `${SITE_URL}/#organization` },
    itemListElement: [
        { name: "Logo Basic", price: "99", description: "Logo v 3 variantoch (SVG, PNG, PDF)." },
        { name: "Logo + Brand", price: "229", description: "Logo + brand guide + šablóny pre soc. siete." },
        { name: "Grafika pre sociálne siete", price: "149", description: "Set 5–10 príspevkov pre Facebook a Instagram." },
        { name: "Prezentačná stránka", price: "299", description: "1–3 stránky, kontaktný formulár, mobilná verzia." },
        { name: "Firemný web", price: "599", description: "Viacstránkový web, blog, SEO, CMS." },
        { name: "E-shop", price: "999", description: "Produkty, košík, platobná brána." },
        { name: "Chatbot Basic", price: "249", description: "Chat widget na webe, tréning na 1 dokumente." },
        { name: "Chatbot Pro", price: "499", description: "Chat + Voice AI, CRM integrácia." },
        { name: "Automatizácia Starter", price: "299", description: "1 workflow v Make.com." },
        { name: "Marketing Starter", price: "200", description: "Mesačná správa soc. sietí." },
        { name: "Marketing Pro + Ads", price: "300", description: "Mesačná správa + Meta Ads kampane." },
    ].map((offer, idx) => ({
        "@type": "Offer",
        position: idx + 1,
        name: offer.name,
        description: offer.description,
        price: offer.price,
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        seller: { "@id": `${SITE_URL}/#organization` },
    })),
};

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
}

function PricingCard({ name, price, priceNote, features, highlight, badge }: PricingCardProps) {
    return (
        <div className={`relative rounded-2xl p-7 flex flex-col gap-6 transition-all duration-300 ${
            highlight
                ? "bg-gold text-ink shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)] ring-1 ring-gold-deep/40"
                : "bg-cream/[0.03] border border-cream/10 backdrop-blur-sm hover:border-gold/30 hover:bg-cream/[0.05]"
        }`}>
            {badge && (
                <div className="absolute -top-3 left-6">
                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full ${
                        highlight
                            ? "bg-ink text-gold"
                            : "bg-gold text-ink"
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
                href="/#contact"
                className={`mt-2 text-center py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-[0.15em] transition-all duration-200 ${
                    highlight
                        ? "bg-ink text-gold hover:bg-char hover:text-gold-bright"
                        : "bg-cream/[0.05] text-cream border border-cream/15 hover:bg-gold hover:text-ink hover:border-gold"
                }`}
            >
                Mám záujem
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

export default function CennikPage() {
    return (
        <main className="min-h-screen bg-char relative overflow-hidden">
            <JsonLd id="ld-cennik-breadcrumb" data={cennikBreadcrumbs} />
            <JsonLd id="ld-cennik-offers" data={cennikOffers} />
            {/* Site-wide animated dark background — single instance covers all sections */}
            <div className="absolute inset-0 pointer-events-none">
                <SectionBackground variant="soft" topFade={false} />
            </div>

            {/* Page Hero with H1 — SEO-critical, was missing before */}
            <section className="pt-28 pb-6 md:pt-32 md:pb-8 relative z-10">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h1 className="font-display font-bold text-cream text-[2.5rem] md:text-6xl lg:text-7xl tracking-tight leading-[1.05] mb-5">
                        Cenník — transparentne, bez prekvapení
                    </h1>
                    <p className="text-cream/65 text-lg md:text-xl font-light leading-relaxed max-w-3xl">
                        Jasné ceny pred začatím projektu. Logo, web, e-shop, AI chatbot,
                        automatizácia a marketing — vyberte si, čo potrebujete. Konzultácia
                        zdarma do 24 hodín.
                    </p>
                </div>
            </section>

            {/* DIZAJN */}
            <section className="pt-12 pb-10 md:pt-16 md:pb-14 relative z-10">
                <div className="container mx-auto px-6">
                    <SectionHeader
                        index="01"
                        title="Logo & Dizajn"
                        description="Vizuálna identita, ktorá robí prvý dojem za vás."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <PricingCard
                            name="Logo Basic"
                            price="od €69"
                            priceNote="jednorazová platba"
                            features={[
                                "3 návrhy loga",
                                "2 kolá revízií",
                                "Formáty PNG a JPEG",
                                "Svetlá aj tmavá verzia",
                                "Bez vektorových súborov",
                                "Odovzdanie do 5 dní",
                            ]}
                        />
                        <PricingCard
                            name="Logo + Brand"
                            price="od €159"
                            priceNote="jednorazová platba"
                            badge="Populárne"
                            highlight
                            features={[
                                "Logo (3 návrhy + 3 kolá revízií)",
                                "Vektorové súbory (SVG, AI, PDF) — tlač bez straty kvality",
                                "Svetlá, tmavá aj farebná verzia loga",
                                "Brand manuál — farby, písmo a pravidlá použitia",
                                "5 šablón pre sociálne siete",
                                "Odovzdanie do 10 dní",
                            ]}
                        />
                        <PricingCard
                            name="Grafika pre sociálne siete"
                            price="od €99"
                            priceNote="jednorazový balíček šablón"
                            features={[
                                "15 brandovaných šablón (feed + stories)",
                                "Profilový obrázok + cover fotka",
                                "Highlight covers pre Instagram",
                                "Editovateľné súbory (Photoshop / Illustrator)",
                                "Jednotný vizuálny štýl podľa vašej značky",
                                "Odovzdanie do 7 dní",
                            ]}
                        />
                    </div>
                </div>
            </section>

            {/* MARKETING & SOCIÁLNE SIETE */}
            <section className="py-16 md:py-20 relative z-10">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
                <div className="container mx-auto px-6">
                    <SectionHeader
                        index="02"
                        title="Marketing & Sociálne siete"
                        description="Kompletná mesačná správa sociálnych sietí — obsah, grafika, AI foto úpravy aj reklamy."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <PricingCard
                            name="Marketing Starter"
                            price="od €139/mes"
                            priceNote="mesačná správa"
                            badge="Nové"
                            features={[
                                "Plán príspevkov na celý mesiac",
                                "Facebook + Instagram + Stories",
                                "Vaše fotky prerobené pomocou AI do profesionálneho štýlu",
                                "Texty príspevkov — copywriting",
                                "Správa komentárov a správ",
                                "Mesačný report výsledkov",
                            ]}
                        />
                        <PricingCard
                            name="Marketing Pro + Ads"
                            price="od €209/mes"
                            priceNote="správa + reklamy"
                            highlight
                            badge="Odporúčame"
                            features={[
                                "Všetko z Marketing Starter",
                                "Tvorba a spustenie Meta Ads kampaní",
                                "Správa reklamného rozpočtu (budget nie je v cene)",
                                "Priebežná optimalizácia reklám počas mesiaca",
                                "Týždenné reporty výkonu kampaní",
                                "Konzultácia stratégie každý mesiac",
                            ]}
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
                        title="Web & E-shop"
                        description="Moderný web, ktorý načíta rýchlo a predáva."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <PricingCard
                            name="Prezentačná stránka"
                            price="od €199"
                            priceNote="jednorazová platba"
                            features={[
                                "1–3 stránky",
                                "Kontaktný formulár",
                                "Mobilná verzia",
                                "Základné SEO",
                                "Odovzdanie do 2 týždňov",
                            ]}
                        />
                        <PricingCard
                            name="Firemný web"
                            price="od €399"
                            priceNote="jednorazová platba"
                            badge="Najpredávanejší"
                            highlight
                            features={[
                                "5–10 stránok",
                                "CMS — obsah editujete sami",
                                "Blog / aktuality",
                                "SEO optimalizácia",
                                "Google Analytics",
                                "Odovzdanie do 3–4 týždňov",
                            ]}
                        />
                        <PricingCard
                            name="E-shop"
                            price="od €699"
                            priceNote="jednorazová platba"
                            features={[
                                "Produktový katalóg",
                                "Online platby (Stripe, PayPal)",
                                "Správa objednávok",
                                "Mobilná verzia",
                                "SEO + analytika",
                                "Odovzdanie do 4–6 týždňov",
                            ]}
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
                        title="AI Chatbot"
                        description="Chatbot, ktorý pozná váš biznis a odpovedá namiesto vás — 24/7."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <PricingCard
                            name="Chatbot Basic"
                            price="od €169"
                            priceNote="jednorazová platba"
                            features={[
                                "Odpovede na časté otázky",
                                "Integrácia na váš web",
                                "Natrénovaný na vašich podkladoch",
                                "Slovenčina + angličtina",
                                "Nastavenie do 2 týždňov",
                            ]}
                        />
                        <PricingCard
                            name="Chatbot Pro"
                            price="od €349"
                            priceNote="jednorazová platba"
                            highlight
                            features={[
                                "Vlastná knowledge base (vaše dokumenty)",
                                "Zachytávanie leadov",
                                "Rezervácia stretnutí",
                                "Napojenie na CRM",
                                "Viacjazyčnosť",
                                "Nastavenie do 3 týždňov",
                            ]}
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
                        title="Automatizácia procesov"
                        description="Prepojíme vaše nástroje a ušetríme vám hodiny rutinnej práce každý týždeň."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <PricingCard
                            name="Starter"
                            price="od €199"
                            priceNote="jednorazová platba"
                            features={[
                                "2–3 automatické workflow",
                                "Prepojenie 2–3 nástrojov",
                                "Email alebo CRM automatizácia",
                                "Testovanie a odovzdanie",
                                "2 týždne nastavenia",
                            ]}
                        />
                        <PricingCard
                            name="Pro / Enterprise"
                            price="Dohodou"
                            priceNote="podľa rozsahu projektu"
                            highlight
                            features={[
                                "Neobmedzené workflow",
                                "Komplexné systémové prepojenia",
                                "AI spracovanie dokumentov",
                                "Integrácia ERP / vlastných systémov",
                                "Mesačná podpora a monitoring",
                            ]}
                        />
                    </div>
                </div>
            </section>

            {/* Note */}
            <section className="py-12 relative z-10">
                <div className="container mx-auto px-6 max-w-3xl">
                    <div className="rounded-2xl border border-cream/10 bg-cream/[0.03] backdrop-blur-sm p-8 text-center">
                        <p className="text-cream/60 text-sm leading-relaxed">
                            Ceny sú orientačné a závisí od konkrétnych požiadaviek projektu.<br />
                            <strong className="text-gold">Presná cena vždy vopred, písomne — pred začatím prác.</strong>
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 md:py-28 relative z-10">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-cream mb-4">Neviete čo vám sedí?</h2>
                    <p className="text-cream/55 text-lg mb-10 font-light">Zavoláme si — 30 minút a máte jasnú cenu aj plán.</p>
                    <Link
                        href="/#contact"
                        className="inline-flex items-center gap-3 px-10 py-4 bg-gold text-ink rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-gold-bright transition-all shadow-lg shadow-black/20"
                    >
                        Kontaktujte nás
                    </Link>
                </div>
            </section>
        </main>
    );
}
