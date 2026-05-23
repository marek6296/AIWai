import type { AuditReport } from "@/lib/scraper/types";
import { ScoreChip } from "./ScoreChip";

export function AuditCard({ report }: { report: AuditReport | null }) {
    if (!report) {
        return (
            <div className="rounded-xl border border-dashed border-cream/15 p-6 text-cream/50">
                Audit ešte nebol vygenerovaný.
            </div>
        );
    }
    return (
        <div className="space-y-5 rounded-2xl border border-cream/[0.08] bg-cream/[0.025] p-6">
            <div className="flex items-center justify-between">
                <h3 className="font-display text-lg text-cream">Audit webu</h3>
                <ScoreChip score={report.score} />
            </div>

            <Section title="Silné stránky" items={report.strengths} tone="emerald" />
            <Section title="Slabiny" items={report.weaknesses} tone="amber" />

            <div>
                <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-cream/40">
                    Príležitosť
                </div>
                <blockquote className="rounded-md border-l-2 border-gold/60 bg-gold/5 px-4 py-3 text-cream/90">
                    {report.opportunity}
                </blockquote>
            </div>

            <div className="text-[10px] text-cream/30">
                Audit z: {new Date(report.checked_at).toLocaleString("sk-SK")}
            </div>
        </div>
    );
}

function Section({ title, items, tone }: { title: string; items: string[]; tone: "emerald" | "amber" }) {
    const chip = tone === "emerald"
        ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
        : "border-amber-400/30 bg-amber-400/10 text-amber-200";
    return (
        <div>
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-cream/40">{title}</div>
            <div className="flex flex-wrap gap-1.5">
                {items.map((s, i) => (
                    <span key={i} className={`rounded-md border px-2 py-1 text-xs ${chip}`}>{s}</span>
                ))}
            </div>
        </div>
    );
}
