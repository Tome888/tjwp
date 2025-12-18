import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";
import { PortfolioProvider } from "@/components/portfolio-context";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tome Jeftimov Web-Portfolio",
  description:
    "Turning Ideas into Impactful Digital Realities.",
  icons: {
    icon: [
      {
        url: "/tj-light.svg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/tj-dark.svg",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/tj-dark.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/tj-light.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <PortfolioProvider>
          <>
            <Header />
            <div className="relative min-h-screen bg-background text-foreground">
              {children}
            </div>
            <Footer />
            <Toaster />
            <Analytics />
          </>
        </PortfolioProvider>
      </body>
    </html>
  );
}
