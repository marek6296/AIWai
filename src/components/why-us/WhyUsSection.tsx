"use client";
import React from "react";
import HumanVision from "./HumanVision";
import SectionBackground from "@/components/backgrounds/SectionBackground";

export default function WhyUsSection() {
    return (
        <section id="about" className="py-6 md:py-12 bg-char relative overflow-hidden">
            <SectionBackground variant="soft" />

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
