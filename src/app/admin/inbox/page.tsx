import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { format } from 'date-fns'
import { sk } from 'date-fns/locale'
import { Mail, Clock, AlertCircle, User } from 'lucide-react'
import AdminNav from '../components/AdminNav'

export const dynamic = 'force-dynamic'

const STATUS_COLORS: Record<string, string> = {
    open: 'bg-slate-100 text-slate-600 border border-slate-200',
    replied: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    rejected: 'bg-red-100 text-red-600 border border-red-200',
}

const STATUS_LABELS: Record<string, string> = {
    open: '📬 Otvorené',
    replied: '✅ Odpovedané',
    rejected: '❌ Odmietnuté',
}

export default async function InboxPage() {
    const supabase = createClient()

    const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .order('last_message_at', { ascending: false })
        .limit(50)

    const { data: drafts } = await supabase
        .from('lead_messages')
        .select('lead_email')
        .eq('message_status', 'draft')

    const draftEmails = new Set((drafts || []).map(d => d.lead_email))

    return (
        <div className="min-h-screen bg-brand-offwhite flex">
            <AdminNav />

            <main className="flex-1 p-8 max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-brand-indigo">Inbox</h1>
                    <p className="text-brand-indigo/50 text-sm mt-1">
                        Prichádzajúce emaily — AI návrhy čakajú na schválenie
                    </p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-2xl p-5 border border-brand-indigo/10 shadow-sm shadow-brand-indigo/5">
                        <div className="text-3xl font-bold text-amber-500">{draftEmails.size}</div>
                        <div className="text-sm text-brand-indigo/50 mt-1">Čakajúce drafty</div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-brand-indigo/10 shadow-sm shadow-brand-indigo/5">
                        <div className="text-3xl font-bold text-brand-indigo">{leads?.length || 0}</div>
                        <div className="text-sm text-brand-indigo/50 mt-1">Celkom kontaktov</div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-brand-indigo/10 shadow-sm shadow-brand-indigo/5">
                        <div className="text-3xl font-bold text-emerald-500">
                            {leads?.filter(l => l.status === 'replied').length || 0}
                        </div>
                        <div className="text-sm text-brand-indigo/50 mt-1">Odpovedaných</div>
                    </div>
                </div>

                {/* Lead list */}
                <div className="space-y-3">
                    {!leads?.length && (
                        <div className="bg-white rounded-2xl p-12 text-center border border-brand-indigo/10">
                            <Mail size={40} className="mx-auto mb-4 text-brand-indigo/20" />
                            <p className="text-brand-indigo/40 font-medium">Žiadne kontakty</p>
                            <p className="text-brand-indigo/25 text-sm mt-1">Keď príde email alebo formulár, zobrazí sa tu</p>
                        </div>
                    )}

                    {leads?.map((lead) => {
                        const hasDraft = draftEmails.has(lead.email)

                        return (
                            <Link
                                key={lead.id}
                                href={`/admin/client/${encodeURIComponent(lead.email)}`}
                                className={`block bg-white rounded-2xl p-5 border transition-all hover:shadow-md hover:shadow-brand-indigo/10 hover:-translate-y-0.5 ${
                                    hasDraft
                                        ? 'border-amber-300 shadow-sm shadow-amber-100'
                                        : 'border-brand-indigo/10 shadow-sm shadow-brand-indigo/5'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4 flex-1 min-w-0">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                            hasDraft ? 'bg-amber-100' : 'bg-brand-indigo/5'
                                        }`}>
                                            <User size={18} className={hasDraft ? 'text-amber-600' : 'text-brand-indigo/40'} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-semibold text-brand-indigo truncate">
                                                    {lead.name || lead.email}
                                                </span>
                                                {lead.name && (
                                                    <span className="text-brand-indigo/40 text-sm truncate hidden sm:block">
                                                        {lead.email}
                                                    </span>
                                                )}
                                                {hasDraft && (
                                                    <span className="flex items-center gap-1 text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full shrink-0">
                                                        <AlertCircle size={11} /> Čaká na odoslanie
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-brand-indigo/70 text-sm mt-0.5 truncate font-medium">
                                                {lead.subject || '(bez predmetu)'}
                                            </p>

                                            <div className="flex items-center gap-3 mt-1">
                                                {lead.phone && (
                                                    <p className="text-brand-indigo/35 text-xs">📞 {lead.phone}</p>
                                                )}
                                                {lead.project_type && (
                                                    <p className="text-brand-indigo/35 text-xs">🏷️ {lead.project_type}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                        <div className="flex items-center gap-1 text-xs text-brand-indigo/35">
                                            <Clock size={12} />
                                            {lead.last_message_at
                                                ? format(new Date(lead.last_message_at), 'd. MMM, HH:mm', { locale: sk })
                                                : '—'}
                                        </div>
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[lead.status] || STATUS_COLORS.open}`}>
                                            {STATUS_LABELS[lead.status] || lead.status}
                                        </span>
                                        {lead.source && (
                                            <span className="text-xs text-brand-indigo/25 capitalize">
                                                {lead.source}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </main>
        </div>
    )
}
