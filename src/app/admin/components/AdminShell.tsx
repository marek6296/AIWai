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
    Bot,
    Radar,
} from "lucide-react";
import type { ReactNode } from "react";

const NAV: { href: string; label: string; icon: typeof Inbox; group: "primary" | "secondary" }[] = [
    { href: "/admin", label: "Prehľad", icon: LayoutDashboard, group: "primary" },
    { href: "/admin/inbox", label: "Inbox", icon: Inbox, group: "primary" },
    { href: "/admin/leads", label: "Leady", icon: Sparkles, group: "primary" },
    { href: "/admin/conversations", label: "Konverzácie", icon: MessagesSquare, group: "primary" },
    { href: "/admin/stats", label: "Štatistiky", icon: BarChart3, group: "primary" },
    { href: "/admin/scraper", label: "Scraper", icon: Radar, group: "primary" },
    { href: "/admin/pricing", label: "Cenník bota", icon: DollarSign, group: "secondary" },
    { href: "/admin/chatbot-settings", label: "Nastavenia chatbota", icon: Settings, group: "secondary" },
];

export default function AdminShell({
    title,
    subtitle,
    actions,
    children,
}: {
    title: string;
    subtitle?: string;
    actions?: ReactNode;
    children: ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();

    async function handleLogout() {
        await fetch("/api/auth/simple-logout", { method: "POST" });
        router.refresh();
        router.push("/login");
    }

    const isActive = (href: string) =>
        href === "/admin" ? pathname === "/admin" : pathname?.startsWith(href);

    const today = new Intl.DateTimeFormat("sk-SK", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date());

    return (
        <div className="relative min-h-screen bg-char text-cream">
            {/* Ambient backdrop — single soft gold glow, very subtle */}
            <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
                <div
                    className="absolute -top-40 -right-32 h-[520px] w-[520px] rounded-full"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(201,168,117,0.04) 0%, transparent 65%)",
                    }}
                />
            </div>

            <div className="relative flex min-h-screen">
                {/* ─── Sidebar ─────────────────────────────────────── */}
                <aside className="hidden md:flex sticky top-0 h-screen w-[260px] shrink-0 flex-col border-r border-cream/[0.07] bg-char/95 backdrop-blur-xl px-5 py-7">
                    {/* Brand */}
                    <Link href="/admin" className="mb-10 flex items-center gap-3">
                        <span className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-gold/30 bg-gradient-to-br from-gold/25 via-gold/10 to-transparent shadow-[0_4px_14px_-4px_rgba(201,168,117,0.45),inset_0_1px_0_rgba(255,255,255,0.08)]">
                            <Image
                                src="/logo-v2.png"
                                alt="AIWai"
                                width={32}
                                height={32}
                                className="h-6 w-6 object-contain"
                                priority
                            />
                        </span>
                        <div className="flex flex-col">
                            <span className="font-display text-[15px] font-semibold tracking-tight text-cream">
                                AIWai
                            </span>
                            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream/40">
                                Admin
                            </span>
                        </div>
                    </Link>

                    {/* Nav primary */}
                    <nav className="flex flex-col gap-0.5">
                        {NAV.filter((n) => n.group === "primary").map((item) => (
                            <NavLink key={item.href} {...item} active={isActive(item.href)} />
                        ))}
                    </nav>

                    {/* Section divider */}
                    <div className="my-5 flex items-center gap-3">
                        <span className="h-px flex-1 bg-cream/[0.07]" />
                        <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-cream/30">
                            Konfigurácia
                        </span>
                        <span className="h-px flex-1 bg-cream/[0.07]" />
                    </div>

                    {/* Nav secondary */}
                    <nav className="flex flex-col gap-0.5">
                        {NAV.filter((n) => n.group === "secondary").map((item) => (
                            <NavLink key={item.href} {...item} active={isActive(item.href)} />
                        ))}
                    </nav>

                    {/* User card */}
                    <div className="mt-auto pt-6">
                        <div className="flex items-center gap-3 rounded-xl border border-cream/[0.07] bg-cream/[0.025] p-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gradient-to-br from-gold/25 via-gold/10 to-transparent text-[11px] font-bold text-gold">
                                D
                            </span>
                            <div className="min-w-0 flex-1">
                                <div className="text-[13px] font-semibold text-cream">dony</div>
                                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/40">
                                    Admin
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                aria-label="Odhlásiť sa"
                                title="Odhlásiť sa"
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-cream/45 transition-colors hover:bg-cream/[0.05] hover:text-cream"
                            >
                                <LogOut size={15} />
                            </button>
                        </div>
                    </div>
                </aside>

                {/* ─── Main ────────────────────────────────────────── */}
                <main className="relative min-w-0 flex-1 px-5 py-6 md:px-10 md:py-9">
                    {/* Top bar — title + date + actions */}
                    <header className="mb-8 flex flex-col gap-4 border-b border-cream/[0.07] pb-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream/40">
                                {today}
                            </div>
                            <h1 className="mt-1 font-display text-[28px] font-semibold tracking-tight text-cream md:text-[34px]">
                                {title}
                            </h1>
                            {subtitle && (
                                <p className="mt-1.5 max-w-xl text-[13px] font-light text-cream/55 md:text-sm">
                                    {subtitle}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Mobile nav menu — render simple dropdown */}
                            <div className="md:hidden">
                                <MobileNav active={pathname} />
                            </div>
                            {actions}
                        </div>
                    </header>

                    {children}
                </main>
            </div>
        </div>
    );
}

function NavLink({
    href,
    label,
    icon: Icon,
    active,
}: {
    href: string;
    label: string;
    icon: typeof Inbox;
    active: boolean;
}) {
    return (
        <Link
            href={href}
            className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
                active
                    ? "bg-gold/10 text-gold"
                    : "text-cream/55 hover:bg-cream/[0.04] hover:text-cream"
            }`}
        >
            {/* Active accent bar */}
            {active && (
                <span
                    aria-hidden
                    className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-gold"
                />
            )}
            <Icon size={16} strokeWidth={1.75} className={active ? "text-gold" : ""} />
            <span>{label}</span>
        </Link>
    );
}

function MobileNav({ active }: { active: string | null }) {
    return (
        <details className="relative">
            <summary className="flex cursor-pointer items-center gap-2 rounded-lg border border-cream/[0.08] bg-cream/[0.03] px-3 py-2 text-[12px] font-medium text-cream/80 hover:border-cream/15">
                <Bot size={14} />
                Menu
            </summary>
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-cream/[0.08] bg-char/95 p-2 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl z-50">
                {NAV.map((item) => {
                    const isAct =
                        item.href === "/admin"
                            ? active === "/admin"
                            : active?.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] ${
                                isAct
                                    ? "bg-gold/10 text-gold"
                                    : "text-cream/65 hover:bg-cream/[0.04] hover:text-cream"
                            }`}
                        >
                            <item.icon size={15} />
                            {item.label}
                        </Link>
                    );
                })}
            </div>
        </details>
    );
}

/* StatCard and Panel are server-safe presentation primitives exported
   separately from ./AdminPanels — they cannot live in this file because
   AdminShell is a "use client" boundary and Lucide icon components
   cannot be passed across the server→client boundary as props. */
