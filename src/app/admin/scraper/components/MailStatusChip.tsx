// MAIL status chip — 4 stavy: NO MAIL (nevygenerovaný), PENDING (vygenerovaný, neodoslaný), SENT, FAILED.

import type { OutreachEmail, EmailStatus } from "@/lib/scraper/types";

export function MailStatusChip({ outreach, status }: { outreach: OutreachEmail | null; status: EmailStatus }) {
    // Reálny send status má prednosť (sent/failed)
    if (status === "sent") {
        return (
            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-400/40 bg-emerald-400/15 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-emerald-300">
                ● Sent
            </span>
        );
    }
    if (status === "failed") {
        return (
            <span className="inline-flex items-center gap-1 rounded-md border border-red-400/40 bg-red-400/15 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-red-300">
                ⚠ Failed
            </span>
        );
    }
    if (status === "bounced") {
        return (
            <span className="inline-flex items-center gap-1 rounded-md border border-amber-400/40 bg-amber-400/15 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-amber-300">
                ↩ Bounced
            </span>
        );
    }
    // Bez sent statusu: rozlišujeme pending (mail je vygenerovaný) vs no_mail (nevygenerovaný)
    if (outreach) {
        return (
            <span className="inline-flex items-center gap-1 rounded-md border border-gold/40 bg-gold/15 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-gold">
                ✎ Pending
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 rounded-md border border-cream/10 bg-cream/[0.03] px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-cream/40">
            ○ No mail
        </span>
    );
}
