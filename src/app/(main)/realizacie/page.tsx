import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SectionBackground from "@/components/backgrounds/SectionBackground";

export const metadata: Metadata = {
    title: "Realizácie — AIWai",
    description: "Výber našich realizovaných projektov — weby, dashboardy, AI nástroje a automatizácie. Reálne nasadené v produkcii.",
};

interface Project {
    slug: string;
    name: string;
    category: string;
    description: string;
    stack: string[];
    url: string;
    badge?: string;
    /** When true the card is showcase-only — no link, no URL shown. */
    private?: boolean;
}

interface Group {
    index: string;
    title: string;
    description: string;
    projects: Project[];
}

const GROUPS: Group[] = [
    {
        index: "01",
        title: "AIWai ekosystém",
        description: "Vlastné produkty a platformy postavené nad AI — od spravodajstva po hry.",
        projects: [
            {
                slug: "aiwai-news",
                name: "AIWai News",
                category: "Spravodajský portál",
                description: "Plnohodnotný AI spravodajský portál s denným tokom správ zo sveta umelej inteligencie. Vlastná redakcia, kategorizácia, archív.",
                stack: ["Next.js", "Supabase", "TypeScript"],
                url: "https://aiwai.news",
                badge: "Live",
            },
            {
                slug: "aiwai-tools",
                name: "AIWai Tools",
                category: "Katalóg AI nástrojov",
                description: "Kurátorovaný katalóg AI nástrojov a praktické návody pre n8n, Make a Zapier — recepty na automatizácie.",
                stack: ["Vue 3", "Vite", "Tailwind"],
                url: "https://aiwai.tools",
            },
            {
                slug: "aiwai-games",
                name: "AIWai Games",
                category: "Herná platforma",
                description: "Herný hub — Quiz Duel a Couple Quest. Multiplayer pre páry a kamarátov priamo v prehliadači aj v mobile.",
                stack: ["Flutter", "HTML/JS"],
                url: "https://aiwai-games.vercel.app",
            },
        ],
    },
    {
        index: "02",
        title: "Firemné weby",
        description: "Prezentačné weby pre klientov — moderný dizajn, rýchle načítanie, mobilná verzia.",
        projects: [
            {
                slug: "morak",
                name: "Morak",
                category: "Fotovoltika · Elektroinštalácie",
                description: "Firemný web pre dodávateľa fotovoltiky, klimatizácií, kamerových systémov a elektroinštalácií. Vlastné SVG ikony a plynulé animácie.",
                stack: ["Next.js 14", "Framer Motion", "Tailwind"],
                url: "https://morak-chi.vercel.app",
                badge: "Najnovšie",
            },
            {
                slug: "zaidans-barbershop",
                name: "Zaidans Barbershop",
                category: "Barbershop",
                description: "Prezentačný web pre barbershop s rezerváciou termínov, galériou prác a kontaktom. Dôraz na vizuálnu identitu prevádzky.",
                stack: ["Next.js 14", "Tailwind"],
                url: "https://zaidans-barbershop.vercel.app",
            },
            {
                slug: "marketing-web",
                name: "Marketing Web",
                category: "Marketingová prezentácia",
                description: "Konverzný marketingový web s jasným posolstvom a štruktúrou navrhnutou pre generovanie leadov.",
                stack: ["Next.js", "Tailwind"],
                url: "https://marketing-web-phi-sage.vercel.app",
            },
        ],
    },
    {
        index: "03",
        title: "Web aplikácie & Dashboardy",
        description: "Interné nástroje, dashboardy a SaaS aplikácie — od dátovej analýzy po správu agentov.",
        projects: [
            {
                slug: "doprai",
                name: "DoprAi",
                category: "Data Analyzer Studio",
                description: "Analytická platforma pre prácu s dátami — interaktívne dashboardy, importy a vizualizácie. Postavené na Supabase.",
                stack: ["Next.js 15", "Supabase"],
                url: "https://data-studiodony.vercel.app",
            },
            {
                slug: "agent-manager",
                name: "Agent Manager",
                category: "AI Workflow Builder",
                description: "Vizuálny editor AI agentov a automatizovaných pracovných tokov. Drag-and-drop tvorba workflow cez React Flow.",
                stack: ["Next.js 14", "Supabase", "React Flow"],
                url: "https://agent-manager-aiwai.vercel.app",
            },
            {
                slug: "kalendar-v8",
                name: "Kalendár V8",
                category: "Rezervačný systém",
                description: "Plnohodnotný rezervačný a kalendárový systém pre reštauráciu V8 Bistro. Správa termínov, hostí a personálu.",
                stack: ["Next.js", "Supabase"],
                url: "https://kalendar.v8bistro.cz",
            },
            {
                slug: "business-scraper",
                name: "Lead Agent",
                category: "Automatizácia obchodu",
                description: "Agent na generovanie leadov — scrapuje firmy z Google Maps, analyzuje ich weby cez Claude a generuje personalizované outreach emaily.",
                stack: ["Python", "FastAPI", "Playwright", "Claude API"],
                url: "https://lead-agent-dashboard-smoky.vercel.app",
                badge: "Interný nástroj",
                private: true,
            },
        ],
    },
    {
        index: "04",
        title: "Osobné & experimentálne",
        description: "Menšie projekty, kde si testujeme nové technológie a prístupy.",
        projects: [
            {
                slug: "cv-web",
                name: "Osobné CV",
                category: "Životopis · Marek Donoval",
                description: "Online životopis s prehľadom skúseností, projektov a kontaktov. Čistý dizajn, rýchle načítanie.",
                stack: ["HTML", "CSS", "JS"],
                url: "https://marek-donoval-cv.vercel.app",
            },
        ],
    },
];

function ProjectCard({ project }: { project: Project }) {
    const isPrivate = !!project.private;

    // Shared inner content — same markup for both <a> and <div> wrappers.
    const inner = (
        <>
            {/* Screenshot */}
            <div className="relative aspect-[16/10] overflow-hidden bg-char-soft">
                <Image
                    src={`/portfolio/${project.slug}.jpg`}
                    alt={project.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className={`object-cover object-top transition-transform duration-700 ease-out ${
                        isPrivate ? "" : "group-hover:scale-[1.04]"
                    }`}
                />
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-char via-char/10 to-transparent opacity-90 transition-opacity duration-500 ${
                    isPrivate ? "" : "group-hover:opacity-70"
                }`} />
                {/* Badge */}
                {project.badge && (
                    <div className="absolute top-4 left-4">
                        <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full ${
                            isPrivate
                                ? "bg-cream/10 text-cream/80 border border-cream/20 backdrop-blur-md"
                                : "bg-gold text-ink"
                        }`}>
                            {project.badge}
                        </span>
                    </div>
                )}
                {/* Lock badge for private — replaces the external-link icon */}
                {isPrivate ? (
                    <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-char/70 backdrop-blur-md flex items-center justify-center" title="Privátny projekt — náhľad bez odkazu">
                        <svg className="w-4 h-4 text-gold/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <rect x="5" y="11" width="14" height="9" rx="2" />
                            <path strokeLinecap="round" d="M8 11V8a4 4 0 1 1 8 0v3" />
                        </svg>
                    </div>
                ) : (
                    <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-char/70 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-[-4px] group-hover:translate-y-0">
                        <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col gap-3 flex-1">
                <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-gold/80 font-bold mb-1.5">
                        {project.category}
                    </div>
                    <h3 className={`text-xl font-display font-bold text-cream transition-colors ${
                        isPrivate ? "" : "group-hover:text-gold-bright"
                    }`}>
                        {project.name}
                    </h3>
                </div>
                <p className="text-sm text-cream/60 leading-relaxed font-light flex-1">
                    {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.stack.map((s) => (
                        <span
                            key={s}
                            className="text-[10px] uppercase tracking-[0.1em] font-medium px-2.5 py-1 rounded-md bg-cream/[0.04] border border-cream/10 text-cream/55"
                        >
                            {s}
                        </span>
                    ))}
                </div>
                <div className={`flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold pt-1 ${
                    isPrivate
                        ? "text-cream/40"
                        : "text-cream/40 group-hover:text-gold transition-colors"
                }`}>
                    {isPrivate ? (
                        <span className="flex items-center gap-1.5">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                                <rect x="5" y="11" width="14" height="9" rx="2" />
                                <path strokeLinecap="round" d="M8 11V8a4 4 0 1 1 8 0v3" />
                            </svg>
                            Privátny projekt
                        </span>
                    ) : (
                        <span>{project.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
                    )}
                </div>
            </div>
        </>
    );

    const sharedClasses =
        "group relative rounded-2xl overflow-hidden bg-cream/[0.03] border border-cream/10 backdrop-blur-sm transition-all duration-500 flex flex-col";

    if (isPrivate) {
        return (
            <div className={`${sharedClasses} hover:border-cream/20`} aria-label={`${project.name} (privátny projekt — bez odkazu)`}>
                {inner}
            </div>
        );
    }

    return (
        <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${sharedClasses} hover:border-gold/40 hover:bg-cream/[0.05]`}
        >
            {inner}
        </a>
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

export default function RealizaciePage() {
    const totalCount = GROUPS.reduce((sum, g) => sum + g.projects.length, 0);

    return (
        <main className="min-h-screen bg-char relative overflow-hidden">
            {/* Site-wide animated dark background */}
            <div className="absolute inset-0 pointer-events-none">
                <SectionBackground variant="soft" topFade={false} />
            </div>

            {/* Hero */}
            <section className="pt-32 pb-12 md:pt-40 md:pb-16 relative z-10">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl">
                        <span className="text-[10px] uppercase tracking-[0.35em] font-bold text-gold/80">
                            Portfólio · {totalCount} projektov
                        </span>
                        <h1 className="text-5xl md:text-7xl font-display font-bold text-cream mt-3 leading-[0.95]">
                            Naše <span className="text-gold">realizácie</span>
                        </h1>
                        <p className="text-cream/65 mt-6 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
                            Výber projektov, ktoré sme navrhli a postavili. Od firemných webov a e-shopov,
                            cez interné dashboardy, až po AI agentov v produkcii.
                        </p>
                        <div className="flex flex-wrap gap-6 mt-8 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                                <span className="text-cream/70">{totalCount}+ projektov</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                                <span className="text-cream/70">Live v produkcii</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                                <span className="text-cream/70">Vlastný stack</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Groups */}
            {GROUPS.map((group) => (
                <section key={group.index} className="py-12 md:py-16 relative z-10">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
                    <div className="container mx-auto px-6">
                        <SectionHeader
                            index={group.index}
                            title={group.title}
                            description={group.description}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {group.projects.map((p) => (
                                <ProjectCard key={p.slug} project={p} />
                            ))}
                        </div>
                    </div>
                </section>
            ))}

            {/* Note */}
            <section className="py-12 relative z-10">
                <div className="container mx-auto px-6 max-w-3xl">
                    <div className="rounded-2xl border border-cream/10 bg-cream/[0.03] backdrop-blur-sm p-8 text-center">
                        <p className="text-cream/60 text-sm leading-relaxed">
                            Pracujeme aj na ďalších projektoch, ktoré ešte nie sú verejné.<br />
                            <strong className="text-gold">Máte nápad? Spravíme z neho realitu.</strong>
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 md:py-28 relative z-10">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-cream mb-4">
                        Máte projekt na ktorý hľadáte tím?
                    </h2>
                    <p className="text-cream/55 text-lg mb-10 font-light">
                        Zavoláme si — 30 minút a viete, čo a za koľko.
                    </p>
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
