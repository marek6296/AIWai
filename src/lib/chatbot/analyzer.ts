/**
 * Analyzer — heuristické funkcie pre auto-tagovanie konverzácií
 * a extrakciu kontaktov (leadov) zo správ používateľa.
 *
 * Žiadne LLM volania — regex-based, zadarmo a rýchlo.
 */

import { TAG_KEYWORDS } from './knowledge';

/** Normalizuje text — lowercase, odstráni diakritiku, trim. */
function normalize(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Na základe textu všetkých user správ vyberie tagy ktoré sa v konverzácii
 * objavujú. Vracia pole normalizovaných názvov tagov (web, chatbot, ...).
 */
export function extractTags(userMessages: string[]): string[] {
    const combined = normalize(userMessages.join(' '));
    const found: string[] = [];

    for (const [tag, keywords] of Object.entries(TAG_KEYWORDS)) {
        if (keywords.some((kw) => combined.includes(kw))) {
            found.push(tag);
        }
    }

    if (found.length === 0) found.push('other');
    return found;
}

/** Email regex — štandardný format. */
const EMAIL_RE = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;

/**
 * Telefón regex — pokrýva SK/CZ formáty aj s medzerami a +421/+420.
 * Príklady: +421 902 876 198, 0902876198, +420123456789, 0912 345 678
 */
const PHONE_RE = /(?:\+?\d{3}[\s.-]?)?(?:\d[\s.-]?){8,14}\d/;

/**
 * Heuristika pre meno — hľadá "volám sa X Y", "som X", "moje meno je X"
 * a podobne. Vracia prvé rozumné meno alebo null.
 */
function extractName(text: string): string | null {
    const patterns = [
        /(?:vol[aá]m sa|som|moje meno je|meno:\s*|jmenuji se|my name is|i'm|i am)\s+([A-ZÁČĎÉĚÍĽĹŇÓÔŔŠŤÚÝŽ][a-záčďéěíľĺňóôŕšťúýž]+(?:\s+[A-ZÁČĎÉĚÍĽĹŇÓÔŔŠŤÚÝŽ][a-záčďéěíľĺňóôŕšťúýž]+)?)/,
    ];
    for (const re of patterns) {
        const m = text.match(re);
        if (m) return m[1].trim();
    }
    return null;
}

export interface ExtractedLead {
    email: string | null;
    phone: string | null;
    name: string | null;
    /** True ak aspoň jedna hodnota bola nájdená */
    hasAny: boolean;
}

/**
 * Zo všetkých user správ extrahuje prvý nájdený email, telefón a meno.
 * Nezasahuje do správ — iba číta.
 */
export function extractLead(userMessages: string[]): ExtractedLead {
    const combined = userMessages.join('\n');

    const emailMatch = combined.match(EMAIL_RE);
    const phoneMatch = combined.match(PHONE_RE);
    const name = extractName(combined);

    const email = emailMatch ? emailMatch[0] : null;
    // Phone: prefer matches that are 9+ digits (real phone numbers)
    let phone: string | null = null;
    if (phoneMatch) {
        const digits = phoneMatch[0].replace(/\D/g, '');
        if (digits.length >= 9 && digits.length <= 14) {
            phone = phoneMatch[0].trim();
        }
    }

    return {
        email,
        phone,
        name,
        hasAny: Boolean(email || phone || name),
    };
}

/**
 * Vygeneruje krátke zhrnutie "o čo klient zaujíma" na základe tagov
 * a prvej user správy. Používa sa pre lead_interest pole.
 */
export function buildInterestSummary(tags: string[], firstUserMsg: string): string {
    const tagLabels: Record<string, string> = {
        web: 'Web',
        chatbot: 'Chatbot',
        automatizacia: 'Automatizácia',
        grafika: 'Grafika / dizajn',
        marketing: 'Marketing',
        cennik: 'Cena',
        termin: 'Termín',
        podpora: 'Podpora',
        other: 'Iné',
    };

    const topics = tags
        .filter((t) => t !== 'cennik' && t !== 'termin' && t !== 'other')
        .map((t) => tagLabels[t] ?? t);

    const topicText = topics.length > 0 ? topics.join(', ') : 'Všeobecná otázka';
    const preview = firstUserMsg.slice(0, 120).trim();
    return `${topicText} — „${preview}${firstUserMsg.length > 120 ? '…' : ''}"`;
}
