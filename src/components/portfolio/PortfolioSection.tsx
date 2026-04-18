"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";

const projects = [
    { id: 1, title: "AI Agents", category: "Autonomous digital workers that handle complex workflows 24/7.", video: "/intro.mp4" },
    { id: 2, title: "AI Chatbots", category: "Intelligent conversational interfaces that understand context and nuance.", video: "https://videos.pexels.com/video-files/3205917/3205917-hd_1280_720_25fps.mp4" },
    { id: 3, title: "Automation", category: "Seamless integration of AI into your existing business infrastructure.", video: "https://videos.pexels.com/video-files/5829676/5829676-hd_1280_720_30fps.mp4" },
    { id: 4, title: "Design & Graphics", category: "Stunning visuals and UI/UX design that captivate your audience.", video: "https://videos.pexels.com/video-files/3163534/3163534-hd_1920_1080_30fps.mp4" },
];

export default function PortfolioSection() {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const selected = projects.find((p) => p.id === selectedId) ?? null;

    return (
        <section id="projects" className="py-28 md:py-36 bg-white relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-indigo/10 to-transparent" />

            <div className="container mx-auto">
                <FadeIn className="mb-16 md:mb-20">
                    <h2 className="text-4xl md:text-6xl font-display font-bold text-brand-indigo tracking-tight">Selected Projects</h2>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {projects.map((project, i) => (
                        <FadeIn key={project.id} delay={i * 0.1}>
                            <div
                                onClick={() => setSelectedId(project.id)}
                                className="group relative aspect-video bg-brand-indigo cursor-pointer overflow-hidden rounded-2xl border border-brand-indigo/[0.06]"
                            >
                                <video src={project.video} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 ease-out" />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-indigo/80 via-brand-indigo/20 to-transparent group-hover:from-brand-indigo/60 transition-all duration-500 flex flex-col justify-end p-8">
                                    <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">{project.title}</h3>
                                    <p className="text-white/60 text-sm translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-75 line-clamp-2 max-w-md">{project.category}</p>
                                </div>
                                <div className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-white/10 transition-all duration-500 pointer-events-none" />
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>

            {/* Expanded View */}
            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-brand-indigo/80 backdrop-blur-xl">
                    <div className="absolute inset-0" onClick={() => setSelectedId(null)} />
                    <div className="relative w-full max-w-4xl bg-white/95 backdrop-blur-2xl border border-white/30 overflow-hidden shadow-[0_30px_100px_-20px_rgba(28,31,58,0.3)] rounded-2xl" style={{ animation: "adminCardReveal 0.25s ease both" }}>
                        <button onClick={() => setSelectedId(null)} className="absolute top-4 right-4 text-brand-indigo z-20 bg-white/90 p-2.5 rounded-xl hover:bg-white transition-colors border border-brand-indigo/5">
                            <X size={20} />
                        </button>
                        <div className="aspect-video bg-brand-indigo relative">
                            <video src={selected.video} autoPlay loop muted controls playsInline className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-brand-indigo/80 via-brand-indigo/40 to-transparent pointer-events-none">
                                <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">{selected.title}</h3>
                                <p className="text-white/70">{selected.category}</p>
                            </div>
                        </div>
                        <div className="p-8 text-brand-indigo/60">
                            <p>Detailed project description would go here. Showcasing the challenges, AI implementation, and results.</p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
