import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { scraperDb } from "@/lib/scraper/supabase-server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, ctx: { params: { id: string } }) {
    const denied = requireAdmin(req);
    if (denied) return denied;

    const db = scraperDb();
    const { data: lead, error } = await db.from("leads").select("*").eq("id", ctx.params.id).single();
    if (error || !lead) return NextResponse.json({ error: "not found" }, { status: 404 });

    const { data: log } = await db
        .from("outreach_log")
        .select("*")
        .eq("lead_id", ctx.params.id)
        .order("sent_at", { ascending: false });

    return NextResponse.json({ lead, outreach_log: log ?? [] });
}
