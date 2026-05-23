import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { railwayJson } from "@/lib/scraper/railway";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, ctx: { params: { id: string } }) {
    const denied = requireAdmin(req);
    if (denied) return denied;

    try {
        const data = await railwayJson(`/jobs/${ctx.params.id}/cancel`, { method: "POST" });
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 502 });
    }
}
