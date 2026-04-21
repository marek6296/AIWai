import { getSupabaseAdmin } from '@/lib/supabase/admin'
import AdminNav from '../components/AdminNav'
import PricingRowEditor from './PricingRow'
import { DollarSign, RefreshCw } from 'lucide-react'

export const dynamic = 'force-dynamic'

const CATEGORY_LABELS: Record<string, string> = {
    grafika: '🎨 Logo & Dizajn',
    marketing: '📣 Marketing & Sociálne siete',
    web: '🌐 Web & E-shop',
    chatbot: '🤖 AI Chatbot',
    automatizacia: '⚡ Automatizácia',
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
        <div className="min-h-screen bg-brand-offwhite flex">
            <AdminNav />
            <main className="flex-1 p-8 max-w-4xl">
                <div className="mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                        <DollarSign size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-brand-indigo">Cenník chatbota</h1>
                        <p className="text-brand-indigo/50 text-sm">
                            Ceny sa načítavajú naživo — zmena sa prejaví v bote do 5 minút
                        </p>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5 text-xs text-brand-indigo/40">
                        <RefreshCw size={12} />
                        Cache: 5 min
                    </div>
                </div>

                {error && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 mb-6">
                        <strong>Tabuľka neexistuje.</strong> Spusti migráciu{' '}
                        <code className="bg-white px-1 rounded">supabase/migrations/20260421_pricing.sql</code>{' '}
                        v Supabase SQL Editore.
                    </div>
                )}

                {rows.length === 0 && !error && (
                    <div className="bg-white rounded-2xl border border-brand-indigo/10 p-12 text-center text-brand-indigo/40">
                        Žiadne položky. Spusti SQL migráciu.
                    </div>
                )}

                <div className="space-y-8">
                    {CATEGORY_ORDER.map((cat) => {
                        const items = byCategory.get(cat)
                        if (!items?.length) return null
                        return (
                            <div key={cat}>
                                <h2 className="text-sm font-bold text-brand-indigo mb-3 flex items-center gap-2">
                                    {CATEGORY_LABELS[cat] ?? cat}
                                    <span className="text-xs font-normal text-brand-indigo/40">
                                        ({items.filter((i) => i.is_active).length}/{items.length} aktívnych)
                                    </span>
                                </h2>
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
            </main>
        </div>
    )
}
