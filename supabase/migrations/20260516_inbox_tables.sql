-- 2026-05-16 — Inbox tabuľky (form_submissions + email_submissions).
--
-- Tieto tabuľky používa:
--   • POST /api/contact         → ukladá formulárové správy z webu do `form_submissions`
--   • /admin/inbox              → admin UI zobrazujúce oba zdroje s "Vybavené / Nevybavené"
--   • /admin/inbox/actions.ts   → markDone / markNew (status update)
--
-- Pred touto migráciou tabuľky neexistovali v repo (mali byť vytvorené manuálne v Supabase
-- UI), čo znamenalo, že fresh deploy padol. Táto migrácia ich definuje raz a navždy.

-- ─────────────────────────────────────────────────────────────────
-- form_submissions — správy z kontaktného formulára na webe
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS form_submissions (
    id            uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
    name          text        NOT NULL,
    email         text        NOT NULL,
    phone         text,
    project_type  text        NOT NULL,
    message       text        NOT NULL,
    status        text        NOT NULL DEFAULT 'new'
                              CHECK (status IN ('new', 'done')),
    received_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS form_submissions_status_idx
    ON form_submissions(status, received_at DESC);
CREATE INDEX IF NOT EXISTS form_submissions_received_idx
    ON form_submissions(received_at DESC);

ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
-- Žiadne RLS policies — service_role obchádza RLS (rovnaký pattern ako chatbot_conversations).
-- Anon clients sa k týmto dátam priamo nedostanú; insert ide cez /api/contact server route.

-- ─────────────────────────────────────────────────────────────────
-- email_submissions — klientske maily preposlané do CRM (napr. cez Make.com)
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS email_submissions (
    id            uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
    name          text,
    email         text        NOT NULL,
    phone         text,
    subject       text,
    message       text,
    project_type  text,
    status        text        NOT NULL DEFAULT 'new'
                              CHECK (status IN ('new', 'done')),
    received_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS email_submissions_status_idx
    ON email_submissions(status, received_at DESC);
CREATE INDEX IF NOT EXISTS email_submissions_received_idx
    ON email_submissions(received_at DESC);

ALTER TABLE email_submissions ENABLE ROW LEVEL SECURITY;
