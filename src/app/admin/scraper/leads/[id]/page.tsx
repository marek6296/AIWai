import { notFound } from "next/navigation";
import AdminShell from "@/app/admin/components/AdminShell";
import { scraperDb } from "@/lib/scraper/supabase-server";
import { AuditCard } from "../../components/AuditCard";
import { OutreachPanel } from "./OutreachPanel";
import { ExternalLink, MapPin } from "lucide-react";
import type { Lead, OutreachLogEntry } from "@/lib/scraper/types";

export const dynamic = "force-dynamic";

export default async function LeadDetail({ params }: { params: { id: string } }) {
    const db = scraperDb();
    const { data: lead } = await db.from("leads").select("*").eq("id", params.id).single();
    if (!lead) notFound();
    const { data: log } = await db.from("outreach_log").select("*").eq("lead_id", params.id).order("sent_at", { ascending: false });

    const l = lead as Lead;
    const mapsQuery = encodeURIComponent(`${l.name} ${l.location || ""}`);

    return (
        <AdminShell title={l.name} subtitle={`${l.location || "—"} · ${l.category || "—"}`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <div className="rounded-2xl border border-cream/[0.08] bg-cream/[0.025] p-6 space-y-3">
                        <Row label="Web">
                            {l.website ? (
                                <a href={l.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-gold hover:underline">
                                    {l.website} <ExternalLink size={12} />
                                </a>
                            ) : "—"}
                        </Row>
                        <Row label="Email"><span className="font-mono text-sm">{l.email || "—"}</span></Row>
                        <Row label="Maps">
                            <a href={`https://www.google.com/maps/search/${mapsQuery}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-cream/70 hover:text-cream">
                                <MapPin size={12} /> Otvor v mapách
                            </a>
                        </Row>
                    </div>
                    <AuditCard report={l.audit_report} />
                </div>

                <div>
                    <OutreachPanel
                        lead={l}
                        outreachLog={(log ?? []) as OutreachLogEntry[]}
                    />
                </div>
            </div>
        </AdminShell>
    );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-baseline gap-3">
            <div className="w-16 shrink-0 font-mono text-[10px] uppercase tracking-[0.22em] text-cream/40">{label}</div>
            <div className="text-cream">{children}</div>
        </div>
    );
}
