"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollToPlugin);
}

const navItems = ["Services", "About"];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

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

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, id: string) => {
        e.preventDefault();
        setIsOpen(false);

        const element = document.getElementById(id);
        if (element) {
            gsap.to(window, {
                duration: 2.5,
                scrollTo: { y: element, offsetY: 10 },
                ease: "power4.inOut"
            });
        }
    };

    return (
        <>
            {/* ── Main Nav ── */}
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
                className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
                    scrolled
                        ? "py-3 bg-white/70 backdrop-blur-2xl border-b border-brand-indigo/[0.06] shadow-[0_1px_30px_rgba(28,31,58,0.04)]"
                        : "py-5 bg-transparent"
                }`}
            >
                <div className="container mx-auto flex justify-between items-center">
                    <Link
                        href="/"
                        onClick={(e) => {
                            e.preventDefault();
                            setIsOpen(false);
                            gsap.to(window, { duration: 2.5, scrollTo: { y: 0 }, ease: "power4.inOut" });
                        }}
                        className="z-[110] relative flex items-center"
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

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-1" onMouseLeave={() => setHoveredItem(null)}>
                        <div className="flex items-center">
                            {navItems.map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    onClick={(e) => handleScroll(e, item.toLowerCase())}
                                    onMouseEnter={() => setHoveredItem(item)}
                                    className="relative px-5 py-2.5 text-sm uppercase tracking-[0.15em] text-brand-indigo/60 hover:text-brand-indigo transition-colors cursor-pointer font-medium"
                                >
                                    {hoveredItem === item && (
                                        <motion.div
                                            layoutId="navHover"
                                            className="absolute inset-0 bg-brand-indigo/[0.04] rounded-full -z-10"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                                        />
                                    )}
                                    {item}
                                </a>
                            ))}
                        </div>

                        <div className="w-px h-6 bg-brand-indigo/10 mx-3" />

                        <button
                            onClick={(e) => handleScroll(e, "contact")}
                            className="px-6 py-2.5 bg-brand-indigo text-white rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:bg-brand-indigo/90 transition-all shadow-lg shadow-brand-indigo/10 hover:shadow-brand-indigo/20"
                        >
                            Contact
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
                            {navItems.map((item, i) => (
                                <div key={item} className="overflow-hidden w-full flex justify-center">
                                    <motion.a
                                        href={`#${item.toLowerCase()}`}
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
                                        onClick={(e) => handleScroll(e, item.toLowerCase())}
                                        className="text-5xl font-display font-bold tracking-tighter text-brand-indigo hover:text-brand-indigo/60 transition-colors cursor-pointer"
                                    >
                                        {item}
                                    </motion.a>
                                </div>
                            ))}

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
                                    Contact
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
