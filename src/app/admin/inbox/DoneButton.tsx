'use client'

import { useState } from 'react'
import { CheckCircle, RotateCcw } from 'lucide-react'
import { markFormDone, markFormNew } from './actions'

export default function DoneButton({ id, isDone }: { id: string; isDone: boolean }) {
    const [loading, setLoading] = useState(false)

    async function handleClick() {
        setLoading(true)
        if (isDone) {
            await markFormNew(id)
        } else {
            await markFormDone(id)
        }
        setLoading(false)
    }

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all disabled:opacity-50 ${
                isDone
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
                    : 'bg-white text-brand-indigo/50 border border-brand-indigo/15 hover:bg-brand-indigo/5 hover:text-brand-indigo'
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
