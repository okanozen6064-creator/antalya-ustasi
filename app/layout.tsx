import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DemoModal } from "@/components/common/DemoModal";
import ConstructionAlert from "@/components/common/ConstructionAlert";
import ScrollToTop from "@/components/common/ScrollToTop";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Antalya Ustası | En İyi Esnafları Bul",
  description: "Antalya'nın güvenilir ustaları burada.",
  icons: {
    icon: [
      {
        url: "/favicons/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
  },
  other: {
    "msapplication-TileColor": "#ffffff",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ScrollToTop />
        <ConstructionAlert />
        <Header />
        {children}
        <Footer />
        <DemoModal />
      </body>
    </html>
  );
}
