import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

// Server-safe presentation primitives. No hooks, no client features —
// can be imported from server components and given Lucide icons as props.

export function StatCard({
    label,
    value,
    icon: Icon,
    accent,
    sub,
}: {
    label: string;
    value: ReactNode;
    icon: LucideIcon;
    accent?: "gold" | "emerald" | "amber" | "cream";
    sub?: ReactNode;
}) {
    const accentClass =
        accent === "emerald"
            ? "text-emerald-400 bg-emerald-400/10"
            : accent === "amber"
              ? "text-amber-400 bg-amber-400/10"
              : accent === "cream"
                ? "text-cream/80 bg-cream/10"
                : "text-gold bg-gold/10";
    return (
        <div className="relative overflow-hidden rounded-2xl border border-cream/[0.08] bg-cream/[0.025] p-5 transition-colors hover:border-cream/15">
            <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(120%_120%_at_0%_0%,rgba(201,168,117,0.06),transparent_60%)] opacity-60"
            />
            <div className="relative flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream/45">
                        {label}
                    </div>
                    <div className="mt-2 font-display text-[28px] font-semibold tracking-tight text-cream">
                        {value}
                    </div>
                    {sub && <div className="mt-1 text-[12px] text-cream/45">{sub}</div>}
                </div>
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${accentClass}`}>
                    <Icon size={16} strokeWidth={1.75} />
                </span>
            </div>
        </div>
    );
}

export function Panel({
    title,
    actions,
    children,
}: {
    title?: string;
    actions?: ReactNode;
    children: ReactNode;
}) {
    return (
        <section className="relative overflow-hidden rounded-2xl border border-cream/[0.08] bg-cream/[0.025]">
            {(title || actions) && (
                <header className="flex items-center justify-between gap-3 border-b border-cream/[0.06] px-5 py-4">
                    {title && (
                        <h2 className="font-display text-[15px] font-semibold tracking-tight text-cream">
                            {title}
                        </h2>
                    )}
                    {actions}
                </header>
            )}
            <div className="p-5">{children}</div>
        </section>
    );
}
