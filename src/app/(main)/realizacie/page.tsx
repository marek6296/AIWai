import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, SITE_URL } from "@/lib/seo/schemas";
import RealizacieClient from "./RealizacieClient";
import { REALIZACIE_GROUPS } from "./data";

export const metadata: Metadata = {
    title: "Realizácie — Portfólio webov, AI nástrojov a automatizácií",
    description:
        "Reálne nasadené projekty: AIWai News, AIWai Tools, Morak, Zaidans Barbershop, Lead Agent. Weby, e-shopy, AI agenti a dashboardy v produkcii.",
    alternates: { canonical: "/realizacie" },
    openGraph: {
        title: "Realizácie AIWai — Portfólio projektov",
        description:
            "Weby, e-shopy, AI agenti, automatizácie a dashboardy. Reálne nasadené projekty v produkcii.",
        url: `${SITE_URL}/realizacie`,
        type: "website",
        locale: "sk_SK",
        siteName: "AIWai",
        images: ["/og-image.png"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Realizácie AIWai — Portfólio",
        description:
            "Weby, e-shopy, AI agenti, automatizácie a dashboardy v produkcii.",
        images: ["/og-image.png"],
    },
};

const realizacieBreadcrumbs = breadcrumbSchema([
    { name: "AIWai", url: "/" },
    { name: "Realizácie", url: "/realizacie" },
]);

function buildItemListSchema() {
    const items = REALIZACIE_GROUPS.flatMap((g) => g.projects);
    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "@id": `${SITE_URL}/realizacie#projects`,
        name: "Realizácie AIWai",
        url: `${SITE_URL}/realizacie`,
        numberOfItems: items.length,
        itemListElement: items.map((p, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            item: {
                "@type": "CreativeWork",
                name: p.name,
                description: p.description,
                ...(p.private || !p.url
                    ? {}
                    : { url: p.url.startsWith("http") ? p.url : `https://${p.url}` }),
                creator: { "@id": `${SITE_URL}/#organization` },
                ...(p.category ? { genre: p.category } : {}),
            },
        })),
    };
}

export default function RealizaciePage() {
    return (
        <>
            <JsonLd id="ld-realizacie-breadcrumb" data={realizacieBreadcrumbs} />
            <JsonLd id="ld-realizacie-itemlist" data={buildItemListSchema()} />
            <RealizacieClient />
        </>
    );
}
