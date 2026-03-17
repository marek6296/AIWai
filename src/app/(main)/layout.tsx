import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/chat/Chatbot";
import ParticleField from "@/components/backgrounds/ParticleField";
import ScrollProgress from "@/components/ui/ScrollProgress";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <SmoothScroll />
            <ParticleField />
            <ScrollProgress />
            <Navbar />
            {children}
            <Footer />
            <Chatbot />
        </>
    );
}
