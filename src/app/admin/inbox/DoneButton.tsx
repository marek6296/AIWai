'use client'

import { useState } from 'react'
import { CheckCircle, RotateCcw } from 'lucide-react'
import { markDone, markNew } from './actions'

export default function DoneButton({
    id,
    isDone,
    table = 'form_submissions'
}: {
    id: string
    isDone: boolean
    table?: 'form_submissions' | 'email_submissions'
}) {
    const [loading, setLoading] = useState(false)

    async function handleClick() {
        setLoading(true)
        if (isDone) {
            await markNew(id, table)
        } else {
            await markDone(id, table)
        }
        setLoading(false)
    }

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 ${
                isDone
                    ? 'bg-emerald-400/10 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-400/15'
                    : 'bg-cream/[0.04] text-cream/65 border border-cream/15 hover:bg-gold/10 hover:text-gold hover:border-gold/30'
            }`}
        >
            {isDone ? (
                <>
                    <CheckCircle size={13} />
                    Vybavené
                    <RotateCcw size={11} className="ml-0.5 opacity-50" />
                </>
            ) : (
                <>
                    <CheckCircle size={13} />
                    Mark as done
                </>
            )}
        </button>
    )
}
