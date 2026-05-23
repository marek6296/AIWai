import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { scraperDb } from "@/lib/scraper/supabase-server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const denied = requireAdmin(req);
    if (denied) return denied;

    const db = scraperDb();
    const [total, withEmail, audited, sent] = await Promise.all([
        db.from("leads").select("id", { count: "exact", head: true }),
        db.from("leads").select("id", { count: "exact", head: true }).not("email", "is", null),
        db.from("leads").select("id", { count: "exact", head: true }).eq("audit_status", "done"),
        db.from("leads").select("id", { count: "exact", head: true }).eq("email_status", "sent"),
    ]);

    return NextResponse.json({
        total: total.count ?? 0,
        with_email: withEmail.count ?? 0,
        audited: audited.count ?? 0,
        sent: sent.count ?? 0,
    });
}
