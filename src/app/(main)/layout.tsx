import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DeferredShell from "@/components/layout/DeferredShell";
import { LanguageProvider } from "@/i18n/LanguageContext";

export default function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <LanguageProvider>
            <Navbar />
            {children}
            <Footer />
            {/* ScrollProgress + Chatbot mount after idle — see DeferredShell */}
            <DeferredShell />
        </LanguageProvider>
    );
}
