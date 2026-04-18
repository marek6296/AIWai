import dynamic from "next/dynamic";
import HeroSection from "@/components/hero/HeroSection";

// Below-fold sections — lazy loaded with height reservations to prevent CLS
const ServicesSection = dynamic(() => import("@/components/services/ServicesSection"), {
    ssr: false,
    loading: () => <div className="min-h-[500px] bg-white" />,
});
const WhyUsSection = dynamic(() => import("@/components/why-us/WhyUsSection"), {
    ssr: false,
    loading: () => <div className="min-h-[480px] bg-white" />,
});
const CTASection = dynamic(() => import("@/components/cta/CTASection"), {
    ssr: false,
    loading: () => <div className="min-h-[380px] bg-[#1C1F3A]" />,
});
const ContactSection = dynamic(() => import("@/components/contact/ContactSection"), {
    ssr: false,
    loading: () => <div className="min-h-[600px] bg-white" />,
});
const NewsSection = dynamic(() => import("@/components/news/NewsSection"), {
    ssr: false,
    loading: () => <div className="min-h-[480px] bg-black" />,
});

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
