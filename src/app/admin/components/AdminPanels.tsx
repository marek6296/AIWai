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
    trend,
}: {
    label: string;
    value: ReactNode;
    icon: LucideIcon;
    accent?: "gold" | "emerald" | "amber" | "cream" | "rose";
    sub?: ReactNode;
    trend?: ReactNode; // sparkline or similar slot
}) {
    const accentClass =
        accent === "emerald"
            ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
            : accent === "amber"
              ? "text-amber-400 bg-amber-400/10 border-amber-400/20"
              : accent === "cream"
                ? "text-cream/80 bg-cream/10 border-cream/15"
                : accent === "rose"
                  ? "text-rose-400 bg-rose-400/10 border-rose-400/20"
                  : "text-gold bg-gold/10 border-gold/25";
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-cream/[0.08] bg-char-soft/60 p-5 transition-all hover:border-gold/20 hover:bg-char-soft/80">
            <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(120%_120%_at_0%_0%,rgba(201,168,117,0.07),transparent_55%)] opacity-70 group-hover:opacity-100 transition-opacity"
            />
            <div className="relative">
                <div className="flex items-start justify-between gap-4">
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream/45">
                        {label}
                    </div>
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${accentClass}`}>
                        <Icon size={14} strokeWidth={1.75} />
                    </span>
                </div>
                <div className="mt-3 font-display text-[30px] font-semibold tracking-tight text-cream tabular-nums">
                    {value}
                </div>
                {(sub || trend) && (
                    <div className="mt-2 flex items-end justify-between gap-3">
                        {sub && <div className="text-[11px] text-cream/45">{sub}</div>}
                        {trend && <div className="ml-auto">{trend}</div>}
                    </div>
                )}
            </div>
        </div>
    );
}

export function Panel({
    title,
    subtitle,
    actions,
    children,
    padded = true,
}: {
    title?: string;
    subtitle?: string;
    actions?: ReactNode;
    children: ReactNode;
    padded?: boolean;
}) {
    return (
        <section className="relative overflow-hidden rounded-2xl border border-cream/[0.08] bg-char-soft/60">
            {(title || actions) && (
                <header className="flex items-center justify-between gap-3 border-b border-cream/[0.06] px-5 py-4">
                    <div>
                        {title && (
                            <h2 className="font-display text-[15px] font-semibold tracking-tight text-cream">
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p className="mt-0.5 text-[11px] text-cream/40">{subtitle}</p>
                        )}
                    </div>
                    {actions}
                </header>
            )}
            <div className={padded ? "p-5" : ""}>{children}</div>
        </section>
    );
}

// Section divider with optional label
export function SectionLabel({ children, hint }: { children: ReactNode; hint?: ReactNode }) {
    return (
        <div className="mb-4 mt-10 flex items-baseline justify-between gap-3 first:mt-0">
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold/55">
                {children}
            </div>
            {hint && <div className="text-[11px] text-cream/40">{hint}</div>}
        </div>
    );
}
