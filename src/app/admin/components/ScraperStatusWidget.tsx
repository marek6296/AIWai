"use client";

// Floating widget v pravom dolnom rohu — viditeľný len keď beží/queue scraper job.
// Polluje /api/admin/scraper/jobs každých 5s. Aj keď je tab zatvorený a vrátiš sa,
// poll opäť beží — preto vidíš live progress okamžite.

import { useEffect, useState } from "react";
import Link from "next/link";
import { Radar, X, ChevronUp, Loader2 } from "lucide-react";

type Job = {
    id: string;
    category: string;
    cities: string[];
    status: "queued" | "running" | "done" | "failed" | "cancelled";
    progress?: { current_category?: string; current_city?: string; found?: number; with_email?: number; audited?: number; skipped?: number };
    started_at: string;
    finished_at?: string | null;
    max_per_city?: number;
};

const POLL_MS = 5000;
const RECENT_DONE_MS = 60_000; // ukáž "Done" max 60s po dokončení

export function ScraperStatusWidget() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [recentDone, setRecentDone] = useState<{ id: string; finished_at: string } | null>(null);
    const [collapsed, setCollapsed] = useState(false);
    const [dismissed, setDismissed] = useState<Set<string>>(new Set());

    useEffect(() => {
        let cancelled = false;
        let lastRunningIds: string[] = [];

        async function tick() {
            try {
                const res = await fetch("/api/admin/scraper/jobs?limit=10", { cache: "no-store" });
                if (!res.ok) return;
                const data = await res.json();
                if (cancelled) return;

                const all = (data.jobs as Job[]) ?? [];
                const active = all.filter((j) => j.status === "running" || j.status === "queued");

                // Detekcia: bol nejaký running, teraz nie je → recentDone marker
                const justDone = all.find(
                    (j) =>
                        lastRunningIds.includes(j.id) &&
                        (j.status === "done" || j.status === "failed" || j.status === "cancelled") &&
                        !dismissed.has(j.id),
                );
                if (justDone && justDone.finished_at) {
                    setRecentDone({ id: justDone.id, finished_at: justDone.finished_at });
                }

                setJobs(active);
                lastRunningIds = active.map((j) => j.id);
            } catch {
                /* silent — widget neruší user */
            }
        }

        tick();
        const t = setInterval(tick, POLL_MS);
        return () => { cancelled = true; clearInterval(t); };
    }, [dismissed]);

    // Auto-hide recentDone po RECENT_DONE_MS
    useEffect(() => {
        if (!recentDone) return;
        const age = Date.now() - new Date(recentDone.finished_at).getTime();
        const remaining = Math.max(0, RECENT_DONE_MS - age);
        const t = setTimeout(() => setRecentDone(null), remaining);
        return () => clearTimeout(t);
    }, [recentDone]);

    const hasActive = jobs.length > 0;
    if (!hasActive && !recentDone) return null;

    if (collapsed) {
        return (
            <button
                onClick={() => setCollapsed(false)}
                className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-char-soft text-gold shadow-[0_8px_30px_-8px_rgba(201,168,117,0.5)] backdrop-blur hover:bg-gold/15 transition"
                aria-label="Otvoriť scraper widget"
            >
                {hasActive ? <Loader2 size={18} className="animate-spin" /> : <Radar size={18} />}
            </button>
        );
    }

    return (
        <div className="fixed bottom-5 right-5 z-50 w-[320px] rounded-2xl border border-gold/30 bg-char-soft/95 backdrop-blur-xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.6),0_0_30px_-10px_rgba(201,168,117,0.4)]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-cream/[0.06] px-4 py-3">
                <div className="inline-flex items-center gap-2">
                    {hasActive ? (
                        <Loader2 size={14} className="text-gold animate-spin" />
                    ) : (
                        <Radar size={14} className="text-gold" />
                    )}
                    <span className="font-display text-sm font-semibold text-cream">Scraper</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream/40">
                        {hasActive ? `${jobs.length} bežiacich` : "dokončené"}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setCollapsed(true)}
                        className="rounded p-1 text-cream/45 hover:text-cream hover:bg-cream/[0.05]"
                        aria-label="Zbaliť"
                    >
                        <ChevronUp size={13} />
                    </button>
                </div>
            </div>

            {/* Active jobs */}
            <div className="divide-y divide-cream/[0.06]">
                {jobs.map((j) => {
                    const found = j.progress?.found ?? 0;
                    const skipped = j.progress?.skipped ?? 0;
                    const total = (j.max_per_city || 20) * Math.max(1, (j.cities?.length || 1));
                    const pct = Math.min(100, Math.round((found / Math.max(1, total)) * 100));
                    return (
                        <Link
                            key={j.id}
                            href={`/admin/scraper/jobs/${j.id}`}
                            className="block px-4 py-3 hover:bg-cream/[0.03] transition"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-[13px] text-cream">{j.category}</div>
                                    <div className="truncate text-[11px] text-cream/45 font-mono">
                                        {j.progress?.current_city || (j.cities?.[0] ?? "—")}
                                    </div>
                                </div>
                                <div className="shrink-0 text-right">
                                    <div className="font-display text-base font-semibold text-gold tabular-nums">{found}</div>
                                    {skipped > 0 && (
                                        <div className="font-mono text-[9px] text-cream/35">{skipped} skip</div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-2 h-1 overflow-hidden rounded bg-cream/[0.05]">
                                <div className="h-full bg-gold/60 transition-all" style={{ width: `${pct}%` }} />
                            </div>
                        </Link>
                    );
                })}

                {recentDone && jobs.length === 0 && (
                    <div className="px-4 py-3 flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                            <div className="text-[13px] text-emerald-300">Job dokončený</div>
                            <Link href={`/admin/scraper/jobs/${recentDone.id}`} className="text-[11px] text-gold hover:underline">
                                Pozri výsledky →
                            </Link>
                        </div>
                        <button
                            onClick={() => {
                                setDismissed((d) => new Set([...Array.from(d), recentDone.id]));
                                setRecentDone(null);
                            }}
                            className="rounded p-1 text-cream/40 hover:text-cream"
                        >
                            <X size={13} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
