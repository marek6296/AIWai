const TAG_STYLES: Record<string, { bg: string; text: string; label: string }> = {
    web: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Web' },
    chatbot: { bg: 'bg-purple-50', text: 'text-purple-700', label: 'Chatbot' },
    automatizacia: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Automatizácia' },
    grafika: { bg: 'bg-pink-50', text: 'text-pink-700', label: 'Grafika' },
    marketing: { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Marketing' },
    cennik: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Cena' },
    termin: { bg: 'bg-sky-50', text: 'text-sky-700', label: 'Termín' },
    podpora: { bg: 'bg-red-50', text: 'text-red-700', label: 'Podpora' },
    other: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Iné' },
}

export function tagLabel(tag: string): string {
    return TAG_STYLES[tag]?.label ?? tag
}

export default function TagPill({ tag }: { tag: string }) {
    const style = TAG_STYLES[tag] ?? TAG_STYLES.other
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${style.bg} ${style.text}`}>
            {style.label}
        </span>
    )
}

export const ALL_TAGS = Object.keys(TAG_STYLES).filter((t) => t !== 'other')
