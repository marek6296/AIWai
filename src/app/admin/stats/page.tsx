import { getSupabaseAdmin } from '@/lib/supabase/admin'
import AdminNav from '../components/AdminNav'
import { tagLabel } from '../components/TagPill'
import { BarChart3, MessagesSquare, Sparkles, Languages, TrendingUp } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Row {
    id: string
    created_at: string
    tags: string[]
    is_lead: boolean
    status: string
    language: string | null
    message_count: number
}

const TAG_COLORS: Record<string, string> = {
    web: 'bg-blue-500',
    chatbot: 'bg-purple-500',
    automatizacia: 'bg-emerald-500',
    grafika: 'bg-pink-500',
    marketing: 'bg-orange-500',
    cennik: 'bg-amber-500',
    termin: 'bg-sky-500',
    podpora: 'bg-red-500',
    other: 'bg-slate-400',
}

export default async function StatsPage() {
    const { data, error } = await getSupabaseAdmin()
        .from('chatbot_conversations')
        .select('id, created_at, tags, is_lead, status, language, message_count')
        .order('created_at', { ascending: false })
        .limit(2000)

    const rows = (data ?? []) as Row[]

    // Aggregate tag counts
    const tagCounts = new Map<string, number>()
    for (const r of rows) {
        for (const t of r.tags ?? []) {
            tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1)
        }
    }
    const tagEntries = Array.from(tagCounts.entries()).sort((a, b) => b[1] - a[1])
    const maxTag = tagEntries[0]?.[1] ?? 1

    // Language counts
    const langCounts = new Map<string, number>()
    for (const r of rows) {
        const l = r.language ?? 'unknown'
        langCounts.set(l, (langCounts.get(l) ?? 0) + 1)
    }
    const langEntries = Array.from(langCounts.entries()).sort((a, b) => b[1] - a[1])

    // Last 30 days bucket
    const now = Date.now()
    const DAY = 24 * 60 * 60 * 1000
    const days: { date: Date; count: number; leads: number }[] = []
    for (let i = 29; i >= 0; i--) {
        days.push({ date: new Date(now - i * DAY), count: 0, leads: 0 })
    }
    const dayKey = (d: Date) =>
        new Intl.DateTimeFormat('sk-SK', {
            timeZone: 'Europe/Bratislava',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(d)
    const dayMap = new Map(days.map((d) => [dayKey(d.date), d]))
    for (const r of rows) {
        const key = dayKey(new Date(r.created_at))
        const bucket = dayMap.get(key)
        if (bucket) {
            bucket.count++
            if (r.is_lead) bucket.leads++
        }
    }
    const maxDay = Math.max(1, ...days.map((d) => d.count))

    // Summary
    const total = rows.length
    const leadsCount = rows.filter((r) => r.is_lead).length
    const conversion = total > 0 ? Math.round((leadsCount / total) * 100) : 0
    const avgMsgs =
        total > 0 ? Math.round(rows.reduce((sum, r) => sum + (r.message_count ?? 0), 0) / total) : 0

    const statusCounts = rows.reduce<Record<string, number>>((acc, r) => {
        acc[r.status] = (acc[r.status] ?? 0) + 1
        return acc
    }, {})

    return (
        <div className="min-h-screen bg-brand-offwhite flex">
            <AdminNav />
            <main className="flex-1 p-8 max-w-6xl">
                <div className="mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-indigo flex items-center justify-center">
                        <BarChart3 size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-brand-indigo">Štatistiky chatbota</h1>
                        <p className="text-brand-indigo/50 text-sm">O čom ľudia riešia najčastejšie</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-4 text-sm mb-6">
                        Chyba: {error.message}
                    </div>
                )}

                {/* Summary cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <SummaryCard
                        icon={<MessagesSquare size={18} />}
                        value={total}
                        label="Konverzácií"
                        color="text-brand-indigo"
                    />
                    <SummaryCard
                        icon={<Sparkles size={18} />}
                        value={leadsCount}
                        label="Leady"
                        color="text-amber-500"
                    />
                    <SummaryCard
                        icon={<TrendingUp size={18} />}
                        value={`${conversion}%`}
                        label="Konverzia"
                        color="text-emerald-500"
                    />
                    <SummaryCard
                        icon={<MessagesSquare size={18} />}
                        value={avgMsgs}
                        label="Ø správ/konverz."
                        color="text-sky-500"
                    />
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Tag distribution */}
                    <div className="bg-white rounded-2xl border border-brand-indigo/10 p-6">
                        <h2 className="font-semibold text-brand-indigo text-sm mb-4 flex items-center gap-2">
                            <BarChart3 size={16} />
                            Najčastejšie témy
                        </h2>
                        {tagEntries.length === 0 ? (
                            <p className="text-sm text-brand-indigo/40">Zatiaľ žiadne tagované konverzácie.</p>
                        ) : (
                            <div className="space-y-3">
                                {tagEntries.map(([tag, count]) => {
                                    const pct = (count / maxTag) * 100
                                    return (
                                        <div key={tag}>
                                            <div className="flex items-center justify-between text-sm mb-1">
                                                <span className="font-medium text-brand-indigo">
                                                    {tagLabel(tag)}
                                                </span>
                                                <span className="text-brand-indigo/50 text-xs">
                                                    {count} ({Math.round((count / total) * 100)}%)
                                                </span>
                                            </div>
                                            <div className="h-2 bg-brand-indigo/5 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${TAG_COLORS[tag] ?? TAG_COLORS.other} transition-all`}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Language breakdown */}
                    <div className="bg-white rounded-2xl border border-brand-indigo/10 p-6">
                        <h2 className="font-semibold text-brand-indigo text-sm mb-4 flex items-center gap-2">
                            <Languages size={16} />
                            Jazyk
                        </h2>
                        {langEntries.length === 0 ? (
                            <p className="text-sm text-brand-indigo/40">—</p>
                        ) : (
                            <div className="space-y-2">
                                {langEntries.map(([lang, count]) => (
                                    <div key={lang} className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-brand-indigo uppercase">
                                            {lang}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-32 h-2 bg-brand-indigo/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-brand-indigo"
                                                    style={{
                                                        width: `${total > 0 ? (count / total) * 100 : 0}%`,
                                                    }}
                                                />
                                            </div>
                                            <span className="text-xs text-brand-indigo/50 w-10 text-right">
                                                {count}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="h-px bg-brand-indigo/10 my-5" />

                        <h2 className="font-semibold text-brand-indigo text-sm mb-4">Status leadov</h2>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            {(['new', 'seen', 'contacted', 'closed'] as const).map((s) => (
                                <div
                                    key={s}
                                    className="flex items-center justify-between bg-brand-offwhite rounded-xl px-3 py-2"
                                >
                                    <span className="text-brand-indigo/60 capitalize">{s}</span>
                                    <span className="font-bold text-brand-indigo">
                                        {statusCounts[s] ?? 0}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Last 30 days chart */}
                <div className="bg-white rounded-2xl border border-brand-indigo/10 p-6 mt-6">
                    <h2 className="font-semibold text-brand-indigo text-sm mb-4 flex items-center gap-2">
                        <TrendingUp size={16} />
                        Posledných 30 dní
                    </h2>
                    <div className="flex items-end gap-1 h-32">
                        {days.map((d, idx) => {
                            const h = (d.count / maxDay) * 100
                            return (
                                <div
                                    key={idx}
                                    className="flex-1 flex flex-col justify-end group relative"
                                    title={`${dayKeyShort(d.date)}: ${d.count} konverzácií, ${d.leads} leadov`}
                                >
                                    <div
                                        className="w-full bg-brand-indigo/15 rounded-t relative"
                                        style={{ height: `${h}%` }}
                                    >
                                        <div
                                            className="absolute bottom-0 left-0 right-0 bg-amber-500 rounded-t"
                                            style={{ height: `${d.count > 0 ? (d.leads / d.count) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex items-center justify-between text-xs text-brand-indigo/40 mt-2">
                        <span>{dayKeyShort(days[0].date)}</span>
                        <div className="flex items-center gap-4">
                            <span className="inline-flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-sm bg-brand-indigo/15" /> Konverzácie
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-sm bg-amber-500" /> Leady
                            </span>
                        </div>
                        <span>{dayKeyShort(days[days.length - 1].date)}</span>
                    </div>
                </div>
            </main>
        </div>
    )
}

function dayKeyShort(d: Date): string {
    return new Intl.DateTimeFormat('sk-SK', {
        timeZone: 'Europe/Bratislava',
        day: 'numeric',
        month: 'short',
    }).format(d)
}

function SummaryCard({
    icon,
    value,
    label,
    color,
}: {
    icon: React.ReactNode
    value: number | string
    label: string
    color: string
}) {
    return (
        <div className="bg-white rounded-2xl p-4 border border-brand-indigo/10 shadow-sm">
            <div className={`flex items-center gap-2 ${color}`}>{icon}</div>
            <div className={`text-2xl font-bold mt-2 ${color}`}>{value}</div>
            <div className="text-xs text-brand-indigo/50 mt-1">{label}</div>
        </div>
    )
}
