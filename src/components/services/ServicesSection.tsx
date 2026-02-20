"use client";
import React, { useState } from "react";
import ServiceCard from "@/components/services/ServiceCard";
import ServiceModal from "@/components/services/ServiceModal";
import { Bot, BrainCircuit, Cpu, Palette, Sparkles } from "lucide-react";

const services = [
    {
        title: "AI Agents",
        description: "Autonomous digital workers that handle complex workflows 24/7.",
        icon: <Bot size={32} />,
        details: {
            whatIsIt: "AI Agents are sophisticated digital systems empowered to perform tasks and make decisions autonomously. Unlike simple bots, they can plan, execute multi-step workflows, and learn from their environment.",
            howItWorks: "We architect custom agents using LLMs (Large Language Models) integrated with your specific data. These agents use 'Chain of Thought' reasoning to break down complex tasks, access tools when needed, and verify their own outputs before completion.",
            includes: ["24/7 Autonomous Operation", "Tool & API Integration", "Self-Correction Capabilities", "Natural Language Processing", "Adaptive Learning", "Multi-Language Support"]
        }
    },
    {
        title: "AI Chatbots",
        description: "Intelligent conversational interfaces that understand context and nuance.",
        icon: <Sparkles size={32} />,
        details: {
            whatIsIt: "Our AI Chatbots are context-aware conversational partners that go beyond simple templates. They represent your brand's voice while providing instant, accurate, and human-like support to users.",
            howItWorks: "Using RAG (Retrieval Augmented Generation), our chatbots 'read' your documentation and knowledge base. When a user asks a question, the bot retrieves the relevant facts and generates a natural, helpful response based purely on your company's data.",
            includes: ["RAG Fact-Checking", "Dynamic Conversation Flow", "Natural Language Understanding", "Sentiment Analysis", "Lead Qualification", "Seamless CRM Sync"]
        }
    },
    {
        title: "Automation",
        description: "Seamless integration of AI into your existing business infrastructure.",
        icon: <Cpu size={32} />,
        details: {
            whatIsIt: "Business Process Automation (BPA) enhanced by AI transforms repetitive manual tasks into lightning-fast background processes. We connect your existing apps into an intelligent, self-driving ecosystem.",
            howItWorks: "We map your current business logic and identify bottlenecks. Then, we build custom 'bridges' between your tools (like Slack, CRM, Email) using AI to handle data interpretation, categorization, and decision-making at every step.",
            includes: ["Workflow Optimization", "Data Entry Automation", "Intelligent Document Parsing", "Auto-Triggered Actions", "Error Monitoring", "Scalable Architectures"]
        }
    },
    {
        title: "Design & Graphics",
        description: "Stunning visuals and UI/UX design that captivate your audience.",
        icon: <Palette size={32} />,
        details: {
            whatIsIt: "We blend human creativity with AI-powered design tools to create high-impact visual identities. From modern UI/UX to generated brand assets, we push the boundaries of what's possible in digital art.",
            howItWorks: "We start with a traditional design discovery phase, then leverage AI tools to rapidly prototype high-fidelity visuals. This allows us to explore thousands of creative directions and perfect the final aesthetic in record time.",
            includes: ["UI/UX Design Systems", "AI Image Generation", "Brand Identity Packs", "Responsive Web Design", "Interactive Prototypes", "Visual Storytelling"]
        }
    },
    {
        title: "Consulting",
        description: "Strategic guidance on navigating the AI landscape effectively.",
        icon: <BrainCircuit size={32} />,
        details: {
            whatIsIt: "AI Consulting provides a clear roadmap for businesses overwhelmed by the rapid pace of technology. We help you identify where AI can actually provide ROI, rather than just chasing hype.",
            howItWorks: "We conduct a thorough audit of your operations and data. We then deliver a strategic implementation plan, recommending the right models, tools, and security protocols to help you stay ahead of the competition.",
            includes: ["AI Readiness Audit", "Tech Stack Strategy", "Custom Implementation Roadmap", "Team Workshops", "Ethical AI Frameworks", "ROI Analysis"]
        }
    },
];

export default function ServicesSection() {
    const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);

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
                            <ServiceCard
                                {...service}
                                onClick={() => setSelectedService(service)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <ServiceModal
                isOpen={!!selectedService}
                onClose={() => setSelectedService(null)}
                service={selectedService}
            />
        </section>
    );
}
