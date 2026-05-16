-- 2026-05-16 — Plošné zníženie cien o ~50%.
--
-- Pusti v Supabase SQL editore RAZ. Aktualizuje existujúce riadky v `chatbot_pricing`.
-- Chatbot bude od ďalšieho dotazu vracať tieto nové ceny (cache TTL 5 min).
--
-- Pred touto migráciou by mali byť v DB ceny z 20260516_pricing_sync.sql
-- (Logo Basic 69, Web 199, atď.). Po tejto migrácii budú o polovicu nižšie.

UPDATE chatbot_pricing SET price_from = 35  WHERE name = 'Logo Basic';
UPDATE chatbot_pricing SET price_from = 79  WHERE name = 'Logo + Brand';
UPDATE chatbot_pricing SET price_from = 49  WHERE name = 'Grafika pre sociálne siete';

UPDATE chatbot_pricing SET price_from = 69  WHERE name = 'Marketing Starter';
UPDATE chatbot_pricing SET price_from = 105 WHERE name = 'Marketing Pro + Ads';

UPDATE chatbot_pricing SET price_from = 99  WHERE name = 'Prezentačná stránka';
UPDATE chatbot_pricing SET price_from = 199 WHERE name = 'Firemný web';
UPDATE chatbot_pricing SET price_from = 349 WHERE name = 'E-shop';

UPDATE chatbot_pricing SET price_from = 85  WHERE name = 'Chatbot Basic';
UPDATE chatbot_pricing SET price_from = 175 WHERE name = 'Chatbot Pro';

UPDATE chatbot_pricing SET price_from = 99  WHERE name = 'Automatizácia Starter';
UPDATE chatbot_pricing SET price_from = 299 WHERE name = 'Automatizácia Pro/Enterprise';
