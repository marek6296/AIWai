"use client";

import { useState, useMemo, FormEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2, ChevronDown, Check, MapPin, Tag, Plus } from "lucide-react";
import { SK_REGIONS, DEFAULT_CATEGORIES, allCities, citiesFromRegions } from "@/lib/scraper/sk-regions";

type Mode = "preset" | "custom";

export function NewJobForm() {
    const router = useRouter();

    // ── Kategórie ─────────────────────────────────────────────────────
    const [catMode, setCatMode] = useState<Mode>("preset");
    const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set());
    const [customCat, setCustomCat] = useState("");
    const [customCatsList, setCustomCatsList] = useState<string[]>([]);
    const [allCatsActive, setAllCatsActive] = useState(false);

    // ── Mestá ─────────────────────────────────────────────────────────
    const [cityMode, setCityMode] = useState<Mode>("preset");
    const [selectedRegions, setSelectedRegions] = useState<Set<string>>(new Set());
    const [selectedCities, setSelectedCities] = useState<Set<string>>(new Set()); // per-mesto override
    const [allCitiesActive, setAllCitiesActive] = useState(false);
    const [customCity, setCustomCity] = useState("");
    const [customCitiesList, setCustomCitiesList] = useState<string[]>([]);
    const [openRegion, setOpenRegion] = useState<string | null>(null);

    const [maxPerCity, setMaxPerCity] = useState(20);
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    // ── Resolved final sets ──────────────────────────────────────────
    const finalCategories = useMemo<string[]>(() => {
        if (catMode === "custom") return customCatsList;
        if (allCatsActive) return DEFAULT_CATEGORIES;
        return Array.from(selectedCats);
    }, [catMode, customCatsList, allCatsActive, selectedCats]);

    const finalCities = useMemo<string[]>(() => {
        if (cityMode === "custom") return customCitiesList;
        if (allCitiesActive) return allCities();
        // Mestá z regiónov + per-mesto override
        const fromRegions = citiesFromRegions(Array.from(selectedRegions));
        return Array.from(new Set([...fromRegions, ...Array.from(selectedCities)]));
    }, [cityMode, customCitiesList, allCitiesActive, selectedRegions, selectedCities]);

    const estimatedQueries = finalCategories.length * finalCities.length;
    const estimatedMax = estimatedQueries * maxPerCity;

    // ── Handlers ─────────────────────────────────────────────────────
    function toggleCat(c: string) {
        const next = new Set(selectedCats);
        next.has(c) ? next.delete(c) : next.add(c);
        setSelectedCats(next);
        setAllCatsActive(false);
    }
    function toggleAllCats() {
        const turn = !allCatsActive;
        setAllCatsActive(turn);
        setSelectedCats(turn ? new Set(DEFAULT_CATEGORIES) : new Set());
    }
    function addCustomCat() {
        const v = customCat.trim();
        if (!v || customCatsList.includes(v)) return;
        if (customCatsList.length >= 40) return;
        setCustomCatsList([...customCatsList, v]);
        setCustomCat("");
    }

    function toggleRegion(name: string) {
        const next = new Set(selectedRegions);
        if (next.has(name)) {
            next.delete(name);
            // tiež odstráň individual cities z toho regiónu
            const region = SK_REGIONS.find((r) => r.name === name);
            if (region) {
                const nextCities = new Set(selectedCities);
                region.districts.forEach((d) => nextCities.delete(d));
                setSelectedCities(nextCities);
            }
        } else {
            next.add(name);
        }
        setSelectedRegions(next);
        setAllCitiesActive(false);
    }
    function toggleCity(city: string) {
        const next = new Set(selectedCities);
        next.has(city) ? next.delete(city) : next.add(city);
        setSelectedCities(next);
        setAllCitiesActive(false);
    }
    function toggleAllCities() {
        const turn = !allCitiesActive;
        setAllCitiesActive(turn);
        if (turn) {
            setSelectedRegions(new Set(SK_REGIONS.map((r) => r.name)));
            setSelectedCities(new Set());
        } else {
            setSelectedRegions(new Set());
        }
    }
    function addCustomCity() {
        const v = customCity.trim();
        if (!v || customCitiesList.includes(v)) return;
        if (customCitiesList.length >= 200) return;
        setCustomCitiesList([...customCitiesList, v]);
        setCustomCity("");
    }

    async function submit(e: FormEvent) {
        e.preventDefault();
        setErr(null);
        if (finalCategories.length === 0) {
            setErr("Vyber aspoň jednu kategóriu.");
            return;
        }
        if (finalCities.length === 0) {
            setErr("Vyber aspoň jedno mesto.");
            return;
        }
        if (estimatedQueries > 500) {
            setErr(`${estimatedQueries} kombinácií je príliš veľa — uber kategórií alebo miest.`);
            return;
        }
        setBusy(true);
        try {
            const res = await fetch("/api/admin/scraper/jobs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    categories: finalCategories,
                    cities: finalCities,
                    max_per_city: maxPerCity,
                }),
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
        <form onSubmit={submit} className="space-y-8">
            {/* ── Kategórie ───────────────────────────────────────── */}
            <Section
                icon={<Tag size={14} />}
                title="Kategórie"
                hint={catMode === "preset" ? `${finalCategories.length} vybraných` : `${customCatsList.length} vlastných`}
            >
                <Tabs value={catMode} onChange={setCatMode} options={[
                    { value: "preset", label: "Predvolené (25)" },
                    { value: "custom", label: "Vlastné" },
                ]} />

                {catMode === "preset" && (
                    <>
                        <MasterToggle
                            active={allCatsActive}
                            onClick={toggleAllCats}
                            label={`Všetky kategórie (${DEFAULT_CATEGORIES.length})`}
                        />
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {DEFAULT_CATEGORIES.map((c) => (
                                <Chip
                                    key={c}
                                    active={selectedCats.has(c)}
                                    onClick={() => toggleCat(c)}
                                    label={c}
                                />
                            ))}
                        </div>
                    </>
                )}

                {catMode === "custom" && (
                    <div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={customCat}
                                onChange={(e) => setCustomCat(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomCat(); } }}
                                placeholder="napr. fyzioterapia, autoumyváreň…"
                                className="flex-1 rounded-md bg-cream/[0.04] border border-cream/15 px-3 py-2 text-sm text-cream placeholder:text-cream/30 focus:border-gold/60 focus:outline-none"
                                disabled={busy || customCatsList.length >= 40}
                                maxLength={80}
                            />
                            <button type="button" onClick={addCustomCat} className="rounded-md border border-gold/40 bg-gold/15 px-3 py-2 text-sm text-gold hover:bg-gold/25 disabled:opacity-40" disabled={!customCat.trim() || customCatsList.length >= 40}>
                                <Plus size={14} />
                            </button>
                        </div>
                        {customCatsList.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                                {customCatsList.map((c) => (
                                    <RemovableChip key={c} label={c} onRemove={() => setCustomCatsList(customCatsList.filter((x) => x !== c))} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </Section>

            {/* ── Mestá / okresy ──────────────────────────────────── */}
            <Section
                icon={<MapPin size={14} />}
                title="Mestá / okresy"
                hint={`${finalCities.length} miest`}
            >
                <Tabs value={cityMode} onChange={setCityMode} options={[
                    { value: "preset", label: "SK okresy (79)" },
                    { value: "custom", label: "Vlastné mestá" },
                ]} />

                {cityMode === "preset" && (
                    <>
                        <MasterToggle
                            active={allCitiesActive}
                            onClick={toggleAllCities}
                            label="Celé Slovensko (všetkých 79 okresov)"
                        />

                        <div className="mt-3 space-y-1.5">
                            {SK_REGIONS.map((region) => {
                                const fromRegion = region.districts.filter((d) => selectedCities.has(d) || selectedRegions.has(region.name));
                                const expanded = openRegion === region.name;
                                const allInRegion = selectedRegions.has(region.name);
                                return (
                                    <div key={region.name} className="rounded-lg border border-cream/[0.08] bg-cream/[0.02] overflow-hidden">
                                        <div
                                            onClick={() => setOpenRegion(expanded ? null : region.name)}
                                            className="cursor-pointer w-full flex items-center gap-2 px-3 py-2 hover:bg-cream/[0.04] transition"
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => { if (e.key === "Enter") setOpenRegion(expanded ? null : region.name); }}
                                        >
                                            <ChevronDown size={12} className={`text-cream/45 transition-transform ${expanded ? "rotate-0" : "-rotate-90"}`} />
                                            <span className="text-sm text-cream">{region.name}</span>
                                            <span className="font-mono text-[10px] text-cream/40">{fromRegion.length}/{region.districts.length}</span>
                                            <span className="ml-auto" />
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); toggleRegion(region.name); }}
                                                className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider transition ${
                                                    allInRegion
                                                        ? "border-gold/40 bg-gold/15 text-gold"
                                                        : "border-cream/15 bg-cream/[0.04] text-cream/55 hover:text-cream"
                                                }`}
                                            >
                                                {allInRegion ? <Check size={10} /> : null}
                                                {allInRegion ? "celý kraj" : "vybrať kraj"}
                                            </button>
                                        </div>
                                        {expanded && (
                                            <div className="border-t border-cream/[0.06] p-2.5 flex flex-wrap gap-1">
                                                {region.districts.map((city) => {
                                                    const checked = allInRegion || selectedCities.has(city);
                                                    return (
                                                        <Chip
                                                            key={city}
                                                            active={checked}
                                                            onClick={() => toggleCity(city)}
                                                            label={city}
                                                            size="xs"
                                                        />
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                {cityMode === "custom" && (
                    <div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={customCity}
                                onChange={(e) => setCustomCity(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomCity(); } }}
                                placeholder="napr. Vrútky, Stupava…"
                                className="flex-1 rounded-md bg-cream/[0.04] border border-cream/15 px-3 py-2 text-sm text-cream placeholder:text-cream/30 focus:border-gold/60 focus:outline-none"
                                disabled={busy || customCitiesList.length >= 200}
                                maxLength={80}
                            />
                            <button type="button" onClick={addCustomCity} className="rounded-md border border-gold/40 bg-gold/15 px-3 py-2 text-sm text-gold hover:bg-gold/25 disabled:opacity-40" disabled={!customCity.trim() || customCitiesList.length >= 200}>
                                <Plus size={14} />
                            </button>
                        </div>
                        {customCitiesList.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                                {customCitiesList.map((c) => (
                                    <RemovableChip key={c} label={c} onRemove={() => setCustomCitiesList(customCitiesList.filter((x) => x !== c))} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </Section>

            {/* ── Max uložených ───────────────────────────────────── */}
            <Section icon={<Check size={14} />} title="Cieľ — uložených leadov / query">
                <input
                    type="number"
                    min={1}
                    max={100}
                    value={maxPerCity}
                    onChange={(e) => setMaxPerCity(Math.max(1, Math.min(100, parseInt(e.target.value || "20", 10))))}
                    className="w-32 rounded-md bg-cream/[0.04] border border-cream/15 px-4 py-2 text-cream focus:border-gold/60 focus:outline-none"
                    disabled={busy}
                />
                <p className="mt-2 text-[11px] text-cream/45">
                    Scraper pokračuje cez ďalšie Google Maps výsledky kým neuloží toľko leadov per (kategória × mesto). Skipy (žiadny email, duplikát) sa do limitu nepočítajú.
                </p>
            </Section>

            {/* ── Súhrn ───────────────────────────────────────────── */}
            <div className="rounded-xl border border-gold/30 bg-gold/[0.05] p-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold/70 mb-2">Súhrn</div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                    <Summary label="Kategórií" value={finalCategories.length} />
                    <Summary label="Miest" value={finalCities.length} />
                    <Summary label="Cieľ max" value={`~${estimatedMax}`} hint={`${estimatedQueries} queries × ${maxPerCity}`} />
                </div>
            </div>

            {err && <div className="rounded-md bg-red-400/10 border border-red-400/30 text-red-300 px-4 py-2 text-sm">{err}</div>}

            <button
                type="submit"
                disabled={busy || finalCategories.length === 0 || finalCities.length === 0}
                className="inline-flex items-center gap-2 rounded-lg bg-gold/20 border border-gold/50 px-6 py-2.5 text-gold hover:bg-gold/30 transition disabled:opacity-50"
            >
                {busy ? <Loader2 size={16} className="animate-spin" /> : null}
                {busy ? "Spúšťam scrape job…" : "Spustiť scrape"}
            </button>
        </form>
    );
}

// ── Sub-components ────────────────────────────────────────────────────

function Section({ icon, title, hint, children }: { icon: React.ReactNode; title: string; hint?: string; children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-cream/[0.08] bg-char-soft/40 p-5">
            <div className="mb-4 flex items-baseline justify-between gap-2">
                <div className="inline-flex items-center gap-2 font-display text-sm font-semibold text-cream">
                    <span className="text-gold/70">{icon}</span>
                    {title}
                </div>
                {hint && <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream/40">{hint}</span>}
            </div>
            {children}
        </div>
    );
}

function Tabs<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
    return (
        <div className="mb-3 inline-flex rounded-lg border border-cream/[0.08] bg-cream/[0.025] p-1">
            {options.map((o) => (
                <button
                    key={o.value}
                    type="button"
                    onClick={() => onChange(o.value)}
                    className={`px-3 py-1 rounded-md text-xs transition ${value === o.value ? "bg-gold/15 text-gold border border-gold/40" : "text-cream/55 hover:text-cream"}`}
                >
                    {o.label}
                </button>
            ))}
        </div>
    );
}

function MasterToggle({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm transition ${
                active
                    ? "border-gold/50 bg-gold/15 text-gold"
                    : "border-cream/15 bg-cream/[0.04] text-cream/65 hover:text-cream hover:bg-cream/[0.07]"
            }`}
        >
            <span className={`flex h-4 w-4 items-center justify-center rounded border ${active ? "border-gold bg-gold" : "border-cream/30"}`}>
                {active && <Check size={11} className="text-char" />}
            </span>
            {label}
        </button>
    );
}

function Chip({ active, onClick, label, size = "sm" }: { active: boolean; onClick: () => void; label: string; size?: "xs" | "sm" }) {
    const pad = size === "xs" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";
    return (
        <button
            type="button"
            onClick={onClick}
            className={`inline-flex items-center gap-1 rounded-md border ${pad} transition ${
                active
                    ? "border-gold/40 bg-gold/15 text-gold"
                    : "border-cream/15 bg-cream/[0.04] text-cream/60 hover:text-cream hover:bg-cream/[0.07]"
            }`}
        >
            {active && <Check size={10} />}
            {label}
        </button>
    );
}

function RemovableChip({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
        <span className="inline-flex items-center gap-1 rounded-md border border-gold/40 bg-gold/15 px-2 py-0.5 text-xs text-gold">
            {label}
            <button type="button" onClick={onRemove} className="hover:text-cream">
                <X size={11} />
            </button>
        </span>
    );
}

function Summary({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
    return (
        <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream/45">{label}</div>
            <div className="mt-1 font-display text-xl font-semibold text-cream tabular-nums">{value}</div>
            {hint && <div className="text-[10px] text-cream/40 font-mono">{hint}</div>}
        </div>
    );
}
