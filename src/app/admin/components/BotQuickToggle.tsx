'use client'

import { useState } from 'react'
import { toggleBotActive } from '../client/[email]/actions'
import { Bot, Loader2 } from 'lucide-react'

export default function BotQuickToggle({ email, initialStatus }: { email: string, initialStatus: boolean }) {
    const [isActive, setIsActive] = useState(initialStatus)
    const [loading, setLoading] = useState(false)

    async function handleToggle(e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation() // Prevent row click
        setLoading(true)
        const result = await toggleBotActive(email, isActive)
        if (!result?.error) {
            setIsActive(!isActive)
        }
        setLoading(false)
    }

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full w-[85px] transition-colors shadow-sm cursor-pointer ${isActive
                ? 'text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300'
                : 'text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 hover:border-amber-300'
                }`}
        >
            {loading ? (
                <Loader2 size={14} className="animate-spin" />
            ) : isActive ? (
                <>
                    <Bot size={14} className="opacity-80" />
                    <span>ON</span>
                </>
            ) : (
                <>
                    <Bot size={14} className="opacity-50" />
                    <span className="opacity-80">OFF</span>
                </>
            )}
        </button>
    )
}
