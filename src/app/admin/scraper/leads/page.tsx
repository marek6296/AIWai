import Link from "next/link";
import AdminShell from "@/app/admin/components/AdminShell";
import { scraperDb } from "@/lib/scraper/supabase-server";
import { ScoreChip } from "../components/ScoreChip";
import { StatusBadge } from "../components/StatusBadge";
import { LeadFilters } from "./LeadFilters";
import { ExternalLink } from "lucide-react";
import type { Lead } from "@/lib/scraper/types";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

type SP = { [k: string]: string | undefined };

export default async function LeadsPage({ searchParams }: { searchParams: SP }) {
    const page = Math.max(0, parseInt(searchParams.page || "0", 10));
    const db = scraperDb();

    let q = db.from("leads").select("*", { count: "exact" }).order("created_at", { ascending: false });
    if (searchParams.category) q = q.eq("category", searchParams.category);
    if (searchParams.city) q = q.eq("city", searchParams.city);
    if (searchParams.job_id) q = q.eq("job_id", searchParams.job_id);
    if (searchParams.has_email === "1") q = q.not("email", "is", null);
    if (searchParams.has_audit === "1") q = q.eq("audit_status", "done");
    if (searchParams.email_sent === "1") q = q.eq("email_status", "sent");
    if (searchParams.q) q = q.ilike("name", `%${searchParams.q}%`);
    q = q.range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

    const { data: leads, count } = await q;

    const { data: catRows } = await db.from("leads").select("category").not("category", "is", null).limit(500);
    const { data: cityRows } = await db.from("leads").select("city").not("city", "is", null).limit(500);
    const categories = Array.from(new Set((catRows ?? []).map((r: { category: string | null }) => r.category).filter(Boolean))).sort() as string[];
    const cities = Array.from(new Set((cityRows ?? []).map((r: { city: string | null }) => r.city).filter(Boolean))).sort() as string[];

    const total = count ?? 0;
    const pages = Math.ceil(total / PAGE_SIZE);

    return (
        <AdminShell title="Leady" subtitle={`${total} záznamov`}>
            <LeadFilters categories={categories} cities={cities} current={searchParams} />

            <div className="mt-6 overflow-x-auto rounded-2xl border border-cream/[0.08] bg-cream/[0.025]">
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
                        {((leads ?? []) as Lead[]).map((l) => (
                            <tr key={l.id} className="hover:bg-cream/[0.02]">
                                <td className="p-3 text-cream">{l.name}</td>
                                <td className="p-3 text-cream/70">{l.city || "—"}</td>
                                <td className="p-3 text-cream/70">{l.category || "—"}</td>
                                <td className="p-3">
                                    {l.website ? (
                                        <a href={l.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-gold hover:underline">
                                            <ExternalLink size={12} /> web
                                        </a>
                                    ) : <span className="text-cream/30">—</span>}
                                </td>
                                <td className="p-3 text-cream/70 font-mono text-xs">{l.email || "—"}</td>
                                <td className="p-3"><ScoreChip score={l.audit_report?.score} /></td>
                                <td className="p-3"><StatusBadge status={l.email_status} /></td>
                                <td className="p-3">
                                    <Link href={`/admin/scraper/leads/${l.id}`} className="text-gold/80 hover:text-gold text-xs">Detail →</Link>
                                </td>
                            </tr>
                        ))}
                        {(!leads || leads.length === 0) && (
                            <tr><td colSpan={8} className="p-8 text-center text-cream/40">Žiadne výsledky</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {pages > 1 && (
                <div className="mt-4 flex items-center justify-between text-sm text-cream/60">
                    <div>Strana {page + 1} / {pages}</div>
                    <div className="flex gap-2">
                        {page > 0 && (
                            <Link href={qsWith(searchParams, { page: String(page - 1) })} className="px-3 py-1 rounded border border-cream/15 hover:bg-cream/[0.04]">← Predchádzajúca</Link>
                        )}
                        {page < pages - 1 && (
                            <Link href={qsWith(searchParams, { page: String(page + 1) })} className="px-3 py-1 rounded border border-cream/15 hover:bg-cream/[0.04]">Ďalšia →</Link>
                        )}
                    </div>
                </div>
            )}
        </AdminShell>
    );
}

function qsWith(sp: SP, override: Record<string, string>): string {
    const all = { ...sp, ...override };
    const usp = new URLSearchParams();
    Object.entries(all).forEach(([k, v]) => { if (v) usp.set(k, v); });
    return `?${usp.toString()}`;
}
