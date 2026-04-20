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
        <div className="bg-white rounded-2xl border border-brand-indigo/10 p-5">
            <div className="flex items-center gap-2 mb-3">
                <StickyNote size={16} className="text-amber-500" />
                <h3 className="font-semibold text-brand-indigo text-sm">Interné poznámky</h3>
                {saved && (
                    <span className="ml-auto inline-flex items-center gap-1 text-xs text-emerald-600">
                        <Check size={12} /> Uložené
                    </span>
                )}
            </div>
            <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Tvoje poznámky o tomto klientovi (neviditeľné pre klienta)…"
                rows={4}
                className="w-full bg-brand-offwhite border border-brand-indigo/10 rounded-xl p-3 text-sm text-brand-indigo placeholder:text-brand-indigo/40 focus:outline-none focus:border-brand-indigo/30 resize-y"
            />
            <button
                onClick={save}
                disabled={isPending || value === initial}
                className="mt-3 px-4 py-2 bg-brand-indigo text-white rounded-full text-xs font-semibold hover:bg-brand-indigo/90 disabled:opacity-50 transition-colors"
            >
                {isPending ? 'Ukladám…' : 'Uložiť poznámky'}
            </button>
        </div>
    )
}
