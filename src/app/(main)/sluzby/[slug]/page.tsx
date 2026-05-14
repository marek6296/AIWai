import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { SERVICES, SERVICE_SLUGS, getService } from "@/lib/seo/services";
import JsonLd from "@/components/seo/JsonLd";
import {
    breadcrumbSchema,
    faqSchema,
    serviceSchema,
    SITE_URL,
} from "@/lib/seo/schemas";

export function generateStaticParams() {
    return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const service = getService(params.slug);
    if (!service) {
        return { title: "Služba nenájdená" };
    }
    return {
        title: service.seoTitle,
        description: service.seoDescription,
        alternates: { canonical: `/sluzby/${service.slug}` },
        openGraph: {
            title: service.seoTitle,
            description: service.seoDescription,
            url: `${SITE_URL}/sluzby/${service.slug}`,
            type: "website",
            locale: "sk_SK",
            siteName: "AIWai",
            images: ["/og-image.png"],
        },
        twitter: {
            card: "summary_large_image",
            title: service.seoTitle,
            description: service.seoDescription,
            images: ["/og-image.png"],
        },
    };
}

export default function ServicePage({ params }: { params: { slug: string } }) {
    const service = getService(params.slug);
    if (!service) notFound();

    const related = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 3);

    const breadcrumbs = breadcrumbSchema([
        { name: "AIWai", url: "/" },
        { name: "Služby", url: "/sluzby" },
        { name: service.title, url: `/sluzby/${service.slug}` },
    ]);

    const schema = serviceSchema({
        name: service.title,
        description: service.seoDescription,
        url: `/sluzby/${service.slug}`,
        serviceType: service.title,
        offers: service.pricing
            .filter((p) => /\d/.test(p.price))
            .map((p) => ({ name: p.name, price: p.price })),
    });

    const faq = faqSchema(service.faq);

    return (
        <main className="min-h-screen bg-char text-cream">
            <JsonLd id={`ld-${service.slug}-breadcrumb`} data={breadcrumbs} />
            <JsonLd id={`ld-${service.slug}-service`} data={schema} />
            <JsonLd id={`ld-${service.slug}-faq`} data={faq} />

            {/* Hero */}
            <section className="container mx-auto px-6 pt-32 pb-16 md:pt-40 md:pb-20">
                <nav aria-label="Breadcrumb" className="mb-8 text-sm text-cream/60">
                    <ol className="flex flex-wrap gap-2">
                        <li>
                            <Link href="/" className="hover:text-cream transition-colors">
                                AIWai
                            </Link>
                        </li>
                        <li aria-hidden="true">/</li>
                        <li>
                            <Link
                                href="/sluzby"
                                className="hover:text-cream transition-colors"
                            >
                                Služby
                            </Link>
                        </li>
                        <li aria-hidden="true">/</li>
                        <li aria-current="page" className="text-cream">
                            {service.title}
                        </li>
                    </ol>
                </nav>

                <div
                    className="mb-6 text-6xl text-gold opacity-80"
                    aria-hidden="true"
                >
                    {service.glyph}
                </div>

                <h1 className="font-display font-bold tracking-tight text-cream leading-[1.05] text-[2.5rem] md:text-6xl lg:text-7xl mb-6 max-w-4xl">
                    {service.h1}
                </h1>
                <p className="max-w-3xl text-lg md:text-xl text-cream/75 leading-relaxed mb-10">
                    {service.tagline}
                </p>
                <div className="flex flex-wrap gap-4">
                    <Link
                        href="/#contact"
                        className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 font-semibold text-char hover:bg-gold/90 transition-colors"
                    >
                        Konzultácia zdarma
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                        href="/cennik"
                        className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-7 py-3.5 font-semibold text-cream hover:border-cream/60 transition-colors"
                    >
                        Pozrieť cenník
                    </Link>
                </div>
            </section>

            {/* Intro long-form */}
            <section className="container mx-auto px-6 pb-16 md:pb-20">
                <div className="max-w-3xl space-y-5 text-cream/80 text-lg leading-relaxed">
                    {service.intro.map((para, i) => (
                        <p key={i}>{para}</p>
                    ))}
                </div>
            </section>

            {/* Deliverables */}
            <section className="container mx-auto px-6 pb-16 md:pb-20">
                <h2 className="font-display font-bold text-cream text-3xl md:text-5xl tracking-tight mb-10">
                    Čo dostanete
                </h2>
                <ul className="grid gap-4 md:grid-cols-2 max-w-4xl">
                    {service.deliverables.map((item, i) => (
                        <li
                            key={i}
                            className="flex items-start gap-3 rounded-xl border border-cream/10 bg-char/50 p-4"
                        >
                            <Check className="mt-0.5 h-5 w-5 flex-none text-gold" />
                            <span className="text-cream/85">{item}</span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* For whom */}
            <section className="container mx-auto px-6 pb-16 md:pb-20">
                <h2 className="font-display font-bold text-cream text-3xl md:text-5xl tracking-tight mb-10">
                    Pre koho to robíme
                </h2>
                <div className="grid gap-4 md:grid-cols-2 max-w-4xl">
                    {service.forWhom.map((item, i) => (
                        <div
                            key={i}
                            className="rounded-xl border border-cream/10 bg-char/30 p-5 text-cream/85"
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </section>

            {/* Process */}
            <section className="container mx-auto px-6 pb-16 md:pb-20">
                <h2 className="font-display font-bold text-cream text-3xl md:text-5xl tracking-tight mb-10">
                    Ako pracujeme
                </h2>
                <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl">
                    {service.process.map((step, i) => (
                        <li
                            key={i}
                            className="rounded-2xl border border-cream/10 bg-char/50 p-6"
                        >
                            <div className="mb-3 text-gold font-display text-2xl">
                                0{i + 1}
                            </div>
                            <h3 className="font-display font-semibold text-cream text-lg mb-2">
                                {step.title}
                            </h3>
                            <p className="text-cream/70 text-sm leading-relaxed">
                                {step.description}
                            </p>
                        </li>
                    ))}
                </ol>
            </section>

            {/* Pricing */}
            <section className="container mx-auto px-6 pb-16 md:pb-20">
                <h2 className="font-display font-bold text-cream text-3xl md:text-5xl tracking-tight mb-10">
                    Cenník služby
                </h2>
                <div className="grid gap-6 md:grid-cols-3 max-w-6xl">
                    {service.pricing.map((tier, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-cream/10 bg-char/50 p-8"
                        >
                            <h3 className="font-display font-bold text-cream text-xl mb-2">
                                {tier.name}
                            </h3>
                            <div className="text-gold text-3xl font-display font-bold mb-4">
                                {tier.price}
                            </div>
                            <p className="text-cream/70 text-sm leading-relaxed">
                                {tier.description}
                            </p>
                        </div>
                    ))}
                </div>
                <p className="mt-6 text-cream/60 text-sm">
                    Ceny sú orientačné — finálna cena závisí od rozsahu. Konkrétnu ponuku
                    dostanete po úvodnom hovore.
                </p>
            </section>

            {/* FAQ */}
            <section className="container mx-auto px-6 pb-16 md:pb-20">
                <h2 className="font-display font-bold text-cream text-3xl md:text-5xl tracking-tight mb-10">
                    Časté otázky
                </h2>
                <div className="space-y-4 max-w-4xl">
                    {service.faq.map((item, i) => (
                        <details
                            key={i}
                            className="group rounded-xl border border-cream/10 bg-char/50 p-6 [&[open]>summary>svg]:rotate-180"
                        >
                            <summary className="flex cursor-pointer items-start justify-between gap-4 font-display font-semibold text-cream text-lg">
                                <span>{item.q}</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="mt-1 flex-none text-gold transition-transform"
                                    aria-hidden="true"
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </summary>
                            <p className="mt-4 text-cream/75 leading-relaxed">
                                {item.a}
                            </p>
                        </details>
                    ))}
                </div>
            </section>

            {/* Related services */}
            <section className="container mx-auto px-6 pb-16 md:pb-20">
                <h2 className="font-display font-bold text-cream text-2xl md:text-3xl tracking-tight mb-8">
                    Ďalšie služby
                </h2>
                <div className="grid gap-4 md:grid-cols-3">
                    {related.map((s) => (
                        <Link
                            key={s.slug}
                            href={`/sluzby/${s.slug}`}
                            className="group rounded-xl border border-cream/10 bg-char/30 p-5 hover:border-gold/40 transition-colors"
                        >
                            <div
                                className="mb-3 text-2xl text-gold"
                                aria-hidden="true"
                            >
                                {s.glyph}
                            </div>
                            <div className="font-display font-semibold text-cream group-hover:text-gold transition-colors">
                                {s.title}
                            </div>
                            <p className="mt-1 text-sm text-cream/60 line-clamp-2">
                                {s.tagline}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Final CTA */}
            <section className="container mx-auto px-6 pb-24 md:pb-32 text-center">
                <h2 className="font-display font-bold text-cream text-3xl md:text-5xl mb-4">
                    Začneme to spolu?
                </h2>
                <p className="text-cream/70 max-w-2xl mx-auto mb-8">
                    30-minútový hovor, žiadne formuláre. Po hovore vám pošleme cenovú
                    ponuku a termín.
                </p>
                <Link
                    href="/#contact"
                    className="inline-block rounded-full bg-gold px-8 py-4 font-semibold text-char hover:bg-gold/90 transition-colors"
                >
                    Napíšte nám →
                </Link>
            </section>
        </main>
    );
}
