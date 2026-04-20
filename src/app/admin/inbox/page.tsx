import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import { sk } from 'date-fns/locale'
import { Mail, Clock, User, Phone, Tag, MessageSquare, FileText, Inbox } from 'lucide-react'
import AdminNav from '../components/AdminNav'
import DoneButton from './DoneButton'

export const dynamic = 'force-dynamic'

export default async function InboxPage() {
    const supabase = createClient()

    const [{ data: formData }, { data: emailData }] = await Promise.all([
        supabase.from('form_submissions').select('*').order('received_at', { ascending: false }).limit(100),
        supabase.from('email_submissions').select('*').order('received_at', { ascending: false }).limit(100),
    ])

    const forms = formData || []
    const emails = emailData || []

    const newForms = forms.filter(s => s.status !== 'done')
    const doneForms = forms.filter(s => s.status === 'done')
    const newEmails = emails.filter(s => s.status !== 'done')
    const doneEmails = emails.filter(s => s.status === 'done')

    const todayCount = [...forms, ...emails].filter(s => {
        return new Date(s.received_at).toDateString() === new Date().toDateString()
    }).length

    return (
        <div className="min-h-screen bg-brand-offwhite flex">
            <AdminNav />

            <main className="flex-1 p-8 max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-brand-indigo">Inbox</h1>
                    <p className="text-brand-indigo/50 text-sm mt-1">Formuláre a klientske emaily</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-2xl p-5 border border-brand-indigo/10 shadow-sm">
                        <div className="text-3xl font-bold text-amber-500">{newForms.length + newEmails.length}</div>
                        <div className="text-sm text-brand-indigo/50 mt-1">Nevybavené</div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-brand-indigo/10 shadow-sm">
                        <div className="text-3xl font-bold text-brand-indigo">{todayCount}</div>
                        <div className="text-sm text-brand-indigo/50 mt-1">Dnes</div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-brand-indigo/10 shadow-sm">
                        <div className="text-3xl font-bold text-emerald-500">{doneForms.length + doneEmails.length}</div>
                        <div className="text-sm text-brand-indigo/50 mt-1">Vybavených</div>
                    </div>
                </div>

                {/* ── Formuláre z webu ── */}
                <SubmissionsSection
                    title="Formuláre z webu"
                    newItems={newForms}
                    doneItems={doneForms}
                    emptyText="Žiadne formuláre"
                    badge="📄 Formulár"
                    table="form_submissions"
                />

                <SubmissionsSection
                    title="Klientske maily"
                    newItems={newEmails}
                    doneItems={doneEmails}
                    emptyText="Žiadne klientske maily"
                    badge="📧 Email"
                    icon="inbox"
                    table="email_submissions"
                />
            </main>
        </div>
    )
}

function SubmissionsSection({ title, newItems, doneItems, emptyText, badge, icon = 'file', table = 'form_submissions' }: {
    title: string
    newItems: Record<string, string>[]
    doneItems: Record<string, string>[]
    emptyText: string
    badge: string
    icon?: 'file' | 'inbox'
    table?: 'form_submissions' | 'email_submissions'
}) {
    return (
        <div className="mb-10">
            <div className="flex items-center gap-2 mb-4 px-1">
                <div className="w-7 h-7 rounded-lg bg-brand-indigo/10 flex items-center justify-center">
                    {icon === 'inbox'
                        ? <Inbox size={14} className="text-brand-indigo" />
                        : <FileText size={14} className="text-brand-indigo" />
                    }
                </div>
                <h2 className="text-base font-bold text-brand-indigo">{title}</h2>
                <span className="ml-1 text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                    {newItems.length} nových
                </span>
            </div>

            <div className="space-y-3 mb-4">
                {!newItems.length && (
                    <div className="bg-white rounded-2xl p-10 text-center border border-brand-indigo/10">
                        <Mail size={32} className="mx-auto mb-3 text-brand-indigo/20" />
                        <p className="text-brand-indigo/40 font-medium">{newItems.length === 0 && doneItems.length > 0 ? 'Všetky vybavené 🎉' : emptyText}</p>
                    </div>
                )}

                {newItems.map((sub) => (
                    <SubmissionCard key={sub.id} sub={sub} badge={badge} isDone={false} table={table} />
                ))}
            </div>

            {doneItems.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs text-brand-indigo/30 font-medium px-1 mt-4 mb-2">Vybavené ({doneItems.length})</p>
                    {doneItems.map((sub) => (
                        <SubmissionCard key={sub.id} sub={sub} badge={badge} isDone={true} table={table} />
                    ))}
                </div>
            )}
        </div>
    )
}

function SubmissionCard({ sub, isDone, table = 'form_submissions' }: { sub: Record<string, string>; badge?: string; isDone: boolean; table?: 'form_submissions' | 'email_submissions' }) {
    return (
        <div className={`bg-white rounded-2xl p-${isDone ? '4' : '5'} border transition-all ${
            isDone
                ? 'border-brand-indigo/5 opacity-60'
                : 'border-brand-indigo/10 shadow-sm hover:shadow-md hover:shadow-brand-indigo/10 hover:-translate-y-0.5'
        }`}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`rounded-xl bg-brand-indigo/5 flex items-center justify-center shrink-0 ${isDone ? 'w-8 h-8' : 'w-10 h-10'}`}>
                        <User size={isDone ? 14 : 18} className="text-brand-indigo/40" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-semibold text-brand-indigo ${isDone ? 'text-sm' : ''}`}>{sub.name || sub.email}</span>
                            {sub.name && <span className="text-brand-indigo/40 text-sm hidden sm:block">{sub.email}</span>}
                        </div>
                        {sub.subject && <p className="text-brand-indigo/70 text-sm mt-0.5 font-medium truncate">{sub.subject}</p>}
                        {!isDone && sub.message && (
                            <p className="text-brand-indigo/50 text-sm mt-1 line-clamp-2 flex items-start gap-1.5">
                                <MessageSquare size={13} className="mt-0.5 shrink-0" />
                                {sub.message}
                            </p>
                        )}
                        <div className="flex items-center gap-3 mt-1">
                            {sub.phone && <span className="text-brand-indigo/35 text-xs flex items-center gap-1"><Phone size={10} />{sub.phone}</span>}
                            {sub.project_type && <span className="text-brand-indigo/35 text-xs flex items-center gap-1"><Tag size={10} />{sub.project_type}</span>}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center gap-1 text-xs text-brand-indigo/35">
                        <Clock size={12} />
                        {sub.received_at ? format(new Date(sub.received_at), isDone ? 'd. MMM' : 'd. MMM, HH:mm', { locale: sk }) : '—'}
                    </div>
                    <DoneButton id={sub.id} isDone={isDone} table={table} />
                </div>
            </div>
        </div>
    )
}
