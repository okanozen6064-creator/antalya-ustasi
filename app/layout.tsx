import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { AutoLogoutProvider } from "@/components/providers/AutoLogoutProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Antalya Ustası',
    default: 'Antalya Ustası - Şehrin En İyi Hizmet Platformu',
  },
  description:
    "Antalya'da elektrikçiden nakliyeye, boyacıdan temizliğe aradığınız tüm ustalar ve hizmetler bir tık uzağınızda. Ücretsiz teklif alın.",
  icons: {
    icon: '/marka-logo.png', // Senin logon favicon olsun
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 flex flex-col min-h-screen`}
      >
        <AutoLogoutProvider />
        <Header />
        <main className="flex-grow min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
