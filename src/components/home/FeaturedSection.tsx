"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import ProductCard from "../product/ProductCard";

export default function FeaturedSection() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?featured=true&limit=4")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch((err) => console.error("Error loading featured products:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-neutral-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-60 bg-neutral-200 rounded animate-pulse mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-neutral-100 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-neutral-400 font-semibold mb-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Couture Spotlight</span>
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl text-neutral-900 font-normal">
              Featured Creations
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Hand-selected signature pieces loved by our discerning clientele.
            </p>
          </div>

          <Link
            href="/shop?featured=true"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-neutral-900 hover:text-neutral-600 transition-colors border-b border-black pb-0.5 self-start sm:self-auto"
          >
            <span>View All Featured</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
