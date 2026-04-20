import { getSupabaseAdmin } from '@/lib/supabase/admin'
import AdminNav from '../components/AdminNav'
import TagPill from '../components/TagPill'
import Link from 'next/link'
import { MessagesSquare, Mail, Phone, User, Sparkles, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'

const TZ = 'Europe/Bratislava'
function formatSK(d: string): string {
    if (!d) return '—'
    const date = new Date(d)
    const datePart = new Intl.DateTimeFormat('sk-SK', { timeZone: TZ, day: 'numeric', month: 'short' }).format(date)
    const timePart = new Intl.DateTimeFormat('sk-SK', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false }).format(date)
    return `${datePart}, ${timePart}`
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
    status: string
    first_user_msg: string | null
    last_user_msg: string | null
}

export default async function ConversationsPage({
    searchParams,
}: {
    searchParams: { tag?: string; lead?: string }
}) {
    const filterTag = searchParams.tag
    const filterLead = searchParams.lead === '1'

    let query = getSupabaseAdmin()
        .from('chatbot_conversations')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(200)

    if (filterTag) query = query.contains('tags', [filterTag])
    if (filterLead) query = query.eq('is_lead', true)

    const { data, error } = await query
    const conversations = (data ?? []) as Conversation[]

    return (
        <div className="min-h-screen bg-brand-offwhite flex">
            <AdminNav />
            <main className="flex-1 p-8 max-w-6xl">
                <div className="mb-8 flex items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-brand-indigo">Konverzácie</h1>
                        <p className="text-brand-indigo/50 text-sm mt-1">
                            {conversations.length} konverzáci{conversations.length === 1 ? 'a' : 'í'} cez chatbota
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-4 text-sm mb-6">
                        Chyba pri načítaní: {error.message}. Skontroluj, či je v Supabase vytvorená tabuľka
                        <code className="mx-1 px-1 bg-white rounded">chatbot_conversations</code>
                        a že je nastavený <code className="mx-1 px-1 bg-white rounded">SUPABASE_SERVICE_ROLE_KEY</code>.
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-6 items-center">
                    <span className="text-xs uppercase tracking-wider font-semibold text-brand-indigo/50 mr-1">Filter:</span>
                    <FilterLink tag={null} lead={false} active={!filterTag && !filterLead}>
                        Všetko
                    </FilterLink>
                    <FilterLink tag={null} lead={true} active={filterLead}>
                        <Sparkles size={12} className="inline mr-1" />
                        Iba leady
                    </FilterLink>
                    <div className="w-px h-5 bg-brand-indigo/15 mx-1" />
                    {['web', 'chatbot', 'automatizacia', 'grafika', 'marketing', 'cennik'].map((t) => (
                        <FilterLink key={t} tag={t} lead={filterLead} active={filterTag === t}>
                            <TagPill tag={t} />
                        </FilterLink>
                    ))}
                </div>

                {/* Conversations list */}
                <div className="space-y-3">
                    {conversations.length === 0 && !error && (
                        <div className="bg-white rounded-2xl border border-brand-indigo/10 p-12 text-center">
                            <MessagesSquare size={36} className="mx-auto text-brand-indigo/20 mb-3" />
                            <p className="text-brand-indigo/50 text-sm">Zatiaľ žiadne konverzácie.</p>
                        </div>
                    )}

                    {conversations.map((c) => (
                        <Link
                            key={c.id}
                            href={`/admin/conversations/${c.id}`}
                            className={`block bg-white rounded-2xl border p-5 hover:shadow-md transition-shadow ${
                                c.is_lead && c.status === 'new'
                                    ? 'border-amber-300 shadow-sm ring-1 ring-amber-200/50'
                                    : 'border-brand-indigo/10'
                            }`}
                        >
                            <div className="flex items-start justify-between gap-4 mb-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                    {c.is_lead && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white">
                                            <Sparkles size={10} />
                                            Lead
                                        </span>
                                    )}
                                    {c.tags.map((t) => (
                                        <TagPill key={t} tag={t} />
                                    ))}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-brand-indigo/40 whitespace-nowrap">
                                    <Clock size={12} />
                                    {formatSK(c.updated_at)}
                                </div>
                            </div>

                            {/* Lead contact */}
                            {c.is_lead && (
                                <div className="flex flex-wrap gap-3 mb-2 text-sm">
                                    {c.lead_name && (
                                        <span className="inline-flex items-center gap-1 text-brand-indigo font-medium">
                                            <User size={13} />
                                            {c.lead_name}
                                        </span>
                                    )}
                                    {c.lead_email && (
                                        <span className="inline-flex items-center gap-1 text-brand-indigo/70">
                                            <Mail size={13} />
                                            {c.lead_email}
                                        </span>
                                    )}
                                    {c.lead_phone && (
                                        <span className="inline-flex items-center gap-1 text-brand-indigo/70">
                                            <Phone size={13} />
                                            {c.lead_phone}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Message preview */}
                            <p className="text-sm text-brand-indigo/60 line-clamp-2">
                                {c.last_user_msg || c.first_user_msg || '—'}
                            </p>

                            <div className="mt-2 text-xs text-brand-indigo/40 flex items-center gap-3">
                                <span>{c.message_count} {c.message_count === 1 ? 'správa' : 'správ'}</span>
                                {c.language && <span>· {c.language.toUpperCase()}</span>}
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    )
}

function FilterLink({
    tag,
    lead,
    active,
    children,
}: {
    tag: string | null
    lead: boolean
    active: boolean
    children: React.ReactNode
}) {
    const params = new URLSearchParams()
    if (tag) params.set('tag', tag)
    if (lead) params.set('lead', '1')
    const href = params.toString() ? `/admin/conversations?${params}` : '/admin/conversations'
    return (
        <Link
            href={href}
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                active ? 'bg-brand-indigo text-white' : 'bg-white border border-brand-indigo/10 text-brand-indigo/70 hover:bg-brand-indigo/5'
            }`}
        >
            {children}
        </Link>
    )
}
