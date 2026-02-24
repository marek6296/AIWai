'use client'

import { formatDistanceToNow } from 'date-fns'
import { sk } from 'date-fns/locale'
import { Mail, MessageCircle, Instagram, Clock, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import BotQuickToggle from './BotQuickToggle'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ClientRow({ client }: { client: any }) {
    const router = useRouter()

    return (
        <tr
            onClick={() => router.push(`/admin/client/${encodeURIComponent(client.email)}`)}
            className="hover:bg-brand-indigo/5 transition-colors group cursor-pointer"
        >
            <td className="p-4 pl-6 text-brand-indigo font-medium">
                <div className="flex items-center gap-3">
                    {client.source === 'gmail' ? (
                        <Mail size={16} className="text-brand-indigo/40" />
                    ) : client.source === 'whatsapp' ? (
                        <MessageCircle size={16} className="text-brand-indigo/40" />
                    ) : client.source === 'instagram' ? (
                        <Instagram size={16} className="text-brand-indigo/40" />
                    ) : (
                        <div className="w-4 h-4 rounded-full bg-brand-indigo/10" />
                    )}
                    {client.email}
                </div>
            </td>
            <td className="p-4 text-brand-indigo/80">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-indigo/10 text-brand-indigo uppercase tracking-wider">
                    {client.status || 'Nový'}
                </span>
            </td>
            <td className="p-4" onClick={(e) => e.stopPropagation()}>
                <BotQuickToggle email={client.email} initialStatus={client.bot_active} />
            </td>
            <td className="p-4 text-brand-indigo/60 text-sm">
                <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {client.last_message_at ? formatDistanceToNow(new Date(client.last_message_at), { addSuffix: true, locale: sk }) : 'Predtým'}
                </div>
            </td>
            <td className="p-4 pr-6 text-right">
                <div className="inline-flex items-center justify-center p-2 rounded-xl text-brand-indigo/40 bg-transparent group-hover:text-brand-indigo group-hover:bg-white transition-all">
                    <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                </div>
            </td>
        </tr>
    )
}
