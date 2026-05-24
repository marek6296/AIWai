// Custom SVG charts — žiadne external dependencies. Server-renderovateľné.
// Sparkline (mini trend), AreaChart (timeseries hero), BarList (kategórie).

type Pt = { label: string; value: number };

// ── Sparkline (mini trend chart, ~120×32) ─────────────────────────────────
export function Sparkline({
    values,
    width = 120,
    height = 32,
    stroke = "#C9A875",
    fill = "rgba(201,168,117,0.18)",
}: {
    values: number[];
    width?: number;
    height?: number;
    stroke?: string;
    fill?: string;
}) {
    if (values.length === 0) return null;
    const max = Math.max(...values, 1);
    const min = Math.min(...values, 0);
    const range = max - min || 1;
    const step = values.length > 1 ? width / (values.length - 1) : width;
    const pts = values.map((v, i) => ({
        x: i * step,
        y: height - ((v - min) / range) * (height - 4) - 2,
    }));
    const line = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ");
    const area = `${line} L ${width} ${height} L 0 ${height} Z`;
    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
            <path d={area} fill={fill} />
            <path d={line} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            {/* end dot */}
            <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r={2.5} fill={stroke} />
        </svg>
    );
}

// ── AreaChart (large timeseries, hero) ─────────────────────────────────────
export function AreaChart({
    data,
    width = 800,
    height = 200,
    accent = "#C9A875",
    yTicks = 4,
}: {
    data: Pt[];
    width?: number;
    height?: number;
    accent?: string;
    yTicks?: number;
}) {
    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center text-cream/30 text-sm" style={{ width, height }}>
                Žiadne dáta
            </div>
        );
    }
    const pad = { top: 16, right: 12, bottom: 28, left: 36 };
    const innerW = width - pad.left - pad.right;
    const innerH = height - pad.top - pad.bottom;
    const max = Math.max(...data.map((d) => d.value), 1);
    const min = 0;
    const range = max - min || 1;
    const step = data.length > 1 ? innerW / (data.length - 1) : innerW;

    const pts = data.map((d, i) => ({
        x: pad.left + i * step,
        y: pad.top + innerH - ((d.value - min) / range) * innerH,
        label: d.label,
        value: d.value,
    }));
    const line = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ");
    const area = `${line} L ${pts[pts.length - 1].x} ${pad.top + innerH} L ${pts[0].x} ${pad.top + innerH} Z`;

    // y-axis ticks
    const ticks: { y: number; v: number }[] = [];
    for (let i = 0; i <= yTicks; i++) {
        const v = (max * i) / yTicks;
        const y = pad.top + innerH - ((v - min) / range) * innerH;
        ticks.push({ y, v });
    }

    // x labels — first, mid, last
    const xLabelIdx = data.length <= 3
        ? data.map((_, i) => i)
        : [0, Math.floor(data.length / 2), data.length - 1];

    const gradId = `area-grad-${accent.replace("#", "")}`;

    return (
        <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="block">
            <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={accent} stopOpacity="0.35" />
                    <stop offset="100%" stopColor={accent} stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* y grid */}
            {ticks.map((t, i) => (
                <g key={i}>
                    <line x1={pad.left} y1={t.y} x2={width - pad.right} y2={t.y} stroke="rgba(245,237,220,0.05)" strokeDasharray="2 4" />
                    <text x={pad.left - 8} y={t.y + 3} fontSize="9" textAnchor="end" fill="rgba(245,237,220,0.32)" fontFamily="var(--font-inter), monospace">
                        {Math.round(t.v)}
                    </text>
                </g>
            ))}

            {/* area + line */}
            <path d={area} fill={`url(#${gradId})`} />
            <path d={line} fill="none" stroke={accent} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />

            {/* x labels */}
            {xLabelIdx.map((i) => (
                <text
                    key={i}
                    x={pts[i].x}
                    y={height - 8}
                    fontSize="9"
                    textAnchor="middle"
                    fill="rgba(245,237,220,0.4)"
                    fontFamily="var(--font-inter), monospace"
                >
                    {pts[i].label}
                </text>
            ))}

            {/* dots on data points */}
            {pts.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r={1.5} fill={accent} opacity={0.6} />
            ))}
        </svg>
    );
}

// ── BarList — horizontálne progress bary so štítkami ────────────────────────
export function BarList({
    items,
    max,
    accent = "#C9A875",
}: {
    items: { label: string; value: number; href?: string }[];
    max?: number;
    accent?: string;
}) {
    if (items.length === 0) {
        return <div className="py-6 text-center text-cream/40 text-sm">Žiadne dáta</div>;
    }
    const top = max ?? items[0].value;
    return (
        <div className="space-y-2">
            {items.map((it) => {
                const pct = top > 0 ? (it.value / top) * 100 : 0;
                const row = (
                    <div className="flex items-center gap-3">
                        <div className="w-32 truncate text-[13px] text-cream/80">{it.label}</div>
                        <div className="flex-1 h-1.5 rounded bg-cream/[0.05] overflow-hidden">
                            <div
                                className="h-full rounded-r"
                                style={{ width: `${pct}%`, background: accent }}
                            />
                        </div>
                        <div className="w-10 text-right font-mono text-[11px] text-cream/55">{it.value}</div>
                    </div>
                );
                return it.href ? (
                    <a key={it.label} href={it.href} className="block hover:opacity-90 transition-opacity">
                        {row}
                    </a>
                ) : (
                    <div key={it.label}>{row}</div>
                );
            })}
        </div>
    );
}

// ── DonutGauge — kruhový percentuálny indikátor ────────────────────────────
export function DonutGauge({
    value,
    max = 100,
    size = 96,
    label,
    accent = "#C9A875",
}: {
    value: number;
    max?: number;
    size?: number;
    label?: string;
    accent?: string;
}) {
    const pct = Math.min(1, Math.max(0, value / max));
    const stroke = 6;
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const dash = c * pct;
    return (
        <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(245,237,220,0.06)" strokeWidth={stroke} />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    stroke={accent}
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={`${dash} ${c - dash}`}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-xl font-semibold text-cream">{value}</span>
                {label && <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-cream/40">{label}</span>}
            </div>
        </div>
    );
}
