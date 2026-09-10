"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  FolderTree,
  PlusCircle,
  Edit,
  Trash2,
  Upload,
  Check,
  X,
  AlertCircle,
  Folder,
} from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  _count?: {
    products: number;
  };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState("0");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const loadCategories = () => {
    setLoading(true);
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setName("");
    setDescription("");
    setImage("");
    setIsActive(true);
    setSortOrder(String(categories.length + 1));
    setError("");
    setModalOpen(true);
  };

  const handleOpenEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || "");
    setImage(cat.image || "");
    setIsActive(cat.isActive);
    setSortOrder(String(cat.sortOrder));
    setError("");
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("folder", "categories");
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload image");

      if (data.files?.[0]?.url) {
        setImage(data.files[0].url);
      }
    } catch (err: any) {
      setError(err.message || "Upload error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const url = editingCategory
        ? `/api/categories/${editingCategory.id}`
        : "/api/categories";

      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          image,
          isActive,
          sortOrder: Number(sortOrder),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save category");

      setModalOpen(false);
      loadCategories();
    } catch (err: any) {
      setError(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    setDeleting(true);
    setDeleteError("");

    try {
      const res = await fetch(`/api/categories/${categoryToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete category");
      }

      setDeleteModalOpen(false);
      setCategoryToDelete(null);
      loadCategories();
    } catch (err: any) {
      setDeleteError(err.message || "Failed to delete category");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">
            Category Management
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Organize fashion departments, hero showcase banners, and catalogue classifications.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold tracking-wide transition-all shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Table / Cards */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-neutral-400">Loading categories...</div>
        ) : categories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/80 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider border-b border-neutral-200">
                  <th className="py-3.5 px-5">Category</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Products</th>
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs text-neutral-800">
                {categories.map((c) => {
                  const prodCount = c._count?.products || 0;
                  const img =
                    c.image ||
                    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=200&q=80";

                  return (
                    <tr key={c.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden flex-shrink-0 border border-neutral-200">
                            <Image src={img} alt={c.name} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="font-semibold text-neutral-900">{c.name}</p>
                            <p className="text-[11px] text-neutral-500 line-clamp-1">
                              {c.description || "No description"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-600">
                        /{c.slug}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-neutral-900">
                          {prodCount} {prodCount === 1 ? "product" : "products"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-neutral-600">
                        {c.sortOrder}
                      </td>
                      <td className="py-3.5 px-4">
                        {c.isActive ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                            Disabled
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(c)}
                            className="p-2 text-neutral-500 hover:text-blue-600 rounded-lg hover:bg-neutral-100"
                            title="Edit Category"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCategoryToDelete(c);
                              setDeleteModalOpen(true);
                              setDeleteError("");
                            }}
                            className="p-2 text-neutral-500 hover:text-rose-600 rounded-lg hover:bg-neutral-100"
                            title="Delete Category"
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
            <p className="text-sm font-semibold">No categories found</p>
            <button
              onClick={handleOpenCreateModal}
              className="mt-4 px-4 py-2 bg-black text-white rounded-lg text-xs font-medium"
            >
              Create First Category
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-base font-bold text-neutral-900">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Shirts & Tops"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description for customers..."
                  className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Category Image */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Category Image Banner
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-xl bg-neutral-100 overflow-hidden flex-shrink-0 border border-neutral-200">
                    {image ? (
                      <Image src={image} alt="Preview" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400">
                        <Folder className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-xs font-semibold text-neutral-800 cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploading ? "Uploading..." : "Upload Image"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="Or paste image URL"
                      className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Display Sort Order
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 rounded text-black focus:ring-black accent-black"
                    />
                    <span className="text-xs font-medium text-neutral-800">
                      Enable Category
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  {saving ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900">Delete Category?</h3>
                <p className="text-xs text-neutral-500">
                  Category: <strong>{categoryToDelete.name}</strong>
                </p>
              </div>
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
