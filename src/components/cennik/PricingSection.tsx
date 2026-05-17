"use client";

import Link from "next/link";
import { AnimatePresence, motion, useSpring } from "framer-motion";
import { Check, Star } from "lucide-react";
import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

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
const CARD_MIN_HEIGHT = "min-h-[620px]";

// ── Starfield ────────────────────────────────────────────────────────────────

type Mouse = { x: number | null; y: number | null };

function Spark({
    mouse,
    containerRef,
}: {
    mouse: Mouse;
    containerRef: React.RefObject<HTMLDivElement>;
}) {
    const [initial] = useState(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: 1 + Math.random() * 2,
        duration: 2 + Math.random() * 3,
        delay: Math.random() * 5,
    }));

    const springConfig = { stiffness: 100, damping: 15, mass: 0.1 };
    const springX = useSpring(0, springConfig);
    const springY = useSpring(0, springConfig);

    useEffect(() => {
        if (!containerRef.current || mouse.x === null || mouse.y === null) {
            springX.set(0);
            springY.set(0);
            return;
        }
        const rect = containerRef.current.getBoundingClientRect();
        const starX = rect.left + (parseFloat(initial.left) / 100) * rect.width;
        const starY = rect.top + (parseFloat(initial.top) / 100) * rect.height;
        const dx = mouse.x - starX;
        const dy = mouse.y - starY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 500;
        if (dist < radius) {
            const force = 1 - dist / radius;
            springX.set(dx * force * 0.45);
            springY.set(dy * force * 0.45);
        } else {
            springX.set(0);
            springY.set(0);
        }
    }, [mouse, initial, containerRef, springX, springY]);

    return (
        <motion.div
            aria-hidden="true"
            className="absolute rounded-full bg-gold"
            style={{
                top: initial.top,
                left: initial.left,
                width: initial.size,
                height: initial.size,
                x: springX,
                y: springY,
                boxShadow: "0 0 6px rgba(201,168,117,0.5)",
                willChange: "transform",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
                duration: initial.duration,
                repeat: Infinity,
                delay: initial.delay,
            }}
        />
    );
}

function Starfield({
    mouse,
    containerRef,
    count = 80,
}: {
    mouse: Mouse;
    containerRef: React.RefObject<HTMLDivElement>;
    count?: number;
}) {
    const sparks = useMemo(() => Array.from({ length: count }), [count]);
    return (
        <div
            aria-hidden="true"
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ transform: "translateZ(0)" }}
        >
            {sparks.map((_, i) => (
                <Spark key={i} mouse={mouse} containerRef={containerRef} />
            ))}
        </div>
    );
}

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
                            y: plan.isPopular && activeHasThree ? -16 : 0,
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
                        className={`relative flex h-full w-full flex-col rounded-2xl p-7 backdrop-blur-sm ${CARD_MIN_HEIGHT} ${
                            plan.isPopular
                                ? "bg-gold text-ink shadow-[0_40px_100px_-30px_rgba(201,168,117,0.55)] ring-1 ring-gold-deep/40"
                                : "border border-cream/10 bg-char-soft/40 text-cream"
                        }`}
                    >
                        {plan.isPopular && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <div className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-1.5 shadow-md">
                                    <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                                        {plan.badge ?? "Najobľúbenejšie"}
                                    </span>
                                </div>
                            </div>
                        )}

                        {!plan.isPopular && plan.badge && (
                            <div className="absolute -top-3 left-6">
                                <span className="rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-ink">
                                    {plan.badge}
                                </span>
                            </div>
                        )}

                        <div className="flex flex-1 flex-col text-center">
                            <h3 className={`font-display text-xl font-bold tracking-tight ${plan.isPopular ? "text-ink" : "text-cream"}`}>
                                {plan.name}
                            </h3>

                            {plan.description && (
                                <p className={`mt-2 text-sm font-light ${plan.isPopular ? "text-ink/70" : "text-cream/55"}`}>
                                    {plan.description}
                                </p>
                            )}

                            <div className="mt-6 flex items-baseline justify-center font-display text-4xl md:text-5xl font-bold tracking-tight">
                                <FlipPrice value={plan.price} isPopular={plan.isPopular} />
                            </div>

                            {plan.priceNote && (
                                <p className={`mt-2 text-xs ${plan.isPopular ? "text-ink/55" : "text-cream/45"}`}>
                                    {plan.priceNote}
                                </p>
                            )}

                            <ul role="list" className="mt-8 flex flex-col gap-3 text-left text-sm">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3">
                                        <Check
                                            className={`mt-0.5 h-4 w-4 flex-none ${plan.isPopular ? "text-ink" : "text-gold"}`}
                                            strokeWidth={2.5}
                                            aria-hidden="true"
                                        />
                                        <span className={`leading-snug ${plan.isPopular ? "text-ink/85" : "text-cream/70"}`}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-auto pt-8">
                                <Link
                                    href={`/?service=${encodeURIComponent(plan.serviceValue)}#contact`}
                                    className={`inline-flex w-full items-center justify-center rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] transition-colors ${
                                        plan.isPopular
                                            ? "bg-ink text-gold hover:bg-char hover:text-gold-bright"
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
                {mounted && <Starfield mouse={mouse} containerRef={containerRef} />}

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
