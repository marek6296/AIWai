"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const projects = [
    {
        id: 1,
        title: "AI Agents",
        category: "Autonomous digital workers that handle complex workflows 24/7.",
        video: "/intro.mp4"
    },
    {
        id: 2,
        title: "AI Chatbots",
        category: "Intelligent conversational interfaces that understand context and nuance.",
        video: "https://videos.pexels.com/video-files/3205917/3205917-hd_1280_720_25fps.mp4"
    },
    {
        id: 3,
        title: "Automation",
        category: "Seamless integration of AI into your existing business infrastructure.",
        video: "https://videos.pexels.com/video-files/5829676/5829676-hd_1280_720_30fps.mp4"
    },
    {
        id: 4,
        title: "Design & Graphics",
        category: "Stunning visuals and UI/UX design that captivate your audience.",
        video: "https://videos.pexels.com/video-files/3163534/3163534-hd_1920_1080_30fps.mp4"
    },
];

export default function PortfolioSection() {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    return (
        <section id="projects" className="py-24 bg-white relative">
            <div className="container mx-auto px-6">
                <div className="mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-brand-indigo mb-6">Selected <span className="text-brand-indigo/60 lowercase italic font-light">Projects</span></h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.map((project) => (
                        <motion.div
                            layoutId={`project-${project.id}`}
                            key={project.id}
                            onClick={() => setSelectedId(project.id)}
                            className="group relative aspect-video bg-black border border-brand-indigo/5 cursor-pointer overflow-hidden rounded-xl"
                        >
                            {/* Video Background */}
                            <video
                                src={project.video}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 flex flex-col justify-end p-8">
                                <h3 className="text-2xl font-bold text-white mb-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{project.title}</h3>
                                <p className="text-white/80 text-sm translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75 line-clamp-2">{project.category}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Expanded View */}
            <AnimatePresence>
                {selectedId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-brand-indigo/90 backdrop-blur-sm">
                        {/* Close Background Click */}
                        <div className="absolute inset-0" onClick={() => setSelectedId(null)} />

                        <motion.div
                            layoutId={`project-${selectedId}`}
                            className="relative w-full max-w-4xl bg-white border border-brand-indigo/10 overflow-hidden shadow-2xl"
                        >
                            <button onClick={() => setSelectedId(null)} className="absolute top-4 right-4 text-brand-indigo z-20 bg-white/80 p-2 rounded-full hover:bg-white transition-colors border border-brand-indigo/10">
                                <X size={24} />
                            </button>

                            <div className="aspect-video bg-black relative">
                                {/* Expanded Video */}
                                {projects.find(p => p.id === selectedId) && (
                                    <video
                                        src={projects.find(p => p.id === selectedId)?.video}
                                        autoPlay
                                        loop
                                        muted // Expanded video could be unmuted, but for safety kept muted or add controls
                                        controls
                                        playsInline
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                )}

                                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none">
                                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">{projects.find(p => p.id === selectedId)?.title}</h3>
                                    <p className="text-white/80">{projects.find(p => p.id === selectedId)?.category}</p>
                                </div>
                            </div>

                            <div className="p-8 text-brand-indigo/80">
                                <p>Detailed project description would go here. Showcasing the challenges, AI implementation, and results.</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
