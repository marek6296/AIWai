"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import NewsCard from "./NewsCard";
import FadeIn from "@/components/animations/FadeIn";
import { useTranslation } from "@/i18n/useTranslation";

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
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const sectionRef = useRef<HTMLElement>(null);
    const fetchedRef = useRef(false);

    // Fetch only when section scrolls into view (300 px before).
    // Dynamic import of supabasePartner keeps the ~194 KB Supabase bundle
    // out of the initial JS payload — it loads on demand here.
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const fetchNews = async () => {
            try {
                const { supabasePartner } = await import("@/lib/supabasePartner");
                if (!supabasePartner) { setLoading(false); return; }
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

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !fetchedRef.current) {
                fetchedRef.current = true;
                observer.disconnect();
                fetchNews();
            }
        }, { rootMargin: "300px" });

        observer.observe(section);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="aiwai-news"
            className="relative py-12 md:py-16 overflow-hidden"
        >
            <div className="absolute inset-0 bg-[#000000]" />
            <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-brand-sand/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 mb-12">
                    {/* Left: Text */}
                    <FadeIn className="max-w-xl space-y-6 text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-3">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-sand opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-sand" />
                            </span>
                            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-sand/80">
                                {t("news.badge")}
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-[1.1] tracking-tight">
                            {t("news.heading")}
                        </h2>
                        <p className="text-lg text-white/40 font-light leading-relaxed max-w-lg">
                            {t("news.subheading")}
                        </p>
                    </FadeIn>

                    {/* Right: Preview image */}
                    <FadeIn className="relative w-full lg:w-1/2 flex justify-center lg:justify-end" delay={0.1}>
                        <a
                            href="https://aiwai.news"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block relative group rounded-3xl overflow-hidden border border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] max-w-full hover:-translate-y-1 transition-transform duration-400"
                        >
                            <Image
                                src="/partner-preview.png"
                                alt="AIWai News Portal Preview"
                                width={650}
                                height={450}
                                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                loading="lazy"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 650px"
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-brand-indigo/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                <div className="px-8 py-3 bg-white text-brand-indigo rounded-full text-[11px] font-bold uppercase tracking-widest shadow-2xl">
                                    {t("news.viewAll")}
                                </div>
                            </div>
                        </a>
                    </FadeIn>
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {loading ? (
                        [1, 2, 3].map((i) => (
                            <div key={i} className="h-[400px] rounded-2xl bg-white/5 animate-pulse" />
                        ))
                    ) : (
                        articles.map((article, i) => (
                            <FadeIn key={article.id} delay={i * 0.07} className="h-full">
                                <NewsCard article={article} />
                            </FadeIn>
                        ))
                    )}
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/0 to-transparent pointer-events-none" />
        </section>
    );
}
