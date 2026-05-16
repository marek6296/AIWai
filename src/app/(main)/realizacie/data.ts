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

export interface Project {
    slug: string;
    name: string;
    category: string;
    description: string;
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
        stack: ["Python", "FastAPI", "Playwright", "Claude API"],
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
        stack: ["HTML", "CSS", "JS"],
        url: "https://marek-donoval-cv.vercel.app",
        tag: "Web",
    },
];
