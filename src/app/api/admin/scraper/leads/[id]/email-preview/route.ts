// Vracia HTML preview emailu pre aktuálny subject + body (pre live preview v admine).
// POST { subject, body } → text/html

import { type NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { wrapEmailHtml } from "@/lib/scraper/email-template";
import { z } from "zod";

export const dynamic = "force-dynamic";

const Body = z.object({
    subject: z.string().min(1).max(200),
    body: z.string().min(1).max(8000),
});

export async function POST(req: NextRequest) {
    const denied = requireAdmin(req);
    if (denied) return denied;

    const parsed = Body.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) {
        return NextResponse.json({ error: "invalid_body" }, { status: 400 });
    }

    const html = wrapEmailHtml(parsed.data.body, parsed.data.subject);
    return new NextResponse(html, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
    });
}
