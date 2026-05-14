import type { Metadata } from "next";
import { SERVICES } from "@/lib/seo/services";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, SITE_URL } from "@/lib/seo/schemas";
import SluzbyClient from "./SluzbyClient";

export const metadata: Metadata = {
    title: "Služby — Weby, AI chatboty, automatizácia, branding, marketing",
    description:
        "Päť služieb AIWai: tvorba webov a e-shopov, AI chatboty, automatizácia (Make.com, n8n), logo, marketing. Konzultácia zdarma do 24 h.",
    alternates: { canonical: "/sluzby" },
    openGraph: {
        title: "Služby AIWai — Web, AI, automatizácia, branding, marketing",
        description:
            "Päť služieb pod jednou strechou. Konzultácia zdarma do 24 h.",
        url: `${SITE_URL}/sluzby`,
        type: "website",
        locale: "sk_SK",
        images: ["/og-image.png"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Služby AIWai — Web, AI, automatizácia, branding, marketing",
        description: "Päť služieb pod jednou strechou.",
        images: ["/og-image.png"],
    },
};

const breadcrumbs = breadcrumbSchema([
    { name: "AIWai", url: "/" },
    { name: "Služby", url: "/sluzby" },
]);

const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/sluzby#collection`,
    name: "Služby AIWai",
    description:
        "Päť hlavných služieb digitálnej agentúry AIWai: weby, AI chatboty, automatizácia, branding, marketing.",
    url: `${SITE_URL}/sluzby`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    hasPart: SERVICES.map((s) => ({
        "@type": "Service",
        name: s.title,
        url: `${SITE_URL}/sluzby/${s.slug}`,
        description: s.tagline,
        provider: { "@id": `${SITE_URL}/#organization` },
    })),
};

export default function SluzbyPage() {
    return (
        <>
            <JsonLd id="ld-sluzby-breadcrumb" data={breadcrumbs} />
            <JsonLd id="ld-sluzby-collection" data={collectionSchema} />
            <SluzbyClient />
        </>
    );
}
