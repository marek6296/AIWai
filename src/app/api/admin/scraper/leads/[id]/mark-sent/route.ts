import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { scraperDb } from "@/lib/scraper/supabase-server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, ctx: { params: { id: string } }) {
    const denied = requireAdmin(req);
    if (denied) return denied;

    const db = scraperDb();
    const { error } = await db
        .from("leads")
        .update({
            email_status: "sent",
            email_sent_at: new Date().toISOString(),
        })
        .eq("id", ctx.params.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
}
