const MAP: Record<string, string> = {
    queued:    "bg-cream/10 text-cream/70 border-cream/20",
    running:   "bg-gold/15 text-gold border-gold/40",
    done:      "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
    failed:    "bg-red-400/15 text-red-300 border-red-400/30",
    cancelled: "bg-cream/5 text-cream/40 border-cream/10",
    sent:      "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
    skipped:   "bg-cream/5 text-cream/40 border-cream/10",
    pending:   "bg-cream/10 text-cream/60 border-cream/20",
};

export function StatusBadge({ status }: { status: string | null | undefined }) {
    if (!status) return <span className="font-mono text-cream/40">—</span>;
    const cls = MAP[status] || "bg-cream/10 text-cream/70 border-cream/20";
    return (
        <span className={`inline-flex rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${cls}`}>
            {status}
        </span>
    );
}
