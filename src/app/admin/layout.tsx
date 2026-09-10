"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderTree,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Store,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (e) {
      console.error(e);
    }
  };

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Add Product", href: "/admin/products/new", icon: PlusCircle },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Store Settings", href: "/admin/settings", icon: Settings },
  ];

  // Login page: no sidebar, just render the page
  if (isLoginPage) {
    return <div className="min-h-screen bg-neutral-900">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col lg:flex-row font-sans">
      {/* Mobile Topbar */}
      <div className="lg:hidden bg-neutral-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="font-bold text-sm tracking-wider">ADMIN CONSOLE</span>
        </div>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-1.5 text-neutral-300 hover:text-white"
        >
          {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileNavOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-neutral-900 text-neutral-300 flex flex-col justify-between transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          mobileNavOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Brand header */}
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between flex-shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white font-bold text-sm tracking-wider uppercase">
                  Maison Console
                </span>
              </div>
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest block mt-0.5">
                Owner Dashboard
              </span>
            </div>
            <button
              onClick={() => setMobileNavOpen(false)}
              className="lg:hidden text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="p-4 space-y-1 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                    isActive
                      ? "bg-white text-black font-bold shadow-sm"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-black" : "text-neutral-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section: Live Store link & Logout */}
          <div className="p-4 border-t border-neutral-800 space-y-2 flex-shrink-0">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3 py-2 text-xs text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Store className="w-4 h-4 text-neutral-400" />
                <span>Public Storefront</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Secure Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content View */}
      <main className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        {/* Top bar on Desktop */}
        <header className="hidden lg:flex items-center justify-between bg-white border-b border-neutral-200 px-8 py-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
              Management Portal
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-neutral-500">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-md font-medium transition-colors"
            >
              <span>View Store</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-md font-medium transition-colors text-xs"
            >
              <LogOut className="w-3 h-3" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
}
