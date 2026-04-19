import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = {
  title: "AIWai — Complete Digital Agency | Web, Design, AI & Automation",
  description: "AIWai is a full-service digital agency offering web development, graphic design, AI chatbots and business automation. One team for everything your business needs online.",
  keywords: ["digital agency", "web development", "AI chatbot", "business automation", "graphic design", "branding", "Make.com", "n8n", "Slovakia"],
  openGraph: {
    title: "AIWai — Complete Digital Agency",
    description: "Web development, graphic design, AI chatbots and business automation. One team, everything digital.",
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
        {/* Fonts are self-hosted by next/font — no external preconnect needed.
            Supabase DNS prefetch: NewsSection fetch fires on scroll. */}
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
