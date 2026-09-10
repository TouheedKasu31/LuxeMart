"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MessageCircle,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Share2,
  Check,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import WhatsAppOrderModal from "@/components/product/WhatsAppOrderModal";
import ProductCard from "@/components/product/ProductCard";

interface ProductDetailsClientProps {
  product: any;
  relatedProducts: any[];
  siteUrl: string;
  storePhone?: string;
}

export default function ProductDetailsClient({
  product,
  relatedProducts,
  siteUrl,
  storePhone,
}: ProductDetailsClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "details" | "howToOrder">("description");

  const images = product.images && product.images.length > 0
    ? product.images
    : [{ imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80" }];

  // Extract unique sizes and colours from variants
  const availableSizes = Array.from(
    new Set(product.variants?.map((v: any) => v.size).filter(Boolean) || [])
  ) as string[];

  const availableColours = Array.from(
    new Set(product.variants?.map((v: any) => v.colour).filter(Boolean) || [])
  ) as string[];

  const [selectedSize, setSelectedSize] = useState<string>(
    availableSizes.length > 0 ? availableSizes[0] : ""
  );
  const [selectedColour, setSelectedColour] = useState<string>(
    availableColours.length > 0 ? availableColours[0] : ""
  );

  const activeImage = images[selectedImageIndex]?.imageUrl || images[0].imageUrl;
  const isOutOfStock = !product.availability || product.stock <= 0;

  const hasDiscount = product.discountPrice && product.discountPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-neutral-100 bg-neutral-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center text-xs text-neutral-500 space-x-2">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-neutral-400" />
            <Link href="/shop" className="hover:text-black transition-colors">
              Catalogue
            </Link>
            {product.category && (
              <>
                <ChevronRight className="w-3 h-3 text-neutral-400" />
                <Link
                  href={`/shop?category=${product.category.slug}`}
                  className="hover:text-black transition-colors"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-3 h-3 text-neutral-400" />
            <span className="text-black font-medium truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Product Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Large Image View */}
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/80 shadow-sm">
              <Image
                src={activeImage}
                alt={`${product.name} - View ${selectedImageIndex + 1}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />

              {/* Status Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                {isOutOfStock ? (
                  <span className="px-3 py-1 bg-neutral-950 text-white text-xs uppercase font-bold tracking-widest rounded-sm">
                    Out of Stock
                  </span>
                ) : (
                  <>
                    {product.newArrival && (
                      <span className="px-3 py-1 bg-black text-white text-xs uppercase font-bold tracking-widest rounded-sm shadow-sm">
                        New In
                      </span>
                    )}
                    {hasDiscount && (
                      <span className="px-3 py-1 bg-rose-600 text-white text-xs uppercase font-bold tracking-widest rounded-sm shadow-sm">
                        Save {discountPercent}%
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Image counter indicator */}
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
                  {selectedImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Carousel / Selector */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {images.map((img: any, idx: number) => (
                  <button
                    key={img.id || idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      selectedImageIndex === idx
                        ? "border-black shadow-md scale-102"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.imageUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Details & WhatsApp Ordering */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              {/* Category & SKU */}
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                {product.category && (
                  <span className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-400">
                    {product.category.name}
                  </span>
                )}
                <span className="text-xs font-mono font-medium text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                  SKU: {product.sku}
                </span>
              </div>

              {/* Product Title */}
              <h1 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl text-neutral-900 font-normal leading-tight">
                {product.name}
              </h1>

              {/* Pricing Section */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-black font-sans">
                  ₹{(product.discountPrice || product.price).toLocaleString("en-IN")}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-neutral-400 line-through">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                )}
                <span className="text-xs text-neutral-500">Inclusive of all duties</span>
              </div>

              {/* Stock Status Indicator */}
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isOutOfStock ? "bg-rose-500" : "bg-[#25D366] animate-pulse"
                  }`}
                />
                <span className="text-xs font-medium text-neutral-700">
                  {isOutOfStock
                    ? "Currently Unavailable / Sold Out"
                    : `In Stock & Ready for WhatsApp Priority Dispatch (${product.stock} units)`}
                </span>
              </div>

              {/* Size Selector */}
              {availableSizes.length > 0 && (
                <div className="space-y-2.5 pt-2 border-t border-neutral-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-wider font-semibold text-neutral-900">
                      Select Size: <span className="font-bold text-black">{selectedSize}</span>
                    </label>
                    <span className="text-[11px] text-neutral-400">Indian / UK standard</span>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {availableSizes.map((size) => {
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-all ${
                            isSelected
                              ? "bg-black text-white shadow-sm border border-black scale-102"
                              : "bg-white text-neutral-800 border border-neutral-200 hover:border-black"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Colour Selector */}
              {availableColours.length > 0 && (
                <div className="space-y-2.5 pt-2 border-t border-neutral-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-wider font-semibold text-neutral-900">
                      Select Colour: <span className="font-bold text-black">{selectedColour}</span>
                    </label>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {availableColours.map((colour) => {
                      const isSelected = selectedColour === colour;
                      return (
                        <button
                          key={colour}
                          type="button"
                          onClick={() => setSelectedColour(colour)}
                          className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
                            isSelected
                              ? "bg-neutral-900 text-white shadow-sm ring-2 ring-neutral-900 ring-offset-1"
                              : "bg-neutral-50 text-neutral-800 border border-neutral-200 hover:border-neutral-400"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-[#25D366]" />}
                          <span>{colour}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Primary Action: Order on WhatsApp Button */}
              <div className="pt-4 space-y-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  disabled={isOutOfStock}
                  className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold text-sm tracking-wide transition-all shadow-lg active:scale-98 ${
                    isOutOfStock
                      ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                      : "bg-[#25D366] hover:bg-[#1ebd59] text-white whatsapp-glow"
                  }`}
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>ORDER ON WHATSAPP</span>
                </button>

                <p className="text-[11px] text-center text-neutral-500 leading-tight">
                  ⚡ Pre-populated with your exact product, size, SKU, and image preview card.
                </p>
              </div>

              {/* Trust Information Box */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-neutral-100 text-center text-neutral-600">
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <Truck className="w-4 h-4 mx-auto text-neutral-800 mb-1" />
                  <p className="text-[10px] font-semibold text-neutral-800">Express Delivery</p>
                  <p className="text-[9px] text-neutral-500">2-4 Business Days</p>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <ShieldCheck className="w-4 h-4 mx-auto text-neutral-800 mb-1" />
                  <p className="text-[10px] font-semibold text-neutral-800">Direct Guarantee</p>
                  <p className="text-[9px] text-neutral-500">100% Authentic</p>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <RotateCcw className="w-4 h-4 mx-auto text-neutral-800 mb-1" />
                  <p className="text-[10px] font-semibold text-neutral-800">Easy Exchange</p>
                  <p className="text-[9px] text-neutral-500">7 Days Size Swap</p>
                </div>
              </div>
            </div>

            {/* Tabbed Product Details / Fabric / Care */}
            <div className="pt-6 border-t border-neutral-200">
              <div className="flex border-b border-neutral-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab("description")}
                  className={`pb-2.5 px-3 uppercase tracking-wider transition-colors ${
                    activeTab === "description"
                      ? "border-b-2 border-black text-black"
                      : "text-neutral-400 hover:text-neutral-700"
                  }`}
                >
                  Description
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("details")}
                  className={`pb-2.5 px-3 uppercase tracking-wider transition-colors ${
                    activeTab === "details"
                      ? "border-b-2 border-black text-black"
                      : "text-neutral-400 hover:text-neutral-700"
                  }`}
                >
                  Fabric & Fit
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("howToOrder")}
                  className={`pb-2.5 px-3 uppercase tracking-wider transition-colors ${
                    activeTab === "howToOrder"
                      ? "border-b-2 border-black text-black"
                      : "text-neutral-400 hover:text-neutral-700"
                  }`}
                >
                  How To Order
                </button>
              </div>

              <div className="py-4 text-xs leading-relaxed text-neutral-600">
                {activeTab === "description" && (
                  <p className="whitespace-pre-line">{product.description}</p>
                )}
                {activeTab === "details" && (
                  <div className="whitespace-pre-line font-mono text-[11px] bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                    {product.details || "Fabric: 100% Premium Material\nCare: Delicate wash cold\nFit: Tailored to standard specs"}
                  </div>
                )}
                {activeTab === "howToOrder" && (
                  <div className="space-y-2">
                    <p>1. Tap the green <strong>ORDER ON WHATSAPP</strong> button.</p>
                    <p>2. WhatsApp opens directly with your product, SKU ({product.sku}), selected size ({selectedSize}), and product photo link preview prefilled.</p>
                    <p>3. Send the message and our customer representative will confirm order address and payment details directly with you.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products from Category */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-semibold">
                  Complementary Styles
                </span>
                <h3 className="font-serif-luxury text-2xl sm:text-3xl text-neutral-900 mt-1">
                  More From This Collection
                </h3>
              </div>
              {product.category && (
                <Link
                  href={`/shop?category=${product.category.slug}`}
                  className="text-xs font-semibold uppercase tracking-wider text-black border-b border-black pb-0.5 hover:text-neutral-600"
                >
                  View All
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Mobile WhatsApp Ordering Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-neutral-200 p-3.5 z-40 flex items-center justify-between gap-4 shadow-float">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-neutral-400">Total Price</span>
          <span className="text-base font-bold text-neutral-900 font-sans">
            ₹{(product.discountPrice || product.price).toLocaleString("en-IN")}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          disabled={isOutOfStock}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 ${
            isOutOfStock
              ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              : "bg-[#25D366] text-white"
          }`}
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>Order on WhatsApp</span>
        </button>
      </div>

      {/* WhatsApp Modal */}
      <WhatsAppOrderModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        product={{
          id: product.id,
          sku: product.sku,
          name: product.name,
          slug: product.slug,
          price: product.price,
          discountPrice: product.discountPrice,
          imageUrl: activeImage,
        }}
        selectedSize={selectedSize}
        selectedColour={selectedColour}
        storePhone={storePhone}
      />
    </div>
  );
}
