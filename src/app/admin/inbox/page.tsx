import { createClient } from '@/lib/supabase/server'
import { Mail, Clock, User, Phone, Tag, MessageSquare, FileText, Inbox, CheckCircle2 } from 'lucide-react'
import AdminShell from '../components/AdminShell'
import { StatCard, Panel, SectionLabel } from '../components/AdminPanels'
import DoneButton from './DoneButton'

const TZ = 'Europe/Bratislava'

function formatSKTime(dateStr: string, isDone: boolean): string {
    if (!dateStr) return '—'
    const date = new Date(dateStr)
    const datePart = new Intl.DateTimeFormat('sk-SK', { timeZone: TZ, day: 'numeric', month: 'short' }).format(date)
    if (isDone) return datePart
    const timePart = new Intl.DateTimeFormat('sk-SK', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false }).format(date)
    return `${datePart}, ${timePart}`
}

export const dynamic = 'force-dynamic'

export default async function InboxPage() {
    const supabase = createClient()

    const [{ data: formData }, { data: emailData }] = await Promise.all([
        supabase.from('form_submissions').select('*').order('received_at', { ascending: false }).limit(100),
        supabase.from('email_submissions').select('*').order('received_at', { ascending: false }).limit(100),
    ])

    const forms = formData || []
    const emails = emailData || []

    const newForms = forms.filter((s: { status?: string }) => s.status !== 'done')
    const doneForms = forms.filter((s: { status?: string }) => s.status === 'done')
    const newEmails = emails.filter((s: { status?: string }) => s.status !== 'done')
    const doneEmails = emails.filter((s: { status?: string }) => s.status === 'done')

    const todaySK = new Intl.DateTimeFormat('sk-SK', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
    const todayCount = [...forms, ...emails].filter((s: { received_at?: string }) => {
        if (!s.received_at) return false
        return new Intl.DateTimeFormat('sk-SK', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(s.received_at)) === todaySK
    }).length

    return (
        <AdminShell title="Inbox" subtitle="Webové formuláre a klientske emaily">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard label="Nevybavené" value={newForms.length + newEmails.length} icon={Inbox} accent="amber" />
                <StatCard label="Dnes"        value={todayCount} icon={Clock} accent="gold" />
                <StatCard label="Vybavené"    value={doneForms.length + doneEmails.length} icon={CheckCircle2} accent="emerald" />
            </div>

            <SectionLabel hint={`${newForms.length} nových`}>Formuláre z webu</SectionLabel>
            <SubmissionsSection
                newItems={newForms}
                doneItems={doneForms}
                emptyIcon={<FileText size={28} className="text-cream/15" />}
                emptyText="Žiadne formuláre"
                table="form_submissions"
            />

            <SectionLabel hint={`${newEmails.length} nových`}>Klientske maily</SectionLabel>
            <SubmissionsSection
                newItems={newEmails}
                doneItems={doneEmails}
                emptyIcon={<Mail size={28} className="text-cream/15" />}
                emptyText="Žiadne klientske maily"
                table="email_submissions"
            />
        </AdminShell>
    )
}

function SubmissionsSection({ newItems, doneItems, emptyText, emptyIcon, table }: {
    newItems: Record<string, string>[]
    doneItems: Record<string, string>[]
    emptyText: string
    emptyIcon: React.ReactNode
    table: 'form_submissions' | 'email_submissions'
}) {
    return (
        <>
            <div className="space-y-3">
                {!newItems.length && (
                    <div className="rounded-2xl border border-dashed border-cream/10 bg-char-soft/30 p-10 text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-cream/10 bg-cream/[0.03]">
                            {emptyIcon}
                        </div>
                        <p className="text-sm text-cream/45">{doneItems.length > 0 ? 'Všetky vybavené ✓' : emptyText}</p>
                    </div>
                )}

                {newItems.map((sub) => (
                    <SubmissionCard key={sub.id} sub={sub} isDone={false} table={table} />
                ))}
            </div>

            {doneItems.length > 0 && (
                <details className="mt-6 group">
                    <summary className="cursor-pointer select-none text-[11px] font-mono uppercase tracking-[0.22em] text-cream/35 hover:text-cream/60">
                        Vybavené ({doneItems.length}) ▾
                    </summary>
                    <div className="mt-3 space-y-2">
                        {doneItems.map((sub) => (
                            <SubmissionCard key={sub.id} sub={sub} isDone={true} table={table} />
                        ))}
                    </div>
                </details>
            )}
        </>
    )
}

function SubmissionCard({ sub, isDone, table }: { sub: Record<string, string>; isDone: boolean; table: 'form_submissions' | 'email_submissions' }) {
    return (
        <div className={`rounded-2xl border transition-all ${
            isDone
                ? 'border-cream/[0.05] bg-char-soft/30 opacity-55 p-4'
                : 'border-cream/[0.08] bg-char-soft/60 hover:border-gold/25 hover:bg-char-soft/80 p-5'
        }`}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`rounded-xl border border-cream/[0.08] bg-cream/[0.03] flex items-center justify-center shrink-0 ${isDone ? 'w-8 h-8' : 'w-10 h-10'}`}>
                        <User size={isDone ? 13 : 16} className="text-cream/45" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-medium text-cream ${isDone ? 'text-sm' : ''}`}>{sub.name || sub.email}</span>
                            {sub.name && <span className="text-cream/40 text-sm hidden sm:block">{sub.email}</span>}
                        </div>
                        {sub.subject && <p className="text-cream/70 text-sm mt-0.5 font-medium truncate">{sub.subject}</p>}
                        {!isDone && sub.message && (
                            <p className="text-cream/55 text-sm mt-1.5 line-clamp-2 flex items-start gap-1.5">
                                <MessageSquare size={13} className="mt-0.5 shrink-0 text-cream/35" />
                                {sub.message}
                            </p>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                            {sub.phone && <span className="text-cream/40 text-xs flex items-center gap-1 font-mono"><Phone size={10} />{sub.phone}</span>}
                            {sub.project_type && <span className="text-gold/70 text-xs flex items-center gap-1 font-mono uppercase tracking-wider"><Tag size={10} />{sub.project_type}</span>}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center gap-1 text-xs text-cream/40 font-mono">
                        <Clock size={11} />
                        {formatSKTime(sub.received_at, isDone)}
                    </div>
                    <DoneButton id={sub.id} isDone={isDone} table={table} />
                </div>
            </div>
        </div>
    )
}
