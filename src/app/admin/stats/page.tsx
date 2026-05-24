import { getSupabaseAdmin } from '@/lib/supabase/admin'
import AdminShell from '../components/AdminShell'
import { StatCard, Panel, SectionLabel } from '../components/AdminPanels'
import { AreaChart, BarList } from '../components/Charts'
import { tagLabel } from '../components/TagPill'
import { MessagesSquare, Sparkles, Languages, TrendingUp, Activity } from 'lucide-react'

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

const STATUS_TONE: Record<string, string> = {
    new:        'border-gold/40 bg-gold/15 text-gold',
    seen:       'border-sky-400/30 bg-sky-400/10 text-sky-300',
    contacted:  'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
    closed:     'border-cream/15 bg-cream/[0.04] text-cream/50',
}

export default async function StatsPage() {
    const { data, error } = await getSupabaseAdmin()
        .from('chatbot_conversations')
        .select('id, created_at, tags, is_lead, status, language, message_count')
        .order('created_at', { ascending: false })
        .limit(2000)

    const rows = (data ?? []) as Row[]

    const tagCounts = new Map<string, number>()
    for (const r of rows) for (const t of r.tags ?? []) tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1)
    const tagItems = Array.from(tagCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([label, value]) => ({ label: tagLabel(label), value }))

    const langCounts = new Map<string, number>()
    for (const r of rows) {
        const l = r.language ?? 'unknown'
        langCounts.set(l, (langCounts.get(l) ?? 0) + 1)
    }
    const langItems = Array.from(langCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([label, value]) => ({ label: label.toUpperCase(), value }))

    const now = Date.now()
    const DAY = 24 * 60 * 60 * 1000
    const dayLabel = (d: Date) => new Intl.DateTimeFormat('sk-SK', { day: 'numeric', month: 'short' }).format(d)
    const dayKey = (d: Date) => d.toISOString().slice(0, 10)
    const days: { label: string; value: number; leads: number; iso: string }[] = []
    for (let i = 29; i >= 0; i--) {
        const date = new Date(now - i * DAY)
        days.push({ label: dayLabel(date), value: 0, leads: 0, iso: dayKey(date) })
    }
    const dayMap = new Map(days.map((d) => [d.iso, d]))
    for (const r of rows) {
        const key = (r.created_at || '').slice(0, 10)
        const bucket = dayMap.get(key)
        if (bucket) {
            bucket.value++
            if (r.is_lead) bucket.leads++
        }
    }

    const total = rows.length
    const leadsCount = rows.filter((r) => r.is_lead).length
    const conversion = total > 0 ? Math.round((leadsCount / total) * 100) : 0
    const avgMsgs = total > 0 ? Math.round(rows.reduce((sum, r) => sum + (r.message_count ?? 0), 0) / total) : 0

    const statusCounts = rows.reduce<Record<string, number>>((acc, r) => {
        acc[r.status] = (acc[r.status] ?? 0) + 1
        return acc
    }, {})

    return (
        <AdminShell title="Štatistiky chatbota" subtitle="O čom ľudia riešia najčastejšie">
            {error && (
                <div className="mb-6 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-300">
                    Chyba: {error.message}
                </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard label="Konverzácií"        value={total}            icon={MessagesSquare} accent="gold" />
                <StatCard label="Leady"              value={leadsCount}       icon={Sparkles}        accent="amber" />
                <StatCard label="Konverzia"          value={`${conversion}%`} icon={TrendingUp}      accent="emerald" />
                <StatCard label="Ø správ/konverz."   value={avgMsgs}          icon={Activity}        accent="cream" />
            </div>

            <SectionLabel hint="Posledných 30 dní">Aktivita</SectionLabel>
            <div className="rounded-2xl border border-cream/[0.08] bg-char-soft/60 p-6">
                <AreaChart data={days.map((d) => ({ label: d.label, value: d.value }))} width={1100} height={220} />
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Panel title="Najčastejšie témy" subtitle="Tagy zo všetkých konverzácií">
                    {tagItems.length === 0 ? (
                        <p className="py-6 text-center text-sm text-cream/40">Zatiaľ žiadne tagované konverzácie.</p>
                    ) : (
                        <BarList items={tagItems} />
                    )}
                </Panel>

                <Panel title="Jazyk + status leadov">
                    <div className="mb-5">
                        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-cream/40 inline-flex items-center gap-2">
                            <Languages size={11} className="text-gold/60" /> Jazyk
                        </div>
                        <BarList items={langItems} />
                    </div>

                    <div className="mt-5 border-t border-cream/[0.06] pt-5">
                        <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-cream/40">Status leadov</div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            {(['new', 'seen', 'contacted', 'closed'] as const).map((s) => (
                                <div
                                    key={s}
                                    className={`flex items-center justify-between rounded-lg border px-3 py-2 ${STATUS_TONE[s]}`}
                                >
                                    <span className="capitalize font-mono text-[11px] uppercase tracking-wider">{s}</span>
                                    <span className="font-display text-lg font-semibold tabular-nums">{statusCounts[s] ?? 0}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Panel>
            </div>
        </AdminShell>
    )
}
