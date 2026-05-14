import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema, localBusinessSchema } from "@/lib/seo/schemas";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "AIWai — Web, AI chatboty a automatizácia | Slovensko",
    template: "%s | AIWai",
  },
  description:
    "Digitálna agentúra: weby, AI chatboty, automatizácia (Make.com, n8n), logo a marketing. Pre malé a stredné firmy. Konzultácia zdarma do 24 h.",
  applicationName: "AIWai",
  authors: [{ name: "Marek Donoval", url: "https://aiwai.app" }],
  creator: "AIWai",
  publisher: "AIWai",
  metadataBase: new URL("https://aiwai.app"),
  alternates: {
    canonical: "/",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "AIWai — Web, AI chatboty a automatizácia",
    description:
      "Weby, AI chatboty, automatizácia, logo a marketing. Jedno miesto pre všetko digitálne. Konzultácia zdarma do 24 h.",
    type: "website",
    url: "https://aiwai.app",
    siteName: "AIWai",
    locale: "sk_SK",
    alternateLocale: ["en_US", "cs_CZ"],
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 681,
        alt: "AIWai — Web, Dizajn, AI & Automatizácia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIWai — Web, AI chatboty a automatizácia",
    description:
      "Weby, AI chatboty, automatizácia, logo a marketing. Jedno miesto pre všetko digitálne.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sk">
      <head>
        {/* Fonts are self-hosted by next/font — no external preconnect needed.
            Supabase DNS prefetch: NewsSection fetch fires on scroll. */}
        <link rel="dns-prefetch" href="https://dmxosdgvmzvkeivknczv.supabase.co" />
        <JsonLd data={organizationSchema} id="ld-org" />
        <JsonLd data={websiteSchema} id="ld-website" />
        <JsonLd data={localBusinessSchema} id="ld-localbusiness" />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} bg-white text-brand-indigo antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
