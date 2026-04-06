"use client";

import { useEffect, useState, useRef } from "react";
import { supabasePartner } from "@/lib/supabasePartner";
import NewsCard from "./NewsCard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useTranslation } from "@/i18n/useTranslation";
import { ExternalLink } from "lucide-react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

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
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const sectionRef = useRef<HTMLElement>(null);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchNews = async () => {
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
        if (!loading && articles.length > 0) {
            const ctx = gsap.context(() => {
                gsap.from(".news-fade", {
                    y: 40,
                    opacity: 0,
                    duration: 1,
                    stagger: 0.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                    }
                });
            }, sectionRef);

            return () => ctx.revert();
        }
    }, [loading, articles]);

    return (
        <section 
            ref={sectionRef}
            className="relative py-24 md:py-32 bg-brand-indigo overflow-hidden"
        >
            {/* ── Visual Background Elements ── */}
            <div className="absolute inset-0 bg-[#000000]" />
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-sand/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-brand-sand/5 rounded-full blur-[100px] pointer-events-none" />

            {/* ── Content ── */}
            <div className="relative z-10 container mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="max-w-2xl space-y-4">
                        <div className="news-fade flex items-center gap-3">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-sand opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-sand"></span>
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-sand">
                                {t("news.badge")}
                            </span>
                        </div>
                        
                        <h2 className="news-fade text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight">
                            {t("news.heading")}
                        </h2>
                        
                        <p className="news-fade text-lg text-white/50 font-light leading-relaxed">
                            {t("news.subheading")}
                        </p>
                    </div>

                    <div className="news-fade">
                        <a
                            href="https://aiwai.news"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/5 hover:border-brand-sand/30 transition-all duration-300"
                        >
                            {t("news.viewAll")}
                            <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </a>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-[400px] rounded-2xl bg-white/5 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {articles.map((article) => (
                            <div key={article.id} className="news-fade h-full">
                                <NewsCard article={article} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Bottom Section Fade ── */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/0 to-transparent pointer-events-none" />
        </section>
    );
}
