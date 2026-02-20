"use client";
import React from "react";
import { motion } from "framer-motion";
import { Palette, Bot, Rocket } from "lucide-react";
import TiltCard from "@/components/ui/TiltCard";

const features = [
    {
        title: "Premium Design",
        description: "We don&apos;t just build websites. We craft visual experiences that captivate your audience and elevate your brand identity to a world-class level.",
        icon: <Palette size={40} className="text-brand-indigo" />
    },
    {
        title: "Intelligent Core",
        description: "Future-proof your business with AI-driven architecture. From smart automation to neural agents, we build systems that think and adapt.",
        icon: <Bot size={40} className="text-brand-indigo" />
    },
    {
        title: "Simplicity & Growth",
        description: "Complex technology, simplified for you. We focus on clean, scalable solutions that drive real engagement and measurable business results.",
        icon: <Rocket size={40} className="text-brand-indigo" />
    }
];

export default function WhyUsSection() {
    return (
        <section id="about" className="py-24 bg-white relative overflow-hidden">
            {/* Background Grid - Subtle */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(28,31,58,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(28,31,58,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-100 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-bold text-brand-indigo mb-6 tracking-tight">
                        Simpler. Smarter. <span className="text-brand-indigo/40 italic font-light">Better.</span>
                    </h2>
                    <p className="text-brand-indigo/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        We strip away the unnecessary noise. What remains is pure digital impact—combining aesthetic perfection with the raw power of artificial intelligence.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: i * 0.15, duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
                        >
                            <TiltCard className="h-full">
                                <div className="p-8 md:p-10 bg-brand-indigo/[0.02] border border-brand-indigo/5 hover:border-brand-indigo/20 transition-all duration-300 rounded-2xl group text-center md:text-left h-full shadow-sm hover:shadow-xl">
                                    <div className="mb-6 p-4 bg-white rounded-xl inline-block shadow-md group-hover:scale-110 transition-transform duration-300">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-brand-indigo mb-4 group-hover:text-brand-indigo/80 transition-colors">{feature.title}</h3>
                                    <p className="text-brand-indigo/60 leading-relaxed text-base group-hover:text-brand-indigo/80 transition-colors">
                                        {feature.description}
                                    </p>
                                </div>
                            </TiltCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
