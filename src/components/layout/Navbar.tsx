"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import type { Lang } from "@/i18n/translations";

const NAV_IDS = ["aiwai-news", "services", "about"] as const;
const NAV_KEYS: Record<string, string> = {
    "aiwai-news": "nav.news",
    services: "nav.services",
    about: "nav.about",
};

const LANGS: { code: Lang; flag: string; label: string }[] = [
    { code: "en", flag: "🇬🇧", label: "EN" },
    { code: "sk", flag: "🇸🇰", label: "SK" },
    { code: "cs", flag: "🇨🇿", label: "CZ" },
];

const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

export default function Navbar() {
    const { t, lang, setLang } = useTranslation();
    const pathname = usePathname();
    const router = useRouter();
    const isHome = pathname === "/";
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const langRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Lock body scroll when menu is open
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

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

    const handleScroll = useCallback((e: React.MouseEvent, id: string) => {
        e.preventDefault();
        setIsOpen(false);
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
                    ? "py-3 bg-white/85 backdrop-blur-sm border-b border-brand-indigo/[0.06] shadow-[0_1px_30px_rgba(28,31,58,0.04)]"
                    : "py-5 bg-transparent"
            }`}>
                <div className="container mx-auto flex justify-between items-center">

                    {/* Logo + language */}
                    <div className="flex items-center gap-3 z-[110]">
                        <Link
                            href="/"
                            onClick={(e) => { if (isHome) { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); } }}
                            className="relative flex items-center"
                        >
                            <Image src="/logo.png" alt="AIWai" width={52} height={52} className="w-12 h-12 object-contain mix-blend-multiply" priority />
                        </Link>

                        {/* Language switcher */}
                        <div className="relative" ref={langRef}>
                            <button
                                onClick={() => setLangOpen(!langOpen)}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-brand-indigo/5 transition-colors"
                            >
                                <span className="text-base">{LANGS.find((l) => l.code === lang)?.flag}</span>
                                <svg className={`w-3 h-3 text-brand-indigo/40 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown — CSS visibility trick, no AnimatePresence */}
                            <div className={`absolute top-full left-0 mt-1 bg-white/95 backdrop-blur-md border border-brand-indigo/10 rounded-xl shadow-lg overflow-hidden transition-all duration-150 ${
                                langOpen ? "opacity-100 translate-y-0 visible pointer-events-auto" : "opacity-0 -translate-y-1 invisible pointer-events-none"
                            }`}>
                                {LANGS.filter((l) => l.code !== lang).map((l) => (
                                    <button
                                        key={l.code}
                                        onClick={() => { setLang(l.code); setLangOpen(false); }}
                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-brand-indigo/5 transition-colors"
                                    >
                                        <span className="text-base">{l.flag}</span>
                                        <span className="text-brand-indigo/60 text-xs font-medium uppercase">{l.label}</span>
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
                                    className="relative px-5 py-2.5 text-sm uppercase tracking-[0.15em] text-brand-indigo/60 hover:text-brand-indigo hover:bg-brand-indigo/[0.04] rounded-full transition-all duration-200 cursor-pointer font-medium"
                                >
                                    {t(NAV_KEYS[id])}
                                </a>
                            ))}
                        </div>
                        <Link
                            href="/cennik"
                            className="relative px-5 py-2.5 text-sm uppercase tracking-[0.15em] text-brand-indigo/60 hover:text-brand-indigo hover:bg-brand-indigo/[0.04] rounded-full transition-all duration-200 font-medium"
                        >
                            {t("nav.pricing")}
                        </Link>
                        <div className="w-px h-6 bg-brand-indigo/10 mx-3" />
                        {isHome ? (
                            <button
                                onClick={(e) => handleScroll(e, "contact")}
                                className="px-6 py-2.5 bg-brand-indigo text-white rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:bg-brand-indigo/90 transition-all shadow-lg shadow-brand-indigo/10 hover:shadow-brand-indigo/20"
                            >
                                {t("nav.contact")}
                            </button>
                        ) : (
                            <Link
                                href="/#contact"
                                className="px-6 py-2.5 bg-brand-indigo text-white rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:bg-brand-indigo/90 transition-all shadow-lg shadow-brand-indigo/10 hover:shadow-brand-indigo/20"
                            >
                                {t("nav.contact")}
                            </Link>
                        )}
                    </div>

                    {/* Mobile toggle — CSS icon swap */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden z-[110] text-brand-indigo p-2 relative w-9 h-9"
                        aria-label="Toggle Menu"
                        aria-expanded={isOpen}
                    >
                        <span className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${isOpen ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"}`}>
                            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none"><path d="M4 8H20M12 16H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                        </span>
                        <span className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"}`}>
                            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none"><path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                        </span>
                    </button>
                </div>
            </nav>

            {/* ── Mobile Menu — CSS opacity + visibility ── */}
            <div
                aria-hidden={!isOpen}
                className={`fixed inset-0 z-[90] bg-white flex flex-col items-center justify-center overflow-hidden transition-[opacity,visibility] duration-300 ease-in-out ${
                    isOpen ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"
                }`}
            >
                {/* Background orbs */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] bg-brand-sand/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] bg-brand-indigo/5 rounded-full blur-[100px]" />
                </div>

                <div className="flex flex-col items-center gap-10 relative z-10 w-full px-12">
                    {NAV_IDS.map((id, i) => (
                        <div key={id} className="overflow-hidden w-full flex justify-center">
                            <a
                                href={`#${id}`}
                                onClick={(e) => handleScroll(e, id)}
                                className="text-5xl font-display font-bold tracking-tighter text-brand-indigo hover:text-brand-indigo/60 transition-colors cursor-pointer"
                                style={{
                                    opacity: isOpen ? 1 : 0,
                                    transform: isOpen ? "translateY(0)" : "translateY(30px)",
                                    transition: `opacity 0.4s ease ${0.08 + i * 0.06}s, transform 0.4s ease ${0.08 + i * 0.06}s`,
                                }}
                            >
                                {t(NAV_KEYS[id])}
                            </a>
                        </div>
                    ))}

                    <div className="overflow-hidden w-full flex justify-center">
                        <Link
                            href="/cennik"
                            onClick={() => setIsOpen(false)}
                            className="text-5xl font-display font-bold tracking-tighter text-brand-indigo hover:text-brand-indigo/60 transition-colors"
                            style={{
                                opacity: isOpen ? 1 : 0,
                                transform: isOpen ? "translateY(0)" : "translateY(30px)",
                                transition: `opacity 0.4s ease ${0.08 + NAV_IDS.length * 0.06}s, transform 0.4s ease ${0.08 + NAV_IDS.length * 0.06}s`,
                            }}
                        >
                            {t("nav.pricing")}
                        </Link>
                    </div>

                    {/* Language switcher */}
                    <div
                        className="flex items-center gap-3"
                        style={{
                            opacity: isOpen ? 1 : 0,
                            transform: isOpen ? "translateY(0)" : "translateY(20px)",
                            transition: "opacity 0.4s ease 0.28s, transform 0.4s ease 0.28s",
                        }}
                    >
                        {LANGS.map((l) => (
                            <button
                                key={l.code}
                                onClick={() => { setLang(l.code); setIsOpen(false); }}
                                className={`px-4 py-2.5 text-2xl rounded-xl transition-all ${
                                    lang === l.code ? "bg-brand-indigo/10 ring-2 ring-brand-indigo/20 scale-110" : "opacity-40 hover:opacity-80"
                                }`}
                            >
                                {l.flag}
                            </button>
                        ))}
                    </div>

                    {/* CTA */}
                    <div
                        className="w-full max-w-[280px]"
                        style={{
                            opacity: isOpen ? 1 : 0,
                            transform: isOpen ? "translateY(0)" : "translateY(20px)",
                            transition: "opacity 0.4s ease 0.32s, transform 0.4s ease 0.32s",
                        }}
                    >
                        <button
                            onClick={(e) => handleScroll(e, "contact")}
                            className="w-full mt-6 px-12 py-5 bg-brand-indigo text-white rounded-full text-xl font-bold tracking-widest uppercase shadow-2xl active:scale-95 transition-transform"
                        >
                            {t("nav.contact")}
                        </button>
                    </div>
                </div>

                <div
                    className="absolute bottom-12 flex flex-col items-center gap-2 text-brand-indigo/25"
                    style={{
                        opacity: isOpen ? 1 : 0,
                        transition: "opacity 0.4s ease 0.45s",
                    }}
                >
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold select-none">AIWai</span>
                    <span className="text-[10px] uppercase tracking-[0.1em] select-none">Intelligent Digital Architecture</span>
                </div>
            </div>
        </>
    );
}
