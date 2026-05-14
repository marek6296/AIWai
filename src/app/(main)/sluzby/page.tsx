import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/seo/services";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema, SITE_URL } from "@/lib/seo/schemas";

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
        <main className="min-h-screen bg-char text-cream">
            <JsonLd id="ld-sluzby-breadcrumb" data={breadcrumbs} />
            <JsonLd id="ld-sluzby-collection" data={collectionSchema} />

            <section className="container mx-auto px-6 pt-32 pb-16 md:pt-40 md:pb-24">
                <nav aria-label="Breadcrumb" className="mb-8 text-sm text-cream/60">
                    <ol className="flex gap-2">
                        <li>
                            <Link href="/" className="hover:text-cream transition-colors">
                                AIWai
                            </Link>
                        </li>
                        <li aria-hidden="true">/</li>
                        <li aria-current="page" className="text-cream">
                            Služby
                        </li>
                    </ol>
                </nav>

                <h1 className="font-display font-bold tracking-tight text-cream leading-[1.05] text-[2.5rem] md:text-7xl mb-6">
                    Päť služieb. Jeden tím.
                    <br />
                    Všetko digitálne.
                </h1>
                <p className="max-w-2xl text-lg md:text-xl text-cream/75 leading-relaxed">
                    Tvorba webov a e-shopov, AI chatboty, automatizácia procesov, logo a
                    branding, správa sociálnych sietí. Pracujeme priamo s vami — bez
                    sprostredkovateľov, s jasnou cenou a reálnymi termínmi.
                </p>
            </section>

            <section className="container mx-auto px-6 pb-24 md:pb-32">
                <div className="grid gap-6 md:grid-cols-2">
                    {SERVICES.map((service) => (
                        <Link
                            key={service.slug}
                            href={`/sluzby/${service.slug}`}
                            className="group relative overflow-hidden rounded-2xl border border-cream/10 bg-char/50 p-8 md:p-10 transition-all hover:border-gold/40 hover:bg-char/80"
                        >
                            <div
                                className="mb-6 text-5xl text-gold opacity-80 transition-transform group-hover:scale-110"
                                aria-hidden="true"
                            >
                                {service.glyph}
                            </div>

                            <h2 className="font-display font-bold text-cream text-2xl md:text-3xl tracking-tight leading-tight mb-3">
                                {service.title}
                            </h2>
                            <p className="text-cream/70 mb-6 leading-relaxed">
                                {service.tagline}
                            </p>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-cream/50">
                                    od{" "}
                                    <span className="text-gold">
                                        {service.pricing[0]?.price ?? ""}
                                    </span>
                                </span>
                                <span className="flex items-center gap-2 text-cream/80 group-hover:text-gold transition-colors">
                                    Detail
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="container mx-auto px-6 pb-24 md:pb-32 text-center">
                <h2 className="font-display font-bold text-cream text-3xl md:text-5xl mb-4">
                    Nie ste si istí, čo potrebujete?
                </h2>
                <p className="text-cream/70 max-w-2xl mx-auto mb-8">
                    Napíšte nám alebo si zarezervujte 30-minútový hovor. Bez záväzku, bez
                    formulárov, bez tlaku.
                </p>
                <Link
                    href="/#contact"
                    className="inline-block rounded-full bg-gold px-8 py-4 font-semibold text-char hover:bg-gold/90 transition-colors"
                >
                    Konzultácia zdarma →
                </Link>
            </section>
        </main>
    );
}
