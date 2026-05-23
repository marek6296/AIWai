import FlowArt, { FlowSection } from "@/components/flow/FlowArt";
import HeroSection from "@/components/hero/HeroSection";
import ServicesSection from "@/components/services/ServicesSection";
import ProcessSection from "@/components/process/ProcessSection";
import WhyUsSection from "@/components/why-us/WhyUsSection";
import CTASection from "@/components/cta/CTASection";
import ContactSection from "@/components/contact/ContactSection";
import ToolsSlider from "@/components/tools/ToolsSlider";
import HomeBackdrop from "@/components/backgrounds/HomeBackdrop";

export default function Home() {
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
                <FlowSection flowId="about" aria-label="AIWai about">
                    <WhyUsSection />
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
