import dynamic from "next/dynamic";
import HeroSection from "@/components/hero/HeroSection";

// SSR-enabled code-split sections.
// Sections render in the HTML immediately — content is visible even before JS.
// JavaScript loads async for interactivity (modal, form, etc.).
const ServicesSection = dynamic(() => import("@/components/services/ServicesSection"));
const WhyUsSection    = dynamic(() => import("@/components/why-us/WhyUsSection"));
const CTASection      = dynamic(() => import("@/components/cta/CTASection"));
const ContactSection  = dynamic(() => import("@/components/contact/ContactSection"));
const NewsSection     = dynamic(() => import("@/components/news/NewsSection"));

export default function Home() {
    return (
        <main className="min-h-screen bg-white">
            <HeroSection />
            <ServicesSection />
            <WhyUsSection />
            <CTASection />
            <ContactSection />
            <NewsSection />
        </main>
    );
}
