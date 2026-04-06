"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { supabasePartner } from "@/lib/supabasePartner";
import NewsCard from "./NewsCard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "@/i18n/useTranslation";

gsap.registerPlugin(ScrollTrigger);

interface Article {
    id: string;
    title: string;
    excerpt: string;
    slug: string;
    main_image: string;
    category: string;
    published_at: string;
}

export default function NewsSection() {
    const { t } = useTranslation();
    const sectionRef = useRef<HTMLElement>(null);
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            if (!supabasePartner) {
                console.warn("Partner Supabase client not initialized. Check credentials.");
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabasePartner
                    .from("articles")
                    .select("*")
                    .eq("status", "published")
                    .order("published_at", { ascending: false })
                    .limit(3);

                if (error) throw error;
                setArticles(data || []);
            } catch (err) {
                console.error("Error fetching partner news:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    useEffect(() => {
        if (!loading && sectionRef.current) {
            const ctx = gsap.context(() => {
                gsap.from(".news-fade", {
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                    },
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power2.out",
                });
            }, sectionRef.current);
            return () => ctx.revert();
        }
    }, [loading]);

    return (
        <section 
            ref={sectionRef}
            className="relative py-12 md:py-16 bg-brand-indigo overflow-hidden"
        >
            {/* ── Visual Background Elements ── */}
            <div className="absolute inset-0 bg-[#000000]" />
            <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-brand-sand/5 rounded-full blur-[80px] pointer-events-none" />
            
            {/* ── Content ── */}
            <div className="relative z-10 container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 mb-12 min-h-[300px]">
                    {/* Left: Text Content - Centered vertically with image */}
                    <div className="max-w-xl space-y-6 text-center lg:text-left flex flex-col justify-center">
                        <div className="news-fade flex items-center justify-center lg:justify-start gap-3">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-sand opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-sand"></span>
                            </span>
                            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-sand/80">
                                {t("news.badge")}
                            </span>
                        </div>
                        
                        <h2 className="news-fade text-4xl md:text-5xl font-display font-bold text-white leading-[1.1] tracking-tight">
                            {t("news.heading")}
                        </h2>
                        
                        <p className="news-fade text-lg text-white/40 font-light leading-relaxed max-w-lg">
                            {t("news.subheading")}
                        </p>
                    </div>

                    {/* Right: Clickable Preview Image - Large and Premium */}
                    <motion.div 
                        className="news-fade relative w-full lg:w-1/2 flex justify-center lg:justify-end"
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        <a
                            href="https://aiwai.news"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block relative group rounded-3xl overflow-hidden border border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] max-w-full"
                        >
                            <Image
                                src="/partner-preview.png"
                                alt="AIWai News Portal Preview"
                                width={650}
                                height={450}
                                className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105"
                                priority
                            />
                            {/* Sophisticated Glow on hover */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-brand-indigo/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                <div className="px-8 py-3 bg-white text-brand-indigo rounded-full text-[11px] font-bold uppercase tracking-widest shadow-2xl">
                                    {t("news.viewAll")}
                                </div>
                            </div>
                        </a>
                    </motion.div>
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {loading ? (
                        [1, 2, 3].map((i) => (
                            <div key={i} className="h-[400px] rounded-2xl bg-white/5 animate-pulse" />
                        ))
                    ) : (
                        articles.map((article) => (
                            <div key={article.id} className="news-fade h-full">
                                <NewsCard article={article} />
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* ── Bottom Section Fade ── */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/0 to-transparent pointer-events-none" />
        </section>
    );
}
