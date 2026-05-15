"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup, type PanInfo } from "framer-motion";
import { Grid3X3, Layers, LayoutList } from "lucide-react";
import SectionBackground from "@/components/backgrounds/SectionBackground";
import { useTranslation } from "@/i18n/useTranslation";
import { REALIZACIE_GROUPS, type Project } from "./data";

type LayoutMode = "grid" | "stack" | "list";

const SWIPE_THRESHOLD = 50;

const layoutIcons = {
    grid: Grid3X3,
    stack: Layers,
    list: LayoutList,
} as const;

function classNames(...values: Array<string | false | null | undefined>) {
    return values.filter(Boolean).join(" ");
}

/* ─────────────────────────────────────────────────────────────
   GRID CARD — pôvodný veľký formát (primárny)
   ───────────────────────────────────────────────────────────── */
function ProjectCard({ project, badgeText, privateLabel, privateTitle }: { project: Project; badgeText?: string; privateLabel: string; privateTitle: string }) {
    const isPrivate = !!project.private;

    const inner = (
        <>
            <div className="relative aspect-[16/10] overflow-hidden bg-char-soft">
                <Image
                    src={`/portfolio/${project.slug}.jpg`}
                    alt={project.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className={`object-cover object-top transition-transform duration-700 ease-out ${
                        isPrivate ? "" : "group-hover:scale-[1.04]"
                    }`}
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-char via-char/10 to-transparent opacity-90 transition-opacity duration-500 ${
                    isPrivate ? "" : "group-hover:opacity-70"
                }`} />
                {badgeText && (
                    <div className="absolute top-4 left-4">
                        <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full ${
                            isPrivate
                                ? "bg-cream/10 text-cream/80 border border-cream/20 backdrop-blur-md"
                                : "bg-gold text-ink"
                        }`}>
                            {badgeText}
                        </span>
                    </div>
                )}
                {isPrivate ? (
                    <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-char/70 backdrop-blur-md flex items-center justify-center" title={privateTitle}>
                        <svg className="w-4 h-4 text-gold/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <rect x="5" y="11" width="14" height="9" rx="2" />
                            <path strokeLinecap="round" d="M8 11V8a4 4 0 1 1 8 0v3" />
                        </svg>
                    </div>
                ) : (
                    <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-char/70 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-[-4px] group-hover:translate-y-0">
                        <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </div>
                )}
            </div>

            <div className="p-6 flex flex-col gap-3 flex-1">
                <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-gold/80 font-bold mb-1.5">
                        {project.category}
                    </div>
                    <h3 className={`text-xl font-display font-bold text-cream transition-colors ${
                        isPrivate ? "" : "group-hover:text-gold-bright"
                    }`}>
                        {project.name}
                    </h3>
                </div>
                <p className="text-sm text-cream/60 leading-relaxed font-light flex-1">
                    {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.stack.map((s) => (
                        <span
                            key={s}
                            className="text-[10px] uppercase tracking-[0.1em] font-medium px-2.5 py-1 rounded-md bg-cream/[0.04] border border-cream/10 text-cream/55"
                        >
                            {s}
                        </span>
                    ))}
                </div>
                <div className={`flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold pt-1 ${
                    isPrivate
                        ? "text-cream/40"
                        : "text-cream/40 group-hover:text-gold transition-colors"
                }`}>
                    {isPrivate ? (
                        <span className="flex items-center gap-1.5">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                                <rect x="5" y="11" width="14" height="9" rx="2" />
                                <path strokeLinecap="round" d="M8 11V8a4 4 0 1 1 8 0v3" />
                            </svg>
                            {privateLabel}
                        </span>
                    ) : (
                        <span>{project.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
                    )}
                </div>
            </div>
        </>
    );

    const sharedClasses =
        "group relative rounded-2xl overflow-hidden bg-cream/[0.03] border border-cream/10 backdrop-blur-sm transition-all duration-500 flex flex-col";

    if (isPrivate) {
        return (
            <div className={`${sharedClasses} hover:border-cream/20`} aria-label={`${project.name} — ${privateLabel}`}>
                {inner}
            </div>
        );
    }

    return (
        <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${sharedClasses} hover:border-gold/40 hover:bg-cream/[0.05]`}
        >
            {inner}
        </a>
    );
}

/* ─────────────────────────────────────────────────────────────
   LIST ITEM — kompaktné horizontálne zobrazenie
   ───────────────────────────────────────────────────────────── */
function ProjectListItem({ project, badgeText, privateLabel }: { project: Project; badgeText?: string; privateLabel: string }) {
    const isPrivate = !!project.private;

    const inner = (
        <>
            <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 overflow-hidden rounded-xl bg-char-soft">
                <Image
                    src={`/portfolio/${project.slug}.jpg`}
                    alt={project.name}
                    fill
                    sizes="128px"
                    className={`object-cover object-top transition-transform duration-500 ${isPrivate ? "" : "group-hover:scale-105"}`}
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-char/40 to-transparent" />
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-gold/80 font-bold">{project.category}</span>
                    {badgeText && (
                        <span className={`text-[9px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-full ${
                            isPrivate
                                ? "bg-cream/10 text-cream/80 border border-cream/20"
                                : "bg-gold text-ink"
                        }`}>
                            {badgeText}
                        </span>
                    )}
                </div>
                <h3 className={`text-lg md:text-xl font-display font-bold text-cream truncate ${isPrivate ? "" : "group-hover:text-gold-bright transition-colors"}`}>
                    {project.name}
                </h3>
                <p className="text-sm text-cream/55 font-light line-clamp-2 md:line-clamp-1">
                    {project.description}
                </p>
            </div>

            <div className="hidden md:flex flex-col items-end gap-2 flex-shrink-0">
                <div className="flex flex-wrap gap-1 justify-end max-w-[180px]">
                    {project.stack.slice(0, 3).map((s) => (
                        <span key={s} className="text-[9px] uppercase tracking-[0.1em] font-medium px-2 py-0.5 rounded bg-cream/[0.04] border border-cream/10 text-cream/55">
                            {s}
                        </span>
                    ))}
                </div>
                <div className={`text-[10px] uppercase tracking-[0.2em] font-bold ${isPrivate ? "text-cream/40" : "text-cream/40 group-hover:text-gold transition-colors"}`}>
                    {isPrivate ? privateLabel : project.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                </div>
            </div>

            {!isPrivate && (
                <div className="hidden md:flex w-9 h-9 rounded-full bg-char/70 flex-shrink-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </div>
            )}
        </>
    );

    const sharedClasses =
        "group relative flex items-center gap-4 md:gap-6 p-3 md:p-4 rounded-2xl bg-cream/[0.03] border border-cream/10 backdrop-blur-sm transition-all duration-300";

    if (isPrivate) {
        return (
            <div className={`${sharedClasses} hover:border-cream/20`} aria-label={`${project.name} — ${privateLabel}`}>
                {inner}
            </div>
        );
    }

    return (
        <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${sharedClasses} hover:border-gold/40 hover:bg-cream/[0.05]`}
        >
            {inner}
        </a>
    );
}

/* ─────────────────────────────────────────────────────────────
   STACK — swipovateľný stoh kariet (jedna skupina = jeden stoh)
   ───────────────────────────────────────────────────────────── */
function ProjectStack({ projects, badgeFor, privateTitle, swipeHint }: {
    projects: Project[];
    badgeFor: (p: Project) => string | undefined;
    privateTitle: string;
    swipeHint: string;
}) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const { offset, velocity } = info;
        const swipe = Math.abs(offset.x) * velocity.x;
        if (offset.x < -SWIPE_THRESHOLD || swipe < -1000) {
            setActiveIndex((prev) => (prev + 1) % projects.length);
        } else if (offset.x > SWIPE_THRESHOLD || swipe > 1000) {
            setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
        }
        setIsDragging(false);
    };

    const ordered = [];
    for (let i = 0; i < projects.length; i++) {
        const index = (activeIndex + i) % projects.length;
        ordered.push({ project: projects[index], stackPosition: i });
    }
    const renderList = ordered.reverse();

    return (
        <div className="flex flex-col items-center gap-6">
            <LayoutGroup>
                <motion.div layout className="relative h-[440px] w-full max-w-md mx-auto">
                    <AnimatePresence mode="popLayout">
                        {renderList.map(({ project, stackPosition }) => {
                            const isTop = stackPosition === 0;
                            const isPrivate = !!project.private;
                            const badge = badgeFor(project);

                            return (
                                <motion.div
                                    key={project.slug}
                                    layoutId={`stack-${project.slug}`}
                                    initial={{ opacity: 0, scale: 0.85 }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1 - stackPosition * 0.04,
                                        top: stackPosition * 10,
                                        left: stackPosition * 6,
                                        zIndex: projects.length - stackPosition,
                                        rotate: (stackPosition - 0) * 1.5,
                                    }}
                                    exit={{ opacity: 0, scale: 0.8, x: -250 }}
                                    transition={{ type: "spring", stiffness: 280, damping: 26 }}
                                    drag={isTop ? "x" : false}
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={0.7}
                                    onDragStart={() => setIsDragging(true)}
                                    onDragEnd={handleDragEnd}
                                    whileDrag={{ scale: 1.02, cursor: "grabbing" }}
                                    className={classNames(
                                        "absolute inset-x-0 mx-auto w-full rounded-2xl overflow-hidden bg-cream/[0.03] border border-cream/10 backdrop-blur-sm",
                                        isTop && "cursor-grab active:cursor-grabbing",
                                        isTop && "hover:border-gold/40",
                                    )}
                                    onClick={() => {
                                        if (isDragging) return;
                                        if (!isTop) {
                                            const realIndex = projects.findIndex((p) => p.slug === project.slug);
                                            if (realIndex !== -1) setActiveIndex(realIndex);
                                            return;
                                        }
                                        if (!isPrivate) window.open(project.url, "_blank", "noopener,noreferrer");
                                    }}
                                >
                                    <div className="relative aspect-[16/10] overflow-hidden bg-char-soft">
                                        <Image
                                            src={`/portfolio/${project.slug}.jpg`}
                                            alt={project.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 448px"
                                            className="object-cover object-top"
                                            draggable={false}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-char via-char/10 to-transparent opacity-90" />
                                        {badge && (
                                            <div className="absolute top-4 left-4">
                                                <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full ${
                                                    isPrivate
                                                        ? "bg-cream/10 text-cream/80 border border-cream/20 backdrop-blur-md"
                                                        : "bg-gold text-ink"
                                                }`}>
                                                    {badge}
                                                </span>
                                            </div>
                                        )}
                                        {isPrivate && (
                                            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-char/70 backdrop-blur-md flex items-center justify-center" title={privateTitle}>
                                                <svg className="w-4 h-4 text-gold/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <rect x="5" y="11" width="14" height="9" rx="2" />
                                                    <path strokeLinecap="round" d="M8 11V8a4 4 0 1 1 8 0v3" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-5 flex flex-col gap-2">
                                        <div className="text-[10px] uppercase tracking-[0.25em] text-gold/80 font-bold">
                                            {project.category}
                                        </div>
                                        <h3 className="text-lg font-display font-bold text-cream">{project.name}</h3>
                                        <p className="text-sm text-cream/60 leading-relaxed font-light line-clamp-2">
                                            {project.description}
                                        </p>
                                    </div>

                                    {isTop && (
                                        <div className="pointer-events-none absolute bottom-2 left-0 right-0 text-center">
                                            <span className="text-[10px] uppercase tracking-[0.25em] text-cream/40">{swipeHint}</span>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            </LayoutGroup>

            {projects.length > 1 && (
                <div className="flex justify-center gap-1.5">
                    {projects.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={classNames(
                                "h-1.5 rounded-full transition-all",
                                index === activeIndex ? "w-5 bg-gold" : "w-1.5 bg-cream/20 hover:bg-cream/40",
                            )}
                            aria-label={`Card ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   SECTION HEADER + LAYOUT TOGGLE
   ───────────────────────────────────────────────────────────── */
function SectionHeader({ index, title, description }: { index: string; title: string; description: string }) {
    return (
        <div className="mb-10">
            <span className="text-[10px] uppercase tracking-[0.35em] font-bold text-gold/80">{index}</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-cream mt-1">{title}</h2>
            <p className="text-cream/55 mt-2 max-w-xl font-light">{description}</p>
        </div>
    );
}

function LayoutToggle({ value, onChange, labels }: {
    value: LayoutMode;
    onChange: (v: LayoutMode) => void;
    labels: { label: string; grid: string; stack: string; list: string };
}) {
    const modes: LayoutMode[] = ["grid", "stack", "list"];
    return (
        <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-cream/40 hidden sm:inline">
                {labels.label}
            </span>
            <div className="flex items-center gap-1 rounded-full bg-cream/[0.04] border border-cream/10 p-1 backdrop-blur-sm">
                {modes.map((mode) => {
                    const Icon = layoutIcons[mode];
                    const isActive = value === mode;
                    return (
                        <button
                            key={mode}
                            onClick={() => onChange(mode)}
                            className={classNames(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all",
                                isActive
                                    ? "bg-gold text-ink shadow-sm"
                                    : "text-cream/55 hover:text-cream hover:bg-cream/[0.06]",
                            )}
                            aria-label={`Switch to ${mode} layout`}
                            aria-pressed={isActive}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">{labels[mode]}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
   ───────────────────────────────────────────────────────────── */
export default function RealizacieClient() {
    const { t } = useTranslation();
    const [layout, setLayout] = useState<LayoutMode>("grid");

    const totalCount = REALIZACIE_GROUPS.reduce((sum, g) => sum + g.projects.length, 0);
    const privateLabel = t("realizacie.privateLabel");
    const privateTitle = t("realizacie.privateTitle");
    const swipeHint = t("realizacie.layout.swipe");

    const toggleLabels = {
        label: t("realizacie.layout.label"),
        grid: t("realizacie.layout.grid"),
        stack: t("realizacie.layout.stack"),
        list: t("realizacie.layout.list"),
    };

    const badgeFor = (p: Project) => (p.badgeKey ? t(`realizacie.badge.${p.badgeKey}`) : undefined);

    return (
        <main className="min-h-screen bg-char relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <SectionBackground variant="soft" topFade={false} />
            </div>

            {/* Hero */}
            <section className="pt-32 pb-12 md:pt-40 md:pb-16 relative z-10">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl">
                        <span className="text-[10px] uppercase tracking-[0.35em] font-bold text-gold/80">
                            {t("realizacie.portfolio")} · {totalCount} {t("realizacie.projectsCount")}
                        </span>
                        <h1 className="text-5xl md:text-7xl font-display font-bold text-cream mt-3 leading-[0.95]">
                            {t("realizacie.h1.line1")} <span className="text-gold">{t("realizacie.h1.line2")}</span>
                        </h1>
                        <p className="text-cream/65 mt-6 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
                            {t("realizacie.lead")}
                        </p>
                        <div className="flex flex-wrap gap-6 mt-8 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                                <span className="text-cream/70">{totalCount}{t("realizacie.stat.projectsPlus")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                                <span className="text-cream/70">{t("realizacie.stat.live")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                                <span className="text-cream/70">{t("realizacie.stat.stack")}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sticky layout toggle bar */}
            <div className="sticky top-20 z-20 backdrop-blur-md bg-char/60 border-y border-cream/[0.06]">
                <div className="container mx-auto px-6 py-3 flex justify-end">
                    <LayoutToggle value={layout} onChange={setLayout} labels={toggleLabels} />
                </div>
            </div>

            {/* Groups */}
            {REALIZACIE_GROUPS.map((group) => (
                <section key={group.index} className="py-12 md:py-16 relative z-10">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
                    <div className="container mx-auto px-6">
                        <SectionHeader
                            index={group.index}
                            title={t(group.titleKey)}
                            description={t(group.descKey)}
                        />

                        {layout === "grid" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {group.projects.map((p) => (
                                    <ProjectCard
                                        key={p.slug}
                                        project={p}
                                        badgeText={badgeFor(p)}
                                        privateLabel={privateLabel}
                                        privateTitle={privateTitle}
                                    />
                                ))}
                            </div>
                        )}

                        {layout === "list" && (
                            <div className="flex flex-col gap-3">
                                {group.projects.map((p) => (
                                    <ProjectListItem
                                        key={p.slug}
                                        project={p}
                                        badgeText={badgeFor(p)}
                                        privateLabel={privateLabel}
                                    />
                                ))}
                            </div>
                        )}

                        {layout === "stack" && (
                            <ProjectStack
                                projects={group.projects}
                                badgeFor={badgeFor}
                                privateTitle={privateTitle}
                                swipeHint={swipeHint}
                            />
                        )}
                    </div>
                </section>
            ))}

            {/* Note */}
            <section className="py-12 relative z-10">
                <div className="container mx-auto px-6 max-w-3xl">
                    <div className="rounded-2xl border border-cream/10 bg-cream/[0.03] backdrop-blur-sm p-8 text-center">
                        <p className="text-cream/60 text-sm leading-relaxed">
                            {t("realizacie.note.line1")}<br />
                            <strong className="text-gold">{t("realizacie.note.line2")}</strong>
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 md:py-28 relative z-10">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-cream mb-4">
                        {t("realizacie.bottomCta.title")}
                    </h2>
                    <p className="text-cream/55 text-lg mb-10 font-light">
                        {t("realizacie.bottomCta.text")}
                    </p>
                    <Link
                        href="/#contact"
                        className="inline-flex items-center gap-3 px-10 py-4 bg-gold text-ink rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-gold-bright transition-all shadow-lg shadow-black/20"
                    >
                        {t("realizacie.bottomCta.button")}
                    </Link>
                </div>
            </section>
        </main>
    );
}
