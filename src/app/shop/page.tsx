"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
  Sparkles,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter States
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [selectedSize, setSelectedSize] = useState(searchParams.get("size") || "all");
  const [selectedSort, setSelectedSort] = useState(searchParams.get("sort") || "newest");
  const [inStockOnly, setInStockOnly] = useState(searchParams.get("availability") === "true");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "10000");

  const commonSizes = ["S", "M", "L", "XL", "XXL", "30", "32", "34", "38R", "40R", "54 (Regular)", "One Size"];

  // Fetch categories once
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});
  }, []);

  // Fetch filtered products whenever filters change
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();

    if (search.trim()) params.set("search", search.trim());
    if (selectedCategory && selectedCategory !== "all") params.set("category", selectedCategory);
    if (selectedSize && selectedSize !== "all") params.set("size", selectedSize);
    if (inStockOnly) params.set("availability", "true");
    if (maxPrice && Number(maxPrice) < 10000) params.set("maxPrice", maxPrice);
    if (selectedSort) params.set("sort", selectedSort);

    if (searchParams.get("newArrival") === "true") params.set("newArrival", "true");
    if (searchParams.get("featured") === "true") params.set("featured", "true");

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch((err) => console.error("Filter fetch error:", err))
      .finally(() => setLoading(false));
  }, [search, selectedCategory, selectedSize, selectedSort, inStockOnly, maxPrice, searchParams]);

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedSize("all");
    setSelectedSort("newest");
    setInStockOnly(false);
    setMaxPrice("10000");
    router.push("/shop");
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedCategory !== "all" ||
    selectedSize !== "all" ||
    inStockOnly ||
    Number(maxPrice) < 10000;

  return (
    <div className="bg-white min-h-screen">
      {/* Shop Header Banner */}
      <div className="bg-neutral-50 border-b border-neutral-200 py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-neutral-400 font-semibold">
            The Complete Collection
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl text-neutral-900 font-normal mt-2">
            Haute Couture Catalogue
          </h1>
          <p className="text-sm text-neutral-500 max-w-xl mx-auto mt-2 font-light">
            Filter by cut, fabric, size, and pricing. Every product connects directly to WhatsApp order concierge.
          </p>

          {/* Search bar inside header */}
          <div className="max-w-xl mx-auto mt-6">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 absolute left-4 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, SKU (e.g. SH-102), categories..."
                className="w-full pl-12 pr-10 py-3.5 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black shadow-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 p-1 text-neutral-400 hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 border border-neutral-200 rounded-lg text-xs font-semibold text-neutral-800"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters {hasActiveFilters && "(Active)"}</span>
            </button>

            <span className="text-xs text-neutral-500">
              Showing <strong className="text-neutral-900">{products.length}</strong> items
            </span>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium ml-2"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear all</span>
              </button>
            )}
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <label className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">
              Sort:
            </label>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs font-medium text-neutral-800 focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </div>

        {/* Main Body: Desktop Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-3 space-y-8 pr-6 border-r border-neutral-100">
            {/* Category Filter */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-widest font-bold text-black">
                Categories
              </h3>
              <div className="space-y-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className={`block w-full text-left py-1.5 px-2 rounded-md transition-colors ${
                    selectedCategory === "all"
                      ? "bg-neutral-900 text-white font-medium"
                      : "text-neutral-600 hover:text-black hover:bg-neutral-50"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCategory(c.slug)}
                    className={`block w-full text-left py-1.5 px-2 rounded-md transition-colors ${
                      selectedCategory === c.slug
                        ? "bg-neutral-900 text-white font-medium"
                        : "text-neutral-600 hover:text-black hover:bg-neutral-50"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className="space-y-3 pt-6 border-t border-neutral-100">
              <h3 className="text-xs uppercase tracking-widest font-bold text-black">
                Filter by Size
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSize("all")}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    selectedSize === "all"
                      ? "bg-black text-white"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  All
                </button>
                {commonSizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      selectedSize === s
                        ? "bg-black text-white"
                        : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-3 pt-6 border-t border-neutral-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-widest font-bold text-black">
                  Max Price
                </h3>
                <span className="text-xs font-bold text-black">
                  ₹{Number(maxPrice).toLocaleString("en-IN")}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="250"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full accent-black cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-neutral-400">
                <span>₹500</span>
                <span>₹10,000+</span>
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="pt-6 border-t border-neutral-100">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-black focus:ring-black accent-black"
                />
                <span className="text-xs font-medium text-neutral-800">
                  In Stock Only
                </span>
              </label>
            </div>
          </div>

          {/* Mobile Filter Drawer */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              <div
                className="fixed inset-0 bg-black/50"
                onClick={() => setMobileFiltersOpen(false)}
              />
              <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 p-5 overflow-y-auto">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4">
                  <h3 className="font-bold text-sm text-black">Filter Catalogue</h3>
                  <button onClick={() => setMobileFiltersOpen(false)}>
                    <X className="w-5 h-5 text-neutral-500" />
                  </button>
                </div>

                {/* Mobile Categories */}
                <div className="space-y-3 mb-6">
                  <h4 className="text-xs uppercase font-bold text-neutral-400">Category</h4>
                  <div className="space-y-1 text-xs">
                    <button
                      onClick={() => {
                        setSelectedCategory("all");
                        setMobileFiltersOpen(false);
                      }}
                      className="block w-full text-left py-1.5"
                    >
                      All
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setSelectedCategory(c.slug);
                          setMobileFiltersOpen(false);
                        }}
                        className="block w-full text-left py-1.5"
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Size */}
                <div className="space-y-3 mb-6">
                  <h4 className="text-xs uppercase font-bold text-neutral-400">Size</h4>
                  <div className="flex flex-wrap gap-2">
                    {commonSizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setSelectedSize(s);
                          setMobileFiltersOpen(false);
                        }}
                        className={`px-2.5 py-1 text-xs rounded border ${
                          selectedSize === s ? "bg-black text-white" : "border-neutral-200"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-neutral-100">
                  <button
                    onClick={() => {
                      resetFilters();
                      setMobileFiltersOpen(false);
                    }}
                    className="w-full py-2.5 text-xs text-rose-600 font-medium"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="lg:col-span-9">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-[3/4] bg-neutral-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 px-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                <p className="text-base font-semibold text-neutral-800">No products match your criteria</p>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your search query, clearing filters, or browsing other categories.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-5 py-2.5 bg-black text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
