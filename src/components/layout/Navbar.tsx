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
                    <div className="hidden md:flex items-center gap-2" onMouseLeave={() => setHoveredItem(null)}>
                        {["Services", "About", "Work", "Contact"].map((item) => (
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
                        initial={{ opacity: 0, y: "-100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "-100%" }}
                        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                        className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center gap-8"
                    >
                        {["Services", "About", "Work", "Contact"].map((item, i) => (
                            <motion.a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                onClick={(e) => handleScroll(e, item.toLowerCase())}
                                className="text-4xl font-light text-brand-indigo hover:text-brand-indigo/70 transition-colors cursor-pointer"
                            >
                                {item}
                            </motion.a>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
