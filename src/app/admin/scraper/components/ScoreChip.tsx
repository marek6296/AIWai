export function ScoreChip({ score }: { score: number | null | undefined }) {
    if (score == null) return <span className="font-mono text-cream/40">—</span>;
    const color =
        score >= 7 ? "bg-emerald-400/15 text-emerald-300 border-emerald-400/30"
        : score >= 4 ? "bg-amber-400/15 text-amber-300 border-amber-400/30"
        : "bg-red-400/15 text-red-300 border-red-400/30";
    return (
        <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-xs ${color}`}>
            {score}<span className="opacity-50">/10</span>
        </span>
    );
}
