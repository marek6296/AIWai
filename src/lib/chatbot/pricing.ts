/**
 * Live pricing loader — fetches prices from Supabase chatbot_pricing table.
 * Results are cached in-memory for 5 minutes so each chat request is fast.
 * Falls back to empty string if table doesn't exist yet (knowledge.ts has fallback prices).
 */

import { getSupabaseAdmin } from '@/lib/supabase/admin'

interface PricingRow {
    id: string
    category: string
    name: string
    price_from: number
    price_to: number | null
    unit: string
    description: string | null
    sort_order: number
}

const CATEGORY_LABELS: Record<string, string> = {
    grafika: 'LOGO & DIZAJN',
    marketing: 'MARKETING & SOCIÁLNE SIETE',
    web: 'WEB & E-SHOP',
    chatbot: 'AI CHATBOT',
    automatizacia: 'AUTOMATIZÁCIA',
}

const CATEGORY_ORDER = ['grafika', 'marketing', 'web', 'chatbot', 'automatizacia']

// ── In-memory cache ──────────────────────────────────────────────
let _cache: { text: string; at: number } | null = null
const TTL = 5 * 60 * 1000 // 5 minutes

export async function getLivePricing(): Promise<string> {
    if (_cache && Date.now() - _cache.at < TTL) return _cache.text

    try {
        const { data, error } = await getSupabaseAdmin()
            .from('chatbot_pricing')
            .select('*')
            .eq('is_active', true)
            .order('category')
            .order('sort_order')

        if (error || !data?.length) return ''

        const rows = data as PricingRow[]
        const byCategory = new Map<string, PricingRow[]>()
        for (const r of rows) {
            if (!byCategory.has(r.category)) byCategory.set(r.category, [])
            byCategory.get(r.category)!.push(r)
        }

        const lines: string[] = [
            '════════════════════════════════════════════════════════════',
            '💰 AKTUÁLNY CENNÍK (načítaný naživo — má prednosť pred ostatným)',
            '════════════════════════════════════════════════════════════',
            '',
        ]

        for (const cat of CATEGORY_ORDER) {
            const items = byCategory.get(cat)
            if (!items?.length) continue
            lines.push(`━━ ${CATEGORY_LABELS[cat] ?? cat.toUpperCase()} ━━`)
            lines.push('')
            for (const item of items) {
                const priceStr = item.price_to
                    ? `od ${item.price_from} € do ${item.price_to} €`
                    : item.unit === 'dohodou'
                    ? 'cena dohodou'
                    : `od ${item.price_from} ${item.unit}`
                lines.push(`• **${item.name}** — ${priceStr}`)
                if (item.description) lines.push(`  ${item.description}`)
                lines.push('')
            }
        }

        const text = lines.join('\n')
        _cache = { text, at: Date.now() }
        return text
    } catch {
        return ''
    }
}

/** Call this after admin updates a price to invalidate the cache immediately. */
export function invalidatePricingCache() {
    _cache = null
}
