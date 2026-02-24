'use client'

import { useState } from 'react'
import { toggleBotActive } from './actions'
import { Bot, PowerOff, Loader2 } from 'lucide-react'

export default function BotToggle({ email, initialStatus }: { email: string, initialStatus: boolean }) {
    const [isActive, setIsActive] = useState(initialStatus)
    const [loading, setLoading] = useState(false)

    async function handleToggle() {
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
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-colors ${isActive
                    ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                    : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                }`}
        >
            {loading ? (
                <Loader2 size={18} className="animate-spin" />
            ) : isActive ? (
                <Bot size={18} />
            ) : (
                <PowerOff size={18} />
            )}
            {isActive ? 'Bot is Active - Pause' : 'Bot is Paused - Resume'}
        </button>
    )
}
