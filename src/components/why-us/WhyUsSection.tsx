"use client";
import React from "react";
import HumanVision from "./HumanVision";

export default function WhyUsSection() {
    return (
        <section id="about" className="py-24 bg-white relative overflow-hidden">
            {/* Minimalist Background Elements - No huge patterns */}
            <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-brand-sand/3 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-brand-indigo/2 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto relative z-10">
                {/* 
                  Human-Centric Vision Section 
                  Replaces technical grids and stats with a personal philosophy.
                */}
                <HumanVision />
            </div>
        </section>
    );
}
