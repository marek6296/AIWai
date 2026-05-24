// Test send pre VARIANT B — firma bez webu.
// Generuje mail cez OpenAI s identickým prompt-om ako aiwai endpoint, wrapuje do HTML
// (kópia email-template.ts inline aby fungovala bez tsx loaderu) a pošle na cmelo.marek@gmail.com.

import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import OpenAI from "openai";
import { readFileSync } from "fs";

const LEAD_ID = process.argv[2] || "89";
const TEST_RECIPIENT = "cmelo.marek@gmail.com";

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    db: { schema: "scraper" },
    global: { headers: { "Accept-Profile": "scraper", "Content-Profile": "scraper" } },
});

const { data: lead, error } = await db.from("leads").select("*").eq("id", LEAD_ID).single();
if (error || !lead) { console.error("lead not found"); process.exit(1); }

// Override na no-website mód
lead.website = null;
lead.audit_status = "no_website";
lead.audit_report = {
    strengths: [],
    weaknesses: ["Firma nemá vlastnú webovú stránku"],
    opportunity: "Vytvoriť aspoň jednoduchú prezentačnú stránku — dnes je to základ dôveryhodnosti, SEO a získavania zákazníkov online.",
    score: 1,
    checked_at: new Date().toISOString(),
    no_website: true,
};

console.log(`Test VARIANT B (no website) pre lead: ${lead.name}`);

// Extrahuj SYSTEM_PROMPT zo zdrojového haiku.ts
const haikuSrc = readFileSync("./src/lib/scraper/haiku.ts", "utf8");
const sysMatch = haikuSrc.match(/const SYSTEM_PROMPT = `([\s\S]*?)`;/);
if (!sysMatch) { console.error("SYSTEM_PROMPT not found"); process.exit(1); }
const sysPrompt = sysMatch[1].replace(/\\`/g, "`").replace(/\\\$/g, "$");

const userPrompt = `Firma: ${lead.name}
Web: (žiadny web)
Kategória: ${lead.category || "—"}
Mesto: ${lead.location || "—"}

⚠ Táto firma NEMÁ vlastnú webovú stránku. Použi VARIANT B v sekcii 2 a 3.

AUDIT:
SLABINY:
- Firma nemá vlastnú webovú stránku

PRÍLEŽITOSŤ:
${lead.audit_report.opportunity}

SCORE: ${lead.audit_report.score}/10

Napíš outreach email. Použi VARIANT B (firma bez webu). Sekcia 4 vždy obsahuje bullet list všetkých 4 služieb.`;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const t0 = Date.now();
const resp = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "system", content: sysPrompt }, { role: "user", content: userPrompt }],
    temperature: 0.7,
    max_tokens: 1200,
    response_format: { type: "json_object" },
});
const parsed = JSON.parse(resp.choices[0].message.content);
console.log(`✓ generated in ${((Date.now() - t0) / 1000).toFixed(1)}s — ${parsed.body.split(/\s+/).length} slov`);
console.log("SUBJECT:", parsed.subject);
console.log("\n--- BODY ---\n" + parsed.body + "\n--- /BODY ---\n");

// ── HTML wrap (inline kópia email-template.ts) ──
function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function escapeAttr(s) {
    return s.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function renderInline(p) {
    let out = escapeHtml(p).replace(/\n/g, "<br>");
    out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) =>
        `<a href="${escapeAttr(u)}" style="color:#C9A875;text-decoration:none;border-bottom:1px solid rgba(201,168,117,0.4);">${t}</a>`);
    out = out.replace(/\*\*([^*]+)\*\*/g, (_, t) => `<strong style="color:#f5edda;font-weight:600;">${t}</strong>`);
    return out;
}
function renderBullet(text) {
    return `<li style="margin:0 0 10px;padding:0 0 0 22px;position:relative;color:#f5edda;font-size:15px;line-height:1.6;list-style:none;">
  <span style="position:absolute;left:0;top:9px;display:inline-block;width:6px;height:6px;border-radius:50%;background:#C9A875;"></span>
  ${renderInline(text)}
</li>`;
}
function wrapEmailHtml(body, subject) {
    const paragraphs = body.trim().split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
    const bodyHtml = paragraphs.map((p) => {
        const isSig = /S pozdravom,/i.test(p) && /AIWai/i.test(p);
        if (isSig) {
            const lines = p.split(/\n/).map((l) => l.trim()).filter(Boolean);
            return `<p style="margin:32px 0 0;color:#a89868;font-size:14px;line-height:1.7;">${lines.map((l, i) => {
                const mdLink = l.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
                if (mdLink) return `<a href="${escapeAttr(mdLink[2])}" style="color:#C9A875;text-decoration:none;border-bottom:1px solid rgba(201,168,117,0.4);">${escapeHtml(mdLink[1])}</a>`;
                if (i === 0) return `<span style="color:#8c826a;">${escapeHtml(l)}</span><br><br>`;
                if (/^Marek Donoval$/i.test(l)) return `<strong style="color:#f5edda;font-size:16px;font-weight:600;">${escapeHtml(l)}</strong><br>`;
                if (/^AIWai$/i.test(l)) return `<span style="color:#C9A875;font-weight:600;letter-spacing:0.06em;font-size:14px;">${escapeHtml(l)}</span><br>`;
                return `${escapeHtml(l)}<br>`;
            }).join("")}</p>`;
        }
        if (/^-\s/m.test(p) && p.split(/\n/).every((l) => /^-\s/.test(l.trim()) || !l.trim())) {
            const items = p.split(/\n/).map((l) => l.trim().replace(/^-\s*/, "")).filter(Boolean);
            return `<ul style="margin:0 0 20px;padding:0;list-style:none;">${items.map(renderBullet).join("")}</ul>`;
        }
        return `<p style="margin:0 0 20px;color:#f5edda;font-size:15.5px;line-height:1.7;">${renderInline(p)}</p>`;
    }).join("\n");
    return `<!DOCTYPE html><html lang="sk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark light"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#f5edda;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0a0a0f;"><tr><td align="center" style="padding:40px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;background:#0e0e14;border:1px solid rgba(201,168,117,0.18);border-radius:18px;overflow:hidden;box-shadow:0 8px 40px -12px rgba(0,0,0,0.7),0 0 60px -20px rgba(201,168,117,0.15);">
<tr><td style="height:2px;background:linear-gradient(90deg,transparent,#C9A875 40%,#C9A875 60%,transparent);font-size:0;line-height:0;">&nbsp;</td></tr>
<tr><td style="padding:32px 40px 22px;border-bottom:1px solid rgba(245,237,218,0.06);background:#0e0e14;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td valign="middle"><a href="https://www.aiwai.app" style="text-decoration:none;display:inline-block;"><img src="https://aiwai.app/logo-v2.png" alt="AIWai" width="96" height="42" style="display:block;border:0;height:auto;max-width:100%;object-fit:contain;"></a></td>
<td valign="middle" align="right" style="font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;font-style:italic;color:#a89868;line-height:1.4;max-width:240px;">Vy riešite biznis,<br>my riešime všetko digitálne.</td>
</tr></table></td></tr>
<tr><td style="padding:34px 40px 38px;background:#0e0e14;">${bodyHtml}</td></tr>
<tr><td style="padding:22px 40px 28px;border-top:1px solid rgba(245,237,218,0.06);background:#0a0a0f;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;font-size:11px;color:#7a7160;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td><a href="https://www.aiwai.app" style="color:#C9A875;text-decoration:none;">www.aiwai.app</a><span style="color:#3c3a32;">  ·  </span><a href="mailto:marek@aiwai.app" style="color:#C9A875;text-decoration:none;">marek@aiwai.app</a></td>
<td align="right" style="color:#7a7160;letter-spacing:0.22em;text-transform:uppercase;font-size:10px;">Slovensko</td>
</tr></table></td></tr>
</table>
<p style="margin:18px 0 0;color:#5c5448;font-size:11px;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;">Tento e-mail bol odoslaný individuálne. Ak nechcete byť kontaktovaný/-á, jednoducho neodpovedajte.</p>
</td></tr></table></body></html>`;
}

const html = wrapEmailHtml(parsed.body, parsed.subject);

const transport = nodemailer.createTransport({
    host: process.env.ZOHO_SMTP_HOST,
    port: Number(process.env.ZOHO_SMTP_PORT),
    secure: true,
    auth: { user: process.env.ZOHO_SMTP_USER, pass: process.env.ZOHO_SMTP_PASS },
});
const info = await transport.sendMail({
    from: `"${process.env.ZOHO_FROM_NAME}" <${process.env.ZOHO_SMTP_USER}>`,
    to: TEST_RECIPIENT,
    subject: `[TEST · NO-WEB · ${lead.name}] ${parsed.subject}`,
    text: parsed.body,
    html,
});
console.log("✓ sent (dark HTML wrap):", info.messageId);
