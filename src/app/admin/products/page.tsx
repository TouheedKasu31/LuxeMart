"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  Check,
  X,
  RotateCcw,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();
      if (Array.isArray(prodData)) setProducts(prodData);
      if (Array.isArray(catData)) setCategories(catData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    setDeleteError("");

    try {
      const res = await fetch(`/api/products/${productToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete product");
      }

      setProducts(products.filter((p) => p.id !== productToDelete.id));
      setDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (err: any) {
      setDeleteError(err.message || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  // Filter products locally for instantaneous UI response
  const filteredProducts = products.filter((p) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.category?.name && p.category.name.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (selectedCategory !== "all" && p.categoryId !== selectedCategory) {
      return false;
    }

    if (statusFilter === "in-stock" && (!p.availability || p.stock <= 0)) {
      return false;
    }

    if (statusFilter === "out-of-stock" && p.availability && p.stock > 0) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">
            Product Catalogue Management
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Create, update pricing, images, and inventory for your WhatsApp boutique.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold tracking-wide transition-all shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU..."
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs text-neutral-700 focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs text-neutral-700 focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="all">All Statuses</option>
            <option value="in-stock">In Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>

          {(search || selectedCategory !== "all" || statusFilter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
                setStatusFilter("all");
              }}
              className="p-2 text-neutral-500 hover:text-black text-xs flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Products Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-neutral-400">Loading products...</div>
        ) : filteredProducts.length > 0 ? (
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
                {filteredProducts.map((p) => {
                  const img =
                    p.images?.find((i: any) => i.isPrimary)?.imageUrl ||
                    p.images?.[0]?.imageUrl ||
                    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=200&q=80";

                  return (
                    <tr key={p.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-14 rounded-lg bg-neutral-100 overflow-hidden flex-shrink-0 border border-neutral-200">
                            <Image src={img} alt={p.name} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="font-semibold text-neutral-900">{p.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-600">
                                SKU: {p.sku}
                              </span>
                              {p.featured && (
                                <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">
                                  Featured
                                </span>
                              )}
                              {p.newArrival && (
                                <span className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded">
                                  New
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-600">
                        {p.category?.name || "Uncategorized"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-neutral-900 font-sans">
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
                            p.stock <= 0
                              ? "text-rose-600 font-bold"
                              : p.stock < 5
                              ? "text-amber-600"
                              : "text-neutral-900"
                          }`}
                        >
                          {p.stock} units
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {p.availability && p.stock > 0 ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            In Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Unavailable
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/product/${p.slug}`}
                            target="_blank"
                            className="p-2 text-neutral-500 hover:text-black rounded-lg hover:bg-neutral-100"
                            title="View on Store"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            className="p-2 text-neutral-500 hover:text-blue-600 rounded-lg hover:bg-neutral-100"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              setProductToDelete(p);
                              setDeleteModalOpen(true);
                              setDeleteError("");
                            }}
                            className="p-2 text-neutral-500 hover:text-rose-600 rounded-lg hover:bg-neutral-100"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center text-neutral-500">
            <p className="text-sm font-semibold">No products found</p>
            <p className="text-xs text-neutral-400 mt-1">
              Add your first product to start building your catalogue.
            </p>
            <Link
              href="/admin/products/new"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-xs font-medium"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900">Delete Product?</h3>
                <p className="text-xs text-neutral-500">This action cannot be undone.</p>
              </div>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-700 mb-4 space-y-1">
              <p>
                <strong>Product:</strong> {productToDelete.name}
              </p>
              <p>
                <strong>SKU:</strong> {productToDelete.sku}
              </p>
              <p className="text-[11px] text-neutral-500">
                All associated variants and uploaded images will be safely cleaned up.
              </p>
            </div>

            {deleteError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg mb-4">
                {deleteError}
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleting}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deleting ? "Deleting..." : "Confirm Delete"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
