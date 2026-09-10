"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, FolderOpen } from "lucide-react";

interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  _count?: {
    products: number;
  };
}

export default function CategoryShowcase() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch((err) => console.error("Error loading categories:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="h-6 w-48 bg-neutral-100 rounded animate-pulse" />
          <div className="h-4 w-24 bg-neutral-100 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-[4/5] bg-neutral-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-16 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-semibold">
              Curated Classifications
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl text-neutral-900 font-normal mt-1.5">
              Browse By Category
            </h2>
          </div>
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-neutral-900 hover:text-neutral-600 transition-colors border-b border-black pb-0.5 self-start sm:self-auto"
          >
            <span>View All Categories</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Dynamic Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((category) => {
            const productCount = category._count?.products || 0;
            const fallbackImage =
              "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80";

            return (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="group relative flex flex-col rounded-xl overflow-hidden bg-neutral-50 border border-neutral-200/80 hover:border-neutral-900 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-200">
                  <Image
                    src={category.image || fallbackImage}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-3 inset-x-3 text-white">
                    <h3 className="text-xs sm:text-sm font-semibold tracking-wide leading-tight group-hover:text-amber-200 transition-colors">
                      {category.name}
                    </h3>
                    <span className="text-[11px] text-neutral-300 font-light block mt-0.5">
                      {productCount} {productCount === 1 ? "Product" : "Products"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
