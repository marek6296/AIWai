import { getSupabaseAdmin } from '@/lib/supabase/admin'
import AdminShell from '../../components/AdminShell'
import { Panel } from '../../components/AdminPanels'
import TagPill from '../../components/TagPill'
import StatusControls from '../StatusControls'
import NotesEditor from '../NotesEditor'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
    ArrowLeft, Mail, Phone, User, Sparkles, Clock, MessageSquare, Globe, Hash,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

const TZ = 'Europe/Bratislava'
function formatSK(d: string | null): string {
    if (!d) return '—'
    const date = new Date(d)
    return new Intl.DateTimeFormat('sk-SK', { timeZone: TZ, day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).format(date)
}
function formatTime(d: string): string {
    return new Intl.DateTimeFormat('sk-SK', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(d))
}

interface Message { id: string; role: 'user' | 'assistant' | 'system'; content: string; created_at: string }

interface Conversation {
    id: string
    session_id: string
    created_at: string
    updated_at: string
    message_count: number
    language: string | null
    tags: string[]
    is_lead: boolean
    lead_name: string | null
    lead_email: string | null
    lead_phone: string | null
    lead_interest: string | null
    lead_captured_at: string | null
    status: 'new' | 'seen' | 'contacted' | 'closed'
    admin_notes: string | null
    summary: string | null
    first_user_msg: string | null
    last_user_msg: string | null
}

export default async function ConversationDetailPage({ params }: { params: { id: string } }) {
    const admin = getSupabaseAdmin()

    const { data: conv, error: convErr } = await admin
        .from('chatbot_conversations')
        .select('*')
        .eq('id', params.id)
        .maybeSingle()

    if (convErr || !conv) notFound()

    const conversation = conv as Conversation

    const { data: msgData } = await admin
        .from('chatbot_messages')
        .select('*')
        .eq('conversation_id', params.id)
        .order('created_at', { ascending: true })

    const messages = (msgData ?? []) as Message[]

    if (conversation.status === 'new') {
        await admin.from('chatbot_conversations').update({ status: 'seen' }).eq('id', params.id)
        conversation.status = 'seen'
    }

    return (
        <AdminShell
            title={`Konverzácia #${conversation.id.slice(0, 8)}`}
            subtitle={`${conversation.message_count} správ · začatá ${formatSK(conversation.created_at)}`}
            actions={
                <Link
                    href="/admin/conversations"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-cream/15 bg-cream/[0.04] px-3 py-2 text-sm text-cream/70 hover:text-cream hover:bg-cream/[0.07] transition"
                >
                    <ArrowLeft size={14} /> Späť
                </Link>
            }
        >
            <div className="mb-4 flex flex-wrap items-center gap-2">
                {conversation.is_lead && (
                    <span className="inline-flex items-center gap-1 rounded-md border border-gold/40 bg-gold/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
                        <Sparkles size={10} /> Lead
                    </span>
                )}
                {conversation.tags.map((t) => <TagPill key={t} tag={t} />)}
                {conversation.language && (
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-cream/40">
                        <Globe size={11} /> {conversation.language.toUpperCase()}
                    </span>
                )}
                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-cream/40">
                    <Hash size={11} /> {conversation.session_id.slice(0, 20)}…
                </span>
            </div>

            <div className="mb-4 rounded-2xl border border-cream/[0.08] bg-char-soft/60 p-4">
                <StatusControls id={conversation.id} current={conversation.status} />
            </div>

            {conversation.is_lead && (
                <div className="mb-4 rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 via-gold/[0.04] to-transparent p-5">
                    <div className="mb-3 flex items-center gap-2">
                        <Sparkles size={14} className="text-gold" />
                        <h3 className="font-display text-sm font-semibold text-cream">Lead kontakt</h3>
                        {conversation.lead_captured_at && (
                            <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.18em] text-cream/40">
                                Zachytené: {formatSK(conversation.lead_captured_at)}
                            </span>
                        )}
                    </div>
                    <div className="grid gap-3 text-sm sm:grid-cols-3">
                        <Info icon={<User size={14} />} value={conversation.lead_name} />
                        <Info icon={<Mail size={14} />} value={conversation.lead_email} link={conversation.lead_email ? `mailto:${conversation.lead_email}` : undefined} />
                        <Info icon={<Phone size={14} />} value={conversation.lead_phone} link={conversation.lead_phone ? `tel:${conversation.lead_phone}` : undefined} />
                    </div>
                    {conversation.lead_interest && (
                        <div className="mt-3 border-t border-gold/15 pt-3 text-sm">
                            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream/40">Záujem:</span>{' '}
                            <span className="text-cream/85">{conversation.lead_interest}</span>
                        </div>
                    )}
                </div>
            )}

            <div className="mb-4">
                <NotesEditor id={conversation.id} initial={conversation.admin_notes ?? ''} />
            </div>

            <Panel title="Priebeh konverzácie" subtitle={`${messages.length} správ`}>
                {messages.length === 0 ? (
                    <p className="py-8 text-center text-sm text-cream/40">Žiadne správy.</p>
                ) : (
                    <div className="space-y-3">
                        {messages.map((m) => (
                            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                                        m.role === 'user'
                                            ? 'rounded-tr-sm border border-gold/30 bg-gold/15 text-cream'
                                            : 'rounded-tl-sm border border-cream/[0.08] bg-cream/[0.03] text-cream/90'
                                    }`}
                                >
                                    <div className="whitespace-pre-wrap text-sm">{m.content}</div>
                                    <div className={`mt-1 font-mono text-[10px] ${m.role === 'user' ? 'text-gold/60' : 'text-cream/40'}`}>
                                        {formatTime(m.created_at)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Panel>
        </AdminShell>
    )
}

function Info({ icon, value, link }: { icon: React.ReactNode; value: string | null; link?: string }) {
    const text = value || '—'
    const inner = (
        <span className="inline-flex items-center gap-2 text-cream">
            <span className="text-cream/45">{icon}</span>
            {value ? text : <em className="text-cream/30">—</em>}
        </span>
    )
    return link && value ? <a href={link} className="hover:text-gold transition-colors">{inner}</a> : inner
}
