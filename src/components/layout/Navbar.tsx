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

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, id: string) => {
        e.preventDefault();
        setIsOpen(false);
        // Debugging
        console.log("Scrolling to:", id);


        const element = document.getElementById(id);
        if (element) {
            // Offset 0 allows the navbar to cover the top padding of the section, 
            // placing the Heading (which is inside padding) closer to the visible top.
            // If the navbar is ~65px scrolled, and padding is 96px, 
            // Offset 0 means we see 31px gap above heading. Ideally balanced.
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
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-4 bg-white/80 backdrop-blur-md border-b border-brand-indigo/5" : "py-4 bg-transparent"
                    }`}
            >
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <Link
                        href="/"
                        onClick={(e) => {
                            e.preventDefault();
                            gsap.to(window, { duration: 2.5, scrollTo: { y: 0 }, ease: "power4.inOut" });
                        }}
                        className="text-5xl font-bold tracking-tighter text-brand-indigo z-50 relative"
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
                            onClick={(e) => handleScroll(e as any, "contact")}
                            className="px-8 py-3 bg-brand-sand text-brand-indigo rounded-full text-sm font-bold tracking-widest uppercase hover:bg-brand-sand/80 transition-all shadow-lg hover:shadow-brand-sand/20 flex items-center gap-2 group"
                        >
                            Contact
                        </button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden z-50 text-brand-indigo relative"
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ clipPath: "circle(0% at 100% 0%)" }}
                        animate={{ clipPath: "circle(150% at 100% 0%)" }}
                        exit={{ clipPath: "circle(0% at 100% 0%)" }}
                        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                        onAnimationStart={() => {
                            document.body.style.overflow = "hidden";
                        }}
                        onAnimationComplete={(definition) => {
                            if (definition === "exit") {
                                document.body.style.overflow = "unset";
                            }
                        }}
                        className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center overflow-hidden"
                    >
                        {/* Background Decoration for Mobile Menu */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-indigo rounded-full blur-[120px]" />
                            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-indigo rounded-full blur-[120px]" />
                        </div>

                        <div className="flex flex-col items-center gap-10 relative z-10 w-full px-12">
                            {["Services", "About", "Projects"].map((item, i) => (
                                <div key={item} className="overflow-hidden w-full flex justify-center">
                                    <motion.a
                                        href={`#${item.toLowerCase()}`}
                                        initial={{ y: 80, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 50, opacity: 0 }}
                                        transition={{
                                            delay: 0.3 + i * 0.1,
                                            duration: 0.7,
                                            ease: [0.215, 0.61, 0.355, 1]
                                        }}
                                        onClick={(e) => handleScroll(e, item.toLowerCase())}
                                        className="text-5xl font-bold tracking-tighter text-brand-indigo hover:text-brand-indigo/60 transition-colors cursor-pointer"
                                    >
                                        {item}
                                    </motion.a>
                                </div>
                            ))}

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                className="w-full max-w-[280px]"
                            >
                                <button
                                    onClick={(e) => handleScroll(e as any, "contact")}
                                    className="w-full mt-6 px-12 py-5 bg-brand-sand text-brand-indigo rounded-full text-xl font-bold tracking-widest uppercase shadow-2xl active:scale-95 transition-transform"
                                >
                                    Contact
                                </button>
                            </motion.div>
                        </div>

                        {/* Social Links Footer in Menu */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="absolute bottom-12 flex gap-8 text-brand-indigo/30"
                        >
                            <span className="text-[10px] uppercase tracking-[0.3em]">AIWai Architecture</span>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
