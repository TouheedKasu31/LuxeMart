"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface StoreSettings {
  store_name: string;
  store_tagline: string;
  whatsapp_number: string;
  currency_symbol: string;
  greeting_template: string;
}

const defaultSettings: StoreSettings = {
  store_name: "MAISON ÉLÉGANCE",
  store_tagline: "Timeless Haute Couture & Modern Luxury",
  whatsapp_number: "919876543210",
  currency_symbol: "₹",
  greeting_template: "Assalamualaikum, I would like to place an order for the following item:",
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
