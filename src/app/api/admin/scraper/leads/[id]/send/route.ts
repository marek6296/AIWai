import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin, ADMIN_COOKIE_NAME } from "@/lib/auth/admin";
import { scraperDb } from "@/lib/scraper/supabase-server";
import { sendOutreach } from "@/lib/scraper/zoho";
import { rateLimit, bucketKey } from "@/lib/scraper/rate-limit";
import { z } from "zod";

export const dynamic = "force-dynamic";

const Body = z.object({
    subject: z.string().min(1).max(200),
    body: z.string().min(1).max(8000),
});

export async function POST(req: NextRequest, ctx: { params: { id: string } }) {
    const denied = requireAdmin(req);
    if (denied) return denied;

    const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const rl = rateLimit(bucketKey(cookie, "send"), 20, 20);
    if (!rl.allowed) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

    const parsed = Body.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) {
        return NextResponse.json({ error: "invalid_body", details: parsed.error.flatten() }, { status: 400 });
    }

    const db = scraperDb();
    const { data: lead, error } = await db.from("leads").select("id,email").eq("id", ctx.params.id).single();
    if (error || !lead) return NextResponse.json({ error: "not found" }, { status: 404 });
    if (!lead.email) return NextResponse.json({ error: "lead_has_no_email" }, { status: 400 });

    const result = await sendOutreach({
        to: lead.email,
        subject: parsed.data.subject,
        body: parsed.data.body,
    });

    const status = result.ok ? "sent" : "failed";

    await db.from("outreach_log").insert({
        lead_id: lead.id,
        to_email: lead.email,
        subject: parsed.data.subject,
        body: parsed.data.body,
        status,
        error: result.ok ? null : result.error,
    });

    await db
        .from("leads")
        .update({
            email_status: status,
            email_sent_at: result.ok ? new Date().toISOString() : null,
        })
        .eq("id", lead.id);

    if (!result.ok) {
        return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
    }
    return NextResponse.json({ ok: true, messageId: result.messageId });
}
