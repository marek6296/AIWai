import Link from "next/link";
import AdminShell from "@/app/admin/components/AdminShell";
import { StatCard } from "@/app/admin/components/AdminPanels";
import { Radar, Mail, ClipboardCheck, Send, Plus, ExternalLink, ChevronRight } from "lucide-react";
import { scraperDb } from "@/lib/scraper/supabase-server";
import { StatusBadge } from "./components/StatusBadge";
import { ScoreChip } from "./components/ScoreChip";
import { MailStatusChip } from "./components/MailStatusChip";
import { ScraperTabs } from "./components/ScraperTabs";
import type { Job, Lead } from "@/lib/scraper/types";

export const dynamic = "force-dynamic";

export default async function ScraperDashboard() {
    const db = scraperDb();

    const [statsTotal, statsEmail, statsAudited, statsSent, jobsRes, leadsRes] = await Promise.all([
        db.from("leads").select("id", { count: "exact", head: true }),
        db.from("leads").select("id", { count: "exact", head: true }).not("email", "is", null),
        db.from("leads").select("id", { count: "exact", head: true }).eq("audit_status", "done"),
        db.from("leads").select("id", { count: "exact", head: true }).eq("email_status", "sent"),
        db.from("jobs").select("*").order("started_at", { ascending: false }).limit(5),
        db.from("leads").select("*").order("scraped_at", { ascending: false }).limit(20),
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
    const top = Array.from(catCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const maxCount = top[0]?.[1] ?? 1;

    const leads = (leadsRes.data ?? []) as Lead[];
    const jobs = (jobsRes.data ?? []) as Job[];

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
            <ScraperTabs />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Leady spolu"     value={statsTotal.count ?? 0}   icon={Radar} accent="gold" />
                <StatCard label="S emailom"        value={statsEmail.count ?? 0}   icon={Mail} accent="cream" />
                <StatCard label="Audited"          value={statsAudited.count ?? 0} icon={ClipboardCheck} accent="emerald" />
                <StatCard label="Maily odoslané"   value={statsSent.count ?? 0}    icon={Send} accent="amber" />
            </div>

            {/* ─── Posledné leady ─────────────────────────────────────── */}
            <section className="mt-8 rounded-2xl border border-cream/[0.08] bg-cream/[0.025]">
                <header className="flex items-center justify-between border-b border-cream/[0.06] px-5 py-4">
                    <div>
                        <h2 className="font-display text-lg text-cream">Posledné leady</h2>
                        <p className="text-[11px] text-cream/40">Top 20 podľa dátumu scrapingu</p>
                    </div>
                    <Link
                        href="/admin/scraper/leads"
                        className="inline-flex items-center gap-1 text-sm text-gold hover:underline"
                    >
                        Všetky leady <ChevronRight size={14} />
                    </Link>
                </header>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-left">
                            <tr className="border-b border-cream/[0.06] text-[10px] font-mono uppercase tracking-[0.18em] text-cream/40">
                                <th className="p-3">Názov</th>
                                <th className="p-3">Mesto</th>
                                <th className="p-3">Kategória</th>
                                <th className="p-3">Web</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Audit</th>
                                <th className="p-3">Mail</th>
                                <th className="p-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-cream/[0.04]">
                            {leads.map((l) => (
                                <tr key={l.id} className="hover:bg-cream/[0.02]">
                                    <td className="p-3 text-cream">
                                        <Link href={`/admin/scraper/leads/${l.id}`} className="hover:text-gold transition-colors">
                                            {l.name}
                                        </Link>
                                    </td>
                                    <td className="p-3 text-cream/70">{l.location || "—"}</td>
                                    <td className="p-3 text-cream/70">{l.category || "—"}</td>
                                    <td className="p-3">
                                        {l.website ? (
                                            <a href={l.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-gold/80 hover:text-gold">
                                                <ExternalLink size={12} /> web
                                            </a>
                                        ) : <span className="text-cream/30">—</span>}
                                    </td>
                                    <td className="p-3 text-cream/70 font-mono text-xs">{l.email || "—"}</td>
                                    <td className="p-3"><ScoreChip score={l.audit_report?.score} /></td>
                                    <td className="p-3"><MailStatusChip outreach={l.outreach_email} status={l.email_status} /></td>
                                    <td className="p-3">
                                        <Link href={`/admin/scraper/leads/${l.id}`} className="text-gold/80 hover:text-gold text-xs whitespace-nowrap">
                                            Detail →
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {leads.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-cream/40">
                                        Žiadne leady — spusti prvý scrape cez tlačidlo „Nový scrape"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* ─── Posledné joby + Top kategórie ─────────────────────── */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <section className="rounded-2xl border border-cream/[0.08] bg-cream/[0.025]">
                    <header className="border-b border-cream/[0.06] px-5 py-4">
                        <h2 className="font-display text-lg text-cream">Posledné joby</h2>
                    </header>
                    <div className="divide-y divide-cream/[0.06] px-3">
                        {jobs.map((j) => (
                            <Link
                                key={j.id}
                                href={`/admin/scraper/jobs/${j.id}`}
                                className="flex items-center justify-between py-3 hover:bg-cream/[0.02] px-2 rounded transition"
                            >
                                <div className="flex flex-col min-w-0">
                                    <div className="text-sm text-cream truncate">{j.category}</div>
                                    <div className="text-[11px] text-cream/40 truncate">
                                        {(j.cities ?? []).slice(0, 3).join(", ")}
                                        {(j.cities ?? []).length > 3 ? ` +${j.cities.length - 3}` : ""}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <span className="text-[11px] text-cream/50 font-mono">
                                        {j.progress?.found ?? 0} / {j.progress?.with_email ?? 0}
                                    </span>
                                    <StatusBadge status={j.status} />
                                </div>
                            </Link>
                        ))}
                        {jobs.length === 0 && (
                            <div className="py-6 text-center text-cream/40 text-sm">Žiadne joby</div>
                        )}
                    </div>
                </section>

                <section className="rounded-2xl border border-cream/[0.08] bg-cream/[0.025]">
                    <header className="border-b border-cream/[0.06] px-5 py-4">
                        <h2 className="font-display text-lg text-cream">Top kategórie</h2>
                    </header>
                    <div className="space-y-2 p-5">
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
                </section>
            </div>
        </AdminShell>
    );
}
