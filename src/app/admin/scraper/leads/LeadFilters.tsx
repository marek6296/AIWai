"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Props = {
    categories: string[];
    cities: string[];
    current: { [k: string]: string | undefined };
};

export function LeadFilters({ categories, cities, current }: Props) {
    const router = useRouter();
    const sp = useSearchParams();

    function update(key: string, value: string | null) {
        const usp = new URLSearchParams(sp.toString());
        if (value && value !== "") usp.set(key, value);
        else usp.delete(key);
        usp.delete("page");
        router.push(`?${usp.toString()}`);
    }

    return (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-cream/[0.08] bg-cream/[0.025] p-4">
            <input
                type="text"
                placeholder="Hľadať podľa názvu..."
                defaultValue={current.q || ""}
                onKeyDown={(e) => {
                    if (e.key === "Enter") update("q", (e.target as HTMLInputElement).value);
                }}
                className="rounded-md bg-cream/[0.04] border border-cream/15 px-3 py-1.5 text-sm text-cream w-64 focus:border-gold/60 focus:outline-none"
            />
            <Select label="Kategória" value={current.category} onChange={(v) => update("category", v)} options={categories} />
            <Select label="Mesto" value={current.city} onChange={(v) => update("city", v)} options={cities} />
            <Toggle label="Má email" active={current.has_email === "1"} onClick={() => update("has_email", current.has_email === "1" ? null : "1")} />
            <Toggle label="Má audit" active={current.has_audit === "1"} onClick={() => update("has_audit", current.has_audit === "1" ? null : "1")} />
            <Toggle label="Email odoslaný" active={current.email_sent === "1"} onClick={() => update("email_sent", current.email_sent === "1" ? null : "1")} />
        </div>
    );
}

function Select({ label, value, onChange, options }: { label: string; value: string | undefined; onChange: (v: string) => void; options: string[] }) {
    return (
        <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="rounded-md bg-cream/[0.04] border border-cream/15 px-3 py-1.5 text-sm text-cream focus:border-gold/60 focus:outline-none"
        >
            <option value="">{label}: všetky</option>
            {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
    );
}

function Toggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-md border px-3 py-1.5 text-sm transition ${
                active ? "border-gold/50 bg-gold/15 text-gold" : "border-cream/15 bg-cream/[0.04] text-cream/60 hover:text-cream"
            }`}
        >
            {label}
        </button>
    );
}
