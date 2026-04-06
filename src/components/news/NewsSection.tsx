"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
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
            className="relative py-16 md:py-24 bg-brand-indigo overflow-hidden"
        >
            {/* ── Visual Background Elements ── */}
            <div className="absolute inset-0 bg-[#000000]" />
            <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-brand-sand/5 rounded-full blur-[80px] pointer-events-none" />
            
            {/* ── Content ── */}
            <div className="relative z-10 container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-16">
                    {/* Left: Text Content */}
                    <div className="max-w-xl space-y-4 text-center lg:text-left">
                        <div className="news-fade flex items-center justify-center lg:justify-start gap-2">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-sand opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-sand"></span>
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-sand">
                                {t("news.badge")}
                            </span>
                        </div>
                        
                        <h2 className="news-fade text-3xl md:text-4xl font-display font-bold text-white leading-tight">
                            {t("news.heading")}
                        </h2>
                        
                        <p className="news-fade text-base text-white/50 font-light leading-relaxed">
                            {t("news.subheading")}
                        </p>
                    </div>

                    {/* Right: Clickable Preview Image */}
                    <motion.div 
                        className="news-fade relative w-full max-w-[500px]"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <a
                            href="https://aiwai.news"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50"
                        >
                            <Image
                                src="/partner-preview.png"
                                alt="AIWai News Portal Preview"
                                width={600}
                                height={400}
                                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-brand-indigo/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                <div className="px-6 py-2 bg-white text-brand-indigo rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl">
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
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/0 to-transparent pointer-events-none" />
        </section>
    );
}
