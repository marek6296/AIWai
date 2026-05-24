'use client'

// Dark+gold sidebar — zladený s AdminShell. Používaný starými stránkami
// (/admin/conversations, /admin/leads, /admin/stats, /admin/pricing, /admin/inbox)
// kým ich postupne neprepíšeme na plný AdminShell wrapper.

import { useRouter, usePathname } from 'next/navigation'
import { LogOut, Inbox, Settings, MessagesSquare, Sparkles, BarChart3, DollarSign, Radar, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

type NavItem = { href: string; label: string; icon: typeof Inbox; group: 'primary' | 'secondary' }

const NAV: NavItem[] = [
    { href: '/admin',          label: 'Prehľad',     icon: LayoutDashboard, group: 'primary' },
    { href: '/admin/inbox',    label: 'Inbox',       icon: Inbox,           group: 'primary' },
    { href: '/admin/leads',    label: 'Leady',       icon: Sparkles,        group: 'primary' },
    { href: '/admin/conversations', label: 'Konverzácie', icon: MessagesSquare, group: 'primary' },
    { href: '/admin/stats',    label: 'Štatistiky',  icon: BarChart3,       group: 'primary' },
    { href: '/admin/scraper',  label: 'Scraper',     icon: Radar,           group: 'primary' },
    { href: '/admin/pricing',  label: 'Cenník bota', icon: DollarSign,      group: 'secondary' },
    { href: '/admin/chatbot-settings', label: 'Nastavenia', icon: Settings, group: 'secondary' },
]

export default function AdminNav() {
    const router = useRouter()
    const pathname = usePathname()

    async function handleLogout() {
        await fetch('/api/auth/simple-logout', { method: 'POST' })
        router.refresh()
        router.push('/login')
    }

    const isActive = (href: string) =>
        href === '/admin' ? pathname === '/admin' : pathname?.startsWith(href)

    return (
        <aside className="hidden md:flex sticky top-0 h-screen w-[260px] shrink-0 flex-col border-r border-cream/[0.07] bg-char/95 backdrop-blur-xl px-5 py-7 text-cream">
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
                    <span className="font-display text-[15px] font-semibold tracking-tight text-cream">AIWai</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream/40">Admin</span>
                </div>
            </Link>

            <nav className="flex flex-col gap-0.5">
                {NAV.filter(n => n.group === 'primary').map(item => (
                    <NavLink key={item.href} {...item} active={isActive(item.href)} />
                ))}
            </nav>

            <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-cream/[0.07]" />
                <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-cream/30">Konfigurácia</span>
                <span className="h-px flex-1 bg-cream/[0.07]" />
            </div>

            <nav className="flex flex-col gap-0.5">
                {NAV.filter(n => n.group === 'secondary').map(item => (
                    <NavLink key={item.href} {...item} active={isActive(item.href)} />
                ))}
            </nav>

            <div className="mt-auto pt-6">
                <div className="flex items-center gap-3 rounded-xl border border-cream/[0.07] bg-cream/[0.025] p-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gradient-to-br from-gold/25 via-gold/10 to-transparent text-[11px] font-bold text-gold">D</span>
                    <div className="min-w-0 flex-1">
                        <div className="text-[13px] font-semibold text-cream">dony</div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/40">Admin</div>
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
    )
}

function NavLink({ href, label, icon: Icon, active }: NavItem & { active: boolean }) {
    return (
        <Link
            href={href}
            className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                    ? 'bg-gold/10 text-gold border border-gold/30'
                    : 'text-cream/65 hover:bg-cream/[0.04] hover:text-cream border border-transparent'
            }`}
        >
            <Icon size={16} className={active ? 'text-gold' : 'text-cream/45 group-hover:text-cream/75'} />
            {label}
        </Link>
    )
}
