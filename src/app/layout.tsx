import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = {
  title: "AIWai — Web, Dizajn, AI, Marketing & Automatizácia",
  description: "Digitálna agentúra pre malé a stredné firmy. Weby, loga, AI chatboty, správa sociálnych sietí a automatizácia procesov. Jedno miesto pre všetko digitálne.",
  keywords: ["digitálna agentúra", "tvorba webu", "AI chatbot", "automatizácia", "logo dizajn", "branding", "Make.com", "n8n", "Slovensko"],
  metadataBase: new URL("https://aiwai.app"),
  openGraph: {
    title: "AIWai — Web, Dizajn, AI & Automatizácia",
    description: "Weby, logá, AI chatboty a automatizácia pre váš biznis. Jedno miesto pre všetko digitálne.",
    type: "website",
    url: "https://aiwai.app",
    siteName: "AIWai",
    locale: "sk_SK",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AIWai — Web, Dizajn, AI & Automatizácia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIWai — Web, Dizajn, AI & Automatizácia",
    description: "Weby, logá, AI chatboty a automatizácia pre váš biznis. Jedno miesto pre všetko digitálne.",
    images: ["/og-image.png"],
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
