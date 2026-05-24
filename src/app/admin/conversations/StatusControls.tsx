'use client'

import { useTransition } from 'react'
import { updateConversationStatus, deleteConversation } from './actions'
import { useRouter } from 'next/navigation'
import { Check, Eye, Phone, Archive, Trash2 } from 'lucide-react'

type Status = 'new' | 'seen' | 'contacted' | 'closed'

const STATUS_LABELS: Record<Status, string> = {
    new: 'Nové',
    seen: 'Videné',
    contacted: 'Kontaktované',
    closed: 'Uzavreté',
}

const STATUS_ICONS: Record<Status, React.ReactNode> = {
    new: <Eye size={13} />,
    seen: <Check size={13} />,
    contacted: <Phone size={13} />,
    closed: <Archive size={13} />,
}

export default function StatusControls({ id, current }: { id: string; current: Status }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const setStatus = (s: Status) => {
        startTransition(async () => {
            await updateConversationStatus(id, s)
        })
    }

    const onDelete = () => {
        if (!confirm('Naozaj zmazať celú konverzáciu? Akcia je nezvratná.')) return
        startTransition(async () => {
            await deleteConversation(id)
            router.push('/admin/conversations')
        })
    }

    const statuses: Status[] = ['new', 'seen', 'contacted', 'closed']

    return (
        <div className="flex flex-wrap items-center gap-2">
            {statuses.map((s) => {
                const active = current === s
                return (
                    <button
                        key={s}
                        onClick={() => setStatus(s)}
                        disabled={isPending || active}
                        className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-60 ${
                            active
                                ? 'border border-gold/40 bg-gold/15 text-gold'
                                : 'border border-cream/15 bg-cream/[0.04] text-cream/65 hover:text-cream hover:bg-cream/[0.07]'
                        }`}
                    >
                        {STATUS_ICONS[s]}
                        {STATUS_LABELS[s]}
                    </button>
                )
            })}
            <button
                onClick={onDelete}
                disabled={isPending}
                className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-red-400/30 bg-red-400/10 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-400/15 transition-colors disabled:opacity-60"
            >
                <Trash2 size={13} />
                Zmazať
            </button>
        </div>
    )
}
