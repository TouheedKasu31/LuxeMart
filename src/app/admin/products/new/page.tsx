"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Star,
  Check,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface ImageItem {
  imageUrl: string;
  isPrimary: boolean;
}

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("Fabric: 100% Cotton\nFit: Standard Fit\nCare: Machine wash cold");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("15");
  const [availability, setAvailability] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [newArrival, setNewArrival] = useState(true);

  // Variants
  const [sizeInput, setSizeInput] = useState("");
  const [sizes, setSizes] = useState<string[]>(["S", "M", "L", "XL"]);
  const [colourInput, setColourInput] = useState("");
  const [colours, setColours] = useState<string[]>(["Black", "White"]);

  // Images
  const [images, setImages] = useState<ImageItem[]>([]);
  const [urlInput, setUrlInput] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
          if (data.length > 0) setCategoryId(data[0].id);
        }
      })
      .catch(console.error);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("folder", "products");
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload image");

      const newImages = data.files.map((f: any, idx: number) => ({
        imageUrl: f.url,
        isPrimary: images.length === 0 && idx === 0,
      }));

      setImages([...images, ...newImages]);
    } catch (err: any) {
      setError(err.message || "Failed to upload");
    } finally {
      setUploading(false);
    }
  };

  const handleAddImageUrl = () => {
    if (urlInput.trim()) {
      setImages([
        ...images,
        {
          imageUrl: urlInput.trim(),
          isPrimary: images.length === 0,
        },
      ]);
      setUrlInput("");
    }
  };

  const handleSetPrimary = (index: number) => {
    setImages(
      images.map((img, idx) => ({
        ...img,
        isPrimary: idx === index,
      }))
    );
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, idx) => idx !== index);
    if (images[index].isPrimary && updated.length > 0) {
      updated[0].isPrimary = true;
    }
    setImages(updated);
  };

  const handleAddSize = () => {
    if (sizeInput.trim() && !sizes.includes(sizeInput.trim().toUpperCase())) {
      setSizes([...sizes, sizeInput.trim().toUpperCase()]);
      setSizeInput("");
    }
  };

  const handleRemoveSize = (s: string) => {
    setSizes(sizes.filter((item) => item !== s));
  };

  const handleAddColour = () => {
    if (colourInput.trim() && !colours.includes(colourInput.trim())) {
      setColours([...colours, colourInput.trim()]);
      setColourInput("");
    }
  };

  const handleRemoveColour = (c: string) => {
    setColours(colours.filter((item) => item !== c));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !sku.trim() || !categoryId || !price) {
      setError("Please fill all required fields: Name, SKU, Category, and Price.");
      return;
    }

    if (images.length === 0) {
      setError("Please add at least one product image.");
      return;
    }

    setLoading(true);

    try {
      // Build variants combinations
      const variantList: any[] = [];
      for (const s of sizes.length > 0 ? sizes : ["Standard"]) {
        for (const c of colours.length > 0 ? colours : ["Standard"]) {
          variantList.push({
            size: s,
            colour: c,
            stock: Math.max(1, Math.floor(Number(stock) / Math.max(1, sizes.length * colours.length))),
          });
        }
      }

      const payload = {
        name: name.trim(),
        sku: sku.trim().toUpperCase(),
        categoryId,
        description: description.trim(),
        details: details.trim(),
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : null,
        stock: Number(stock) || 0,
        availability,
        featured,
        newArrival,
        images,
        variants: variantList,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create product");
      }

      router.push("/admin/products");
    } catch (err: any) {
      setError(err.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 text-neutral-500 hover:text-black rounded-lg hover:bg-white border border-transparent hover:border-neutral-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-neutral-900">Add New Product</h1>
            <p className="text-xs text-neutral-500">
              Create an item in the catalogue with images, SKU, and variants.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Card */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-black border-b border-neutral-100 pb-3">
            Product Essentials
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Black Oversized Poplin Shirt"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Product SKU / ID *
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. SH-102"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono uppercase focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-black"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Regular Price (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="1999"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Discount Price (₹)
              </label>
              <input
                type="number"
                min="0"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="Optional, e.g. 1499"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of the garment, cut, design details, occasion..."
              className="w-full p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Fabric, Fit & Care Specifications
            </label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Fabric: 100% Belgian Linen&#10;Fit: Relaxed Straight Fit&#10;Care: Dry clean recommended"
              className="w-full p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>

        {/* Product Images Card (Requirement 8) */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-black">
                Product Image Gallery *
              </h2>
              <p className="text-[11px] text-neutral-400">
                Upload multiple photos (front, back, fabric detail). Set one as Primary Thumbnail.
              </p>
            </div>
            <span className="text-xs font-semibold text-neutral-500">
              {images.length} images added
            </span>
          </div>

          {/* Upload input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="border-2 border-dashed border-neutral-300 hover:border-black rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-neutral-50/50 hover:bg-neutral-50">
              <Upload className="w-6 h-6 text-neutral-500 mb-2" />
              <span className="text-xs font-semibold text-neutral-800">
                {uploading ? "Uploading files..." : "Upload from Device"}
              </span>
              <span className="text-[10px] text-neutral-400 mt-1">JPEG, PNG, WEBP (Max 10MB)</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>

            {/* URL Fallback input */}
            <div className="border border-neutral-200 rounded-xl p-4 flex flex-col justify-center space-y-2 bg-neutral-50/30">
              <span className="text-xs font-semibold text-neutral-700">Or Add by Direct Image URL:</span>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-black"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-3 py-2 bg-neutral-800 hover:bg-black text-white rounded-lg text-xs font-semibold"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Images preview list */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative aspect-[3/4] rounded-xl overflow-hidden bg-neutral-100 border-2 transition-all group ${
                    img.isPrimary ? "border-emerald-600 shadow-md ring-2 ring-emerald-600/30" : "border-neutral-200"
                  }`}
                >
                  <Image src={img.imageUrl} alt={`Preview ${idx + 1}`} fill className="object-cover" />

                  {/* Primary Badge */}
                  {img.isPrimary && (
                    <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1 z-10">
                      <Star className="w-3 h-3 fill-white" />
                      <span>Primary</span>
                    </div>
                  )}

                  {/* Overlay Controls */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="self-end p-1.5 bg-rose-600 text-white rounded-full hover:bg-rose-700 shadow-sm"
                      title="Delete Image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    {!img.isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(idx)}
                        className="w-full py-1.5 bg-white text-black text-[11px] font-bold rounded shadow-sm hover:bg-neutral-100"
                      >
                        Set Primary
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Variants & Inventory Card */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-black border-b border-neutral-100 pb-3">
            Variants & Stock Management
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Sizes */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Available Sizes
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  placeholder="e.g. XXL, 36, 42R"
                  className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSize();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddSize}
                  className="px-3 py-2 bg-neutral-900 text-white rounded-lg text-xs font-medium"
                >
                  Add Size
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {sizes.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 text-neutral-800 rounded-md text-xs font-medium border border-neutral-200"
                  >
                    <span>{s}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSize(s)}
                      className="text-neutral-400 hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Colours */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Available Colours
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={colourInput}
                  onChange={(e) => setColourInput(e.target.value)}
                  placeholder="e.g. Deep Olive, Sand"
                  className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddColour();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddColour}
                  className="px-3 py-2 bg-neutral-900 text-white rounded-lg text-xs font-medium"
                >
                  Add Colour
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {colours.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 text-neutral-800 rounded-md text-xs font-medium border border-neutral-200"
                  >
                    <span>{c}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveColour(c)}
                      className="text-neutral-400 hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Total Stock Quantity
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs"
              />
            </div>

            {/* Visibility Toggles */}
            <div className="flex flex-col justify-center space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={availability}
                  onChange={(e) => setAvailability(e.target.checked)}
                  className="w-4 h-4 rounded text-black focus:ring-black accent-black"
                />
                <span className="text-xs font-medium text-neutral-800">
                  Available for Purchase (In Stock)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-black focus:ring-black accent-black"
                />
                <span className="text-xs font-medium text-neutral-800">
                  Feature in Homepage Showcase
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newArrival}
                  onChange={(e) => setNewArrival(e.target.checked)}
                  className="w-4 h-4 rounded text-black focus:ring-black accent-black"
                />
                <span className="text-xs font-medium text-neutral-800">
                  Mark as New Arrival
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex gap-4 justify-end pt-4">
          <Link
            href="/admin/products"
            className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-semibold transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {loading ? "Publishing Product..." : "Publish Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
