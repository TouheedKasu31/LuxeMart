"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Folder } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner */}
      <div className="bg-neutral-50 border-b border-neutral-200 py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-semibold">
            Catalogue Directory
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl text-neutral-900 font-normal mt-2">
            Fashion Categories & Collections
          </h1>
          <p className="text-sm text-neutral-500 max-w-xl mx-auto mt-2 font-light">
            Explore our collections by category, designed for everyday comfort, festive occasions, and formal wear.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[4/3] bg-neutral-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => {
              const productCount = category._count?.products || 0;
              const fallbackImage =
                "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80";

              return (
                <Link
                  key={category.id}
                  href={`/shop?category=${category.slug}`}
                  className="group relative flex flex-col rounded-2xl overflow-hidden bg-white border border-neutral-200 hover:border-black transition-all duration-300 shadow-sm hover:shadow-xl"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                    <Image
                      src={category.image || fallbackImage}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    <div className="absolute bottom-5 inset-x-5 text-white">
                      <span className="text-[11px] uppercase tracking-widest font-semibold text-neutral-300 block mb-1">
                        {productCount} {productCount === 1 ? "Product" : "Products"} Available
                      </span>
                      <h2 className="font-serif-luxury text-xl sm:text-2xl font-normal group-hover:text-amber-200 transition-colors">
                        {category.name}
                      </h2>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col justify-between flex-1 bg-white">
                    <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                      {category.description || "Discover premium garments in this category."}
                    </p>

                    <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-neutral-900 group-hover:text-black">
                      <span>Explore Collection</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
