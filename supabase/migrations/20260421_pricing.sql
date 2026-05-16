-- Live pricing table for chatbot
-- Each row = one package/tier that can be edited from admin without code deploy

CREATE TABLE IF NOT EXISTS chatbot_pricing (
    id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
    category    text        NOT NULL,        -- 'grafika' | 'marketing' | 'web' | 'chatbot' | 'automatizacia'
    name        text        NOT NULL,        -- e.g. 'Logo Basic'
    price_from  integer     NOT NULL,        -- minimum price in EUR
    price_to    integer,                     -- max price (NULL = "od X €" only)
    unit        text        NOT NULL DEFAULT '€ jednorazovo',  -- '€ jednorazovo' | '€/mes' | 'dohodou'
    description text,
    is_active   boolean     NOT NULL DEFAULT true,
    sort_order  integer     NOT NULL DEFAULT 0,
    updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS chatbot_pricing_category_idx ON chatbot_pricing(category, sort_order);

-- Trigger: auto-update updated_at
CREATE OR REPLACE FUNCTION touch_chatbot_pricing()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_touch_chatbot_pricing ON chatbot_pricing;
CREATE TRIGGER trg_touch_chatbot_pricing
    BEFORE UPDATE ON chatbot_pricing
    FOR EACH ROW EXECUTE FUNCTION touch_chatbot_pricing();

ALTER TABLE chatbot_pricing ENABLE ROW LEVEL SECURITY;
-- No RLS policies — service_role only (same as chatbot_conversations)

-- ─────────────────────────────────────────────────────────────────
-- SEED DATA (matches /cennik page)
-- ─────────────────────────────────────────────────────────────────

INSERT INTO chatbot_pricing (category, name, price_from, price_to, unit, description, sort_order) VALUES

-- GRAFIKA
('grafika',   'Logo Basic',                    69,  NULL, '€ jednorazovo', '3 návrhy loga, 2 kolá revízií, PNG+JPEG, svetlá+tmavá verzia, bez vektorov, do 5 dní', 1),
('grafika',   'Logo + Brand',                 159,  NULL, '€ jednorazovo', '3 návrhy + 3 kolá revízií, vektory (SVG, AI, PDF), brand manuál, 5 šablón pre soc. siete, do 10 dní', 2),
('grafika',   'Grafika pre sociálne siete',    99,  NULL, '€ jednorazovo', '15 brandovaných šablón (feed + stories), profilový obrázok + cover, highlight covers, do 7 dní', 3),

-- MARKETING
('marketing', 'Marketing Starter',            139,  NULL, '€/mes', 'Plán príspevkov, FB + IG + Stories, AI foto úpravy, copywriting, správa komentárov, mesačný report', 1),
('marketing', 'Marketing Pro + Ads',          209,  NULL, '€/mes', 'Všetko zo Starter + Meta Ads kampane, správa rozpočtu (rozpočet nie je v cene), týždenné reporty', 2),

-- WEB
('web',       'Prezentačná stránka',          199,  NULL, '€ jednorazovo', '1–3 stránky, kontaktný formulár, mobilná verzia, základné SEO, do 2 týždňov', 1),
('web',       'Firemný web',                  399,  NULL, '€ jednorazovo', '5–10 stránok, CMS, blog/aktuality, SEO, Google Analytics, do 3–4 týždňov', 2),
('web',       'E-shop',                       699,  NULL, '€ jednorazovo', 'Produktový katalóg, online platby (Stripe/PayPal/GoPay), správa objednávok, SEO, do 4–6 týždňov', 3),

-- CHATBOT
('chatbot',   'Chatbot Basic',                169,  NULL, '€ jednorazovo', 'FAQ odpovede, web embed widget, natrénovaný na tvojich podkladoch, SK+EN, do 2 týždňov', 1),
('chatbot',   'Chatbot Pro',                  349,  NULL, '€ jednorazovo', 'Vlastná knowledge base, zachytávanie leadov do CRM, rezervácia stretnutí, viacjazyčnosť, do 3 týždňov', 2),

-- AUTOMATIZÁCIA
('automatizacia', 'Automatizácia Starter',    199,  NULL, '€ jednorazovo', '2–3 workflow, prepojenie 2–3 nástrojov, email alebo CRM automatizácia, 2 týždne', 1),
('automatizacia', 'Automatizácia Pro/Enterprise', 599, NULL, 'dohodou', 'Neobmedzené workflow, komplexné integrácie, AI spracovanie dokumentov, ERP integrácie', 2);
