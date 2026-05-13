import dynamic from "next/dynamic";
import HeroSection from "@/components/hero/HeroSection";

const ServicesSection = dynamic(() => import("@/components/services/ServicesSection"));
const ProcessSection  = dynamic(() => import("@/components/process/ProcessSection"));
const WhyUsSection    = dynamic(() => import("@/components/why-us/WhyUsSection"));
const CTASection      = dynamic(() => import("@/components/cta/CTASection"));
const ContactSection  = dynamic(() => import("@/components/contact/ContactSection"));
export default function Home() {
    return (
        <main className="min-h-screen bg-white">
            <HeroSection />
            <ServicesSection />
            <ProcessSection />
            <WhyUsSection />
            <CTASection />
            <ContactSection />
        </main>
    );
}
