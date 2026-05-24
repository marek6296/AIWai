-- scraper.jobs: pridať `categories text[]` aby job mohol obsahovať viac kategórií
-- (sweep N kategórií × M miest v jednom jobe)
-- 2026-05-24
-- Aplikované cez Supabase MCP; tento súbor je mirror pre git.

ALTER TABLE scraper.jobs ADD COLUMN IF NOT EXISTS categories text[];

-- BC: existing rows majú len `category text NOT NULL`. Nový kód pri zápise nastaví aj `categories[]`.
-- `category` zostáva ako display label (napr. "5 kategórií" alebo prvá kategória).
