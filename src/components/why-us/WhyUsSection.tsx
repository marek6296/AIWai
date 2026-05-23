"use client";
import React from "react";
import HumanVision from "./HumanVision";

export default function WhyUsSection() {
    return (
        <section id="about" className="py-6 md:py-12 relative overflow-hidden">
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
