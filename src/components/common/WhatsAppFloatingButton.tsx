"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSettings } from "@/lib/settings-context";

export default function WhatsAppFloatingButton() {
  const { whatsapp_number } = useSettings();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);

  useEffect(() => {
    // Show after 1.5 seconds of page load
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Do not show on admin pages
  if (pathname.startsWith("/admin") || !visible) {
    return null;
  }

  const phone = whatsapp_number || process.env.NEXT_PUBLIC_DEFAULT_WHATSAPP || "918451812014";
  const defaultMessage = encodeURIComponent(
    "Assalamualaikum, I am visiting your catalogue and need styling advice / order assistance."
  );

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Interactive Tooltip Bubble */}
      {!tooltipDismissed && (
        <div className="relative bg-white text-neutral-800 text-xs px-3.5 py-2.5 rounded-xl shadow-xl border border-neutral-200 max-w-[220px] animate-in slide-in-from-bottom-2 duration-300">
          <button
            onClick={() => setTooltipDismissed(true)}
            className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-neutral-200 hover:bg-neutral-300 rounded-full flex items-center justify-center text-neutral-600"
          >
            <X className="w-2.5 h-2.5" />
          </button>
          <p className="font-semibold text-neutral-900 mb-0.5">Need styling help?</p>
          <p className="text-[11px] text-neutral-500 leading-tight">
            Chat directly with us on WhatsApp for fast orders!
          </p>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={`https://wa.me/${phone}?text=${defaultMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact Store on WhatsApp"
        className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#1ebd59] text-white rounded-full shadow-2xl transition-transform duration-300 hover:scale-110 active:scale-95 whatsapp-glow"
      >
        <MessageCircle className="w-7 h-7 fill-white" />
        <span className="sr-only">Order on WhatsApp</span>
      </a>
    </div>
  );
}
