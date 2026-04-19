export type Lang = 'en' | 'sk' | 'cs'

export const translations: Record<Lang, Record<string, string>> = {
    en: {
        // ── Nav ──
        'nav.news': 'AIWai News',
        'nav.services': 'Services',
        'nav.about': 'About',
        'nav.contact': 'Contact',

        // ── Hero ──
        'hero.line1': 'Web, design, AI.',
        'hero.line2.light': 'All',
        'hero.line2.gradient': 'in one.',
        'hero.subtitle': 'We take care of your web, design and AI — you focus on your business, we handle the rest.',
        'hero.cta.start': 'Let\'s talk',
        'hero.cta.explore': 'What we do ↓',

        // ── Services ──
        'services.heading': 'What we do',
        'services.subheading': 'Four services. One team. Everything your business needs online.',
        'services.learnMore': 'Learn more',

        // Service 0 — Web Development
        'services.0.title': 'Web Development',
        'services.0.description': 'Fast, modern websites and web apps built to convert visitors into customers.',
        'services.0.whatIsIt': 'We build websites that actually do their job. Clean design, fast loading, mobile-ready, and built to rank on Google. Whether you need a company presentation site, a product landing page, or a full web application — we build it properly with modern technology, not a page-builder template.',
        'services.0.howItWorks': 'Every project starts with a conversation about your business goals, not a template picker. We map out the user journey first, then design in high fidelity before writing a single line of code. We build with Next.js and React — the same stack used by the world\'s best digital products. You get full code ownership and a site you can be proud of.',
        'services.0.includes': 'Company Websites|Landing Pages|E-commerce Stores|Web Applications|SEO Optimisation|Speed & Performance',

        // Service 1 — AI Chatbots
        'services.1.title': 'AI Chatbots',
        'services.1.description': 'Smart chatbots trained on your business — answers questions, captures leads, books meetings.',
        'services.1.whatIsIt': 'We build chatbots that actually know your business. Trained on your products, services, FAQs and processes — not generic scripts. The chatbot answers in your tone, handles common questions around the clock, and escalates to a human when needed. No hallucinations. No wrong answers. No embarrassing moments.',
        'services.1.howItWorks': 'We connect your existing documentation, product catalogue or knowledge base to the chatbot using RAG technology. The bot has access only to your specific data and answers based on that — nothing made up. We handle the full integration: your website, WhatsApp, or wherever your customers actually are.',
        'services.1.includes': '24/7 Customer Support|Lead Capture & Qualification|Appointment Booking|Multi-language|CRM Integration|Voice AI (Phone Bots)',

        // Service 2 — AI Automation
        'services.2.title': 'AI Automation',
        'services.2.description': 'Stop doing manually what a machine can handle — orders, emails, invoices, reports.',
        'services.2.whatIsIt': 'Business automation means your tools talk to each other and handle the boring work. New order → automatically entered in your system. Invoice received → processed and filed. Customer email → categorised and answered. We map what your team currently does by hand and build the workflows that eliminate it — so you focus on the work that actually matters.',
        'services.2.howItWorks': 'We start with a process audit — looking at what your team does repeatedly and where time gets wasted. Then we build automation using Make.com, n8n or custom API connections. AI handles the parts that need judgement: reading documents, categorising inputs, making decisions. You just review the outputs.',
        'services.2.includes': 'Make.com & n8n Workflows|Email & CRM Automation|Invoice Processing|Data Sync Between Tools|Automated Reporting|Document AI',

        // Service 3 — Design & Branding
        'services.3.title': 'Design & Branding',
        'services.3.description': 'Logo, brand identity, social graphics — visuals that make people remember your business.',
        'services.3.whatIsIt': 'Design is often the first thing your customers judge you on. We create visual identities that are consistent, professional and actually reflect what your business stands for. Logo, colours, typography, social media templates, print materials — everything that makes your brand recognisable and trustworthy in every context.',
        'services.3.howItWorks': 'We start with a short brand questionnaire to understand your business, your audience and what makes you different from competitors. From there we develop logo concepts and a full visual identity. You get working files in every format you need, plus a brand guide so everything stays consistent as you grow.',
        'services.3.includes': 'Logo & Visual Identity|Brand Style Guide|Social Media Templates|Print Materials|Banner & Ad Design|Web UI/UX Design',

        // ── Process ──
        'process.heading': 'How we work',
        'process.subheading': 'No surprises, no ambiguity. Four steps from first message to live product.',
        'process.step.0.number': '01',
        'process.step.0.title': 'Discovery call',
        'process.step.0.description': 'We talk about your business, your goals and what you actually need. No forms, no templates — just a conversation. Usually 30 minutes.',
        'process.step.1.number': '02',
        'process.step.1.title': 'Proposal & scope',
        'process.step.1.description': 'We send a clear proposal: what we\'ll build, what\'s included, what it costs and when it\'ll be ready. No surprise invoices mid-project.',
        'process.step.2.number': '03',
        'process.step.2.title': 'Design & build',
        'process.step.2.description': 'We design, build and keep you in the loop throughout. You see progress at every stage and can give feedback before anything is finalised.',
        'process.step.3.number': '04',
        'process.step.3.title': 'Launch & handover',
        'process.step.3.description': 'We launch together, make sure everything works and hand it over properly. You get all files, access and documentation. We stay available after launch.',

        // ── Service Modal ──
        'modal.serviceOverview': 'Service Overview',
        'modal.whatIsIt': 'What is it?',
        'modal.howItWorks': 'How it works',
        'modal.keyFeatures': 'What\'s included',
        'modal.readyToTransform': 'Sounds like what you need?',
        'modal.getStarted': 'Get in Touch',

        // ── Why Us ──
        'whyUs.heading': 'Built different. Done right.',
        'whyUs.subheading': 'We\'re a small, focused team — not an agency that takes every project and hands it off to a junior. When you work with us, you\'re working with the people who actually build things.',
        'whyUs.feature.0.title': 'Everything in one place',
        'whyUs.feature.0.description': 'Design, web and AI from one team means your brand stays consistent from your logo to your chatbot. No briefing multiple vendors, no miscommunication, no gaps between deliverables.',
        'whyUs.feature.1.title': 'AI-powered delivery',
        'whyUs.feature.1.description': 'We use AI internally — faster research, faster prototyping, faster builds. You get better results in less time, without us cutting corners on quality.',
        'whyUs.feature.2.title': 'Straight talk, always',
        'whyUs.feature.2.description': 'Clear pricing upfront, honest timelines, plain-language explanations. No jargon, no surprises mid-project, no hidden costs. You always know exactly what\'s happening.',
        'whyUs.philosophy.title': 'Results, not deliverables.',
        'whyUs.philosophy.text1': 'Most agencies specialise — either they do design or they do tech. We do both, and more importantly, we understand how they connect. A beautiful website that loads slowly is a failure. An AI system that works but confuses users is a failure. We care about outcomes, not output.',
        'whyUs.philosophy.text2': 'Every project we take on starts with one question: what does success actually look like for your business? More leads, less manual work, a brand that looks the part — we build towards that, not towards a delivery checklist.',
        'whyUs.philosophy.signature': 'Marek, Founder of AIWai',
        'whyUs.vision': 'Vision',
        'whyUs.founder': 'Founder',

        // ── CTA ──
        'cta.label': 'Ready?',
        'cta.heading': 'Let\'s build something together',
        'cta.subheading': 'Tell us what you need — a website, a chatbot, automation, or just a logo. We\'ll figure out the best way to make it happen.',
        'cta.button': 'Start a Project',

        // ── Contact ──
        'contact.heading': 'Tell us about your project.',
        'contact.subheading': 'Fill in the form and we\'ll be back within 24 hours. Or just email us directly — no forms required.',
        'contact.label.name': 'Your Name',
        'contact.label.email': 'Email Address',
        'contact.label.projectType': 'What do you need?',
        'contact.label.message': 'Tell us about your project',
        'contact.button': 'Send Message',
        'contact.sending': 'Sending...',
        'contact.success.title': 'Message sent!',
        'contact.success.text': 'We\'ll get back to you within 24 hours. Talk soon.',
        'contact.success.again': 'Send another message',
        'contact.projectType.web': 'Website or Landing Page',
        'contact.projectType.chatbot': 'AI Chatbot',
        'contact.projectType.automation': 'AI Automation',
        'contact.projectType.design': 'Graphic Design',
        'contact.projectType.other': 'Something Else',

        // ── Chatbot ──
        'chatbot.bubble.initial': 'Got questions? I\'ve got answers.',
        'chatbot.bubble.repeat': 'Still here if you need me!',
        'chatbot.header': 'AIWai Assistant',
        'chatbot.placeholder': 'Type your message...',

        // ── News Section ──
        'news.badge': 'Live Automation',
        'news.heading': 'AI Newsroom, automated.',
        'news.subheading': 'aiwai.news is our own project — a fully automated news portal where AI monitors, writes and publishes tech news in real time. A working example of what we build for clients.',
        'news.readMore': 'Read more',
        'news.viewAll': 'Visit aiwai.news',
    },

    sk: {
        // ── Nav ──
        'nav.news': 'AIWai News',
        'nav.services': 'Služby',
        'nav.about': 'O nás',
        'nav.contact': 'Kontakt',

        // ── Hero ──
        'hero.line1': 'Web, dizajn, AI.',
        'hero.line2.light': 'Všetko',
        'hero.line2.gradient': 'v jednom.',
        'hero.subtitle': 'Postaráme sa o váš web, dizajn aj AI — vy riešite biznis, my riešime zvyšok.',
        'hero.cta.start': 'Porozprávajme sa',
        'hero.cta.explore': 'Čo robíme ↓',

        // ── Services ──
        'services.heading': 'Čo robíme',
        'services.subheading': 'Štyri služby. Jeden tím. Všetko, čo váš biznis potrebuje online.',
        'services.learnMore': 'Viac info',

        // Service 0 — Tvorba webov
        'services.0.title': 'Tvorba webov',
        'services.0.description': 'Rýchle, moderné webové stránky a aplikácie, ktoré premieňajú návštevníkov na zákazníkov.',
        'services.0.whatIsIt': 'Robíme weby, ktoré skutočne fungujú. Čistý dizajn, rýchle načítanie, mobilná verzia a dobrý Google ranking. Či ide o firemnú prezentáciu, produktovú landing page alebo webovú aplikáciu — robíme to poriadne s modernou technológiou, nie cez page-builder šablóny.',
        'services.0.howItWorks': 'Každý projekt začína rozhovorom o cieľoch vášho podnikania, nie výberom šablóny. Najprv nakreslíme user journey, potom navrhneme vo vysokej kvalite a až nakoniec píšeme kód. Stavíme v Next.js a React — rovnaký stack ako používajú najlepšie digitálne produkty na svete. Dostanete plné vlastníctvo kódu a web, na ktorý budete hrdí.',
        'services.0.includes': 'Firemné weby|Landing pages|E-shopy|Webové aplikácie|SEO optimalizácia|Rýchlosť a výkon',

        // Service 1 — AI Chatboty
        'services.1.title': 'AI Chatboty',
        'services.1.description': 'Inteligentné chatboty natrénované na váš biznis — odpovedajú, zachytávajú leady, rezervujú stretnutia.',
        'services.1.whatIsIt': 'Robíme chatboty, ktoré skutočne poznajú váš biznis. Natrénované na vašich produktoch, službách, FAQ a procesoch — nie na generických skriptoch. Chatbot odpovedá vo vašom tóne, vybavuje bežné otázky 24/7 a eskaluje na človeka, keď treba. Žiadne vymyslené odpovede, žiadne trapné momenty.',
        'services.1.howItWorks': 'Prepojíme vašu existujúcu dokumentáciu, katalóg produktov alebo knowledge base s chatbotom pomocou RAG technológie. Bot má prístup len k vašim dátam a odpovedá výhradne na ich základe. Zariadíme celú integráciu — na váš web, WhatsApp alebo kde sú vaši zákazníci.',
        'services.1.includes': 'Zákaznícka podpora 24/7|Zachytávanie a kvalifikácia leadov|Rezervácia stretnutí|Viacjazyčnosť|Integrácia s CRM|Hlasové AI (telefónne boty)',

        // Service 2 — AI Automatizácia
        'services.2.title': 'AI Automatizácia',
        'services.2.description': 'Prestaňte ručne robiť to, čo zvládne stroj — objednávky, emaily, faktúry, reporty.',
        'services.2.whatIsIt': 'Automatizácia biznisu znamená, že vaše nástroje spolu komunikujú a vybavujú rutinnú prácu. Nová objednávka → automaticky zapísaná do systému. Prijatá faktúra → spracovaná a uložená. Email od zákazníka → zatriedený a pripravená odpoveď. Zmapujeme, čo váš tím robí ručne, a postavíme procesy, ktoré to eliminujú.',
        'services.2.howItWorks': 'Začíname auditom procesov — pozrieme sa, čo váš tím robí opakovane a kde sa stráca čas. Potom postavíme automatizáciu cez Make.com, n8n alebo vlastné API prepojenia. AI rieši časti, kde treba úsudok — čítanie dokumentov, triedenie vstupov, rozhodovanie. Vy len kontrolujete výsledky.',
        'services.2.includes': 'Make.com & n8n workflow|Email a CRM automatizácia|Spracovanie faktúr|Synchronizácia dát|Automatizované reporty|Document AI',

        // Service 3 — Dizajn & Branding
        'services.3.title': 'Dizajn & Branding',
        'services.3.description': 'Logo, vizuálna identita, grafika pre sociálne siete — vizuály, vďaka ktorým si ľudia zapamätajú váš biznis.',
        'services.3.whatIsIt': 'Dizajn je často prvá vec, podľa ktorej vás zákazníci súdia. Vytvárame vizuálne identity, ktoré sú konzistentné, profesionálne a skutočne odrážajú, čím je váš biznis výnimočný. Logo, farby, typografia, šablóny pre sociálne siete, tlačové materiály — všetko, čo robí vašu značku rozpoznateľnou.',
        'services.3.howItWorks': 'Začíname krátkym brandovým dotazníkom — chceme pochopiť váš biznis, cieľovú skupinu a to, čím sa líšite od konkurencie. Na základe toho vypracujeme koncepty loga a kompletnú vizuálnu identitu. Dostanete pracovné súbory vo všetkých formátoch a brandovú príručku, aby všetko zostalo konzistentné.',
        'services.3.includes': 'Logo a vizuálna identita|Brand style guide|Šablóny pre sociálne siete|Tlačové materiály|Bannery a reklamy|Web UI/UX dizajn',

        // ── Process ──
        'process.heading': 'Ako pracujeme',
        'process.subheading': 'Žiadne prekvapenia, žiadna neurčitosť. Štyri kroky od prvej správy po hotový produkt.',
        'process.step.0.number': '01',
        'process.step.0.title': 'Discovery call',
        'process.step.0.description': 'Porozprávame sa o vašom biznise, cieľoch a tom, čo skutočne potrebujete. Žiadne formuláre, žiadne šablóny — len rozhovor. Zvyčajne 30 minút.',
        'process.step.1.number': '02',
        'process.step.1.title': 'Návrh a rozsah',
        'process.step.1.description': 'Pošleme jasný návrh: čo postavíme, čo je zahrnuté, koľko to stojí a kedy to bude hotové. Žiadne prekvapujúce faktúry počas projektu.',
        'process.step.2.number': '03',
        'process.step.2.title': 'Dizajn a realizácia',
        'process.step.2.description': 'Navrhujeme, stavíme a priebežne vás informujeme. Vidíte pokrok v každej fáze a môžete dávať spätnú väzbu, kým nie je nič definitívne.',
        'process.step.3.number': '04',
        'process.step.3.title': 'Spustenie a odovzdanie',
        'process.step.3.description': 'Spúšťame spoločne, uistíme sa, že všetko funguje, a riadne odovzdáme. Dostanete všetky súbory, prístupy a dokumentáciu. Po spustení zostávame k dispozícii.',

        // ── Service Modal ──
        'modal.serviceOverview': 'Prehľad služby',
        'modal.whatIsIt': 'Čo to je?',
        'modal.howItWorks': 'Ako to funguje',
        'modal.keyFeatures': 'Čo je zahrnuté',
        'modal.readyToTransform': 'Znie to ako to, čo hľadáte?',
        'modal.getStarted': 'Napíšte nám',

        // ── Why Us ──
        'whyUs.heading': 'Inak. A poriadne.',
        'whyUs.subheading': 'Sme malý, sústredený tím — nie agentúra, ktorá berie každý projekt a odovzdá ho juniorovi. Keď pracujete s nami, pracujete priamo s ľuďmi, ktorí to skutočne stavajú.',
        'whyUs.feature.0.title': 'Všetko na jednom mieste',
        'whyUs.feature.0.description': 'Dizajn, web a AI od jedného tímu znamená, že vaša značka zostane konzistentná od loga po chatbota. Žiadne briefovanie viacerých dodávateľov, žiadne nedorozumenia, žiadne medzery medzi výstupmi.',
        'whyUs.feature.1.title': 'S podporou AI',
        'whyUs.feature.1.description': 'AI používame interne — rýchlejší výskum, rýchlejšie prototypovanie, rýchlejšia realizácia. Dostanete lepšie výsledky v kratšom čase bez ústupkov v kvalite.',
        'whyUs.feature.2.title': 'Vždy na rovinu',
        'whyUs.feature.2.description': 'Jasná cena vopred, reálne termíny, vysvetlenie bez žargónu. Žiadne prekvapenia v priebehu projektu, žiadne skryté náklady. Vždy viete presne, čo sa deje.',
        'whyUs.philosophy.title': 'Výsledky, nie výstupy.',
        'whyUs.philosophy.text1': 'Väčšina agentúr sa špecializuje — buď robia dizajn alebo technológie. My robíme oboje a hlavne chápeme, ako spolu súvisia. Krásny web, ktorý je pomalý, je zlyhanie. AI systém, ktorý funguje, ale mätie používateľov, je tiež zlyhanie. Nám záleží na výsledkoch, nie na deliverables.',
        'whyUs.philosophy.text2': 'Každý projekt začíname jednou otázkou: ako vyzerá úspech pre váš biznis? Viac leadov, menej manuálnej práce, značka, ktorá vyzerá profesionálne — na to stavíme, nie na zoznam splnených úloh.',
        'whyUs.philosophy.signature': 'Marek, Zakladateľ AIWai',
        'whyUs.vision': 'Vízia',
        'whyUs.founder': 'Zakladateľ',

        // ── CTA ──
        'cta.label': 'Začneme?',
        'cta.heading': 'Postavme to spolu',
        'cta.subheading': 'Povedzte nám, čo potrebujete — web, chatbota, automatizáciu alebo len logo. Zvyšok spolu vyrieši.',
        'cta.button': 'Začať projekt',

        // ── Contact ──
        'contact.heading': 'Povedzte nám o projekte.',
        'contact.subheading': 'Vyplňte formulár a ozveme sa do 24 hodín. Alebo nám napíšte priamo na email — žiadne formuláre.',
        'contact.label.name': 'Vaše meno',
        'contact.label.email': 'E-mailová adresa',
        'contact.label.projectType': 'Čo potrebujete?',
        'contact.label.message': 'Povedzte nám o projekte',
        'contact.button': 'Odoslať správu',
        'contact.sending': 'Odosielam...',
        'contact.success.title': 'Správa odoslaná!',
        'contact.success.text': 'Ozveme sa vám do 24 hodín. Čoskoro sa ohlásime.',
        'contact.success.again': 'Poslať ďalšiu správu',
        'contact.projectType.web': 'Web alebo landing page',
        'contact.projectType.chatbot': 'AI Chatbot',
        'contact.projectType.automation': 'AI Automatizácia',
        'contact.projectType.design': 'Grafický dizajn',
        'contact.projectType.other': 'Niečo iné',

        // ── Chatbot ──
        'chatbot.bubble.initial': 'Máte otázky? Mám odpovede.',
        'chatbot.bubble.repeat': 'Stále som tu, ak ma potrebujete!',
        'chatbot.header': 'AIWai Asistent',
        'chatbot.placeholder': 'Napíšte správu...',

        // ── News Section ──
        'news.badge': 'Živá automatizácia',
        'news.heading': 'AI spravodajstvo, automaticky.',
        'news.subheading': 'aiwai.news je náš vlastný projekt — plne automatizovaný spravodajský portál, kde AI sleduje, píše a publikuje technologické správy v reálnom čase. Fungujúca ukážka toho, čo staviame pre klientov.',
        'news.readMore': 'Čítať viac',
        'news.viewAll': 'Navštíviť aiwai.news',
    },

    cs: {
        // ── Nav ──
        'nav.news': 'AIWai News',
        'nav.services': 'Služby',
        'nav.about': 'O nás',
        'nav.contact': 'Kontakt',

        // ── Hero ──
        'hero.line1': 'Web, design, AI.',
        'hero.line2.light': 'Vše',
        'hero.line2.gradient': 'v jednom.',
        'hero.subtitle': 'Postaráme se o váš web, design i AI — vy řešíte byznys, my řešíme zbytek.',
        'hero.cta.start': 'Promluvme si',
        'hero.cta.explore': 'Co děláme ↓',

        // ── Services ──
        'services.heading': 'Co děláme',
        'services.subheading': 'Čtyři služby. Jeden tým. Vše, co vaše firma potřebuje online.',
        'services.learnMore': 'Více info',

        // Service 0 — Tvorba webů
        'services.0.title': 'Tvorba webů',
        'services.0.description': 'Rychlé, moderní weby a webové aplikace, které mění návštěvníky na zákazníky.',
        'services.0.whatIsIt': 'Děláme weby, které skutečně fungují. Čistý design, rychlé načítání, mobilní verze a dobré Google rankování. Ať jde o firemní prezentaci, produktovou landing page nebo webovou aplikaci — děláme to pořádně s moderní technologií, ne přes page-builder šablony.',
        'services.0.howItWorks': 'Každý projekt začíná rozhovorem o cílech vašeho podnikání, ne výběrem šablony. Nejdříve nakreslíme user journey, pak navrhneme ve vysoké kvalitě a teprve pak píšeme kód. Stavíme v Next.js a React — stejný stack jako používají nejlepší digitální produkty na světě. Dostanete plné vlastnictví kódu a web, na který budete hrdí.',
        'services.0.includes': 'Firemní weby|Landing pages|E-shopy|Webové aplikace|SEO optimalizace|Rychlost a výkon',

        // Service 1 — AI Chatboti
        'services.1.title': 'AI Chatboti',
        'services.1.description': 'Chytré chatboty natrénované na váš byznys — odpovídají, zachytávají leady, rezervují schůzky.',
        'services.1.whatIsIt': 'Děláme chatboty, které skutečně znají váš byznys. Natrénované na vašich produktech, službách, FAQ a procesech — ne na generických skriptech. Chatbot odpovídá ve vašem tónu, vyřizuje běžné dotazy 24/7 a eskaluje na člověka, když je třeba. Žádné vymyšlené odpovědi, žádné trapné situace.',
        'services.1.howItWorks': 'Propojíme vaši stávající dokumentaci, katalog produktů nebo knowledge base s chatbotem pomocí RAG technologie. Bot má přístup pouze k vašim datům a odpovídá výhradně na jejich základě. Zajistíme celou integraci — na váš web, WhatsApp nebo kde jsou vaši zákazníci.',
        'services.1.includes': 'Zákaznická podpora 24/7|Zachytávání a kvalifikace leadů|Rezervace schůzek|Vícejazyčnost|Integrace s CRM|Hlasové AI (telefonní boty)',

        // Service 2 — AI Automatizace
        'services.2.title': 'AI Automatizace',
        'services.2.description': 'Přestaňte ručně dělat to, co zvládne stroj — objednávky, e-maily, faktury, reporty.',
        'services.2.whatIsIt': 'Automatizace byznysu znamená, že vaše nástroje spolu komunikují a vyřizují rutinní práci. Nová objednávka → automaticky zapsaná do systému. Přijatá faktura → zpracována a uložena. E-mail od zákazníka → setříděn a připravena odpověď. Zmapujeme, co váš tým dělá ručně, a postavíme procesy, které to eliminují.',
        'services.2.howItWorks': 'Začínáme auditem procesů — díváme se, co váš tým dělá opakovaně a kde se ztrácí čas. Pak postavíme automatizaci přes Make.com, n8n nebo vlastní API propojení. AI řeší části, kde je potřeba úsudek — čtení dokumentů, třídění vstupů, rozhodování. Vy jen kontrolujete výsledky.',
        'services.2.includes': 'Make.com & n8n workflow|E-mail a CRM automatizace|Zpracování faktur|Synchronizace dat|Automatizované reporty|Document AI',

        // Service 3 — Design & Branding
        'services.3.title': 'Design & Branding',
        'services.3.description': 'Logo, vizuální identita, grafika pro sociální sítě — vizuály, díky kterým si lidé zapamatují vaši firmu.',
        'services.3.whatIsIt': 'Design je často první věc, podle které vás zákazníci posuzují. Vytváříme vizuální identity, které jsou konzistentní, profesionální a skutečně odrážejí, čím je váš byznys výjimečný. Logo, barvy, typografie, šablony pro sociální sítě, tiskové materiály — vše, co dělá vaši značku rozpoznatelnou.',
        'services.3.howItWorks': 'Začínáme krátkým brandovým dotazníkem — chceme pochopit váš byznys, cílovou skupinu a to, čím se lišíte od konkurence. Na základě toho vypracujeme koncepty loga a kompletní vizuální identitu. Dostanete pracovní soubory ve všech formátech a brandovou příručku, aby vše zůstalo konzistentní.',
        'services.3.includes': 'Logo a vizuální identita|Brand style guide|Šablony pro sociální sítě|Tiskové materiály|Bannery a reklamy|Web UI/UX design',

        // ── Process ──
        'process.heading': 'Jak pracujeme',
        'process.subheading': 'Žádná překvapení, žádná neurčitost. Čtyři kroky od první zprávy po hotový produkt.',
        'process.step.0.number': '01',
        'process.step.0.title': 'Discovery call',
        'process.step.0.description': 'Pobavíme se o vašem byznysu, cílech a o tom, co skutečně potřebujete. Žádné formuláře, žádné šablony — jen rozhovor. Obvykle 30 minut.',
        'process.step.1.number': '02',
        'process.step.1.title': 'Návrh a rozsah',
        'process.step.1.description': 'Pošleme jasný návrh: co postavíme, co je zahrnuto, kolik to stojí a kdy to bude hotové. Žádné překvapivé faktury v průběhu projektu.',
        'process.step.2.number': '03',
        'process.step.2.title': 'Design a realizace',
        'process.step.2.description': 'Navrhujeme, stavíme a průběžně vás informujeme. Vidíte pokrok v každé fázi a můžete dávat zpětnou vazbu, než je cokoliv finální.',
        'process.step.3.number': '04',
        'process.step.3.title': 'Spuštění a předání',
        'process.step.3.description': 'Spouštíme společně, ujistíme se, že vše funguje, a řádně předáme. Dostanete všechny soubory, přístupy a dokumentaci. Po spuštění zůstáváme k dispozici.',

        // ── Service Modal ──
        'modal.serviceOverview': 'Přehled služby',
        'modal.whatIsIt': 'Co to je?',
        'modal.howItWorks': 'Jak to funguje',
        'modal.keyFeatures': 'Co je zahrnuto',
        'modal.readyToTransform': 'Zní to jako to, co hledáte?',
        'modal.getStarted': 'Napište nám',

        // ── Why Us ──
        'whyUs.heading': 'Jinak. A pořádně.',
        'whyUs.subheading': 'Jsme malý, soustředěný tým — ne agentura, která bere každý projekt a předá ho juniorovi. Když pracujete s námi, pracujete přímo s lidmi, kteří to skutečně staví.',
        'whyUs.feature.0.title': 'Vše na jednom místě',
        'whyUs.feature.0.description': 'Design, web a AI od jednoho týmu znamená, že vaše značka zůstane konzistentní od loga po chatbota. Žádné briefování více dodavatelů, žádná nedorozumění, žádné mezery mezi výstupy.',
        'whyUs.feature.1.title': 'S podporou AI',
        'whyUs.feature.1.description': 'AI používáme interně — rychlejší výzkum, rychlejší prototypování, rychlejší realizace. Dostanete lepší výsledky v kratším čase bez kompromisů v kvalitě.',
        'whyUs.feature.2.title': 'Vždy na rovinu',
        'whyUs.feature.2.description': 'Jasná cena předem, reálné termíny, vysvětlení bez žargonu. Žádná překvapení v průběhu projektu, žádné skryté náklady. Vždy víte přesně, co se děje.',
        'whyUs.philosophy.title': 'Výsledky, ne výstupy.',
        'whyUs.philosophy.text1': 'Většina agentur se specializuje — buď dělají design nebo technologie. My děláme obojí a hlavně chápeme, jak spolu souvisí. Krásný web, který je pomalý, je selhání. AI systém, který funguje, ale matí uživatele, je taky selhání. Nám záleží na výsledcích, ne na deliverables.',
        'whyUs.philosophy.text2': 'Každý projekt začínáme jednou otázkou: jak vypadá úspěch pro váš byznys? Více leadů, méně manuální práce, značka, která vypadá profesionálně — na to stavíme, ne na seznam splněných úkolů.',
        'whyUs.philosophy.signature': 'Marek, Zakladatel AIWai',
        'whyUs.vision': 'Vize',
        'whyUs.founder': 'Zakladatel',

        // ── CTA ──
        'cta.label': 'Začneme?',
        'cta.heading': 'Postavme to spolu',
        'cta.subheading': 'Řekněte nám, co potřebujete — web, chatbota, automatizaci nebo jen logo. Zbytek spolu vyřešíme.',
        'cta.button': 'Zahájit projekt',

        // ── Contact ──
        'contact.heading': 'Řekněte nám o projektu.',
        'contact.subheading': 'Vyplňte formulář a ozveme se do 24 hodin. Nebo nám napište přímo na e-mail — bez formulářů.',
        'contact.label.name': 'Vaše jméno',
        'contact.label.email': 'E-mailová adresa',
        'contact.label.projectType': 'Co potřebujete?',
        'contact.label.message': 'Řekněte nám o projektu',
        'contact.button': 'Odeslat zprávu',
        'contact.sending': 'Odesílám...',
        'contact.success.title': 'Zpráva odeslána!',
        'contact.success.text': 'Ozveme se vám do 24 hodin. Brzy se ohlásíme.',
        'contact.success.again': 'Poslat další zprávu',
        'contact.projectType.web': 'Web nebo landing page',
        'contact.projectType.chatbot': 'AI Chatbot',
        'contact.projectType.automation': 'AI Automatizace',
        'contact.projectType.design': 'Grafický design',
        'contact.projectType.other': 'Něco jiného',

        // ── Chatbot ──
        'chatbot.bubble.initial': 'Máte otázky? Mám odpovědi.',
        'chatbot.bubble.repeat': 'Stále jsem tu, pokud mě potřebujete!',
        'chatbot.header': 'AIWai Asistent',
        'chatbot.placeholder': 'Napište zprávu...',

        // ── News Section ──
        'news.badge': 'Živá automatizace',
        'news.heading': 'AI zpravodajství, automaticky.',
        'news.subheading': 'aiwai.news je náš vlastní projekt — plně automatizovaný zpravodajský portál, kde AI sleduje, píše a publikuje technologické zprávy v reálném čase. Fungující ukázka toho, co stavíme pro klienty.',
        'news.readMore': 'Číst více',
        'news.viewAll': 'Navštívit aiwai.news',
    },
}
