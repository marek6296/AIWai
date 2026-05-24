import { getSupabaseAdmin } from '@/lib/supabase/admin'
import AdminShell from '../components/AdminShell'
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
        <AdminShell title="Konverzácie" subtitle={`${conversations.length} ${conversations.length === 1 ? 'konverzácia' : 'konverzácií'} cez chatbota`}>
            {error && (
                <div className="mb-6 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-300">
                    Chyba pri načítaní: {error.message}.
                </div>
            )}

            {/* Filters */}
            <div className="mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-cream/[0.08] bg-char-soft/60 p-3">
                <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.22em] text-cream/40">Filter</span>
                <FilterLink tag={null} lead={false} active={!filterTag && !filterLead}>
                    Všetko
                </FilterLink>
                <FilterLink tag={null} lead={true} active={filterLead}>
                    <Sparkles size={11} className="inline mr-1" />
                    Iba leady
                </FilterLink>
                <span className="mx-1 h-5 w-px bg-cream/10" />
                {['web', 'chatbot', 'automatizacia', 'grafika', 'marketing', 'cennik'].map((t) => (
                    <FilterLink key={t} tag={t} lead={filterLead} active={filterTag === t}>
                        <TagPill tag={t} />
                    </FilterLink>
                ))}
            </div>

            {/* List */}
            <div className="space-y-3">
                {conversations.length === 0 && !error && (
                    <div className="rounded-2xl border border-dashed border-cream/10 bg-char-soft/30 p-12 text-center">
                        <MessagesSquare size={32} className="mx-auto mb-3 text-cream/20" />
                        <p className="text-sm text-cream/45">Zatiaľ žiadne konverzácie.</p>
                    </div>
                )}

                {conversations.map((c) => (
                    <Link
                        key={c.id}
                        href={`/admin/conversations/${c.id}`}
                        className={`block rounded-2xl border bg-char-soft/60 p-5 transition-all hover:border-gold/25 hover:bg-char-soft/80 ${
                            c.is_lead && c.status === 'new'
                                ? 'border-gold/40 shadow-[0_0_30px_-12px_rgba(201,168,117,0.4)]'
                                : 'border-cream/[0.08]'
                        }`}
                    >
                        <div className="mb-2 flex items-start justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-2">
                                {c.is_lead && (
                                    <span className="inline-flex items-center gap-1 rounded-md border border-gold/40 bg-gold/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
                                        <Sparkles size={10} />
                                        Lead
                                    </span>
                                )}
                                {c.tags.map((t) => (
                                    <TagPill key={t} tag={t} />
                                ))}
                            </div>
                            <div className="flex shrink-0 items-center gap-1 font-mono text-[11px] text-cream/40">
                                <Clock size={11} />
                                {formatSK(c.updated_at)}
                            </div>
                        </div>

                        {c.is_lead && (
                            <div className="mb-2 flex flex-wrap gap-3 text-sm">
                                {c.lead_name && (
                                    <span className="inline-flex items-center gap-1.5 font-medium text-cream">
                                        <User size={13} className="text-gold/70" />
                                        {c.lead_name}
                                    </span>
                                )}
                                {c.lead_email && (
                                    <span className="inline-flex items-center gap-1.5 text-cream/70">
                                        <Mail size={13} className="text-cream/50" />
                                        {c.lead_email}
                                    </span>
                                )}
                                {c.lead_phone && (
                                    <span className="inline-flex items-center gap-1.5 text-cream/70 font-mono text-xs">
                                        <Phone size={13} className="text-cream/50" />
                                        {c.lead_phone}
                                    </span>
                                )}
                            </div>
                        )}

                        <p className="line-clamp-2 text-sm text-cream/60">
                            {c.last_user_msg || c.first_user_msg || '—'}
                        </p>

                        <div className="mt-2 flex items-center gap-3 text-xs text-cream/40 font-mono">
                            <span>{c.message_count} {c.message_count === 1 ? 'správa' : 'správ'}</span>
                            {c.language && <span>· {c.language.toUpperCase()}</span>}
                        </div>
                    </Link>
                ))}
            </div>
        </AdminShell>
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
            className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                active
                    ? 'border border-gold/40 bg-gold/15 text-gold'
                    : 'border border-cream/15 bg-cream/[0.04] text-cream/65 hover:text-cream hover:bg-cream/[0.07]'
            }`}
        >
            {children}
        </Link>
    )
}
