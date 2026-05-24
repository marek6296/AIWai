import { getSupabaseAdmin } from '@/lib/supabase/admin'
import AdminShell from '../components/AdminShell'
import { SectionLabel } from '../components/AdminPanels'
import PricingRowEditor from './PricingRow'
import { RefreshCw, Palette, Megaphone, Globe, Bot, Zap } from 'lucide-react'

export const dynamic = 'force-dynamic'

const CATEGORY_META: Record<string, { label: string; icon: typeof Palette }> = {
    grafika:        { label: 'Logo a dizajn',         icon: Palette },
    marketing:      { label: 'Marketing a social',     icon: Megaphone },
    web:            { label: 'Web a e-shop',           icon: Globe },
    chatbot:        { label: 'AI Chatbot',              icon: Bot },
    automatizacia:  { label: 'Automatizácia',           icon: Zap },
}

const CATEGORY_ORDER = ['grafika', 'marketing', 'web', 'chatbot', 'automatizacia']

interface Row {
    id: string
    category: string
    name: string
    price_from: number
    price_to: number | null
    unit: string
    description: string | null
    is_active: boolean
    sort_order: number
    updated_at: string
}

export default async function PricingPage() {
    const { data, error } = await getSupabaseAdmin()
        .from('chatbot_pricing')
        .select('*')
        .order('category')
        .order('sort_order')

    const rows = (data ?? []) as Row[]
    const byCategory = new Map<string, Row[]>()
    for (const r of rows) {
        if (!byCategory.has(r.category)) byCategory.set(r.category, [])
        byCategory.get(r.category)!.push(r)
    }

    return (
        <AdminShell
            title="Cenník chatbota"
            subtitle="Ceny sa načítavajú naživo — zmena sa prejaví v bote do 5 minút"
            actions={
                <span className="inline-flex items-center gap-1.5 rounded-md border border-cream/10 bg-cream/[0.04] px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-cream/45">
                    <RefreshCw size={11} />
                    Cache 5 min
                </span>
            }
        >
            {error && (
                <div className="mb-6 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-300">
                    <strong>Tabuľka neexistuje.</strong> Spusti migráciu
                    <code className="mx-1 rounded bg-char-soft px-1.5 py-0.5 font-mono text-xs">supabase/migrations/20260421_pricing.sql</code>
                    v Supabase SQL Editore.
                </div>
            )}

            {rows.length === 0 && !error && (
                <div className="rounded-2xl border border-dashed border-cream/10 bg-char-soft/30 p-12 text-center text-cream/45">
                    Žiadne položky. Spusti SQL migráciu.
                </div>
            )}

            <div className="space-y-2">
                {CATEGORY_ORDER.map((cat, i) => {
                    const items = byCategory.get(cat)
                    if (!items?.length) return null
                    const meta = CATEGORY_META[cat]
                    const Icon = meta?.icon ?? Palette
                    return (
                        <div key={cat}>
                            <SectionLabel hint={`${items.filter((i) => i.is_active).length}/${items.length} aktívnych`}>
                                <span className="inline-flex items-center gap-2">
                                    <Icon size={11} className="text-gold/60" />
                                    {meta?.label ?? cat}
                                </span>
                            </SectionLabel>
                            <div className="space-y-2">
                                {items.map((item) => (
                                    <PricingRowEditor
                                        key={item.id}
                                        id={item.id}
                                        name={item.name}
                                        priceFrom={item.price_from}
                                        priceTo={item.price_to}
                                        unit={item.unit}
                                        description={item.description}
                                        isActive={item.is_active}
                                    />
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </AdminShell>
    )
}
