import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICES, SERVICE_SLUGS, getService } from "@/lib/seo/services";
import JsonLd from "@/components/seo/JsonLd";
import {
    breadcrumbSchema,
    faqSchema,
    serviceSchema,
    SITE_URL,
} from "@/lib/seo/schemas";
import ServicePageContent from "./ServicePageContent";

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
        <main className="min-h-screen bg-char text-cream selection:bg-gold/30 selection:text-cream">
            <JsonLd id={`ld-${service.slug}-breadcrumb`} data={breadcrumbs} />
            <JsonLd id={`ld-${service.slug}-service`} data={schema} />
            <JsonLd id={`ld-${service.slug}-faq`} data={faq} />
            <ServicePageContent service={service} related={related} />
        </main>
    );
}
