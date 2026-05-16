"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    Bot,
    Globe2,
    Megaphone,
    Palette,
    Sparkles,
    Workflow,
    Zap,
} from "lucide-react";
import SectionBackground from "@/components/backgrounds/SectionBackground";
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

        const timer = window.setInterval(() => {
            setRotationAngle((prev) => Number(((prev + 0.25) % 360).toFixed(3)));
        }, 50);

        return () => window.clearInterval(timer);
    }, [autoRotate, reducedMotion]);

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

    const radius = isCompact ? 128 : 220;

    return (
        <section
            id="services"
            className="relative overflow-hidden bg-char py-6 md:py-16 isolate flex flex-col justify-center min-h-[100svh]"
            onClick={clearSelection}
        >
            <SectionBackground variant="default" />
            <div aria-hidden="true" className="absolute inset-0 gold-vlines opacity-30" />
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-char to-transparent" />
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-char to-transparent" />

            <div className="container relative z-10 mx-auto px-6">
                <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]">
                    <div
                        ref={orbitRef}
                        className="relative mx-auto flex aspect-square w-full max-w-[260px] sm:max-w-[420px] lg:max-w-[640px] items-center justify-center"
                        style={{ perspective: "1000px" }}
                    >
                        <div aria-hidden="true" className="absolute h-[78%] w-[78%] rounded-full border border-cream/10" />
                        <div aria-hidden="true" className="absolute h-[56%] w-[56%] rounded-full border border-gold/10" />
                        <div aria-hidden="true" className="absolute h-[92%] w-[92%] rounded-full border border-cream/[0.04]" />

                        <div className="absolute z-20 flex h-28 w-28 items-center justify-center rounded-full border border-gold/35 bg-char/85 shadow-[0_0_80px_rgba(201,168,117,0.18)] md:h-36 md:w-36">
                            <div className="absolute h-[calc(100%+18px)] w-[calc(100%+18px)] rounded-full border border-gold/15" />
                            <div className="absolute h-[calc(100%+42px)] w-[calc(100%+42px)] rounded-full border border-cream/10" />
                            <Image
                                src="/logo.png"
                                alt="AIWai"
                                width={112}
                                height={112}
                                className="h-20 w-20 object-contain drop-shadow-[0_10px_30px_rgba(201,168,117,0.25)] md:h-24 md:w-24"
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
                                            className={`relative flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300 md:h-14 md:w-14 ${
                                                isActive
                                                    ? "scale-125 border-gold bg-gold text-ink shadow-[0_0_35px_rgba(201,168,117,0.42)]"
                                                    : isRelated
                                                      ? "border-gold/80 bg-gold/20 text-gold"
                                                      : "border-cream/25 bg-char text-cream/80 group-hover:border-gold/70 group-hover:text-gold"
                                            }`}
                                        >
                                            <Icon className="h-5 w-5" />
                                        </span>
                                        <span
                                            className={`max-w-[8.5rem] text-center text-[11px] font-bold uppercase leading-tight tracking-[0.16em] transition-colors md:text-xs ${
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

                    <div className="relative">
                        <div className="relative overflow-hidden rounded-[8px] border border-cream/12 bg-char/80 p-5 shadow-[0_30px_90px_-40px_rgba(0,0,0,0.9)] md:p-7">
                            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />

                            {expanded ? (
                                <>
                                    <div className="mb-5 flex items-start justify-between gap-4">
                                        <div>
                                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                                <span className="rounded-full border border-gold/35 bg-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                                                    {activeService.tag}
                                                </span>
                                                <span className="rounded-full border border-cream/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cream/45">
                                                    {String(activeIndex + 1).padStart(2, "0")}
                                                </span>
                                            </div>
                                            <h3 className="font-display text-2xl font-bold tracking-tight text-cream md:text-4xl">
                                                {activeService.title}
                                            </h3>
                                        </div>
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                                            <ActiveIcon className="h-5 w-5" />
                                        </div>
                                    </div>

                                    <p className="mb-5 text-sm font-light leading-relaxed text-cream/60 md:text-base">
                                        {activeService.description}
                                    </p>
                                    <p className="mb-6 text-sm font-light leading-relaxed text-cream/70">
                                        {activeService.details.whatIsIt}
                                    </p>

                                    <div className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                        {activeService.details.includes.slice(0, 6).map((item) => (
                                            <div key={item} className="flex items-start gap-2.5 rounded-[8px] border border-cream/10 bg-cream/[0.035] px-3 py-2.5">
                                                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold/80" />
                                                <span className="text-xs leading-relaxed text-cream/70">{item}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mb-6 border-t border-cream/10 pt-5">
                                        <div className="mb-2 flex items-center justify-between text-xs text-cream/50">
                                            <span className="inline-flex items-center gap-1.5 uppercase tracking-[0.16em]">
                                                <Zap className="h-3 w-3 text-gold" />
                                                Dopad
                                            </span>
                                            <span className="font-mono text-gold">{activeService.energy}%</span>
                                        </div>
                                        <div className="h-1.5 overflow-hidden rounded-full bg-cream/10">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-gold-deep via-gold to-cream"
                                                style={{ width: `${activeService.energy}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
                                                    className="rounded-full border border-cream/15 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-cream/55 transition-colors hover:border-gold/50 hover:text-gold"
                                                >
                                                    {services[relatedId].tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="mb-5 flex items-start justify-between gap-4">
                                        <div>
                                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                                <span className="rounded-full border border-gold/35 bg-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                                                    EKOSYSTÉM
                                                </span>
                                                <span className="rounded-full border border-cream/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cream/45">
                                                    AIWAI
                                                </span>
                                            </div>
                                            <h3 className="font-display text-2xl font-bold tracking-tight text-cream md:text-4xl">
                                                AIWai
                                            </h3>
                                        </div>
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                                            <Sparkles className="h-5 w-5" />
                                        </div>
                                    </div>

                                    <p className="mb-5 text-sm font-light leading-relaxed text-cream/60 md:text-base">
                                        Päť služieb. Jeden tím. Všetko, čo váš biznis potrebuje online.
                                    </p>
                                    <p className="mb-6 text-sm font-light leading-relaxed text-cream/70">
                                        Web, automatizácia, AI a dizajn fungujú najlepšie spolu. Preto ich navrhujeme ako jeden prepojený systém — kliknite na ktorúkoľvek službu v orbite a zobrazia sa detaily.
                                    </p>

                                    <div className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                        {services.map((service) => {
                                            const Icon = service.icon;
                                            return (
                                                <button
                                                    key={service.id}
                                                    type="button"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        selectService(service.id);
                                                    }}
                                                    className="flex items-start gap-2.5 rounded-[8px] border border-cream/10 bg-cream/[0.035] px-3 py-2.5 text-left transition-colors hover:border-gold/40 hover:bg-gold/[0.06]"
                                                >
                                                    <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold/80" />
                                                    <span className="text-xs leading-relaxed text-cream/70">{service.title}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
