/**
 * Centralised Schema.org / JSON-LD data for AIWai.
 *
 * Why centralised: every page imports from one place — change phone or address once
 * and Google sees consistent data everywhere. Inconsistent NAP (name/address/phone)
 * across pages hurts local SEO trust.
 */

export const SITE_URL = "https://aiwai.app";
export const BUSINESS_NAME = "AIWai";
export const BUSINESS_EMAIL = "marek@aiwai.app";
export const BUSINESS_PHONE = "+421902876198";
export const BUSINESS_COUNTRY = "SK";

export const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: BUSINESS_NAME,
    legalName: "AIWai",
    url: SITE_URL,
    logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
        width: 512,
        height: 512,
    },
    image: `${SITE_URL}/og-image.png`,
    description:
        "Digitálna agentúra: tvorba webov, AI chatboty, automatizácia procesov, logo a branding, správa sociálnych sietí.",
    email: BUSINESS_EMAIL,
    telephone: BUSINESS_PHONE,
    founder: {
        "@type": "Person",
        name: "Marek Donoval",
    },
    sameAs: [
        "https://aiwai.news",
        "https://aiwai.tools",
    ],
    contactPoint: [
        {
            "@type": "ContactPoint",
            telephone: BUSINESS_PHONE,
            email: BUSINESS_EMAIL,
            contactType: "customer service",
            areaServed: ["SK", "CZ"],
            availableLanguage: ["Slovak", "Czech", "English"],
        },
    ],
} as const;

export const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: BUSINESS_NAME,
    description:
        "Tvorba webov, AI chatboty, automatizácia, logo a branding, marketing — pre malé a stredné firmy.",
    inLanguage: "sk-SK",
    publisher: { "@id": `${SITE_URL}/#organization` },
} as const;

export const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#localbusiness`,
    name: BUSINESS_NAME,
    image: `${SITE_URL}/og-image.png`,
    url: SITE_URL,
    telephone: BUSINESS_PHONE,
    email: BUSINESS_EMAIL,
    priceRange: "€€",
    address: {
        "@type": "PostalAddress",
        addressCountry: BUSINESS_COUNTRY,
    },
    areaServed: [
        { "@type": "Country", name: "Slovensko" },
        { "@type": "Country", name: "Česko" },
    ],
    serviceType: [
        "Tvorba webových stránok",
        "AI chatboty",
        "Automatizácia procesov",
        "Logo a branding",
        "Správa sociálnych sietí",
    ],
} as const;

/** BreadcrumbList for any nested page. */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: item.name,
            item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
        })),
    };
}

/** Service schema — one per service landing page. */
export interface ServiceSchemaInput {
    name: string;
    description: string;
    url: string;
    serviceType?: string;
    offers?: { name: string; price: string; priceCurrency?: string }[];
}

export function serviceSchema(input: ServiceSchemaInput) {
    const base: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Service",
        name: input.name,
        description: input.description,
        url: input.url.startsWith("http") ? input.url : `${SITE_URL}${input.url}`,
        serviceType: input.serviceType ?? input.name,
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: [
            { "@type": "Country", name: "Slovensko" },
            { "@type": "Country", name: "Česko" },
        ],
    };

    if (input.offers && input.offers.length > 0) {
        base.offers = {
            "@type": "AggregateOffer",
            priceCurrency: input.offers[0].priceCurrency ?? "EUR",
            lowPrice: input.offers
                .map((o) => parseInt(o.price.replace(/\D/g, ""), 10))
                .filter((n) => Number.isFinite(n))
                .reduce((a, b) => Math.min(a, b), Number.POSITIVE_INFINITY)
                .toString(),
            offerCount: input.offers.length.toString(),
            offers: input.offers.map((o) => ({
                "@type": "Offer",
                name: o.name,
                price: o.price.replace(/\D/g, ""),
                priceCurrency: o.priceCurrency ?? "EUR",
                availability: "https://schema.org/InStock",
            })),
        };
    }

    return base;
}

/** FAQPage schema — one per service page. */
export function faqSchema(items: { q: string; a: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
                "@type": "Answer",
                text: item.a,
            },
        })),
    };
}
