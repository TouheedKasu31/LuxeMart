"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Eye, Check } from "lucide-react";
import WhatsAppOrderModal from "./WhatsAppOrderModal";

export interface ProductCardProps {
  product: {
    id: string;
    sku: string;
    name: string;
    slug: string;
    price: number;
    discountPrice?: number | null;
    stock: number;
    availability: boolean;
    featured?: boolean;
    newArrival?: boolean;
    category?: {
      id: string;
      name: string;
      slug: string;
    };
    images?: Array<{
      id?: string;
      imageUrl: string;
      isPrimary?: boolean;
    }>;
    variants?: Array<{
      id?: string;
      size: string;
      colour: string;
    }>;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.imageUrl ||
    product.images?.[0]?.imageUrl ||
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80";

  const secondaryImage =
    product.images && product.images.length > 1
      ? product.images[1].imageUrl
      : primaryImage;

  const hasDiscount = product.discountPrice && product.discountPrice > 0;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - (product.discountPrice || 0)) / product.price) * 100)
    : 0;

  // Extract unique sizes & colours for quick display
  const sizes = Array.from(new Set(product.variants?.map((v) => v.size).filter(Boolean) || []));

  return (
    <>
      <div
        className="group relative flex flex-col bg-white rounded-lg overflow-hidden border border-neutral-100 hover:border-neutral-300 transition-all duration-300 hover:shadow-premium"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container with Badges */}
        <div className="relative aspect-[3/4] w-full bg-neutral-100 overflow-hidden">
          <Link href={`/product/${product.slug}`} className="block w-full h-full">
            <Image
              src={isHovered ? secondaryImage : primaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover product-card-img transition-all duration-700 ease-out"
            />
          </Link>

          {/* Badges Overlay */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            {!product.availability || product.stock <= 0 ? (
              <span className="px-2.5 py-1 bg-neutral-900/90 backdrop-blur-sm text-white text-[10px] uppercase font-bold tracking-widest rounded-sm">
                Out of Stock
              </span>
            ) : (
              <>
                {product.newArrival && (
                  <span className="px-2.5 py-1 bg-black text-white text-[10px] uppercase font-bold tracking-widest rounded-sm shadow-sm">
                    New
                  </span>
                )}
                {hasDiscount && (
                  <span className="px-2.5 py-1 bg-rose-600 text-white text-[10px] uppercase font-bold tracking-widest rounded-sm shadow-sm">
                    -{discountPercent}%
                  </span>
                )}
              </>
            )}
          </div>

          {/* SKU Pill */}
          <div className="absolute top-2.5 right-2.5 z-10">
            <span className="px-2 py-0.5 bg-white/90 backdrop-blur-sm text-neutral-600 text-[10px] font-mono uppercase tracking-wider rounded-sm shadow-sm border border-neutral-200">
              {product.sku}
            </span>
          </div>

          {/* Hover Quick Actions Bar */}
          <div className="absolute inset-x-2 bottom-2 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <Link
              href={`/product/${product.slug}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white/95 backdrop-blur-md hover:bg-black hover:text-white text-neutral-900 text-xs font-semibold rounded-md shadow-sm transition-colors border border-neutral-200"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Details</span>
            </Link>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#25D366] hover:bg-[#1ebd59] text-white text-xs font-semibold rounded-md shadow-sm transition-transform active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Product Details info */}
        <div className="p-4 flex flex-col flex-1 justify-between">
          <div>
            {/* Category */}
            {product.category && (
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
                {product.category.name}
              </span>
            )}

            {/* Name */}
            <h3 className="text-sm font-medium text-neutral-900 group-hover:text-black line-clamp-1 mt-0.5">
              <Link href={`/product/${product.slug}`} className="hover:underline">
                {product.name}
              </Link>
            </h3>

            {/* Sizes preview if available */}
            {sizes.length > 0 && (
              <div className="flex items-center gap-1 mt-2">
                <span className="text-[10px] text-neutral-400 uppercase">Sizes:</span>
                <div className="flex flex-wrap gap-1">
                  {sizes.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="text-[10px] px-1.5 py-0.5 bg-neutral-100 text-neutral-700 rounded font-medium"
                    >
                      {s}
                    </span>
                  ))}
                  {sizes.length > 4 && (
                    <span className="text-[10px] text-neutral-400">+{sizes.length - 4}</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Pricing & Mobile WhatsApp CTA */}
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-neutral-900 font-sans">
                ₹{(product.discountPrice || product.price).toLocaleString("en-IN")}
              </span>
              {hasDiscount && (
                <span className="text-xs text-neutral-400 line-through">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {/* Visible on Mobile, hidden on desktop where hover bar handles it */}
            <button
              onClick={() => setModalOpen(true)}
              className="lg:hidden p-2 rounded-full bg-[#25D366] text-white shadow-sm hover:bg-[#1ebd59] transition-transform active:scale-90"
              title="Order on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
            </button>
          </div>
        </div>
      </div>

      {/* WhatsApp Modal with exact product data */}
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
          imageUrl: primaryImage,
        }}
        selectedSize={sizes[0]}
      />
    </>
  );
}
