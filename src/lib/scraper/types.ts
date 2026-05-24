// Typy pre scraper admin integráciu.

export type AuditReport = {
    strengths: string[];
    weaknesses: string[];
    opportunity: string;
    score: number;
    checked_at: string;
};

export type OutreachEmail = {
    subject: string;
    body: string;
    model: string;
    generated_at: string;
};

export type AuditStatus = "pending" | "done" | "failed" | "skipped" | "no_website";
export type EmailStatus = null | "sent" | "failed" | "bounced";

export type Lead = {
    id: number;
    name: string;
    location: string | null;
    category: string | null;
    website: string | null;
    email: string | null;
    address: string | null;
    phone: string | null;
    rating: string | null;
    maps_url: string | null;
    audit_report: AuditReport | null;
    audit_status: AuditStatus;
    outreach_email: OutreachEmail | null;
    email_sent_at: string | null;
    email_status: EmailStatus;
    job_id: string | null;
    scraped_at: string;
};

export type JobStatus = "queued" | "running" | "done" | "failed" | "cancelled";

export type JobProgress = {
    current_city?: string;
    found?: number;
    with_email?: number;
    audited?: number;
};

export type Job = {
    id: string;
    category: string;
    cities: string[];
    max_per_city: number;
    status: JobStatus;
    progress: JobProgress;
    log: string[];
    started_at: string;
    finished_at: string | null;
    error: string | null;
};

export type OutreachLogEntry = {
    id: string;
    lead_id: number;
    sent_at: string;
    to_email: string;
    subject: string;
    body: string;
    status: "sent" | "failed";
    error: string | null;
};
