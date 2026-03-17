import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/chat/Chatbot";
import ParticleField from "@/components/backgrounds/ParticleField";
import ScrollProgress from "@/components/ui/ScrollProgress";
import { LanguageProvider } from "@/i18n/LanguageContext";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <LanguageProvider>
            <SmoothScroll />
            <ParticleField />
            <ScrollProgress />
            <Navbar />
            {children}
            <Footer />
            <Chatbot />
        </LanguageProvider>
    );
}
