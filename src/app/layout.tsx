import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFloatingButton from "@/components/common/WhatsAppFloatingButton";
import { SettingsProvider } from "@/lib/settings-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LuxeMart | Premium Fashion Store & WhatsApp Boutique",
    template: "%s | LuxeMart",
  },
  description:
    "Explore our collection of premium oversized shirts, pure linen kurtas, tailored blazers, and modest wear. Quick and easy direct ordering via WhatsApp.",
  keywords: [
    "clothing store",
    "premium shirts",
    "linen kurtas",
    "abaya modest wear",
    "whatsapp clothing store",
    "menswear",
    "fashion",
  ],
  openGraph: {
    title: "LuxeMart | Premium Fashion Store",
    description:
      "Explore quality apparel. Browse our collection and order directly on WhatsApp.",
    siteName: "LuxeMart",
    images: [
      {
        url: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "MAISON ÉLÉGANCE Collection",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">
        <SettingsProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFloatingButton />
        </SettingsProvider>
      </body>
    </html>
  );
}
