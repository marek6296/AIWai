"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import type { Lang } from "@/i18n/translations";

const NAV_IDS = ["services", "about"] as const;
const NAV_KEYS: Record<string, string> = {
    services: "nav.services",
    about: "nav.about",
};

const LANGS: { code: Lang; flag: string; label: string }[] = [
    { code: "en", flag: "🇬🇧", label: "EN" },
    { code: "sk", flag: "🇸🇰", label: "SK" },
    { code: "cs", flag: "🇨🇿", label: "CZ" },
];

const MENU_TOGGLE_ID = "aiwai-menu-toggle";

const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const navHeight = document.querySelector("nav")?.offsetHeight ?? 80;
    const viewportH = window.innerHeight;
    const form = el.querySelector("form");
    if (form) {
        const formRect = form.getBoundingClientRect();
        const available = viewportH - navHeight;
        const offset = Math.max(24, (available - formRect.height) / 2);
        window.scrollTo({ top: Math.max(0, formRect.top + window.scrollY - navHeight - offset), behavior: "smooth" });
        return;
    }
    const heading = el.querySelector("h1, h2") as HTMLElement | null;
    const top = heading
        ? heading.getBoundingClientRect().top + window.scrollY - navHeight - 24
        : el.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: "smooth" });
};

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
    const [scrolled, setScrolled] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const langRef = useRef<HTMLDivElement>(null);

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
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

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
    const DARK_PAGES = ["/", "/cennik", "/realizacie"];
    const isDarkPage = DARK_PAGES.includes(pathname);
    const darkMode = isDarkPage;

    const handleScroll = useCallback((e: React.MouseEvent, id: string) => {
        e.preventDefault();
        closeMobileMenu();
        if (isHome) {
            setTimeout(() => scrollTo(id), 50);
        } else {
            router.push(`/#${id}`);
        }
    }, [isHome, router]);

    return (
        <>
            {/* ── Main Nav — CSS entrance only ── */}
            <nav className={`nav-entrance fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
                scrolled
                    ? isDarkPage
                        ? "py-3 bg-char/80 backdrop-blur-md border-b border-cream/10 shadow-[0_1px_30px_rgba(0,0,0,0.3)]"
                        : "py-3 bg-white/85 backdrop-blur-sm border-b border-brand-indigo/[0.06] shadow-[0_1px_30px_rgba(28,31,58,0.04)]"
                    : "py-5 bg-transparent"
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

                        {/* Language switcher — desktop only */}
                        <div className="relative hidden md:block" ref={langRef}>
                            <button
                                onClick={() => setLangOpen(!langOpen)}
                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-colors ${darkMode ? "hover:bg-cream/5" : "hover:bg-brand-indigo/5"}`}
                                aria-label="Change language"
                            >
                                <span className="text-base">{LANGS.find((l) => l.code === lang)?.flag}</span>
                                <svg className={`w-3 h-3 transition-transform duration-200 ${darkMode ? "text-cream/40" : "text-brand-indigo/40"} ${langOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown — CSS visibility trick, no AnimatePresence */}
                            <div className={`absolute top-full left-0 mt-1 ${darkMode ? "bg-char/95 border-cream/15" : "bg-white/95 border-brand-indigo/10"} backdrop-blur-md border rounded-xl shadow-lg overflow-hidden transition-all duration-150 ${
                                langOpen ? "opacity-100 translate-y-0 visible pointer-events-auto" : "opacity-0 -translate-y-1 invisible pointer-events-none"
                            }`}>
                                {LANGS.filter((l) => l.code !== lang).map((l) => (
                                    <button
                                        key={l.code}
                                        onClick={() => { setLang(l.code); setLangOpen(false); }}
                                        className={`flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors ${darkMode ? "hover:bg-cream/5" : "hover:bg-brand-indigo/5"}`}
                                    >
                                        <span className="text-base">{l.flag}</span>
                                        <span className={`text-xs font-medium uppercase ${darkMode ? "text-cream/70" : "text-brand-indigo/60"}`}>{l.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-1">
                        <div className="flex items-center">
                            {NAV_IDS.map((id) => (
                                <a
                                    key={id}
                                    href={`#${id}`}
                                    onClick={(e) => handleScroll(e, id)}
                                    className={`relative px-5 py-2.5 text-sm uppercase tracking-[0.15em] rounded-full transition-all duration-200 cursor-pointer font-medium ${
                                        darkMode
                                            ? "text-cream/70 hover:text-gold hover:bg-cream/5"
                                            : "text-brand-indigo/60 hover:text-brand-indigo hover:bg-brand-indigo/[0.04]"
                                    }`}
                                >
                                    {t(NAV_KEYS[id])}
                                </a>
                            ))}
                        </div>
                        <Link
                            href="/realizacie"
                            className={`relative px-5 py-2.5 text-sm uppercase tracking-[0.15em] rounded-full transition-all duration-200 font-medium ${
                                darkMode
                                    ? "text-cream/70 hover:text-gold hover:bg-cream/5"
                                    : "text-brand-indigo/60 hover:text-brand-indigo hover:bg-brand-indigo/[0.04]"
                            }`}
                        >
                            {t("nav.work")}
                        </Link>
                        <Link
                            href="/cennik"
                            className={`relative px-5 py-2.5 text-sm uppercase tracking-[0.15em] rounded-full transition-all duration-200 font-medium ${
                                darkMode
                                    ? "text-cream/70 hover:text-gold hover:bg-cream/5"
                                    : "text-brand-indigo/60 hover:text-brand-indigo hover:bg-brand-indigo/[0.04]"
                            }`}
                        >
                            {t("nav.pricing")}
                        </Link>
                        <div className={`w-px h-6 mx-3 ${darkMode ? "bg-cream/15" : "bg-brand-indigo/10"}`} />
                        {isHome ? (
                            <button
                                onClick={(e) => handleScroll(e, "contact")}
                                className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-[0.15em] uppercase transition-all shadow-lg ${
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
                                className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-[0.15em] uppercase transition-all shadow-lg ${
                                    darkMode
                                        ? "bg-gold text-ink hover:bg-gold-bright shadow-black/20"
                                        : "bg-brand-indigo text-white hover:bg-brand-indigo/90 shadow-brand-indigo/10 hover:shadow-brand-indigo/20"
                                }`}
                            >
                                {t("nav.contact")}
                            </Link>
                        )}
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
