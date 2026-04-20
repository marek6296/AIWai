import { getSupabaseAdmin } from '@/lib/supabase/admin'
import AdminNav from '../components/AdminNav'
import TagPill from '../components/TagPill'
import Link from 'next/link'
import { Sparkles, Mail, Phone, User, Clock, MessagesSquare } from 'lucide-react'

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
    new: { label: 'Nové', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
    seen: { label: 'Videné', cls: 'bg-sky-50 text-sky-700 border-sky-200' },
    contacted: { label: 'Kontaktované', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    closed: { label: 'Uzavreté', cls: 'bg-slate-100 text-slate-600 border-slate-200' },
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
        <div className="min-h-screen bg-brand-offwhite flex">
            <AdminNav />
            <main className="flex-1 p-8 max-w-5xl">
                <div className="mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
                        <Sparkles size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-brand-indigo">Leady</h1>
                        <p className="text-brand-indigo/50 text-sm">
                            Klienti, ktorí nechali kontakt cez chatbota
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-4 text-sm mb-6">
                        Chyba pri načítaní: {error.message}
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-4 gap-3 mb-8">
                    <Stat value={newLeads.length} label="Nové" color="text-amber-500" />
                    <Stat value={contactedLeads.length} label="Kontaktované" color="text-emerald-500" />
                    <Stat value={closedLeads.length} label="Uzavreté" color="text-slate-500" />
                    <Stat value={leads.length} label="Celkom" color="text-brand-indigo" />
                </div>

                {/* New leads block */}
                <Section title="Nové – treba sa ozvať" items={newLeads} accent />

                {/* Rest */}
                <Section
                    title="Ostatné"
                    items={leads.filter((l) => l.status !== 'new')}
                />
            </main>
        </div>
    )
}

function Stat({ value, label, color }: { value: number; label: string; color: string }) {
    return (
        <div className="bg-white rounded-2xl p-4 border border-brand-indigo/10 shadow-sm">
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-brand-indigo/50 mt-1">{label}</div>
        </div>
    )
}

function Section({ title, items, accent = false }: { title: string; items: LeadRow[]; accent?: boolean }) {
    return (
        <div className="mb-8">
            <h2 className="text-sm font-bold text-brand-indigo mb-3 flex items-center gap-2">
                {title}
                <span className="text-xs font-semibold bg-brand-indigo/5 text-brand-indigo/60 px-2 py-0.5 rounded-full">
                    {items.length}
                </span>
            </h2>

            {items.length === 0 && (
                <div className="bg-white rounded-2xl border border-brand-indigo/10 p-8 text-center text-sm text-brand-indigo/40">
                    Žiadne leady v tejto kategórii.
                </div>
            )}

            <div className="space-y-3">
                {items.map((l) => (
                    <Link
                        key={l.id}
                        href={`/admin/conversations/${l.id}`}
                        className={`block bg-white rounded-2xl p-5 border transition-shadow hover:shadow-md ${
                            accent && l.status === 'new'
                                ? 'border-amber-300 ring-1 ring-amber-200/50'
                                : 'border-brand-indigo/10'
                        }`}
                    >
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${STATUS_META[l.status].cls}`}
                                >
                                    {STATUS_META[l.status].label}
                                </span>
                                {l.tags.map((t) => (
                                    <TagPill key={t} tag={t} />
                                ))}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-brand-indigo/40 whitespace-nowrap">
                                <Clock size={12} />
                                {formatSK(l.lead_captured_at || l.updated_at)}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 mb-2 text-sm">
                            {l.lead_name && (
                                <span className="inline-flex items-center gap-1 text-brand-indigo font-semibold">
                                    <User size={13} />
                                    {l.lead_name}
                                </span>
                            )}
                            {l.lead_email && (
                                <span className="inline-flex items-center gap-1 text-brand-indigo/70">
                                    <Mail size={13} />
                                    {l.lead_email}
                                </span>
                            )}
                            {l.lead_phone && (
                                <span className="inline-flex items-center gap-1 text-brand-indigo/70">
                                    <Phone size={13} />
                                    {l.lead_phone}
                                </span>
                            )}
                        </div>

                        {l.lead_interest && (
                            <p className="text-sm text-brand-indigo/60 line-clamp-2">{l.lead_interest}</p>
                        )}

                        <div className="mt-2 text-xs text-brand-indigo/40 flex items-center gap-2">
                            <MessagesSquare size={12} />
                            {l.message_count} správ
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
