"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { InteractiveStarfield } from "@/components/backgrounds/InteractiveStarfield";

// ── BorderTrail — animated gold glow orbiting the card border ──────────────
// Adapted from the user's Aceternity-style snippet. A large soft gold orb
// follows the rounded rectangle path via CSS `offsetPath`. The wrapper uses
// the mask-clip + mask-composite:intersect trick: the inner padding-box mask
// (transparent) cancels the orb inside the card, leaving only the border
// ring visible. Result: a glow that sweeps along the card edge.
//
// Uses native CSS animation (not framer-motion) so it starts immediately
// on render — independent of AnimatePresence/layout settling.

function BorderTrail({
    size = 100,
    duration = 5,
}: {
    size?: number;
    duration?: number;
}) {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]"
        >
            <div
                className="absolute aspect-square bg-gold"
                style={{
                    width: size,
                    offsetPath: `rect(0 auto auto 0 round ${size}px)`,
                    boxShadow:
                        "0px 0px 60px 30px rgba(201,168,117,0.55), 0 0 100px 60px rgba(10,10,15,0.55), 0 0 140px 90px rgba(10,10,15,0.55)",
                    animation: `border-trail-orbit ${duration}s linear infinite`,
                }}
            />
        </div>
    );
}

type Mouse = { x: number | null; y: number | null };

// ── Types ────────────────────────────────────────────────────────────────────

export interface PricingPlan {
    name: string;
    price: string;
    priceNote?: string;
    features: string[];
    description?: string;
    serviceValue: string;
    cta: string;
    isPopular?: boolean;
    badge?: string;
}

export interface PricingCategory {
    id: string;
    label: string;
    plans: PricingPlan[];
}

interface PricingSectionProps {
    categories: PricingCategory[];
    defaultCategoryId?: string;
}

const CategoryContext = createContext<{
    active: string;
    setActive: (id: string) => void;
}>({ active: "", setActive: () => { } });

const MAX_SLOTS = 3;
const CARD_MIN_HEIGHT = "min-h-[460px]";

// ── Toggle pill ──────────────────────────────────────────────────────────────

function CategoryToggle({ categories }: { categories: PricingCategory[] }) {
    const { active, setActive } = useContext(CategoryContext);
    const containerRef = useRef<HTMLDivElement>(null);
    const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
    const [pillStyle, setPillStyle] = useState<{ width: number; height: number; transform: string }>({
        width: 0,
        height: 0,
        transform: "translate(0,0)",
    });

    useEffect(() => {
        const update = () => {
            const btn = btnRefs.current[active];
            if (!btn) return;
            setPillStyle({
                width: btn.offsetWidth,
                height: btn.offsetHeight,
                transform: `translate(${btn.offsetLeft}px, ${btn.offsetTop}px)`,
            });
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [active, categories]);

    return (
        <div className="flex justify-center">
            <div
                ref={containerRef}
                className="relative flex w-fit flex-wrap items-center justify-center gap-1 rounded-2xl border border-cream/10 bg-char-soft/60 p-1 backdrop-blur"
            >
                <motion.div
                    aria-hidden="true"
                    className="absolute left-0 top-0 rounded-full bg-gold"
                    style={pillStyle}
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
                {categories.map((cat) => {
                    const isActive = active === cat.id;
                    return (
                        <button
                            key={cat.id}
                            ref={(el) => { btnRefs.current[cat.id] = el; }}
                            type="button"
                            onClick={() => setActive(cat.id)}
                            aria-pressed={isActive}
                            className={`relative z-10 rounded-full px-4 sm:px-5 py-2 text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] transition-colors ${
                                isActive ? "text-ink" : "text-cream/60 hover:text-cream"
                            }`}
                        >
                            {cat.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ── Number flow: animates char-by-char ───────────────────────────────────────
// Splits the price string into characters and flips each character vertically
// when it changes — gives a NumberFlow-like effect without the dependency.

function FlipPrice({ value, isPopular }: { value: string; isPopular?: boolean }) {
    const chars = value.split("");
    return (
        <span className="inline-flex items-baseline overflow-hidden">
            {chars.map((ch, i) => (
                <span key={i} className="relative inline-block overflow-hidden" style={{ height: "1.05em" }}>
                    <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                            key={`${ch}-${i}-${value}`}
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "-100%", opacity: 0 }}
                            transition={{ type: "spring", stiffness: 320, damping: 28, delay: i * 0.03 }}
                            className={`inline-block ${isPopular ? "text-ink" : "text-cream"}`}
                        >
                            {ch === " " ? " " : ch}
                        </motion.span>
                    </AnimatePresence>
                </span>
            ))}
        </span>
    );
}

// ── Card slot ────────────────────────────────────────────────────────────────
// Renders a fixed slot — when category changes, content animates in/out with
// AnimatePresence. Empty slots (when category has fewer plans) collapse.

function CardSlot({
    plan,
    slotIndex,
    categoryId,
    activeHasThree,
}: {
    plan: PricingPlan | null;
    slotIndex: number;
    categoryId: string;
    activeHasThree: boolean;
}) {
    return (
        <div className="relative w-full max-w-[340px] flex-shrink-0">
            <AnimatePresence mode="wait" initial={false}>
                {plan ? (
                    <motion.div
                        key={`${categoryId}-${plan.name}`}
                        initial={{ opacity: 0, y: 24, scale: 0.96 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{ opacity: 0, y: -16, scale: 0.96 }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 26,
                            delay: slotIndex * 0.06,
                        }}
                        layout
                        className={`relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-cream/10 bg-char-soft/40 px-6 pt-14 pb-6 text-cream backdrop-blur-sm ${CARD_MIN_HEIGHT}`}
                    >
                        {plan.isPopular && <BorderTrail size={100} duration={5} />}

                        {plan.isPopular && (
                            <div className="absolute top-3 right-3 z-20 inline-flex items-center gap-1.5 rounded-md border border-cream/15 bg-char/85 px-2 py-0.5 backdrop-blur">
                                <Star className="h-3 w-3 fill-gold text-gold" />
                                <span className="text-[10px] font-semibold text-cream/85">
                                    {plan.badge ?? "Populárne"}
                                </span>
                            </div>
                        )}

                        {!plan.isPopular && plan.badge && (
                            <div className="absolute top-3 right-3 z-20">
                                <span className="rounded-md bg-gold px-2 py-0.5 text-[10px] font-semibold text-ink">
                                    {plan.badge}
                                </span>
                            </div>
                        )}

                        <div className="relative z-10 flex flex-1 flex-col text-center">
                            <h3 className="font-display text-xl font-bold tracking-tight text-cream">
                                {plan.name}
                            </h3>

                            {plan.description && (
                                <p className="mt-2 text-sm font-light text-cream/55">
                                    {plan.description}
                                </p>
                            )}

                            <div className="mt-4 flex items-baseline justify-center font-display text-[2rem] md:text-[2.5rem] font-bold tracking-tight leading-none">
                                <FlipPrice value={plan.price} isPopular={false} />
                            </div>

                            {plan.priceNote && (
                                <p className="mt-1.5 text-[11px] text-cream/45">
                                    {plan.priceNote}
                                </p>
                            )}

                            <ul role="list" className="mt-5 flex flex-col gap-2 text-left text-[13px]">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-2.5">
                                        <Check
                                            className="mt-0.5 h-3.5 w-3.5 flex-none text-gold"
                                            strokeWidth={2.5}
                                            aria-hidden="true"
                                        />
                                        <span className="leading-snug text-cream/70">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-auto pt-5">
                                <Link
                                    href={`/?service=${encodeURIComponent(plan.serviceValue)}#contact`}
                                    className={`inline-flex w-full items-center justify-center rounded-xl px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors ${
                                        plan.isPopular
                                            ? "bg-gold text-ink hover:bg-gold-bright"
                                            : "border border-cream/15 bg-cream/[0.04] text-cream hover:border-gold hover:bg-gold hover:text-ink"
                                    }`}
                                >
                                    {plan.cta}
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
}

// ── Main section ─────────────────────────────────────────────────────────────

export default function PricingSection({
    categories,
    defaultCategoryId,
}: PricingSectionProps) {
    const [active, setActive] = useState(defaultCategoryId ?? categories[0]?.id ?? "");
    const containerRef = useRef<HTMLDivElement>(null);
    const [mouse, setMouse] = useState<Mouse>({ x: null, y: null });
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const activeCategory = categories.find((c) => c.id === active) ?? categories[0];
    const plans = activeCategory?.plans ?? [];
    const activeHasThree = plans.length >= 3;

    // Pad to MAX_SLOTS so layout has stable slot count; empty slots collapse via AnimatePresence
    const slots: (PricingPlan | null)[] = [
        ...plans,
        ...Array.from({ length: Math.max(0, MAX_SLOTS - plans.length) }, () => null),
    ].slice(0, MAX_SLOTS);

    return (
        <CategoryContext.Provider value={{ active, setActive }}>
            <div
                ref={containerRef}
                onMouseMove={(e) => setMouse({ x: e.clientX, y: e.clientY })}
                onMouseLeave={() => setMouse({ x: null, y: null })}
                className="relative w-full"
            >
                {mounted && <InteractiveStarfield mouse={mouse} containerRef={containerRef} />}

                <div className="relative z-10 container mx-auto px-4 md:px-6 pb-20 md:pb-28">
                    <CategoryToggle categories={categories} />

                    <div className="mt-14 flex flex-wrap items-stretch justify-center gap-6">
                        {slots.map((plan, i) => (
                            <CardSlot
                                key={i}
                                slotIndex={i}
                                plan={plan}
                                categoryId={active}
                                activeHasThree={activeHasThree}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </CategoryContext.Provider>
    );
}
