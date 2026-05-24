// Generuje SK outreach email cez OpenAI GPT (model gpt-4o). Re-audit zostáva Claude Haiku 4.5.
// Workflow:
// 1. Re-audit webu (fetch + Claude Haiku audit) — vždy aktuálne dáta
// 2. Combine starý + nový audit (deduplikácia)
// 3. GPT napíše email podľa striktnej AIWai šablóny
//
// Súbor sa stále volá `haiku.ts` lebo `audit.ts` import a `route.ts` import nezmenené, len model
// pre GENERÁCIU emailu = OpenAI. Audit (`audit.ts`) používa Claude Haiku.

import "server-only";
import OpenAI from "openai";
import type { Lead, OutreachEmail, AuditReport } from "./types";
import { reAudit, combineAudits } from "./audit";

const EMAIL_MODEL = "gpt-4o";

const SYSTEM_PROMPT = `Si Marek Donoval z AIWai — slovenská digitálna agentúra (web, dizajn, AI chatboty, automatizácia).
Píšeš krátky, **formálny** outreach email firme na základe auditu jej webu.

ŠTRUKTÚRA EMAILU (presne v tomto poradí):

1. POZDRAV: "Dobrý deň prajem," alebo "Dobrý deň,". NIKDY "Ahoj" / "Čau".

2. INTRO (1 veta) — závisí od toho či má firma web:

   ── Ak firma MÁ web (VARIANT A): ──
   ✅ "pozreli sme si váš web a chceli by sme sa s vami podeliť o pár poznámok."
   ✅ "pozreli sme si vašu webovú stránku a chceli by sme sa s vami podeliť o pár postrehov."

   ── Ak firma NEMÁ web (VARIANT B): ──
   ✅ "narazili sme na vašu firmu a chceli by sme sa s vami podeliť o pár myšlienok."
   ✅ "našli sme vašu firmu cez Google Maps a chceli by sme vám napísať pár slov."
   ❗ NESPOMÍNAJ "pozreli sme si váš web" ak firma web NEMÁ — to nedáva zmysel.

   ⚠ NIKDY nepíš "ponúknuť poznámky", "ponúkli niekoľko poznámok" — TO NEDÁVA ZMYSEL po slovensky. Poznámky sa **zdieľajú**, nie ponúkajú.
   ⚠ NIKDY nepíš "po krátkom audite" — znie príliš formálne/cudzie.
   ⚠ NIKDY nepíš "všimli sme si 3 veci" / "identifikovali sme 5 bodov" — žiadne čísla, len plynulý text.

3. OBSAH ZÁVISÍ OD TOHO ČI MAJÚ WEB:

   ── VARIANT A — firma MÁ webovú stránku (audit obsahuje strengths/weaknesses) ──
   Plynulý text 2-4 vety:
   - Najprv stručne vyzdvihni 1-2 pozitíva (z audit strengths, BEZ zakázaných tém)
   - Potom prirodzene prejdi do toho, čo by sa dalo posunúť ďalej (z weaknesses, BEZ zakázaných tém)
   - Píš ako keby si rozprával s majiteľom firmy, nie ako zoznam
   - **ZAKÁZANÉ formulácie:** "všimli sme si X vecí", "identifikovali sme N bodov", "našli sme tri problémy", "dve veci by sme zlepšili", akékoľvek POČÍTANIE. Žiadne "po prvé / po druhé".
   ✅ "Stránka má jasnú štruktúru a kontakt je rýchlo k dispozícii. Zaujalo nás, že by sa dala ešte vyladiť mobilná verzia, a vizuálne by web mohol pôsobiť o niečo modernejšie — typografia a niektoré sekcie majú rezervu."

   ── VARIANT B — firma NEMÁ webovú stránku (audit má 'no_website: true' alebo weaknesses obsahuje "nemá vlastnú web stránku") ──
   Napíš empaticky 3-4 vety v tomto duchu:
   "všimli sme si, že vaša firma zatiaľ nemá vlastnú webovú stránku. V dnešnej dobe je práve web najsilnejším marketingovým nástrojom — zákazník vás cez Google nájde, vidí čo robíte, môže si rezervovať, objednať alebo vás priamo kontaktovať. Bez stránky vám utekajú zákazníci ku konkurencii ktorá ju má. Radi by sme vám preto ponúkli moderné riešenie šité na vašu firmu."
   Variuj formulácie, ale **vždy zdôrazni**:
   - Web = nepretržitá prezentácia 24/7
   - Buduje dôveryhodnosť (firma bez webu = vyzerá menej profi)
   - Privedie nových zákazníkov (Google, mapy, sociálne siete)
   - Šetrí čas (informácie, ceny, formuláre online namiesto telefonátov)

🚫 **ZAKÁZANÉ TÉMY — NIKDY ich nespomínaj v emaile:**
   - FOTKY / fotografie / vizuály / obrázky / foto / snímky / galérie / pictures / photos
   - RECENZIE / testimonials / hodnotenia zákazníkov / referenčné citáty / reviews
   - TECHNICKÉ CHYBY / PHP warning / JS error / 404 / bugy / debug správy — klient nevie čo to je a znie negatívne
   Aj keď audit tieto témy spomína, **úplne ich vynechaj**.
   Namiesto toho spomeň iné vylepšenia: moderný dizajn, štruktúru, rýchlosť, SEO, mobilnú verziu, branding, prehľadné CTA, dôveryhodnosť cez profesionálny vzhľad, AI chatbot, online objednávky, automatizácie.

4. SERVICE OFFER + ČO ROBÍME (formátovaný blok):
   Krátka úvodná veta (1 veta) a potom **vždy** ponúkni tieto 4 oblasti AIWai ako bullet list (každý riadok začni "- "):

   "V AIWai pomáhame slovenským firmám rásť cez kvalitnú digitálnu prezentáciu. Moderná webová stránka dnes priťahuje nových zákazníkov, buduje dôveru a šetrí čas pri komunikácii — preto je často prvý a najdôležitejší kanál. Ponúkame:

   - **Webové stránky** — moderné weby a e-shopy na mieru, ktoré reálne privádzajú zákazníkov
   - **Grafiku a branding** — logo, vizuálna identita, profesionálny vzhľad značky
   - **AI chatboty** — automatické odpovede na webe či Messengeri 24/7
   - **AI automatizácie procesov** — šetria čas pri objednávkach, komunikácii a administratíve

   {pre variant A: 'Z toho čo sme videli na vašom webe by sme začali s ...'}
   {pre variant B: 'Začali by sme práve modernou webovou stránkou, ktorá vám otvorí dvere k novým zákazníkom.'}"

   ➡ Použi presne tento formát (úvod-2 vety, prázdny riadok, 4 bullety s "- " a **bold** prvými 2-3 slovami, prázdny riadok, jedna nasledujúca veta s odporúčaním).

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
- Max 240 slov v body (vrátane bullet listu so službami)
- Profesionálna slovenčina so správnou diakritikou
- Žiadne emojis, žiadny marketing hype, žiadny corporate jargon
- Žiadne AI-sounding frázy ("optimalizovať konverzný funnel", "synergie", "win-win", "leverage")
- Krátke odseky (3-5 odsekov medzi pozdravom a podpisom)
- Znieť ako vážny digital agency founder

SUBJECT: Max 60 znakov, vecný (žiadne "Spolupráca"/"Ponuka").
   ✅ "Pár postrehov k webu {firma}"
   ✅ "Krátka spätná väzba k vášmu webu"
   ✅ "Návrh vylepšení pre {firma}"

VÝSTUP: výlučne JSON objekt v tvare
{"subject": "...", "body": "..."}
Body je obyčajný viacriadkový text — medzi odsekmi nechaj **prázdny riadok** (newline znak, NIE literálny text "\\n").
Povolený markdown v body:
  - bullet listy začínajúce "- " (jeden bullet per riadok, prázdny riadok pred listom a po liste)
  - **bold** pomocou dvojitých hviezdičiek (len v bulletoch pre názov služby)
  - [text](url) hyperlinks (len v podpise pre www.aiwai.app)
Žiadne \`\`\`json\`\`\` bloky, žiadny iný markdown (žiadne #, *, _, >).`;

/** Odfiltruje zakázané témy pred odoslaním do email promptu. */
const FORBIDDEN_RE = /\b(fotk|fotograf|vizu[aá]l|obrázk|foto|sn[ií]m|picture|photo|images?|gallery|galéri|recenz|review|testimonial|hodnoten[ií]|referenc[ií]|warning|warn\b|chyb[ay]|chyba|error|404|debug|php|bug)/i;

function stripForbiddenMentions(items: string[]): string[] {
    return items.filter((s) => !FORBIDDEN_RE.test(s));
}

export async function generateOutreachEmail(lead: Lead): Promise<OutreachEmail> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY not configured");
    if (!lead.email) throw new Error("Lead has no email address");
    if (!lead.audit_report) throw new Error("Žiadny audit — nedá sa vygenerovať email");

    const audit = lead.audit_report;

    // Odfiltruj zakázané témy (fotky, recenzie) aby ich GPT nemal kde vidieť
    const cleanWeaknesses = stripForbiddenMentions(audit.weaknesses);
    const cleanStrengths = stripForbiddenMentions(audit.strengths);
    const cleanOpportunity = FORBIDDEN_RE.test(audit.opportunity || "")
        ? "" // ak je opportunity o zakázaných témach, vynecháme ju
        : audit.opportunity;

    const client = new OpenAI({ apiKey });

    // Detekcia: má firma webovú stránku?
    const noWebsite = !lead.website || lead.audit_status === "no_website" ||
        (audit as { no_website?: boolean }).no_website === true;

    const variantHint = noWebsite
        ? `⚠ Táto firma NEMÁ vlastnú webovú stránku. Použi VARIANT B v sekcii 3 (empaticky vysvetli prečo je web v dnešnej dobe kľúčový a ponúkni naše riešenie).`
        : `Táto firma má webovú stránku ${lead.website}. Použi VARIANT A v sekcii 3 (1-2 pozitíva + plynulý priestor na zlepšenie zo SLABÍN, BEZ zakázaných tém).`;

    const userPrompt = `Firma: ${lead.name}
Web: ${lead.website || "(žiadny web)"}
Kategória: ${lead.category || "—"}
Mesto: ${lead.location || "—"}

${variantHint}

AUDIT WEBU:
SILNÉ STRÁNKY:
${cleanStrengths.map((s) => "- " + s).join("\n") || "  (žiadne)"}

SLABINY / PRIESTOR NA ZLEPŠENIE:
${cleanWeaknesses.map((s) => "- " + s).join("\n") || "  (žiadne)"}

${cleanOpportunity ? `PRÍLEŽITOSŤ:\n${cleanOpportunity}\n` : ""}
SCORE: ${audit.score}/10

Napíš outreach email presne podľa šablóny. Vyber 1-3 najrelevantnejšie body ako plynulé pozorovania v sekcii 3 (BEZ zakázaných tém: fotky, recenzie, technické chyby/warningy/PHP/error). Sekcia 4 vždy obsahuje bullet list všetkých 4 služieb.`;

    const response = await client.chat.completions.create({
        model: EMAIL_MODEL,
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1200,
        response_format: { type: "json_object" },
    });

    const text = response.choices[0]?.message?.content || "";
    let parsed: { subject?: string; body?: string };
    try {
        parsed = JSON.parse(text);
    } catch {
        throw new Error(`GPT returned non-JSON: ${text.slice(0, 200)}`);
    }
    if (!parsed.subject || !parsed.body) {
        throw new Error(`GPT response missing subject or body: ${text.slice(0, 200)}`);
    }

    // Normalize: ak GPT vráti literálne "\\n" namiesto \n znakov, prelož ich
    const bodyText = parsed.body
        .replace(/\\n/g, "\n")
        .replace(/\r\n/g, "\n")
        .trim();

    return {
        subject: parsed.subject.trim(),
        body: bodyText,
        model: EMAIL_MODEL,
        generated_at: new Date().toISOString(),
    };
}

/** Re-audit (Claude Haiku) + email (GPT). Vracia oboje. */
export async function generateOutreachEmailWithAudit(lead: Lead): Promise<{
    email: OutreachEmail;
    audit: AuditReport | null;
}> {
    if (!lead.email) throw new Error("Lead has no email address");

    let fresh: AuditReport | null = null;
    if (lead.website) fresh = await reAudit(lead.name, lead.website);
    const combined = combineAudits(lead.audit_report, fresh);

    if (!combined) {
        throw new Error("Žiadny audit (ani starý ani nový) — nedá sa vygenerovať email");
    }

    const email = await generateOutreachEmail({ ...lead, audit_report: combined });
    return { email, audit: combined };
}
