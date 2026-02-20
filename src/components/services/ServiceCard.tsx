"use client";
import React from "react";
import { motion } from "framer-motion";
import Hexagon from "@/components/ui/Hexagon";
import { ArrowRight } from "lucide-react";
import TiltCard from "@/components/ui/TiltCard";

interface ServiceCardProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
    onClick?: () => void;
}

export default function ServiceCard({ title, description, icon, onClick }: ServiceCardProps) {
    return (
        <TiltCard className="w-64 h-72 cursor-pointer group" onClick={onClick}>
            <Hexagon className="w-full h-full drop-shadow-xl">
                <div className="absolute inset-0 bg-brand-offwhite group-hover:bg-brand-indigo/5 transition-colors duration-300" />

                {/* Internal content */}
                <div className="flex flex-col items-center justify-center text-center p-6 z-10 space-y-4 h-full">
                    {icon && <div className="text-brand-indigo scale-110 mb-2">{icon}</div>}
                    <h3 className="text-xl font-medium tracking-wide text-brand-indigo group-hover:text-brand-indigo/70 transition-colors">{title}</h3>
                    <p className="text-xs text-brand-indigo/60 line-clamp-3 group-hover:text-brand-indigo/90 transition-colors leading-relaxed">{description}</p>
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <ArrowRight className="w-5 h-5 text-brand-indigo" />
                    </div>
                </div>
            </Hexagon>
        </TiltCard>
    );
}
