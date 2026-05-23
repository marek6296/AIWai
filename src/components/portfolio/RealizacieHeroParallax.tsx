"use client";

import React from "react";
import Image from "next/image";
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
    type MotionValue,
} from "framer-motion";
import type { Project } from "@/app/(main)/realizacie/data";
import { useTranslation } from "@/i18n/useTranslation";

interface Props {
    projects: Project[];
    onSelect: (slug: string) => void;
}

/**
 * 3D parallax hero showcase — adapted to AIWai aesthetics.
 * Three rows of cards moving on scroll with rotateX, rotateZ, translateY, fade-in.
 * Click on a card opens the lightbox via `onSelect(slug)`.
 */
export default function RealizacieHeroParallax({ projects, onSelect }: Props) {
    const { t } = useTranslation();
    const ref = React.useRef<HTMLDivElement>(null);

    // Distribute projects across 3 rows. Pad rows so each has at least 4 cards.
    const rowSize = Math.max(4, Math.ceil(projects.length / 3));
    const ensureMin = (arr: Project[]): Project[] => {
        if (arr.length === 0) return projects.slice(0, 4);
        const out = [...arr];
        let i = 0;
        while (out.length < 4) {
            out.push(arr[i % arr.length]);
            i++;
        }
        return out;
    };
    const row1 = ensureMin(projects.slice(0, rowSize));
    const row2 = ensureMin(projects.slice(rowSize, rowSize * 2));
    const row3 = ensureMin(projects.slice(rowSize * 2));

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

    const translateX = useSpring(
        useTransform(scrollYProgress, [0, 1], [0, 1000]),
        springConfig,
    );
    const translateXReverse = useSpring(
        useTransform(scrollYProgress, [0, 1], [0, -1000]),
        springConfig,
    );
    const rotateX = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [15, 0]),
        springConfig,
    );
    const opacity = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
        springConfig,
    );
    const rotateZ = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [20, 0]),
        springConfig,
    );
    const translateY = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [-700, 200]),
        springConfig,
    );

    return (
        <div
            ref={ref}
            className="relative flex h-[260vh] flex-col self-auto overflow-hidden py-32 md:py-40 antialiased [perspective:1000px] [transform-style:preserve-3d]"
        >
            <ParallaxHeader t={t} />

            <motion.div
                style={{ rotateX, rotateZ, translateY, opacity }}
                className="will-change-transform"
            >
                <motion.div className="mb-12 flex flex-row-reverse space-x-reverse space-x-6 md:space-x-10">
                    {row1.map((project, idx) => (
                        <ProjectCard
                            key={`r1-${project.slug}-${idx}`}
                            project={project}
                            translate={translateX}
                            onSelect={onSelect}
                        />
                    ))}
                </motion.div>

                <motion.div className="mb-12 flex flex-row space-x-6 md:space-x-10">
                    {row2.map((project, idx) => (
                        <ProjectCard
                            key={`r2-${project.slug}-${idx}`}
                            project={project}
                            translate={translateXReverse}
                            onSelect={onSelect}
                        />
                    ))}
                </motion.div>

                <motion.div className="flex flex-row-reverse space-x-reverse space-x-6 md:space-x-10">
                    {row3.map((project, idx) => (
                        <ProjectCard
                            key={`r3-${project.slug}-${idx}`}
                            project={project}
                            translate={translateX}
                            onSelect={onSelect}
                        />
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
}

function ParallaxHeader({ t }: { t: (key: string) => string }) {
    return (
        <div className="relative left-0 top-0 mx-auto w-full max-w-7xl px-6 py-16 md:py-24">
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-cream/45">
                <span aria-hidden className="h-px w-8 bg-gold/70" />
                <span>{t("nav.work")}</span>
            </div>

            <h1 className="mt-8 max-w-[18ch] font-display font-medium tracking-[-0.035em] text-cream text-[2.75rem] sm:text-6xl lg:text-[5.25rem] leading-[0.95]">
                {t("realizacie.h1.line1")}
                <br />
                <span className="text-cream/35">{t("realizacie.h1.line2")}</span>
            </h1>

            <p className="mt-8 max-w-[55ch] text-[15px] md:text-base text-cream/65 leading-[1.7]">
                {t("realizacie.lead")}
            </p>
        </div>
    );
}

function ProjectCard({
    project,
    translate,
    onSelect,
}: {
    project: Project;
    translate: MotionValue<number>;
    onSelect: (slug: string) => void;
}) {
    return (
        <motion.div
            style={{ x: translate }}
            whileHover={{ y: -16 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="group/product relative h-72 w-[20rem] flex-shrink-0 sm:h-80 sm:w-[24rem] md:h-[22rem] md:w-[30rem]"
        >
            <button
                type="button"
                onClick={() => onSelect(project.slug)}
                aria-label={`${project.name} — detail`}
                className="block h-full w-full overflow-hidden rounded-[10px] border border-cream/10 bg-char-soft/40 transition-shadow duration-500 group-hover/product:border-gold/40 group-hover/product:shadow-[0_30px_80px_-30px_rgba(201,168,117,0.45)]"
            >
                <div className="relative h-full w-full overflow-hidden bg-ink">
                    <Image
                        src={`/portfolio/${project.slug}.jpg`}
                        alt={project.name}
                        fill
                        sizes="(max-width: 640px) 320px, (max-width: 1024px) 384px, 480px"
                        className="object-cover object-left-top"
                    />
                    {/* hover wash */}
                    <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-char/90 via-char/30 to-transparent opacity-0 transition-opacity duration-500 group-hover/product:opacity-100"
                    />
                </div>
            </button>

            {/* hover info */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-1 p-5 opacity-0 transition-opacity duration-500 group-hover/product:opacity-100">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">
                    {project.category}
                </span>
                <h2 className="font-display text-xl md:text-2xl font-medium tracking-[-0.02em] text-cream">
                    {project.name}
                </h2>
            </div>
        </motion.div>
    );
}
