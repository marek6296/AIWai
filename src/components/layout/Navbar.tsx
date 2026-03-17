"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
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

export default function Navbar() {
    const { t, lang, setLang } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [langOpen, setLangOpen] = useState(false);
    const langRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScrollState = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScrollState, { passive: true });
        return () => window.removeEventListener("scroll", handleScrollState);
    }, []);

    // Body lock for mobile menu
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
            document.documentElement.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
            document.documentElement.style.overflow = "unset";
        };
    }, [isOpen]);

    // Close language dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (langRef.current && !langRef.current.contains(e.target as Node)) {
                setLangOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Smooth scroll via Lenis — centers the section vertically in the viewport
    const scrollToSection = useCallback((id: string) => {
        const element = document.getElementById(id);
        if (!element) return;

        const vh = window.innerHeight;
        const elH = element.offsetHeight;
        const navbarH = 72;

        const offset = elH < vh - navbarH
            ? -Math.round((vh - elH) / 2)
            : -navbarH;

        const lenis = (window as unknown as { __lenis?: { scrollTo: (target: Element, opts: object) => void } }).__lenis;
        if (lenis) {
            lenis.scrollTo(element, { offset, duration: 1.2 });
        } else {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, []);

    const handleScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, id: string) => {
        e.preventDefault();
        setIsOpen(false);
        setTimeout(() => scrollToSection(id), 50);
    }, [scrollToSection]);

    return (
        <>
            {/* ── Main Nav ── */}
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
                className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled
                        ? "py-3 bg-white/70 backdrop-blur-md border-b border-brand-indigo/[0.06] shadow-[0_1px_30px_rgba(28,31,58,0.04)]"
                        : "py-5 bg-transparent"
                    }`}
            >
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3 z-[110]">
                        <Link
                            href="/"
                            onClick={(e) => {
                                e.preventDefault();
                                setIsOpen(false);
                                scrollToSection("__top");
                                const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number, opts: object) => void } }).__lenis;
                                if (lenis) lenis.scrollTo(0, { duration: 1.2 });
                                else window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="relative flex items-center"
                        >
                            <Image
                                src="/logo.png"
                                alt="AIWai"
                                width={52}
                                height={52}
                                className="w-12 h-12 object-contain mix-blend-multiply"
                                priority
                            />
                        </Link>

                        {/* Language Switcher Dropdown */}
                        <div className="relative" ref={langRef}>
                            <button
                                onClick={() => setLangOpen(!langOpen)}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-brand-indigo/5 transition-all"
                            >
                                <span className="text-base">{LANGS.find((l) => l.code === lang)?.flag}</span>
                                <svg className={`w-3 h-3 text-brand-indigo/40 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            <AnimatePresence>
                                {langOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -5, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute top-full left-0 mt-1 bg-white/90 backdrop-blur-xl border border-brand-indigo/10 rounded-xl shadow-lg shadow-brand-indigo/5 overflow-hidden"
                                    >
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
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-1" onMouseLeave={() => setHoveredItem(null)}>
                        <div className="flex items-center">
                            {NAV_IDS.map((id) => (
                                <a
                                    key={id}
                                    href={`#${id}`}
                                    onClick={(e) => handleScroll(e, id)}
                                    onMouseEnter={() => setHoveredItem(id)}
                                    className="relative px-5 py-2.5 text-sm uppercase tracking-[0.15em] text-brand-indigo/60 hover:text-brand-indigo transition-colors cursor-pointer font-medium"
                                >
                                    {hoveredItem === id && (
                                        <motion.div
                                            layoutId="navHover"
                                            className="absolute inset-0 bg-brand-indigo/[0.04] rounded-full -z-10"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                                        />
                                    )}
                                    {t(NAV_KEYS[id])}
                                </a>
                            ))}
                        </div>

                        <div className="w-px h-6 bg-brand-indigo/10 mx-3" />

                        <button
                            onClick={(e) => handleScroll(e, "contact")}
                            className="px-6 py-2.5 bg-brand-indigo text-white rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:bg-brand-indigo/90 transition-all shadow-lg shadow-brand-indigo/10 hover:shadow-brand-indigo/20"
                        >
                            {t("nav.contact")}
                        </button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden z-[110] text-brand-indigo relative p-2"
                        aria-label="Toggle Menu"
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </motion.nav>

            {/* ── Mobile Menu ── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="mobile-menu"
                        variants={{
                            initial: {
                                clipPath: "circle(0% at 92% 4%)",
                                opacity: 0
                            },
                            animate: {
                                clipPath: "circle(150% at 92% 4%)",
                                opacity: 1,
                                transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] }
                            },
                            exit: {
                                clipPath: "circle(0% at 92% 4%)",
                                opacity: 0,
                                transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1], delay: 0.1 }
                            }
                        }}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="fixed inset-0 z-[90] bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden"
                        style={{ willChange: "clip-path, opacity" }}
                    >
                        {/* Background Orbs */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] bg-brand-sand/10 rounded-full blur-[100px]" />
                            <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] bg-brand-indigo/5 rounded-full blur-[100px]" />
                        </div>

                        <div className="flex flex-col items-center gap-10 relative z-10 w-full px-12">
                            {NAV_IDS.map((id, i) => (
                                <div key={id} className="overflow-hidden w-full flex justify-center">
                                    <motion.a
                                        href={`#${id}`}
                                        variants={{
                                            initial: { y: 60, opacity: 0 },
                                            animate: {
                                                y: 0,
                                                opacity: 1,
                                                transition: {
                                                    delay: 0.3 + i * 0.08,
                                                    duration: 0.6,
                                                    ease: [0.215, 0.61, 0.355, 1]
                                                }
                                            },
                                            exit: {
                                                y: 30,
                                                opacity: 0,
                                                transition: { duration: 0.3, ease: "easeIn" }
                                            }
                                        }}
                                        onClick={(e) => handleScroll(e, id)}
                                        className="text-5xl font-display font-bold tracking-tighter text-brand-indigo hover:text-brand-indigo/60 transition-colors cursor-pointer"
                                    >
                                        {t(NAV_KEYS[id])}
                                    </motion.a>
                                </div>
                            ))}

                            {/* Mobile Language Switcher */}
                            <motion.div
                                variants={{
                                    initial: { opacity: 0, y: 30 },
                                    animate: { opacity: 1, y: 0, transition: { delay: 0.45, duration: 0.5 } },
                                    exit: { opacity: 0, y: 10, transition: { duration: 0.2 } }
                                }}
                                className="flex items-center gap-3"
                            >
                                {LANGS.map((l) => (
                                    <button
                                        key={l.code}
                                        onClick={() => { setLang(l.code); setIsOpen(false); }}
                                        className={`px-4 py-2.5 text-2xl rounded-xl transition-all ${lang === l.code
                                            ? "bg-brand-indigo/10 ring-2 ring-brand-indigo/20 scale-110"
                                            : "opacity-40 hover:opacity-80"
                                        }`}
                                    >
                                        {l.flag}
                                    </button>
                                ))}
                            </motion.div>

                            <motion.div
                                variants={{
                                    initial: { opacity: 0, y: 30 },
                                    animate: { opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.5 } },
                                    exit: { opacity: 0, y: 10, transition: { duration: 0.2 } }
                                }}
                                className="w-full max-w-[280px]"
                            >
                                <button
                                    onClick={(e) => handleScroll(e, "contact")}
                                    className="w-full mt-6 px-12 py-5 bg-brand-indigo text-white rounded-full text-xl font-bold tracking-widest uppercase shadow-2xl active:scale-95 transition-transform"
                                >
                                    {t("nav.contact")}
                                </button>
                            </motion.div>
                        </div>

                        <motion.div
                            variants={{
                                initial: { opacity: 0 },
                                animate: { opacity: 1, transition: { delay: 0.7 } },
                                exit: { opacity: 0, transition: { duration: 0.2 } }
                            }}
                            className="absolute bottom-12 flex flex-col items-center gap-2 text-brand-indigo/25"
                        >
                            <span className="text-[10px] uppercase tracking-[0.3em] font-bold" style={{ userSelect: 'none' }}>AIWai</span>
                            <span className="text-[10px] uppercase tracking-[0.1em]" style={{ userSelect: 'none' }}>Intelligent Digital Architecture</span>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
