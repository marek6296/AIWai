"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, X, ZoomIn } from "lucide-react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { REALIZACIE_PROJECTS, type ProjectTag } from "@/app/(main)/realizacie/data";

const ALL_TAGS: (ProjectTag | "Všetko")[] = ["Všetko", "Web", "Aplikácia", "AI"];

export default function RealizacieGallery() {
    const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
    const [filter, setFilter] = useState<ProjectTag | "Všetko">("Všetko");
    const [mounted, setMounted] = useState(false);

    // Sliding gold pill for the filter toggle (matches cennik CategoryToggle)
    const filterBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
    const [pillStyle, setPillStyle] = useState<{ width: number; height: number; transform: string }>({
        width: 0,
        height: 0,
        transform: "translate(0,0)",
    });

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        const update = () => {
            const btn = filterBtnRefs.current[filter];
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
    }, [filter]);

    const filtered =
        filter === "Všetko"
            ? REALIZACIE_PROJECTS
            : REALIZACIE_PROJECTS.filter((p) => p.tag === filter);

    const selected = REALIZACIE_PROJECTS.find((p) => p.slug === selectedSlug);

    const handleNext = () => {
        if (!selectedSlug) return;
        const idx = filtered.findIndex((p) => p.slug === selectedSlug);
        const next = (idx + 1) % filtered.length;
        setSelectedSlug(filtered[next].slug);
    };

    const handlePrev = () => {
        if (!selectedSlug) return;
        const idx = filtered.findIndex((p) => p.slug === selectedSlug);
        const prev = (idx - 1 + filtered.length) % filtered.length;
        setSelectedSlug(filtered[prev].slug);
    };

    const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>, slug: string) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setSelectedSlug(slug);
        }
    };

    useEffect(() => {
        if (!selectedSlug) return;
        const onKey = (e: globalThis.KeyboardEvent) => {
            if (e.key === "Escape") setSelectedSlug(null);
            if (e.key === "ArrowRight") handleNext();
            if (e.key === "ArrowLeft") handlePrev();
        };
        window.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    });

    return (
        <section
            className="relative w-full px-4 pb-16 md:pb-24"
            aria-labelledby="realizacie-gallery-heading"
        >
            <div className="mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-10 md:mb-14 text-center"
                >
                    <h1
                        id="realizacie-gallery-heading"
                        className="mx-auto mb-4 font-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] text-cream"
                    >
                        Naše portfólio
                    </h1>
                    <p className="mx-auto max-w-2xl text-cream/65 text-base md:text-lg font-light leading-relaxed">
                        Weby, aplikácie a AI projekty — výber z toho, čo sme postavili pre seba aj pre klientov.
                    </p>
                </motion.div>

                {/* Filter Buttons — matches cennik CategoryToggle */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-10 flex justify-center"
                    role="group"
                    aria-label="Kategórie projektov"
                >
                    <div className="relative flex w-fit flex-wrap items-center justify-center gap-1 rounded-2xl border border-cream/10 bg-char-soft/60 p-1 backdrop-blur">
                        <motion.div
                            aria-hidden="true"
                            className="absolute left-0 top-0 rounded-full bg-gold"
                            style={pillStyle}
                            transition={{ type: "spring", stiffness: 500, damping: 40 }}
                        />
                        {ALL_TAGS.map((tag) => {
                            const active = filter === tag;
                            return (
                                <button
                                    key={tag}
                                    ref={(el) => { filterBtnRefs.current[tag] = el; }}
                                    type="button"
                                    onClick={() => setFilter(tag)}
                                    aria-pressed={active}
                                    className={`relative z-10 rounded-full px-4 sm:px-5 py-2 text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] transition-colors ${
                                        active ? "text-ink" : "text-cream/60 hover:text-cream"
                                    }`}
                                >
                                    {tag}
                                </button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Gallery Grid */}
                <motion.div
                    layout
                    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    role="list"
                    aria-label="Projekty"
                >
                    <AnimatePresence mode="popLayout">
                        {filtered.map((project, index) => (
                            <motion.div
                                key={project.slug}
                                layout
                                initial={{ opacity: 0, scale: 0.92 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.92 }}
                                transition={{ duration: 0.3, delay: index * 0.04 }}
                                role="listitem"
                            >
                                <div
                                    className="group relative cursor-pointer overflow-hidden rounded-[12px] border border-cream/10 bg-char-soft/40 transition-all duration-300 hover:border-gold/45 hover:shadow-[0_30px_80px_-30px_rgba(201,168,117,0.4)]"
                                    onClick={() => setSelectedSlug(project.slug)}
                                    onKeyDown={(e) => handleCardKeyDown(e, project.slug)}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`Zobraziť detail projektu ${project.name}`}
                                >
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <Image
                                            src={`/portfolio/${project.slug}.jpg`}
                                            alt={project.name}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                                        />

                                        {/* Tag chip — vždy viditeľný */}
                                        <span className="absolute top-3 left-3 z-10 rounded-full border border-gold/35 bg-char/85 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-gold backdrop-blur-sm">
                                            {project.tag}
                                        </span>

                                        {/* Hover overlay */}
                                        <div
                                            className="absolute inset-0 flex flex-col items-center justify-center bg-char/85 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                            aria-hidden="true"
                                        >
                                            <ZoomIn className="mb-3 h-8 w-8 text-gold" />
                                            <h3 className="mb-2 px-4 text-center font-display text-lg md:text-xl font-bold text-cream">
                                                {project.name}
                                            </h3>
                                            <p className="px-6 text-center text-xs text-cream/60">
                                                {project.category}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Static label under image */}
                                    <div className="border-t border-cream/8 px-4 py-3">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="truncate font-display text-sm font-bold text-cream">
                                                    {project.name}
                                                </p>
                                                <p className="truncate text-[11px] text-cream/45">
                                                    {project.category}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Lightbox — portal to body so no parent transform/isolate can break fixed positioning */}
            {mounted && createPortal(
                <AnimatePresence>
                    {selected && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[200] overflow-y-auto bg-ink/95 backdrop-blur-md"
                            onClick={() => setSelectedSlug(null)}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="gallery-dialog-title"
                        >
                            <div className="min-h-full w-full flex items-center justify-center p-4 md:p-8">
                                <motion.div
                                    initial={{ scale: 0.92, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.92, opacity: 0 }}
                                    transition={{ type: "spring", damping: 26, stiffness: 280 }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="relative w-full max-w-5xl rounded-[14px] border border-gold/30 bg-char shadow-[0_60px_160px_-30px_rgba(0,0,0,0.9)] overflow-hidden my-auto"
                                >
                                    {/* Close */}
                                    <button
                                        type="button"
                                        onClick={() => setSelectedSlug(null)}
                                        aria-label="Zavrieť"
                                        className="absolute top-3 right-3 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 bg-char/90 text-cream/85 backdrop-blur transition-colors hover:border-gold/60 hover:text-gold"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>

                                    {/* Prev */}
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                                        aria-label="Predchádzajúci projekt"
                                        className="absolute left-3 md:left-5 top-1/2 z-30 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-cream/15 bg-char/80 text-cream/80 backdrop-blur transition-colors hover:border-gold/60 hover:text-gold"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </button>

                                    {/* Next */}
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                                        aria-label="Ďalší projekt"
                                        className="absolute right-3 md:right-5 top-1/2 z-30 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-cream/15 bg-char/80 text-cream/80 backdrop-blur transition-colors hover:border-gold/60 hover:text-gold"
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </button>

                                    <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr]">
                                        {/* Image */}
                                        <div className="relative aspect-[4/3] bg-ink">
                                            <Image
                                                key={selected.slug}
                                                src={`/portfolio/${selected.slug}.jpg`}
                                                alt={selected.name}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 60vw"
                                                className="object-cover"
                                                priority
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex flex-col gap-5 p-6 md:p-8">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="rounded-full border border-gold/35 bg-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                                                    {selected.tag}
                                                </span>
                                                <span className="rounded-full border border-cream/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cream/45">
                                                    {selected.category}
                                                </span>
                                            </div>

                                            <h3
                                                id="gallery-dialog-title"
                                                className="font-display text-2xl md:text-3xl font-bold tracking-tight text-cream"
                                            >
                                                {selected.name}
                                            </h3>

                                            <p className="text-sm md:text-base text-cream/65 font-light leading-relaxed">
                                                {selected.description}
                                            </p>

                                            <div className="flex flex-wrap gap-2">
                                                {selected.stack.map((tech) => (
                                                    <span
                                                        key={tech}
                                                        className="rounded-full border border-cream/10 bg-cream/[0.04] px-3 py-1 text-[10px] font-medium tracking-wide text-cream/70"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>

                                            {!selected.private && (
                                                <a
                                                    href={selected.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-gold px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-gold-bright"
                                                >
                                                    Pozrieť projekt
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </section>
    );
}
