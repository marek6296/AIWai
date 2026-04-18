import dynamic from "next/dynamic";
import HeroSection from "@/components/hero/HeroSection";

// Below-fold sections — split into separate chunks, loaded after hero
const ServicesSection = dynamic(() => import("@/components/services/ServicesSection"), { ssr: false });
const WhyUsSection = dynamic(() => import("@/components/why-us/WhyUsSection"), { ssr: false });
const CTASection = dynamic(() => import("@/components/cta/CTASection"), { ssr: false });
const ContactSection = dynamic(() => import("@/components/contact/ContactSection"), { ssr: false });
const NewsSection = dynamic(() => import("@/components/news/NewsSection"), { ssr: false });

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
