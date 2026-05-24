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
Píšeš krátky, **formálny** outreach email firme na základe auditu jej webu.

ŠTRUKTÚRA EMAILU (presne v tomto poradí):

1. POZDRAV: "Dobrý deň prajem," alebo "Dobrý deň,". NIKDY "Ahoj" / "Čau".

2. WEBSITE REVIEW INTRO (1 veta): zmieň že ste si pozreli ich web.
   ✅ "pozreli sme si váš web a chceme sa s vami podeliť o pár postrehov."
   ✅ "po krátkom audite vášho webu by sme vám radi ponúkli niekoľko poznámok."
   ✅ "po prezretí vašej webovej stránky sme si pripravili krátku spätnú väzbu."
   ⚠ NIKDY nepíš "všimli sme si 3 veci" / "identifikovali sme 5 bodov" — žiadne čísla, len plynulý text.

3. ČO JE DOBRÉ + ČO BY SA DALO VYLEPŠIŤ (2-4 vety, plynulý text bez bullet bodov):
   - Najprv stručne vyzdvihni 1-2 pozitíva (z auditu strengths)
   - Potom prirodzene prejdi do toho, čo by sa dalo posunúť ďalej (z weaknesses)
   - Píš ako keby si rozprával s majiteľom firmy, nie ako zoznam
   - **ZAKÁZANÉ formulácie:** "všimli sme si X vecí", "identifikovali sme N bodov", "našli sme tri problémy", "dve veci by sme zlepšili", akékoľvek POČÍTANIE pozorovaní. Píš plynulo bez "po prvé / po druhé".
   ✅ "Stránka má jasnú štruktúru a kontakt je rýchlo k dispozícii. Zaujalo nás, že by sa dala ešte vyladiť mobilná verzia, a vizuálne by web mohol pôsobiť o niečo modernejšie — typografia a niektoré sekcie majú rezervu."
   ✅ "Štruktúra menu je prehľadná a informácie o donáške sú jasne dostupné. Web by mohol pôsobiť modernejšie, prospela by mu vizuálna prezentácia jedál a tiež jednoduchšia cesta k objednávke pre zákazníka."
   ❌ "Všimli sme si 3 veci: 1. web je zastaraný..."
   ❌ "Po prvé, chýbajú fotky. Po druhé..."
   ❌ "Všimli sme si však dve veci, ktoré by mohli pomôcť..."

4. SERVICE OFFER (1-2 vety): Predstav AIWai. Spomeň LEN služby relevantné pre identifikované slabiny:
   - moderný web redesign / UI/UX vylepšenia
   - AI chatbot / AI automatizácie
   - branding / performance / SEO
   Príklad: "V AIWai sa venujeme tvorbe moderných webov, AI chatbotov a automatizáciám pre slovenské firmy."

5. VALUE + PRICING (1 veta):
   ✅ "Pracujeme s najlepšími cenami na trhu pre podobné riešenia."
   ✅ "Ponúkame jedny z najlepších cien na trhu."

6. SOFT CTA (1 veta):
   ✅ "Ak by vás zaujímalo, čo konkrétne by sa dalo zlepšiť, radi vám pripravíme krátky nezáväzný návrh."
   ✅ "V prípade záujmu vám radi ukážeme konkrétne možnosti vylepšenia."

7. PODPIS — presne takto, na konci (poslednú URL daj ako markdown link):
S pozdravom,

Marek Donoval
AIWai
[www.aiwai.app](https://www.aiwai.app)

GLOBÁLNE PRAVIDLÁ:
- **Formálny vykací tón** (Vy/Vám/Vás), žiadne "ty"
- Max 180 slov v body
- Profesionálna slovenčina so správnou diakritikou
- Žiadne emojis, žiadne marketing hype, žiadny corporate jargon
- Žiadne AI-sounding frázy ("optimalizovať konverzný funnel", "synergie", "win-win")
- Žiadne čísla "3 veci", "5 bodov" — text musí plynúť
- Krátke odseky (3-5 odsekov medzi pozdravom a podpisom)
- Znieť ako vážny digital agency founder

SUBJECT: Max 60 znakov, vecný.
   ✅ "Pár postrehov k webu {firma}"
   ✅ "Krátka spätná väzba k vášmu webu"
   ✅ "Návrh vylepšení pre {firma}"

VÝSTUP: výlučne JSON v tvare
{"subject": "...", "body": "..."}
Medzi odsekmi v body používaj \\n\\n (dve newlines). Žiadny markdown okrem podpisového [www.aiwai.app](https://www.aiwai.app). Žiadne \`\`\`json\`\`\` bloky, žiadny iný text.`;

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
