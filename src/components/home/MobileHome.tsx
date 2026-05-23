"use client";

import MobileBackdrop from "@/components/home/MobileBackdrop";
import MobileHero from "@/components/home/MobileHero";
import MobileServicesGrid from "@/components/home/MobileServicesGrid";
import MobileProcessSection from "@/components/home/MobileProcessSection";
import CTASection from "@/components/cta/CTASection";
import ContactSection from "@/components/contact/ContactSection";
import ToolsSlider from "@/components/tools/ToolsSlider";

/**
 * MobileHome — dedicated mobile homepage. Renders only when the viewport
 * matches a phone. Built for touch and slower CPUs:
 *  - Static CSS backdrop (no canvas, no rAF)
 *  - Hero text via opacity-only keyframes (Safari renders crisp)
 *  - Flat service cards instead of the rotating orbit
 *  - Process timeline without continuous animations
 *  - CTASection / ContactSection / ToolsSlider are reused (already light)
 */
export default function MobileHome() {
    return (
        <div className="relative bg-char overflow-x-hidden">
            <MobileBackdrop />
            <main className="relative w-full">
                <MobileHero />
                <MobileServicesGrid />
                <MobileProcessSection />
                <CTASection />
                <ContactSection />
            </main>
            <ToolsSlider />
        </div>
    );
}
