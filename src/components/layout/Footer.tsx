"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { useSettings } from "@/lib/settings-context";

export default function Footer() {
  const pathname = usePathname();
  const { store_name, whatsapp_number } = useSettings();

  // Don't render public footer in admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 text-neutral-800">
      {/* 4-Step WhatsApp Ordering Process Banner */}
      <div className="border-b border-neutral-200 bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-semibold">
              Effortless Direct Shopping
            </span>
            <h3 className="font-serif-luxury text-2xl sm:text-3xl text-black font-normal mt-2">
              How WhatsApp Ordering Works
            </h3>
            <p className="text-sm text-neutral-500 mt-2">
              Skip long forms and checkout carts. Order your favorite items directly via WhatsApp in just 1 click.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-100 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm mb-3">
                1
              </div>
              <h4 className="font-semibold text-sm text-black mb-1">Browse Catalogue</h4>
              <p className="text-xs text-neutral-500">
                Explore curated apparel, tailored pieces, and modest fashion collections.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-100 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm mb-3">
                2
              </div>
              <h4 className="font-semibold text-sm text-black mb-1">Select Size & Colour</h4>
              <p className="text-xs text-neutral-500">
                Pick your preferred fit, colour swatch, and check live stock status.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-100 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center font-bold text-sm mb-3">
                3
              </div>
              <h4 className="font-semibold text-sm text-black mb-1">Tap &quot;Order on WhatsApp&quot;</h4>
              <p className="text-xs text-neutral-500">
                Your exact product, SKU, variant, and photo card prefill automatically.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-100 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm mb-3">
                4
              </div>
              <h4 className="font-semibold text-sm text-black mb-1">Confirm & Receive</h4>
              <p className="text-xs text-neutral-500">
                Confirm your delivery address directly in chat and receive priority dispatch.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <span className="font-serif-luxury text-2xl tracking-[0.18em] font-bold text-black uppercase">
              {store_name}
            </span>
            <p className="text-xs leading-relaxed text-neutral-500">
              Your destination for premium quality shirts, pure linen kurtas, tailored blazers, and modest wear. Simple 1-click WhatsApp ordering.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${whatsapp_number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-900 hover:text-black border-b border-black pb-0.5"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp: +{whatsapp_number}</span>
              </a>
            </div>
          </div>

          {/* Catalogue Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-black mb-4">
              Catalogue
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-600">
              <li>
                <Link href="/shop" className="hover:text-black transition-colors">
                  All Collections
                </Link>
              </li>
              <li>
                <Link href="/shop?newArrival=true" className="hover:text-black transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/shop?featured=true" className="hover:text-black transition-colors">
                  Featured Pieces
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-black transition-colors">
                  Category Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Ordering Information */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-black mb-4">
              Ordering & Delivery
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Direct WhatsApp Chat</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Pan-India & Global Shipping</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Custom Sizing on Request</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Instant Stock Check</span>
              </li>
            </ul>
          </div>

          {/* Admin & Owner */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-black mb-4">
              Owner Management
            </h4>
            <p className="text-xs text-neutral-500 mb-3">
              Store administrators can manage catalogue items, inventory, categories, and settings.
            </p>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 px-3 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 rounded-md text-xs font-medium transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Dashboard</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-4">
          <p>© {new Date().getFullYear()} {store_name}. All rights reserved. Built for WhatsApp-first Commerce.</p>
          <p>Product Catalogue & WhatsApp Order Showcase System</p>
        </div>
      </div>
    </footer>
  );
}
