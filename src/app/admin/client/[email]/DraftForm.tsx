'use client'

import { useState } from 'react'
import { reviewDraftMessage } from './actions'
import { Send, Trash } from 'lucide-react'

export default function DraftForm({
    messageId,
    initialContent,
    clientEmail
}: {
    messageId: string,
    initialContent: string,
    clientEmail: string
}) {
    const [content, setContent] = useState(initialContent)
    const [loading, setLoading] = useState(false)

    async function handleAction(actionType: 'approve' | 'reject') {
        setLoading(true)
        const formData = new FormData()
        formData.append('messageId', messageId)
        formData.append('clientEmail', clientEmail)
        formData.append('content', content)
        formData.append('action', actionType)

        await reviewDraftMessage(formData)
        setLoading(false)
    }

    return (
        <div className="flex flex-col gap-4 mt-2">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-xl p-3 text-sm focus:outline-none focus:border-white/40 transition-colors"
                rows={6}
            />
            <div className="flex items-center gap-3 justify-end mt-1">
                <button
                    onClick={() => handleAction('reject')}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                    <Trash size={16} />
                    Zmazať návrh
                </button>
                <button
                    onClick={() => handleAction('approve')}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-brand-indigo hover:bg-brand-offwhite text-sm font-medium transition-colors disabled:opacity-50"
                >
                    Schváliť a Odoslať
                    <Send size={16} />
                </button>
            </div>
        </div>
    )
}
