"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ListTodo, Database } from "lucide-react";

const TABS = [
    { href: "/admin/scraper",       label: "Dashboard", icon: LayoutDashboard, match: (p: string) => p === "/admin/scraper" },
    { href: "/admin/scraper/leads", label: "Leady",     icon: Database,        match: (p: string) => p.startsWith("/admin/scraper/leads") },
    { href: "/admin/scraper/jobs/new", label: "Nový scrape", icon: ListTodo,    match: (p: string) => p.startsWith("/admin/scraper/jobs") },
];

export function ScraperTabs() {
    const pathname = usePathname() ?? "";
    return (
        <div className="mb-6 flex flex-wrap items-center gap-1.5 rounded-xl border border-cream/[0.06] bg-cream/[0.02] p-1.5">
            {TABS.map((t) => {
                const active = t.match(pathname);
                const Icon = t.icon;
                return (
                    <Link
                        key={t.href}
                        href={t.href}
                        className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm transition ${
                            active
                                ? "bg-gold/15 text-gold border border-gold/40"
                                : "text-cream/60 hover:text-cream hover:bg-cream/[0.04] border border-transparent"
                        }`}
                    >
                        <Icon size={14} />
                        {t.label}
                    </Link>
                );
            })}
        </div>
    );
}
