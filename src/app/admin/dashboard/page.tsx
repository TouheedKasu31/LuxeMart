import React from "react";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import {
  Package,
  FolderTree,
  CheckCircle2,
  AlertTriangle,
  Star,
  PlusCircle,
  ArrowRight,
  ExternalLink,
  Edit,
  Eye,
} from "lucide-react";

export const revalidate = 0; // Fresh metrics

export default async function AdminDashboardPage() {
  // Aggregate real stats from database
  const [
    totalProducts,
    totalCategories,
    availableProducts,
    outOfStockProducts,
    featuredProducts,
    recentProducts,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.product.count({ where: { availability: true, stock: { gt: 0 } } }),
    prisma.product.count({ where: { OR: [{ availability: false }, { stock: { lte: 0 } }] } }),
    prisma.product.count({ where: { featured: true } }),
    prisma.product.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        images: { orderBy: [{ isPrimary: "desc" }, { displayOrder: "asc" }], take: 1 },
      },
    }),
  ]);

  const cards = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "bg-blue-50 text-blue-700 border-blue-200",
      href: "/admin/products",
    },
    {
      title: "Active Categories",
      value: totalCategories,
      icon: FolderTree,
      color: "bg-purple-50 text-purple-700 border-purple-200",
      href: "/admin/categories",
    },
    {
      title: "In Stock & Available",
      value: availableProducts,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      href: "/admin/products?status=in-stock",
    },
    {
      title: "Out of Stock Items",
      value: outOfStockProducts,
      icon: AlertTriangle,
      color: "bg-rose-50 text-rose-700 border-rose-200",
      href: "/admin/products?status=out-of-stock",
    },
    {
      title: "Featured Showcase",
      value: featuredProducts,
      icon: Star,
      color: "bg-amber-50 text-amber-700 border-amber-200",
      href: "/admin/products?featured=true",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome header & Quick CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">
            Welcome to Store Console
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Real-time inventory overview & product management for WhatsApp commerce.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold tracking-wide transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-semibold tracking-wide transition-all"
          >
            <FolderTree className="w-4 h-4" />
            <span>Categories</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className={`p-5 rounded-2xl border transition-all duration-200 hover:shadow-md ${card.color} block`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
                  {card.title}
                </span>
                <Icon className="w-5 h-5 opacity-90" />
              </div>
              <p className="text-3xl font-extrabold mt-3 tracking-tight font-sans">
                {card.value}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Recent Products Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-neutral-900">Recently Added Products</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Instant reflection on the public store and WhatsApp order payloads.
            </p>
          </div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-black"
          >
            <span>View All ({totalProducts})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/80 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider border-b border-neutral-200">
                <th className="py-3.5 px-5">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs text-neutral-800">
              {recentProducts.map((p) => {
                const img = p.images[0]?.imageUrl || "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=200&q=80";
                return (
                  <tr key={p.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-12 rounded bg-neutral-100 overflow-hidden flex-shrink-0 border border-neutral-200">
                          <Image src={img} alt={p.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900">{p.name}</p>
                          <span className="font-mono text-[10px] text-neutral-400">
                            SKU: {p.sku}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600">
                      {p.category?.name || "Uncategorized"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-neutral-900">
                        ₹{(p.discountPrice || p.price).toLocaleString("en-IN")}
                      </span>
                      {p.discountPrice && (
                        <span className="block text-[10px] text-neutral-400 line-through">
                          ₹{p.price.toLocaleString("en-IN")}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-semibold ${
                          p.stock <= 0 ? "text-rose-600" : p.stock < 5 ? "text-amber-600" : "text-neutral-900"
                        }`}
                      >
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {p.availability && p.stock > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/product/${p.slug}`}
                          target="_blank"
                          className="p-1.5 text-neutral-500 hover:text-black rounded hover:bg-neutral-100"
                          title="View on Public Store"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="p-1.5 text-neutral-500 hover:text-blue-600 rounded hover:bg-neutral-100"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
