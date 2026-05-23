"use client";

import Link from "next/link";
import { ArrowRight, Bot, Globe2, Megaphone, Palette, Workflow } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

const SERVICES = [
    { id: 0, slug: "tvorba-webu",      icon: Globe2,    tag: "WEB" },
    { id: 1, slug: "ai-chatbot",       icon: Bot,       tag: "AI" },
    { id: 2, slug: "ai-automatizacia", icon: Workflow,  tag: "AUTOMATIZÁCIA" },
    { id: 3, slug: "logo-branding",    icon: Palette,   tag: "DIZAJN" },
    { id: 4, slug: "sprava-socialnych-sieti", icon: Megaphone, tag: "MARKETING" },
] as const;

/**
 * MobileServicesGrid — replaces the desktop orbit section on phones.
 *
 * The desktop ServicesSection uses a rotating circular orbit with
 * setInterval-driven rotation, hover-magnetic effects, and a 38rem
 * detail panel. None of that maps to a touch screen well, and the
 * continuous rotation drains battery + stutters during scroll.
 *
 * This is a flat stack of cards. Tap → go to /sluzby/[slug]. Touch-first.
 */
export default function MobileServicesGrid() {
    const { t } = useTranslation();

    return (
        <section id="services" className="relative py-16">
            <div className="mx-auto max-w-md px-5">
                {/* Heading */}
                <div className="mb-10 text-center">
                    <div className="mb-4 flex items-center justify-center gap-2.5">
                        <span aria-hidden="true" className="h-px w-8 bg-gradient-to-r from-transparent to-gold/60" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold/85">
                            Päť služieb
                        </span>
                        <span aria-hidden="true" className="h-px w-8 bg-gradient-to-l from-transparent to-gold/60" />
                    </div>
                    <h2 className="font-display text-[2.1rem] font-bold leading-[1.1] tracking-tight text-cream">
                        Všetko digitálne pod&nbsp;jednou strechou
                    </h2>
                    <p className="mx-auto mt-4 max-w-[20rem] text-[14px] font-light leading-relaxed text-cream/55">
                        Web, AI, automatizácia, dizajn a marketing — jeden tím, jeden účet.
                    </p>
                </div>

                {/* Service cards */}
                <ul className="flex flex-col gap-3">
                    {SERVICES.map((service) => {
                        const Icon = service.icon;
                        return (
                            <li key={service.id}>
                                <Link
                                    href={`/sluzby/${service.slug}`}
                                    className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-cream/[0.09] bg-gradient-to-b from-cream/[0.05] to-cream/[0.015] p-4 transition-colors active:border-gold/45"
                                >
                                    {/* Icon badge */}
                                    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/12 text-gold ring-1 ring-gold/25">
                                        <Icon className="h-5 w-5" strokeWidth={1.8} />
                                    </span>

                                    {/* Text */}
                                    <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                                        <span className="flex items-center gap-2">
                                            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-gold/75">
                                                {service.tag}
                                            </span>
                                        </span>
                                        <span className="text-[16px] font-semibold leading-tight text-cream/95">
                                            {t(`services.${service.id}.title`)}
                                        </span>
                                        <span className="text-[13px] font-light leading-relaxed text-cream/60">
                                            {t(`services.${service.id}.description`)}
                                        </span>
                                    </span>

                                    {/* Chevron */}
                                    <ArrowRight
                                        className="mt-1 h-4 w-4 shrink-0 text-cream/40 transition-colors group-active:text-gold"
                                        strokeWidth={1.8}
                                    />
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
