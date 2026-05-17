"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import type { Lang } from "@/i18n/translations";
import { scrollToPageSection } from "@/lib/scrollToPageSection";

const NAV_IDS = ["about"] as const;
const NAV_KEYS: Record<string, string> = {
    about: "nav.about",
};

const LANGS: { code: Lang; flag: string; label: string }[] = [
    { code: "en", flag: "🇬🇧", label: "EN" },
    { code: "sk", flag: "🇸🇰", label: "SK" },
    { code: "cs", flag: "🇨🇿", label: "CZ" },
];

const MENU_TOGGLE_ID = "aiwai-menu-toggle";

/** Close the mobile menu by unchecking the toggle input — works pre/post hydration. */
const closeMobileMenu = () => {
    const input = document.getElementById(MENU_TOGGLE_ID) as HTMLInputElement | null;
    if (input) input.checked = false;
};

export default function Navbar() {
    const { t, lang, setLang } = useTranslation();
    const pathname = usePathname();
    const router = useRouter();
    const isHome = pathname === "/";
    const [langOpen, setLangOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const langRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if ("scrollRestoration" in history) history.scrollRestoration = "manual";
        // On page reload, strip the hash and go to top (hash stays from prev nav)
        const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
        if (nav?.type === "reload" && window.location.hash) {
            window.history.replaceState(null, "", window.location.pathname);
            window.scrollTo(0, 0);
        }
    }, []);

    useEffect(() => {
        if (!isHome) return;

        const scrollToHash = () => {
            const id = decodeURIComponent(window.location.hash.replace("#", ""));
            if (!id) return;
            [120, 450, 900, 1400].forEach((delay) => {
                window.setTimeout(() => scrollToPageSection(id), delay);
            });
        };

        scrollToHash();
        window.addEventListener("hashchange", scrollToHash);
        return () => window.removeEventListener("hashchange", scrollToHash);
    }, [isHome]);

    // Close lang dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (langRef.current && !langRef.current.contains(e.target as Node)) {
                setLangOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Home, cennik and realizacie pages are dark — navbar stays in dark mode regardless of scroll
    const DARK_PAGES = ["/", "/cennik", "/realizacie", "/sluzby"];
    const isDarkPage =
        DARK_PAGES.includes(pathname) || pathname.startsWith("/sluzby/");
    const darkMode = isDarkPage;

    const handleScroll = useCallback((e: React.MouseEvent, id: string) => {
        e.preventDefault();
        closeMobileMenu();
        if (isHome) {
            window.history.replaceState(null, "", `#${id}`);
            setTimeout(() => scrollToPageSection(id), 50);
        } else {
            router.push(`/#${id}`);
        }
    }, [isHome, router]);

    return (
        <>
            {/* ── Main Nav — CSS entrance only ── */}
            <nav className={`nav-entrance fixed top-0 left-0 right-0 z-[100] py-3 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-500 ${
                scrolled
                    ? isDarkPage
                        ? "bg-char/80 backdrop-blur-md border-b border-cream/10 shadow-[0_1px_30px_rgba(0,0,0,0.3)]"
                        : "bg-white/85 backdrop-blur-sm border-b border-brand-indigo/[0.06] shadow-[0_1px_30px_rgba(28,31,58,0.04)]"
                    : "bg-transparent border-b border-transparent"
            }`}>
                {/*
                  CSS-only menu state — a hidden checkbox is the source of truth.
                  The hamburger <label> below toggles it natively, which means the
                  menu opens INSTANTLY on the very first paint, before any JS has
                  hydrated. We use :has() in CSS to drive the menu drawer from
                  this checkbox regardless of where in the DOM it lives.
                */}
                <input
                    id={MENU_TOGGLE_ID}
                    type="checkbox"
                    aria-label="Toggle mobile menu"
                />
                <div className="container mx-auto flex justify-between items-center">

                    {/* Logo + (desktop-only) language switcher */}
                    <div className="flex items-center gap-3 z-[110]">
                        <Link
                            href="/"
                            onClick={(e) => { if (isHome) { e.preventDefault(); closeMobileMenu(); window.scrollTo({ top: 0, behavior: "smooth" }); } else { closeMobileMenu(); } }}
                            className="flex relative items-center"
                            aria-label="AIWai"
                        >
                            <Image
                                src="/logo.png"
                                alt="AIWai"
                                width={52}
                                height={52}
                                className={`w-10 h-10 md:w-12 md:h-12 object-contain ${isDarkPage ? "" : "mix-blend-multiply"}`}
                                priority
                            />
                        </Link>

                        {/* Language switcher — desktop only, segmented */}
                        <div className="hidden md:flex items-center" ref={langRef}>
                            {LANGS.map((l, i) => {
                                const isActive = l.code === lang;
                                return (
                                    <div key={l.code} className="flex items-center">
                                        {i > 0 && (
                                            <span aria-hidden className={`mx-1.5 h-3 w-px ${darkMode ? "bg-cream/15" : "bg-brand-indigo/15"}`} />
                                        )}
                                        <button
                                            onClick={() => setLang(l.code)}
                                            aria-current={isActive ? "true" : undefined}
                                            className={`relative px-1.5 py-1 text-[11px] font-bold uppercase tracking-[0.22em] transition-all duration-300 ${
                                                isActive
                                                    ? darkMode ? "text-gold" : "text-brand-indigo"
                                                    : darkMode ? "text-cream/40 hover:text-cream/80" : "text-brand-indigo/45 hover:text-brand-indigo/80"
                                            }`}
                                        >
                                            {l.label}
                                            <span
                                                aria-hidden
                                                className={`pointer-events-none absolute left-1 right-1 -bottom-0.5 h-px transition-transform duration-300 origin-center ${darkMode ? "bg-gold" : "bg-brand-indigo"} ${
                                                    isActive ? "scale-x-100" : "scale-x-0"
                                                }`}
                                            />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Old dropdown — hidden, kept as fallback wrapper to maintain refs (no longer rendered) */}
                        <div className="hidden">
                            <button
                                onClick={() => setLangOpen(!langOpen)}
                                aria-label="Change language"
                            >
                                <span>{LANGS.find((l) => l.code === lang)?.flag}</span>
                            </button>
                            <div className={langOpen ? "" : ""}>
                                {LANGS.filter((l) => l.code !== lang).map((l) => (
                                    <button
                                        key={l.code}
                                        onClick={() => { setLang(l.code); setLangOpen(false); }}
                                    >
                                        <span>{l.flag}</span>
                                        <span className={`text-xs font-medium uppercase ${darkMode ? "text-cream/70" : "text-brand-indigo/60"}`}>{l.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-1 lg:gap-2">
                        {(() => {
                            const baseTextDark = "text-cream/75 group-hover:text-ink";
                            const baseTextLight = "text-brand-indigo/65 group-hover:text-white";
                            const accent = darkMode ? "border-gold" : "border-brand-indigo";
                            const accentBg = darkMode ? "bg-gold" : "bg-brand-indigo";
                            const textCls = darkMode ? baseTextDark : baseTextLight;
                            const itemInner = (label: string) => (
                                <>
                                    <span aria-hidden className={`pointer-events-none absolute inset-x-0 top-0 bottom-0 border-t-2 border-b-2 ${accent} scale-y-[1.6] opacity-0 transition-[transform,opacity] duration-300 ease-out origin-center group-hover:scale-y-100 group-hover:opacity-100`} />
                                    <span aria-hidden className={`pointer-events-none absolute left-0 right-0 top-[2px] bottom-[2px] ${accentBg} scale-y-0 opacity-0 transition-[transform,opacity] duration-300 ease-out origin-top group-hover:scale-y-100 group-hover:opacity-100`} />
                                    <span className={`relative z-10 block px-4 py-2 text-[13px] uppercase tracking-[0.22em] font-semibold transition-colors duration-300 ${textCls}`}>
                                        {label}
                                    </span>
                                </>
                            );
                            const navItemClass = "relative inline-block group cursor-pointer";
                            return (
                                <>
                                    {NAV_IDS.map((id) => (
                                        <a
                                            key={id}
                                            href={`#${id}`}
                                            onClick={(e) => handleScroll(e, id)}
                                            className={navItemClass}
                                        >
                                            {itemInner(t(NAV_KEYS[id]))}
                                        </a>
                                    ))}
                                    <Link href="/sluzby" className={navItemClass}>
                                        {itemInner(t("nav.services"))}
                                    </Link>
                                    <Link href="/realizacie" className={navItemClass}>
                                        {itemInner(t("nav.work"))}
                                    </Link>
                                    <Link href="/cennik" className={navItemClass}>
                                        {itemInner(t("nav.pricing"))}
                                    </Link>
                                    <div className={`w-px h-6 mx-3 ${darkMode ? "bg-cream/15" : "bg-brand-indigo/10"}`} />
                                    {isHome ? (
                                        <button
                                            onClick={(e) => handleScroll(e, "contact")}
                                            className={`px-6 py-2.5 text-xs font-bold tracking-[0.15em] uppercase transition-all shadow-lg ${
                                                darkMode
                                                    ? "bg-gold text-ink hover:bg-gold-bright shadow-black/20"
                                                    : "bg-brand-indigo text-white hover:bg-brand-indigo/90 shadow-brand-indigo/10 hover:shadow-brand-indigo/20"
                                            }`}
                                        >
                                            {t("nav.contact")}
                                        </button>
                                    ) : (
                                        <Link
                                            href="/#contact"
                                            className={`px-6 py-2.5 text-xs font-bold tracking-[0.15em] uppercase transition-all shadow-lg ${
                                                darkMode
                                                    ? "bg-gold text-ink hover:bg-gold-bright shadow-black/20"
                                                    : "bg-brand-indigo text-white hover:bg-brand-indigo/90 shadow-brand-indigo/10 hover:shadow-brand-indigo/20"
                                            }`}
                                        >
                                            {t("nav.contact")}
                                        </Link>
                                    )}
                                </>
                            );
                        })()}
                    </div>

                    {/* Mobile toggle — pure HTML <label>, opens instantly without JS */}
                    <label
                        htmlFor={MENU_TOGGLE_ID}
                        className={`md:hidden ml-auto z-[110] p-2 relative w-10 h-10 cursor-pointer select-none ${darkMode ? "text-cream" : "text-brand-indigo"}`}
                        aria-label="Toggle menu"
                    >
                        <span className="aiwai-icon-burger absolute inset-0 flex items-center justify-center">
                            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none"><path d="M4 8H20M12 16H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                        </span>
                        <span className="aiwai-icon-x absolute inset-0 flex items-center justify-center">
                            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none"><path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                        </span>
                    </label>
                </div>
            </nav>

            {/* ── Mobile Menu — driven purely by CSS sibling of the checkbox above ── */}
            <div
                role="dialog"
                aria-label="Mobile navigation"
                className="aiwai-mobile-menu fixed inset-0 z-[90] bg-char flex flex-col items-center justify-center overflow-hidden"
            >
                {/* Background ambience — gold glow on dark, matches site theme */}
                <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[10%] left-[10%] w-[320px] h-[320px] rounded-full"
                        style={{ background: "radial-gradient(circle, rgba(201,168,117,0.18) 0%, transparent 65%)" }} />
                    <div className="absolute bottom-[10%] right-[10%] w-[320px] h-[320px] rounded-full"
                        style={{ background: "radial-gradient(circle, rgba(201,168,117,0.10) 0%, transparent 70%)" }} />
                </div>
                <div aria-hidden="true" className="absolute inset-0 gold-vlines opacity-30 pointer-events-none" />

                <div className="flex flex-col items-center gap-10 relative z-10 w-full px-12">
                    {NAV_IDS.map((id) => (
                        <div key={id} className="aiwai-menu-item overflow-hidden w-full flex justify-center">
                            <a
                                href={`#${id}`}
                                onClick={(e) => handleScroll(e, id)}
                                className="text-5xl font-display font-bold tracking-tighter text-cream hover:text-gold transition-colors cursor-pointer"
                            >
                                {t(NAV_KEYS[id])}
                            </a>
                        </div>
                    ))}

                    <div className="aiwai-menu-item overflow-hidden w-full flex justify-center">
                        <Link
                            href="/sluzby"
                            onClick={closeMobileMenu}
                            className="text-5xl font-display font-bold tracking-tighter text-cream hover:text-gold transition-colors"
                        >
                            {t("nav.services")}
                        </Link>
                    </div>

                    <div className="aiwai-menu-item overflow-hidden w-full flex justify-center">
                        <Link
                            href="/realizacie"
                            onClick={closeMobileMenu}
                            className="text-5xl font-display font-bold tracking-tighter text-cream hover:text-gold transition-colors"
                        >
                            {t("nav.work")}
                        </Link>
                    </div>

                    <div className="aiwai-menu-item overflow-hidden w-full flex justify-center">
                        <Link
                            href="/cennik"
                            onClick={closeMobileMenu}
                            className="text-5xl font-display font-bold tracking-tighter text-cream hover:text-gold transition-colors"
                        >
                            {t("nav.pricing")}
                        </Link>
                    </div>

                    {/* Language switcher */}
                    <div className="aiwai-menu-item flex items-center gap-3">
                        {LANGS.map((l) => (
                            <button
                                key={l.code}
                                onClick={() => { setLang(l.code); closeMobileMenu(); }}
                                className={`px-4 py-2.5 text-2xl rounded-xl transition-all ${
                                    lang === l.code
                                        ? "bg-gold/15 ring-2 ring-gold/40 scale-110"
                                        : "opacity-50 hover:opacity-100"
                                }`}
                            >
                                {l.flag}
                            </button>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="aiwai-menu-item w-full max-w-[280px]">
                        <button
                            onClick={(e) => handleScroll(e, "contact")}
                            className="w-full mt-6 px-12 py-5 bg-gold text-ink rounded-full text-xl font-bold tracking-widest uppercase shadow-2xl shadow-gold/20 active:scale-95 transition-transform"
                        >
                            {t("nav.contact")}
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-12 flex flex-col items-center gap-2 text-cream/40">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold select-none text-gold/70">AIWai</span>
                    <span className="text-[10px] uppercase tracking-[0.1em] select-none">Intelligent Digital Architecture</span>
                </div>
            </div>
        </>
    );
}
