import Link from "next/link";
import AdminShell from "@/app/admin/components/AdminShell";
import { StatCard, Panel } from "@/app/admin/components/AdminPanels";
import { Radar, Mail, ClipboardCheck, Send, Plus } from "lucide-react";
import { scraperDb } from "@/lib/scraper/supabase-server";
import { StatusBadge } from "./components/StatusBadge";

export const dynamic = "force-dynamic";

export default async function ScraperDashboard() {
    const db = scraperDb();

    const [statsTotal, statsEmail, statsAudited, statsSent, jobsRes] = await Promise.all([
        db.from("leads").select("id", { count: "exact", head: true }),
        db.from("leads").select("id", { count: "exact", head: true }).not("email", "is", null),
        db.from("leads").select("id", { count: "exact", head: true }).eq("audit_status", "done"),
        db.from("leads").select("id", { count: "exact", head: true }).eq("email_status", "sent"),
        db.from("jobs").select("*").order("started_at", { ascending: false }).limit(5),
    ]);

    const { data: topCats } = await db
        .from("leads")
        .select("category")
        .not("category", "is", null)
        .limit(2000);
    const catCounts = new Map<string, number>();
    (topCats ?? []).forEach((r: { category: string | null }) => {
        if (r.category) catCounts.set(r.category, (catCounts.get(r.category) ?? 0) + 1);
    });
    const top = Array.from(catCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const maxCount = top[0]?.[1] ?? 1;

    return (
        <AdminShell
            title="Scraper"
            subtitle="Generovanie leadov + audit webov"
            actions={
                <Link
                    href="/admin/scraper/jobs/new"
                    className="inline-flex items-center gap-2 rounded-lg bg-gold/15 px-4 py-2 text-sm font-medium text-gold border border-gold/40 hover:bg-gold/25 transition"
                >
                    <Plus size={16} /> Nový scrape
                </Link>
            }
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Leady spolu"     value={statsTotal.count ?? 0}   icon={Radar} accent="gold" />
                <StatCard label="S emailom"        value={statsEmail.count ?? 0}   icon={Mail} accent="cream" />
                <StatCard label="Audited"          value={statsAudited.count ?? 0} icon={ClipboardCheck} accent="emerald" />
                <StatCard label="Maily odoslané"   value={statsSent.count ?? 0}    icon={Send} accent="amber" />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Panel title="Posledné joby">
                    <div className="divide-y divide-cream/[0.06]">
                        {(jobsRes.data ?? []).map((j: any) => (
                            <Link
                                key={j.id}
                                href={`/admin/scraper/jobs/${j.id}`}
                                className="flex items-center justify-between py-3 hover:bg-cream/[0.02] px-2 rounded transition"
                            >
                                <div className="flex flex-col">
                                    <div className="text-sm text-cream">{j.category}</div>
                                    <div className="text-[11px] text-cream/40">
                                        {(j.cities ?? []).slice(0, 3).join(", ")}
                                        {(j.cities ?? []).length > 3 ? ` +${j.cities.length - 3}` : ""}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[11px] text-cream/50">
                                        {j.progress?.found ?? 0} / {j.progress?.with_email ?? 0}
                                    </span>
                                    <StatusBadge status={j.status} />
                                </div>
                            </Link>
                        ))}
                        {(!jobsRes.data || jobsRes.data.length === 0) && (
                            <div className="py-6 text-center text-cream/40 text-sm">Žiadne joby</div>
                        )}
                    </div>
                </Panel>

                <Panel title="Top kategórie">
                    <div className="space-y-2">
                        {top.map(([cat, n]) => (
                            <div key={cat} className="flex items-center gap-3">
                                <div className="w-32 truncate text-sm text-cream/80">{cat}</div>
                                <div className="flex-1 h-2 rounded bg-cream/[0.05] overflow-hidden">
                                    <div
                                        className="h-full bg-gold/60"
                                        style={{ width: `${(n / maxCount) * 100}%` }}
                                    />
                                </div>
                                <div className="w-10 text-right font-mono text-xs text-cream/60">{n}</div>
                            </div>
                        ))}
                        {top.length === 0 && (
                            <div className="py-6 text-center text-cream/40 text-sm">Žiadne kategórie</div>
                        )}
                    </div>
                </Panel>
            </div>
        </AdminShell>
    );
}
