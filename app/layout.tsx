import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DemoModal } from "@/components/common/DemoModal";
import { ConstructionAlert } from "@/components/common/ConstructionAlert";
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
        <ConstructionAlert />
        <Header />
        {children}
        <Footer />
        <DemoModal />
      </body>
    </html>
  );
}
