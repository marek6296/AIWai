'use client'

import { useRouter, usePathname } from 'next/navigation'
import { LogOut, Bot, Inbox, Settings, MessagesSquare, Sparkles, BarChart3, DollarSign } from 'lucide-react'
import Link from 'next/link'

export default function AdminNav() {
    const router = useRouter()
    const pathname = usePathname()

    async function handleLogout() {
        await fetch('/api/auth/simple-logout', { method: 'POST' })
        router.refresh()
        router.push('/login')
    }

    const linkCls = (active: boolean) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
            active
                ? 'bg-brand-indigo text-white'
                : 'text-brand-indigo/60 hover:bg-brand-indigo/5 hover:text-brand-indigo'
        }`

    const isActive = (prefix: string) => pathname === prefix || pathname?.startsWith(prefix + '/')

    return (
        <nav className="w-64 bg-white/50 backdrop-blur-xl border-r border-brand-indigo/10 h-screen sticky top-0 flex flex-col p-6">
            <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-xl bg-brand-indigo flex items-center justify-center">
                    <Bot size={24} className="text-white" />
                </div>
                <span className="font-bold text-xl text-brand-indigo">AIWai Admin</span>
            </div>

            <div className="flex flex-col gap-1.5 flex-1">
                <Link href="/admin/inbox" className={linkCls(isActive('/admin/inbox') || isActive('/admin/client'))}>
                    <Inbox size={18} />
                    Inbox
                </Link>
                <Link href="/admin/leads" className={linkCls(isActive('/admin/leads'))}>
                    <Sparkles size={18} />
                    Leady
                </Link>
                <Link href="/admin/conversations" className={linkCls(isActive('/admin/conversations'))}>
                    <MessagesSquare size={18} />
                    Konverzácie
                </Link>
                <Link href="/admin/stats" className={linkCls(isActive('/admin/stats'))}>
                    <BarChart3 size={18} />
                    Štatistiky
                </Link>

                <div className="h-px bg-brand-indigo/10 my-3" />

                <Link href="/admin/pricing" className={linkCls(isActive('/admin/pricing'))}>
                    <DollarSign size={18} />
                    Cenník bota
                </Link>
                <Link href="/admin/chatbot-settings" className={linkCls(isActive('/admin/chatbot-settings'))}>
                    <Settings size={18} />
                    Nastavenia
                </Link>
            </div>

            <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-brand-indigo/60 hover:bg-red-50 hover:text-red-600 transition-colors font-medium text-sm mt-auto"
            >
                <LogOut size={18} />
                Odhlásiť sa
            </button>
        </nav>
    )
}
