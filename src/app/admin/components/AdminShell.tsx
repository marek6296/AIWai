"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    LogOut,
    LayoutDashboard,
    Inbox,
    Sparkles,
    MessagesSquare,
    BarChart3,
    DollarSign,
    Settings,
    Radar,
    Database,
    Plus,
    ChevronRight,
    type LucideIcon,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { ScraperStatusWidget } from "./ScraperStatusWidget";

// ── NAV ────────────────────────────────────────────────────────────────────

type NavItem = { href: string; label: string; icon: LucideIcon };
type NavSection = { label: string; items: NavItem[] };

const NAV: NavSection[] = [
    {
        label: "Prehľad",
        items: [
            { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        ],
    },
    {
        label: "Mail",
        items: [
            { href: "/admin/inbox", label: "Inbox",  icon: Inbox },
            { href: "/admin/leads", label: "Leady",  icon: Sparkles },
        ],
    },
    {
        label: "Chatbot",
        items: [
            { href: "/admin/conversations",    label: "Konverzácie", icon: MessagesSquare },
            { href: "/admin/pricing",          label: "Cenník",      icon: DollarSign },
            { href: "/admin/chatbot-settings", label: "Nastavenia",  icon: Settings },
        ],
    },
    {
        label: "Scraper",
        items: [
            { href: "/admin/scraper",          label: "Dashboard",   icon: Radar },
            { href: "/admin/scraper/leads",    label: "Leady",       icon: Database },
            { href: "/admin/scraper/jobs/new", label: "Nový scrape", icon: Plus },
        ],
    },
    {
        label: "Analýza",
        items: [
            { href: "/admin/stats", label: "Štatistiky", icon: BarChart3 },
        ],
    },
];

// ── Shell ──────────────────────────────────────────────────────────────────

export default function AdminShell({
    title,
    subtitle,
    actions,
    children,
}: {
    title?: string;
    subtitle?: string;
    actions?: ReactNode;
    children: ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname() ?? "";

    async function handleLogout() {
        await fetch("/api/auth/simple-logout", { method: "POST" });
        router.refresh();
        router.push("/login");
    }

    const today = new Intl.DateTimeFormat("sk-SK", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date());

    return (
        <div className="relative min-h-screen bg-char text-cream font-sans antialiased">
            {/* Ambient gold glow + subtle grain */}
            <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
                <div
                    className="absolute -top-60 right-[-15%] h-[640px] w-[640px] rounded-full opacity-60"
                    style={{ background: "radial-gradient(circle, rgba(201,168,117,0.07) 0%, transparent 60%)" }}
                />
                <div
                    className="absolute bottom-[-20%] left-[20%] h-[480px] w-[480px] rounded-full opacity-40"
                    style={{ background: "radial-gradient(circle, rgba(140,111,63,0.05) 0%, transparent 60%)" }}
                />
            </div>

            <div className="relative flex min-h-screen">
                <Sidebar pathname={pathname} onLogout={handleLogout} />

                <main className="relative min-w-0 flex-1 px-5 py-6 md:px-10 md:py-9">
                    {(title || actions) && (
                        <header className="mb-8 flex flex-col gap-4 border-b border-cream/[0.07] pb-6 md:flex-row md:items-end md:justify-between">
                            <div>
                                <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold/55">
                                    {today}
                                </div>
                                {title && (
                                    <h1 className="mt-1.5 font-display text-[30px] font-semibold tracking-tight text-cream md:text-[36px]">
                                        {title}
                                    </h1>
                                )}
                                {subtitle && (
                                    <p className="mt-1.5 max-w-xl text-[13px] font-light text-cream/55 md:text-sm">
                                        {subtitle}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <MobileNav pathname={pathname} />
                                {actions}
                            </div>
                        </header>
                    )}

                    {children}
                </main>
            </div>

            {/* Floating scraper status widget — visible across all admin pages */}
            <ScraperStatusWidget />
        </div>
    );
}

// ── Sidebar ────────────────────────────────────────────────────────────────

function Sidebar({ pathname, onLogout }: { pathname: string; onLogout: () => void }) {
    return (
        <aside className="hidden md:flex sticky top-0 h-screen w-[264px] shrink-0 flex-col border-r border-cream/[0.07] bg-char-soft/95 backdrop-blur-xl">
            {/* Brand */}
            <Link href="/admin" className="flex items-center gap-3 border-b border-cream/[0.06] px-6 py-6">
                <span className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gold/30 bg-gradient-to-br from-gold/30 via-gold/10 to-transparent shadow-[0_4px_14px_-4px_rgba(201,168,117,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]">
                    <Image src="/logo-v2.png" alt="AIWai" width={32} height={32} className="h-6 w-6 object-contain" priority />
                </span>
                <div className="flex flex-col leading-none">
                    <span className="font-display text-base font-semibold tracking-tight text-cream">AIWai</span>
                    <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.3em] text-gold/50">Admin Console</span>
                </div>
            </Link>

            {/* Nav sections */}
            <div className="flex-1 overflow-y-auto py-5">
                {NAV.map((section, i) => (
                    <div key={section.label} className={i === 0 ? "" : "mt-5"}>
                        <div className="px-6 mb-1.5 font-mono text-[9px] uppercase tracking-[0.3em] text-cream/30">
                            {section.label}
                        </div>
                        <nav className="px-3 flex flex-col gap-0.5">
                            {section.items.map((item) => (
                                <NavLink key={item.href} {...item} active={isActive(pathname, item.href)} />
                            ))}
                        </nav>
                    </div>
                ))}
            </div>

            {/* User pill */}
            <div className="border-t border-cream/[0.06] p-4">
                <div className="flex items-center gap-3 rounded-xl border border-cream/[0.07] bg-cream/[0.025] p-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gradient-to-br from-gold/25 via-gold/10 to-transparent text-[11px] font-bold text-gold">
                        D
                    </span>
                    <div className="min-w-0 flex-1">
                        <div className="text-[13px] font-semibold text-cream">dony</div>
                        <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-cream/40">Admin</div>
                    </div>
                    <button
                        onClick={onLogout}
                        aria-label="Odhlásiť sa"
                        title="Odhlásiť sa"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-cream/45 transition-colors hover:bg-cream/[0.06] hover:text-cream"
                    >
                        <LogOut size={15} />
                    </button>
                </div>
            </div>
        </aside>
    );
}

function isActive(pathname: string, href: string): boolean {
    if (href === "/admin") return pathname === "/admin";
    if (href === "/admin/scraper") return pathname === "/admin/scraper";
    if (href === "/admin/scraper/leads") return pathname.startsWith("/admin/scraper/leads");
    if (href === "/admin/scraper/jobs/new") return pathname.startsWith("/admin/scraper/jobs");
    return pathname === href || pathname.startsWith(href + "/");
}

function NavLink({ href, label, icon: Icon, active }: NavItem & { active: boolean }) {
    return (
        <Link
            href={href}
            className={`group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-all ${
                active
                    ? "bg-gold/10 text-gold"
                    : "text-cream/65 hover:bg-cream/[0.04] hover:text-cream"
            }`}
        >
            {/* Active left bar */}
            {active && (
                <span aria-hidden className="absolute -left-3 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-gold shadow-[0_0_8px_rgba(201,168,117,0.6)]" />
            )}
            <Icon size={15} className={active ? "text-gold" : "text-cream/40 group-hover:text-cream/70"} />
            <span className={active ? "font-medium" : ""}>{label}</span>
        </Link>
    );
}

// ── MobileNav (dropdown trigger; visible only on small) ────────────────────

function MobileNav({ pathname }: { pathname: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="md:hidden relative">
            <button
                onClick={() => setOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-lg border border-cream/15 bg-cream/[0.04] px-3 py-2 text-sm text-cream"
            >
                Menu <ChevronRight size={14} className={`transition-transform ${open ? "rotate-90" : ""}`} />
            </button>
            {open && (
                <div className="absolute right-0 top-full mt-2 z-50 w-64 rounded-xl border border-cream/10 bg-char-soft shadow-2xl">
                    <div className="max-h-[70vh] overflow-y-auto py-2">
                        {NAV.map((section) => (
                            <div key={section.label} className="px-2 py-1">
                                <div className="px-3 py-1 font-mono text-[9px] uppercase tracking-[0.3em] text-cream/30">
                                    {section.label}
                                </div>
                                {section.items.map((item) => {
                                    const active = isActive(pathname, item.href);
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setOpen(false)}
                                            className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm ${
                                                active
                                                    ? "bg-gold/10 text-gold"
                                                    : "text-cream/65 hover:bg-cream/[0.04] hover:text-cream"
                                            }`}
                                        >
                                            <Icon size={14} className={active ? "text-gold" : "text-cream/45"} />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
