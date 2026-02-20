"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollToPlugin);
}

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    useEffect(() => {
        const handleScrollState = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScrollState);
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
            const offset = 10;
            gsap.to(window, {
                duration: 2.5,
                scrollTo: {
                    y: element,
                    offsetY: offset
                },
                ease: "power4.inOut"
            });
        }
    };

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 transition-all duration-300 ${scrolled ? "py-4 bg-white/80 backdrop-blur-md border-b border-brand-indigo/5 z-[100]" : "py-4 bg-transparent z-[100]"
                    }`}
            >
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <Link
                        href="/"
                        onClick={(e) => {
                            e.preventDefault();
                            setIsOpen(false);
                            gsap.to(window, { duration: 2.5, scrollTo: { y: 0 }, ease: "power4.inOut" });
                        }}
                        className="text-5xl font-bold tracking-tighter text-brand-indigo z-[110] relative"
                    >
                        AIWai
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6" onMouseLeave={() => setHoveredItem(null)}>
                        <div className="flex items-center gap-2">
                            {["Services", "About", "Projects"].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    onClick={(e) => handleScroll(e, item.toLowerCase())}
                                    onMouseEnter={() => setHoveredItem(item)}
                                    className="relative px-6 py-2 text-lg uppercase tracking-widest text-brand-indigo/70 hover:text-brand-indigo transition-colors cursor-pointer"
                                >
                                    {hoveredItem === item && (
                                        <motion.div
                                            layoutId="hoverBackground"
                                            className="absolute inset-0 bg-brand-indigo/5 rounded-full -z-10"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    {item}
                                </a>
                            ))}
                        </div>

                        <button
                            onClick={(e) => handleScroll(e, "contact")}
                            className="px-8 py-3 bg-brand-sand text-brand-indigo rounded-full text-sm font-bold tracking-widest uppercase hover:bg-brand-sand/80 transition-all shadow-lg hover:shadow-brand-sand/20 flex items-center gap-2 group"
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
                        {isOpen ? <X size={32} /> : <Menu size={32} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence mode="wait">
                {isOpen && (
                    <motion.div
                        variants={{
                            initial: {
                                clipPath: "circle(0% at 90% 5%)",
                                opacity: 0
                            },
                            animate: {
                                clipPath: "circle(150% at 90% 5%)",
                                opacity: 1,
                                transition: {
                                    duration: 0.8,
                                    ease: [0.76, 0, 0.24, 1]
                                }
                            },
                            exit: {
                                clipPath: "circle(0% at 90% 5%)",
                                opacity: 0,
                                transition: {
                                    duration: 0.6,
                                    ease: [0.76, 0, 0.24, 1],
                                    delay: 0.2 // Give items time to exit
                                }
                            }
                        }}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="fixed inset-0 z-[90] bg-white flex flex-col items-center justify-center overflow-hidden"
                        style={{ willChange: "clip-path" }}
                    >
                        {/* Background Decoration for Mobile Menu - Slightly subtle */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand-indigo rounded-full blur-[120px]" />
                            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand-indigo rounded-full blur-[120px]" />
                        </div>

                        <div className="flex flex-col items-center gap-10 relative z-10 w-full px-12">
                            {["Services", "About", "Projects"].map((item, i) => (
                                <div key={item} className="overflow-hidden w-full flex justify-center">
                                    <motion.a
                                        href={`#${item.toLowerCase()}`}
                                        variants={{
                                            initial: { y: 80, opacity: 0 },
                                            animate: {
                                                y: 0,
                                                opacity: 1,
                                                transition: {
                                                    delay: 0.4 + i * 0.1,
                                                    duration: 0.7,
                                                    ease: [0.215, 0.61, 0.355, 1]
                                                }
                                            },
                                            exit: {
                                                y: 40,
                                                opacity: 0,
                                                transition: {
                                                    duration: 0.4,
                                                    ease: [0.215, 0.61, 0.355, 1]
                                                }
                                            }
                                        }}
                                        onClick={(e) => handleScroll(e, item.toLowerCase())}
                                        className="text-5xl font-bold tracking-tighter text-brand-indigo hover:text-brand-indigo/60 transition-colors cursor-pointer"
                                    >
                                        {item}
                                    </motion.a>
                                </div>
                            ))}

                            <motion.div
                                variants={{
                                    initial: { opacity: 0, y: 30 },
                                    animate: {
                                        opacity: 1,
                                        y: 0,
                                        transition: { delay: 0.7, duration: 0.5 }
                                    },
                                    exit: {
                                        opacity: 0,
                                        y: 20,
                                        transition: { duration: 0.3 }
                                    }
                                }}
                                className="w-full max-w-[280px]"
                            >
                                <button
                                    onClick={(e) => handleScroll(e, "contact")}
                                    className="w-full mt-6 px-12 py-5 bg-brand-sand text-brand-indigo rounded-full text-xl font-bold tracking-widest uppercase shadow-2xl active:scale-95 transition-transform"
                                >
                                    Contact
                                </button>
                            </motion.div>
                        </div>

                        {/* Social Links Footer in Menu */}
                        <motion.div
                            variants={{
                                initial: { opacity: 0 },
                                animate: { opacity: 1, transition: { delay: 0.9 } },
                                exit: { opacity: 0, transition: { duration: 0.2 } }
                            }}
                            className="absolute bottom-12 flex flex-col items-center gap-2 text-brand-indigo/30"
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
