export type Lang = 'en' | 'sk' | 'cs'

export const translations: Record<Lang, Record<string, string>> = {
    en: {
        // ── Nav ──
        'nav.news': 'AIWai News',
        'nav.services': 'Services',
        'nav.about': 'About',
        'nav.contact': 'Contact',
        'nav.pricing': 'Pricing',

        // ── Hero ──
        'hero.line1': 'WEB\u00A0\u00A0\u00A0DESIGN\u00A0\u00A0\u00A0AI',
        'hero.line2.light': 'Marketing',
        'hero.line2.gradient': 'Automation',
        'hero.subtitle': 'Web, design, AI chatbots, marketing and automation — you run your business, we handle everything digital.',
        'hero.cta.start': 'Let\'s talk',
        'hero.cta.explore': 'What we do ↓',

        // ── Services ──
        'services.heading': 'What we do',
        'services.subheading': 'Five services. One team. Everything your business needs online.',
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

        // Service 4 — Social Media & Ads
        'services.4.title': 'Social Media & Ads',
        'services.4.description': 'Facebook and Instagram management, paid campaigns — reach and convert your target audience.',
        'services.4.whatIsIt': 'We manage your social media presence on Facebook and Instagram — regular posts, Stories, community management and paid advertising campaigns. From content creation to ad targeting and monthly reporting — one team handles everything so you can focus on your business.',
        'services.4.howItWorks': 'We start by understanding your target audience and business goals. Then we create a monthly content plan, design all graphics, write captions, schedule posts and monitor engagement. For paid ads, we handle campaign setup, audience targeting, budget management and weekly reporting so you always know what\'s working.',
        'services.4.includes': 'Facebook & Instagram Management|Monthly Content Plan|Post Design & Copywriting|Meta Ads Campaigns|Audience Targeting & Retargeting|Monthly Performance Reports',

        // ── Process ──
        'process.heading': 'How we work',
        'process.subheading': 'Here\'s how it works — four steps and you always know where things stand.',
        'process.step.0.number': '01',
        'process.step.0.title': 'First call',
        'process.step.0.description': 'We have a quick call — you tell us what you need, we listen and ask questions. No forms, no pressure. Usually 30 minutes and you already know if we\'re the right fit.',
        'process.step.1.number': '02',
        'process.step.1.title': 'Clear offer',
        'process.step.1.description': 'We send you an offer in writing — exactly what we\'ll do, how much it costs, and when it\'ll be ready. No hidden fees, no extras that appear later.',
        'process.step.2.number': '03',
        'process.step.2.title': 'We get to work',
        'process.step.2.description': 'We build it and regularly show you how things are coming along. You can give feedback at every stage — nothing goes live without your say-so.',
        'process.step.3.number': '04',
        'process.step.3.title': 'Handover & launch',
        'process.step.3.description': 'We launch it together, check that everything works, and hand over all logins and files. If anything comes up after launch — we\'re still here.',

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
        'whyUs.feature.0.description': 'Website, logo and AI chatbot from one team. No searching for a web developer here, a designer there, and someone else for the chatbot. We handle it all.',
        'whyUs.feature.1.title': 'Faster and more affordable',
        'whyUs.feature.1.description': 'We use AI tools internally to work faster. Same quality, done in less time — which means a lower price and quicker delivery for you.',
        'whyUs.feature.2.title': 'No surprises',
        'whyUs.feature.2.description': 'You get a clear price before we start, regular updates during the project, and exactly what we promised at the end. No hidden fees, no last-minute extras.',
        'whyUs.philosophy.title': 'Plain talk, real results.',
        'whyUs.philosophy.text1': 'You don\'t need to understand the technology — that\'s our job. You need a website that brings customers. A chatbot that answers instead of you. A design that looks professional. That\'s what we focus on.',
        'whyUs.philosophy.text2': 'We work directly with you, no middlemen. Clear pricing, realistic timelines, and you always know where things stand. When we hand it over — it works.',
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
        'contact.group.design': 'Logo & Design',
        'contact.group.web': 'Web & E-shop',
        'contact.group.chatbot': 'AI Chatbot',
        'contact.group.automation': 'Process Automation',
        'contact.group.social': 'Marketing & Social Media',
        'contact.product.logoBasic': 'Logo Basic — from €99',
        'contact.product.logoBrand': 'Logo + Brand Identity — from €229',
        'contact.product.socialGraphics': 'Social Media Graphics — from €149',
        'contact.product.socialStarter': 'Marketing Starter — from €200/mo',
        'contact.product.socialPro': 'Marketing Pro + Ads — from €300/mo',
        'contact.product.landingPage': 'Presentation Website — from €299',
        'contact.product.companyWeb': 'Company Website — from €599',
        'contact.product.eshop': 'E-shop — from €999',
        'contact.product.chatbotBasic': 'Chatbot Basic — from €249',
        'contact.product.chatbotPro': 'Chatbot Pro — from €499',
        'contact.product.automationStarter': 'Automation Starter — from €299',
        'contact.product.automationPro': 'Automation Pro / Enterprise',
        'contact.projectType.other': 'Something else',

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
        'nav.pricing': 'Cenník',

        // ── Hero ──
        'hero.line1': 'WEB\u00A0\u00A0\u00A0DESIGN\u00A0\u00A0\u00A0AI',
        'hero.line2.light': 'Marketing',
        'hero.line2.gradient': 'Automatizácia',
        'hero.subtitle': 'Web, Dizajn, AI chatboty, Marketing aj Automatizácia — vy riešite biznis, my riešime všetko digitálne.',
        'hero.cta.start': 'Viac info',
        'hero.cta.explore': 'Čo robíme ↓',

        // ── Services ──
        'services.heading': 'Čo robíme',
        'services.subheading': 'Päť služieb. Jeden tím. Všetko, čo váš biznis potrebuje online.',
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

        // Service 4 — Sociálne siete & Reklamy
        'services.4.title': 'Sociálne siete & Reklamy',
        'services.4.description': 'Správa Facebooku a Instagramu, platené kampane — oslovia a konvertujú vašu cieľovú skupinu.',
        'services.4.whatIsIt': 'Spravujeme vašu prítomnosť na Facebooku a Instagrame — pravidelné príspevky, Stories, správa komunity a platené reklamné kampane. Od tvorby obsahu po cielenie reklám a mesačné reporty — jeden tím vybavuje všetko, vy sa sústredíte na biznis.',
        'services.4.howItWorks': 'Začíname pochopením vašej cieľovej skupiny a obchodných cieľov. Potom vytvoríme mesačný obsahový plán, navrhneme grafiku, napíšeme texty, naplánujeme príspevky a sledujeme zapojenie. Pri platených reklamách riešime nastavenie kampaní, cielenie, správu rozpočtu a týždenné reporty — vždy viete, čo funguje.',
        'services.4.includes': 'Správa Facebooku & Instagramu|Mesačný obsahový plán|Grafika a texty príspevkov|Meta Ads kampane|Cielenie a retargeting|Mesačné výkonnostné reporty',

        // ── Process ──
        'process.heading': 'Ako pracujeme',
        'process.subheading': 'Takto to u nás funguje — štyri kroky a vždy viete, kde sme.',
        'process.step.0.number': '01',
        'process.step.0.title': 'Úvodný hovor',
        'process.step.0.description': 'Zavoláme si — porozprávate nám, čo potrebujete, a my sa opýtame pár otázok. Žiadne formuláre, žiadny tlak. Trvá to asi 30 minút a hneď viete, či sme pre vás tí praví.',
        'process.step.1.number': '02',
        'process.step.1.title': 'Jasná ponuka',
        'process.step.1.description': 'Pošleme vám ponuku — čo presne spravíme, koľko to stojí a dokedy to bude hotové. Všetko čierne na bielom, žiadne skryté poplatky.',
        'process.step.2.number': '03',
        'process.step.2.title': 'Pustíme sa do práce',
        'process.step.2.description': 'Stavíme to a pravidelne vám ukazujeme, ako to vyzerá. Môžete sa vyjadriť v každej fáze — nič nespustíme bez vášho súhlasu.',
        'process.step.3.number': '04',
        'process.step.3.title': 'Odovzdanie a spustenie',
        'process.step.3.description': 'Spustíme to spolu, skontrolujeme, že všetko funguje, a odovzdáme vám všetky prístupy a súbory. Ak by niečo nefungovalo — sme tu aj po spustení.',

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
        'whyUs.feature.0.description': 'Web, logo aj AI chatbot od jedného tímu. Nemusíte hľadať webára zvlášť, grafika zvlášť a niekoho iného na chatbota. My to vybavíme celé.',
        'whyUs.feature.1.title': 'Rýchlejšie a lacnejšie',
        'whyUs.feature.1.description': 'AI nástroje nám pomáhajú pracovať rýchlejšie. Rovnaká kvalita, hotové skôr — čo pre vás znamená nižšiu cenu a kratšie čakanie.',
        'whyUs.feature.2.title': 'Žiadne prekvapenia',
        'whyUs.feature.2.description': 'Jasnú cenu dostanete pred začatím, pravidelné info počas projektu a na konci presne to, čo sme sľúbili. Žiadne skryté poplatky, žiadne doplatky na záver.',
        'whyUs.philosophy.title': 'Hovoríme na rovinu.',
        'whyUs.philosophy.text1': 'Nemusíte rozumieť technológiám — to je naša práca. Potrebujete web, ktorý prináša zákazníkov. Chatbota, ktorý odpovedá namiesto vás. Grafiku, ktorá vyzerá profesionálne. Na to sa sústreďujeme.',
        'whyUs.philosophy.text2': 'Pracujeme priamo s vami, bez zbytočných sprostredkovateľov. Jasná cena, reálne termíny a vždy viete kde projekt stojí. Keď odovzdáme — funguje to.',
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
        'contact.group.design': 'Logo & Dizajn',
        'contact.group.web': 'Web & E-shop',
        'contact.group.chatbot': 'AI Chatbot',
        'contact.group.automation': 'Automatizácia procesov',
        'contact.group.social': 'Marketing & Sociálne siete',
        'contact.product.logoBasic': 'Logo Basic — od €99',
        'contact.product.logoBrand': 'Logo + Brand — od €229',
        'contact.product.socialGraphics': 'Grafika pre sociálne siete — od €149',
        'contact.product.socialStarter': 'Marketing Starter — od €200/mes',
        'contact.product.socialPro': 'Marketing Pro + Ads — od €300/mes',
        'contact.product.landingPage': 'Prezentačná stránka — od €299',
        'contact.product.companyWeb': 'Firemný web — od €599',
        'contact.product.eshop': 'E-shop — od €999',
        'contact.product.chatbotBasic': 'Chatbot Basic — od €249',
        'contact.product.chatbotPro': 'Chatbot Pro — od €499',
        'contact.product.automationStarter': 'Automatizácia Starter — od €299',
        'contact.product.automationPro': 'Automatizácia Pro / Enterprise',
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
        'nav.pricing': 'Ceník',

        // ── Hero ──
        'hero.line1': 'WEB\u00A0\u00A0\u00A0DESIGN\u00A0\u00A0\u00A0AI',
        'hero.line2.light': 'Marketing',
        'hero.line2.gradient': 'Automatizace',
        'hero.subtitle': 'Web, design, AI chatboti, marketing i automatizace — vy řešíte byznys, my řešíme vše digitální.',
        'hero.cta.start': 'Promluvme si',
        'hero.cta.explore': 'Co děláme ↓',

        // ── Services ──
        'services.heading': 'Co děláme',
        'services.subheading': 'Pět služeb. Jeden tým. Vše, co vaše firma potřebuje online.',
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

        // Service 4 — Sociální sítě & Reklamy
        'services.4.title': 'Sociální sítě & Reklamy',
        'services.4.description': 'Správa Facebooku a Instagramu, placené kampaně — oslovíte a konvertujete svou cílovou skupinu.',
        'services.4.whatIsIt': 'Spravujeme vaši přítomnost na Facebooku a Instagramu — pravidelné příspěvky, Stories, správa komunity a placené reklamní kampaně. Od tvorby obsahu po cílení reklam a měsíční reporty — jeden tým vyřizuje vše, vy se soustředíte na byznys.',
        'services.4.howItWorks': 'Začínáme pochopením vaší cílové skupiny a obchodních cílů. Pak vytvoříme měsíční obsahový plán, navrhneme grafiku, napíšeme texty, naplánujeme příspěvky a sledujeme zapojení. U placených reklam řešíme nastavení kampaní, cílení, správu rozpočtu a týdenní reporty — vždy víte, co funguje.',
        'services.4.includes': 'Správa Facebooku & Instagramu|Měsíční obsahový plán|Grafika a texty příspěvků|Meta Ads kampaně|Cílení a retargeting|Měsíční výkonnostní reporty',

        // ── Process ──
        'process.heading': 'Jak pracujeme',
        'process.subheading': 'Takto to u nás funguje — čtyři kroky a vždy víte, kde jsme.',
        'process.step.0.number': '01',
        'process.step.0.title': 'Úvodní hovor',
        'process.step.0.description': 'Zavoláme si — řeknete nám, co potřebujete, a my se zeptáme pár otázek. Žádné formuláře, žádný tlak. Trvá to asi 30 minut a hned víte, jestli jsme pro vás ti praví.',
        'process.step.1.number': '02',
        'process.step.1.title': 'Jasná nabídka',
        'process.step.1.description': 'Pošleme vám nabídku — co přesně uděláme, kolik to stojí a do kdy to bude hotové. Vše černé na bílém, žádné skryté poplatky.',
        'process.step.2.number': '03',
        'process.step.2.title': 'Pustíme se do práce',
        'process.step.2.description': 'Stavíme to a pravidelně vám ukazujeme, jak to vypadá. Můžete se vyjádřit v každé fázi — nic nespustíme bez vašeho souhlasu.',
        'process.step.3.number': '04',
        'process.step.3.title': 'Předání a spuštění',
        'process.step.3.description': 'Spustíme to spolu, zkontrolujeme, že vše funguje, a předáme vám všechny přístupy a soubory. Pokud by cokoliv nefungovalo — jsme tu i po spuštění.',

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
        'whyUs.feature.0.description': 'Web, logo i AI chatbot od jednoho týmu. Nemusíte hledat webaře zvlášť, grafika zvlášť a někoho jiného na chatbota. My to vyřídíme celé.',
        'whyUs.feature.1.title': 'Rychleji a levněji',
        'whyUs.feature.1.description': 'AI nástroje nám pomáhají pracovat rychleji. Stejná kvalita, hotovo dřív — což pro vás znamená nižší cenu a kratší čekání.',
        'whyUs.feature.2.title': 'Žádná překvapení',
        'whyUs.feature.2.description': 'Jasnou cenu dostanete před začátkem, pravidelné info během projektu a na konci přesně to, co jsme slíbili. Žádné skryté poplatky, žádné doplatky na závěr.',
        'whyUs.philosophy.title': 'Mluvíme na rovinu.',
        'whyUs.philosophy.text1': 'Nemusíte rozumět technologiím — to je naše práce. Potřebujete web, který přináší zákazníky. Chatbota, který odpovídá místo vás. Grafiku, která vypadá profesionálně. Na to se soustředíme.',
        'whyUs.philosophy.text2': 'Pracujeme přímo s vámi, bez zbytečných prostředníků. Jasná cena, reálné termíny a vždy víte, kde projekt stojí. Když předáme — funguje to.',
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
        'contact.group.design': 'Logo & Design',
        'contact.group.web': 'Web & E-shop',
        'contact.group.chatbot': 'AI Chatbot',
        'contact.group.automation': 'Automatizace procesů',
        'contact.group.social': 'Marketing & Sociální sítě',
        'contact.product.logoBasic': 'Logo Basic — od €99',
        'contact.product.logoBrand': 'Logo + Brand — od €229',
        'contact.product.socialGraphics': 'Grafika pro sociální sítě — od €149',
        'contact.product.socialStarter': 'Marketing Starter — od €200/měs',
        'contact.product.socialPro': 'Marketing Pro + Ads — od €300/měs',
        'contact.product.landingPage': 'Prezentační stránka — od €299',
        'contact.product.companyWeb': 'Firemní web — od €599',
        'contact.product.eshop': 'E-shop — od €999',
        'contact.product.chatbotBasic': 'Chatbot Basic — od €249',
        'contact.product.chatbotPro': 'Chatbot Pro — od €499',
        'contact.product.automationStarter': 'Automatizace Starter — od €299',
        'contact.product.automationPro': 'Automatizace Pro / Enterprise',
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
