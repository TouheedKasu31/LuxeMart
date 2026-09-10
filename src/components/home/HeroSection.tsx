"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { useSettings } from "@/lib/settings-context";

export default function HeroSection() {
  const {
    whatsapp_number,
    hero_title,
    hero_subtitle,
    hero_image_main,
    hero_image_watches,
    hero_image_shoes,
  } = useSettings();

  const mainImage =
    hero_image_main ||
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85";
  const watchImage =
    hero_image_watches ||
    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80";
  const shoesImage =
    hero_image_shoes ||
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80";

  return (
    <section className="relative bg-white overflow-hidden border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 lg:pt-14 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Editorial Content */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-800 tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Complete Fashion & Lifestyle Store</span>
            </div>

            <div className="space-y-3">
              <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl tracking-tight text-neutral-900 font-normal leading-[1.15]">
                {hero_title ? (
                  hero_title
                ) : (
                  <>
                    Men, Women, <br />
                    <span className="italic font-light text-neutral-600">Watches & Footwear.</span>
                  </>
                )}
              </h1>
              <p className="text-sm sm:text-base text-neutral-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                {hero_subtitle ||
                  "Your one-stop fashion store. Explore curated collections of Men's & Women's clothing, luxury timepieces, shoes, and stylish accessories. Select your items and order directly on WhatsApp."}
              </p>
            </div>

            {/* Quick Category Chips */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              <Link
                href="/shop"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-50 hover:bg-black hover:text-white transition-all text-xs font-medium text-neutral-700 border border-neutral-200"
              >
                <span>👔 Men's Wear</span>
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-50 hover:bg-black hover:text-white transition-all text-xs font-medium text-neutral-700 border border-neutral-200"
              >
                <span>👗 Women's Wear</span>
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-50 hover:bg-black hover:text-white transition-all text-xs font-medium text-neutral-700 border border-neutral-200"
              >
                <span>⌚ Luxury Watches</span>
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-neutral-50 hover:bg-black hover:text-white transition-all text-xs font-medium text-neutral-700 border border-neutral-200"
              >
                <span>👟 Premium Shoes</span>
              </Link>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-black hover:bg-neutral-800 text-white rounded-md text-sm font-semibold tracking-wider uppercase transition-all shadow-lg active:scale-98"
              >
                <span>Explore Store</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={`https://wa.me/${whatsapp_number || "918451812014"}?text=${encodeURIComponent(
                  "Assalamualaikum! I am browsing your store collection and would like to place an order."
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
                <p className="text-xl sm:text-2xl font-serif-luxury font-bold text-neutral-900">All-In-One</p>
                <p className="text-[11px] text-neutral-500 uppercase tracking-wider mt-0.5">Men & Women Fashion</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-serif-luxury font-bold text-neutral-900">Watches</p>
                <p className="text-[11px] text-neutral-500 uppercase tracking-wider mt-0.5">& Shoes Collection</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-serif-luxury font-bold text-neutral-900">Direct</p>
                <p className="text-[11px] text-neutral-500 uppercase tracking-wider mt-0.5">WhatsApp Orders</p>
              </div>
            </div>
          </div>

          {/* Right Multi-Category Showcase Collage */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-12 gap-3.5 sm:gap-4">
              {/* Primary Large Card - Men & Women Lifestyle */}
              <Link
                href="/shop"
                className="group col-span-7 relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-neutral-100 border border-neutral-200/60 block"
              >
                <Image
                  src={mainImage}
                  alt="Men & Women Fashion Collection"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] uppercase tracking-widest font-semibold bg-white/25 backdrop-blur-md px-2.5 py-1 rounded inline-block">
                    Apparel & Outfits
                  </span>
                  <p className="text-base sm:text-lg font-medium mt-1.5 leading-snug">
                    Men & Women Wear
                  </p>
                  <p className="text-xs text-neutral-300 font-light mt-0.5">
                    Shirts, Kurtas, Dresses & Suits
                  </p>
                </div>
              </Link>

              {/* Right Column with Watches & Shoes */}
              <div className="col-span-5 space-y-3.5 sm:space-y-4 flex flex-col justify-between">
                {/* Watch Card */}
                <Link
                  href="/shop"
                  className="group relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg bg-neutral-100 border border-neutral-200/60 block"
                >
                  <Image
                    src={watchImage}
                    alt="Luxury Watches & Accessories"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[9px] uppercase tracking-widest font-semibold bg-white/25 backdrop-blur-md px-2 py-0.5 rounded inline-block">
                      Accessories
                    </span>
                    <p className="text-xs sm:text-sm font-medium mt-1 leading-tight">
                      Luxury Watches
                    </p>
                    <p className="text-[10px] text-neutral-300 font-light hidden sm:block mt-0.5">
                      Timeless Elegance
                    </p>
                  </div>
                </Link>

                {/* Shoes Card */}
                <Link
                  href="/shop"
                  className="group relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg bg-neutral-100 border border-neutral-200/60 block"
                >
                  <Image
                    src={shoesImage}
                    alt="Designer Shoes & Footwear"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[9px] uppercase tracking-widest font-semibold bg-white/25 backdrop-blur-md px-2 py-0.5 rounded inline-block">
                      Footwear
                    </span>
                    <p className="text-xs sm:text-sm font-medium mt-1 leading-tight">
                      Shoes & Footwear
                    </p>
                    <p className="text-[10px] text-neutral-300 font-light hidden sm:block mt-0.5">
                      Casual & Formal
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
