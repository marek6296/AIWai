// Test send pre VARIANT B — firma bez webu.
// Vyberie reálny lead z DB, ale dočasne setuje website=null v poslanej payload
// aby sme videli ako vyzerá mail pre firmu bez webu.
// Mail ide na cmelo.marek@gmail.com (nie na klienta).

import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import OpenAI from "openai";

const LEAD_ID = process.argv[2] || "89";
const TEST_RECIPIENT = "cmelo.marek@gmail.com";

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    db: { schema: "scraper" },
    global: { headers: { "Accept-Profile": "scraper", "Content-Profile": "scraper" } },
});

const { data: lead, error } = await db.from("leads").select("*").eq("id", LEAD_ID).single();
if (error || !lead) { console.error("lead not found"); process.exit(1); }

// Simuluj firmu bez webu
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

// Inline volanie OpenAI s rovnakým prompt-om ako endpoint
const sysPrompt = (await import("fs")).readFileSync("./src/lib/scraper/haiku.ts", "utf8")
    .match(/const SYSTEM_PROMPT = `([\s\S]*?)`;/)[1]
    .replace(/\\n/g, "\n").replace(/\\\$/g, "$").replace(/\\`/g, "`");

const userPrompt = `Firma: ${lead.name}
Web: (žiadny web)
Kategória: ${lead.category || "—"}
Mesto: ${lead.location || "—"}

⚠ Táto firma NEMÁ vlastnú webovú stránku. Použi VARIANT B v sekcii 3.

AUDIT:
SLABINY:
- Firma nemá vlastnú webovú stránku

PRÍLEŽITOSŤ:
Vytvoriť aspoň jednoduchú prezentačnú stránku — dnes je to základ dôveryhodnosti, SEO a získavania zákazníkov online.

SCORE: 1/10

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

// HTML wrap (jednoduchá inline kópia)
const { wrapEmailHtml } = await import(`./src/lib/scraper/email-template.ts?t=${Date.now()}`).catch(async () => {
    // tsx môže potrebovať explicit register; fallback na surový mail bez HTML
    return { wrapEmailHtml: (b) => `<pre>${b}</pre>` };
});
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
console.log("✓ sent:", info.messageId);
