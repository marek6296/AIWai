import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Cenník — AIWai",
    description: "Transparentné ceny bez prekvapení. Web, dizajn, AI chatbot a automatizácia — vyberte si čo potrebujete.",
};

const CheckIcon = () => (
    <svg className="w-4 h-4 text-brand-sand flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
        <div className={`relative rounded-2xl p-7 flex flex-col gap-6 ${
            highlight
                ? "bg-brand-indigo text-white shadow-[0_20px_60px_-10px_rgba(28,31,58,0.3)]"
                : "bg-white border border-brand-indigo/[0.08] shadow-[0_4px_30px_-5px_rgba(28,31,58,0.06)]"
        }`}>
            {badge && (
                <div className="absolute -top-3 left-6">
                    <span className="bg-brand-sand text-white text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full">
                        {badge}
                    </span>
                </div>
            )}
            <div>
                <h3 className={`text-base font-semibold uppercase tracking-[0.1em] mb-3 ${highlight ? "text-white/60" : "text-brand-indigo/50"}`}>
                    {name}
                </h3>
                <div className={`text-3xl font-display font-bold ${highlight ? "text-white" : "text-brand-indigo"}`}>
                    {price}
                </div>
                {priceNote && (
                    <div className={`text-xs mt-1 ${highlight ? "text-white/40" : "text-brand-indigo/30"}`}>
                        {priceNote}
                    </div>
                )}
            </div>
            <ul className="flex flex-col gap-2.5 flex-1">
                {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                        <CheckIcon />
                        <span className={`text-sm leading-snug ${highlight ? "text-white/80" : "text-brand-indigo/60"}`}>{f}</span>
                    </li>
                ))}
            </ul>
            <Link
                href="/#contact"
                className={`mt-2 text-center py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-[0.15em] transition-all duration-200 ${
                    highlight
                        ? "bg-brand-sand text-white hover:bg-brand-sand/90"
                        : "bg-brand-indigo/[0.06] text-brand-indigo hover:bg-brand-indigo hover:text-white"
                }`}
            >
                Mám záujem
            </Link>
        </div>
    );
}

export default function CennikPage() {
    return (
        <main className="min-h-screen bg-white">
            {/* Hero */}
            <section className="relative pt-28 pb-12 overflow-hidden">
                <div className="absolute inset-0 gradient-mesh" />
                <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] rounded-full bg-brand-sand/8 blur-[120px] pointer-events-none" />
                <div className="absolute top-[30%] right-[10%] w-[300px] h-[300px] rounded-full bg-brand-indigo/5 blur-[100px] pointer-events-none" />
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-display font-bold text-brand-indigo tracking-tight mb-5">
                        Transparentné ceny.
                    </h1>
                    <p className="text-lg md:text-xl text-brand-indigo/40 max-w-2xl mx-auto font-light leading-relaxed">
                        Viete čo dostanete a za koľko — ešte pred začatím.<br />
                        Žiadne skryté poplatky, žiadne prekvapenia na faktúre.
                    </p>
                </div>
            </section>

            {/* DIZAJN */}
            <section className="py-16 md:py-20">
                <div className="container mx-auto px-6">
                    <div className="mb-10">
                        <span className="text-[10px] uppercase tracking-[0.35em] font-bold text-brand-sand/70">01</span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-indigo mt-1">Logo & Dizajn</h2>
                        <p className="text-brand-indigo/40 mt-2 max-w-xl">Vizuálna identita, ktorá robí prvý dojem za vás.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <PricingCard
                            name="Logo Basic"
                            price="od €99"
                            priceNote="jednorazová platba"
                            features={[
                                "3 návrhy loga",
                                "2 kolá revízií",
                                "Formáty PNG, SVG, PDF",
                                "Svetlá aj tmavá verzia",
                                "Odovzdanie do 5 dní",
                            ]}
                        />
                        <PricingCard
                            name="Logo + Brand"
                            price="od €229"
                            priceNote="jednorazová platba"
                            badge="Populárne"
                            highlight
                            features={[
                                "Logo (3 návrhy, 3 kolá revízií)",
                                "Farebná paleta + typografia",
                                "Brand style guide (PDF)",
                                "5 šablón pre sociálne siete",
                                "Všetky formáty súborov",
                                "Odovzdanie do 10 dní",
                            ]}
                        />
                        <PricingCard
                            name="Grafika pre sociálne siete"
                            price="od €69"
                            priceNote="balíček 10 grafík"
                            features={[
                                "10 prispôsobených grafík",
                                "Formáty pre Instagram, FB, LinkedIn",
                                "Editovateľné šablóny",
                                "1 kolo revízií",
                                "Odovzdanie do 5 dní",
                            ]}
                        />
                    </div>
                </div>
            </section>

            {/* WEB */}
            <section className="py-16 md:py-20 bg-[#FAFAFA]">
                <div className="container mx-auto px-6">
                    <div className="mb-10">
                        <span className="text-[10px] uppercase tracking-[0.35em] font-bold text-brand-sand/70">02</span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-indigo mt-1">Web & E-shop</h2>
                        <p className="text-brand-indigo/40 mt-2 max-w-xl">Moderný web, ktorý načíta rýchlo a predáva.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <PricingCard
                            name="Prezentačná stránka"
                            price="od €299"
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
                            price="od €599"
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
                            price="od €999"
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
            <section className="py-16 md:py-20">
                <div className="container mx-auto px-6">
                    <div className="mb-10">
                        <span className="text-[10px] uppercase tracking-[0.35em] font-bold text-brand-sand/70">03</span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-indigo mt-1">AI Chatbot</h2>
                        <p className="text-brand-indigo/40 mt-2 max-w-xl">Chatbot, ktorý pozná váš biznis a odpovedá namiesto vás — 24/7.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
                        <PricingCard
                            name="Chatbot Basic"
                            price="od €249"
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
                            price="od €499"
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
            <section className="py-16 md:py-20 bg-[#FAFAFA]">
                <div className="container mx-auto px-6">
                    <div className="mb-10">
                        <span className="text-[10px] uppercase tracking-[0.35em] font-bold text-brand-sand/70">04</span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-indigo mt-1">Automatizácia procesov</h2>
                        <p className="text-brand-indigo/40 mt-2 max-w-xl">Prepojíme vaše nástroje a ušetríme vám hodiny rutinnej práce každý týždeň.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
                        <PricingCard
                            name="Starter"
                            price="od €299"
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
            <section className="py-12">
                <div className="container mx-auto px-6 max-w-3xl">
                    <div className="rounded-2xl border border-brand-indigo/[0.06] bg-brand-indigo/[0.02] p-8 text-center">
                        <p className="text-brand-indigo/50 text-sm leading-relaxed">
                            Ceny sú orientačné a závisí od konkrétnych požiadaviek projektu.<br />
                            <strong className="text-brand-indigo/70">Presná cena vždy vopred, písomne — pred začatím prác.</strong>
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 md:py-28">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-brand-indigo mb-4">Neviete čo vám sedí?</h2>
                    <p className="text-brand-indigo/40 text-lg mb-10 font-light">Zavoláme si — 30 minút a máte jasnú cenu aj plán.</p>
                    <Link
                        href="/#contact"
                        className="inline-flex items-center gap-3 px-10 py-4 bg-brand-indigo text-white rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-brand-indigo/90 transition-all shadow-lg shadow-brand-indigo/20"
                    >
                        Kontaktujte nás
                    </Link>
                </div>
            </section>
        </main>
    );
}
