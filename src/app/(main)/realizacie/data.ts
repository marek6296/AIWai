/**
 * Realizacie / portfolio data.
 *
 * Plochý zoznam projektov v poradí, v akom sa zobrazia v karuseli.
 * Prvé štyri projekty sú "highlight" — najnovšie/najvýraznejšie realizácie,
 * ktoré chceme návštevníkovi ukázať ako prvé. Zvyšok ide v poradí: ďalšie
 * AIWai produkty → ďalšie klientske weby → web aplikácie → osobné.
 *
 * Pôvodný `Group` rozdeľovač sme odstránili, lebo karusel groupy už nezobrazuje.
 */

export type ProjectTag = "Web" | "Aplikácia" | "AI" | "Dizajn";
export type ProjectStatus = "live" | "development" | "showcase";

export interface Project {
    slug: string;
    name: string;
    category: string;
    description: string;
    /** 3–5 konkrétnych features/výsledkov — zobrazí sa v modálnom detaile ako bullet list. */
    highlights?: string[];
    /** Rok dokončenia / spustenia projektu. */
    year?: number;
    /** Status — live (produkcia), development (rozvoj), showcase (interný/ukážka). */
    status?: ProjectStatus;
    stack: string[];
    url: string;
    tag: ProjectTag;
    badgeKey?: "live" | "newest" | "internal";
    /** When true the card is showcase-only — no link, no URL shown. */
    private?: boolean;
}

export const REALIZACIE_PROJECTS: Project[] = [
    // ── Highlights ────────────────────────────────────────────────────
    {
        slug: "aiwai-news",
        name: "AIWai News",
        category: "Spravodajský portál",
        description:
            "Plnohodnotný AI spravodajský portál s denným tokom správ zo sveta umelej inteligencie. Vlastná redakcia, kategorizácia, archív.",
        highlights: [
            "Denný tok správ zo sveta umelej inteligencie",
            "Vlastná redakcia s kategorizáciou článkov",
            "Archív s vyhľadávaním a trending sekciou týždňa",
            "Light/dark režim, optimalizované pre rýchle čítanie",
        ],
        year: 2026,
        status: "live",
        stack: ["Next.js", "Supabase", "TypeScript"],
        url: "https://aiwai.news",
        tag: "Web",
        badgeKey: "live",
    },
    {
        slug: "morak",
        name: "Morak",
        category: "Fotovoltika · Elektroinštalácie",
        description:
            "Firemný web pre dodávateľa fotovoltiky, klimatizácií, kamerových systémov a elektroinštalácií. Vlastné SVG ikony a plynulé animácie.",
        highlights: [
            "Štyri prepojené služby: FV, klimatizácie, kamery, elektroinštalácie",
            "Vlastné SVG ikony pre každú kategóriu služieb",
            "Plynulé Framer Motion animácie a scroll triggery",
            "Typografia Space Grotesk + Inter Tight pre čistý korporátny look",
        ],
        year: 2026,
        status: "live",
        stack: ["Next.js 14", "Framer Motion", "Tailwind"],
        url: "https://morak-chi.vercel.app",
        tag: "Web",
        badgeKey: "newest",
    },
    {
        slug: "zaidans-barbershop",
        name: "Zaidans Barbershop",
        category: "Barbershop",
        description:
            "Prezentačný web pre barbershop s rezerváciou termínov, galériou prác a kontaktom. Dôraz na vizuálnu identitu prevádzky.",
        highlights: [
            "Rezervácia termínov priamo z webu",
            "Galéria prác s priamou referenciou na prácu majiteľa",
            "Vizuálna identita prevádzky — typografia, farebnosť, fotografia",
            "Mobile-first dizajn, optimalizovaný pre lokálne SEO",
        ],
        year: 2026,
        status: "live",
        stack: ["Next.js 14", "Tailwind"],
        url: "https://zaidans-barbershop.vercel.app",
        tag: "Web",
    },
    {
        slug: "doprai",
        name: "DoprAi",
        category: "Data Analyzer Studio",
        description:
            "Analytická platforma pre prácu s dátami — interaktívne dashboardy, importy a vizualizácie. Postavené na Supabase.",
        highlights: [
            "Interaktívne dashboardy s reálnymi dátami",
            "Import a transformácia z CSV/Excel",
            "Vizualizácie postavené nad Supabase Postgres",
            "Rýchla práca s veľkými datasetmi",
        ],
        year: 2026,
        status: "development",
        stack: ["Next.js 15", "Supabase"],
        url: "https://data-studiodony.vercel.app",
        tag: "Aplikácia",
    },

    // ── Zvyšok AIWai produktov ───────────────────────────────────────
    {
        slug: "aiwai-tools",
        name: "AIWai Tools",
        category: "Katalóg AI nástrojov",
        description:
            "Kurátorovaný katalóg AI nástrojov a praktické návody pre n8n, Make a Zapier — recepty na automatizácie.",
        highlights: [
            "Kurátorovaný katalóg overených AI nástrojov",
            "Praktické návody pre n8n, Make.com a Zapier",
            "Recepty na typické biznis automatizácie",
            "Filtre podľa kategórie, ceny a use-case",
        ],
        year: 2026,
        status: "live",
        stack: ["Vue 3", "Vite", "Tailwind"],
        url: "https://aiwai.tools",
        tag: "Web",
    },
    {
        slug: "aiwai-games",
        name: "AIWai Games",
        category: "Herná platforma",
        description:
            "Herný hub — Quiz Duel a Couple Quest. Multiplayer pre páry a kamarátov priamo v prehliadači aj v mobile.",
        highlights: [
            "Quiz Duel — kvízové súboje 1v1 v reálnom čase",
            "Couple Quest — kooperatívna hra pre páry",
            "Multiplayer v prehliadači aj v mobilnej aplikácii",
            "Cross-platform stack (Flutter + web)",
        ],
        year: 2026,
        status: "live",
        stack: ["Flutter", "HTML/JS"],
        url: "https://aiwai-games.vercel.app",
        tag: "Aplikácia",
    },

    // ── Ďalšie klientske weby ────────────────────────────────────────
    {
        slug: "marketing-web",
        name: "Marketing Web",
        category: "Marketingová prezentácia",
        description:
            "Konverzný marketingový web s jasným posolstvom a štruktúrou navrhnutou pre generovanie leadov.",
        highlights: [
            "Konverzná štruktúra navrhnutá pre lead generation",
            "Jasné CTA v každej sekcii",
            "Optimalizácia rýchlosti pre kampaňový traffic",
            "A/B testovateľné varianty hero sekcie",
        ],
        year: 2026,
        status: "live",
        stack: ["Next.js", "Tailwind"],
        url: "https://marketing-web-phi-sage.vercel.app",
        tag: "Web",
    },

    // ── Web aplikácie & dashboardy ───────────────────────────────────
    {
        slug: "kalendar-v8",
        name: "Kalendár V8",
        category: "Rezervačný systém",
        description:
            "Plnohodnotný rezervačný a kalendárový systém pre reštauráciu V8 Bistro. Správa termínov, hostí a personálu.",
        highlights: [
            "Rezervácie stolov pre V8 Bistro v reálnom čase",
            "Správa termínov, hostí a obsadenosti",
            "Plánovanie smien personálu",
            "Admin panel s prehľadom kapacity",
        ],
        year: 2025,
        status: "live",
        stack: ["Next.js", "Supabase"],
        url: "https://kalendar.v8bistro.cz",
        tag: "Aplikácia",
    },
    {
        slug: "business-scraper",
        name: "Lead Agent",
        category: "Automatizácia obchodu",
        description:
            "Agent na generovanie leadov — scrapuje firmy z Google Maps, analyzuje ich weby cez Claude a generuje personalizované outreach emaily.",
        highlights: [
            "Scrapuje firmy z Google Maps cez Playwright (kategória + lokalita)",
            "Hľadá emaily na homepage aj kontaktných podstránkach",
            "Analyzuje weby cez Claude Haiku a identifikuje príležitosti",
            "Generuje personalizované SK outreach emaily (max 130 slov, priateľský tón)",
            "Dashboard so štatistikami, deduplikáciou a progress logmi",
        ],
        year: 2026,
        status: "showcase",
        stack: ["Python", "FastAPI", "Playwright", "Claude API", "Supabase"],
        url: "https://lead-agent-dashboard-smoky.vercel.app",
        tag: "AI",
        badgeKey: "internal",
        private: true,
    },

    // ── Osobné ───────────────────────────────────────────────────────
    {
        slug: "cv-web",
        name: "Osobné CV",
        category: "Životopis · Marek Donoval",
        description:
            "Online životopis s prehľadom skúseností, projektov a kontaktov. Čistý dizajn, rýchle načítanie.",
        highlights: [
            "Prehľad skúseností a portfólio projektov",
            "Čistý minimalistický dizajn bez šablón",
            "Rýchle načítanie a optimalizácia pre tlač",
            "Priame kontaktné odkazy",
        ],
        year: 2024,
        status: "live",
        stack: ["HTML", "CSS", "JS"],
        url: "https://marek-donoval-cv.vercel.app",
        tag: "Web",
    },
];
