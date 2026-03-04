import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CookieConsent from "@/components/cookies-banner";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "ContextEngine",
  description: "Next-gen RAG Analysis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans bg-[#050505] text-white antialiased`}
      >
        <div className="relative h-full w-full overflow-hidden">
          {children}
          <CookieConsent privacyHref="/privacy" />
        </div>
      </body>
    </html>
  );
}     
