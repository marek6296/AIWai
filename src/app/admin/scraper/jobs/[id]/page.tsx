import AdminShell from "@/app/admin/components/AdminShell";
import { scraperDb } from "@/lib/scraper/supabase-server";
import { notFound } from "next/navigation";
import { JobLive } from "./JobLive";
import type { Job } from "@/lib/scraper/types";

export const dynamic = "force-dynamic";

export default async function JobDetailPage({ params }: { params: { id: string } }) {
    const db = scraperDb();
    const { data: job } = await db.from("jobs").select("*").eq("id", params.id).single();
    if (!job) notFound();

    const j = job as Job;
    return (
        <AdminShell title="Scrape job" subtitle={`${j.category} · ${(j.cities ?? []).join(", ")}`}>
            <JobLive initialJob={j} />
        </AdminShell>
    );
}
