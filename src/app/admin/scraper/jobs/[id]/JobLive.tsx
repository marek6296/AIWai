"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { StatusBadge } from "../../components/StatusBadge";
import type { Job } from "@/lib/scraper/types";

export function JobLive({ initialJob }: { initialJob: Job }) {
    const [job, setJob] = useState<Job>(initialJob);
    const [logs, setLogs] = useState<string[]>(initialJob.log ?? []);
    const logRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (job.status === "done" || job.status === "failed" || job.status === "cancelled") return;

        const es = new EventSource(`/api/admin/scraper/jobs/${job.id}/stream`);

        es.addEventListener("progress", (ev) => {
            try {
                const data = JSON.parse((ev as MessageEvent).data);
                setJob((j) => ({ ...j, progress: { ...j.progress, ...data }, status: "running" }));
            } catch {}
        });
        es.addEventListener("log", (ev) => {
            try {
                const line = JSON.parse((ev as MessageEvent).data);
                setLogs((prev) => [...prev.slice(-499), String(line)]);
            } catch {}
        });
        es.addEventListener("done", (ev) => {
            try {
                const data = JSON.parse((ev as MessageEvent).data);
                setJob((j) => ({ ...j, status: data.status || "done", finished_at: data.finished_at }));
            } catch {}
            es.close();
        });
        es.onerror = () => {
            fetch(`/api/admin/scraper/jobs/${job.id}`)
                .then((r) => r.json())
                .then((d) => setJob((j) => ({ ...j, ...d })))
                .catch(() => {});
        };

        return () => es.close();
    }, [job.id, job.status]);

    useEffect(() => {
        if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    }, [logs]);

    const cancellable = job.status === "queued" || job.status === "running";

    async function cancel() {
        await fetch(`/api/admin/scraper/jobs/${job.id}/cancel`, { method: "POST" });
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cream/[0.08] bg-cream/[0.025] p-5">
                <div className="flex flex-col gap-1">
                    <div className="text-xs font-mono uppercase tracking-[0.22em] text-cream/40">Status</div>
                    <StatusBadge status={job.status} />
                </div>
                {cancellable && (
                    <button onClick={cancel} className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-2 text-sm text-red-300 hover:bg-red-400/20">
                        Zrušiť
                    </button>
                )}
                {(job.status === "done" || job.status === "failed") && (
                    <Link
                        href={`/admin/scraper/leads?job_id=${job.id}`}
                        className="rounded-lg border border-gold/40 bg-gold/15 px-4 py-2 text-sm text-gold hover:bg-gold/25"
                    >
                        Pozri leady z tohto jobu →
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Stat label="Current city" value={job.progress?.current_city ?? "—"} />
                <Stat label="Found" value={job.progress?.found ?? 0} />
                <Stat label="With email" value={job.progress?.with_email ?? 0} />
                <Stat label="Audited" value={job.progress?.audited ?? 0} />
            </div>

            <div
                ref={logRef}
                className="h-[420px] overflow-y-auto rounded-2xl border border-cream/[0.08] bg-black/60 p-4 font-mono text-[12px] leading-relaxed text-cream/80"
            >
                {logs.length === 0 && <div className="text-cream/30">Žiadne logy zatiaľ...</div>}
                {logs.map((l, i) => {
                    const tone = /error|fail|chyba/i.test(l) ? "text-red-300"
                        : /warn|skip/i.test(l) ? "text-amber-300"
                        : "text-cream/70";
                    return <div key={i} className={tone}>{l}</div>;
                })}
            </div>
        </div>
    );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-cream/[0.08] bg-cream/[0.025] p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream/40">{label}</div>
            <div className="mt-2 text-2xl font-display text-gold">{value}</div>
        </div>
    );
}
