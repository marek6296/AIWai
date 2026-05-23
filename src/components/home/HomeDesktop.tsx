import FlowArt, { FlowSection } from "@/components/flow/FlowArt";
import HeroSection from "@/components/hero/HeroSection";
import ServicesSection from "@/components/services/ServicesSection";
import ProcessSection from "@/components/process/ProcessSection";
import CTASection from "@/components/cta/CTASection";
import ContactSection from "@/components/contact/ContactSection";
import ToolsSlider from "@/components/tools/ToolsSlider";
import HomeBackdrop from "@/components/backgrounds/HomeBackdrop";

/**
 * HomeDesktop — the full PC homepage. Identical to the previous
 * page.tsx contents. Routed to by HomeRouter on viewports >= 768px.
 * Never mounted on phones so the FlowLines canvas / GooeyText / etc.
 * never start up there.
 */
export default function HomeDesktop() {
    return (
        <div className="relative bg-char">
            <HomeBackdrop />
            <FlowArt className="min-h-screen">
                <FlowSection flowId="top" aria-label="AIWai hero">
                    <HeroSection />
                </FlowSection>
                <FlowSection flowId="services" aria-label="AIWai services">
                    <ServicesSection />
                </FlowSection>
                <FlowSection flowId="process" aria-label="AIWai process">
                    <ProcessSection />
                </FlowSection>
                <FlowSection flowId="cta" aria-label="AIWai call to action">
                    <CTASection />
                </FlowSection>
                <FlowSection flowId="contact" aria-label="AIWai contact">
                    <ContactSection />
                </FlowSection>
            </FlowArt>
            <ToolsSlider />
        </div>
    );
}
