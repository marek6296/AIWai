-- 2026-05-16 — Zjednotenie cien chatbota s webovým cenníkom (/cennik).
--
-- Predtým: chatbot, /sluzby landing pages a Google JSON-LD mali vyššie ceny než /cennik.
-- Túto migráciu pustiť v Supabase SQL editore (alebo cez supabase CLI) raz.
-- Aktualizuje existujúce riadky v `chatbot_pricing` — nemení schému.

UPDATE chatbot_pricing SET price_from = 69,
    description = '3 návrhy loga, 2 kolá revízií, PNG+JPEG, svetlá+tmavá verzia, bez vektorov, do 5 dní'
    WHERE name = 'Logo Basic';

UPDATE chatbot_pricing SET price_from = 159,
    description = '3 návrhy + 3 kolá revízií, vektory (SVG, AI, PDF), brand manuál, 5 šablón pre soc. siete, do 10 dní'
    WHERE name = 'Logo + Brand';

UPDATE chatbot_pricing SET price_from = 99
    WHERE name = 'Grafika pre sociálne siete';

UPDATE chatbot_pricing SET price_from = 139
    WHERE name = 'Marketing Starter';

UPDATE chatbot_pricing SET price_from = 209
    WHERE name = 'Marketing Pro + Ads';

UPDATE chatbot_pricing SET price_from = 199
    WHERE name = 'Prezentačná stránka';

UPDATE chatbot_pricing SET price_from = 399
    WHERE name = 'Firemný web';

UPDATE chatbot_pricing SET price_from = 699
    WHERE name = 'E-shop';

UPDATE chatbot_pricing SET price_from = 169
    WHERE name = 'Chatbot Basic';

UPDATE chatbot_pricing SET price_from = 349
    WHERE name = 'Chatbot Pro';

UPDATE chatbot_pricing SET price_from = 199
    WHERE name = 'Automatizácia Starter';

UPDATE chatbot_pricing SET price_from = 599
    WHERE name = 'Automatizácia Pro/Enterprise';
