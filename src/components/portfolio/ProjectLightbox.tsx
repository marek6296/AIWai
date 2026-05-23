"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Project } from "@/app/(main)/realizacie/data";
import { useTranslation } from "@/i18n/useTranslation";

interface ProjectLightboxProps {
    projects: Project[];
    selectedSlug: string | null;
    onChange: (slug: string | null) => void;
}

export default function ProjectLightbox({
    projects,
    selectedSlug,
    onChange,
}: ProjectLightboxProps) {
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const selected = projects.find((p) => p.slug === selectedSlug);

    const handleNext = () => {
        if (!selectedSlug) return;
        const idx = projects.findIndex((p) => p.slug === selectedSlug);
        const next = (idx + 1) % projects.length;
        onChange(projects[next].slug);
    };

    const handlePrev = () => {
        if (!selectedSlug) return;
        const idx = projects.findIndex((p) => p.slug === selectedSlug);
        const prev = (idx - 1 + projects.length) % projects.length;
        onChange(projects[prev].slug);
    };

    useEffect(() => {
        if (!selectedSlug) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onChange(null);
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

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {selected && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] overflow-y-auto bg-ink/95 backdrop-blur-md"
                    onClick={() => onChange(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="lightbox-dialog-title"
                >
                    <div className="min-h-full w-full flex items-center justify-center p-4 md:p-8">
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.92, opacity: 0 }}
                            transition={{ type: "spring", damping: 26, stiffness: 280 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-[14px] border border-gold/30 bg-char shadow-[0_60px_160px_-30px_rgba(0,0,0,0.9)] overflow-hidden my-auto"
                        >
                            {/* Close */}
                            <button
                                type="button"
                                onClick={() => onChange(null)}
                                aria-label={t("realizacie.modal.close")}
                                className="absolute top-3 right-3 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 bg-char/90 text-cream/85 backdrop-blur transition-colors hover:border-gold/60 hover:text-gold"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            {/* Prev */}
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                                aria-label={t("realizacie.modal.prev")}
                                className="absolute left-3 md:left-5 top-1/2 z-30 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-cream/15 bg-char/80 text-cream/80 backdrop-blur transition-colors hover:border-gold/60 hover:text-gold"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </button>

                            {/* Next */}
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                                aria-label={t("realizacie.modal.next")}
                                className="absolute right-3 md:right-5 top-1/2 z-30 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-cream/15 bg-char/80 text-cream/80 backdrop-blur transition-colors hover:border-gold/60 hover:text-gold"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </button>

                            <div className="flex flex-col overflow-y-auto">
                                {/* Image */}
                                <div className="relative aspect-[16/10] w-full flex-none bg-ink">
                                    <Image
                                        key={selected.slug}
                                        src={`/portfolio/${selected.slug}.jpg`}
                                        alt={selected.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 896px"
                                        className="object-contain"
                                        priority
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex flex-col gap-5 p-6 md:p-8">
                                    {(selected.year || selected.status || selected.category) && (
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.22em] text-cream/45">
                                            {selected.year && <span>{selected.year}</span>}
                                            {selected.year && selected.status && <span aria-hidden className="text-cream/20">·</span>}
                                            {selected.status && (
                                                <span className="inline-flex items-center gap-2 text-cream/60">
                                                    <span
                                                        aria-hidden
                                                        className={`h-1.5 w-1.5 rounded-full ${
                                                            selected.status === "live"
                                                                ? "bg-gold"
                                                                : selected.status === "development"
                                                                    ? "bg-cream/55"
                                                                    : "bg-cream/35"
                                                        }`}
                                                    />
                                                    {selected.status === "live"
                                                        ? "V produkcii"
                                                        : selected.status === "development"
                                                            ? "V rozvoji"
                                                            : "Ukážka"}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <h3
                                        id="lightbox-dialog-title"
                                        className="font-display text-2xl md:text-3xl font-bold tracking-tight text-cream"
                                    >
                                        {selected.name}
                                    </h3>

                                    {selected.category && (
                                        <p className="-mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-cream/45">
                                            {selected.category}
                                        </p>
                                    )}

                                    <p className="text-sm md:text-base text-cream/70 font-light leading-relaxed">
                                        {selected.description}
                                    </p>

                                    {selected.highlights && selected.highlights.length > 0 && (
                                        <div>
                                            <div className="mb-3 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-cream/40">
                                                <span aria-hidden className="h-px w-6 bg-gold/70" />
                                                <span>Highlights</span>
                                            </div>
                                            <ul className="flex flex-col gap-2">
                                                {selected.highlights.map((h) => (
                                                    <li
                                                        key={h}
                                                        className="flex items-baseline gap-3 text-[13px] md:text-sm text-cream/75 leading-[1.55]"
                                                    >
                                                        <span
                                                            aria-hidden
                                                            className="mt-[7px] inline-block h-[4px] w-[4px] flex-none rounded-full bg-gold/80"
                                                        />
                                                        <span>{h}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div>
                                        <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-cream/40">
                                            Stack
                                        </div>
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
                                    </div>

                                    {!selected.private && (
                                        <a
                                            href={selected.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-gold px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-gold-bright"
                                        >
                                            {t("realizacie.viewProject")}
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
        document.body,
    );
}
