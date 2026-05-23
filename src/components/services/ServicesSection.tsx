"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowRight,
    Bot,
    Globe2,
    Megaphone,
    Palette,
    Workflow,
    Zap,
} from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

const TAGS = ["WEB", "AI", "AI", "DIZAJN", "MARKETING"];
const SERVICE_ICONS = [Globe2, Bot, Workflow, Palette, Megaphone];
const SERVICE_ENERGY = [94, 91, 96, 86, 82];
const SERVICE_RELATIONS = [
    [1, 3],
    [0, 2],
    [1, 4],
    [0, 4],
    [2, 3],
];

const SERVICE_SLUGS = [
    "tvorba-webu",
    "ai-chatbot",
    "ai-automatizacia",
    "logo-branding",
    "sprava-socialnych-sieti",
];

// 3 highlight stats per service — fixed count keeps every panel symmetric.
// [label (small caps), value (display)]
const SERVICE_STATS: Array<Array<[string, string]>> = [
    [
        ["Dodanie", "3–6 tých."],
        ["Mobile", "100%"],
        ["PageSpeed", "90+"],
    ],
    [
        ["Prevádzka", "24 / 7"],
        ["Jazyky", "SK + EN"],
        ["Integrácia", "CRM"],
    ],
    [
        ["Platformy", "Make · n8n"],
        ["Vývoj", "Bez kódu"],
        ["Sync", "Realtime"],
    ],
    [
        ["Výstupy", "Logo + brand"],
        ["Formáty", "Print · web"],
        ["Manuál", "PDF"],
    ],
    [
        ["Obsah", "Mesačný"],
        ["Reklamy", "Meta Ads"],
        ["Reporty", "Mesačné"],
    ],
];

export default function ServicesSection() {
    const { t } = useTranslation();
    const [activeIndex, setActiveIndex] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const [rotationAngle, setRotationAngle] = useState(0);
    const [autoRotate, setAutoRotate] = useState(true);
    const [isCompact, setIsCompact] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);
    const [mounted, setMounted] = useState(false);
    const orbitRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const services = useMemo(
        () =>
            [0, 1, 2, 3, 4].map((i) => ({
                id: i,
                title: t(`services.${i}.title`),
                description: t(`services.${i}.description`),
                tag: TAGS[i],
                slug: SERVICE_SLUGS[i],
                icon: SERVICE_ICONS[i],
                energy: SERVICE_ENERGY[i],
                relatedIds: SERVICE_RELATIONS[i],
                stats: SERVICE_STATS[i],
                details: {
                    whatIsIt: t(`services.${i}.whatIsIt`),
                    includes: t(`services.${i}.includes`).split("|"),
                },
            })),
        [t],
    );

    const activeService = services[activeIndex];
    const ActiveIcon = activeService.icon;

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const updateMotion = () => setReducedMotion(mq.matches);
        const updateSize = () => setIsCompact(window.innerWidth < 768);

        updateMotion();
        updateSize();
        mq.addEventListener("change", updateMotion);
        window.addEventListener("resize", updateSize);

        return () => {
            mq.removeEventListener("change", updateMotion);
            window.removeEventListener("resize", updateSize);
        };
    }, []);

    useEffect(() => {
        if (!autoRotate || reducedMotion) return;
        // Disable continuous rotation on mobile — kills battery + iOS Safari
        // jank during scroll. Static orbit looks intentional.
        if (isCompact) return;

        const timer = window.setInterval(() => {
            setRotationAngle((prev) => Number(((prev + 0.25) % 360).toFixed(3)));
        }, 50);

        return () => window.clearInterval(timer);
    }, [autoRotate, reducedMotion, isCompact]);

    const selectService = (index: number) => {
        const total = services.length;
        const targetAngle = (index / total) * 360;

        setActiveIndex(index);
        setExpanded(true);
        setAutoRotate(false);
        setRotationAngle(270 - targetAngle);
    };

    const closeDetail = () => {
        setExpanded(false);
        setAutoRotate(true);
    };

    const clearSelection = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target !== event.currentTarget && event.target !== orbitRef.current) return;
        closeDetail();
    };

    const radius = isCompact ? 100 : 220;

    return (
        <section
            id="services"
            className="relative overflow-hidden py-14 md:py-16 isolate"
            onClick={clearSelection}
        >
            <div className="container relative z-10 mx-auto px-5 md:px-6">
                <div className="grid items-center gap-10 md:gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]">
                    <div
                        ref={orbitRef}
                        className="relative mx-auto flex aspect-square w-full max-w-[260px] sm:max-w-[420px] lg:max-w-[640px] items-center justify-center"
                        style={{ perspective: "1000px" }}
                    >
                        <div aria-hidden="true" className="absolute h-[78%] w-[78%] rounded-full border border-cream/10" />
                        <div aria-hidden="true" className="absolute h-[56%] w-[56%] rounded-full border border-gold/10" />
                        <div aria-hidden="true" className="absolute h-[92%] w-[92%] rounded-full border border-cream/[0.04]" />

                        <div className="absolute z-20 flex h-24 w-24 items-center justify-center rounded-full border border-gold/35 bg-char/85 shadow-[0_0_80px_rgba(201,168,117,0.18)] md:h-36 md:w-36">
                            <div className="absolute h-[calc(100%+18px)] w-[calc(100%+18px)] rounded-full border border-gold/15" />
                            <div className="absolute h-[calc(100%+42px)] w-[calc(100%+42px)] rounded-full border border-cream/10" />
                            <Image
                                src="/logo-v2.png"
                                alt="AIWai"
                                width={112}
                                height={112}
                                className="h-16 w-16 object-contain drop-shadow-[0_10px_30px_rgba(201,168,117,0.25)] md:h-24 md:w-24"
                                priority
                            />
                        </div>

                        {mounted && services.map((service, index) => {
                            const angle = ((index / services.length) * 360 + rotationAngle) % 360;
                            const radian = (angle * Math.PI) / 180;
                            const x = radius * Math.cos(radian);
                            const y = radius * Math.sin(radian);
                            const isActive = activeIndex === index && expanded;
                            const isRelated = expanded && activeService.relatedIds.includes(index);
                            const Icon = service.icon;
                            const opacity = isActive ? 1 : Math.max(0.5, 0.55 + 0.45 * ((1 + Math.sin(radian)) / 2));

                            return (
                                <div
                                    key={service.id}
                                    className="absolute left-1/2 top-1/2 transition-all duration-700 ease-smooth"
                                    style={{
                                        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                                        zIndex: isActive ? 40 : Math.round(20 + 10 * Math.sin(radian)),
                                        opacity,
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            selectService(index);
                                        }}
                                        onMouseEnter={() => !reducedMotion && setAutoRotate(false)}
                                        onMouseLeave={() => !expanded && setAutoRotate(true)}
                                        className="group relative flex flex-col items-center gap-3"
                                        aria-pressed={isActive}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className={`absolute rounded-full blur-xl transition-all duration-500 ${
                                                isActive || isRelated ? "opacity-80" : "opacity-0"
                                            }`}
                                            style={{
                                                width: service.energy * 0.72,
                                                height: service.energy * 0.72,
                                                background: "radial-gradient(circle, rgba(201,168,117,0.36), transparent 68%)",
                                            }}
                                        />
                                        <span
                                            className={`relative flex h-[52px] w-[52px] items-center justify-center rounded-full border-2 transition-all duration-300 md:h-14 md:w-14 ${
                                                isActive
                                                    ? "scale-110 md:scale-125 border-gold bg-gold text-ink shadow-[0_0_35px_rgba(201,168,117,0.42)]"
                                                    : isRelated
                                                      ? "border-gold/80 bg-gold/20 text-gold"
                                                      : "border-cream/25 bg-char text-cream/80 group-hover:border-gold/70 group-hover:text-gold active:border-gold/70 active:text-gold"
                                            }`}
                                        >
                                            <Icon className="h-[22px] w-[22px] md:h-5 md:w-5" />
                                        </span>
                                        <span
                                            className={`hidden md:block max-w-[8.5rem] text-center text-[11px] font-bold uppercase leading-tight tracking-[0.16em] transition-colors md:text-xs ${
                                                isActive ? "text-gold" : "text-cream/65 group-hover:text-cream"
                                            }`}
                                        >
                                            {service.title}
                                        </span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <motion.div layout transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="relative">
                        <div className="pointer-events-none absolute -inset-px rounded-[14px] bg-[radial-gradient(120%_120%_at_0%_0%,rgba(201,168,117,0.18),transparent_55%),radial-gradient(120%_120%_at_100%_100%,rgba(201,168,117,0.08),transparent_60%)] opacity-90" />
                        <div className="relative flex flex-col overflow-hidden rounded-[14px] bg-char/70 p-5 shadow-[0_30px_90px_-40px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm ring-1 ring-cream/[0.04] md:p-7 min-h-[24rem] md:min-h-[38rem]">
                            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
                            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cream/8 to-transparent" />

                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={expanded ? `service-${activeIndex}` : "default"}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                    className="flex flex-1 flex-col"
                                >
                                    {expanded ? (
                                        <>
                                            {/* Top group — title + copy + pills (variable content) */}
                                            <div className="mb-6 flex items-start justify-between gap-4">
                                                <h3 className="font-display text-3xl font-bold tracking-tight text-cream md:text-5xl">
                                                    {activeService.title}
                                                </h3>
                                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                                                    <ActiveIcon className="h-6 w-6" />
                                                </div>
                                            </div>

                                            <p className="mb-5 text-base font-light leading-relaxed text-cream/70 md:text-lg">
                                                {activeService.description}
                                            </p>
                                            <p className="mb-6 text-sm font-light leading-relaxed text-cream/65 md:text-base">
                                                {activeService.details.whatIsIt}
                                            </p>

                                            <div className="mb-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                                {activeService.details.includes.slice(0, 6).map((item) => (
                                                    <motion.span
                                                        key={item}
                                                        whileHover={{ y: -2 }}
                                                        transition={{ type: "spring", stiffness: 400, damping: 24 }}
                                                        className="group relative inline-flex items-center gap-3 overflow-hidden rounded-lg border border-cream/[0.08] bg-gradient-to-b from-cream/[0.05] to-cream/[0.01] px-3.5 py-2.5"
                                                    >
                                                        <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-lg bg-[radial-gradient(120%_120%_at_0%_0%,rgba(201,168,117,0.16),transparent_60%)] opacity-0 transition-opacity group-hover:opacity-100" />
                                                        <span aria-hidden="true" className="relative h-1.5 w-1.5 shrink-0 rounded-full bg-gold/80 shadow-[0_0_8px_rgba(201,168,117,0.5)]" />
                                                        <span className="relative text-[13px] font-medium leading-tight text-cream/85">{item}</span>
                                                    </motion.span>
                                                ))}
                                            </div>

                                            {/* Bottom group — pinned via mt-auto so stats + impact + CTA
                                                land at the same position across all services. */}
                                            <div className="mt-auto">
                                                {/* 3-stat highlight row (always 3 items → identical layout) */}
                                                <div className="mb-6 grid grid-cols-3 gap-1.5 md:gap-2.5">
                                                    {activeService.stats.map(([label, value]) => (
                                                        <div
                                                            key={label}
                                                            className="relative overflow-hidden rounded-lg border border-cream/[0.07] bg-gradient-to-b from-cream/[0.04] to-cream/[0.01] px-2 py-2.5 md:px-3 md:py-3"
                                                        >
                                                            <div className="font-mono text-[8px] uppercase tracking-[0.14em] text-cream/45 md:text-[9px] md:tracking-[0.18em]">
                                                                {label}
                                                            </div>
                                                            <div className="mt-1 truncate font-display text-[13px] font-semibold text-cream/95 md:text-[15px]">
                                                                {value}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="border-t border-cream/[0.06] pt-5">
                                                    <div className="mb-2 flex items-center justify-between text-xs text-cream/50">
                                                        <span className="inline-flex items-center gap-1.5 uppercase tracking-[0.16em]">
                                                            <Zap className="h-3 w-3 text-gold" />
                                                            Dopad
                                                        </span>
                                                        <span className="font-mono text-gold">{activeService.energy}%</span>
                                                    </div>
                                                    <div className="h-1.5 overflow-hidden rounded-full bg-cream/10">
                                                        <motion.div
                                                            className="h-full rounded-full bg-gradient-to-r from-gold-deep via-gold to-cream"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${activeService.energy}%` }}
                                                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                    <Link
                                                        href={`/sluzby/${activeService.slug}`}
                                                        className="inline-flex items-center justify-center gap-2 bg-gold px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-gold-bright"
                                                    >
                                                        {t("services.learnMore")}
                                                        <ArrowRight className="h-4 w-4" />
                                                    </Link>

                                                    <div className="flex flex-wrap gap-2">
                                                        {activeService.relatedIds.map((relatedId) => (
                                                            <button
                                                                key={relatedId}
                                                                type="button"
                                                                onClick={(event) => {
                                                                    event.stopPropagation();
                                                                    selectService(relatedId);
                                                                }}
                                                                className="rounded-full border border-cream/[0.08] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-cream/55 transition-colors hover:border-gold/50 hover:text-gold"
                                                            >
                                                                {services[relatedId].tag}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="mb-6 flex items-start justify-between gap-4">
                                                <h3 className="font-display text-3xl font-bold tracking-tight text-cream md:text-5xl">
                                                    AIWai
                                                </h3>
                                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-char/60">
                                                    <Image
                                                        src="/logo-v2.png"
                                                        alt="AIWai"
                                                        width={48}
                                                        height={48}
                                                        className="h-10 w-10 object-contain"
                                                    />
                                                </div>
                                            </div>

                                            <p className="mb-5 text-base font-light leading-relaxed text-cream/70 md:text-lg">
                                                Päť služieb. Jeden tím. Všetko, čo váš biznis potrebuje online.
                                            </p>
                                            <p className="mb-7 text-sm font-light leading-relaxed text-cream/65 md:text-base">
                                                Web, automatizácia, AI a dizajn fungujú najlepšie spolu. Preto ich navrhujeme ako jeden prepojený systém — kliknite na ktorúkoľvek službu v orbite alebo na kartu nižšie a zobrazia sa detaily.
                                            </p>

                                            <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                {services.map((service) => {
                                                    const Icon = service.icon;
                                                    return (
                                                        <motion.button
                                                            key={service.id}
                                                            type="button"
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                selectService(service.id);
                                                            }}
                                                            whileHover={{ y: -3 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            transition={{ type: "spring", stiffness: 400, damping: 24 }}
                                                            className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-cream/[0.08] bg-gradient-to-b from-cream/[0.05] to-cream/[0.01] px-4 py-3.5 text-left transition-colors hover:border-gold/40"
                                                        >
                                                            <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(120%_120%_at_0%_0%,rgba(201,168,117,0.16),transparent_60%)] opacity-0 transition-opacity group-hover:opacity-100" />
                                                            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/12 text-gold ring-1 ring-gold/25 transition-colors group-hover:bg-gold/20">
                                                                <Icon className="h-5 w-5" />
                                                            </span>
                                                            <span className="relative flex min-w-0 flex-col gap-0.5">
                                                                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream/40 transition-colors group-hover:text-gold/70">
                                                                    {service.tag}
                                                                </span>
                                                                <span className="text-sm font-semibold leading-tight text-cream/90 transition-colors group-hover:text-cream">
                                                                    {service.title}
                                                                </span>
                                                            </span>
                                                        </motion.button>
                                                    );
                                                })}
                                            </div>

                                            <div className="mt-auto flex items-center justify-between border-t border-cream/[0.06] pt-5">
                                                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-cream/45">
                                                    <Zap className="h-3 w-3 text-gold" />
                                                    Päť služieb, jeden systém
                                                </div>
                                                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream/45">
                                                    Vyberte službu →
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
