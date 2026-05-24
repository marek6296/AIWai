// Volá Python FastAPI scraper na Railway s X-Scraper-Token header-om.

import "server-only";

const baseUrl = () => {
    const url = process.env.SCRAPER_API_URL;
    if (!url) throw new Error("SCRAPER_API_URL not configured");
    return url.replace(/\/$/, "");
};

const token = () => {
    const t = process.env.SCRAPER_API_TOKEN;
    if (!t) throw new Error("SCRAPER_API_TOKEN not configured");
    return t;
};

export async function railwayFetch(path: string, init: RequestInit = {}): Promise<Response> {
    const headers = new Headers(init.headers);
    headers.set("X-Scraper-Token", token());
    if (init.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }
    return fetch(`${baseUrl()}${path}`, { ...init, headers, cache: "no-store" });
}

export async function railwayJson<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await railwayFetch(path, init);
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Railway ${path} ${res.status}: ${text.slice(0, 200)}`);
    }
    return res.json() as Promise<T>;
}
