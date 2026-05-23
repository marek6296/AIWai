// Generuje SK outreach email cez Claude Haiku 4.5.

import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { Lead, OutreachEmail } from "./types";

const MODEL = "claude-haiku-4-5";

const SYSTEM_PROMPT = `Si Marek Donoval z AIWai. Píšeš krátky SK outreach email firme na základe auditu jej webu.

PRAVIDLÁ:
- Jazyk: výlučne slovenčina, správna diakritika
- Tón: priateľský, ľudský, nie útočný ani predajný
- Štruktúra: predstavenie (1 veta) → 1 konkrétna príležitosť z auditu → ponuka krátkeho hovoru/auditu (1 veta)
- Body max 130 slov
- Subject max 60 znakov, konkrétny (nie "Spolupráca" alebo "Ponuka")
- Podpis: "S pozdravom,\\nMarek Donoval\\nAIWai · aiwai.app"
- ZAKÁZANÉ: úvodné "Dobrý deň, dúfam že sa máte dobre", emoji, exclamation marks v subjecte

VÝSTUP: výlučne JSON objekt v tvare:
{"subject": "...", "body": "..."}
Žiadny markdown, žiadny prefix, žiadne \`\`\`json\`\`\` bloky.`;

export async function generateOutreachEmail(lead: Lead): Promise<OutreachEmail> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");
    if (!lead.audit_report) throw new Error("Lead has no audit_report — generate audit first");
    if (!lead.email) throw new Error("Lead has no email address");

    const client = new Anthropic({ apiKey });

    const userPrompt = `Firma: ${lead.name}
Web: ${lead.website || "—"}
Kategória: ${lead.category || "—"}
Mesto: ${lead.location || "—"}

Audit:
- Silné stránky: ${lead.audit_report.strengths.join("; ")}
- Slabiny: ${lead.audit_report.weaknesses.join("; ")}
- Príležitosť: ${lead.audit_report.opportunity}
- Score: ${lead.audit_report.score}/10

Napíš outreach email.`;

    const response = await client.messages.create({
        model: MODEL,
        max_tokens: 800,
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
