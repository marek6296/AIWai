'use client'

import { useState, useTransition } from 'react'
import { updateConversationNotes } from './actions'
import { StickyNote, Check } from 'lucide-react'

export default function NotesEditor({ id, initial }: { id: string; initial: string }) {
    const [value, setValue] = useState(initial)
    const [saved, setSaved] = useState(false)
    const [isPending, startTransition] = useTransition()

    const save = () => {
        startTransition(async () => {
            await updateConversationNotes(id, value)
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
        })
    }

    return (
        <div className="rounded-2xl border border-cream/[0.08] bg-char-soft/60 p-5">
            <div className="mb-3 flex items-center gap-2">
                <StickyNote size={14} className="text-gold/70" />
                <h3 className="font-display text-sm font-semibold text-cream">Interné poznámky</h3>
                {saved && (
                    <span className="ml-auto inline-flex items-center gap-1 text-xs text-emerald-300">
                        <Check size={12} /> Uložené
                    </span>
                )}
            </div>
            <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Tvoje poznámky o tomto klientovi (neviditeľné pre klienta)…"
                rows={4}
                className="w-full resize-y rounded-xl border border-cream/15 bg-cream/[0.03] p-3 text-sm text-cream placeholder:text-cream/35 focus:border-gold/40 focus:outline-none"
            />
            <button
                onClick={save}
                disabled={isPending || value === initial}
                className="mt-3 rounded-lg border border-gold/40 bg-gold/15 px-4 py-2 text-xs font-medium text-gold transition-colors hover:bg-gold/25 disabled:opacity-50"
            >
                {isPending ? 'Ukladám…' : 'Uložiť poznámky'}
            </button>
        </div>
    )
}
