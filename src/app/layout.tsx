import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = {
  title: "AIWai | Intelligent Digital Architecture",
  description: "Premium AI agency delivering autonomous agents, intelligent chatbots, business automation, and world-class design. We build the neural network of your digital presence.",
  keywords: ["AI Agency", "AI Agents", "Chatbots", "Business Automation", "Web Design", "Digital Architecture"],
  openGraph: {
    title: "AIWai | Intelligent Digital Architecture",
    description: "Premium AI agency delivering autonomous agents, intelligent chatbots, business automation, and world-class design.",
    type: "website",
    url: "https://aiwai.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://dmxosdgvmzvkeivknczv.supabase.co" />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} bg-white text-brand-indigo antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
