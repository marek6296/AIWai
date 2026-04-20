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
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors disabled:opacity-60 ${
                            active
                                ? 'bg-brand-indigo text-white'
                                : 'bg-white border border-brand-indigo/15 text-brand-indigo/70 hover:bg-brand-indigo/5'
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
                className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-60"
            >
                <Trash2 size={13} />
                Zmazať
            </button>
        </div>
    )
}
