import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { LanguageProvider } from "@/i18n/LanguageContext";

// Deferred client-only components — do not block first paint
const SmoothScroll   = dynamic(() => import("@/components/SmoothScroll"),                    { ssr: false });
const ParticleField  = dynamic(() => import("@/components/backgrounds/ParticleField"),        { ssr: false });
const ScrollProgress = dynamic(() => import("@/components/ui/ScrollProgress"),                { ssr: false });
// Chatbot loads last — heaviest component, not needed until user interaction
const Chatbot        = dynamic(() => import("@/components/chat/Chatbot"),                     { ssr: false });

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
