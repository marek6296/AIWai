import { getSupabaseAdmin } from '@/lib/supabase/admin'
import AdminShell from '../components/AdminShell'
import { StatCard, SectionLabel } from '../components/AdminPanels'
import TagPill from '../components/TagPill'
import Link from 'next/link'
import { Sparkles, Mail, Phone, User, Clock, MessagesSquare, Inbox, CheckCircle2, XCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

const TZ = 'Europe/Bratislava'
function formatSK(d: string | null): string {
    if (!d) return '—'
    const date = new Date(d)
    const datePart = new Intl.DateTimeFormat('sk-SK', { timeZone: TZ, day: 'numeric', month: 'short' }).format(date)
    const timePart = new Intl.DateTimeFormat('sk-SK', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false }).format(date)
    return `${datePart}, ${timePart}`
}

interface LeadRow {
    id: string
    created_at: string
    updated_at: string
    lead_captured_at: string | null
    tags: string[]
    lead_name: string | null
    lead_email: string | null
    lead_phone: string | null
    lead_interest: string | null
    status: 'new' | 'seen' | 'contacted' | 'closed'
    message_count: number
    last_user_msg: string | null
}

const STATUS_META: Record<LeadRow['status'], { label: string; cls: string }> = {
    new:       { label: 'Nové',         cls: 'border-gold/40 bg-gold/15 text-gold' },
    seen:      { label: 'Videné',       cls: 'border-sky-400/30 bg-sky-400/10 text-sky-300' },
    contacted: { label: 'Kontaktované', cls: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300' },
    closed:    { label: 'Uzavreté',     cls: 'border-cream/15 bg-cream/[0.04] text-cream/50' },
}

export default async function LeadsPage() {
    const { data, error } = await getSupabaseAdmin()
        .from('chatbot_conversations')
        .select('*')
        .eq('is_lead', true)
        .order('lead_captured_at', { ascending: false, nullsFirst: false })
        .limit(200)

    const leads = (data ?? []) as LeadRow[]
    const newLeads = leads.filter((l) => l.status === 'new')
    const contactedLeads = leads.filter((l) => l.status === 'contacted')
    const closedLeads = leads.filter((l) => l.status === 'closed')

    return (
        <AdminShell title="Leady" subtitle="Klienti, ktorí nechali kontakt cez chatbota">
            {error && (
                <div className="mb-6 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-300">
                    Chyba pri načítaní: {error.message}
                </div>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Nové"         value={newLeads.length}       icon={Sparkles}     accent="gold" />
                <StatCard label="Kontaktované" value={contactedLeads.length} icon={CheckCircle2} accent="emerald" />
                <StatCard label="Uzavreté"     value={closedLeads.length}    icon={XCircle}      accent="cream" />
                <StatCard label="Celkom"       value={leads.length}          icon={Inbox}        accent="amber" />
            </div>

            <SectionLabel hint={`${newLeads.length} čaká`}>Nové — treba sa ozvať</SectionLabel>
            <LeadList items={newLeads} accent />

            <SectionLabel>Ostatné</SectionLabel>
            <LeadList items={leads.filter((l) => l.status !== 'new')} />
        </AdminShell>
    )
}

function LeadList({ items, accent = false }: { items: LeadRow[]; accent?: boolean }) {
    if (items.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-cream/10 bg-char-soft/30 p-8 text-center text-sm text-cream/45">
                Žiadne leady v tejto kategórii.
            </div>
        )
    }
    return (
        <div className="space-y-3">
            {items.map((l) => (
                <Link
                    key={l.id}
                    href={`/admin/conversations/${l.id}`}
                    className={`block rounded-2xl border bg-char-soft/60 p-5 transition-all hover:border-gold/25 hover:bg-char-soft/80 ${
                        accent && l.status === 'new'
                            ? 'border-gold/40 shadow-[0_0_30px_-12px_rgba(201,168,117,0.4)]'
                            : 'border-cream/[0.08]'
                    }`}
                >
                    <div className="mb-2 flex items-start justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <span
                                className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] ${STATUS_META[l.status].cls}`}
                            >
                                {STATUS_META[l.status].label}
                            </span>
                            {l.tags.map((t) => (
                                <TagPill key={t} tag={t} />
                            ))}
                        </div>
                        <div className="flex shrink-0 items-center gap-1 font-mono text-[11px] text-cream/40">
                            <Clock size={11} />
                            {formatSK(l.lead_captured_at || l.updated_at)}
                        </div>
                    </div>

                    <div className="mb-2 flex flex-wrap gap-3 text-sm">
                        {l.lead_name && (
                            <span className="inline-flex items-center gap-1.5 font-semibold text-cream">
                                <User size={13} className="text-gold/70" />
                                {l.lead_name}
                            </span>
                        )}
                        {l.lead_email && (
                            <span className="inline-flex items-center gap-1.5 text-cream/70">
                                <Mail size={13} className="text-cream/50" />
                                {l.lead_email}
                            </span>
                        )}
                        {l.lead_phone && (
                            <span className="inline-flex items-center gap-1.5 text-cream/70 font-mono text-xs">
                                <Phone size={13} className="text-cream/50" />
                                {l.lead_phone}
                            </span>
                        )}
                    </div>

                    {l.lead_interest && (
                        <p className="line-clamp-2 text-sm text-cream/60">{l.lead_interest}</p>
                    )}

                    <div className="mt-2 flex items-center gap-2 font-mono text-xs text-cream/40">
                        <MessagesSquare size={11} />
                        {l.message_count} {l.message_count === 1 ? 'správa' : 'správ'}
                    </div>
                </Link>
            ))}
        </div>
    )
}
