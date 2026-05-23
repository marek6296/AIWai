// Server-only Supabase klient pre scraper schému so service role kľúčom.

import "server-only";
import { createClient } from "@supabase/supabase-js";

type ScraperClient = ReturnType<typeof makeClient>;

function makeClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    return createClient(url, key, {
        db: { schema: "scraper" },
        auth: { persistSession: false, autoRefreshToken: false },
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
