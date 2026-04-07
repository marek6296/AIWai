"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";
import Image from "next/image";

interface Article {
    id: string;
    title: string;
    excerpt: string;
    slug: string;
    main_image: string;
    category: string;
    published_at: string;
}

export default function NewsCard({ article }: { article: Article }) {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="group relative h-full flex flex-col bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-300 hover:border-brand-sand/30 hover:bg-white/[0.05] translate-z-0"
        >
            {/* ── Image Wrapper ── */}
            <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                    src={article.main_image || "/placeholder-news.jpg"}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* ── Category Badge ── */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-brand-sand/30 border border-brand-sand/40 text-[10px] font-bold uppercase tracking-wider text-brand-sand">
                    {article.category}
                </div>
            </div>

            {/* ── Content ── */}
            <div className="flex-1 p-6 flex flex-col">
                <div className="mb-2 text-[10px] font-medium text-white/40 uppercase tracking-widest">
                    {new Date(article.published_at).toLocaleDateString()}
                </div>
                
                <h3 className="text-xl font-display font-semibold text-white mb-3 line-clamp-2 leading-tight group-hover:text-brand-sand transition-colors">
                    {article.title}
                </h3>
                
                <p className="text-sm text-white/50 line-clamp-3 mb-6 font-light leading-relaxed">
                    {article.excerpt}
                </p>

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                    <a
                        href={`https://aiwai.news/article/${article.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-brand-sand transition-colors"
                    >
                        {t("news.readMore")}
                        <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                </div>
            </div>

            {/* ── Decorative Gold border highlight on hover ── */}
            <div className="absolute inset-0 border-2 border-brand-sand/0 rounded-2xl pointer-events-none transition-colors duration-300 group-hover:border-brand-sand/10" />
        </motion.div>
    );
}
