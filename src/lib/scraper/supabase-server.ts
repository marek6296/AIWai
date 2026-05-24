// Server-only Supabase klient pre scraper schému so service role kľúčom.
// Explicit global Accept-Profile / Content-Profile headers — bez nich Supabase JS
// občas (najmä pri HEAD count='exact') pošle request bez schema headera a PostgREST
// odpovedá z `public` schémy. To je zdroj bugu "admin vidí 12 leadov, DB má 53".

import "server-only";
import { createClient } from "@supabase/supabase-js";

type ScraperClient = ReturnType<typeof makeClient>;

const SCHEMA = "scraper";

function makeClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    return createClient(url, key, {
        db: { schema: SCHEMA },
        auth: { persistSession: false, autoRefreshToken: false },
        global: {
            headers: {
                "Accept-Profile": SCHEMA,
                "Content-Profile": SCHEMA,
            },
            // Disable Next.js fetch caching for Supabase calls
            fetch: (input: RequestInfo | URL, init?: RequestInit) =>
                fetch(input, { ...(init || {}), cache: "no-store" }),
        },
    });
}

let _cached: ScraperClient | null = null;

export function scraperDb(): ScraperClient {
    if (_cached) return _cached;
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error("[scraperDb] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    }
    _cached = makeClient();
    return _cached;
}
