import HeroSection from "@/components/hero/HeroSection";
import ServicesSection from "@/components/services/ServicesSection";
import WhyUsSection from "@/components/why-us/WhyUsSection";
import PortfolioSection from "@/components/portfolio/PortfolioSection";
import ContactSection from "@/components/contact/ContactSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <ServicesSection />
      <WhyUsSection />
      <PortfolioSection />
      <ContactSection />
    </main>
  );
}
