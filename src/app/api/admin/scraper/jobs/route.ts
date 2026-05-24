import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin, ADMIN_COOKIE_NAME } from "@/lib/auth/admin";
import { scraperDb } from "@/lib/scraper/supabase-server";
import { railwayJson } from "@/lib/scraper/railway";
import { rateLimit, bucketKey } from "@/lib/scraper/rate-limit";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const denied = requireAdmin(req);
    if (denied) return denied;

    const url = new URL(req.url);
    const limit = Math.min(100, parseInt(url.searchParams.get("limit") || "20", 10));

    const db = scraperDb();
    const { data, error } = await db
        .from("jobs")
        .select("*")
        .order("started_at", { ascending: false })
        .limit(limit);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ jobs: data ?? [] });
}

const PostBody = z.object({
    categories: z.array(z.string().min(1).max(80)).min(1).max(40),
    cities: z.array(z.string().min(1).max(80)).min(1).max(200),
    max_per_city: z.number().int().min(1).max(100).default(20),
});

export async function POST(req: NextRequest) {
    const denied = requireAdmin(req);
    if (denied) return denied;

    const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const rl = rateLimit(bucketKey(cookie, "jobs-create"), 10, 10);
    if (!rl.allowed) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

    const parsed = PostBody.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) {
        return NextResponse.json({ error: "invalid_body", details: parsed.error.flatten() }, { status: 400 });
    }

    try {
        const created = await railwayJson<{ id: string; status: string }>("/jobs", {
            method: "POST",
            body: JSON.stringify(parsed.data),
        });
        return NextResponse.json(created);
    } catch (err) {
        return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 502 });
    }
}
