import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { scraperDb } from "@/lib/scraper/supabase-server";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

export async function GET(req: NextRequest) {
    const denied = requireAdmin(req);
    if (denied) return denied;

    const url = new URL(req.url);
    const page = Math.max(0, parseInt(url.searchParams.get("page") || "0", 10));
    const category = url.searchParams.get("category");
    const city = url.searchParams.get("city");
    const jobId = url.searchParams.get("job_id");
    const hasEmail = url.searchParams.get("has_email");
    const hasAudit = url.searchParams.get("has_audit");
    const emailSent = url.searchParams.get("email_sent");
    const q = url.searchParams.get("q");

    const db = scraperDb();
    let qb = db.from("leads").select("*", { count: "exact" }).order("created_at", { ascending: false });

    if (category) qb = qb.eq("category", category);
    if (city) qb = qb.eq("city", city);
    if (jobId) qb = qb.eq("job_id", jobId);
    if (hasEmail === "1") qb = qb.not("email", "is", null);
    if (hasEmail === "0") qb = qb.is("email", null);
    if (hasAudit === "1") qb = qb.eq("audit_status", "done");
    if (emailSent === "1") qb = qb.eq("email_status", "sent");
    if (emailSent === "0") qb = qb.is("email_status", null);
    if (q) qb = qb.ilike("name", `%${q}%`);

    qb = qb.range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

    const { data, count, error } = await qb;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({
        leads: data ?? [],
        total: count ?? 0,
        page,
        page_size: PAGE_SIZE,
    });
}
