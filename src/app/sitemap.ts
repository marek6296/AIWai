import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/schemas";
import { SERVICE_SLUGS } from "@/lib/seo/services";

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: `${SITE_URL}/`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 1.0,
        },
        {
            url: `${SITE_URL}/cennik`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/realizacie`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/sluzby`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.9,
        },
    ];

    const servicePages: MetadataRoute.Sitemap = SERVICE_SLUGS.map((slug) => ({
        url: `${SITE_URL}/sluzby/${slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.85,
    }));

    return [...staticPages, ...servicePages];
}
