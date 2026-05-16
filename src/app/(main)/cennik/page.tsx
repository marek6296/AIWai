import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, SITE_URL } from "@/lib/seo/schemas";
import CennikClient from "./CennikClient";

export const metadata: Metadata = {
    title: "Cenník — Web, AI chatbot, automatizácia, logo, marketing",
    description:
        "Transparentné ceny: logo od €69, web od €199, e-shop od €699, chatbot od €169, automatizácia od €199, marketing od €139/mes.",
    alternates: { canonical: "/cennik" },
    openGraph: {
        title: "Cenník AIWai — Transparentné ceny bez prekvapení",
        description:
            "Logo od €69, web od €199, e-shop od €699, AI chatbot od €169. Jasná cena pred začatím.",
        url: `${SITE_URL}/cennik`,
        type: "website",
        locale: "sk_SK",
        siteName: "AIWai",
        images: ["/og-image.png"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Cenník AIWai — Transparentné ceny",
        description:
            "Logo od €69, web od €199, e-shop od €699, AI chatbot od €169.",
        images: ["/og-image.png"],
    },
};

const cennikBreadcrumbs = breadcrumbSchema([
    { name: "AIWai", url: "/" },
    { name: "Cenník", url: "/cennik" },
]);

const cennikOffers = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": `${SITE_URL}/cennik#catalog`,
    name: "Cenník AIWai",
    url: `${SITE_URL}/cennik`,
    provider: { "@id": `${SITE_URL}/#organization` },
    itemListElement: [
        { name: "Logo Basic", price: "69", description: "Logo v 3 variantoch (SVG, PNG, PDF)." },
        { name: "Logo + Brand", price: "159", description: "Logo + brand guide + šablóny pre soc. siete." },
        { name: "Grafika pre sociálne siete", price: "99", description: "Set 5–10 príspevkov pre Facebook a Instagram." },
        { name: "Prezentačná stránka", price: "199", description: "1–3 stránky, kontaktný formulár, mobilná verzia." },
        { name: "Firemný web", price: "399", description: "Viacstránkový web, blog, SEO, CMS." },
        { name: "E-shop", price: "699", description: "Produkty, košík, platobná brána." },
        { name: "Chatbot Basic", price: "169", description: "Chat widget na webe, tréning na 1 dokumente." },
        { name: "Chatbot Pro", price: "349", description: "Chat + Voice AI, CRM integrácia." },
        { name: "Automatizácia Starter", price: "199", description: "1 workflow v Make.com." },
        { name: "Marketing Starter", price: "139", description: "Mesačná správa soc. sietí." },
        { name: "Marketing Pro + Ads", price: "209", description: "Mesačná správa + Meta Ads kampane." },
    ].map((offer, idx) => ({
        "@type": "Offer",
        position: idx + 1,
        name: offer.name,
        description: offer.description,
        price: offer.price,
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        seller: { "@id": `${SITE_URL}/#organization` },
    })),
};

export default function CennikPage() {
    return (
        <>
            <JsonLd id="ld-cennik-breadcrumb" data={cennikBreadcrumbs} />
            <JsonLd id="ld-cennik-offers" data={cennikOffers} />
            <CennikClient />
        </>
    );
}
