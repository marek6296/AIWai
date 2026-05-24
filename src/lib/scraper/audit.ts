// Re-audit webovej stránky pred generovaním outreach mailu.
// Robí svoj vlastný fetch (Chrome UA + Sec-Fetch headers ako Python scraper) + Claude Haiku audit.

import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { AuditReport } from "./types";

const BROWSER_HEADERS: Record<string, string> = {
    "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "sk-SK,sk;q=0.9,en;q=0.7",
    "Accept-Encoding": "gzip, deflate, br",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
};

/** Fetch HTML s timeout, vracia "" pri zlyhaní. */
export async function fetchHtml(url: string, timeoutMs = 15000): Promise<string> {
    try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), timeoutMs);
        const res = await fetch(url, { headers: BROWSER_HEADERS, signal: ctrl.signal, redirect: "follow" });
        clearTimeout(t);
        if (!res.ok) return "";
        const text = await res.text();
        if (!text || !text.toLowerCase().includes("<body")) return "";
        return text;
    } catch {
        return "";
    }
}

/** Veľmi jednoduchá extrakcia textu z HTML (bez external deps). */
export function htmlToText(html: string, maxChars = 8000): string {
    if (!html) return "";
    return html
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, maxChars);
}

const AUDIT_SYSTEM = `Si web auditor pre AIWai (slovenská digitálna agentúra). Dostaneš text webovej stránky a robíš detailný audit.

Hodnotíš tieto oblasti a ku každej môžeš pridať observation:
- VIZUÁLNY DIZAJN: modernosť, konzistencia farieb, čitateľnosť, hierarchia
- MOBIL: optimalizácia pre mobilné zariadenia
- RÝCHLOSŤ: odhadni z množstva contentu/scriptov
- SEO ZÁKLADY: title, headings, meta popis, sitemap signály
- CTA & KONVERZIA: call-to-action tlačidlá, kontaktné formuláre, viditeľnosť kontaktu
- BRANDING: konzistentný brand identity, logo, typografia
- DÔVERYHODNOSŤ: recenzie, referencie, trust signály, certifikáty
- NAVIGÁCIA: prehľadnosť menu, štruktúra
- OBSAH: kvalita textov, fotografie, multimédiá
- AI/AUTOMATIZÁCIA: chatbot, automatické odpovede (väčšina malých firiem nemá)

Vraciaš LEN JSON v tomto formáte (žiadne markdown, žiadny prefix/sufix):

{"strengths": ["3-5 konkrétnych pozorovaní silných stránok"], "weaknesses": ["3-5 konkrétnych pozorovaní slabín — vždy taktne ako 'priestor na zlepšenie'"], "opportunity": "1-2 vety — kde je najväčšia výhra (väčšinou kombinácia 2-3 vylepšení)", "score": <integer 1-10>}`;

export async function reAudit(name: string, website: string): Promise<AuditReport | null> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return null;

    const html = await fetchHtml(website);
    if (!html) return null;

    const text = htmlToText(html, 10000);
    if (!text) return null;

    try {
        const client = new Anthropic({ apiKey });
        const resp = await client.messages.create({
            model: "claude-haiku-4-5",
            max_tokens: 800,
            system: AUDIT_SYSTEM,
            messages: [{ role: "user", content: `Firma: ${name}\nWeb: ${website}\n\nObsah:\n${text}` }],
        });
        const raw = resp.content
            .filter((b): b is Anthropic.TextBlock => b.type === "text")
            .map((b) => b.text)
            .join("")
            .trim()
            .replace(/^```(?:json)?/i, "")
            .replace(/```$/, "")
            .trim();
        const parsed = JSON.parse(raw);
        return {
            strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
            weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
            opportunity: typeof parsed.opportunity === "string" ? parsed.opportunity : "",
            score: typeof parsed.score === "number" ? parsed.score : 5,
            checked_at: new Date().toISOString(),
        };
    } catch {
        return null;
    }
}

/** Spojí starý + nový audit do jedného combined report-u (pre vstup do email promptu). */
export function combineAudits(older: AuditReport | null, fresh: AuditReport | null): AuditReport | null {
    if (!older && !fresh) return null;
    if (!older) return fresh;
    if (!fresh) return older;

    const dedup = (a: string[], b: string[]) =>
        Array.from(new Set([...a, ...b].map((s) => s.trim()).filter(Boolean)));

    return {
        strengths: dedup(older.strengths, fresh.strengths),
        weaknesses: dedup(older.weaknesses, fresh.weaknesses),
        opportunity: fresh.opportunity || older.opportunity,
        score: fresh.score,
        checked_at: fresh.checked_at,
    };
}
