import { type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { railwayFetch } from "@/lib/scraper/railway";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest, ctx: { params: { id: string } }) {
    const denied = requireAdmin(req);
    if (denied) return denied;

    const upstream = await railwayFetch(`/jobs/${ctx.params.id}/stream`, {
        method: "GET",
        headers: { Accept: "text/event-stream" },
    });

    if (!upstream.ok || !upstream.body) {
        return new Response(`upstream error: ${upstream.status}`, { status: 502 });
    }

    return new Response(upstream.body, {
        status: 200,
        headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    });
}
