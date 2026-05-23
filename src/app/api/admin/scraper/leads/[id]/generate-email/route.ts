import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin, ADMIN_COOKIE_NAME } from "@/lib/auth/admin";
import { scraperDb } from "@/lib/scraper/supabase-server";
import { generateOutreachEmail } from "@/lib/scraper/haiku";
import { rateLimit, bucketKey } from "@/lib/scraper/rate-limit";
import type { Lead } from "@/lib/scraper/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, ctx: { params: { id: string } }) {
    const denied = requireAdmin(req);
    if (denied) return denied;

    const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const rl = rateLimit(bucketKey(cookie, "generate-email"), 20, 20);
    if (!rl.allowed) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

    const db = scraperDb();
    const { data: lead, error } = await db.from("leads").select("*").eq("id", ctx.params.id).single();
    if (error || !lead) return NextResponse.json({ error: "not found" }, { status: 404 });

    try {
        const outreach = await generateOutreachEmail(lead as Lead);
        const { error: upErr } = await db
            .from("leads")
            .update({ outreach_email: outreach })
            .eq("id", ctx.params.id);
        if (upErr) throw upErr;
        return NextResponse.json({ outreach_email: outreach });
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
