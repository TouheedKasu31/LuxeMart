"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface StoreSettings {
  store_name: string;
  store_tagline: string;
  whatsapp_number: string;
  currency_symbol: string;
  greeting_template: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_image_main?: string;
  hero_image_watches?: string;
  hero_image_shoes?: string;
}

const defaultSettings: StoreSettings = {
  store_name: "LuxeMart",
  store_tagline: "Fashion & Lifestyle Store",
  whatsapp_number: "918451812014",
  currency_symbol: "₹",
  greeting_template: "Assalamualaikum, I would like to place an order for the following item:",
  hero_title: "Your Complete Fashion & Lifestyle Store.",
  hero_subtitle: "Explore trending Men's & Women's clothing, luxury timepieces, designer footwear, and accessories. Order effortlessly on WhatsApp.",
  hero_image_main: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85",
  hero_image_watches: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
  hero_image_shoes: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
};

interface SettingsContextType extends StoreSettings {
  refreshSettings: () => Promise<void>;
}

const defaultContext: SettingsContextType = {
  ...defaultSettings,
  refreshSettings: async () => {},
};

const SettingsContext = createContext<SettingsContextType>(defaultContext);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings", { cache: "no-store" });
      const data = await res.json();
      if (data && !data.error) {
        setSettings((prev) => ({ ...prev, ...data }));
      }
    } catch (e) {
      console.error("Failed to load settings:", e);
    }
  };

  useEffect(() => {
    fetchSettings();

    const handleUpdate = () => {
      fetchSettings();
    };

    window.addEventListener("settings-updated", handleUpdate);
    return () => window.removeEventListener("settings-updated", handleUpdate);
  }, []);

  return (
    <SettingsContext.Provider value={{ ...settings, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
