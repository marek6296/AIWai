"use client";
import React from "react";
import ServiceCard from "@/components/services/ServiceCard";
import { Bot, BrainCircuit, Code2, Cpu, Palette, Sparkles } from "lucide-react";

const services = [
    { title: "AI Agents", description: "Autonomous digital workers that handle complex workflows 24/7.", icon: <Bot size={32} /> },
    { title: "AI Chatbots", description: "Intelligent conversational interfaces that understand context and nuance.", icon: <Sparkles size={32} /> },
    { title: "Automation", description: "Seamless integration of AI into your existing business infrastructure.", icon: <Cpu size={32} /> },
    { title: "Design & Graphics", description: "Stunning visuals and UI/UX design that captivate your audience.", icon: <Palette size={32} /> },
    { title: "Consulting", description: "Strategic guidance on navigating the AI landscape effectively.", icon: <BrainCircuit size={32} /> },
];

export default function ServicesSection() {
    return (
        <section id="services" className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-brand-indigo"><span className="text-brand-indigo/40 italic font-light">Intelligent</span> Services</h2>
                    <p className="text-brand-indigo/60 max-w-2xl mx-auto">
                        We build the neural network of your digitial presence.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-8 md:gap-12 pb-12">
                    {services.map((service, index) => (
                        <div key={index} className="relative">
                            <ServiceCard {...service} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
