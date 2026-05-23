"use client";

import { useState, FormEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2 } from "lucide-react";

export function NewJobForm() {
    const router = useRouter();
    const [category, setCategory] = useState("");
    const [cityInput, setCityInput] = useState("");
    const [cities, setCities] = useState<string[]>([]);
    const [maxPerCity, setMaxPerCity] = useState(20);
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    function addCity(raw: string) {
        const v = raw.trim();
        if (!v) return;
        if (cities.includes(v)) return;
        if (cities.length >= 10) return;
        setCities([...cities, v]);
        setCityInput("");
    }

    function onCityKey(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addCity(cityInput);
        } else if (e.key === "Backspace" && cityInput === "" && cities.length > 0) {
            setCities(cities.slice(0, -1));
        }
    }

    async function submit(e: FormEvent) {
        e.preventDefault();
        setErr(null);
        if (!category.trim() || cities.length === 0) {
            setErr("Vyplň kategóriu a aspoň jedno mesto.");
            return;
        }
        setBusy(true);
        try {
            const res = await fetch("/api/admin/scraper/jobs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category: category.trim(), cities, max_per_city: maxPerCity }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "request failed");
            router.push(`/admin/scraper/jobs/${data.id}`);
        } catch (e) {
            setErr(e instanceof Error ? e.message : String(e));
            setBusy(false);
        }
    }

    return (
        <form onSubmit={submit} className="space-y-6">
            <Field label="Kategória">
                <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="napr. fitness centrum"
                    className="w-full rounded-lg bg-cream/[0.04] border border-cream/15 px-4 py-2.5 text-cream placeholder:text-cream/30 focus:border-gold/60 focus:outline-none"
                    disabled={busy}
                    maxLength={80}
                />
            </Field>

            <Field label={`Mestá (${cities.length}/10)`}>
                <div className="rounded-lg border border-cream/15 bg-cream/[0.04] p-2 flex flex-wrap gap-2">
                    {cities.map((c) => (
                        <span key={c} className="inline-flex items-center gap-1 rounded-md bg-gold/15 border border-gold/40 px-2 py-1 text-sm text-gold">
                            {c}
                            <button type="button" onClick={() => setCities(cities.filter((x) => x !== c))}>
                                <X size={12} />
                            </button>
                        </span>
                    ))}
                    <input
                        type="text"
                        value={cityInput}
                        onChange={(e) => setCityInput(e.target.value)}
                        onKeyDown={onCityKey}
                        onBlur={() => addCity(cityInput)}
                        placeholder={cities.length === 0 ? "Bratislava, Košice, Trnava..." : ""}
                        className="flex-1 min-w-[120px] bg-transparent px-2 py-1 text-cream placeholder:text-cream/30 focus:outline-none"
                        disabled={busy || cities.length >= 10}
                    />
                </div>
                <p className="mt-1 text-[11px] text-cream/40">Enter alebo čiarka pridá mesto. Max 10.</p>
            </Field>

            <Field label="Max výsledkov per mesto">
                <input
                    type="number"
                    min={1}
                    max={100}
                    value={maxPerCity}
                    onChange={(e) => setMaxPerCity(parseInt(e.target.value || "20", 10))}
                    className="w-32 rounded-lg bg-cream/[0.04] border border-cream/15 px-4 py-2.5 text-cream focus:border-gold/60 focus:outline-none"
                    disabled={busy}
                />
            </Field>

            {err && <div className="text-sm text-red-300 bg-red-400/10 border border-red-400/30 rounded-lg px-4 py-2">{err}</div>}

            <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-lg bg-gold/20 border border-gold/50 px-6 py-2.5 text-gold hover:bg-gold/30 transition disabled:opacity-50"
            >
                {busy ? <Loader2 size={16} className="animate-spin" /> : null}
                {busy ? "Spúšťam..." : "Spustiť scrape"}
            </button>
        </form>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="block">
            <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.22em] text-cream/50">{label}</span>
            {children}
        </label>
    );
}
