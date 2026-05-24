// Dark-theme variant — tóny ladia s gold/cream paletou.
const TAG_STYLES: Record<string, { cls: string; label: string }> = {
    web:           { cls: 'border-sky-400/30 bg-sky-400/10 text-sky-300',           label: 'Web' },
    chatbot:       { cls: 'border-violet-400/30 bg-violet-400/10 text-violet-300',  label: 'Chatbot' },
    automatizacia: { cls: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300', label: 'Automatizácia' },
    grafika:       { cls: 'border-pink-400/30 bg-pink-400/10 text-pink-300',        label: 'Grafika' },
    marketing:     { cls: 'border-orange-400/30 bg-orange-400/10 text-orange-300',  label: 'Marketing' },
    cennik:        { cls: 'border-gold/40 bg-gold/10 text-gold',                    label: 'Cena' },
    termin:        { cls: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300',        label: 'Termín' },
    podpora:       { cls: 'border-red-400/30 bg-red-400/10 text-red-300',           label: 'Podpora' },
    other:         { cls: 'border-cream/15 bg-cream/[0.04] text-cream/60',          label: 'Iné' },
}

export function tagLabel(tag: string): string {
    return TAG_STYLES[tag]?.label ?? tag
}

export default function TagPill({ tag }: { tag: string }) {
    const style = TAG_STYLES[tag] ?? TAG_STYLES.other
    return (
        <span className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${style.cls}`}>
            {style.label}
        </span>
    )
}

export const ALL_TAGS = Object.keys(TAG_STYLES).filter((t) => t !== 'other')
