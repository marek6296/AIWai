export type Lang = 'en' | 'sk' | 'cs'

export const translations: Record<Lang, Record<string, string>> = {
    en: {
        // ── Nav ──
        'nav.services': 'Services',
        'nav.about': 'About',
        'nav.contact': 'Contact',

        // ── Hero ──
        'hero.subtitle': 'We design and build AI-powered digital experiences that transform businesses. Premium design meets intelligent automation.',
        'hero.cta.start': 'Start a Project',
        'hero.cta.explore': 'Explore Services ↓',

        // ── Services ──
        'services.heading': 'What we build',
        'services.subheading': 'We build the neural network of your digital presence.',
        'services.learnMore': 'Learn more',

        // Service 1 - AI Agents
        'services.0.title': 'AI Agents',
        'services.0.description': 'Autonomous digital workers that handle complex workflows 24/7.',
        'services.0.whatIsIt': 'AI Agents are sophisticated digital systems empowered to perform tasks and make decisions autonomously. Unlike simple bots, they can plan, execute multi-step workflows, and learn from their environment.',
        'services.0.howItWorks': "We architect custom agents using LLMs (Large Language Models) integrated with your specific data. These agents use 'Chain of Thought' reasoning to break down complex tasks, access tools when needed, and verify their own outputs before completion.",
        'services.0.includes': '24/7 Autonomous Operation|Tool & API Integration|Self-Correction Capabilities|Natural Language Processing|Adaptive Learning|Multi-Language Support',

        // Service 2 - AI Chatbots
        'services.1.title': 'AI Chatbots',
        'services.1.description': 'Intelligent conversational interfaces that understand context and nuance.',
        'services.1.whatIsIt': "Our AI Chatbots are context-aware conversational partners that go beyond simple templates. They represent your brand's voice while providing instant, accurate, and human-like support to users.",
        'services.1.howItWorks': "Using RAG (Retrieval Augmented Generation), our chatbots 'read' your documentation and knowledge base. When a user asks a question, the bot retrieves the relevant facts and generates a natural, helpful response based purely on your company's data.",
        'services.1.includes': 'RAG Fact-Checking|Dynamic Conversation Flow|Natural Language Understanding|Sentiment Analysis|Lead Qualification|Seamless CRM Sync',

        // Service 3 - Automation
        'services.2.title': 'Automation',
        'services.2.description': 'Seamless integration of AI into your existing business infrastructure.',
        'services.2.whatIsIt': 'Business Process Automation (BPA) enhanced by AI transforms repetitive manual tasks into lightning-fast background processes. We connect your existing apps into an intelligent, self-driving ecosystem.',
        'services.2.howItWorks': 'We map your current business logic and identify bottlenecks. Then, we build custom "bridges" between your tools (like Slack, CRM, Email) using AI to handle data interpretation, categorization, and decision-making at every step.',
        'services.2.includes': 'Workflow Optimization|Data Entry Automation|Intelligent Document Parsing|Auto-Triggered Actions|Error Monitoring|Scalable Architectures',

        // Service 4 - Design
        'services.3.title': 'Design & Graphics',
        'services.3.description': 'Stunning visuals and UI/UX design that captivate your audience.',
        'services.3.whatIsIt': "We blend human creativity with AI-powered design tools to create high-impact visual identities. From modern UI/UX to generated brand assets, we push the boundaries of what's possible in digital art.",
        'services.3.howItWorks': 'We start with a traditional design discovery phase, then leverage AI tools to rapidly prototype high-fidelity visuals. This allows us to explore thousands of creative directions and perfect the final aesthetic in record time.',
        'services.3.includes': 'UI/UX Design Systems|AI Image Generation|Brand Identity Packs|Responsive Web Design|Interactive Prototypes|Visual Storytelling',

        // ── Service Modal ──
        'modal.serviceOverview': 'Service Overview',
        'modal.whatIsIt': 'What is it?',
        'modal.howItWorks': 'How it works',
        'modal.keyFeatures': 'Key Features',
        'modal.readyToTransform': 'Ready to transform your business?',
        'modal.getStarted': 'Get Started',

        // ── Why Us ──
        'whyUs.heading': 'Simpler. Smarter. Better.',
        'whyUs.subheading': 'We strip away the unnecessary noise. What remains is pure digital impact—combining aesthetic perfection with the raw power of artificial intelligence.',
        'whyUs.feature.0.title': 'Premium Design',
        'whyUs.feature.0.description': 'We don\'t just build websites. We craft visual experiences that captivate your audience and elevate your brand identity to a world-class level.',
        'whyUs.feature.1.title': 'Intelligent Core',
        'whyUs.feature.1.description': 'Future-proof your business with AI-driven architecture. From smart automation to neural agents, we build systems that think and adapt.',
        'whyUs.feature.2.title': 'Simplicity & Growth',
        'whyUs.feature.2.description': 'Complex technology, simplified for you. We focus on clean, scalable solutions that drive real engagement and measurable business results.',
        'whyUs.stat.0': 'Projects Delivered',
        'whyUs.stat.1': 'Client Satisfaction',
        'whyUs.stat.2': 'AI Uptime',
        'whyUs.stat.3': 'Average ROI Boost',

        // ── CTA ──
        'cta.label': 'Ready to start?',
        'cta.heading': "Let's build something intelligent together",
        'cta.subheading': 'Transform your digital presence with AI-powered solutions designed for measurable impact.',
        'cta.button': 'Start a Project',

        // ── Contact ──
        'contact.heading': "Let's build something smart.",
        'contact.subheading': "Ready to elevate your digital presence? Tell us about your project and we'll help you architect the perfect solution.",
        'contact.label.name': 'Your Name',
        'contact.label.email': 'Email Address',
        'contact.label.projectType': 'Project Type',
        'contact.label.message': 'Tell us about your project',
        'contact.button': 'Send Message',
        'contact.sending': 'Sending...',
        'contact.success.title': 'Message Sent!',
        'contact.success.text': 'Thank you for reaching out. We will get back to you shortly.',
        'contact.success.again': 'Send another message',
        'contact.projectType.web': 'Web Development',
        'contact.projectType.ai': 'AI Integration',
        'contact.projectType.design': 'Design System',
        'contact.projectType.other': 'Other',

        // ── Chatbot ──
        'chatbot.bubble.initial': "Got questions? I've got answers.",
        'chatbot.bubble.repeat': 'Still here if you need me!',
        'chatbot.header': 'AIWai Assistant',
        'chatbot.placeholder': 'Type your message...',
    },

    sk: {
        // ── Nav ──
        'nav.services': 'Služby',
        'nav.about': 'O nás',
        'nav.contact': 'Kontakt',

        // ── Hero ──
        'hero.subtitle': 'Navrhujeme a vytvárame digitálne zážitky poháňané AI, ktoré transformujú podnikanie. Prémiový dizajn spojený s inteligentnou automatizáciou.',
        'hero.cta.start': 'Začať projekt',
        'hero.cta.explore': 'Preskúmať služby ↓',

        // ── Services ──
        'services.heading': 'Čo tvoríme',
        'services.subheading': 'Budujeme neurálnu sieť vašej digitálnej prítomnosti.',
        'services.learnMore': 'Viac info',

        'services.0.title': 'AI Agenti',
        'services.0.description': 'Autonómni digitálni pracovníci, ktorí zvládajú komplexné procesy 24/7.',
        'services.0.whatIsIt': 'AI Agenti sú sofistikované digitálne systémy schopné autonómne vykonávať úlohy a rozhodovať sa. Na rozdiel od jednoduchých botov dokážu plánovať, vykonávať viacstupňové procesy a učiť sa z prostredia.',
        'services.0.howItWorks': 'Navrhujeme agentov na mieru pomocou LLM (veľkých jazykových modelov) integrovaných s vašimi dátami. Agenti používajú reťazové uvažovanie na rozdelenie zložitých úloh, prístup k nástrojom a overenie výstupov.',
        'services.0.includes': 'Autonómna prevádzka 24/7|Integrácia nástrojov a API|Schopnosť sebaopravy|Spracovanie prirodzeného jazyka|Adaptívne učenie|Viacjazyčná podpora',

        'services.1.title': 'AI Chatboty',
        'services.1.description': 'Inteligentné konverzačné rozhrania, ktoré rozumejú kontextu a nuansám.',
        'services.1.whatIsIt': 'Naše AI chatboty sú kontextovo uvedomelí konverzační partneri, ktorí idú nad rámec jednoduchých šablón. Reprezentujú hlas vašej značky a poskytujú okamžitú, presnú a ľudskú podporu.',
        'services.1.howItWorks': 'Pomocou RAG (Retrieval Augmented Generation) naše chatboty „čítajú" vašu dokumentáciu a znalostnú bázu. Keď používateľ položí otázku, bot vyhľadá relevantné fakty a vygeneruje prirodzenú odpoveď.',
        'services.1.includes': 'RAG kontrola faktov|Dynamický tok konverzácie|Porozumenie prirodzenému jazyku|Analýza sentimentu|Kvalifikácia leadov|Integrácia s CRM',

        'services.2.title': 'Automatizácia',
        'services.2.description': 'Bezproblémová integrácia AI do vašej existujúcej infraštruktúry.',
        'services.2.whatIsIt': 'Automatizácia podnikových procesov (BPA) vylepšená AI premieňa opakujúce sa manuálne úlohy na bleskurýchle procesy na pozadí. Prepojíme vaše existujúce aplikácie do inteligentného ekosystému.',
        'services.2.howItWorks': 'Zmapujeme vašu obchodnú logiku a identifikujeme úzke miesta. Potom vytvoríme „mosty" medzi vašimi nástrojmi (Slack, CRM, Email) s AI na spracovanie a rozhodovanie v každom kroku.',
        'services.2.includes': 'Optimalizácia procesov|Automatizácia zadávania dát|Inteligentné parsovanie dokumentov|Automaticky spúšťané akcie|Monitorovanie chýb|Škálovateľné architektúry',

        'services.3.title': 'Dizajn & Grafika',
        'services.3.description': 'Ohromujúce vizuály a UI/UX dizajn, ktorý uchváti vaše publikum.',
        'services.3.whatIsIt': 'Spájame ľudskú kreativitu s dizajnovými nástrojmi poháňanými AI na tvorbu vysoko-impaktových vizuálnych identít. Od moderného UI/UX po generované brandové prvky posúvame hranice digitálneho umenia.',
        'services.3.howItWorks': 'Začíname tradičnou fázou dizajnového prieskumu a potom využívame AI na rýchle prototypovanie vizuálov vo vysokej kvalite. To nám umožňuje preskúmať tisíce kreatívnych smerov.',
        'services.3.includes': 'UI/UX dizajnové systémy|AI generovanie obrázkov|Balíčky identity značky|Responzívny webový dizajn|Interaktívne prototypy|Vizuálne rozprávanie',

        // ── Service Modal ──
        'modal.serviceOverview': 'Prehľad služby',
        'modal.whatIsIt': 'Čo to je?',
        'modal.howItWorks': 'Ako to funguje',
        'modal.keyFeatures': 'Kľúčové funkcie',
        'modal.readyToTransform': 'Pripravení transformovať vaše podnikanie?',
        'modal.getStarted': 'Začať',

        // ── Why Us ──
        'whyUs.heading': 'Jednoduchšie. Inteligentnejšie. Lepšie.',
        'whyUs.subheading': 'Odstraňujeme zbytočný šum. Zostáva čistý digitálny dopad — kombinácia estetickej dokonalosti so silou umelej inteligencie.',
        'whyUs.feature.0.title': 'Prémiový dizajn',
        'whyUs.feature.0.description': 'Nielen vytvárame weby. Tvoríme vizuálne zážitky, ktoré uchvátia vaše publikum a posunú identitu vašej značky na svetovú úroveň.',
        'whyUs.feature.1.title': 'Inteligentné jadro',
        'whyUs.feature.1.description': 'Pripravte vaše podnikanie na budúcnosť s architektúrou riadenou AI. Od inteligentnej automatizácie po neurálnych agentov — budujeme systémy, ktoré myslia a prispôsobujú sa.',
        'whyUs.feature.2.title': 'Jednoduchosť & Rast',
        'whyUs.feature.2.description': 'Komplexná technológia zjednodušená pre vás. Zameriavame sa na čisté, škálovateľné riešenia, ktoré prinášajú reálne výsledky.',
        'whyUs.stat.0': 'Dodaných projektov',
        'whyUs.stat.1': 'Spokojnosť klientov',
        'whyUs.stat.2': 'AI dostupnosť',
        'whyUs.stat.3': 'Priemerný nárast ROI',

        // ── CTA ──
        'cta.label': 'Pripravení začať?',
        'cta.heading': 'Postavme spolu niečo inteligentné',
        'cta.subheading': 'Transformujte svoju digitálnu prítomnosť s riešeniami poháňanými AI, navrhnutými pre merateľný dopad.',
        'cta.button': 'Začať projekt',

        // ── Contact ──
        'contact.heading': 'Postavme niečo smart.',
        'contact.subheading': 'Pripravení posunúť svoju digitálnu prítomnosť? Povedzte nám o svojom projekte a pomôžeme vám navrhnúť perfektné riešenie.',
        'contact.label.name': 'Vaše meno',
        'contact.label.email': 'E-mailová adresa',
        'contact.label.projectType': 'Typ projektu',
        'contact.label.message': 'Povedzte nám o vašom projekte',
        'contact.button': 'Odoslať správu',
        'contact.sending': 'Odosielam...',
        'contact.success.title': 'Správa odoslaná!',
        'contact.success.text': 'Ďakujeme za správu. Ozveme sa vám čo najskôr.',
        'contact.success.again': 'Poslať ďalšiu správu',
        'contact.projectType.web': 'Vývoj webu',
        'contact.projectType.ai': 'AI integrácia',
        'contact.projectType.design': 'Dizajnový systém',
        'contact.projectType.other': 'Iné',

        // ── Chatbot ──
        'chatbot.bubble.initial': 'Máte otázky? Mám odpovede.',
        'chatbot.bubble.repeat': 'Stále som tu, ak ma potrebujete!',
        'chatbot.header': 'AIWai Asistent',
        'chatbot.placeholder': 'Napíšte správu...',
    },

    cs: {
        // ── Nav ──
        'nav.services': 'Služby',
        'nav.about': 'O nás',
        'nav.contact': 'Kontakt',

        // ── Hero ──
        'hero.subtitle': 'Navrhujeme a tvoříme digitální zážitky poháněné AI, které transformují podnikání. Prémiový design spojený s inteligentní automatizací.',
        'hero.cta.start': 'Zahájit projekt',
        'hero.cta.explore': 'Prozkoumat služby ↓',

        // ── Services ──
        'services.heading': 'Co tvoříme',
        'services.subheading': 'Budujeme neurální síť vaší digitální přítomnosti.',
        'services.learnMore': 'Více info',

        'services.0.title': 'AI Agenti',
        'services.0.description': 'Autonomní digitální pracovníci, kteří zvládají komplexní procesy 24/7.',
        'services.0.whatIsIt': 'AI Agenti jsou sofistikované digitální systémy schopné autonomně vykonávat úkoly a rozhodovat se. Na rozdíl od jednoduchých botů dokáží plánovat, vykonávat vícekrokové procesy a učit se z prostředí.',
        'services.0.howItWorks': 'Navrhujeme agenty na míru pomocí LLM (velkých jazykových modelů) integrovaných s vašimi daty. Agenti používají řetězové uvažování k rozložení složitých úkolů, přístupu k nástrojům a ověření výstupů.',
        'services.0.includes': 'Autonomní provoz 24/7|Integrace nástrojů a API|Schopnost sebekorekce|Zpracování přirozeného jazyka|Adaptivní učení|Vícejazyčná podpora',

        'services.1.title': 'AI Chatboti',
        'services.1.description': 'Inteligentní konverzační rozhraní, která rozumí kontextu a nuancím.',
        'services.1.whatIsIt': 'Naši AI chatboti jsou kontextově uvědomělí konverzační partneři, kteří jdou nad rámec jednoduchých šablon. Reprezentují hlas vaší značky a poskytují okamžitou, přesnou a lidskou podporu.',
        'services.1.howItWorks': 'Pomocí RAG (Retrieval Augmented Generation) naši chatboti „čtou" vaši dokumentaci a znalostní bázi. Když uživatel položí otázku, bot vyhledá relevantní fakta a vygeneruje přirozenou odpověď.',
        'services.1.includes': 'RAG kontrola faktů|Dynamický tok konverzace|Porozumění přirozenému jazyku|Analýza sentimentu|Kvalifikace leadů|Integrace s CRM',

        'services.2.title': 'Automatizace',
        'services.2.description': 'Bezproblémová integrace AI do vaší stávající infrastruktury.',
        'services.2.whatIsIt': 'Automatizace podnikových procesů (BPA) vylepšená AI proměňuje opakující se manuální úkoly v bleskurychlé procesy na pozadí. Propojíme vaše stávající aplikace do inteligentního ekosystému.',
        'services.2.howItWorks': 'Zmapujeme vaši obchodní logiku a identifikujeme úzká místa. Poté vytvoříme „mosty" mezi vašimi nástroji (Slack, CRM, Email) s AI pro zpracování a rozhodování v každém kroku.',
        'services.2.includes': 'Optimalizace procesů|Automatizace zadávání dat|Inteligentní parsování dokumentů|Automaticky spouštěné akce|Monitorování chyb|Škálovatelné architektury',

        'services.3.title': 'Design & Grafika',
        'services.3.description': 'Ohromující vizuály a UI/UX design, který uchvátí vaše publikum.',
        'services.3.whatIsIt': 'Spojujeme lidskou kreativitu s designovými nástroji poháněnými AI pro tvorbu vysoce impaktových vizuálních identit. Od moderního UI/UX po generované brandové prvky posouváme hranice digitálního umění.',
        'services.3.howItWorks': 'Začínáme tradiční fází designového průzkumu a poté využíváme AI k rychlému prototypování vizuálů ve vysoké kvalitě. To nám umožňuje prozkoumat tisíce kreativních směrů.',
        'services.3.includes': 'UI/UX designové systémy|AI generování obrázků|Balíčky identity značky|Responzivní webový design|Interaktivní prototypy|Vizuální vyprávění',

        // ── Service Modal ──
        'modal.serviceOverview': 'Přehled služby',
        'modal.whatIsIt': 'Co to je?',
        'modal.howItWorks': 'Jak to funguje',
        'modal.keyFeatures': 'Klíčové funkce',
        'modal.readyToTransform': 'Připraveni transformovat vaše podnikání?',
        'modal.getStarted': 'Začít',

        // ── Why Us ──
        'whyUs.heading': 'Jednodušší. Chytřejší. Lepší.',
        'whyUs.subheading': 'Odstraňujeme zbytečný šum. Zůstává čistý digitální dopad — kombinace estetické dokonalosti se silou umělé inteligence.',
        'whyUs.feature.0.title': 'Prémiový design',
        'whyUs.feature.0.description': 'Nejen stavíme weby. Tvoříme vizuální zážitky, které uchvátí vaše publikum a posunou identitu vaší značky na světovou úroveň.',
        'whyUs.feature.1.title': 'Inteligentní jádro',
        'whyUs.feature.1.description': 'Připravte vaše podnikání na budoucnost s architekturou řízenou AI. Od chytré automatizace po neurální agenty — budujeme systémy, které myslí a přizpůsobují se.',
        'whyUs.feature.2.title': 'Jednoduchost & Růst',
        'whyUs.feature.2.description': 'Komplexní technologie zjednodušená pro vás. Zaměřujeme se na čistá, škálovatelná řešení, která přinášejí reálné výsledky.',
        'whyUs.stat.0': 'Dodaných projektů',
        'whyUs.stat.1': 'Spokojenost klientů',
        'whyUs.stat.2': 'AI dostupnost',
        'whyUs.stat.3': 'Průměrný nárůst ROI',

        // ── CTA ──
        'cta.label': 'Připraveni začít?',
        'cta.heading': 'Postavme spolu něco inteligentního',
        'cta.subheading': 'Transformujte svou digitální přítomnost s řešeními poháněnými AI, navržených pro měřitelný dopad.',
        'cta.button': 'Zahájit projekt',

        // ── Contact ──
        'contact.heading': 'Postavme něco smart.',
        'contact.subheading': 'Připraveni posunout svou digitální přítomnost? Řekněte nám o svém projektu a pomůžeme vám navrhnout perfektní řešení.',
        'contact.label.name': 'Vaše jméno',
        'contact.label.email': 'E-mailová adresa',
        'contact.label.projectType': 'Typ projektu',
        'contact.label.message': 'Řekněte nám o vašem projektu',
        'contact.button': 'Odeslat zprávu',
        'contact.sending': 'Odesílám...',
        'contact.success.title': 'Zpráva odeslána!',
        'contact.success.text': 'Děkujeme za zprávu. Ozveme se vám co nejdříve.',
        'contact.success.again': 'Poslat další zprávu',
        'contact.projectType.web': 'Vývoj webu',
        'contact.projectType.ai': 'AI integrace',
        'contact.projectType.design': 'Designový systém',
        'contact.projectType.other': 'Jiné',

        // ── Chatbot ──
        'chatbot.bubble.initial': 'Máte otázky? Mám odpovědi.',
        'chatbot.bubble.repeat': 'Stále jsem tu, pokud mě potřebujete!',
        'chatbot.header': 'AIWai Asistent',
        'chatbot.placeholder': 'Napište zprávu...',
    },
}
