"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, MessageCircle, Menu, X, ShieldCheck } from "lucide-react";
import { useSettings } from "@/lib/settings-context";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

export default function Navbar() {
  const { store_name, whatsapp_number } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Fetch categories for dropdown
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const isHome = pathname === "/";

  // Don't render public navbar on admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
            : "bg-white border-b border-gray-100"
        }`}
      >
        {/* Top Announcement Bar */}
        <div className="bg-neutral-900 text-white text-[11px] sm:text-xs py-1.5 px-4 text-center tracking-widest font-medium uppercase">
          <span>Direct WhatsApp Ordering Available Worldwide • No Checkout Forms</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left: Mobile hamburger & Desktop nav links */}
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-neutral-800 hover:text-black focus:outline-none"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium tracking-wide">
                <Link
                  href="/"
                  className={`transition-colors hover:text-neutral-900 ${
                    pathname === "/" ? "text-black font-semibold border-b-2 border-black pb-1" : "text-neutral-600"
                  }`}
                >
                  HOME
                </Link>
                <Link
                  href="/shop"
                  className={`transition-colors hover:text-neutral-900 ${
                    pathname === "/shop" ? "text-black font-semibold border-b-2 border-black pb-1" : "text-neutral-600"
                  }`}
                >
                  CATALOGUE
                </Link>
                <Link
                  href="/categories"
                  className={`transition-colors hover:text-neutral-900 ${
                    pathname === "/categories" ? "text-black font-semibold border-b-2 border-black pb-1" : "text-neutral-600"
                  }`}
                >
                  COLLECTIONS
                </Link>
                <Link
                  href="/shop?newArrival=true"
                  className="text-neutral-600 hover:text-black transition-colors"
                >
                  NEW IN
                </Link>
              </nav>
            </div>

            {/* Center: Brand Logo */}
            <div className="flex-1 lg:flex-none text-center lg:text-left">
              <Link href="/" className="inline-block">
                <span className="font-serif-luxury text-xl sm:text-2xl md:text-3xl tracking-[0.2em] font-semibold text-black uppercase">
                  {store_name}
                </span>
                <span className="block text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-light -mt-1 text-center">
                  PREMIUM STORE
                </span>
              </Link>
            </div>

            {/* Right: Search, WhatsApp quick CTA & Admin shortcut */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-neutral-700 hover:text-black transition-colors"
                aria-label="Search Catalogue"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Direct WhatsApp CTA Button */}
              <a
                href={`https://wa.me/${whatsapp_number}?text=${encodeURIComponent(
                  "Hello, I am browsing your catalogue and would like to inquire about products."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebd59] text-white px-3.5 py-2 rounded-full text-xs font-semibold tracking-wide transition-transform active:scale-95 shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp Us</span>
              </a>

              {/* Admin Portal Shortcut */}
              <Link
                href="/admin"
                className="p-2 text-neutral-400 hover:text-neutral-800 transition-colors"
                title="Admin Dashboard"
              >
                <ShieldCheck className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Live Search Bar dropdown */}
        {searchOpen && (
          <div className="border-t border-b border-gray-200 bg-white py-4 px-4 sm:px-6 animate-in slide-in-from-top duration-200">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="w-5 h-5 absolute left-3 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by product name, SKU (e.g. SH-102), fabric..."
                  className="w-full pl-11 pr-24 py-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-1.5 bg-black text-white text-xs font-medium rounded-md hover:bg-neutral-800 transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <span className="font-serif-luxury text-lg font-bold tracking-wider text-black">
                  {store_name}
                </span>
                <span className="block text-[10px] tracking-widest text-neutral-400">
                  PRODUCT CATALOGUE
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-neutral-500 hover:text-black"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              <div className="space-y-4 text-base font-medium">
                <Link
                  href="/"
                  className="block py-2 text-neutral-800 hover:text-black border-b border-neutral-100"
                >
                  Home
                </Link>
                <Link
                  href="/shop"
                  className="block py-2 text-neutral-800 hover:text-black border-b border-neutral-100"
                >
                  All Products
                </Link>
                <Link
                  href="/categories"
                  className="block py-2 text-neutral-800 hover:text-black border-b border-neutral-100"
                >
                  Collections & Categories
                </Link>
                <Link
                  href="/shop?featured=true"
                  className="block py-2 text-neutral-800 hover:text-black border-b border-neutral-100"
                >
                  Featured Showcase
                </Link>
                <Link
                  href="/shop?newArrival=true"
                  className="block py-2 text-neutral-800 hover:text-black border-b border-neutral-100"
                >
                  New Arrivals
                </Link>
              </div>

              {categories.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-3">
                    Categories
                  </h4>
                  <div className="space-y-2 text-sm">
                    {categories.map((c) => (
                      <Link
                        key={c.id}
                        href={`/shop?category=${c.slug}`}
                        className="block py-1 text-neutral-600 hover:text-black"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100">
                <a
                  href={`https://wa.me/${whatsapp_number}?text=${encodeURIComponent(
                    "Hello, I am inquiring from the catalogue."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white rounded-lg text-sm font-semibold tracking-wide shadow-sm"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              <div className="pt-2">
                <Link
                  href="/admin/login"
                  className="flex items-center gap-2 text-xs text-neutral-400 hover:text-neutral-700"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Owner / Admin Portal</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
