"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, MessageCircle, Copy, Check, Share2, ExternalLink, Info } from "lucide-react";
import { buildWhatsAppOrderMessage, generateWhatsAppLink, WhatsAppOrderData } from "@/lib/whatsapp";
import { useSettings } from "@/lib/settings-context";

interface WhatsAppOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    sku: string;
    name: string;
    slug: string;
    price: number;
    discountPrice?: number | null;
    imageUrl?: string;
  };
  selectedSize?: string;
  selectedColour?: string;
  storePhone?: string;
}

export default function WhatsAppOrderModal({
  isOpen,
  onClose,
  product,
  selectedSize,
  selectedColour,
  storePhone,
}: WhatsAppOrderModalProps) {
  const { whatsapp_number } = useSettings();
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [canShare, setCanShare] = useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined" && typeof navigator !== "undefined" && "share" in navigator) {
      setCanShare(true);
    }
  }, []);

  if (!isOpen) return null;

  const siteUrl = typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
  const productUrl = `${siteUrl}/product/${product.slug}`;

  const orderData: WhatsAppOrderData = {
    productName: product.name,
    sku: product.sku,
    price: product.price,
    discountPrice: product.discountPrice,
    currency: "₹",
    size: selectedSize,
    colour: selectedColour,
    productUrl,
    imageUrl: product.imageUrl,
    storePhone: whatsapp_number || storePhone || "918451812014",
  };

  const formattedMessage = buildWhatsAppOrderMessage(orderData);
  const waLink = generateWhatsAppLink(orderData);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        setIsSharing(true);
        // Try sharing text + url
        await navigator.share({
          title: `Order: ${product.name} (${product.sku})`,
          text: formattedMessage,
          url: productUrl,
        });
      } catch (err) {
        // User cancelled or unsupported
      } finally {
        setIsSharing(false);
      }
    } else {
      window.open(waLink, "_blank");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#075E54] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-inner">
              <MessageCircle className="w-6 h-6 fill-white" />
            </div>
            <div>
              <h3 className="font-semibold text-base sm:text-lg">Order via WhatsApp</h3>
              <p className="text-xs text-emerald-100">
                Direct boutique conversation with live product preview
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-100 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 bg-neutral-50 flex-1">
          {/* Exact Product Identification Card */}
          <div className="bg-white p-3.5 rounded-xl border border-neutral-200 flex items-center gap-4 shadow-subtle">
            <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                  No Image
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="inline-block text-[10px] tracking-wider uppercase font-semibold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">
                SKU: {product.sku}
              </span>
              <h4 className="text-sm font-semibold text-neutral-900 truncate mt-1">
                {product.name}
              </h4>
              <div className="flex items-center gap-2 mt-1 text-xs text-neutral-600">
                <span className="font-bold text-black">
                  ₹{(product.discountPrice || product.price).toLocaleString("en-IN")}
                </span>
                {product.discountPrice && (
                  <span className="line-through text-neutral-400">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-1 text-[11px] text-neutral-500">
                {selectedSize && (
                  <span className="bg-neutral-50 px-1.5 py-0.5 border border-neutral-200 rounded">
                    Size: <strong className="text-black">{selectedSize}</strong>
                  </span>
                )}
                {selectedColour && (
                  <span className="bg-neutral-50 px-1.5 py-0.5 border border-neutral-200 rounded">
                    Colour: <strong className="text-black">{selectedColour}</strong>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* WhatsApp Message Preview Chat Bubble */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Live Message Payload
              </span>
              <span className="text-[11px] text-[#075E54] font-medium flex items-center gap-1">
                <Check className="w-3 h-3 text-[#25D366]" /> Dynamic Data Verified
              </span>
            </div>

            {/* WhatsApp simulated chat background */}
            <div className="p-4 rounded-xl bg-[#E5DDD5] border border-neutral-300">
              <div className="bg-[#DCF8C6] text-neutral-900 text-xs p-3.5 rounded-lg shadow-sm font-mono whitespace-pre-wrap leading-relaxed border border-emerald-200/60">
                {formattedMessage}
              </div>
            </div>
          </div>

          {/* Rich Media / Open Graph Explanation Note */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-3 text-xs text-emerald-900">
            <Info className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Product Image & Preview Association:</strong>
              <p className="mt-0.5 text-emerald-800">
                When WhatsApp opens, the verified product link carries exact Open Graph metadata (<code>og:image</code>, <code>og:title</code>). WhatsApp will generate an automatic rich image card in the chat window.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-white border-t border-neutral-200 flex flex-col sm:flex-row gap-2.5">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebd59] text-white py-3 px-4 rounded-xl font-semibold text-sm transition-all shadow-md active:scale-98"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Open in WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 py-3 px-4 rounded-xl text-xs font-semibold transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Text</span>
              </>
            )}
          </button>

          {canShare && (
            <button
              type="button"
              onClick={handleNativeShare}
              disabled={isSharing}
              className="flex items-center justify-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 py-3 px-4 rounded-xl text-xs font-semibold transition-colors sm:hidden"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
