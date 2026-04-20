import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import { sk } from 'date-fns/locale'
import { Mail, Clock, User, Phone, Tag, MessageSquare, FileText, Inbox } from 'lucide-react'
import AdminNav from '../components/AdminNav'
import DoneButton from './DoneButton'

export const dynamic = 'force-dynamic'

export default async function InboxPage() {
    const supabase = createClient()

    const { data: submissions } = await supabase
        .from('form_submissions')
        .select('*')
        .order('received_at', { ascending: false })
        .limit(100)

    const all = submissions || []
    const newItems = all.filter(s => s.status !== 'done')
    const doneItems = all.filter(s => s.status === 'done')
    const today = all.filter(s => {
        const d = new Date(s.received_at)
        return d.toDateString() === new Date().toDateString()
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
                        <div className="text-3xl font-bold text-amber-500">{newItems.length}</div>
                        <div className="text-sm text-brand-indigo/50 mt-1">Nevybavené</div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-brand-indigo/10 shadow-sm">
                        <div className="text-3xl font-bold text-brand-indigo">{today}</div>
                        <div className="text-sm text-brand-indigo/50 mt-1">Dnes</div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-brand-indigo/10 shadow-sm">
                        <div className="text-3xl font-bold text-emerald-500">{doneItems.length}</div>
                        <div className="text-sm text-brand-indigo/50 mt-1">Vybavených</div>
                    </div>
                </div>

                {/* ── Formuláre z webu ── */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-4 px-1">
                        <div className="w-7 h-7 rounded-lg bg-brand-indigo/10 flex items-center justify-center">
                            <FileText size={14} className="text-brand-indigo" />
                        </div>
                        <h2 className="text-base font-bold text-brand-indigo">Formuláre z webu</h2>
                        <span className="ml-1 text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                            {newItems.length} nových
                        </span>
                    </div>

                    <div className="space-y-3">
                        {!newItems.length && (
                            <div className="bg-white rounded-2xl p-10 text-center border border-brand-indigo/10">
                                <FileText size={36} className="mx-auto mb-3 text-brand-indigo/20" />
                                <p className="text-brand-indigo/40 font-medium">Všetky vybavené 🎉</p>
                            </div>
                        )}

                        {newItems.map((sub) => (
                            <div key={sub.id} className="bg-white rounded-2xl p-5 border border-brand-indigo/10 shadow-sm hover:shadow-md hover:shadow-brand-indigo/10 transition-all">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4 flex-1 min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-brand-indigo/5 flex items-center justify-center shrink-0">
                                            <User size={18} className="text-brand-indigo/40" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-semibold text-brand-indigo">{sub.name || sub.email}</span>
                                                {sub.name && <span className="text-brand-indigo/40 text-sm hidden sm:block">{sub.email}</span>}
                                            </div>
                                            {sub.subject && <p className="text-brand-indigo/70 text-sm mt-0.5 font-medium truncate">{sub.subject}</p>}
                                            {sub.message && (
                                                <p className="text-brand-indigo/50 text-sm mt-1 line-clamp-2 flex items-start gap-1.5">
                                                    <MessageSquare size={13} className="mt-0.5 shrink-0" />
                                                    {sub.message}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-3 mt-2">
                                                {sub.phone && <span className="text-brand-indigo/35 text-xs flex items-center gap-1"><Phone size={11} />{sub.phone}</span>}
                                                {sub.project_type && <span className="text-brand-indigo/35 text-xs flex items-center gap-1"><Tag size={11} />{sub.project_type}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                        <div className="flex items-center gap-1 text-xs text-brand-indigo/35">
                                            <Clock size={12} />
                                            {sub.received_at ? format(new Date(sub.received_at), 'd. MMM, HH:mm', { locale: sk }) : '—'}
                                        </div>
                                        <DoneButton id={sub.id} isDone={false} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Vybavené ── */}
                {doneItems.length > 0 && (
                    <div className="mb-10">
                        <div className="flex items-center gap-2 mb-4 px-1">
                            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                                <FileText size={14} className="text-emerald-600" />
                            </div>
                            <h2 className="text-base font-bold text-brand-indigo/50">Vybavené</h2>
                            <span className="ml-1 text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                                {doneItems.length}
                            </span>
                        </div>

                        <div className="space-y-2">
                            {doneItems.map((sub) => (
                                <div key={sub.id} className="bg-white/60 rounded-2xl p-4 border border-brand-indigo/5 opacity-60">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                                                <User size={15} className="text-emerald-400" />
                                            </div>
                                            <div className="min-w-0">
                                                <span className="font-medium text-brand-indigo/60 text-sm">{sub.name || sub.email}</span>
                                                {sub.subject && <p className="text-brand-indigo/40 text-xs truncate">{sub.subject}</p>}
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    {sub.phone && <span className="text-brand-indigo/25 text-xs flex items-center gap-1"><Phone size={10} />{sub.phone}</span>}
                                                    {sub.project_type && <span className="text-brand-indigo/25 text-xs flex items-center gap-1"><Tag size={10} />{sub.project_type}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className="text-xs text-brand-indigo/25">
                                                {sub.received_at ? format(new Date(sub.received_at), 'd. MMM', { locale: sk }) : '—'}
                                            </span>
                                            <DoneButton id={sub.id} isDone={true} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Klientske maily (coming soon) ── */}
                <div>
                    <div className="flex items-center gap-2 mb-4 px-1">
                        <div className="w-7 h-7 rounded-lg bg-brand-indigo/10 flex items-center justify-center">
                            <Inbox size={14} className="text-brand-indigo" />
                        </div>
                        <h2 className="text-base font-bold text-brand-indigo">Klientske maily</h2>
                        <span className="ml-1 text-xs font-semibold bg-brand-indigo/5 text-brand-indigo/40 px-2 py-0.5 rounded-full">čoskoro</span>
                    </div>
                    <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-brand-indigo/15">
                        <Mail size={36} className="mx-auto mb-3 text-brand-indigo/15" />
                        <p className="text-brand-indigo/30 font-medium text-sm">Priame klientske emaily</p>
                        <p className="text-brand-indigo/20 text-xs mt-1">Bude prepojené s AI návrhmi odpovedí</p>
                    </div>
                </div>
            </main>
        </div>
    )
}
