import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/chat/Chatbot";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "AIWai | Intelligent Digital Architecture",
  description: "Premium AI Agency",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: `body { opacity: 0; transition: opacity 0.2s ease-in; }` }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 1. Block browser scroll restoration
              if ('scrollRestoration' in window.history) {
                window.history.scrollRestoration = 'manual';
              }
              // 2. Force scroll to top immediately
              window.scrollTo(0, 0);

              // 3. Reveal body after a tiny delay to ensure scroll has settled
              document.addEventListener('DOMContentLoaded', () => {
                window.scrollTo(0, 0);
                setTimeout(() => {
                  document.body.style.opacity = '1';
                }, 50);
              });
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} bg-white text-brand-indigo antialiased`}
      >
        <SmoothScroll />
        <Navbar />
        {children}
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}
