"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { useSettings } from "@/lib/settings-context";

export default function HeroSection() {
  const { whatsapp_number } = useSettings();
  return (
    <section className="relative bg-white overflow-hidden border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 lg:pt-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Editorial Content */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-800 tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>New Season Collection</span>
            </div>

            <div className="space-y-3">
              <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl tracking-tight text-neutral-900 font-normal leading-[1.15]">
                Modern Styles, <br />
                <span className="italic font-light text-neutral-600">Premium Everyday Quality.</span>
              </h1>
              <p className="text-sm sm:text-base text-neutral-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                Explore our collection of stylish oversized shirts, pure linen kurtas, sharp blazers, and elegant modest wear. Select your size and order directly on WhatsApp.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-black hover:bg-neutral-800 text-white rounded-md text-sm font-semibold tracking-wider uppercase transition-all shadow-lg active:scale-98"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={`https://wa.me/${whatsapp_number || "918451812014"}?text=${encodeURIComponent(
                  "Assalamualaikum! I am browsing your collection and would like to place an order."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-[#25D366] hover:bg-[#1ebd59] text-white rounded-md text-sm font-semibold tracking-wide transition-all shadow-md active:scale-98"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Order on WhatsApp</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-neutral-100 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <p className="text-xl sm:text-2xl font-serif-luxury font-bold text-neutral-900">100%</p>
                <p className="text-[11px] text-neutral-500 uppercase tracking-wider mt-0.5">Quality Fabrics</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-serif-luxury font-bold text-neutral-900">Direct</p>
                <p className="text-[11px] text-neutral-500 uppercase tracking-wider mt-0.5">WhatsApp Order</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-serif-luxury font-bold text-neutral-900">Fast</p>
                <p className="text-[11px] text-neutral-500 uppercase tracking-wider mt-0.5">Priority Delivery</p>
              </div>
            </div>
          </div>

          {/* Right Showcase Editorial Images */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-7 relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-neutral-100">
                <Image
                  src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=85"
                  alt="Editorial Fashion Showcase"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="text-[10px] uppercase tracking-widest font-semibold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded">
                    Featured Edit
                  </span>
                  <p className="text-sm font-medium mt-1">Premium Oversized Shirts</p>
                </div>
              </div>

              <div className="col-span-5 space-y-4 flex flex-col justify-between">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg bg-neutral-100">
                  <Image
                    src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"
                    alt="Heritage Linen Kurta"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg bg-neutral-100">
                  <Image
                    src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80"
                    alt="Modest Abaya Elegance"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
