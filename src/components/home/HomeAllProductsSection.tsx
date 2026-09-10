"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, LayoutGrid } from "lucide-react";
import ProductCard from "../product/ProductCard";

export default function HomeAllProductsSection() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?limit=8")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch((err) => console.error("Error loading products:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-48 bg-neutral-100 rounded animate-pulse mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-[3/4] bg-neutral-100 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-neutral-400 font-semibold mb-2">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Complete Wardrobe</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-neutral-900 font-normal">
            The Haute Catalogue
          </h2>
          <p className="text-sm text-neutral-500 mt-2 font-light">
            Every garment is tailored to precision. Pick any item to inspect fabric composition, size variants, or order directly with our boutique stylists on WhatsApp.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 px-8 py-4 bg-neutral-900 hover:bg-black text-white text-xs font-semibold tracking-widest uppercase rounded-md shadow-md transition-all active:scale-95"
          >
            <span>Open Filterable Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
