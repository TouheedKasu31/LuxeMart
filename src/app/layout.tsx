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
    default: "MAISON ÉLÉGANCE | Luxury Fashion Catalogue & WhatsApp Boutique",
    template: "%s | MAISON ÉLÉGANCE",
  },
  description:
    "Explore our handcrafted fashion catalogue of luxury oversized shirts, linen kurtas, tailored blazers, and modest abayas. Instant direct ordering via WhatsApp.",
  keywords: [
    "fashion catalogue",
    "luxury shirts",
    "embroidered kurtas",
    "abaya modest wear",
    "whatsapp clothing store",
    "menswear",
    "couture",
  ],
  openGraph: {
    title: "MAISON ÉLÉGANCE | Luxury Fashion Catalogue",
    description:
      "Explore handcrafted luxury apparel. Browse catalogue and order directly on WhatsApp.",
    siteName: "MAISON ÉLÉGANCE",
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
