import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-brand-indigo/5 py-12 relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div className="mb-6 md:mb-0 flex items-center gap-4">
                        <Image
                            src="/logo.png"
                            alt="AIWai Logo"
                            width={60}
                            height={60}
                            className="object-contain opacity-80"
                        />
                        <div className="text-left">
                            <h2 className="text-2xl font-bold text-brand-indigo mb-0 leading-none">AIWai</h2>
                            <p className="text-brand-indigo/60 text-sm mt-1">Intelligent Digital Architecture</p>
                            <a href="mailto:dony.jaij.sk@gmail.com" className="text-brand-indigo/40 hover:text-brand-indigo transition-colors text-xs block mt-2">dony.jaij.sk@gmail.com</a>
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <Link href="#" className="text-brand-indigo/40 hover:text-brand-indigo transition-colors"><Twitter size={20} /></Link>
                        <Link href="#" className="text-brand-indigo/40 hover:text-brand-indigo transition-colors"><Github size={20} /></Link>
                        <Link href="#" className="text-brand-indigo/40 hover:text-brand-indigo transition-colors"><Linkedin size={20} /></Link>
                    </div>
                </div>

                <div className="text-center md:text-left text-brand-indigo/20 text-xs">
                    &copy; {new Date().getFullYear()} AIWai. All rights reserved.
                </div>
            </div>

            {/* Background glow - subtle for light theme */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-brand-indigo/5 blur-[100px] pointer-events-none" />
        </footer>
    );
}
