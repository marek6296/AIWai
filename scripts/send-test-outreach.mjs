// Ad-hoc test: vygeneruj outreach mail pre lead 89 (Čierny Havran) a pošli na cmelo.marek@gmail.com
// Bypass admin auth — volá interné lib funkcie priamo. Zoho posiela na MAREK gmail (nie na klienta).
//
// Usage: node --env-file=.env.local scripts/send-test-outreach.mjs
//
// Pozn. načítavame TS súbory cez `tsx` ktorá je nutná v devDeps. Ak nie je, spadne.

import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

const LEAD_ID = process.argv[2] || "89";
const TEST_RECIPIENT = "cmelo.marek@gmail.com";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Missing Supabase env vars");
    process.exit(1);
}

// Načítaj lead z DB
const db = createClient(SUPABASE_URL, SUPABASE_KEY, {
    db: { schema: "scraper" },
    global: { headers: { "Accept-Profile": "scraper", "Content-Profile": "scraper" } },
});

const { data: lead, error } = await db.from("leads").select("*").eq("id", LEAD_ID).single();
if (error || !lead) {
    console.error("Lead not found:", error?.message);
    process.exit(1);
}
console.log("Lead:", lead.name, "·", lead.website);

// Volaj aiwai endpoint /generate-email cez session cookie aby sme išli rovnakým codepath ako UI
const ADMIN_TOKEN = process.env.ADMIN_AUTH_TOKEN;
const cookie = `cb_admin_session=${ADMIN_TOKEN}`;

console.log("→ generating email (GPT-4o + Claude Haiku re-audit)…");
const t0 = Date.now();
const genRes = await fetch(`http://localhost:3001/api/admin/scraper/leads/${LEAD_ID}/generate-email`, {
    method: "POST",
    headers: { Cookie: cookie },
    signal: AbortSignal.timeout(120000),
});
const genData = await genRes.json();
if (!genRes.ok) {
    console.error("generate-email failed:", genRes.status, JSON.stringify(genData));
    process.exit(1);
}
const { subject, body } = genData.outreach_email;
const html = genData.html;
console.log(`✓ generated in ${((Date.now() - t0) / 1000).toFixed(1)}s — ${body.split(/\s+/).length} slov`);
console.log("SUBJECT:", subject);
console.log("\n--- BODY ---\n" + body + "\n--- /BODY ---\n");

// Pošli cez Zoho na MAREKa (nie na lead.email — test mode)
const transport = nodemailer.createTransport({
    host: process.env.ZOHO_SMTP_HOST,
    port: Number(process.env.ZOHO_SMTP_PORT || 465),
    secure: Number(process.env.ZOHO_SMTP_PORT) === 465,
    auth: { user: process.env.ZOHO_SMTP_USER, pass: process.env.ZOHO_SMTP_PASS },
});

console.log(`→ sending TEST mail to ${TEST_RECIPIENT} (nie na ${lead.email})…`);
const info = await transport.sendMail({
    from: `"${process.env.ZOHO_FROM_NAME}" <${process.env.ZOHO_SMTP_USER}>`,
    to: TEST_RECIPIENT,
    subject: `[TEST · ${lead.name}] ${subject}`,
    text: body,
    html,
});

console.log("✓ sent — messageId:", info.messageId);
console.log("✓ accepted:", info.accepted);
console.log("\n→ Skontroluj inbox " + TEST_RECIPIENT);
