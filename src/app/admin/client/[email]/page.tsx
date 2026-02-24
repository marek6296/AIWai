import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, User, Mail, Calendar, Info } from 'lucide-react'
import BotToggle from './BotToggle'
import DraftForm from './DraftForm'
import { format } from 'date-fns'
import { sk } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

export default async function ClientDetailPage({ params }: { params: { email: string } }) {
    const email = decodeURIComponent(params.email)
    const supabase = createClient()

    // Fetch client details
    const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('email', email)
        .single()

    if (clientError || !client) {
        notFound()
    }

    // Fetch email history
    const { data: history } = await supabase
        .from('email_history')
        .select('*')
        .eq('sender_email', email)
        .order('created_at', { ascending: true })

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 text-brand-indigo/60 hover:text-brand-indigo mb-6 transition-colors text-sm font-medium"
                >
                    <ArrowLeft size={16} />
                    Back to Dashboard
                </Link>

                <div className="bg-white rounded-3xl shadow-xl shadow-brand-indigo/5 border border-brand-indigo/10 p-8 flex items-start justify-between">
                    <div className="flex gap-4 items-center">
                        <div className="w-16 h-16 rounded-2xl bg-brand-indigo/5 flex items-center justify-center text-brand-indigo">
                            <User size={32} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-brand-indigo mb-1">{client.email}</h1>
                            <div className="flex items-center gap-4 text-sm text-brand-indigo/60">
                                <span className="flex items-center gap-1.5"><Mail size={14} /> Contact Lead</span>
                                <span className="flex items-center gap-1.5"><Calendar size={14} /> Active since {client.created_at ? format(new Date(client.created_at), 'd. MMMM yyyy', { locale: sk }) : 'Unknown'}</span>
                            </div>
                        </div>
                    </div>

                    <BotToggle email={client.email} initialStatus={client.bot_active} />
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-bold text-brand-indigo px-2">Conversation History</h2>

                <div className="bg-white rounded-3xl shadow-xl shadow-brand-indigo/5 border border-brand-indigo/10 p-6 flex flex-col gap-6">
                    {history?.length === 0 && (
                        <div className="text-center p-8 text-brand-indigo/50">No messages found.</div>
                    )}

                    {history?.map((msg) => {
                        // Skip rejected drafts from showing in the UI, unless you want them visible.
                        if (msg.message_status === 'rejected') return null;

                        const isDraft = msg.message_status === 'draft';

                        return (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[80%] rounded-2xl p-5 ${isDraft
                                    ? 'bg-brand-indigo text-white border-2 border-brand-orange ring-4 ring-brand-orange/10'
                                    : msg.role === 'user'
                                        ? 'bg-brand-offwhite border border-brand-indigo/10 text-brand-indigo rounded-tl-sm'
                                        : 'bg-brand-indigo text-white rounded-tr-sm'
                                    }`}>
                                    <div className="flex items-center justify-between mb-2 gap-8">
                                        <span className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${msg.role === 'user' ? 'text-brand-indigo/60' : 'text-brand-indigo-light/80'}`}>
                                            {msg.role === 'user' ? 'Client' : 'AI Assistant'}
                                            {isDraft && <span className="bg-brand-orange px-2 py-0.5 rounded-full text-white flex items-center gap-1"><Info size={12} /> Návrh odpovede</span>}
                                        </span>
                                        <span className={`text-xs ${msg.role === 'user' ? 'text-brand-indigo/40' : 'text-white/60'}`}>
                                            {msg.created_at ? format(new Date(msg.created_at), 'HH:mm • d. MMMM yyyy', { locale: sk }) : ''}
                                        </span>
                                    </div>

                                    {isDraft ? (
                                        <DraftForm messageId={msg.id} initialContent={msg.content} clientEmail={client.email} />
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
