-- Admin scraper integration: lock down RLS + add audit/outreach/job tracking
-- 2026-05-24
-- Aplikované cez Supabase MCP. scraper.leads.id je bigint (existing), takže
-- outreach_log.lead_id je bigint. jobs.id je uuid.

-- ── 1. Drop existujúce permissive anon policies na scraper.leads ─────────
DROP POLICY IF EXISTS "anon can delete leads"      ON scraper.leads;
DROP POLICY IF EXISTS "anon can insert leads"      ON scraper.leads;
DROP POLICY IF EXISTS "anon can read leads"        ON scraper.leads;
DROP POLICY IF EXISTS "anon can update sent status" ON scraper.leads;
DROP POLICY IF EXISTS "anon_read"                  ON scraper.leads;
-- service_all policy ponechávame — service_role má plný prístup

-- ── 2. Rozšírenie scraper.leads ─────────────────────────────────────────
ALTER TABLE scraper.leads
  ADD COLUMN IF NOT EXISTS audit_report   jsonb,
  ADD COLUMN IF NOT EXISTS audit_status   text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS outreach_email jsonb,
  ADD COLUMN IF NOT EXISTS job_id         uuid;

CREATE INDEX IF NOT EXISTS leads_job_id_idx       ON scraper.leads(job_id);
CREATE INDEX IF NOT EXISTS leads_audit_status_idx ON scraper.leads(audit_status);

-- ── 3. Nová tabuľka jobs ────────────────────────────────────────────────
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
CREATE INDEX IF NOT EXISTS jobs_status_idx     ON scraper.jobs(status);
CREATE INDEX IF NOT EXISTS jobs_started_at_idx ON scraper.jobs(started_at DESC);

ALTER TABLE scraper.jobs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS service_all ON scraper.jobs;
CREATE POLICY service_all ON scraper.jobs FOR ALL TO public USING (auth.role() = 'service_role');

-- ── 4. Nová tabuľka outreach_log (lead_id je bigint — match leads.id) ─────
CREATE TABLE IF NOT EXISTS scraper.outreach_log (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id    bigint NOT NULL REFERENCES scraper.leads(id) ON DELETE CASCADE,
  sent_at    timestamptz NOT NULL DEFAULT now(),
  to_email   text NOT NULL,
  subject    text NOT NULL,
  body       text NOT NULL,
  status     text NOT NULL,
  error      text
);
CREATE INDEX IF NOT EXISTS outreach_log_lead_idx    ON scraper.outreach_log(lead_id);
CREATE INDEX IF NOT EXISTS outreach_log_sent_at_idx ON scraper.outreach_log(sent_at DESC);

ALTER TABLE scraper.outreach_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS service_all ON scraper.outreach_log;
CREATE POLICY service_all ON scraper.outreach_log FOR ALL TO public USING (auth.role() = 'service_role');

-- ── 5. Grants pre service_role (RLS bypass funguje len keď je aj GRANT) ──
GRANT USAGE ON SCHEMA scraper TO service_role;
GRANT ALL ON scraper.jobs         TO service_role;
GRANT ALL ON scraper.outreach_log TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA scraper TO service_role;
