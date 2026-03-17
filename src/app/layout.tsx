import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "AIWai | Intelligent Digital Architecture",
  description: "Premium AI agency delivering autonomous agents, intelligent chatbots, business automation, and world-class design. We build the neural network of your digital presence.",
  keywords: ["AI Agency", "AI Agents", "Chatbots", "Business Automation", "Web Design", "Digital Architecture"],
  openGraph: {
    title: "AIWai | Intelligent Digital Architecture",
    description: "Premium AI agency delivering autonomous agents, intelligent chatbots, business automation, and world-class design.",
    type: "website",
  },
};

import BodyReveal from "@/components/BodyReveal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} bg-white text-brand-indigo antialiased`}
      >
        <BodyReveal />
        {children}
      </body>
    </html>
  );
}
