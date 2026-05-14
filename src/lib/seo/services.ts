/**
 * Service catalog used for /sluzby hub, individual /sluzby/[slug] pages, and sitemap.
 *
 * Each entry is the SEO-facing content. Translations on the homepage live in i18n/translations.ts —
 * these are dedicated, long-form SK landing pages aimed at Google. EN/CZ landing pages can be
 * added later by extending this catalog or via i18n routes.
 */

export interface ServiceCatalogEntry {
    slug: string;
    /** Used in URLs, sitemap, and as schema.org name fallback. */
    title: string;
    /** Pithy <60-char SEO title — what shows in Google SERP. */
    seoTitle: string;
    /** Meta description: 140–160 chars. */
    seoDescription: string;
    /** H1 for the landing page. Slightly longer than seoTitle. */
    h1: string;
    /** Short tagline displayed under H1. */
    tagline: string;
    /** Long-form intro — 2–3 paragraphs, 200+ words for ranking depth. */
    intro: string[];
    /** Concrete deliverables — what client gets. Each becomes a checklist line. */
    deliverables: string[];
    /** "Pre koho je to" — target audience signals. */
    forWhom: string[];
    /** Process steps (3–5). */
    process: { title: string; description: string }[];
    /** Pricing tiers shown on the page (and fed into Service schema offers). */
    pricing: { name: string; price: string; description: string }[];
    /** FAQ pairs — fed to FAQPage schema (rich results). */
    faq: { q: string; a: string }[];
    /** Long-tail keywords to weave into copy (also for internal reference, not meta). */
    keywords: string[];
    /** Emoji or single-char hero glyph for visual identity. */
    glyph: string;
}

export const SERVICES: ServiceCatalogEntry[] = [
    {
        slug: "tvorba-webu",
        title: "Tvorba webových stránok",
        seoTitle: "Tvorba webových stránok | Firemný web a e-shop",
        seoDescription:
            "Tvorba moderných firemných webov a e-shopov pre malé a stredné firmy. Rýchle načítanie, mobilná verzia, SEO základ, hosting. Od €299, hotové za 2–4 týždne.",
        h1: "Tvorba webových stránok, ktoré privedú zákazníkov",
        tagline:
            "Firemné weby, prezentačné stránky a e-shopy postavené v Next.js — rýchle, mobilné a optimalizované pre Google.",
        intro: [
            "Postavíme vám web, ktorý sa rýchlo načíta, funguje na mobile aj desktope a Google ho rozumie. Žiadne šablóny z WordPressu, žiadne zbytočné pluginy. Pracujeme s modernými technológiami (Next.js, React, Tailwind) — tým istým stackom, ktorý používa Vercel, OpenAI alebo TikTok.",
            "Každý web staviame na mieru. Pred kódom si sadneme, prejdeme váš biznis, cieľovku a konkurenciu. Z toho vznikne návrh, ktorý dáva zmysel — nielen pekne vyzerá, ale aj konvertuje návštevníkov na zákazníkov.",
            "Po spustení vám odovzdáme prístupy, dokumentáciu a sme tu aj ďalej — pre údržbu, drobné úpravy alebo rozšírenia. Žiadny vendor lock-in: zdrojový kód je váš.",
        ],
        deliverables: [
            "Návrh dizajnu na mieru (žiadne šablóny)",
            "Responzívna mobilná verzia",
            "Optimalizácia rýchlosti (Core Web Vitals)",
            "SEO základ: meta tagy, sitemap, schema.org, robots",
            "Kontaktný formulár s ochranou proti spamu",
            "Hosting na Vercel (CDN, HTTPS, automatické nasadenie)",
            "Google Analytics + Search Console napojenie",
            "Dokumentácia a zaškolenie",
        ],
        forWhom: [
            "Malé a stredné firmy bez interného IT",
            "Začínajúci podnikatelia s prvou prezentáciou",
            "Firmy, ktoré chcú nahradiť starý, pomalý web",
            "E-shopy hľadajúce alternatívu k Shoptetu alebo WooCommerce",
        ],
        process: [
            {
                title: "Úvodný hovor (30 min)",
                description:
                    "Prejdeme váš biznis, ciele a konkurenciu. Bez záväzku, bez formulárov.",
            },
            {
                title: "Návrh a cenová ponuka",
                description:
                    "Dostanete jasný rozsah, termín a fixnú cenu. Žiadne hodinové sadzby ani prekvapenia.",
            },
            {
                title: "Dizajn a vývoj",
                description:
                    "Postavíme web inkrementálne — vidíte priebežne pokrok, môžete pripomienkovať.",
            },
            {
                title: "Spustenie a odovzdanie",
                description:
                    "Nasadíme web, napojíme analytics, odovzdáme prístupy a sme k dispozícii aj po spustení.",
            },
        ],
        pricing: [
            {
                name: "Prezentačná stránka",
                price: "od €299",
                description: "1–3 stránky, kontaktný formulár, mobilná verzia.",
            },
            {
                name: "Firemný web",
                price: "od €599",
                description:
                    "Viacstránkový web, blog, SEO optimalizácia, CMS pre editáciu obsahu.",
            },
            {
                name: "E-shop",
                price: "od €999",
                description:
                    "Produkty, košík, platobná brána, integrácia s Packetou/Shoptetom.",
            },
        ],
        faq: [
            {
                q: "Ako dlho trvá vytvorenie webu?",
                a: "Prezentačná stránka zvyčajne 2 týždne, firemný web 3–4 týždne, e-shop 4–6 týždňov. Konkrétny termín dostanete v cenovej ponuke a držíme sa ho.",
            },
            {
                q: "Aký systém používate — WordPress?",
                a: "Nie. Staviame v Next.js (React framework) a hostujeme na Vercel. Výsledok je rýchlejší, bezpečnejší a lacnejší na prevádzku ako WordPress. Pre editáciu obsahu pridávame jednoduchý CMS (Sanity alebo Supabase).",
            },
            {
                q: "Čo je v cene a čo nie?",
                a: "V cene je návrh, vývoj, nasadenie, hosting na prvý rok, SEO základ a 30 dní podpory po spustení. V cene nie sú: prémiové fotografie, kopírovanie obsahu od konkurencie, reklamné kampane.",
            },
            {
                q: "Robíte aj SEO optimalizáciu?",
                a: "Áno — každý web dodávame so SEO základom (meta tagy, sitemap, schema.org, rýchlosť). Pre dlhodobé SEO (linkbuilding, content marketing) máme samostatnú službu Marketing.",
            },
            {
                q: "Patrí mi zdrojový kód?",
                a: "Áno, 100 %. Po odovzdaní máte plný prístup k repozitáru, hostingu aj všetkým službám. Nie sme vendor lock-in.",
            },
        ],
        keywords: [
            "tvorba webu",
            "tvorba webových stránok",
            "firemný web",
            "prezentačná stránka",
            "moderný web Next.js",
            "tvorba webu Slovensko",
        ],
        glyph: "▲",
    },
    {
        slug: "ai-chatbot",
        title: "AI chatboty pre web a zákaznícku podporu",
        seoTitle: "AI chatbot pre firmu | Zákaznícka podpora 24/7",
        seoDescription:
            "AI chatbot trénovaný na vašej firme — odpovedá zákazníkom, zachytáva leady a rezervuje stretnutia 24/7. Integrácia s webom, CRM a Voice AI. Od €249.",
        h1: "AI chatbot, ktorý pozná váš biznis a predáva za vás",
        tagline:
            "Chatbot trénovaný na vašich produktoch, službách a FAQ. Odpovedá zákazníkom presne — 24 hodín denne, 7 dní v týždni.",
        intro: [
            "AI chatbot nahradí jednoduchú zákaznícku podporu a zachytáva leady aj keď spíte. Postavíme ho na základe vašich produktov, cenníka a najčastejších otázok — odpovedá presne, nie generickými frázami z internetu.",
            "Nasadíme ho na váš web ako bublinku v rohu, alebo ako voice AI (telefonický hovor s AI hlasom). Integrujeme ho s vaším CRM, Google Calendar alebo emailom — zákazník si môže rezervovať stretnutie priamo cez chat.",
            "Po spustení vidíte v admin paneli každý rozhovor, kde chatbot zlyhal a kde naopak konvertoval. Postupne ho doladíme — z mesiaca na mesiac je presnejší.",
        ],
        deliverables: [
            "Chatbot trénovaný na vašich dokumentoch (PDF, web, FAQ)",
            "Integrácia s webom (widget v rohu) alebo Voice AI (telefón)",
            "Zachytávanie leadov do CRM alebo Google Sheets",
            "Rezervácia stretnutí cez Google Calendar / Calendly",
            "Viacjazyčný (SK, CZ, EN, DE, …)",
            "Admin panel s históriou rozhovorov a štatistikami",
            "Anti-halucinačné guardraily (chatbot neklame)",
            "Mesačná údržba a doladenie",
        ],
        forWhom: [
            "E-shopy s vysokým počtom otázok cez chat alebo email",
            "Servisy a firmy s rezerváciou stretnutí",
            "Realitné kancelárie a poisťovacie kancelárie",
            "Firmy, ktoré chcú obsluhovať zákazníkov mimo pracovných hodín",
        ],
        process: [
            {
                title: "Audit otázok",
                description:
                    "Pozrieme vaše emaily, chaty a FAQ — zistíme, čo zákazníci najčastejšie pýtajú.",
            },
            {
                title: "Tréning a guardrails",
                description:
                    "Natrénujeme chatbota na vašich dátach a nastavíme limity — čo môže odpovedať a kedy má presmerovať na človeka.",
            },
            {
                title: "Integrácia a nasadenie",
                description:
                    "Nasadíme widget na web alebo voice AI na telefón, napojíme CRM a Calendar.",
            },
            {
                title: "Doladenie z reálnej prevádzky",
                description:
                    "Po týždni prejdeme logy, identifikujeme medzery a chatbota dolaďujeme.",
            },
        ],
        pricing: [
            {
                name: "Chatbot Basic",
                price: "od €249",
                description:
                    "Chat widget na webe, tréning na 1 dokumente (FAQ alebo cenník), email notifikácie.",
            },
            {
                name: "Chatbot Pro",
                price: "od €499",
                description:
                    "Chat + Voice AI, tréning na viacerých dokumentoch, CRM integrácia, kalendár, admin panel.",
            },
            {
                name: "Chatbot Enterprise",
                price: "na dopyt",
                description:
                    "Custom integrácia, viacjazyčný, multikanálové (web + telefón + WhatsApp + email).",
            },
        ],
        faq: [
            {
                q: "Aký model AI používate?",
                a: "Podľa potreby: GPT-4o (OpenAI), Claude (Anthropic) alebo Gemini (Google). Pre voice AI používame Retell AI / ElevenLabs. Výber závisí od presnosti, ceny a jazyka.",
            },
            {
                q: "Môže chatbot klamať alebo si vymýšľať?",
                a: "Bez guardrails áno — preto ich nastavujeme štandardne. Chatbot odpovedá iba na základe vašich dokumentov a v ostatných prípadoch odporučí kontakt na človeka. Mesačne kontrolujeme logy.",
            },
            {
                q: "Koľko stojí prevádzka chatbota mesačne?",
                a: "Zvyčajne €20–€80 mesačne podľa počtu rozhovorov (platíte len OpenAI/Anthropic API). Pri väčšom objeme vieme znížiť cez cache a lacnejšie modely.",
            },
            {
                q: "Vie chatbot rezervovať stretnutie?",
                a: "Áno — napojíme ho na Google Calendar alebo Calendly. Zákazník si v chate vyberie termín, chatbot ho rezervuje a pošle pozvánku.",
            },
            {
                q: "Ako rýchlo viete nasadiť chatbota?",
                a: "Basic verziu za 5–7 dní, Pro verziu za 2–3 týždne (závisí od integrácie s CRM).",
            },
        ],
        keywords: [
            "AI chatbot",
            "chatbot pre web",
            "voice AI",
            "AI zákaznícka podpora",
            "chatbot pre e-shop",
            "AI asistent",
        ],
        glyph: "◆",
    },
    {
        slug: "ai-automatizacia",
        title: "AI automatizácia procesov (Make.com, n8n)",
        seoTitle: "Automatizácia procesov | Make.com a n8n",
        seoDescription:
            "Automatizácia opakovaných úloh pre malé a stredné firmy. Faktúry, emaily, CRM, reporty — všetko cez Make.com alebo n8n. Šetríme 10+ hodín týždenne. Od €299.",
        h1: "Prestaňte robiť ručne to, čo zvládne stroj",
        tagline:
            "Automatizujeme objednávky, faktúry, emaily a reporty cez Make.com a n8n. Stačí to nastaviť raz — beží to navždy.",
        intro: [
            "V každej firme je 10–20 hodín týždenne, ktoré idú na opakovanú prácu: prepisovanie objednávok medzi systémami, posielanie ten istý email, vystavovanie faktúr, kompilácia reportov. To všetko vie urobiť stroj — rýchlejšie, bez chýb a bez prestávok.",
            "Pracujeme s Make.com (predtým Integromat) a n8n — top nástrojmi pre no-code/low-code automatizáciu. K tomu pridávame AI tam, kde má zmysel: spracovanie PDF faktúr cez GPT, kategorizácia emailov, generovanie odpovedí.",
            "Každú automatizáciu navrhujeme tak, aby ste videli, čo sa deje (notifikácie, dashboard) a aby ste ju vedeli ovládať. Nie black box — všetko transparentné.",
        ],
        deliverables: [
            "Mapa procesov: čo automatizovať a aké je ROI",
            "Workflows v Make.com alebo n8n",
            "AI komponenty (GPT/Claude) pre spracovanie textu a PDF",
            "Integrácia s vašimi nástrojmi (Gmail, Google Sheets, Shoptet, Stripe, …)",
            "Notifikácie cez email/Slack/Telegram",
            "Mesačný dashboard: koľko času šetríme, kde sú chyby",
            "Dokumentácia každého workflow",
            "Podpora a údržba",
        ],
        forWhom: [
            "Firmy s viac ako 20 objednávkami denne",
            "Účtovníci a finančné kancelárie",
            "E-shopy s manuálnou prácou medzi Shoptetom, Packetou a iDokladom",
            "Firmy s pravidelnými reportmi (denné/týždenné)",
        ],
        process: [
            {
                title: "Audit procesov",
                description:
                    "Spolu prejdeme bežný deň vo firme. Zaznamenáme, čo sa opakuje a aké je ROI z automatizácie.",
            },
            {
                title: "Návrh workflow",
                description:
                    "Vytvoríme mapu — čo automatizujeme prvé, čo druhé. Začíname tam, kde je najväčšia úspora.",
            },
            {
                title: "Implementácia",
                description:
                    "Postavíme workflows, otestujeme na reálnych dátach, pripojíme notifikácie.",
            },
            {
                title: "Odovzdanie a podpora",
                description:
                    "Zaškolíme vás na úpravy, dáme dokumentáciu a riešime prípadné chyby.",
            },
        ],
        pricing: [
            {
                name: "Automatizácia Starter",
                price: "od €299",
                description:
                    "1 workflow (napr. nová objednávka → CRM + email + faktúra). Vrátane Make.com setupu.",
            },
            {
                name: "Automatizácia Pro",
                price: "od €799",
                description:
                    "3–5 workflows, AI komponenty (PDF parsing, kategorizácia), dashboard.",
            },
            {
                name: "Automatizácia Enterprise",
                price: "na dopyt",
                description:
                    "Custom n8n self-hosted, kritické workflows, SLA a monitoring.",
            },
        ],
        faq: [
            {
                q: "Make.com alebo n8n — čo je lepšie?",
                a: "Make.com je drahší ale jednoduchší — pre 90 % use-caseov ho odporúčame. n8n je lacnejší (self-hosted) a má lepšiu kontrolu — pre firmy s veľkým objemom alebo citlivými dátami. Vyberieme po audite.",
            },
            {
                q: "Koľko stojí prevádzka mesačne?",
                a: "Make.com €9–€29 mesačne podľa počtu operácií. n8n €0 ak self-hosted (server €5/mes na Hetzneri) alebo €20 cloud. AI komponenty (GPT) ďalších €5–€30 podľa objemu.",
            },
            {
                q: "Čo ak prestanete byť mojím partnerom?",
                a: "Všetky workflows sú vo vašom Make.com / n8n účte, dokumentácia je u vás. Môžete ich ďalej spravovať sami alebo cez iného konzultanta.",
            },
            {
                q: "Vieme automatizovať aj komunikáciu cez WhatsApp?",
                a: "Áno — cez WhatsApp Business API (Twilio alebo 360dialog) alebo cez green-api. Pridávame to ako modul do existujúceho workflow.",
            },
            {
                q: "Koľko ušetríme?",
                a: "Bežný klient ušetrí 5–15 hodín týždenne práce zamestnanca. Návratnosť automatizácie je zvyčajne 2–4 mesiace.",
            },
        ],
        keywords: [
            "automatizácia procesov",
            "Make.com",
            "n8n",
            "AI automatizácia",
            "automatizácia firmy",
            "Integromat",
        ],
        glyph: "⟁",
    },
    {
        slug: "logo-branding",
        title: "Logo a vizuálna identita",
        seoTitle: "Logo dizajn a branding | Vizuálna identita firmy",
        seoDescription:
            "Logo, brand guide a vizuálna identita pre malé a stredné firmy. Profesionálny dizajn, ktorý si zákazník zapamätá. Logo od €99, kompletný brand od €229.",
        h1: "Logo a vizuálna identita, ktorá si zákazníka získa",
        tagline:
            "Logo, farby, typografia a šablóny — všetko, čo potrebujete na konzistentnú firemnú identitu naprieč webom, sociálnymi sieťami a tlačou.",
        intro: [
            "Logo nie je len obrázok. Je to prvá vec, čo zákazník vidí — a posledná, čo si zapamätá. Robíme logá, ktoré sú jednoduché, čisté a fungujú všade: od favikon v prehliadači cez vizitku po billboard.",
            "Dodávame komplet — logo v každom potrebnom formáte (SVG, PNG, PDF, AI), brand guide s farbami a typografiou, a šablóny pre sociálne siete. Po dodaní viete sami vyrobiť ďalšie príspevky a banery konzistentne.",
            "Pracujeme rýchlejšie ako tradičné štúdiá — používame AI pre rýchle iterácie konceptov, finalizujeme manuálne. Výsledok: rovnaká kvalita, polovičný čas, polovičná cena.",
        ],
        deliverables: [
            "Logo v 3 variantoch (plné, monochrom, ikona)",
            "Súbory: SVG, PNG (rôzne veľkosti), PDF, AI",
            "Brand guide PDF (farby, typografia, použitie loga)",
            "Šablóny pre Instagram/Facebook posty (Canva alebo Figma)",
            "Vizitka, hlavičkový papier (voliteľné)",
            "Sociálne profily: avatar + cover pre FB, IG, LinkedIn",
            "Favicon a app ikona pre web",
        ],
        forWhom: [
            "Nové firmy a startupy bez vizuálnej identity",
            "Firmy s amatérskym logom, ktoré chcú prejsť na pro úroveň",
            "Rebranding po zmene smerovania firmy",
            "Live streameri, tvorcovia obsahu a osobné značky",
        ],
        process: [
            {
                title: "Brief a rešerš",
                description:
                    "Krátky dotazník — kto ste, komu predávate, akú emóciu chcete vyvolať. Pozrieme konkurenciu.",
            },
            {
                title: "3 návrhy konceptov",
                description:
                    "Pripravíme 3 odlišné smery. Vyberiete jeden, ktorý ďalej rozvíjame.",
            },
            {
                title: "Iterácie a finalizácia",
                description:
                    "2–3 kolá pripomienok na vybraný koncept. Doladíme detaily.",
            },
            {
                title: "Brand kit a odovzdanie",
                description:
                    "Pripravíme všetky súbory, brand guide a šablóny. Posielame v zazipovanom balíku.",
            },
        ],
        pricing: [
            {
                name: "Logo Basic",
                price: "od €99",
                description:
                    "Logo v 3 variantoch + súbory (SVG, PNG, PDF). Hotové do 5 dní.",
            },
            {
                name: "Logo + Brand",
                price: "od €229",
                description:
                    "Logo + brand guide + šablóny pre soc. siete + favicon. Hotové do 10 dní.",
            },
            {
                name: "Sociálna grafika",
                price: "od €149",
                description:
                    "Set 5–10 príspevkov pre Facebook a Instagram s vašou identitou.",
            },
        ],
        faq: [
            {
                q: "Koľko návrhov dostanem?",
                a: "Pri Logo Basic 3 koncepty, vyberiete jeden, doladíme. Pri Logo + Brand 3 koncepty + 2–3 kolá iterácií na vybraný.",
            },
            {
                q: "Patrí mi logo na 100 %?",
                a: "Áno. Po zaplatení sú všetky práva vaše — môžete ho registrovať ako ochrannú známku, používať komerčne, upravovať.",
            },
            {
                q: "Robíte aj redizajn existujúceho loga?",
                a: "Áno. Redizajn je často lacnejší a rýchlejší ako úplne nový dizajn, ale závisí od stavu pôvodného loga. Pošlite, posúdime.",
            },
            {
                q: "Použivate AI na generovanie loga?",
                a: "Pre prvotné koncepty áno (rýchle iterácie). Finálne logo je vždy vektorové, manuálne vyčistené a optimalizované — nie AI obrázok.",
            },
            {
                q: "Čo ak sa mi žiadny návrh nepáči?",
                a: "Pri Logo Basic vraciame 50 %. Pri Logo + Brand robíme ďalšiu sériu konceptov v cene. Doteraz sa nestalo.",
            },
        ],
        keywords: [
            "logo dizajn",
            "tvorba loga",
            "branding",
            "vizuálna identita",
            "brand guide",
            "logo Slovensko",
        ],
        glyph: "✦",
    },
    {
        slug: "sprava-socialnych-sieti",
        title: "Správa sociálnych sietí a Meta Ads",
        seoTitle: "Správa Facebooku a Instagramu | Meta Ads kampane",
        seoDescription:
            "Mesačná správa Facebooku, Instagramu a platených kampaní (Meta Ads). Pravidelný obsah, grafika, copywriting a reporty. Od €200/mesiac.",
        h1: "Sociálne siete a reklamy, ktoré dohnajú zákazníka",
        tagline:
            "Mesačný plán obsahu, grafika, copywriting a platené kampane — všetko na jednom mieste. Vy robíte biznis, my soc. siete.",
        intro: [
            "Sociálne siete nie sú o tom, koľko príspevkov stihnete vyplniť. Sú o tom, koľko ľudí prídete kúpiť. Robíme mesačný plán obsahu, ktorý buduje značku a paralelne platené kampane, ktoré privedú zákazníka teraz.",
            "Každý mesiac dostanete content kalendár (čo, kedy, prečo), grafiku v jednotnom štýle, captions napísané pre vašu cieľovku, a mesačný report s konkrétnymi číslami: koľko ľudí, koľko interakcií, koľko leadov.",
            "Pri Meta Ads začíname malým rozpočtom (€100–€200 mesačne), učíme algoritmus, postupne škálujeme. Žiadne hodené €1000 do prvého týždňa — najprv testy, potom investícia.",
        ],
        deliverables: [
            "Mesačný content kalendár (8–16 príspevkov)",
            "Grafika v jednotnom brand štýle",
            "Captions a hashtagy",
            "Pravidelný posting (manuálny alebo cez Meta Business Suite)",
            "Meta Ads kampane (Facebook + Instagram)",
            "Targeting a retargeting (návšteva webu, podobné publikum)",
            "Mesačný report s konkrétnymi číslami",
            "Optimalizácia kampaní podľa výsledkov",
        ],
        forWhom: [
            "Lokálne firmy (kaviarne, barbershopy, kvetinárstva)",
            "E-shopy hľadajúce predaj cez Instagram",
            "Reštaurácie a služby s vizuálnym obsahom",
            "Firmy bez interného marketéra",
        ],
        process: [
            {
                title: "Audit a stratégia",
                description:
                    "Pozrieme váš profil, konkurenciu, cieľovku. Pripravíme content stratégiu na 3 mesiace.",
            },
            {
                title: "Setup kampaní",
                description:
                    "Nastavíme Meta Business Manager, pixel na webe, prvé testovacie kampane.",
            },
            {
                title: "Mesačná prevádzka",
                description:
                    "Tvoríme obsah, postujeme, sledujeme kampane. Týždenné drobné úpravy.",
            },
            {
                title: "Reporty a optimalizácia",
                description:
                    "Každý mesiac prejdeme čísla — čo funguje, čo nie. Plán na ďalší mesiac.",
            },
        ],
        pricing: [
            {
                name: "Marketing Starter",
                price: "od €200/mes",
                description:
                    "8 príspevkov mesačne, grafika, captions, posting. Bez platených kampaní.",
            },
            {
                name: "Marketing Pro + Ads",
                price: "od €300/mes",
                description:
                    "16 príspevkov, kampane na Meta Ads (rozpočet zvlášť), reporty, retargeting.",
            },
            {
                name: "Marketing Enterprise",
                price: "na dopyt",
                description:
                    "Viackanálové (FB+IG+TikTok+LinkedIn), video obsah, influencer kampane.",
            },
        ],
        faq: [
            {
                q: "Aký rozpočet na Meta Ads odporúčate?",
                a: "Pre lokálne firmy €100–€300 mesačne na začiatok. Pre e-shopy €300–€1000. Rozpočet je nad rámec našej mesačnej fee — ide priamo do Meta.",
            },
            {
                q: "Garantujete počet predajov?",
                a: "Nie — ani by sme nemali. Predaj záleží od ponuky, ceny, webu a sezóny. Garantujeme: kvalitný obsah, transparentné reporty, kampane optimalizované podľa dát.",
            },
            {
                q: "Robíte aj TikTok a LinkedIn?",
                a: "TikTok áno (pre vybrané brandy), LinkedIn áno (B2B). Hlavná špecializácia je Facebook + Instagram.",
            },
            {
                q: "Môžem prestať kedykoľvek?",
                a: "Áno — mesačná zmluva, výpovedná lehota 30 dní. Bez záväzkov na rok.",
            },
            {
                q: "Kto vytvára fotky a video?",
                a: "Foto/video v cene nie je. Buď ich dodáte (smartfón stačí), alebo dohodneme samostatný foto deň cez nášho fotografa.",
            },
        ],
        keywords: [
            "správa sociálnych sietí",
            "Facebook marketing",
            "Instagram marketing",
            "Meta Ads",
            "platené kampane Facebook",
            "social media manager",
        ],
        glyph: "❋",
    },
];

export const SERVICE_SLUGS = SERVICES.map((s) => s.slug);

export function getService(slug: string): ServiceCatalogEntry | undefined {
    return SERVICES.find((s) => s.slug === slug);
}
