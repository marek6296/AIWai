import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin, ADMIN_COOKIE_NAME } from "@/lib/auth/admin";
import { scraperDb } from "@/lib/scraper/supabase-server";
import { generateOutreachEmailWithAudit } from "@/lib/scraper/haiku";
import { rateLimit, bucketKey } from "@/lib/scraper/rate-limit";
import { wrapEmailHtml } from "@/lib/scraper/email-template";
import type { Lead } from "@/lib/scraper/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // re-audit + Haiku call môže trvať 15-30s

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
        const { email, audit } = await generateOutreachEmailWithAudit(lead as Lead);

        // Ulož outreach_email + prípadne updatne audit_report ak sme dostali čerstvý
        const update: Record<string, unknown> = { outreach_email: email };
        if (audit && audit.checked_at) update.audit_report = audit;

        const { error: upErr } = await db.from("leads").update(update).eq("id", ctx.params.id);
        if (upErr) throw upErr;

        // Vráť aj HTML preview aby UI mohlo zobraziť
        const html = wrapEmailHtml(email.body, email.subject);
        return NextResponse.json({ outreach_email: email, audit, html });
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
