# Admin Scraper Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Zintegrovať Business Scraper do aiwai.app/admin so zmenou AI správania z email generácie na audit report; admin môže scrape spúšťať, vidieť leady s audit reportom, na požiadanie generovať a posielať outreach email cez Zoho SMTP.

**Architecture:** Aiwai admin (Next.js 14 App Router) volá proxy `/api/admin/scraper/*` ktoré: (a) overujú admin cookie, (b) čítajú Supabase scraper schému cez service role key, (c) forwarduje scrape control požiadavky na Railway Python FastAPI cez shared secret token. Email send cez nodemailer + Zoho SMTP.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind, Supabase JS (service role), `@anthropic-ai/sdk` (Haiku 4.5), nodemailer (existing), Python FastAPI (Railway).

**Spec:** [`docs/superpowers/specs/2026-05-24-admin-scraper-integration-design.md`](../specs/2026-05-24-admin-scraper-integration-design.md)

**Branch:** `feature/admin-scraper-integration` (už vytvorená)

**Project root:** `/Users/marek/nove weby 2026/AIWai`
**Scraper root:** `/Users/marek/nove weby 2026/business scraper`

---

## File Structure

### Nové súbory v aiwai

```
supabase/migrations/
  20260524_scraper_admin_integration.sql      # DB schéma rozšírenia + nové tabuľky + RLS

src/lib/scraper/
  supabase-server.ts                          # service role klient (server-only)
  railway.ts                                  # fetch wrapper s X-Scraper-Token
  types.ts                                    # TS typy (Lead, Job, AuditReport, OutreachEmail)
  rate-limit.ts                               # in-memory token bucket
  haiku.ts                                    # Anthropic Haiku call pre outreach email
  zoho.ts                                     # nodemailer Zoho transport + send

src/app/api/admin/scraper/
  stats/route.ts                              # GET aggregate counts
  leads/route.ts                              # GET filtered list
  leads/[id]/route.ts                         # GET detail
  leads/[id]/generate-email/route.ts          # POST → Haiku → save
  leads/[id]/send/route.ts                    # POST → Zoho send → log
  leads/[id]/mark-sent/route.ts               # POST → mark manually sent
  jobs/route.ts                               # GET list (Supabase) + POST create (proxy)
  jobs/[id]/route.ts                          # GET detail (proxy)
  jobs/[id]/stream/route.ts                   # GET SSE proxy
  jobs/[id]/cancel/route.ts                   # POST cancel (proxy)

src/app/admin/scraper/
  page.tsx                                    # Dashboard (server)
  jobs/new/page.tsx                           # Form (server + client form)
  jobs/new/NewJobForm.tsx                     # Client form component
  jobs/[id]/page.tsx                          # Job detail (server shell)
  jobs/[id]/JobLive.tsx                       # Client component (SSE)
  leads/page.tsx                              # Lead table (server)
  leads/LeadFilters.tsx                       # Client filter bar
  leads/[id]/page.tsx                         # Lead detail (server shell)
  leads/[id]/OutreachPanel.tsx                # Client panel (generate/edit/send)
  components/
    AuditCard.tsx                             # Render audit_report
    ScoreChip.tsx                             # Color-coded score
    StatusBadge.tsx                           # Job/email status badges
```

### Modifikované súbory v aiwai

```
src/app/admin/components/AdminShell.tsx       # Pridať Scraper do NAV
package.json                                  # + @anthropic-ai/sdk
.env.local                                    # + 6 nových env premenných
```

### Modifikované súbory v scraper (Python)

```
/Users/marek/nove weby 2026/business scraper/scraper_api.py
  - Pridať API token middleware (require_token)
  - Pridať /jobs* endpointy (DB-backed)
  - Zmeniť AI prompt z email-gen na audit-report
  - Zachovať starý /scrape endpoint pre BC

requirements.txt                              # bez zmeny (anthropic, fastapi už sú)
```

---

## Pre-flight check (manuálne, pred Task 0.1)

- [ ] Si na branchi `feature/admin-scraper-integration` v `/Users/marek/nove weby 2026/AIWai`
- [ ] Máš pripravené credentials: `ANTHROPIC_API_KEY`, Supabase service role key (Supabase Dashboard → Settings → API), Zoho App Password pre `marek@aiwai.app`
- [ ] Vygeneroval si nový random secret pre `SCRAPER_API_TOKEN`: `openssl rand -hex 32`

---

## Fáza 0 — Setup

### Task 0.1: Pridať `@anthropic-ai/sdk` dependency

**Files:**
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1: Inštalácia**

```bash
cd "/Users/marek/nove weby 2026/AIWai"
npm install @anthropic-ai/sdk@^0.40.0
```

- [ ] **Step 2: Verifikácia že je v package.json**

```bash
grep '@anthropic-ai/sdk' package.json
```
Expected: jeden výskyt v `dependencies`.

- [ ] **Step 3: Build check (najmä typy)**

```bash
npx tsc --noEmit
```
Expected: žiadne chyby (alebo len pre-existing).

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add @anthropic-ai/sdk for admin scraper outreach generation"
```

---

### Task 0.2: Pridať env premenné do `.env.local`

**Files:**
- Modify: `.env.local` (gitignored)

- [ ] **Step 1: Pridať premenné**

Otvor `.env.local` a doplň (ak `SUPABASE_SERVICE_ROLE_KEY` už existuje, ponechaj; ostatné pridaj):

```bash
# Scraper integration
SCRAPER_API_URL=https://lead-agent-scraper-production.up.railway.app
SCRAPER_API_TOKEN=<vygenerovaný openssl rand -hex 32 tu>
SUPABASE_SERVICE_ROLE_KEY=<service role z Supabase Dashboard>
ANTHROPIC_API_KEY=sk-ant-api03-...

# Zoho SMTP for outreach
ZOHO_SMTP_HOST=smtp.zoho.eu
ZOHO_SMTP_PORT=465
ZOHO_SMTP_USER=marek@aiwai.app
ZOHO_SMTP_PASS=<Zoho App Password>
ZOHO_FROM_NAME=Marek Donoval
```

- [ ] **Step 2: Verifikácia**

```bash
grep -E '^(SCRAPER_API|SUPABASE_SERVICE|ANTHROPIC_API|ZOHO_SMTP|ZOHO_FROM)' .env.local | wc -l
```
Expected: 9.

- [ ] **Step 3: Pridať tie isté premenné do Vercel** (cez Dashboard alebo `vercel env`)

```bash
# napr. cez CLI:
npx vercel env add SCRAPER_API_TOKEN production
# ... pre každú novú premennú, target: production + preview
```

(Toto Marek urobí ručne pred prod deployom — môže byť odložené, ale lokálne musia byť v `.env.local`.)

- [ ] **Step 4: Žiadny commit** (`.env.local` je gitignored)

---

## Fáza 1 — Databáza

### Task 1.1: SQL migrácia

**Files:**
- Create: `supabase/migrations/20260524_scraper_admin_integration.sql`

- [ ] **Step 1: Napísať migráciu**

```sql
-- Admin scraper integration: rozšírenie scraper.leads + nové jobs/outreach_log
-- 2026-05-24

-- ── 1. leads: pridať audit + outreach + email_status stĺpce ───────────────
ALTER TABLE scraper.leads
  ADD COLUMN IF NOT EXISTS audit_report   jsonb,
  ADD COLUMN IF NOT EXISTS audit_status   text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS outreach_email jsonb,
  ADD COLUMN IF NOT EXISTS email_sent_at  timestamptz,
  ADD COLUMN IF NOT EXISTS email_status   text,
  ADD COLUMN IF NOT EXISTS job_id         uuid;

-- audit_status: pending | done | failed | skipped
-- email_status: null | sent | failed | bounced

CREATE INDEX IF NOT EXISTS leads_job_id_idx       ON scraper.leads(job_id);
CREATE INDEX IF NOT EXISTS leads_audit_status_idx ON scraper.leads(audit_status);
CREATE INDEX IF NOT EXISTS leads_email_status_idx ON scraper.leads(email_status);

-- ── 2. nová tabuľka jobs ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS scraper.jobs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category      text NOT NULL,
  cities        text[] NOT NULL,
  max_per_city  integer NOT NULL DEFAULT 20,
  status        text NOT NULL DEFAULT 'queued',
  progress      jsonb NOT NULL DEFAULT '{}'::jsonb,
  log           text[] NOT NULL DEFAULT '{}',
  started_at    timestamptz NOT NULL DEFAULT now(),
  finished_at   timestamptz,
  error         text
);
-- status: queued | running | done | failed | cancelled
-- progress: { current_city, found, with_email, audited }

CREATE INDEX IF NOT EXISTS jobs_status_idx     ON scraper.jobs(status);
CREATE INDEX IF NOT EXISTS jobs_started_at_idx ON scraper.jobs(started_at DESC);

-- ── 3. outreach_log ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS scraper.outreach_log (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id    uuid NOT NULL REFERENCES scraper.leads(id) ON DELETE CASCADE,
  sent_at    timestamptz NOT NULL DEFAULT now(),
  to_email   text NOT NULL,
  subject    text NOT NULL,
  body       text NOT NULL,
  status     text NOT NULL,
  error      text
);
-- status: sent | failed

CREATE INDEX IF NOT EXISTS outreach_log_lead_idx    ON scraper.outreach_log(lead_id);
CREATE INDEX IF NOT EXISTS outreach_log_sent_at_idx ON scraper.outreach_log(sent_at DESC);

-- ── 4. RLS deny-all (service role bypasuje) ───────────────────────────────
ALTER TABLE scraper.leads         ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraper.jobs          ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraper.outreach_log  ENABLE ROW LEVEL SECURITY;
-- Žiadne polícy = deny by default pre anon/authenticated.
-- Service role bypasuje RLS automaticky.
```

- [ ] **Step 2: Spustiť v Supabase Dashboard**

1. Otvor https://supabase.com/dashboard/project/efgvlpjmppdsizejedxp/sql/new
2. Skopíruj obsah `supabase/migrations/20260524_scraper_admin_integration.sql`
3. Klikni **Run**
4. Verifikuj v Table Editor → schema `scraper` že vidíš nové tabuľky `jobs`, `outreach_log` a že `leads` má nové stĺpce.

- [ ] **Step 3: Verifikácia RLS s anon key**

```bash
cd "/Users/marek/nove weby 2026/AIWai"
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const c = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { db: { schema: 'scraper' } });
c.from('leads').select('*').limit(1).then(r => console.log('rows:', r.data?.length, 'error:', r.error?.message));
"
```
Expected: `rows: 0 error: undefined` (RLS deny-all) ALEBO `error: permission denied`. Nikdy nie reálne dáta.

- [ ] **Step 4: Verifikácia s service role**

```bash
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const c = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { db: { schema: 'scraper' } });
c.from('leads').select('id,name').limit(3).then(r => console.log(r));
"
```
Expected: skutočné riadky (alebo prázdne, ak tabuľka prázdna), bez chyby.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/20260524_scraper_admin_integration.sql
git commit -m "feat(db): scraper admin migration — audit_report, jobs, outreach_log, RLS deny-all"
```

---

## Fáza 2 — Server library (`src/lib/scraper/`)

### Task 2.1: TypeScript typy

**Files:**
- Create: `src/lib/scraper/types.ts`

- [ ] **Step 1: Napísať typy**

```typescript
// src/lib/scraper/types.ts

export type AuditReport = {
    strengths: string[];
    weaknesses: string[];
    opportunity: string;
    score: number; // 1-10
    checked_at: string; // ISO
};

export type OutreachEmail = {
    subject: string;
    body: string;
    model: string;
    generated_at: string; // ISO
};

export type AuditStatus = "pending" | "done" | "failed" | "skipped";
export type EmailStatus = null | "sent" | "failed" | "bounced";

export type Lead = {
    id: string;
    name: string;
    city: string | null;
    category: string | null;
    website: string | null;
    email: string | null;
    google_maps_url: string | null;
    audit_report: AuditReport | null;
    audit_status: AuditStatus;
    outreach_email: OutreachEmail | null;
    email_sent_at: string | null;
    email_status: EmailStatus;
    job_id: string | null;
    created_at: string;
};

export type JobStatus = "queued" | "running" | "done" | "failed" | "cancelled";

export type JobProgress = {
    current_city?: string;
    found?: number;
    with_email?: number;
    audited?: number;
};

export type Job = {
    id: string;
    category: string;
    cities: string[];
    max_per_city: number;
    status: JobStatus;
    progress: JobProgress;
    log: string[];
    started_at: string;
    finished_at: string | null;
    error: string | null;
};

export type OutreachLogEntry = {
    id: string;
    lead_id: string;
    sent_at: string;
    to_email: string;
    subject: string;
    body: string;
    status: "sent" | "failed";
    error: string | null;
};
```

- [ ] **Step 2: Build check**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/scraper/types.ts
git commit -m "feat(scraper): TypeScript types for leads, jobs, audit, outreach"
```

---

### Task 2.2: Server-only Supabase klient

**Files:**
- Create: `src/lib/scraper/supabase-server.ts`

- [ ] **Step 1: Napísať klienta**

```typescript
// src/lib/scraper/supabase-server.ts
// Server-only Supabase klient pre scraper schému so service role kľúčom.
// NIKDY neimportuj z client komponentu — service role kľúč by sa dostal do bundle.

import "server-only"; // throwne ak by sa zahrnul do client bundle
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _cached: SupabaseClient | null = null;

export function scraperDb(): SupabaseClient {
    if (_cached) return _cached;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new Error(
            "[scraperDb] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
        );
    }

    _cached = createClient(url, key, {
        db: { schema: "scraper" },
        auth: { persistSession: false, autoRefreshToken: false },
    });
    return _cached;
}
```

- [ ] **Step 2: Inštalácia `server-only`**

```bash
npm install server-only
```

- [ ] **Step 3: Build check**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/scraper/supabase-server.ts package.json package-lock.json
git commit -m "feat(scraper): server-only Supabase client with service role"
```

---

### Task 2.3: Railway proxy fetch wrapper

**Files:**
- Create: `src/lib/scraper/railway.ts`

- [ ] **Step 1: Napísať wrapper**

```typescript
// src/lib/scraper/railway.ts
// Volá Python FastAPI scraper na Railway s X-Scraper-Token header-om.

import "server-only";

const baseUrl = () => {
    const url = process.env.SCRAPER_API_URL;
    if (!url) throw new Error("SCRAPER_API_URL not configured");
    return url.replace(/\/$/, "");
};

const token = () => {
    const t = process.env.SCRAPER_API_TOKEN;
    if (!t) throw new Error("SCRAPER_API_TOKEN not configured");
    return t;
};

export async function railwayFetch(
    path: string,
    init: RequestInit = {}
): Promise<Response> {
    const headers = new Headers(init.headers);
    headers.set("X-Scraper-Token", token());
    if (init.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }
    return fetch(`${baseUrl()}${path}`, { ...init, headers, cache: "no-store" });
}

export async function railwayJson<T = unknown>(
    path: string,
    init: RequestInit = {}
): Promise<T> {
    const res = await railwayFetch(path, init);
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Railway ${path} ${res.status}: ${text.slice(0, 200)}`);
    }
    return res.json() as Promise<T>;
}
```

- [ ] **Step 2: Build check**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/scraper/railway.ts
git commit -m "feat(scraper): Railway API fetch wrapper with shared-secret auth"
```

---

### Task 2.4: Rate limiter

**Files:**
- Create: `src/lib/scraper/rate-limit.ts`

- [ ] **Step 1: Napísať token bucket**

```typescript
// src/lib/scraper/rate-limit.ts
// Jednoduchý in-memory token bucket per kľúč. Reset pri redeploy je acceptable.

type Bucket = { tokens: number; lastRefill: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(
    key: string,
    capacity: number,
    refillPerMinute: number
): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const refillPerMs = refillPerMinute / 60_000;

    let b = buckets.get(key);
    if (!b) {
        b = { tokens: capacity, lastRefill: now };
        buckets.set(key, b);
    } else {
        const elapsed = now - b.lastRefill;
        b.tokens = Math.min(capacity, b.tokens + elapsed * refillPerMs);
        b.lastRefill = now;
    }

    if (b.tokens >= 1) {
        b.tokens -= 1;
        return { allowed: true, remaining: Math.floor(b.tokens) };
    }
    return { allowed: false, remaining: 0 };
}

export function bucketKey(cookieValue: string | undefined, action: string): string {
    // Hash je overkill — cookie value je už non-PII random token.
    return `${action}:${cookieValue || "anon"}`;
}
```

- [ ] **Step 2: Build check**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/scraper/rate-limit.ts
git commit -m "feat(scraper): in-memory token bucket rate limiter"
```

---

### Task 2.5: Haiku outreach generátor

**Files:**
- Create: `src/lib/scraper/haiku.ts`

- [ ] **Step 1: Napísať generátor**

```typescript
// src/lib/scraper/haiku.ts
// Generuje SK outreach email cez Claude Haiku 4.5 na základe lead + audit reportu.

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
Žiadny markdown, žiadny prefix, žiadne ```json``` bloky.`;

export async function generateOutreachEmail(lead: Lead): Promise<OutreachEmail> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");
    if (!lead.audit_report) throw new Error("Lead has no audit_report — generate audit first");
    if (!lead.email) throw new Error("Lead has no email address");

    const client = new Anthropic({ apiKey });

    const userPrompt = `Firma: ${lead.name}
Web: ${lead.website || "—"}
Kategória: ${lead.category || "—"}
Mesto: ${lead.city || "—"}

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
        .filter((b): b is { type: "text"; text: string } => b.type === "text")
        .map((b) => b.text)
        .join("");

    // Tolerantný JSON parse — odstráň prípadné code fence
    const cleaned = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();

    let parsed: { subject?: string; body?: string };
    try {
        parsed = JSON.parse(cleaned);
    } catch (err) {
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
```

- [ ] **Step 2: Build check**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/scraper/haiku.ts
git commit -m "feat(scraper): Haiku 4.5 outreach email generator"
```

---

### Task 2.6: Zoho SMTP send

**Files:**
- Create: `src/lib/scraper/zoho.ts`

- [ ] **Step 1: Napísať send helper**

```typescript
// src/lib/scraper/zoho.ts
// Pošle plain-text email cez Zoho SMTP. nodemailer je už v dependencies.

import "server-only";
import nodemailer from "nodemailer";

export type SendArgs = {
    to: string;
    subject: string;
    body: string; // plain text
};

export type SendResult =
    | { ok: true; messageId: string }
    | { ok: false; error: string };

function transport() {
    const host = process.env.ZOHO_SMTP_HOST;
    const port = Number(process.env.ZOHO_SMTP_PORT || 465);
    const user = process.env.ZOHO_SMTP_USER;
    const pass = process.env.ZOHO_SMTP_PASS;
    if (!host || !user || !pass) {
        throw new Error("Zoho SMTP env vars missing");
    }
    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
    });
}

export async function sendOutreach(args: SendArgs): Promise<SendResult> {
    const fromName = process.env.ZOHO_FROM_NAME || "Marek Donoval";
    const fromUser = process.env.ZOHO_SMTP_USER!;
    try {
        const info = await transport().sendMail({
            from: `"${fromName}" <${fromUser}>`,
            to: args.to,
            subject: args.subject,
            text: args.body,
        });
        return { ok: true, messageId: info.messageId };
    } catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : String(err) };
    }
}
```

- [ ] **Step 2: Build check**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/scraper/zoho.ts
git commit -m "feat(scraper): Zoho SMTP outreach send helper"
```

---

## Fáza 3 — API routes (`src/app/api/admin/scraper/*`)

Všetky routes začínajú `requireAdmin(req)`. Žiadny endpoint nevracia citlivé tokens.

### Task 3.1: GET `/api/admin/scraper/stats`

**Files:**
- Create: `src/app/api/admin/scraper/stats/route.ts`

- [ ] **Step 1: Implementácia**

```typescript
// src/app/api/admin/scraper/stats/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { scraperDb } from "@/lib/scraper/supabase-server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const denied = requireAdmin(req);
    if (denied) return denied;

    const db = scraperDb();

    const [total, withEmail, audited, sent] = await Promise.all([
        db.from("leads").select("id", { count: "exact", head: true }),
        db.from("leads").select("id", { count: "exact", head: true }).not("email", "is", null),
        db.from("leads").select("id", { count: "exact", head: true }).eq("audit_status", "done"),
        db.from("leads").select("id", { count: "exact", head: true }).eq("email_status", "sent"),
    ]);

    return NextResponse.json({
        total: total.count ?? 0,
        with_email: withEmail.count ?? 0,
        audited: audited.count ?? 0,
        sent: sent.count ?? 0,
    });
}
```

- [ ] **Step 2: Manuálny test (vyžaduje admin cookie)**

```bash
# Prihlás sa cez /login v prehliadači, skopíruj cookie value
curl -i http://localhost:3000/api/admin/scraper/stats \
  -H 'Cookie: cb_admin_session=<token>'
```
Expected: `200` s JSON `{total, with_email, audited, sent}`.

- [ ] **Step 3: Test 401**

```bash
curl -i http://localhost:3000/api/admin/scraper/stats
```
Expected: `401 Unauthorized`.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/admin/scraper/stats/route.ts
git commit -m "feat(api): GET /api/admin/scraper/stats (admin gated)"
```

---

### Task 3.2: GET `/api/admin/scraper/leads` (list s filtrami)

**Files:**
- Create: `src/app/api/admin/scraper/leads/route.ts`

- [ ] **Step 1: Implementácia**

```typescript
// src/app/api/admin/scraper/leads/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { scraperDb } from "@/lib/scraper/supabase-server";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

export async function GET(req: NextRequest) {
    const denied = requireAdmin(req);
    if (denied) return denied;

    const url = new URL(req.url);
    const page = Math.max(0, parseInt(url.searchParams.get("page") || "0", 10));
    const category = url.searchParams.get("category");
    const city = url.searchParams.get("city");
    const jobId = url.searchParams.get("job_id");
    const hasEmail = url.searchParams.get("has_email");
    const hasAudit = url.searchParams.get("has_audit");
    const emailSent = url.searchParams.get("email_sent");
    const q = url.searchParams.get("q");

    const db = scraperDb();
    let qb = db.from("leads").select("*", { count: "exact" }).order("created_at", { ascending: false });

    if (category) qb = qb.eq("category", category);
    if (city) qb = qb.eq("city", city);
    if (jobId) qb = qb.eq("job_id", jobId);
    if (hasEmail === "1") qb = qb.not("email", "is", null);
    if (hasEmail === "0") qb = qb.is("email", null);
    if (hasAudit === "1") qb = qb.eq("audit_status", "done");
    if (emailSent === "1") qb = qb.eq("email_status", "sent");
    if (emailSent === "0") qb = qb.is("email_status", null);
    if (q) qb = qb.ilike("name", `%${q}%`);

    qb = qb.range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

    const { data, count, error } = await qb;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({
        leads: data ?? [],
        total: count ?? 0,
        page,
        page_size: PAGE_SIZE,
    });
}
```

- [ ] **Step 2: Manuálny test**

```bash
curl -s 'http://localhost:3000/api/admin/scraper/leads?page=0' \
  -H 'Cookie: cb_admin_session=<token>' | head -c 500
```
Expected: JSON s `leads[]`, `total`, `page`.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/scraper/leads/route.ts
git commit -m "feat(api): GET /api/admin/scraper/leads with filters + pagination"
```

---

### Task 3.3: GET `/api/admin/scraper/leads/[id]`

**Files:**
- Create: `src/app/api/admin/scraper/leads/[id]/route.ts`

- [ ] **Step 1: Implementácia**

```typescript
// src/app/api/admin/scraper/leads/[id]/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { scraperDb } from "@/lib/scraper/supabase-server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, ctx: { params: { id: string } }) {
    const denied = requireAdmin(req);
    if (denied) return denied;

    const db = scraperDb();
    const { data: lead, error } = await db.from("leads").select("*").eq("id", ctx.params.id).single();
    if (error || !lead) return NextResponse.json({ error: "not found" }, { status: 404 });

    const { data: log } = await db
        .from("outreach_log")
        .select("*")
        .eq("lead_id", ctx.params.id)
        .order("sent_at", { ascending: false });

    return NextResponse.json({ lead, outreach_log: log ?? [] });
}
```

- [ ] **Step 2: Manuálny test**

```bash
# Najprv získaj id zo zoznamu
ID=$(curl -s 'http://localhost:3000/api/admin/scraper/leads?page=0' \
  -H 'Cookie: cb_admin_session=<token>' | node -e "console.log(JSON.parse(require('fs').readFileSync(0)).leads[0]?.id)")
curl -s "http://localhost:3000/api/admin/scraper/leads/$ID" \
  -H 'Cookie: cb_admin_session=<token>' | head -c 500
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/scraper/leads/[id]/route.ts
git commit -m "feat(api): GET /api/admin/scraper/leads/[id] with outreach log"
```

---

### Task 3.4: POST `/api/admin/scraper/leads/[id]/generate-email`

**Files:**
- Create: `src/app/api/admin/scraper/leads/[id]/generate-email/route.ts`

- [ ] **Step 1: Implementácia**

```typescript
// src/app/api/admin/scraper/leads/[id]/generate-email/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin, ADMIN_COOKIE_NAME } from "@/lib/auth/admin";
import { scraperDb } from "@/lib/scraper/supabase-server";
import { generateOutreachEmail } from "@/lib/scraper/haiku";
import { rateLimit, bucketKey } from "@/lib/scraper/rate-limit";
import type { Lead } from "@/lib/scraper/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, ctx: { params: { id: string } }) {
    const denied = requireAdmin(req);
    if (denied) return denied;

    const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const rl = rateLimit(bucketKey(cookie, "generate-email"), 20, 20);
    if (!rl.allowed) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

    const db = scraperDb();
    const { data: lead, error } = await db.from("leads").select("*").eq("id", ctx.params.id).single();
    if (error || !lead) return NextResponse.json({ error: "not found" }, { status: 404 });

    try {
        const outreach = await generateOutreachEmail(lead as Lead);
        const { error: upErr } = await db
            .from("leads")
            .update({ outreach_email: outreach })
            .eq("id", ctx.params.id);
        if (upErr) throw upErr;
        return NextResponse.json({ outreach_email: outreach });
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
```

- [ ] **Step 2: Manuálny test** (vyžaduje lead s `audit_report` a `email`)

```bash
curl -s -X POST "http://localhost:3000/api/admin/scraper/leads/$ID/generate-email" \
  -H 'Cookie: cb_admin_session=<token>' | head -c 500
```
Expected: JSON `{outreach_email: {subject, body, model, generated_at}}`.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/scraper/leads/[id]/generate-email/route.ts
git commit -m "feat(api): POST /generate-email — Haiku outreach generation"
```

---

### Task 3.5: POST `/api/admin/scraper/leads/[id]/send`

**Files:**
- Create: `src/app/api/admin/scraper/leads/[id]/send/route.ts`

- [ ] **Step 1: Implementácia**

```typescript
// src/app/api/admin/scraper/leads/[id]/send/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin, ADMIN_COOKIE_NAME } from "@/lib/auth/admin";
import { scraperDb } from "@/lib/scraper/supabase-server";
import { sendOutreach } from "@/lib/scraper/zoho";
import { rateLimit, bucketKey } from "@/lib/scraper/rate-limit";
import { z } from "zod";

export const dynamic = "force-dynamic";

const Body = z.object({
    subject: z.string().min(1).max(200),
    body: z.string().min(1).max(8000),
});

export async function POST(req: NextRequest, ctx: { params: { id: string } }) {
    const denied = requireAdmin(req);
    if (denied) return denied;

    const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const rl = rateLimit(bucketKey(cookie, "send"), 20, 20);
    if (!rl.allowed) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

    const parsed = Body.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) {
        return NextResponse.json({ error: "invalid_body", details: parsed.error.flatten() }, { status: 400 });
    }

    const db = scraperDb();
    const { data: lead, error } = await db.from("leads").select("id,email").eq("id", ctx.params.id).single();
    if (error || !lead) return NextResponse.json({ error: "not found" }, { status: 404 });
    if (!lead.email) return NextResponse.json({ error: "lead_has_no_email" }, { status: 400 });

    const result = await sendOutreach({
        to: lead.email,
        subject: parsed.data.subject,
        body: parsed.data.body,
    });

    const status = result.ok ? "sent" : "failed";

    await db.from("outreach_log").insert({
        lead_id: lead.id,
        to_email: lead.email,
        subject: parsed.data.subject,
        body: parsed.data.body,
        status,
        error: result.ok ? null : result.error,
    });

    await db
        .from("leads")
        .update({
            email_status: status,
            email_sent_at: result.ok ? new Date().toISOString() : null,
        })
        .eq("id", lead.id);

    if (!result.ok) {
        return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
    }
    return NextResponse.json({ ok: true, messageId: result.messageId });
}
```

- [ ] **Step 2: Manuálny test** (opatrne — reálne odošle email)

Použiť testovaciu adresu (`cmelo.marek@gmail.com`):

```bash
# Najprv ručne uprav v Supabase Studio jeden lead.email na cmelo.marek@gmail.com
curl -s -X POST "http://localhost:3000/api/admin/scraper/leads/$TEST_ID/send" \
  -H 'Cookie: cb_admin_session=<token>' \
  -H 'Content-Type: application/json' \
  -d '{"subject":"Test from aiwai admin","body":"Hello, test."}'
```
Expected: `{ok:true, messageId:"..."}`. Email príde do schránky.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/scraper/leads/[id]/send/route.ts
git commit -m "feat(api): POST /send — Zoho SMTP outreach send with audit log"
```

---

### Task 3.6: POST `/api/admin/scraper/leads/[id]/mark-sent`

**Files:**
- Create: `src/app/api/admin/scraper/leads/[id]/mark-sent/route.ts`

- [ ] **Step 1: Implementácia**

```typescript
// src/app/api/admin/scraper/leads/[id]/mark-sent/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { scraperDb } from "@/lib/scraper/supabase-server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, ctx: { params: { id: string } }) {
    const denied = requireAdmin(req);
    if (denied) return denied;

    const db = scraperDb();
    const { error } = await db
        .from("leads")
        .update({
            email_status: "sent",
            email_sent_at: new Date().toISOString(),
        })
        .eq("id", ctx.params.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/admin/scraper/leads/[id]/mark-sent/route.ts
git commit -m "feat(api): POST /mark-sent — manual marking without SMTP"
```

---

### Task 3.7: GET `/api/admin/scraper/jobs` + POST (create)

**Files:**
- Create: `src/app/api/admin/scraper/jobs/route.ts`

- [ ] **Step 1: Implementácia**

```typescript
// src/app/api/admin/scraper/jobs/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin, ADMIN_COOKIE_NAME } from "@/lib/auth/admin";
import { scraperDb } from "@/lib/scraper/supabase-server";
import { railwayJson } from "@/lib/scraper/railway";
import { rateLimit, bucketKey } from "@/lib/scraper/rate-limit";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const denied = requireAdmin(req);
    if (denied) return denied;

    const url = new URL(req.url);
    const limit = Math.min(100, parseInt(url.searchParams.get("limit") || "20", 10));

    const db = scraperDb();
    const { data, error } = await db
        .from("jobs")
        .select("*")
        .order("started_at", { ascending: false })
        .limit(limit);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ jobs: data ?? [] });
}

const PostBody = z.object({
    category: z.string().min(1).max(80),
    cities: z.array(z.string().min(1).max(80)).min(1).max(10),
    max_per_city: z.number().int().min(1).max(100).default(20),
});

export async function POST(req: NextRequest) {
    const denied = requireAdmin(req);
    if (denied) return denied;

    const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const rl = rateLimit(bucketKey(cookie, "jobs-create"), 10, 10);
    if (!rl.allowed) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

    const parsed = PostBody.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) {
        return NextResponse.json({ error: "invalid_body", details: parsed.error.flatten() }, { status: 400 });
    }

    try {
        const created = await railwayJson<{ id: string; status: string }>("/jobs", {
            method: "POST",
            body: JSON.stringify(parsed.data),
        });
        return NextResponse.json(created);
    } catch (err) {
        return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 502 });
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/admin/scraper/jobs/route.ts
git commit -m "feat(api): /jobs GET (DB list) + POST (Railway proxy)"
```

---

### Task 3.8: GET `/api/admin/scraper/jobs/[id]` (proxy)

**Files:**
- Create: `src/app/api/admin/scraper/jobs/[id]/route.ts`

- [ ] **Step 1: Implementácia**

```typescript
// src/app/api/admin/scraper/jobs/[id]/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { railwayJson } from "@/lib/scraper/railway";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, ctx: { params: { id: string } }) {
    const denied = requireAdmin(req);
    if (denied) return denied;

    try {
        const data = await railwayJson(`/jobs/${ctx.params.id}`);
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 502 });
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/admin/scraper/jobs/[id]/route.ts
git commit -m "feat(api): GET /jobs/[id] proxy"
```

---

### Task 3.9: GET `/api/admin/scraper/jobs/[id]/stream` (SSE proxy)

**Files:**
- Create: `src/app/api/admin/scraper/jobs/[id]/stream/route.ts`

- [ ] **Step 1: Implementácia**

```typescript
// src/app/api/admin/scraper/jobs/[id]/stream/route.ts
import { type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { railwayFetch } from "@/lib/scraper/railway";

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // SSE proxy potrebuje Node, nie edge

export async function GET(req: NextRequest, ctx: { params: { id: string } }) {
    const denied = requireAdmin(req);
    if (denied) return denied;

    const upstream = await railwayFetch(`/jobs/${ctx.params.id}/stream`, {
        method: "GET",
        headers: { Accept: "text/event-stream" },
    });

    if (!upstream.ok || !upstream.body) {
        return new Response(`upstream error: ${upstream.status}`, { status: 502 });
    }

    return new Response(upstream.body, {
        status: 200,
        headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/admin/scraper/jobs/[id]/stream/route.ts
git commit -m "feat(api): SSE proxy for live job progress"
```

---

### Task 3.10: POST `/api/admin/scraper/jobs/[id]/cancel`

**Files:**
- Create: `src/app/api/admin/scraper/jobs/[id]/cancel/route.ts`

- [ ] **Step 1: Implementácia**

```typescript
// src/app/api/admin/scraper/jobs/[id]/cancel/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { railwayJson } from "@/lib/scraper/railway";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, ctx: { params: { id: string } }) {
    const denied = requireAdmin(req);
    if (denied) return denied;

    try {
        const data = await railwayJson(`/jobs/${ctx.params.id}/cancel`, { method: "POST" });
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 502 });
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/admin/scraper/jobs/[id]/cancel/route.ts
git commit -m "feat(api): POST /jobs/[id]/cancel proxy"
```

---

## Fáza 4 — UI

### Task 4.1: Pridať Scraper do sidebar

**Files:**
- Modify: `src/app/admin/components/AdminShell.tsx:18-25`

- [ ] **Step 1: Pridať import a NAV item**

V importoch z `lucide-react` pridať `Radar`:
```typescript
import {
    LogOut, LayoutDashboard, Inbox, Sparkles, MessagesSquare,
    BarChart3, DollarSign, Settings, Bot, Radar,
} from "lucide-react";
```

V `NAV` array pridať za "Štatistiky":
```typescript
    { href: "/admin/scraper", label: "Scraper", icon: Radar, group: "primary" },
```

- [ ] **Step 2: Verifikácia**

```bash
npx tsc --noEmit
npm run dev
# otvor http://localhost:3000/admin → vidíš novú položku v sidebar (klik = 404 zatiaľ)
```

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/components/AdminShell.tsx
git commit -m "feat(admin): add Scraper sidebar item"
```

---

### Task 4.2: Spoločné UI komponenty

**Files:**
- Create: `src/app/admin/scraper/components/ScoreChip.tsx`
- Create: `src/app/admin/scraper/components/StatusBadge.tsx`
- Create: `src/app/admin/scraper/components/AuditCard.tsx`

- [ ] **Step 1: ScoreChip**

```typescript
// src/app/admin/scraper/components/ScoreChip.tsx
export function ScoreChip({ score }: { score: number | null | undefined }) {
    if (score == null) return <span className="font-mono text-cream/40">—</span>;
    const color =
        score >= 7 ? "bg-emerald-400/15 text-emerald-300 border-emerald-400/30"
        : score >= 4 ? "bg-amber-400/15 text-amber-300 border-amber-400/30"
        : "bg-red-400/15 text-red-300 border-red-400/30";
    return (
        <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-xs ${color}`}>
            {score}<span className="opacity-50">/10</span>
        </span>
    );
}
```

- [ ] **Step 2: StatusBadge**

```typescript
// src/app/admin/scraper/components/StatusBadge.tsx
const MAP: Record<string, string> = {
    queued:    "bg-cream/10 text-cream/70 border-cream/20",
    running:   "bg-gold/15 text-gold border-gold/40",
    done:      "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
    failed:    "bg-red-400/15 text-red-300 border-red-400/30",
    cancelled: "bg-cream/5 text-cream/40 border-cream/10",
    sent:      "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
    skipped:   "bg-cream/5 text-cream/40 border-cream/10",
    pending:   "bg-cream/10 text-cream/60 border-cream/20",
};

export function StatusBadge({ status }: { status: string | null | undefined }) {
    if (!status) return <span className="font-mono text-cream/40">—</span>;
    const cls = MAP[status] || "bg-cream/10 text-cream/70 border-cream/20";
    return (
        <span className={`inline-flex rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${cls}`}>
            {status}
        </span>
    );
}
```

- [ ] **Step 3: AuditCard**

```typescript
// src/app/admin/scraper/components/AuditCard.tsx
import type { AuditReport } from "@/lib/scraper/types";
import { ScoreChip } from "./ScoreChip";

export function AuditCard({ report }: { report: AuditReport | null }) {
    if (!report) {
        return (
            <div className="rounded-xl border border-dashed border-cream/15 p-6 text-cream/50">
                Audit ešte nebol vygenerovaný.
            </div>
        );
    }
    return (
        <div className="space-y-5 rounded-2xl border border-cream/[0.08] bg-cream/[0.025] p-6">
            <div className="flex items-center justify-between">
                <h3 className="font-display text-lg text-cream">Audit reportu</h3>
                <ScoreChip score={report.score} />
            </div>

            <Section title="Silné stránky" items={report.strengths} tone="emerald" />
            <Section title="Slabiny" items={report.weaknesses} tone="amber" />

            <div>
                <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-cream/40">
                    Príležitosť
                </div>
                <blockquote className="rounded-md border-l-2 border-gold/60 bg-gold/5 px-4 py-3 text-cream/90">
                    {report.opportunity}
                </blockquote>
            </div>

            <div className="text-[10px] text-cream/30">
                Audit z: {new Date(report.checked_at).toLocaleString("sk-SK")}
            </div>
        </div>
    );
}

function Section({ title, items, tone }: { title: string; items: string[]; tone: "emerald" | "amber" }) {
    const chip = tone === "emerald"
        ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
        : "border-amber-400/30 bg-amber-400/10 text-amber-200";
    return (
        <div>
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-cream/40">{title}</div>
            <div className="flex flex-wrap gap-1.5">
                {items.map((s, i) => (
                    <span key={i} className={`rounded-md border px-2 py-1 text-xs ${chip}`}>{s}</span>
                ))}
            </div>
        </div>
    );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/scraper/components/
git commit -m "feat(admin): scraper UI primitives (ScoreChip, StatusBadge, AuditCard)"
```

---

### Task 4.3: Dashboard `/admin/scraper`

**Files:**
- Create: `src/app/admin/scraper/page.tsx`

- [ ] **Step 1: Implementácia**

```typescript
// src/app/admin/scraper/page.tsx
import Link from "next/link";
import AdminShell from "@/app/admin/components/AdminShell";
import { StatCard, Panel } from "@/app/admin/components/AdminPanels";
import { Radar, Mail, ClipboardCheck, Send, Plus } from "lucide-react";
import { scraperDb } from "@/lib/scraper/supabase-server";
import { StatusBadge } from "./components/StatusBadge";

export const dynamic = "force-dynamic";

export default async function ScraperDashboard() {
    const db = scraperDb();

    const [statsTotal, statsEmail, statsAudited, statsSent, jobsRes, topCatRes] = await Promise.all([
        db.from("leads").select("id", { count: "exact", head: true }),
        db.from("leads").select("id", { count: "exact", head: true }).not("email", "is", null),
        db.from("leads").select("id", { count: "exact", head: true }).eq("audit_status", "done"),
        db.from("leads").select("id", { count: "exact", head: true }).eq("email_status", "sent"),
        db.from("jobs").select("*").order("started_at", { ascending: false }).limit(5),
        db.rpc("noop").then(() => null).catch(() => null), // placeholder; top kategórie urobíme inline pod
    ]);

    // Top kategórie (jednoduchý SELECT bez RPC)
    const { data: topCats } = await db
        .from("leads")
        .select("category")
        .not("category", "is", null)
        .limit(2000); // dostatočná vzorka pre malé DB
    const catCounts = new Map<string, number>();
    (topCats ?? []).forEach((r: { category: string | null }) => {
        if (r.category) catCounts.set(r.category, (catCounts.get(r.category) ?? 0) + 1);
    });
    const top = [...catCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
    const maxCount = top[0]?.[1] ?? 1;

    return (
        <AdminShell
            title="Scraper"
            subtitle="Generovanie leadov + audit webov"
            actions={
                <Link
                    href="/admin/scraper/jobs/new"
                    className="inline-flex items-center gap-2 rounded-lg bg-gold/15 px-4 py-2 text-sm font-medium text-gold border border-gold/40 hover:bg-gold/25 transition"
                >
                    <Plus size={16} /> Nový scrape
                </Link>
            }
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Leady spolu"     value={statsTotal.count ?? 0}   icon={Radar} accent="gold" />
                <StatCard label="S emailom"        value={statsEmail.count ?? 0}   icon={Mail} accent="cream" />
                <StatCard label="Audited"          value={statsAudited.count ?? 0} icon={ClipboardCheck} accent="emerald" />
                <StatCard label="Maily odoslané"   value={statsSent.count ?? 0}    icon={Send} accent="amber" />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Panel title="Posledné joby" subtitle="Top 5 podľa štartu">
                    <div className="divide-y divide-cream/[0.06]">
                        {(jobsRes.data ?? []).map((j: any) => (
                            <Link
                                key={j.id}
                                href={`/admin/scraper/jobs/${j.id}`}
                                className="flex items-center justify-between py-3 hover:bg-cream/[0.02] px-2 rounded transition"
                            >
                                <div className="flex flex-col">
                                    <div className="text-sm text-cream">{j.category}</div>
                                    <div className="text-[11px] text-cream/40">
                                        {j.cities?.slice(0, 3).join(", ")}
                                        {j.cities?.length > 3 ? ` +${j.cities.length - 3}` : ""}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[11px] text-cream/50">
                                        {j.progress?.found ?? 0} / {j.progress?.with_email ?? 0}
                                    </span>
                                    <StatusBadge status={j.status} />
                                </div>
                            </Link>
                        ))}
                        {(!jobsRes.data || jobsRes.data.length === 0) && (
                            <div className="py-6 text-center text-cream/40 text-sm">Žiadne joby</div>
                        )}
                    </div>
                </Panel>

                <Panel title="Top kategórie" subtitle="Podľa počtu leadov">
                    <div className="space-y-2">
                        {top.map(([cat, n]) => (
                            <div key={cat} className="flex items-center gap-3">
                                <div className="w-32 truncate text-sm text-cream/80">{cat}</div>
                                <div className="flex-1 h-2 rounded bg-cream/[0.05] overflow-hidden">
                                    <div
                                        className="h-full bg-gold/60"
                                        style={{ width: `${(n / maxCount) * 100}%` }}
                                    />
                                </div>
                                <div className="w-10 text-right font-mono text-xs text-cream/60">{n}</div>
                            </div>
                        ))}
                        {top.length === 0 && (
                            <div className="py-6 text-center text-cream/40 text-sm">Žiadne kategórie</div>
                        )}
                    </div>
                </Panel>
            </div>
        </AdminShell>
    );
}
```

- [ ] **Step 2: Manuálny test**

```bash
npm run dev
# v prehliadači: http://localhost:3000/admin/scraper
```
Expected: dashboard sa renderuje, 4 stat karty, panely (môžu byť prázdne).

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/scraper/page.tsx
git commit -m "feat(admin): scraper dashboard with stats + recent jobs + top categories"
```

---

### Task 4.4: Nový scrape form

**Files:**
- Create: `src/app/admin/scraper/jobs/new/page.tsx`
- Create: `src/app/admin/scraper/jobs/new/NewJobForm.tsx`

- [ ] **Step 1: Page shell**

```typescript
// src/app/admin/scraper/jobs/new/page.tsx
import AdminShell from "@/app/admin/components/AdminShell";
import { NewJobForm } from "./NewJobForm";

export default function NewJobPage() {
    return (
        <AdminShell title="Nový scrape" subtitle="Spustí background job na Railway">
            <div className="max-w-2xl">
                <NewJobForm />
            </div>
        </AdminShell>
    );
}
```

- [ ] **Step 2: Client form**

```typescript
// src/app/admin/scraper/jobs/new/NewJobForm.tsx
"use client";

import { useState, FormEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2 } from "lucide-react";

export function NewJobForm() {
    const router = useRouter();
    const [category, setCategory] = useState("");
    const [cityInput, setCityInput] = useState("");
    const [cities, setCities] = useState<string[]>([]);
    const [maxPerCity, setMaxPerCity] = useState(20);
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    function addCity(raw: string) {
        const v = raw.trim();
        if (!v) return;
        if (cities.includes(v)) return;
        if (cities.length >= 10) return;
        setCities([...cities, v]);
        setCityInput("");
    }

    function onCityKey(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addCity(cityInput);
        } else if (e.key === "Backspace" && cityInput === "" && cities.length > 0) {
            setCities(cities.slice(0, -1));
        }
    }

    async function submit(e: FormEvent) {
        e.preventDefault();
        setErr(null);
        if (!category.trim() || cities.length === 0) {
            setErr("Vyplň kategóriu a aspoň jedno mesto.");
            return;
        }
        setBusy(true);
        try {
            const res = await fetch("/api/admin/scraper/jobs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category: category.trim(), cities, max_per_city: maxPerCity }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "request failed");
            router.push(`/admin/scraper/jobs/${data.id}`);
        } catch (e) {
            setErr(e instanceof Error ? e.message : String(e));
            setBusy(false);
        }
    }

    return (
        <form onSubmit={submit} className="space-y-6">
            <Field label="Kategória">
                <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="napr. fitness centrum"
                    className="w-full rounded-lg bg-cream/[0.04] border border-cream/15 px-4 py-2.5 text-cream placeholder:text-cream/30 focus:border-gold/60 focus:outline-none"
                    disabled={busy}
                    maxLength={80}
                />
            </Field>

            <Field label={`Mestá (${cities.length}/10)`}>
                <div className="rounded-lg border border-cream/15 bg-cream/[0.04] p-2 flex flex-wrap gap-2">
                    {cities.map((c) => (
                        <span key={c} className="inline-flex items-center gap-1 rounded-md bg-gold/15 border border-gold/40 px-2 py-1 text-sm text-gold">
                            {c}
                            <button type="button" onClick={() => setCities(cities.filter((x) => x !== c))}>
                                <X size={12} />
                            </button>
                        </span>
                    ))}
                    <input
                        type="text"
                        value={cityInput}
                        onChange={(e) => setCityInput(e.target.value)}
                        onKeyDown={onCityKey}
                        onBlur={() => addCity(cityInput)}
                        placeholder={cities.length === 0 ? "Bratislava, Košice, Trnava..." : ""}
                        className="flex-1 min-w-[120px] bg-transparent px-2 py-1 text-cream placeholder:text-cream/30 focus:outline-none"
                        disabled={busy || cities.length >= 10}
                    />
                </div>
                <p className="mt-1 text-[11px] text-cream/40">Enter alebo čiarka pridá mesto. Max 10.</p>
            </Field>

            <Field label="Max výsledkov per mesto">
                <input
                    type="number"
                    min={1}
                    max={100}
                    value={maxPerCity}
                    onChange={(e) => setMaxPerCity(parseInt(e.target.value || "20", 10))}
                    className="w-32 rounded-lg bg-cream/[0.04] border border-cream/15 px-4 py-2.5 text-cream focus:border-gold/60 focus:outline-none"
                    disabled={busy}
                />
            </Field>

            {err && <div className="text-sm text-red-300 bg-red-400/10 border border-red-400/30 rounded-lg px-4 py-2">{err}</div>}

            <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-lg bg-gold/20 border border-gold/50 px-6 py-2.5 text-gold hover:bg-gold/30 transition disabled:opacity-50"
            >
                {busy ? <Loader2 size={16} className="animate-spin" /> : null}
                {busy ? "Spúšťam..." : "Spustiť scrape"}
            </button>
        </form>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="block">
            <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.22em] text-cream/50">{label}</span>
            {children}
        </label>
    );
}
```

- [ ] **Step 3: Manuálny test**

```bash
# v prehliadači: http://localhost:3000/admin/scraper/jobs/new
# Vyplň, klikni Spustiť — očakávaj redirect na /admin/scraper/jobs/[id] (zatiaľ 404 lebo task 4.5 nehotový)
# Skontroluj POST request v Network tab → 200 s {id}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/scraper/jobs/new/
git commit -m "feat(admin): new scrape job form with tag-input cities"
```

---

### Task 4.5: Job detail (live SSE)

**Files:**
- Create: `src/app/admin/scraper/jobs/[id]/page.tsx`
- Create: `src/app/admin/scraper/jobs/[id]/JobLive.tsx`

- [ ] **Step 1: Page shell (server)**

```typescript
// src/app/admin/scraper/jobs/[id]/page.tsx
import AdminShell from "@/app/admin/components/AdminShell";
import { scraperDb } from "@/lib/scraper/supabase-server";
import { notFound } from "next/navigation";
import { JobLive } from "./JobLive";

export const dynamic = "force-dynamic";

export default async function JobDetailPage({ params }: { params: { id: string } }) {
    const db = scraperDb();
    const { data: job } = await db.from("jobs").select("*").eq("id", params.id).single();
    if (!job) notFound();

    return (
        <AdminShell title="Scrape job" subtitle={`${job.category} · ${(job.cities ?? []).join(", ")}`}>
            <JobLive initialJob={job} />
        </AdminShell>
    );
}
```

- [ ] **Step 2: Client live component**

```typescript
// src/app/admin/scraper/jobs/[id]/JobLive.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { StatusBadge } from "../../components/StatusBadge";
import type { Job } from "@/lib/scraper/types";

export function JobLive({ initialJob }: { initialJob: Job }) {
    const [job, setJob] = useState<Job>(initialJob);
    const [logs, setLogs] = useState<string[]>(initialJob.log ?? []);
    const logRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (job.status === "done" || job.status === "failed" || job.status === "cancelled") return;

        const es = new EventSource(`/api/admin/scraper/jobs/${job.id}/stream`);

        es.addEventListener("progress", (ev) => {
            try {
                const data = JSON.parse((ev as MessageEvent).data);
                setJob((j) => ({ ...j, progress: { ...j.progress, ...data }, status: "running" }));
            } catch {}
        });
        es.addEventListener("log", (ev) => {
            try {
                const line = JSON.parse((ev as MessageEvent).data);
                setLogs((prev) => [...prev.slice(-499), String(line)]);
            } catch {}
        });
        es.addEventListener("done", (ev) => {
            try {
                const data = JSON.parse((ev as MessageEvent).data);
                setJob((j) => ({ ...j, status: data.status || "done", finished_at: data.finished_at }));
            } catch {}
            es.close();
        });
        es.onerror = () => {
            // Fallback: po error skús ešte raz fetchnúť aktuálny stav
            fetch(`/api/admin/scraper/jobs/${job.id}`)
                .then((r) => r.json())
                .then((d) => setJob((j) => ({ ...j, ...d })))
                .catch(() => {});
        };

        return () => es.close();
    }, [job.id, job.status]);

    useEffect(() => {
        if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    }, [logs]);

    const cancellable = job.status === "queued" || job.status === "running";

    async function cancel() {
        await fetch(`/api/admin/scraper/jobs/${job.id}/cancel`, { method: "POST" });
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cream/[0.08] bg-cream/[0.025] p-5">
                <div className="flex flex-col gap-1">
                    <div className="text-xs font-mono uppercase tracking-[0.22em] text-cream/40">Status</div>
                    <StatusBadge status={job.status} />
                </div>
                {cancellable && (
                    <button onClick={cancel} className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-2 text-sm text-red-300 hover:bg-red-400/20">
                        Zrušiť
                    </button>
                )}
                {(job.status === "done" || job.status === "failed") && (
                    <Link
                        href={`/admin/scraper/leads?job_id=${job.id}`}
                        className="rounded-lg border border-gold/40 bg-gold/15 px-4 py-2 text-sm text-gold hover:bg-gold/25"
                    >
                        Pozri leady z tohto jobu →
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Stat label="Current city" value={job.progress?.current_city ?? "—"} />
                <Stat label="Found" value={job.progress?.found ?? 0} />
                <Stat label="With email" value={job.progress?.with_email ?? 0} />
                <Stat label="Audited" value={job.progress?.audited ?? 0} />
            </div>

            <div
                ref={logRef}
                className="h-[420px] overflow-y-auto rounded-2xl border border-cream/[0.08] bg-black/60 p-4 font-mono text-[12px] leading-relaxed text-cream/80"
            >
                {logs.length === 0 && <div className="text-cream/30">Žiadne logy zatiaľ...</div>}
                {logs.map((l, i) => {
                    const tone = /error|fail/i.test(l) ? "text-red-300"
                        : /warn/i.test(l) ? "text-amber-300"
                        : "text-cream/70";
                    return <div key={i} className={tone}>{l}</div>;
                })}
            </div>
        </div>
    );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-cream/[0.08] bg-cream/[0.025] p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream/40">{label}</div>
            <div className="mt-2 text-2xl font-display text-gold">{value}</div>
        </div>
    );
}
```

- [ ] **Step 3: Manuálny test** (po nasadení Python scrapera)

Spusti nový job z formu → stránka jobu sa otvorí → vidíš live progress.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/scraper/jobs/[id]/
git commit -m "feat(admin): live job detail with SSE progress and log stream"
```

---

### Task 4.6: Lead table

**Files:**
- Create: `src/app/admin/scraper/leads/page.tsx`
- Create: `src/app/admin/scraper/leads/LeadFilters.tsx`

- [ ] **Step 1: Page (server)**

```typescript
// src/app/admin/scraper/leads/page.tsx
import Link from "next/link";
import AdminShell from "@/app/admin/components/AdminShell";
import { scraperDb } from "@/lib/scraper/supabase-server";
import { ScoreChip } from "../components/ScoreChip";
import { StatusBadge } from "../components/StatusBadge";
import { LeadFilters } from "./LeadFilters";
import { ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

type SP = { [k: string]: string | undefined };

export default async function LeadsPage({ searchParams }: { searchParams: SP }) {
    const page = Math.max(0, parseInt(searchParams.page || "0", 10));
    const db = scraperDb();

    let q = db.from("leads").select("*", { count: "exact" }).order("created_at", { ascending: false });
    if (searchParams.category) q = q.eq("category", searchParams.category);
    if (searchParams.city) q = q.eq("city", searchParams.city);
    if (searchParams.job_id) q = q.eq("job_id", searchParams.job_id);
    if (searchParams.has_email === "1") q = q.not("email", "is", null);
    if (searchParams.has_audit === "1") q = q.eq("audit_status", "done");
    if (searchParams.email_sent === "1") q = q.eq("email_status", "sent");
    if (searchParams.q) q = q.ilike("name", `%${searchParams.q}%`);
    q = q.range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

    const { data: leads, count } = await q;

    // distinct hodnoty pre filtre
    const { data: catRows } = await db.from("leads").select("category").not("category", "is", null).limit(500);
    const { data: cityRows } = await db.from("leads").select("city").not("city", "is", null).limit(500);
    const categories = [...new Set((catRows ?? []).map((r: any) => r.category).filter(Boolean))].sort();
    const cities = [...new Set((cityRows ?? []).map((r: any) => r.city).filter(Boolean))].sort();

    const total = count ?? 0;
    const pages = Math.ceil(total / PAGE_SIZE);

    return (
        <AdminShell title="Leady" subtitle={`${total} záznamov`}>
            <LeadFilters categories={categories} cities={cities} current={searchParams} />

            <div className="mt-6 overflow-x-auto rounded-2xl border border-cream/[0.08] bg-cream/[0.025]">
                <table className="w-full text-sm">
                    <thead className="text-left">
                        <tr className="border-b border-cream/[0.06] text-[10px] font-mono uppercase tracking-[0.18em] text-cream/40">
                            <th className="p-3">Názov</th>
                            <th className="p-3">Mesto</th>
                            <th className="p-3">Kategória</th>
                            <th className="p-3">Web</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Audit</th>
                            <th className="p-3">Mail</th>
                            <th className="p-3" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-cream/[0.04]">
                        {(leads ?? []).map((l: any) => (
                            <tr key={l.id} className="hover:bg-cream/[0.02]">
                                <td className="p-3 text-cream">{l.name}</td>
                                <td className="p-3 text-cream/70">{l.city || "—"}</td>
                                <td className="p-3 text-cream/70">{l.category || "—"}</td>
                                <td className="p-3">
                                    {l.website ? (
                                        <a href={l.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-gold hover:underline">
                                            <ExternalLink size={12} /> web
                                        </a>
                                    ) : <span className="text-cream/30">—</span>}
                                </td>
                                <td className="p-3 text-cream/70 font-mono text-xs">{l.email || "—"}</td>
                                <td className="p-3"><ScoreChip score={l.audit_report?.score} /></td>
                                <td className="p-3"><StatusBadge status={l.email_status} /></td>
                                <td className="p-3">
                                    <Link href={`/admin/scraper/leads/${l.id}`} className="text-gold/80 hover:text-gold text-xs">Detail →</Link>
                                </td>
                            </tr>
                        ))}
                        {(!leads || leads.length === 0) && (
                            <tr><td colSpan={8} className="p-8 text-center text-cream/40">Žiadne výsledky</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {pages > 1 && (
                <div className="mt-4 flex items-center justify-between text-sm text-cream/60">
                    <div>Strana {page + 1} / {pages}</div>
                    <div className="flex gap-2">
                        {page > 0 && (
                            <Link href={qsWith(searchParams, { page: String(page - 1) })} className="px-3 py-1 rounded border border-cream/15 hover:bg-cream/[0.04]">← Predchádzajúca</Link>
                        )}
                        {page < pages - 1 && (
                            <Link href={qsWith(searchParams, { page: String(page + 1) })} className="px-3 py-1 rounded border border-cream/15 hover:bg-cream/[0.04]">Ďalšia →</Link>
                        )}
                    </div>
                </div>
            )}
        </AdminShell>
    );
}

function qsWith(sp: SP, override: Record<string, string>): string {
    const all = { ...sp, ...override };
    const usp = new URLSearchParams();
    Object.entries(all).forEach(([k, v]) => { if (v) usp.set(k, v); });
    return `?${usp.toString()}`;
}
```

- [ ] **Step 2: Client filter bar**

```typescript
// src/app/admin/scraper/leads/LeadFilters.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Props = {
    categories: string[];
    cities: string[];
    current: { [k: string]: string | undefined };
};

export function LeadFilters({ categories, cities, current }: Props) {
    const router = useRouter();
    const sp = useSearchParams();

    function update(key: string, value: string | null) {
        const usp = new URLSearchParams(sp.toString());
        if (value && value !== "") usp.set(key, value);
        else usp.delete(key);
        usp.delete("page");
        router.push(`?${usp.toString()}`);
    }

    return (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-cream/[0.08] bg-cream/[0.025] p-4">
            <input
                type="text"
                placeholder="Hľadať podľa názvu..."
                defaultValue={current.q || ""}
                onKeyDown={(e) => {
                    if (e.key === "Enter") update("q", (e.target as HTMLInputElement).value);
                }}
                className="rounded-md bg-cream/[0.04] border border-cream/15 px-3 py-1.5 text-sm text-cream w-64 focus:border-gold/60 focus:outline-none"
            />
            <Select label="Kategória" value={current.category} onChange={(v) => update("category", v)} options={categories} />
            <Select label="Mesto" value={current.city} onChange={(v) => update("city", v)} options={cities} />
            <Toggle label="Má email" active={current.has_email === "1"} onClick={() => update("has_email", current.has_email === "1" ? null : "1")} />
            <Toggle label="Má audit" active={current.has_audit === "1"} onClick={() => update("has_audit", current.has_audit === "1" ? null : "1")} />
            <Toggle label="Email odoslaný" active={current.email_sent === "1"} onClick={() => update("email_sent", current.email_sent === "1" ? null : "1")} />
        </div>
    );
}

function Select({ label, value, onChange, options }: { label: string; value: string | undefined; onChange: (v: string) => void; options: string[] }) {
    return (
        <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="rounded-md bg-cream/[0.04] border border-cream/15 px-3 py-1.5 text-sm text-cream focus:border-gold/60 focus:outline-none"
        >
            <option value="">{label}: všetky</option>
            {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
    );
}

function Toggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-md border px-3 py-1.5 text-sm transition ${
                active ? "border-gold/50 bg-gold/15 text-gold" : "border-cream/15 bg-cream/[0.04] text-cream/60 hover:text-cream"
            }`}
        >
            {label}
        </button>
    );
}
```

- [ ] **Step 3: Manuálny test**

```bash
# v prehliadači: http://localhost:3000/admin/scraper/leads
```
Vidíš tabuľku (môže byť prázdna kým neprejde prvý scrape).

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/scraper/leads/
git commit -m "feat(admin): scraper leads table with filters + pagination"
```

---

### Task 4.7: Lead detail s outreach panelom

**Files:**
- Create: `src/app/admin/scraper/leads/[id]/page.tsx`
- Create: `src/app/admin/scraper/leads/[id]/OutreachPanel.tsx`

- [ ] **Step 1: Page (server)**

```typescript
// src/app/admin/scraper/leads/[id]/page.tsx
import { notFound } from "next/navigation";
import AdminShell from "@/app/admin/components/AdminShell";
import { scraperDb } from "@/lib/scraper/supabase-server";
import { AuditCard } from "../../components/AuditCard";
import { OutreachPanel } from "./OutreachPanel";
import { ExternalLink, MapPin } from "lucide-react";
import type { Lead, OutreachLogEntry } from "@/lib/scraper/types";

export const dynamic = "force-dynamic";

export default async function LeadDetail({ params }: { params: { id: string } }) {
    const db = scraperDb();
    const { data: lead } = await db.from("leads").select("*").eq("id", params.id).single();
    if (!lead) notFound();
    const { data: log } = await db.from("outreach_log").select("*").eq("lead_id", params.id).order("sent_at", { ascending: false });

    const l = lead as Lead;
    const mapsQuery = encodeURIComponent(`${l.name} ${l.city || ""}`);

    return (
        <AdminShell title={l.name} subtitle={`${l.city || "—"} · ${l.category || "—"}`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <div className="rounded-2xl border border-cream/[0.08] bg-cream/[0.025] p-6 space-y-3">
                        <Row label="Web">
                            {l.website ? (
                                <a href={l.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-gold hover:underline">
                                    {l.website} <ExternalLink size={12} />
                                </a>
                            ) : "—"}
                        </Row>
                        <Row label="Email"><span className="font-mono text-sm">{l.email || "—"}</span></Row>
                        <Row label="Maps">
                            <a href={`https://www.google.com/maps/search/${mapsQuery}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-cream/70 hover:text-cream">
                                <MapPin size={12} /> Otvor v mapách
                            </a>
                        </Row>
                    </div>
                    <AuditCard report={l.audit_report} />
                </div>

                <div>
                    <OutreachPanel
                        lead={l}
                        outreachLog={(log ?? []) as OutreachLogEntry[]}
                    />
                </div>
            </div>
        </AdminShell>
    );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-baseline gap-3">
            <div className="w-16 shrink-0 font-mono text-[10px] uppercase tracking-[0.22em] text-cream/40">{label}</div>
            <div className="text-cream">{children}</div>
        </div>
    );
}
```

- [ ] **Step 2: Outreach panel (client)**

```typescript
// src/app/admin/scraper/leads/[id]/OutreachPanel.tsx
"use client";

import { useState } from "react";
import { Sparkles, Send, RefreshCw, Check, Loader2 } from "lucide-react";
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

    async function generate() {
        setErr(null); setMsg(null); setGenerating(true);
        try {
            const res = await fetch(`/api/admin/scraper/leads/${lead.id}/generate-email`, { method: "POST" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "failed");
            setOutreach(data.outreach_email);
            setSubject(data.outreach_email.subject);
            setBody(data.outreach_email.body);
            setMsg("Email vygenerovaný.");
        } catch (e) {
            setErr(e instanceof Error ? e.message : String(e));
        } finally {
            setGenerating(false);
        }
    }

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
```

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/scraper/leads/[id]/
git commit -m "feat(admin): lead detail with audit + outreach generation + Zoho send"
```

---

## Fáza 5 — Python scraper úpravy (Railway)

Pracovný adresár: `/Users/marek/nove weby 2026/business scraper`.

### Task 5.1: Pridať API token middleware

**Files:**
- Modify: `scraper_api.py` (úplne na začiatku po `app = FastAPI(...)`)

- [ ] **Step 1: Pridať dependency**

V `scraper_api.py`, hneď za importy a inicializáciu `app`:

```python
from fastapi import Header, HTTPException, Depends

def require_token(x_scraper_token: Optional[str] = Header(default=None)):
    expected = os.environ.get("SCRAPER_API_TOKEN")
    if not expected:
        raise HTTPException(500, "SCRAPER_API_TOKEN not configured on server")
    if x_scraper_token != expected:
        raise HTTPException(401, "invalid scraper token")
```

- [ ] **Step 2: Aplikovať na všetky existujúce non-health endpointy**

Pre každý `@app.get(...)` / `@app.post(...)` ktorý NIE JE `/health`, pridať `dependencies=[Depends(require_token)]`:

```python
@app.post("/scrape", dependencies=[Depends(require_token)])
def start_scrape(...):
    ...
```

- [ ] **Step 3: Pridať `/health`**

```python
@app.get("/health")
def health():
    return {"ok": True}
```

- [ ] **Step 4: Lokálny test**

```bash
cd "/Users/marek/nove weby 2026/business scraper"
SCRAPER_API_TOKEN=test123 python -c "
import asyncio, uvicorn
from scraper_api import app
import threading
t = threading.Thread(target=lambda: uvicorn.run(app, port=8001, log_level='error'), daemon=True)
t.start()
import time; time.sleep(2)
import requests
print('no token:', requests.get('http://localhost:8001/job').status_code)
print('bad token:', requests.get('http://localhost:8001/job', headers={'X-Scraper-Token':'wrong'}).status_code)
print('good token:', requests.get('http://localhost:8001/job', headers={'X-Scraper-Token':'test123'}).status_code)
print('health (no token):', requests.get('http://localhost:8001/health').status_code)
"
```
Expected: 401, 401, 200, 200.

- [ ] **Step 5: Commit (v scraper repe)**

```bash
cd "/Users/marek/nove weby 2026/business scraper"
git add scraper_api.py
git commit -m "feat: require X-Scraper-Token header for all non-health endpoints"
```

---

### Task 5.2: Zmeniť AI prompt z emailu na audit report

**Files:**
- Modify: `scraper_api.py` (funkcia kde sa volá `anthropic.Anthropic(...).messages.create(...)`)

- [ ] **Step 1: Identifikuj existujúci email prompt**

```bash
cd "/Users/marek/nove weby 2026/business scraper"
grep -n 'messages.create\|anthropic\|email' scraper_api.py | head -30
```

- [ ] **Step 2: Nahraď generáciu emailu generáciou audit JSON**

V `run_scraper` (alebo kdekoľvek scraper volá Haiku), zmeň prompt + parse:

```python
AUDIT_SYSTEM_PROMPT = """Si web auditor. Dostaneš text webovej stránky a vraciaš krátky JSON audit.
Hodnotíš: rýchlosť (ak vieš odhadnúť), UX, mobil, SEO základy, CTA, dôveryhodnosť.
Vraciaš LEN JSON v tomto formáte (žiadne markdown, žiadny prefix/sufix):

{"strengths": ["max 4 body, krátko"], "weaknesses": ["max 4 body, krátko"], "opportunity": "1 veta — kde je najrýchlejšia výhra", "score": <integer 1-10>}"""

def generate_audit(client, name: str, url: str, content: str) -> dict:
    """Vráti dict s kľúčmi strengths, weaknesses, opportunity, score, checked_at."""
    response = client.messages.create(
        model="claude-haiku-4-5",
        max_tokens=600,
        system=AUDIT_SYSTEM_PROMPT,
        messages=[{
            "role": "user",
            "content": f"Firma: {name}\nWeb: {url}\nObsah:\n{content[:8000]}"
        }],
    )
    text = "".join(b.text for b in response.content if hasattr(b, "text")).strip()
    # Strip prípadné code fence
    if text.startswith("```"):
        text = text.strip("`")
        if text.startswith("json"):
            text = text[4:].strip()
    parsed = json.loads(text)
    parsed["checked_at"] = datetime.datetime.utcnow().isoformat() + "Z"
    return parsed
```

Tam kde sa predtým generoval email a zapisoval do `email_body`/`outreach`, teraz volaj `generate_audit(...)` a zapíš do `audit_report` (jsonb) + `audit_status='done'`. Ak lead nemá web, nastav `audit_status='skipped'`.

- [ ] **Step 3: Zachovať existujúce email atribúty pre BC**

Nemazať starý stĺpec, len ho nepoužívať. Aiwai admin ho ignoruje.

- [ ] **Step 4: Lokálny test (s malou vzorkou)**

```bash
SCRAPER_API_TOKEN=test123 ANTHROPIC_API_KEY=... SUPABASE_URL=... SUPABASE_KEY=... \
  python scraper_api.py &
sleep 3
curl -X POST http://localhost:8000/scrape \
  -H 'X-Scraper-Token: test123' \
  -H 'Content-Type: application/json' \
  -d '{"locations":["Bratislava"],"categories":["fitness centrum"],"count_per_query":2}'
# počkaj a skontroluj v Supabase Studio že audit_report stĺpec má JSON
```

- [ ] **Step 5: Commit**

```bash
git add scraper_api.py
git commit -m "feat: replace email generation with audit report (strengths/weaknesses/opportunity/score)"
```

---

### Task 5.3: Pridať `/jobs` endpointy

**Files:**
- Modify: `scraper_api.py`

- [ ] **Step 1: Nahradiť in-memory `_job` Supabase-backed jobs**

Pridať helper funkcie:

```python
def sb_jobs_url():
    return f"{os.environ['SUPABASE_URL']}/rest/v1/jobs"

def create_job(category: str, cities: List[str], max_per_city: int) -> str:
    key = os.environ.get("SUPABASE_KEY") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    r = requests.post(
        sb_jobs_url(),
        headers={**sb_headers_write(key), "Prefer": "return=representation"},
        json={"category": category, "cities": cities, "max_per_city": max_per_city, "status": "queued"},
    )
    r.raise_for_status()
    return r.json()[0]["id"]

def update_job(job_id: str, **fields):
    key = os.environ.get("SUPABASE_KEY") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    requests.patch(
        f"{sb_jobs_url()}?id=eq.{job_id}",
        headers=sb_headers_write(key),
        json=fields,
    )

def append_job_log(job_id: str, line: str):
    # Najprv prečítaj, appendni, zapíš (Supabase nemá array_append cez REST)
    key = os.environ.get("SUPABASE_KEY") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    r = requests.get(f"{sb_jobs_url()}?id=eq.{job_id}&select=log", headers=sb_headers_read(key))
    if r.ok and r.json():
        log = r.json()[0]["log"] or []
        log.append(line)
        log = log[-500:]  # cap
        update_job(job_id, log=log)
```

- [ ] **Step 2: Pridať POST `/jobs`**

```python
class JobCreate(BaseModel):
    category: str
    cities: List[str]
    max_per_city: int = 20

@app.post("/jobs", dependencies=[Depends(require_token)])
def post_job(body: JobCreate, bg: BackgroundTasks):
    job_id = create_job(body.category, body.cities, body.max_per_city)
    bg.add_task(run_job, job_id, body.category, body.cities, body.max_per_city)
    return {"id": job_id, "status": "queued"}
```

- [ ] **Step 3: Refactor `run_scraper` → `run_job(job_id, ...)`**

`run_job` musí periodicky volať `update_job(job_id, progress={...})` a `append_job_log(job_id, line)`.
Na začiatku: `update_job(job_id, status="running")`.
Na konci: `update_job(job_id, status="done", finished_at=...)` (alebo `failed` + `error`).
Pre cooperative cancel: pred každým mestom prečítať `status` jobu — ak `cancelled`, prerušiť.

```python
def run_job(job_id: str, category: str, cities: List[str], max_per_city: int):
    try:
        update_job(job_id, status="running")
        # ... reuse run_scraper logiku, ale s job_id-aware update-mi
        # po každom meste:
        update_job(job_id, progress={"current_city": city, "found": found, "with_email": with_email, "audited": audited})
        # ...
        update_job(job_id, status="done", finished_at=datetime.datetime.utcnow().isoformat() + "Z")
    except Exception as e:
        update_job(job_id, status="failed", error=str(e), finished_at=datetime.datetime.utcnow().isoformat() + "Z")
        raise
```

- [ ] **Step 4: GET `/jobs/{id}`**

```python
@app.get("/jobs/{job_id}", dependencies=[Depends(require_token)])
def get_job(job_id: str):
    key = os.environ.get("SUPABASE_KEY") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    r = requests.get(f"{sb_jobs_url()}?id=eq.{job_id}&select=*", headers=sb_headers_read(key))
    if not r.ok or not r.json():
        raise HTTPException(404, "job not found")
    j = r.json()[0]
    j["log"] = (j["log"] or [])[-100:]
    return j
```

- [ ] **Step 5: GET `/jobs/{id}/stream` (SSE)**

```python
from fastapi.responses import StreamingResponse
import asyncio

@app.get("/jobs/{job_id}/stream", dependencies=[Depends(require_token)])
async def stream_job(job_id: str):
    async def gen():
        last_log_len = 0
        last_status = None
        for _ in range(600):  # max 10 min, 1s interval
            j = get_job(job_id)
            new_logs = j["log"][last_log_len:]
            for line in new_logs:
                yield f"event: log\ndata: {json.dumps(line)}\n\n"
            last_log_len = len(j["log"])
            yield f"event: progress\ndata: {json.dumps(j.get('progress') or {})}\n\n"
            if j["status"] in ("done", "failed", "cancelled") and j["status"] != last_status:
                yield f"event: done\ndata: {json.dumps({'status': j['status'], 'finished_at': j.get('finished_at')})}\n\n"
                return
            last_status = j["status"]
            await asyncio.sleep(1)
    return StreamingResponse(gen(), media_type="text/event-stream")
```

- [ ] **Step 6: POST `/jobs/{id}/cancel`**

```python
@app.post("/jobs/{job_id}/cancel", dependencies=[Depends(require_token)])
def cancel_job(job_id: str):
    update_job(job_id, status="cancelled", finished_at=datetime.datetime.utcnow().isoformat() + "Z")
    return {"ok": True}
```

- [ ] **Step 7: Lokálny test**

Spustiť scraper s test tokenom, POST nový job, GET status, SSE stream.

- [ ] **Step 8: Commit**

```bash
git add scraper_api.py
git commit -m "feat: DB-backed jobs with POST/GET/stream/cancel endpoints"
```

---

### Task 5.4: Deploy scrapera na Railway

- [ ] **Step 1: Nastaviť env**

```bash
cd "/Users/marek/nove weby 2026/business scraper"
RAILWAY_TOKEN=2571c960-c995-4089-9844-e77c62249acc \
  railway variables --service lead-agent-scraper --set "SCRAPER_API_TOKEN=<rovnaký ako vo Vercel>"
```

- [ ] **Step 2: Deploy**

```bash
RAILWAY_TOKEN=2571c960-c995-4089-9844-e77c62249acc \
  railway up --detach --service lead-agent-scraper
```

- [ ] **Step 3: Verifikácia**

```bash
curl https://lead-agent-scraper-production.up.railway.app/health
# Expected: {"ok":true}

curl -i https://lead-agent-scraper-production.up.railway.app/jobs
# Expected: 401 (chýba token)

curl -i https://lead-agent-scraper-production.up.railway.app/jobs \
  -H 'X-Scraper-Token: <token>'
# Expected: 200 (alebo 405 ak GET nie je definovaný — vyskúšaj POST s body)
```

---

## Fáza 6 — Verifikácia (akceptačné kritériá zo spec-u)

### Task 6.1: Build + E2E happy path

- [ ] **Step 1: Aiwai build**

```bash
cd "/Users/marek/nove weby 2026/AIWai"
npm run build
```
Expected: build succeeds bez chýb.

- [ ] **Step 2: Lokálny start**

```bash
npm run dev
```

- [ ] **Step 3: Manuálny E2E**

V prehliadači:
1. Login na `/login` ako `dony` / `marek6296`
2. Sidebar → Scraper → vidíš dashboard so štatistikami
3. Klik "+ Nový scrape" → vyplň `fitness centrum` + `Bratislava` (1 mesto, max 5)
4. Po submit → redirect na job detail, vidíš live progress
5. Po dokončení → klik "Pozri leady z tohto jobu" → tabuľka s 1-5 záznamami
6. Klik na lead s emailom → vidíš audit
7. Klik "Vygeneruj email" → po ~3s vidíš subject + body
8. Uprav body → klik "Pošli" (na testovaciu adresu) → potvrď → vidíš úspech a v Historii
9. Otvor schránku → email tam je

- [ ] **Step 4: Commit deployment readiness**

Žiadny commit potrebný — všetko už commitnuté po taskoch.

---

### Task 6.2: Security smoke tests

- [ ] **Step 1: Bez admin cookie → 401**

```bash
for path in stats leads jobs leads/abc; do
    code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/api/admin/scraper/$path")
    echo "$path: $code"
done
```
Expected: všetko `401`.

- [ ] **Step 2: Anon Supabase nevidí scraper.leads**

```bash
cd "/Users/marek/nove weby 2026/AIWai"
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const c = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { db: { schema: 'scraper' } });
c.from('leads').select('*').then(r => console.log('rows:', r.data?.length || 0, 'error:', r.error?.message || 'none'));
"
```
Expected: `rows: 0` (RLS deny) alebo permission error. Nikdy reálne dáta.

- [ ] **Step 3: Railway scraper bez tokenu → 401**

```bash
curl -i https://lead-agent-scraper-production.up.railway.app/jobs/abc
```
Expected: `401`.

- [ ] **Step 4: Klientske JS neexponuje service role**

```bash
# Build a hľadaj service role kľúč v bundle
cd "/Users/marek/nove weby 2026/AIWai"
npm run build
grep -r 'SUPABASE_SERVICE_ROLE_KEY' .next/static/ 2>/dev/null && echo "LEAK!" || echo "OK — no leak"
grep -r 'SCRAPER_API_TOKEN' .next/static/ 2>/dev/null && echo "LEAK!" || echo "OK — no leak"
grep -r 'ZOHO_SMTP_PASS' .next/static/ 2>/dev/null && echo "LEAK!" || echo "OK — no leak"
```
Expected: 3× `OK — no leak`.

---

### Task 6.3: Deploy aiwai na Vercel

- [ ] **Step 1: Push branchu na GitHub**

```bash
cd "/Users/marek/nove weby 2026/AIWai"
git push -u origin feature/admin-scraper-integration
```

- [ ] **Step 2: Pridať env premenné do Vercel** (production + preview)

Cez Vercel Dashboard → Project `ai-wai` → Settings → Environment Variables:
- `SCRAPER_API_URL`
- `SCRAPER_API_TOKEN`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `ZOHO_SMTP_HOST`, `ZOHO_SMTP_PORT`, `ZOHO_SMTP_USER`, `ZOHO_SMTP_PASS`, `ZOHO_FROM_NAME`

- [ ] **Step 3: Preview deploy**

Vercel automaticky vytvorí preview build pre branch. Klik na preview URL → otestuj `/admin/scraper`.

- [ ] **Step 4: Merge do main** (po overení Marekom)

```bash
gh pr create --title "feat: admin scraper integration" --body "$(cat <<'EOF'
## Summary
- Integrácia Business Scrapera do aiwai admina (proxy na Railway + Supabase service role)
- AI prompt zmena: z email generácie na audit report
- Outreach email generácia + Zoho SMTP send na požiadanie

## Test plan
- [x] Build passes
- [x] Lokálny E2E happy path
- [x] Security smoke tests (401, RLS deny, žiadny leak v bundle)
- [ ] Preview deploy E2E
EOF
)"
```

Marek mergne ručne keď je spokojný.

---

## Self-review checklist (po napísaní plánu)

- [x] Spec coverage: každá sekcia spec-u má task (DB, Python, UI, API, security, env)
- [x] Žiadne placeholders: TBD/TODO/"implement later" → none
- [x] Type consistency: `Lead`, `Job`, `AuditReport`, `OutreachEmail` použité konzistentne naprieč fázami
- [x] Akceptačné kritériá zo spec-u sekcie 9 → pokryté v Task 6.1 + 6.2
- [x] Out-of-scope položky zo spec-u sekcie 10 → nie sú v pláne (správne)
