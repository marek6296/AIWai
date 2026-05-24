"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, Send, RefreshCw, Check, Loader2, Eye, Code } from "lucide-react";
import type { Lead, OutreachEmail, OutreachLogEntry } from "@/lib/scraper/types";
import { StatusBadge } from "../../components/StatusBadge";

export function OutreachPanel({ lead, outreachLog }: { lead: Lead; outreachLog: OutreachLogEntry[] }) {
    const [outreach, setOutreach] = useState<OutreachEmail | null>(lead.outreach_email);
    const [subject, setSubject] = useState(lead.outreach_email?.subject ?? "");
    const [body, setBody] = useState(lead.outreach_email?.body ?? "");
    const [emailStatus, setEmailStatus] = useState<string | null>(lead.email_status);
    const [log, setLog] = useState(outreachLog);

    const [generating, setGenerating] = useState(false);
    const [sending, setSending] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [msg, setMsg] = useState<string | null>(null);
    const [view, setView] = useState<"edit" | "preview">("edit");
    const [previewHtml, setPreviewHtml] = useState<string>("");
    const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    async function generate() {
        setErr(null); setMsg(null); setGenerating(true);
        try {
            const res = await fetch(`/api/admin/scraper/leads/${lead.id}/generate-email`, { method: "POST" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "failed");
            setOutreach(data.outreach_email);
            setSubject(data.outreach_email.subject);
            setBody(data.outreach_email.body);
            if (data.html) setPreviewHtml(data.html);
            setMsg("Email vygenerovaný (s čerstvým auditom webu).");
        } catch (e) {
            setErr(e instanceof Error ? e.message : String(e));
        } finally {
            setGenerating(false);
        }
    }

    // Debounced live preview: keď editujeme subject/body, načítaj HTML preview po 600ms
    useEffect(() => {
        if (!outreach || view !== "preview") return;
        if (previewTimer.current) clearTimeout(previewTimer.current);
        previewTimer.current = setTimeout(async () => {
            if (!subject.trim() || !body.trim()) return;
            try {
                const r = await fetch(`/api/admin/scraper/leads/${lead.id}/email-preview`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ subject, body }),
                });
                if (r.ok) setPreviewHtml(await r.text());
            } catch { /* silent */ }
        }, 600);
        return () => { if (previewTimer.current) clearTimeout(previewTimer.current); };
    }, [subject, body, outreach, view, lead.id]);

    async function send() {
        if (!lead.email) { setErr("Lead nemá email."); return; }
        if (!subject.trim() || !body.trim()) { setErr("Subject aj body musia byť vyplnené."); return; }
        if (!confirm(`Naozaj poslať na ${lead.email}?`)) return;
        setErr(null); setMsg(null); setSending(true);
        try {
            const res = await fetch(`/api/admin/scraper/leads/${lead.id}/send`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subject, body }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "failed");
            setEmailStatus("sent");
            setMsg("Email odoslaný.");
            setLog([
                {
                    id: crypto.randomUUID(),
                    lead_id: lead.id,
                    sent_at: new Date().toISOString(),
                    to_email: lead.email,
                    subject, body, status: "sent", error: null,
                },
                ...log,
            ]);
        } catch (e) {
            setErr(e instanceof Error ? e.message : String(e));
        } finally {
            setSending(false);
        }
    }

    async function markSent() {
        if (!confirm("Označiť ako odoslané ručne (bez Zoho)?")) return;
        const res = await fetch(`/api/admin/scraper/leads/${lead.id}/mark-sent`, { method: "POST" });
        if (res.ok) { setEmailStatus("sent"); setMsg("Označené ako odoslané."); }
    }

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-cream/[0.08] bg-cream/[0.025] p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg text-cream">Outreach email</h3>
                    <StatusBadge status={emailStatus} />
                </div>

                {!outreach && (
                    <button
                        onClick={generate}
                        disabled={generating || !lead.audit_report || !lead.email}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-gold/40 bg-gold/15 px-6 py-3 text-gold hover:bg-gold/25 transition disabled:opacity-40"
                    >
                        {generating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                        {generating ? "Generujem..." : "Vygeneruj email"}
                    </button>
                )}

                {!lead.audit_report && <div className="text-sm text-cream/50">Najprv treba audit (cez nový scrape).</div>}
                {!lead.email && <div className="text-sm text-cream/50">Lead nemá email — nedá sa poslať.</div>}

                {outreach && (
                    <>
                        <div className="inline-flex rounded-lg border border-cream/[0.08] bg-cream/[0.025] p-1">
                            <button
                                type="button"
                                onClick={() => setView("edit")}
                                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs transition ${view === "edit" ? "bg-gold/15 text-gold border border-gold/40" : "text-cream/55 hover:text-cream"}`}
                            >
                                <Code size={12} /> Editor
                            </button>
                            <button
                                type="button"
                                onClick={() => setView("preview")}
                                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs transition ${view === "preview" ? "bg-gold/15 text-gold border border-gold/40" : "text-cream/55 hover:text-cream"}`}
                            >
                                <Eye size={12} /> Náhľad emailu
                            </button>
                        </div>

                        {view === "edit" ? (
                            <>
                                <label className="block">
                                    <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.22em] text-cream/40">Subject</span>
                                    <input
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="w-full rounded-md bg-cream/[0.04] border border-cream/15 px-3 py-2 text-cream focus:border-gold/60 focus:outline-none"
                                    />
                                </label>
                                <label className="block">
                                    <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.22em] text-cream/40">Body</span>
                                    <textarea
                                        value={body}
                                        onChange={(e) => setBody(e.target.value)}
                                        rows={14}
                                        className="w-full rounded-md bg-cream/[0.04] border border-cream/15 px-3 py-2 text-cream font-mono text-sm focus:border-gold/60 focus:outline-none"
                                    />
                                </label>
                            </>
                        ) : (
                            <div className="space-y-2">
                                <div className="rounded-md border border-cream/[0.08] bg-char-soft/40 px-3 py-2">
                                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream/40 mb-1">Predmet</div>
                                    <div className="text-cream text-sm font-medium">{subject}</div>
                                </div>
                                <div className="rounded-md border border-cream/[0.08] bg-white overflow-hidden">
                                    {previewHtml ? (
                                        <iframe
                                            title="Email preview"
                                            srcDoc={previewHtml}
                                            className="w-full h-[600px] border-0"
                                            sandbox=""
                                        />
                                    ) : (
                                        <div className="p-8 text-center text-sm text-stone-500">Načítavam náhľad…</div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                            <button onClick={send} disabled={sending} className="inline-flex items-center gap-2 rounded-lg border border-gold/50 bg-gold/20 px-4 py-2 text-gold hover:bg-gold/30 disabled:opacity-40">
                                {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Pošli
                            </button>
                            <button onClick={generate} disabled={generating} className="inline-flex items-center gap-2 rounded-lg border border-cream/15 bg-cream/[0.04] px-4 py-2 text-cream/70 hover:text-cream disabled:opacity-40">
                                <RefreshCw size={14} /> Regeneruj
                            </button>
                            <button onClick={markSent} className="inline-flex items-center gap-2 rounded-lg border border-cream/15 bg-cream/[0.04] px-4 py-2 text-cream/70 hover:text-cream">
                                <Check size={14} /> Označiť ručne ako odoslané
                            </button>
                        </div>

                        <div className="text-[11px] text-cream/30">
                            Vygenerované: {new Date(outreach.generated_at).toLocaleString("sk-SK")} · {outreach.model}
                        </div>
                    </>
                )}

                {msg && <div className="rounded-md bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 px-3 py-2 text-sm">{msg}</div>}
                {err && <div className="rounded-md bg-red-400/10 border border-red-400/30 text-red-300 px-3 py-2 text-sm">{err}</div>}
            </div>

            <div className="rounded-2xl border border-cream/[0.08] bg-cream/[0.025] p-6">
                <h3 className="mb-3 font-display text-lg text-cream">História odoslaní</h3>
                {log.length === 0 ? (
                    <div className="text-sm text-cream/40">Zatiaľ nič neodoslané.</div>
                ) : (
                    <div className="divide-y divide-cream/[0.06]">
                        {log.map((e) => (
                            <div key={e.id} className="py-2.5">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-cream">{e.subject}</div>
                                    <StatusBadge status={e.status} />
                                </div>
                                <div className="text-[11px] text-cream/40">{new Date(e.sent_at).toLocaleString("sk-SK")} → {e.to_email}</div>
                                {e.error && <div className="text-[11px] text-red-300 mt-1">{e.error}</div>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
