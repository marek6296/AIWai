# 🔍 AIWai — Kompletný audit stránky (16. máj 2026)

**Stack:** Next.js 14.2.35 (App Router) · React 18 · TypeScript strict · Tailwind 3.4 · Supabase · Gemini AI · Retell Voice · Resend

**Celková známka:** 🟡 **7.5 / 10** — projekt je profesionálne navrhnutý, ale pred „ostrým" spustením treba doriešiť 3 kritické security veci a zjednotiť cenník.

---

## 🔴 KRITICKÉ — vyriešiť IHNEĎ pred deploy

### 1. Admin prihlasovacie údaje sú hardcoded v source code
**Súbor:** `src/app/api/auth/simple-login/route.ts` (riadky 3–5) a `src/middleware.ts` (riadok 3)

```ts
const VALID_USERNAME = 'dony'
const VALID_PASSWORD = 'qwert'
const AUTH_TOKEN = 'cb_dony_aiwai_2026_secret'
```

Ktokoľvek si pozrie GitHub repo, vidí heslo. Heslo je navyše veľmi slabé (`qwert`).

**Riešenie:**
- Presunúť do `.env.local`: `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` (bcrypt hash), `ADMIN_AUTH_TOKEN`
- Použiť bcrypt na porovnanie hesla
- Nastaviť silné heslo (16+ znakov, random)
- Vo Vercel pridať tieto env vars do production

### 2. Admin API endpointy NEMAJÚ autentifikáciu
**Súbory:** `src/app/api/admin/upload-pdf/route.ts`, `src/app/api/admin/delete-pdf/route.ts`, `src/app/api/admin/chatbot-settings/route.ts`

Middleware (`src/middleware.ts` riadok 33) explicitne **vylúčil `/api` z matcheru**. Routes `/admin/*` (stránky) sú chránené, ale `/api/admin/*` (endpointy) nie. Útočník môže priamo zavolať:

```bash
curl -X POST https://aiwai.app/api/admin/upload-pdf -F "pdf=@evil.pdf"
curl -X DELETE https://aiwai.app/api/admin/delete-pdf -d '{"docId":"..."}'
```

**Riešenie:** Na začiatok každého admin route pridať:
```ts
const token = req.cookies.get('cb_admin_session')?.value
if (token !== process.env.ADMIN_AUTH_TOKEN) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

### 3. Chýba validácia vstupov v API routes
- `/api/chat/route.ts:174` — `await req.json()` bez try/catch
- `/api/contact/route.ts` — neoveruje email regex, dĺžky, sanitizáciu
- `/api/admin/delete-pdf/route.ts` — `docId` bez validácie
- `/api/retell/create-web-call/route.ts` — `agent_id` bez validácie

**Riešenie:** Pridať [zod](https://zod.dev/) schema validation:
```ts
import { z } from 'zod'
const schema = z.object({ email: z.string().email().max(200), ... })
const parsed = schema.safeParse(body)
if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
```

---

## 🟠 VYSOKÁ PRIORITA

### 4. Cenník je NEKONZISTENTNÝ medzi 4 zdrojmi
Verejný cenník zobrazuje **nižšie ceny** než chatbot a JSON-LD pre Google:

| Položka | `/cennik` (web) | `services.ts` (SEO + landing) | Supabase seed (chatbot) |
|---|---|---|---|
| Logo Basic | **od €69** | od €99 | od €99 |
| Prezentačná stránka | **od €199** | od €299 | od €299 |
| Firemný web | **od €399** | od €599 | od €599 |
| E-shop | **od €699** | od €999 | od €999 |
| Chatbot Basic | **od €169** | od €249 | od €249 |
| Chatbot Pro | **od €349** | od €499 | od €499 |

Zákazník vidí na webe €199, chatbot mu však povie €299, JSON-LD pre Google obsahuje €299. To je problém pre SEO aj dôveryhodnosť.

**Riešenie:** Rozhodnúť, ktorá cenová úroveň je platná, a zosynchronizovať:
- `src/i18n/translations.ts` (riadky 404–414, 478–508, 684+, 758+) — SK/CZ/EN
- `src/lib/seo/services.ts` (riadky 95–106, 198–210, 405–417, …)
- `src/app/(main)/cennik/page.tsx` (JSON-LD `cennikOffers`)
- Supabase tabuľka `chatbot_pricing` (a `supabase/migrations/20260421_pricing.sql`)

### 5. Chýbajú SQL migrácie pre 2 produkčné tabuľky
V `supabase/migrations/` sú len `chatbot_conversations` a `chatbot_pricing`. Chýbajú:
- `form_submissions` — používa `/api/contact` + admin Inbox
- `email_submissions` — používa admin Inbox

Bez týchto migrácií pri „fresh" deploy do novej Supabase DB padnú inbox aj kontakt.

**Riešenie:** Vytvoriť `supabase/migrations/20260516_inbox_tables.sql` s definíciami oboch tabuliek + indexy + RLS.

### 6. Chýba CSP (Content-Security-Policy) header
`next.config.js` posiela len `X-Content-Type-Options` a `X-Frame-Options`. CSP úplne chýba — pri XSS pokuse nemá prehliadač bránič.

**Riešenie:** Pridať do `headers()`:
```js
{ key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self' https://*.supabase.co https://api.retellai.com; img-src 'self' data: https:; font-src 'self' data:; style-src 'self' 'unsafe-inline';" },
{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
```

### 7. Chatbot — session ID sa generuje, ale neviditeľne sa pripája k požiadavkám
V `src/components/chat/Chatbot.tsx` sa session ID ukladá do localStorage, ale treba overiť, či sa správne posiela v každej request na `/api/chat`. (Backend ho očakáva v body, riadok 176 `/api/chat/route.ts`).

### 8. Hardcoded slovenské stringy v UI
`ContactSection.tsx` ~riadok 170: `"Telefón (nepovinné)"` je hardcoded namiesto `t("contact.label.phone.optional")`. Naprieč projektom môže byť viac takých prípadov — pri prepnutí jazyka zostanú v slovenčine.

**Riešenie:** Prejsť všetky komponenty cez Grep a nahradiť hardcoded SK texty translation kľúčmi.

---

## 🟡 STREDNÁ PRIORITA

### 9. Performance optimalizácie
- **OG image 782 KB** (`public/og-image.png`) — komprimovať na ~200 KB (TinyPNG / Squoosh)
- **Portfolio JPGs** (~2,2 MB v `public/portfolio/`) — konvertovať na WebP/AVIF, používať cez `next/image`
- **`partner-preview.png` 812 KB** — komprimovať
- **51 súborov s `"use client"`** — pár kandidátov by sa dalo presunúť na SSR (`Footer.tsx`, `NewsCard.tsx`, `ServiceCard.tsx`)

### 10. Error handling vystavuje interné info
- `/api/contact/route.ts:57` — `JSON.stringify(resendError)` posiela klientovi celý error stack
- Admin server actions (`inbox/actions.ts`) bez try/catch — exception ide klientovi
- **Riešenie:** logovať detaily na server (`console.error`), klientovi vrátiť generický `"Chyba pri spracovaní"`

### 11. Resend bez `RESEND_API_KEY`
V `.env.local` chýba `RESEND_API_KEY`, hoci kód ho používa. Runtime má fallback, ale produkčný email neodide.

### 12. Globals.css dead code a hardcoded font
- `globals.css` ~riadok 94: `font-family: Arial, Helvetica, sans-serif` — duplikuje `tailwind.config.ts`
- `.magnetic-btn::before` keyframe sa nepoužíva (component používa iný spôsob)

### 13. Hash cookie tokenu je statický
`cb_dony_aiwai_2026_secret` — nedá sa rotovať bez deploya. Lepšie použiť JWT s expiráciou alebo Supabase Auth.

---

## 🟢 NÍZKA PRIORITA (kozmetické)

### 14. SEO drobnosti
- Chýba `apple-touch-icon` (`src/app/apple-icon.png`)
- `sameAs` v Organization schéme má len 2 odkazy — pridať LinkedIn, Facebook ak existujú
- Rozšíriť FAQ schema na hlavnej stránke (ne‑service pages)

### 15. UX drobnosti
- Mobile language switcher v Navbar — pridať `flag + "EN"` namiesto len flagu
- Desktop language dropdown — pridať keyboard arrow navigation
- Select arrow ikona na mobile sa nezobrazuje vhodne (`appearance-none`)
- Hero subtitle `max-w-md` (448 px) na 375px iPhone — overiť

### 16. Accessibility gaps
- Niektoré ikony (ArrowRight, SVG v ContactSection) nemajú `aria-label`/`aria-hidden`
- Email/telefón linky v Footer/Contact bez `aria-label`
- Chatbot avatar pravdepodobne bez `role="img"`

### 17. Konzistentnosť dizajnu
- Hover transitions opacity: hero používa `cream/40 → cream`, service cards `cream/50 → indigo/70` — nie systematicky
- Border opacity scales: `indigo/[0.06]` vs `cream/10` — zjednotiť

### 18. Drobnosti repozitára
- `.DS_Store` v `public/` — pridať do `.gitignore`
- Posledný commit `74187ca` overiť, či build je clean (pred merge do main)

---

## ✅ ČO JE PROFESIONÁLNE UROBENÉ

1. **SEO architektúra je excellentná** — root metadata, per-page metadata, JSON-LD (Organization, WebSite, LocalBusiness, Service, FAQ, Breadcrumb, ItemList), sitemap, robots, OG, Twitter
2. **i18n infraštruktúra** — SK/CZ/EN s LanguageContext + translations.ts
3. **Supabase rozdelenie client/server/admin** — service role key nikdy na frontend
4. **CSS-first navbar mobile menu** — funguje pred hydration
5. **Dynamic imports** v `app/(main)/page.tsx` pre lazy-load sekcií
6. **Animácie** — framer-motion + CSS keyframes, mobile-aware backdrop-filter
7. **Strict TypeScript** + ESLint clean (`npm run lint` ✓)
8. **Chatbot knowledge base** (`src/lib/chatbot/knowledge.ts`) — 425 riadkov profesionálneho prompt engineering
9. **Auto-tagging a lead extrakcia** v chatbote (`analyzer.ts`)
10. **Admin UI** — moderný dashboard (Inbox, Leads, Conversations, Stats, Pricing, Chatbot Settings) s konzistentnou farbou a layoutom
11. **Cache stratégia v `next.config.js`** — rozumne nastavená (no-store v dev, immutable v prod)
12. **Resend email template** — HTML + plain text fallback, Reply-To na klienta

---

## 📋 ACTION PLAN (zoradené podľa priority)

| # | Úloha | Priorita | Odhad času |
|---|---|---|---|
| 1 | Presunúť admin credentials do env + bcrypt | 🔴 CRITICAL | 1 h |
| 2 | Pridať auth check na `/api/admin/*` routes | 🔴 CRITICAL | 30 min |
| 3 | Pridať zod validáciu na všetky POST/DELETE | 🔴 CRITICAL | 1,5 h |
| 4 | Zjednotiť cenník v 4 zdrojoch | 🟠 HIGH | 45 min |
| 5 | Vytvoriť migrácie pre form_submissions, email_submissions | 🟠 HIGH | 30 min |
| 6 | Pridať CSP, HSTS, Referrer-Policy do `next.config.js` | 🟠 HIGH | 30 min |
| 7 | Hardcoded stringy → i18n | 🟠 HIGH | 1 h |
| 8 | Komprimovať OG image + portfolio JPGs → WebP | 🟡 MEDIUM | 30 min |
| 9 | Error handling — sanitizácia chybových správ | 🟡 MEDIUM | 45 min |
| 10 | Drobnosti UX/a11y/CSS cleanup | 🟢 LOW | 2 h |

**Celkový odhad času na finalizáciu: ~10 hodín práce.**

---

## 🎯 ZÁVER

Stránka je **profesionálne navrhnutá a funkčná**, s pokročilou architektúrou (Next.js 14 App Router, server components, dynamic imports, i18n, JSON-LD všade). Frontend je vizuálne na úrovni, ktorú by si zaplatil seriózny klient.

**Pred ostrým spustením na produkciu** je však **povinné** vyriešiť 3 kritické security issues (body 1–3) a zosynchronizovať cenník (bod 4). Bez toho hrozí únik dát, neoprávnené nahrávanie PDF-iek do knowledge base, a strata dôveryhodnosti pri rozpore cien.

Ostatné nálezy sú v kategórii „doladenie" — stránka môže ísť live aj s nimi, ale postupne ich treba riešiť.

---

*Audit vygenerovaný: Sobota 16. máj 2026 · Cowork*
