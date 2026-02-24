'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, LayoutDashboard, Users, Bot } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminNav() {
    const router = useRouter()
    const pathname = usePathname()
    const supabase = createClient()

    async function handleLogout() {
        await supabase.auth.signOut()
        router.refresh()
        router.push('/login')
    }

    return (
        <nav className="w-64 bg-white/50 backdrop-blur-xl border-r border-brand-indigo/10 h-screen sticky top-0 flex flex-col p-6">
            <div className="flex items-center gap-3 mb-12">
                <div className="w-10 h-10 rounded-xl bg-brand-indigo flex items-center justify-center">
                    <Bot size={24} className="text-white" />
                </div>
                <span className="font-bold text-xl text-brand-indigo">AIWai Admin</span>
            </div>

            <div className="flex flex-col gap-2 flex-1">
                <Link
                    href="/admin"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${pathname === '/admin'
                            ? 'bg-brand-indigo text-white'
                            : 'text-brand-indigo/60 hover:bg-brand-indigo/5 hover:text-brand-indigo'
                        }`}
                >
                    <LayoutDashboard size={18} />
                    Dashboard
                </Link>
            </div>

            <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-brand-indigo/60 hover:bg-red-50 hover:text-red-600 transition-colors font-medium text-sm mt-auto"
            >
                <LogOut size={18} />
                Log Out
            </button>
        </nav>
    )
}
