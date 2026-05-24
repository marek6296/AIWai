// /admin — Dashboard hub. Server component, agreguje dáta zo všetkých sekcií.

import Link from "next/link";
import AdminShell from "./components/AdminShell";
import { StatCard, Panel, SectionLabel } from "./components/AdminPanels";
import { AreaChart, BarList, Sparkline } from "./components/Charts";
import { scraperDb } from "@/lib/scraper/supabase-server";
import { createClient } from "@supabase/supabase-js";
import {
    Inbox, MessagesSquare, Radar, Sparkles, ArrowRight, MailPlus, Mail, FileText, Bot,
} from "lucide-react";

export const dynamic = "force-dynamic";

// ── Helpers ────────────────────────────────────────────────────────────────

function publicDb() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    return createClient(url, key, {
        db: { schema: "public" },
        auth: { persistSession: false, autoRefreshToken: false },
    });
}

function bucketByDay(
    rows: { created_at?: string | null; scraped_at?: string | null; started_at?: string | null }[],
    days: number,
): { label: string; value: number }[] {
    const buckets = new Map<string, number>();
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        buckets.set(key, 0);
    }
    for (const r of rows) {
        const ts = r.created_at || r.scraped_at || r.started_at;
        if (!ts) continue;
        const key = ts.slice(0, 10);
        if (buckets.has(key)) buckets.set(key, (buckets.get(key) || 0) + 1);
    }
    return Array.from(buckets.entries()).map(([key, value]) => {
        const dt = new Date(key);
        const label = new Intl.DateTimeFormat("sk-SK", { day: "numeric", month: "short" }).format(dt);
        return { label, value };
    });
}

function relTime(iso: string | null | undefined): string {
    if (!iso) return "—";
    const t = new Date(iso).getTime();
    const diff = (Date.now() - t) / 1000;
    if (diff < 60) return "pred chvíľou";
    if (diff < 3600) return `pred ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `pred ${Math.floor(diff / 3600)} h`;
    if (diff < 7 * 86400) return `pred ${Math.floor(diff / 86400)} dňami`;
    return new Intl.DateTimeFormat("sk-SK", { day: "numeric", month: "short" }).format(new Date(iso));
}

// ── Page ───────────────────────────────────────────────────────────────────

export default async function AdminDashboard() {
    const sdb = scraperDb();
    const pdb = publicDb();
    const now = new Date();
    const since14 = new Date(now);
    since14.setDate(since14.getDate() - 14);
    const since14iso = since14.toISOString();

    const [
        scraperTotal,
        scraperWithEmail,
        scraperAudited,
        scraperSent,
        scraperRows14,
        scraperRecent,
        scraperCats,
        scraperJobs,
        forms,
        emails,
        chatConvs,
        leadsCount,
        chatConvsCount,
        chatRecent,
        formsRecent,
        emailsRecent,
    ] = await Promise.all([
        sdb.from("leads").select("id", { count: "exact", head: true }),
        sdb.from("leads").select("id", { count: "exact", head: true }).not("email", "is", null),
        sdb.from("leads").select("id", { count: "exact", head: true }).eq("audit_status", "done"),
        sdb.from("leads").select("id", { count: "exact", head: true }).eq("email_status", "sent"),
        sdb.from("leads").select("scraped_at").gte("scraped_at", since14iso).limit(2000),
        sdb.from("leads").select("id,name,location,category,email,scraped_at").order("scraped_at", { ascending: false }).limit(5),
        sdb.from("leads").select("category").not("category", "is", null).limit(2000),
        sdb.from("jobs").select("*").order("started_at", { ascending: false }).limit(3),
        pdb.from("form_submissions").select("id,name,email,created_at").order("created_at", { ascending: false }).limit(50),
        pdb.from("email_submissions").select("id,email,subject,created_at").order("created_at", { ascending: false }).limit(50),
        pdb.from("chatbot_conversations").select("id,session_id,created_at,is_lead,lead_name").gte("created_at", since14iso).order("created_at", { ascending: false }).limit(200),
        pdb.from("leads").select("id", { count: "exact", head: true }),
        pdb.from("chatbot_conversations").select("id", { count: "exact", head: true }),
        pdb.from("chatbot_conversations").select("id,session_id,created_at,is_lead,lead_name").order("created_at", { ascending: false }).limit(3),
        pdb.from("form_submissions").select("id,name,email,created_at").order("created_at", { ascending: false }).limit(3),
        pdb.from("email_submissions").select("id,email,subject,created_at").order("created_at", { ascending: false }).limit(3),
    ]);

    const scrapeSpark = bucketByDay((scraperRows14.data ?? []) as { scraped_at: string }[], 7).map((d) => d.value);
    const formsSpark  = bucketByDay((forms.data ?? []) as { created_at: string }[], 7).map((d) => d.value);
    const emailsSpark = bucketByDay((emails.data ?? []) as { created_at: string }[], 7).map((d) => d.value);
    const chatSpark   = bucketByDay((chatConvs.data ?? []) as { created_at: string }[], 7).map((d) => d.value);

    const heroDays = bucketByDay(
        [
            ...((scraperRows14.data ?? []) as { scraped_at: string }[]),
            ...((forms.data ?? []) as { created_at: string }[]),
            ...((emails.data ?? []) as { created_at: string }[]),
            ...((chatConvs.data ?? []) as { created_at: string }[]),
        ],
        14,
    );

    const catMap = new Map<string, number>();
    ((scraperCats.data ?? []) as { category: string | null }[]).forEach((r) => {
        if (r.category) catMap.set(r.category, (catMap.get(r.category) || 0) + 1);
    });
    const topCats = Array.from(catMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([label, value]) => ({ label, value }));

    const formsCount = (forms.data ?? []).length;
    const emailsCount = (emails.data ?? []).length;
    const inboxNew = formsCount + emailsCount;

    return (
        <AdminShell
            title="Prehľad"
            subtitle="Centrálny dashboard celého AIWai admin systému"
            actions={
                <Link
                    href="/admin/scraper/jobs/new"
                    className="inline-flex items-center gap-2 rounded-lg border border-gold/40 bg-gold/15 px-4 py-2 text-sm font-medium text-gold hover:bg-gold/25 transition"
                >
                    <Radar size={14} /> Nový scrape
                </Link>
            }
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Inbox · nových (14d)"
                    value={inboxNew}
                    icon={Inbox}
                    accent="gold"
                    sub={`${formsCount} formulárov · ${emailsCount} mailov`}
                    trend={<Sparkline values={formsSpark.map((v, i) => v + (emailsSpark[i] || 0))} width={84} height={28} />}
                />
                <StatCard
                    label="Chatbot konverzácie"
                    value={chatConvsCount.count ?? 0}
                    icon={MessagesSquare}
                    accent="cream"
                    sub={`${(chatConvs.data ?? []).length} za 14 dní`}
                    trend={<Sparkline values={chatSpark} width={84} height={28} />}
                />
                <StatCard
                    label="Scraper · leady"
                    value={scraperTotal.count ?? 0}
                    icon={Radar}
                    accent="emerald"
                    sub={`${scraperWithEmail.count ?? 0} s emailom · ${scraperAudited.count ?? 0} audited`}
                    trend={<Sparkline values={scrapeSpark} width={84} height={28} />}
                />
                <StatCard
                    label="Kontaktné leady"
                    value={leadsCount.count ?? 0}
                    icon={Sparkles}
                    accent="amber"
                    sub={`${scraperSent.count ?? 0} mailov odoslaných`}
                />
            </div>

            <SectionLabel hint="Posledných 14 dní">Aktivita systému</SectionLabel>
            <div className="rounded-2xl border border-cream/[0.08] bg-char-soft/60 p-6">
                <AreaChart data={heroDays} width={1100} height={220} />
                <div className="mt-3 flex items-center gap-4 text-[11px] text-cream/45 font-mono uppercase tracking-[0.18em]">
                    <Legend color="#C9A875" label="kombinovaná aktivita" />
                    <span className="ml-auto">{heroDays.reduce((a, b) => a + b.value, 0)} udalostí spolu</span>
                </div>
            </div>

            <SectionLabel>Najnovšie</SectionLabel>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Panel
                    title="Inbox"
                    subtitle="Formuláre a klientske maily"
                    actions={<Link href="/admin/inbox" className="text-[11px] text-gold hover:underline flex items-center gap-1">otvoriť <ArrowRight size={12} /></Link>}
                    padded={false}
                >
                    <ul className="divide-y divide-cream/[0.06]">
                        {((formsRecent.data ?? []) as { id: string; name: string | null; email: string | null; created_at: string }[]).map((f) => (
                            <ItemRow
                                key={`f-${f.id}`}
                                icon={<FileText size={12} />}
                                title={f.name || f.email || "(formulár)"}
                                meta="formulár"
                                time={relTime(f.created_at)}
                            />
                        ))}
                        {((emailsRecent.data ?? []) as { id: string; email: string | null; subject: string | null; created_at: string }[]).map((e) => (
                            <ItemRow
                                key={`e-${e.id}`}
                                icon={<Mail size={12} />}
                                title={e.subject || "(bez predmetu)"}
                                meta={e.email || "email"}
                                time={relTime(e.created_at)}
                            />
                        ))}
                        {(formsRecent.data ?? []).length === 0 && (emailsRecent.data ?? []).length === 0 && (
                            <EmptyRow text="Žiadne nové správy" />
                        )}
                    </ul>
                </Panel>

                <Panel
                    title="Chatbot"
                    subtitle="Konverzácie cez chatbota"
                    actions={<Link href="/admin/conversations" className="text-[11px] text-gold hover:underline flex items-center gap-1">otvoriť <ArrowRight size={12} /></Link>}
                    padded={false}
                >
                    <ul className="divide-y divide-cream/[0.06]">
                        {((chatRecent.data ?? []) as { id: string; session_id: string; created_at: string; is_lead: boolean; lead_name: string | null }[]).map((c) => (
                            <ItemRow
                                key={c.id}
                                icon={<Bot size={12} />}
                                title={c.lead_name || `Session ${c.session_id.slice(0, 8)}`}
                                meta={c.is_lead ? "lead ✓" : "konverzácia"}
                                time={relTime(c.created_at)}
                            />
                        ))}
                        {(chatRecent.data ?? []).length === 0 && <EmptyRow text="Žiadne konverzácie" />}
                    </ul>
                </Panel>

                <Panel
                    title="Scraper"
                    subtitle="Posledné joby a leady"
                    actions={<Link href="/admin/scraper" className="text-[11px] text-gold hover:underline flex items-center gap-1">otvoriť <ArrowRight size={12} /></Link>}
                    padded={false}
                >
                    <ul className="divide-y divide-cream/[0.06]">
                        {((scraperJobs.data ?? []) as { id: string; category: string; cities: string[]; status: string; started_at: string }[]).map((j) => (
                            <ItemRow
                                key={j.id}
                                icon={<Radar size={12} />}
                                title={j.category}
                                meta={`${(j.cities ?? []).slice(0, 2).join(", ")} · ${j.status}`}
                                time={relTime(j.started_at)}
                                href={`/admin/scraper/jobs/${j.id}`}
                            />
                        ))}
                        {((scraperRecent.data ?? []) as { id: number; name: string; location: string | null; scraped_at: string }[]).slice(0, 3).map((l) => (
                            <ItemRow
                                key={`l-${l.id}`}
                                icon={<Sparkles size={12} />}
                                title={l.name}
                                meta={l.location || "scraped"}
                                time={relTime(l.scraped_at)}
                                href={`/admin/scraper/leads/${l.id}`}
                            />
                        ))}
                        {((scraperJobs.data ?? []).length + (scraperRecent.data ?? []).length) === 0 && (
                            <EmptyRow text="Žiadne aktivity" />
                        )}
                    </ul>
                </Panel>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <Panel title="Top kategórie scrapera" subtitle="Najčastejšie zastúpenie v leadoch">
                        <BarList items={topCats} />
                    </Panel>
                </div>

                <Panel title="Rýchle akcie">
                    <div className="grid grid-cols-1 gap-2">
                        <QuickAction href="/admin/scraper/jobs/new" icon={<Radar size={14} />} label="Spustiť scrape" hint="kategória + mestá" />
                        <QuickAction href="/admin/inbox" icon={<Inbox size={14} />} label="Skontroluj inbox" hint={`${inboxNew} nových`} />
                        <QuickAction href="/admin/scraper/leads" icon={<Sparkles size={14} />} label="Pošli outreach" hint={`${scraperWithEmail.count ?? 0} s emailom`} />
                        <QuickAction href="/admin/chatbot-settings" icon={<MailPlus size={14} />} label="Uprav chatbota" hint="prompt, knowledge" />
                    </div>
                </Panel>
            </div>
        </AdminShell>
    );
}

function Legend({ color, label }: { color: string; label: string }) {
    return (
        <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: color }} />
            {label}
        </span>
    );
}

function ItemRow({
    icon, title, meta, time, href,
}: { icon: React.ReactNode; title: string; meta: string; time: string; href?: string }) {
    const inner = (
        <li className={`flex items-start gap-3 px-5 py-3 ${href ? "hover:bg-cream/[0.025] transition-colors" : ""}`}>
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-cream/10 bg-cream/[0.03] text-cream/55">
                {icon}
            </span>
            <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] text-cream">{title}</div>
                <div className="truncate text-[11px] text-cream/40">{meta}</div>
            </div>
            <span className="ml-2 shrink-0 font-mono text-[10px] text-cream/35">{time}</span>
        </li>
    );
    return href ? <Link href={href}>{inner}</Link> : inner;
}

function EmptyRow({ text }: { text: string }) {
    return <li className="px-5 py-6 text-center text-[12px] text-cream/35">{text}</li>;
}

function QuickAction({
    href, icon, label, hint,
}: { href: string; icon: React.ReactNode; label: string; hint?: string }) {
    return (
        <Link
            href={href}
            className="group flex items-center gap-3 rounded-lg border border-cream/[0.07] bg-cream/[0.02] px-3 py-2.5 transition-all hover:border-gold/30 hover:bg-gold/[0.06]"
        >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gold/25 bg-gold/10 text-gold">
                {icon}
            </span>
            <div className="min-w-0 flex-1">
                <div className="text-[13px] text-cream">{label}</div>
                {hint && <div className="text-[10px] text-cream/40 font-mono">{hint}</div>}
            </div>
            <ArrowRight size={14} className="text-cream/30 group-hover:text-gold transition-colors" />
        </Link>
    );
}
