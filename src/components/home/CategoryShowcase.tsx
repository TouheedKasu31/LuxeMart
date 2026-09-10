"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch((err) => console.error("Error loading categories:", err))
      .finally(() => setLoading(false));
  }, []);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      checkScroll();
      return () => el.removeEventListener("scroll", checkScroll);
    }
  }, [categories]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const offset = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -offset : offset,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <section className="py-14 sm:py-16 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="h-6 w-48 bg-neutral-100 rounded animate-pulse" />
            <div className="h-8 w-24 bg-neutral-100 rounded-full animate-pulse" />
          </div>
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="w-48 sm:w-56 aspect-[3/4] flex-shrink-0 bg-neutral-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-14 sm:py-16 bg-white border-b border-neutral-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title and Slider Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-semibold">
              Curated Classifications
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl text-neutral-900 font-normal mt-1.5">
              Browse By Category
            </h2>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Slider Navigation Arrows */}
            <div className="flex items-center gap-1.5 bg-neutral-100/80 p-1 rounded-full border border-neutral-200">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                disabled={!canScrollLeft}
                aria-label="Previous categories"
                className={`p-2 rounded-full transition-all ${
                  canScrollLeft
                    ? "text-black hover:bg-white shadow-sm active:scale-95 cursor-pointer"
                    : "text-neutral-300 cursor-not-allowed"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll("right")}
                disabled={!canScrollRight}
                aria-label="Next categories"
                className={`p-2 rounded-full transition-all ${
                  canScrollRight
                    ? "text-black hover:bg-white shadow-sm active:scale-95 cursor-pointer"
                    : "text-neutral-300 cursor-not-allowed"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <Link
              href="/categories"
              className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-neutral-900 hover:text-neutral-600 transition-colors border-b border-black pb-0.5 ml-2"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Categories Horizontal Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 pt-1 px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((category) => {
            const productCount = category._count?.products || 0;
            const fallbackImage =
              "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80";

            return (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="group relative flex-shrink-0 w-44 sm:w-52 lg:w-56 snap-start flex flex-col rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-200/90 hover:border-neutral-900 transition-all duration-300 shadow-sm hover:shadow-xl active:scale-[0.98]"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-200">
                  <Image
                    src={category.image || fallbackImage}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 176px, (max-width: 1024px) 208px, 224px"
                    className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                  <div className="absolute bottom-3.5 inset-x-3.5 text-white">
                    <span className="text-[10px] uppercase tracking-wider font-medium text-amber-300 block mb-1">
                      Collection
                    </span>
                    <h3 className="text-sm font-semibold tracking-wide leading-snug group-hover:text-amber-200 transition-colors">
                      {category.name}
                    </h3>
                    <span className="text-[11px] text-neutral-300 font-light block mt-1">
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
