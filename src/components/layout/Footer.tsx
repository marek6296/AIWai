import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white relative overflow-hidden">
            {/* Top gradient border */}
            <div className="h-px bg-gradient-to-r from-transparent via-brand-indigo/10 to-transparent" />

            <div className="container mx-auto py-12 md:py-16 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                    <div className="mb-8 md:mb-0 flex items-center gap-4">
                        <Image
                            src="/logo.png"
                            alt="AIWai Logo"
                            width={48}
                            height={48}
                            className="object-contain opacity-70"
                        />
                        <div className="text-left">
                            <h2 className="text-xl font-display font-bold text-brand-indigo leading-none">AIWai</h2>
                            <p className="text-brand-indigo/40 text-xs mt-1 tracking-wide">Intelligent Digital Architecture</p>
                            <a href="mailto:dony.jaij.sk@gmail.com" className="text-brand-indigo/30 hover:text-brand-indigo transition-colors text-[11px] block mt-2">dony.jaij.sk@gmail.com</a>
                            <a href="tel:+421902076186" className="text-brand-indigo/30 hover:text-brand-indigo transition-colors text-[11px] block mt-0.5">+421 902 076 186</a>
                        </div>
                    </div>

                    <div className="flex gap-5">
                        <Link href="#" className="text-brand-indigo/20 hover:text-brand-indigo/60 transition-colors"><Twitter size={18} /></Link>
                        <Link href="#" className="text-brand-indigo/20 hover:text-brand-indigo/60 transition-colors"><Github size={18} /></Link>
                        <Link href="#" className="text-brand-indigo/20 hover:text-brand-indigo/60 transition-colors"><Linkedin size={18} /></Link>
                    </div>
                </div>

                <div className="text-center md:text-left text-brand-indigo/15 text-[11px] tracking-wide">
                    &copy; {new Date().getFullYear()} AIWai. All rights reserved.
                </div>
            </div>

            {/* Background glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-brand-indigo/[0.02] blur-[100px] pointer-events-none" />
        </footer>
    );
}
