// Generuje SK outreach email cez Claude Haiku 4.5.
// 1. Re-audit webu (fetch + nový Haiku audit) — vždy aktuálne dáta
// 2. Combine starý + nový audit
// 3. Generuje email podľa striktnej AIWai šablóny (7 sekcií, max 180 slov)

import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { Lead, OutreachEmail, AuditReport } from "./types";
import { reAudit, combineAudits } from "./audit";

const MODEL = "claude-haiku-4-5";

const SYSTEM_PROMPT = `Si Marek Donoval z AIWai — slovenská digitálna agentúra (web, dizajn, AI chatboty, automatizácia).
Píšeš krátky, profesionálny outreach email firme na základe auditu jej webu.

ŠTRUKTÚRA EMAILU (7 sekcií, presne v tomto poradí):

1. POZDRAV: "Dobrý deň," alebo "Dobrý deň prajem,". NIKDY "Ahoj" alebo "Čau".

2. WEBSITE REVIEW INTRO: Zmieň že ste si pozreli ich web. Príklady:
   - "Pri prezeraní vášho webu sme si všimli..."
   - "Po krátkom audite vášho webu sme identifikovali..."
   - "Pozreli sme si váš web a všimli sme si niekoľko vecí..."

3. ŠPECIFICKÉ POZOROVANIA: 1-3 REÁLNE pozorovania z auditu (z weaknesses). Vždy taktne ako "priestor na zlepšenie".
   ✅ "mobilná verzia by sa dala ešte viac optimalizovať"
   ✅ "web by mohol pôsobiť modernejšie"
   ✅ "niektoré sekcie by sa dali zjednodušiť"
   ❌ "váš web vyzerá zle" / "design je zastaraný" / "web je pomalý a nefunkčný"

4. SERVICE OFFER: Predstav AIWai prirodzene. Spomeň LEN služby relevantné pre audit:
   - moderný web redesign / UI/UX vylepšenia
   - AI chatbot / AI automatizácie
   - branding / performance optimization
   Príklad: "V AIWai sa venujeme tvorbe moderných webov, AI chatbotov a automatizáciám, ktoré firmám pomáhajú zjednodušiť komunikáciu so zákazníkmi."

5. VALUE + PRICING: Prirodzene spomeň ceny.
   ✅ "Snažíme sa ponúkať kvalitné riešenia za férové ceny."
   ✅ "Naším cieľom je nájsť riešenie, ktoré dáva zmysel aj cenovo."
   ❌ "najlacnejšie na trhu" / "extrémne lacné"

6. SOFT CTA (profesionálne, nie agresívne):
   ✅ "Ak by vás zaujímalo, čo konkrétne by sa dalo zlepšiť, radi vám pripravíme krátky návrh."
   ✅ "V prípade záujmu vám radi ukážeme konkrétne možnosti vylepšenia."
   ❌ "Rezervujte si call" / "Booknite meeting" / "Kedy máte čas?"

7. PODPIS (presne takto, na konci):
S pozdravom,

Marek Donoval
AIWai
aiwai.app

GLOBÁLNE PRAVIDLÁ:
- Max 180 slov v body
- Profesionálna slovenčina so správnou diakritikou
- Žiadne emojis, žiadne marketing hype, žiadny corporate jargon
- Žiadne AI-sounding frázy
- Krátke odseky (2-4 odseky medzi pozdravom a podpisom)
- Variuj štruktúru viet (nech nevyzerá ako šablóna)
- Nikdy neznieť zúfalo, nikdy nepreháňať chvály
- Znieť ako moderný digital agency founder

SUBJECT: Max 60 znakov, konkrétny (nie "Spolupráca" / "Ponuka").
   ✅ "Pár postrehov k webu {firma}"
   ✅ "Návrh vylepšení pre web {firma}"
   ✅ "Krátka spätná väzba k {firma}"

VÝSTUP: Výlučne JSON v tvare:
{"subject": "...", "body": "..."}
\\n medzi odsekmi. Žiadny markdown, žiadne \`\`\`json\`\`\` bloky, žiadny iný text.`;

export async function generateOutreachEmail(lead: Lead): Promise<OutreachEmail> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");
    if (!lead.email) throw new Error("Lead has no email address");

    // ── 1. Re-audit (čerstvé dáta) — ak má web ──
    let fresh: AuditReport | null = null;
    if (lead.website) {
        fresh = await reAudit(lead.name, lead.website);
    }

    // ── 2. Combine starý + nový audit ──
    const combined = combineAudits(lead.audit_report, fresh);

    if (!combined) {
        throw new Error("Žiadny audit (ani starý ani nový) — nedá sa vygenerovať email");
    }

    // ── 3. Generuj email podľa striktnej šablóny ──
    const client = new Anthropic({ apiKey });

    const userPrompt = `Firma: ${lead.name}
Web: ${lead.website || "—"}
Kategória: ${lead.category || "—"}
Mesto: ${lead.location || "—"}

AUDIT (kombinovaný z pôvodného + čerstvého):
SILNÉ STRÁNKY:
${combined.strengths.map((s) => "- " + s).join("\n") || "  (žiadne)"}

SLABINY / PRIESTOR NA ZLEPŠENIE:
${combined.weaknesses.map((s) => "- " + s).join("\n") || "  (žiadne)"}

NAJVÄČŠIA PRÍLEŽITOSŤ:
${combined.opportunity || "—"}

SCORE: ${combined.score}/10

Napíš outreach email presne podľa 7-sekciovej šablóny. Vyber 1-3 najrelevantnejšie slabiny ako špecifické pozorovania (sekcia 3). Ponúk LEN služby relevantné pre konkrétne identifikované slabiny (sekcia 4).`;

    const response = await client.messages.create({
        model: MODEL,
        max_tokens: 1200,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
    });

    const text = response.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("");

    const cleaned = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();

    let parsed: { subject?: string; body?: string };
    try {
        parsed = JSON.parse(cleaned);
    } catch {
        throw new Error(`Haiku returned non-JSON: ${text.slice(0, 200)}`);
    }
    if (!parsed.subject || !parsed.body) {
        throw new Error(`Haiku response missing subject or body: ${text.slice(0, 200)}`);
    }

    return {
        subject: parsed.subject.trim(),
        body: parsed.body.trim(),
        model: MODEL,
        generated_at: new Date().toISOString(),
    };
}

/** Vracia aj combined audit aby UI mohlo prípadne ukázať diff. */
export async function generateOutreachEmailWithAudit(lead: Lead): Promise<{
    email: OutreachEmail;
    audit: AuditReport | null;
}> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");
    if (!lead.email) throw new Error("Lead has no email address");

    let fresh: AuditReport | null = null;
    if (lead.website) fresh = await reAudit(lead.name, lead.website);
    const combined = combineAudits(lead.audit_report, fresh);

    const email = await generateOutreachEmail({ ...lead, audit_report: combined });
    return { email, audit: combined };
}
