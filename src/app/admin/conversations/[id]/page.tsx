import { getSupabaseAdmin } from '@/lib/supabase/admin'
import AdminNav from '../../components/AdminNav'
import TagPill from '../../components/TagPill'
import StatusControls from '../StatusControls'
import NotesEditor from '../NotesEditor'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
    ArrowLeft,
    Mail,
    Phone,
    User,
    Sparkles,
    Clock,
    MessageSquare,
    Globe,
    Hash,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

const TZ = 'Europe/Bratislava'
function formatSK(d: string | null): string {
    if (!d) return '—'
    const date = new Date(d)
    return new Intl.DateTimeFormat('sk-SK', {
        timeZone: TZ,
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(date)
}

function formatTime(d: string): string {
    return new Intl.DateTimeFormat('sk-SK', {
        timeZone: TZ,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(new Date(d))
}

interface Message {
    id: string
    role: 'user' | 'assistant' | 'system'
    content: string
    created_at: string
}

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

export default async function ConversationDetailPage({
    params,
}: {
    params: { id: string }
}) {
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

    // Auto-mark as 'seen' if it was new (non-blocking, but await to reflect in UI)
    if (conversation.status === 'new') {
        await admin
            .from('chatbot_conversations')
            .update({ status: 'seen' })
            .eq('id', params.id)
        conversation.status = 'seen'
    }

    return (
        <div className="min-h-screen bg-brand-offwhite flex">
            <AdminNav />
            <main className="flex-1 p-8 max-w-5xl">
                {/* Back */}
                <Link
                    href="/admin/conversations"
                    className="inline-flex items-center gap-1.5 text-sm text-brand-indigo/60 hover:text-brand-indigo mb-4 transition-colors"
                >
                    <ArrowLeft size={14} />
                    Späť na konverzácie
                </Link>

                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                        {conversation.is_lead && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500 text-white">
                                <Sparkles size={11} />
                                Lead
                            </span>
                        )}
                        {conversation.tags.map((t) => (
                            <TagPill key={t} tag={t} />
                        ))}
                    </div>
                    <h1 className="text-2xl font-bold text-brand-indigo">
                        Konverzácia #{conversation.id.slice(0, 8)}
                    </h1>
                    <div className="flex flex-wrap gap-4 text-xs text-brand-indigo/50 mt-1">
                        <span className="inline-flex items-center gap-1">
                            <Clock size={12} /> Začatá {formatSK(conversation.created_at)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                            <MessageSquare size={12} /> {conversation.message_count} správ
                        </span>
                        {conversation.language && (
                            <span className="inline-flex items-center gap-1">
                                <Globe size={12} /> {conversation.language.toUpperCase()}
                            </span>
                        )}
                        <span className="inline-flex items-center gap-1 font-mono">
                            <Hash size={12} /> {conversation.session_id.slice(0, 20)}…
                        </span>
                    </div>
                </div>

                {/* Status controls */}
                <div className="bg-white rounded-2xl border border-brand-indigo/10 p-4 mb-4">
                    <StatusControls id={conversation.id} current={conversation.status} />
                </div>

                {/* Lead info */}
                {conversation.is_lead && (
                    <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl border border-amber-200 p-5 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles size={16} className="text-amber-500" />
                            <h3 className="font-semibold text-brand-indigo text-sm">Lead kontakt</h3>
                            {conversation.lead_captured_at && (
                                <span className="ml-auto text-xs text-brand-indigo/40">
                                    Zachytené: {formatSK(conversation.lead_captured_at)}
                                </span>
                            )}
                        </div>
                        <div className="grid sm:grid-cols-3 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                                <User size={14} className="text-brand-indigo/40" />
                                <span className="text-brand-indigo font-medium">
                                    {conversation.lead_name || <em className="text-brand-indigo/30">—</em>}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail size={14} className="text-brand-indigo/40" />
                                {conversation.lead_email ? (
                                    <a
                                        href={`mailto:${conversation.lead_email}`}
                                        className="text-brand-indigo font-medium hover:underline"
                                    >
                                        {conversation.lead_email}
                                    </a>
                                ) : (
                                    <em className="text-brand-indigo/30">—</em>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={14} className="text-brand-indigo/40" />
                                {conversation.lead_phone ? (
                                    <a
                                        href={`tel:${conversation.lead_phone}`}
                                        className="text-brand-indigo font-medium hover:underline"
                                    >
                                        {conversation.lead_phone}
                                    </a>
                                ) : (
                                    <em className="text-brand-indigo/30">—</em>
                                )}
                            </div>
                        </div>
                        {conversation.lead_interest && (
                            <div className="mt-3 pt-3 border-t border-amber-200/60 text-sm">
                                <span className="text-xs uppercase tracking-wider text-brand-indigo/40 font-semibold">
                                    Záujem:
                                </span>{' '}
                                <span className="text-brand-indigo/80">{conversation.lead_interest}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Notes */}
                <div className="mb-4">
                    <NotesEditor id={conversation.id} initial={conversation.admin_notes ?? ''} />
                </div>

                {/* Messages */}
                <div className="bg-white rounded-2xl border border-brand-indigo/10 p-5">
                    <h3 className="font-semibold text-brand-indigo text-sm mb-4 flex items-center gap-2">
                        <MessageSquare size={16} />
                        Priebeh konverzácie
                    </h3>

                    {messages.length === 0 ? (
                        <p className="text-sm text-brand-indigo/40 text-center py-8">
                            Žiadne správy.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {messages.map((m) => (
                                <div
                                    key={m.id}
                                    className={`flex ${
                                        m.role === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    <div
                                        className={`max-w-[75%] ${
                                            m.role === 'user'
                                                ? 'bg-brand-indigo text-white rounded-2xl rounded-tr-sm'
                                                : 'bg-brand-offwhite text-brand-indigo border border-brand-indigo/5 rounded-2xl rounded-tl-sm'
                                        } px-4 py-2.5`}
                                    >
                                        <div className="text-sm whitespace-pre-wrap">{m.content}</div>
                                        <div
                                            className={`text-[10px] mt-1 ${
                                                m.role === 'user'
                                                    ? 'text-white/50'
                                                    : 'text-brand-indigo/40'
                                            }`}
                                        >
                                            {formatTime(m.created_at)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
