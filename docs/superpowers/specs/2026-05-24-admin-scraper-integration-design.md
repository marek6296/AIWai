# Admin Scraper Integration — Design Spec

**Dátum:** 2026-05-24
**Autor:** Marek Donoval (s pomocou Claude)
**Status:** Draft → na schválenie
**Branch:** `feature/admin-scraper-integration`

---

## 1. Motivácia a cieľ

Business Scraper (Python FastAPI na Railway + samostatný Next.js dashboard na Vercel)
generuje leady z Google Maps, hľadá emaily a doteraz pri každom leade s emailom
volal Claude Haiku, aby vygeneroval personalizovaný outreach SK email.

Cieľ tejto integrácie:

1. Presunúť ovládacie a zobrazovacie rozhranie scrapera do **aiwai.app/admin** v jednotnom
   dark/gold štýle, aby všetko bolo na jednom mieste.
2. **Zmeniť správanie scrapera:** AI už negeneruje email. Namiesto toho robí **krátky
   audit report stránky** (silné stránky / slabiny / príležitosť / score). Generovanie
   outreach emailu sa stane samostatnou akciou v admine na požiadanie.
3. Pridať možnosť **odoslať vygenerovaný email priamo z admina** cez Zoho SMTP.
4. **Bezpečnosť:** kontakty (emaily firiem) a celé scraper UI sú dostupné výlučne
   prihlásenému adminovi. Žiadny anon prístup, žiadne klientske volanie scraper schémy
   v Supabase.

Tento spec **nemení** existujúci samostatný Vercel dashboard
(`lead-agent-dashboard-smoky.vercel.app`) — zostáva nedotknutý a môže byť neskôr deprekovaný.

---

## 2. Architektúra

```
┌─────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│  aiwai.app      │ proxy   │  Railway scraper │  scrape │  Google Maps     │
│  /admin/scraper │ ──────► │  FastAPI (Python)│ ──────► │  + cieľové weby  │
│  (Next.js)      │ ◄────── │  Playwright      │         └──────────────────┘
└────────┬────────┘   SSE   └─────────┬────────┘
         │                            │
         │ service role               │ insert/update
         ▼                            ▼
   ┌──────────────────────────────────────────┐
   │  Supabase  (schema: scraper)             │
   │  tabuľky: leads, jobs, outreach_log      │
   └──────────────────────────────────────────┘
         ▲
         │ Zoho SMTP (nodemailer) pre send
```

### 2.1 Komponenty a hranice

| Vrstva | Zodpovednosť | Hranica |
|---|---|---|
| **Aiwai admin UI** (Next.js, RSC + client) | Render dashboardu, formov, tabuliek, detailov. Žiadna business logika. | Nikdy nevolá Railway ani Supabase scraper schému priamo z browsera. |
| **Aiwai API routes** `/api/admin/scraper/*` | Auth gate (admin cookie), Supabase server-side reads, proxy do Railway, Haiku generácia, Zoho send. | Jediný most medzi browser-om a backendmi. Drží tokeny a kredence. |
| **Railway scraper** (FastAPI Python) | Google Maps scraping, email lookup, audit-report generácia cez Haiku, zápis do Supabase. | Volaný len cez `X-Scraper-Token` (shared secret). |
| **Supabase `scraper` schéma** | Perzistencia leadov, jobov, outreach logov. | Anon key nemá prístup k schéme. Service role kľúč len server-side. |

### 2.2 Tok dát — typické scenáre

**Spustenie scrape jobu:**
1. Admin vyplní form na `/admin/scraper/jobs/new` (kategória + mestá + limit).
2. Browser POST `/api/admin/scraper/jobs` → Next.js route over cookie → forward na Railway
   `POST /jobs` s `X-Scraper-Token`.
3. Railway vytvorí riadok v `scraper.jobs` (status `queued`), spustí background task,
   vráti `job_id`.
4. Next.js redirectne na `/admin/scraper/jobs/<id>` ktorý otvorí SSE stream
   `/api/admin/scraper/jobs/<id>/stream` (Next.js route → Railway `GET /jobs/<id>/stream`).
5. Railway počas behu updatuje `scraper.jobs.progress` + appenduje do `log`, posiela
   SSE eventy `progress`, `log`, `done`.

**Zobrazenie leadov:**
1. Admin otvorí `/admin/scraper/leads` → server component číta Supabase scraper schému
   priamo cez service role (rýchle, žiadny Railway hop).
2. Filtre/pagination cez query params, re-render.

**Generovanie outreach emailu:**
1. Admin klikne "Vygeneruj email" na detail leadu.
2. POST `/api/admin/scraper/leads/<id>/generate-email` → server načíta lead + audit
   z Supabase → zavolá Anthropic Haiku s outreach promptom → uloží do
   `scraper.leads.outreach_email` (JSON `{subject, body}`) → vráti oboje.

**Odoslanie emailu:**
1. Admin upraví text v textarea, klikne "Pošli".
2. POST `/api/admin/scraper/leads/<id>/send` { subject, body }
   → server vytvorí nodemailer Zoho transport → odošle →
   zapíše do `scraper.outreach_log` + updatne `email_sent_at` + `email_status`.

---

## 3. Dátový model (Supabase, schema `scraper`)

### 3.1 Existujúca tabuľka `scraper.leads` — pridať stĺpce

```sql
ALTER TABLE scraper.leads
  ADD COLUMN IF NOT EXISTS audit_report   jsonb,
  ADD COLUMN IF NOT EXISTS audit_status   text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS outreach_email jsonb,  -- { subject, body, model, generated_at }
  ADD COLUMN IF NOT EXISTS email_sent_at  timestamptz,
  ADD COLUMN IF NOT EXISTS email_status   text,
  ADD COLUMN IF NOT EXISTS job_id         uuid;

-- audit_status: pending | done | failed | skipped (no website)
-- email_status: null | sent | failed | bounced
```

`audit_report` JSON štruktúra:
```json
{
  "strengths":   ["Rýchla mobilná verzia", "Jasné CTA v hlavičke"],
  "weaknesses":  ["Žiadne SEO meta tagy", "Pomalý LCP (5.2s)"],
  "opportunity": "Implementáciou základného SEO + zrýchlením by mohli zdvojnásobiť organickú návštevnosť.",
  "score":       6,
  "checked_at":  "2026-05-24T14:30:00Z"
}
```

### 3.2 Nová tabuľka `scraper.jobs`

```sql
CREATE TABLE IF NOT EXISTS scraper.jobs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category    text NOT NULL,
  cities      text[] NOT NULL,
  max_per_city integer NOT NULL DEFAULT 20,
  status      text NOT NULL DEFAULT 'queued',
  progress    jsonb NOT NULL DEFAULT '{}'::jsonb,
  log         text[] NOT NULL DEFAULT '{}',
  started_at  timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  error       text
);

-- status: queued | running | done | failed | cancelled
-- progress: { current_city, found, with_email, audited }
-- log: cap 500 najnovších riadkov (Python side, drop oldest)
```

### 3.3 Nová tabuľka `scraper.outreach_log`

```sql
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
CREATE INDEX IF NOT EXISTS outreach_log_lead_idx ON scraper.outreach_log(lead_id);
```

### 3.4 RLS

Pre všetky tri tabuľky (`leads`, `jobs`, `outreach_log`) zapnúť RLS s **deny-all**
polícou pre `anon` aj `authenticated` rolu. Service role bypasuje RLS, takže
server-side Next.js (a Python scraper) fungujú bez políčok. Toto je obranná vrstva
proti omylu — ak by niekto omylom vyexportoval anon key s prístupom na scraper schému.

```sql
ALTER TABLE scraper.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraper.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraper.outreach_log ENABLE ROW LEVEL SECURITY;

-- Žiadne polícy = deny by default pre non-service-role.
```

---

## 4. Python scraper úpravy (Railway)

Lokálne: `/Users/marek/nove weby 2026/business scraper`. Súbor `scraper_api.py`.

### 4.1 API token middleware

Pridať FastAPI dependency ktorý overuje header `X-Scraper-Token` proti env
`SCRAPER_API_TOKEN`. Aplikovať na všetky endpointy okrem `/health`.

```python
async def require_api_token(x_scraper_token: str = Header(None)):
    expected = os.environ.get("SCRAPER_API_TOKEN")
    if not expected or x_scraper_token != expected:
        raise HTTPException(401, "invalid token")
```

### 4.2 Zmena AI promptu — z emailu na audit report

Lokácia: kdekoľvek dnes scraper volá Claude Haiku s outreach promptom. Nový prompt
generuje **iba** audit report v JSON formáte (sekcia 3.1).

Outreach generácia sa zo scrapera **úplne odstráni** — to robí Next.js admin
na požiadanie.

System prompt (SK):
```
Si web auditor. Dostaneš text webovej stránky a vraciaš krátky JSON audit.
Hodnotíš: rýchlosť (ak vieš odhadnúť), UX, mobil, SEO základy, CTA, dôveryhodnosť.
Vraciaš LEN JSON v tomto formáte (žiadne markdown, žiadny prefix/sufix):

{
  "strengths":   ["max 4 body, krátko"],
  "weaknesses":  ["max 4 body, krátko"],
  "opportunity": "1 veta — kde je najrýchlejšia výhra",
  "score":       <integer 1-10>
}
```

User prompt: `f"Firma: {name}\nWeb: {url}\nObsah:\n{first_8000_chars}"`

### 4.3 Nové endpointy

| Metóda | Cesta | Popis |
|---|---|---|
| `POST` | `/jobs` | Body: `{category, cities[], max_per_city}`. Vytvorí job v Supabase, spustí background task, vráti `{id, status}`. |
| `GET` | `/jobs/{id}` | Vráti aktuálny stav jobu (status + progress + posledných 100 log riadkov). |
| `GET` | `/jobs/{id}/stream` | SSE stream eventov `progress`, `log`, `done`, `error`. Drží spojenie kým job nedobehne alebo nezomrie. |
| `POST` | `/jobs/{id}/cancel` | Kooperatívne ukončenie (set flag, scraper kontroluje medzi iteráciami). |
| `GET` | `/health` | Bez auth. Vráti `{ok: true}`. |

Staré synchronné endpointy (`/scrape`) zachovať pre BC — admin ich nepoužíva.

### 4.4 Background task implementácia

FastAPI `BackgroundTasks` alebo `asyncio.create_task` — scrape beží asynchrónne,
po každej zmene stavu updatuje `scraper.jobs` riadok. SSE handler poolne Supabase
(alebo in-memory pub/sub) každú sekundu a posiela diff.

**Pozn.:** Ak by SSE bolo problémové na Railway behind proxy, fallback je polling
z aiwai admina každú sekundu cez `GET /jobs/{id}`. SSE je preferované, polling je
acceptable.

### 4.5 Env premenné

| Premenná | Popis |
|---|---|
| `SCRAPER_API_TOKEN` | Shared secret pre auth (rovnaký ako v aiwai) |
| `SUPABASE_URL` | (existuje) |
| `SUPABASE_SERVICE_ROLE_KEY` | (môže existovať ako `SUPABASE_KEY` — overiť že je to service role, nie anon) |
| `ANTHROPIC_API_KEY` | (existuje, pre Haiku) |

---

## 5. Aiwai admin — UI a routing

### 5.1 Sidebar

Pridať položku **"Scraper"** s ikonou `Radar` (Lucide) do `AdminShell.tsx`,
medzi existujúce sekcie. Bez sub-itemov; aktívna stránka sa zobrazuje breadcrumb-om
v rámci stránky.

### 5.2 Stránky

```
/admin/scraper                  → Dashboard (server component)
/admin/scraper/jobs/new         → Form pre nový scrape
/admin/scraper/jobs/[id]        → Live detail jobu (client component pre SSE)
/admin/scraper/leads            → Tabuľka leadov s filtrami
/admin/scraper/leads/[id]       → Detail leadu (audit + email akcie)
```

### 5.3 Dashboard — `/admin/scraper`

- **4× StatCard**: `Leady spolu`, `S emailom`, `Audited`, `Maily odoslané`
- **Panel "Posledné joby"**: 5 riadkov z `scraper.jobs` ORDER BY started_at DESC
  - Status chip (queued/running/done/failed), kategória, mestá (max 3 + "...+N"),
    počty (found/with_email), čas behu, link na detail
- **Panel "Top kategórie"**: GROUP BY `leads.category` → bar list top 10
- **CTA**: tlačidlo "+ Nový scrape" v topbare → `/admin/scraper/jobs/new`

### 5.4 Form — `/admin/scraper/jobs/new`

- Input: **Kategória** (text, placeholder "fitness centrum")
- Input: **Mestá** (tag input — Enter pridá chip, X odstráni)
- Input: **Max výsledkov per mesto** (number, default 20, max 100)
- Submit → POST → redirect na `/admin/scraper/jobs/[id]`
- Validácia: kategória povinná (1-80 znakov), aspoň 1 mesto, max 10 miest naraz
  (defenzívna hranica — väčší batch sa rozdelí).

### 5.5 Detail jobu — `/admin/scraper/jobs/[id]`

Client component (potrebuje SSE).

- Header: kategória + chipy miest + status badge + tlačidlo "Zrušiť" (ak running)
- **Progress karta** (live):
  - Current city, Found, With email, Audited (4 čísla, gold)
  - Progress bar (audited / found * 100, ak found > 0)
- **Log panel**: terminal-style (čierne pozadie, monospace), auto-scroll,
  WARN/ERROR farebne. Max 500 riadkov v UI (server posiela posledných 500).
- Po dokončení (status=done|failed): tlačidlo "Pozri leady z tohto jobu" →
  `/admin/scraper/leads?job_id=<id>`

### 5.6 Tabuľka leadov — `/admin/scraper/leads`

Server component s search params pre filtre.

**Filtre (top bar):**
- Kategória (select, plnené distinct z DB)
- Mesto (select)
- Job (select — voliteľné, default all)
- Toggle: Má email
- Toggle: Má audit
- Toggle: Email odoslaný
- Search (názov firmy, fulltext ILIKE)

**Tabuľka:**
| Stĺpec | Obsah |
|---|---|
| Názov | text, klik → detail |
| Mesto | text |
| Kategória | chip |
| Web | external link icon (otvorí na nový tab) |
| Email | text alebo "—" |
| Audit | score chip (farba podľa score: 1-3 red, 4-6 amber, 7-10 emerald) alebo "—" |
| Mail status | "—" / "sent ✓" / "failed" |
| Akcie | tlačidlo "Detail" |

Pagination 50/page, server-side count.

### 5.7 Detail leadu — `/admin/scraper/leads/[id]`

- **Header**: názov + meta (mesto · kategória) + odkazy (web, Google Maps query link)
- **Panel "Audit report"** (ak `audit_report` exists):
  - Score: veľký gold kruh s číslom
  - Sekcia "Silné stránky": green chipy
  - Sekcia "Slabiny": amber chipy
  - Sekcia "Príležitosť": gold-bordered quote
  - "Audit z: <date>"
- **Panel "Outreach email"**:
  - Ak `outreach_email IS NULL`:
    - Veľké tlačidlo **"Vygeneruj email"** (Haiku call, spinner ~3s)
  - Ak vygenerovaný:
    - Input "Subject" (predvyplnený z `outreach_email.subject`, editovateľný)
    - Textarea "Body" (predvyplnená z `outreach_email.body`, editovateľná,
      autosave do `localStorage` per lead — neuloží sa do DB pokým neklikneš
      "Pošli" alebo "Regeneruj")
    - Tlačidlo **"Pošli"** (volá `/send` s aktuálnym subject + body)
    - Tlačidlo **"Označiť ako odoslané ručne"** (nastaví `email_status='sent'`,
      `email_sent_at=now()`, nezavolá SMTP)
    - Tlačidlo **"Regeneruj"** (zavolá generate-email znova, prepíše)
- **Panel "História odoslaní"**: tabuľka z `scraper.outreach_log` pre tento lead
  (sent_at, to_email, subject, status)

### 5.8 Štýl a komponenty

Reuse existujúcich admin primitives:
- `AdminShell` — netreba meniť okrem sidebar položky
- `StatCard`, `Panel` z `AdminPanels.tsx`
- `Card`/`CardHeader`/... z `src/components/ui/card.tsx`
- Tailwind utility, žiadne nové dependency okrem `nodemailer`

Gold accenty (border, text, glow) konzistentné so zvyškom admina. Žiadne emoji.

---

## 6. Aiwai API routes — `/api/admin/scraper/*`

Všetky routes začínajú admin auth checkom (helper `requireAdmin()` ktorý prečíta
cookie `cb_admin_session` a porovná s `ADMIN_AUTH_TOKEN` env). 401 ak nesedí.

| Metóda | Cesta | Body / params | Backend |
|---|---|---|---|
| `POST` | `/api/admin/scraper/jobs` | `{category, cities[], max_per_city}` | proxy → Railway POST `/jobs` |
| `GET` | `/api/admin/scraper/jobs` | `?limit=20` | Supabase `scraper.jobs` ORDER BY started_at DESC |
| `GET` | `/api/admin/scraper/jobs/[id]` | — | proxy → Railway GET `/jobs/{id}` |
| `GET` | `/api/admin/scraper/jobs/[id]/stream` | — | proxy SSE → Railway `/jobs/{id}/stream` |
| `POST` | `/api/admin/scraper/jobs/[id]/cancel` | — | proxy → Railway POST `/jobs/{id}/cancel` |
| `GET` | `/api/admin/scraper/leads` | filter query params | Supabase scraper.leads |
| `GET` | `/api/admin/scraper/leads/[id]` | — | Supabase + outreach_log |
| `POST` | `/api/admin/scraper/leads/[id]/generate-email` | — | Anthropic Haiku → update lead |
| `POST` | `/api/admin/scraper/leads/[id]/send` | `{subject, body}` | nodemailer Zoho → log + update lead |
| `GET` | `/api/admin/scraper/stats` | — | Supabase aggregate counts |

### 6.1 SSE proxy implementácia

Next.js Route Handler vráti `Response` s `ReadableStream` ktorý fetchne Railway SSE
endpoint a forwarduje chunky. Header `Cache-Control: no-cache`, `Connection: keep-alive`,
`Content-Type: text/event-stream`.

### 6.2 Rate-limit

In-memory token bucket per session (key = `cb_admin_session` cookie hash):
- `generate-email`: 20/min
- `send`: 20/min
- `jobs POST`: 10/min

Bucket sa restartne pri redeploy — acceptable pre admin tool.

### 6.3 Email generácia — outreach prompt

Použije `@anthropic-ai/sdk` (existing alebo nový dependency). Model `claude-haiku-4-5`.

System prompt: jazyk SK, max 130 slov, priateľský tón, štruktúra (predstavenie
→ konkrétna príležitosť z audit reportu → ponuka auditu/hovoru), podpis Marek
Donoval / AIWai. Toto je prevzaté zo starého scraper promptu (zachované znenie),
len dáta vstupu sú zo `audit_report` + lead metadáta.

User prompt obsahuje: názov firmy, web URL, audit JSON.

Output formát — Haiku musí vrátiť JSON:
```json
{
  "subject": "Krátky SK subject (max 60 znakov)",
  "body": "Plain text email, max 130 slov, končí podpisom."
}
```

Server zapíše do `scraper.leads.outreach_email` ako:
```json
{
  "subject": "...",
  "body": "...",
  "model": "claude-haiku-4-5",
  "generated_at": "2026-05-24T15:00:00Z"
}
```

### 6.4 Zoho SMTP send

`nodemailer.createTransport({ host, port: 465, secure: true, auth: {user, pass} })`.
Transport vytvorený per-request (nie singleton — admin posiela zriedka, ušetríme
edge case so stale connections). `from: '"Marek Donoval" <marek@aiwai.app>'`,
`to: lead.email`, `subject`, `text: body` (plain text, nie HTML — outreach text
formát).

Po `transport.sendMail()`:
- Úspech: insert do `outreach_log` (status=sent), update lead (email_sent_at, email_status=sent).
- Chyba: insert do `outreach_log` (status=failed, error=err.message), update lead (email_status=failed).

---

## 7. Bezpečnosť — defense in depth

1. **Middleware**: existujúci aiwai middleware chráni `/admin/*`. **Verifikovať** že
   pokrýva aj `/api/admin/*`. Ak nie, doplniť matcher.
2. **Server-only Supabase klient**: helper `src/lib/scraper/supabase-server.ts` vytvorí
   klienta so service role key. Súbor je import-only zo server kontextu — pridať guard
   `if (typeof window !== 'undefined') throw new Error('server-only')`.
3. **Railway token**: `SCRAPER_API_TOKEN` v Vercel env (server-only). Python
   middleware odmietne všetko bez správneho headeru.
4. **Zoho creds**: len server env. Nikdy v response payload.
5. **RLS deny-all**: na všetkých 3 tabuľkách (sekcia 3.4).
6. **Rate-limit**: sekcia 6.2.
7. **CSRF**: POST endpointy vyžadujú admin cookie (SameSite=Lax stačí — nemáme
   cross-origin admin volania).
8. **Logging**: žiadne tokens/credentials v logoch. Email obsah v `outreach_log`
   je acceptable (je to interná audit trail; access cez admin only).

---

## 8. Env premenné — sumár

### Vercel aiwai (production + preview)

| Premenná | Príklad | Zdroj |
|---|---|---|
| `SCRAPER_API_URL` | `https://lead-agent-scraper-production.up.railway.app` | existuje URL, treba pridať ako env |
| `SCRAPER_API_TOKEN` | `<32-byte hex>` | nový — vygenerovať |
| `SUPABASE_URL` | (existuje) | — |
| `SUPABASE_SERVICE_ROLE_KEY` | (môže existovať) | overiť že je service role |
| `ANTHROPIC_API_KEY` | `sk-ant-...` | nový alebo existing |
| `ZOHO_SMTP_HOST` | `smtp.zoho.eu` | nový |
| `ZOHO_SMTP_PORT` | `465` | nový |
| `ZOHO_SMTP_USER` | `marek@aiwai.app` (TBC) | nový — Marek povie ktorú adresu |
| `ZOHO_SMTP_PASS` | `<app password>` | nový — vygenerovať v Zoho |
| `ZOHO_FROM_NAME` | `Marek Donoval` | nový |

### Railway scraper

| Premenná | Príklad |
|---|---|
| `SCRAPER_API_TOKEN` | rovnaký token ako vyššie |

---

## 9. Akceptačné kritériá

Implementácia je hotová keď:

1. Admin login → `/admin/scraper` zobrazí dashboard so štatistikami z DB.
2. Admin spustí scrape job s 1 kategóriou + 2 mestami; sleduje live progress
   v detail stránke; po dokončení vidí nové leady v tabuľke.
3. Lead s emailom má vyplnený `audit_report` JSON v predpísanej štruktúre.
4. Lead bez webu má `audit_status='skipped'`.
5. Klik na "Vygeneruj email" v detaile leadu vytvorí SK outreach `{subject, body}`
   (body ~100-130 slov), uloží do DB ako JSON, zobrazí subject v inpute a body v textarea.
6. Klik na "Pošli" odošle email cez Zoho, vytvorí riadok v `outreach_log`,
   nastaví `email_sent_at` a `email_status='sent'`.
7. Anonymný request (bez admin cookie) na ľubovoľný `/api/admin/scraper/*` vráti 401.
8. Anonymný request priamo na Railway scraper (bez `X-Scraper-Token`) vráti 401.
9. Z prehliadača nie je možné selectnúť `scraper.leads` cez Supabase JS klienta
   s anon key (RLS deny).
10. Existujúci samostatný Vercel dashboard naďalej funguje (nezmenený).

---

## 10. Out of scope (vedome odložené)

- Cron / scheduled scraping (admin spúšťa manuálne).
- Email open/click tracking.
- Bulk operations (select-all leadov + "send to all").
- A/B varianty outreach textu.
- Webhook notifikácie pri done jobe.
- Migrácia starých leadov ktoré nemajú `audit_report` (zostanú s `audit_status='pending'`,
  Marek ich môže re-auditovať jednotlivo neskôr — alebo cez budúci batch endpoint).
- Deprekácia samostatného Vercel dashboardu (nech beží paralelne, prepneme keď
  bude admin verzia overená).

---

## 11. Otvorené otázky pre Mareka

Pred štartom implementácie potrebujem od teba:

1. **Z akej Zoho adresy** posielať outreach? `marek@aiwai.app`? `dony@aiwai.app`?
   Iná? Treba mať pre ňu Zoho App Password.
2. **Anthropic API key**: máš už existujúci alebo treba vytvoriť nový?
   (Vidím že chatbot používa Gemini, scraper má Claude — kľúč asi v scraper env.)
3. **Migrácia DB**: chceš ALTER + CREATE TABLE spustiť ručne v Supabase UI,
   alebo pridať do `supabase/migrations/`?

Tieto odpovede nie sú blockerom spec-u — môžu prísť pred fázou execution.
