import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, User, Mail, Calendar, Phone, Tag } from 'lucide-react'
import DraftForm from './DraftForm'
import { format } from 'date-fns'
import { sk } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

export default async function ClientDetailPage({ params }: { params: { email: string } }) {
    const email = decodeURIComponent(params.email)
    const supabase = createClient()

    const { data: lead, error } = await supabase
        .from('leads')
        .select('*')
        .eq('email', email)
        .single()

    if (error || !lead) {
        notFound()
    }

    const { data: messages } = await supabase
        .from('lead_messages')
        .select('*')
        .eq('lead_email', email)
        .order('created_at', { ascending: true })

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <Link
                    href="/admin/inbox"
                    className="inline-flex items-center gap-2 text-brand-indigo/60 hover:text-brand-indigo mb-6 transition-colors text-sm font-medium"
                >
                    <ArrowLeft size={16} />
                    Späť do Inboxu
                </Link>

                <div className="bg-white rounded-3xl shadow-xl shadow-brand-indigo/5 border border-brand-indigo/10 p-8">
                    <div className="flex gap-4 items-start">
                        <div className="w-16 h-16 rounded-2xl bg-brand-indigo/5 flex items-center justify-center text-brand-indigo shrink-0">
                            <User size={32} />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-brand-indigo mb-2">
                                {lead.name || lead.email}
                            </h1>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-brand-indigo/60">
                                <span className="flex items-center gap-1.5">
                                    <Mail size={14} /> {lead.email}
                                </span>
                                {lead.phone && (
                                    <span className="flex items-center gap-1.5">
                                        <Phone size={14} /> {lead.phone}
                                    </span>
                                )}
                                {lead.project_type && (
                                    <span className="flex items-center gap-1.5">
                                        <Tag size={14} /> {lead.project_type}
                                    </span>
                                )}
                                <span className="flex items-center gap-1.5">
                                    <Calendar size={14} />
                                    {lead.created_at
                                        ? format(new Date(lead.created_at), 'd. MMMM yyyy', { locale: sk })
                                        : '—'}
                                </span>
                            </div>
                            {lead.source && (
                                <span className="inline-block mt-3 text-xs bg-brand-indigo/5 text-brand-indigo/50 px-2.5 py-1 rounded-full capitalize">
                                    zdroj: {lead.source}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-bold text-brand-indigo px-2">História konverzácie</h2>

                <div className="bg-white rounded-3xl shadow-xl shadow-brand-indigo/5 border border-brand-indigo/10 p-6 flex flex-col gap-6">
                    {!messages?.length && (
                        <div className="text-center p-8 text-brand-indigo/50">Žiadne správy.</div>
                    )}

                    {messages?.map((msg) => {
                        if (msg.message_status === 'rejected') return null
                        const isDraft = msg.message_status === 'draft'

                        return (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[80%] rounded-2xl p-5 ${isDraft
                                    ? 'bg-brand-indigo text-white border-2 border-brand-orange ring-4 ring-brand-orange/10'
                                    : msg.role === 'user'
                                        ? 'bg-brand-offwhite border border-brand-indigo/10 text-brand-indigo rounded-tl-sm'
                                        : 'bg-brand-indigo text-white rounded-tr-sm'
                                    }`}>
                                    <div className="flex items-center justify-between mb-2 gap-8">
                                        <span className={`text-xs font-bold uppercase tracking-wider ${msg.role === 'user' ? 'text-brand-indigo/60' : 'text-white/80'}`}>
                                            {msg.role === 'user' ? 'Klient' : isDraft ? '🤖 AI Návrh odpovede' : 'AIWai Tim'}
                                        </span>
                                        <span className={`text-xs ${msg.role === 'user' ? 'text-brand-indigo/40' : 'text-white/60'}`}>
                                            {msg.created_at
                                                ? format(new Date(msg.created_at), 'HH:mm • d. MMMM yyyy', { locale: sk })
                                                : ''}
                                        </span>
                                    </div>

                                    {isDraft ? (
                                        <DraftForm
                                            messageId={msg.id}
                                            initialContent={msg.content || ''}
                                            clientEmail={lead.email}
                                        />
                                    ) : (
                                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                            {msg.content}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
