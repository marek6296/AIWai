"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/i18n/useTranslation";

export default function Footer() {
    const { t } = useTranslation();

    const navLinks = [
        { label: t("footer.nav.home"), href: "/" },
        { label: t("footer.nav.services"), href: "/sluzby" },
        { label: t("footer.nav.work"), href: "/realizacie" },
        { label: t("footer.nav.pricing"), href: "/cennik" },
        { label: t("footer.nav.about"), href: "/#about" },
        { label: t("footer.nav.contact"), href: "/#contact" },
    ];

    const serviceLinks = [
        { label: t("footer.service.web"), href: "/sluzby/tvorba-webu" },
        { label: t("footer.service.chatbot"), href: "/sluzby/ai-chatbot" },
        { label: t("footer.service.automation"), href: "/sluzby/ai-automatizacia" },
        { label: t("footer.service.branding"), href: "/sluzby/logo-branding" },
        { label: t("footer.service.social"), href: "/sluzby/sprava-socialnych-sieti" },
    ];

    return (
        <footer className="bg-char relative overflow-hidden border-t border-cream/5">
            {/* Subtle ambient glow */}
            <div aria-hidden="true" className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(ellipse, rgba(201,168,117,0.10) 0%, transparent 70%)" }} />
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none gold-vlines opacity-30" />
            <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

            <div className="container mx-auto px-6 py-12 md:py-20 relative z-10">
                {/* Main grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-8 mb-10 md:mb-14">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Image
                                src="/logo.png"
                                alt="AIWai Logo"
                                width={40}
                                height={40}
                                className="object-contain opacity-90"
                            />
                            <span className="text-xl font-display font-bold text-cream">AIWai</span>
                        </div>
                        <p className="text-cream/45 text-sm font-light leading-relaxed max-w-[220px]">
                            {t("footer.tagline")}
                        </p>
                        <div className="mt-5 space-y-1.5">
                            <a href="mailto:marek@aiwai.app" className="text-cream/50 hover:text-gold transition-colors text-sm block">
                                marek@aiwai.app
                            </a>
                            <a href="tel:+421902876198" className="text-cream/50 hover:text-gold transition-colors text-sm block">
                                +421 902 876 198
                            </a>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold/70 mb-5">{t("footer.section.nav")}</p>
                        <ul className="space-y-3">
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-cream/55 hover:text-gold transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold/70 mb-5">{t("footer.section.services")}</p>
                        <ul className="space-y-3">
                            {serviceLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-cream/55 hover:text-gold transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal + Social */}
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold/70 mb-5">{t("footer.section.follow")}</p>
                        <div className="flex items-center gap-4 mb-8">
                            {/* Facebook */}
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                                className="w-9 h-9 rounded-full border border-cream/15 flex items-center justify-center text-cream/40 hover:border-gold hover:text-gold hover:bg-gold/5 transition-all duration-200">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                            </a>
                            {/* Instagram */}
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                                className="w-9 h-9 rounded-full border border-cream/15 flex items-center justify-center text-cream/40 hover:border-gold hover:text-gold hover:bg-gold/5 transition-all duration-200">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                            </a>
                            {/* LinkedIn */}
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                                className="w-9 h-9 rounded-full border border-cream/15 flex items-center justify-center text-cream/40 hover:border-gold hover:text-gold hover:bg-gold/5 transition-all duration-200">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                            </a>
                        </div>

                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold/70 mb-4">{t("footer.section.legal")}</p>
                        <ul className="space-y-2.5">
                            <li>
                                <Link href="/ochrana-osobnych-udajov" className="text-cream/50 hover:text-gold transition-colors text-sm">
                                    {t("footer.legal.privacy")}
                                </Link>
                            </li>
                            <li>
                                <Link href="/obchodne-podmienky" className="text-cream/50 hover:text-gold transition-colors text-sm">
                                    {t("footer.legal.terms")}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-6 md:pt-8 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                    <p className="text-cream/30 text-[11px] tracking-wide">
                        &copy; {new Date().getFullYear()} AIWai. {t("footer.copyright")}
                    </p>
                    <p className="text-cream/25 text-[11px]">
                        {t("footer.country")} · {t("footer.ico")}
                    </p>
                </div>
            </div>
        </footer>
    );
}
