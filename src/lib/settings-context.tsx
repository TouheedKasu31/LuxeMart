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

const SettingsContext = createContext<StoreSettings>(defaultSettings);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
