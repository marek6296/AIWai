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
