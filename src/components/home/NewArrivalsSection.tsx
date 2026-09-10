"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import ProductCard from "../product/ProductCard";

export default function NewArrivalsSection() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?newArrival=true&limit=4")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch((err) => console.error("Error loading new arrivals:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 bg-neutral-50/60 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-neutral-400 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Just Dropped</span>
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl text-neutral-900 font-normal">
              Fresh New Arrivals
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Recently crafted additions to our seasonal wardrobe catalogue.
            </p>
          </div>

          <Link
            href="/shop?newArrival=true"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-neutral-900 hover:text-neutral-600 transition-colors border-b border-black pb-0.5 self-start sm:self-auto"
          >
            <span>Explore All New</span>
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
