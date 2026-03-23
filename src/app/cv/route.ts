import { readFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";

export async function GET() {
    const filePath = join(process.cwd(), "public", "cv.html");
    const html = readFileSync(filePath, "utf-8");

    return new NextResponse(html, {
        status: 200,
        headers: {
            "Content-Type": "text/html; charset=utf-8",
            // Prevent indexing by search engines
            "X-Robots-Tag": "noindex, nofollow",
        },
    });
}
