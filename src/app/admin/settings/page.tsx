"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  MessageCircle,
  Save,
  Check,
  AlertCircle,
  KeyRound,
  Store,
  Info,
  ExternalLink,
  Lock,
  ShieldCheck,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Change password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState("");
  const [pwdError, setPwdError] = useState("");

  const [settings, setSettings] = useState({
    store_name: "LuxeMart",
    store_tagline: "Quality Clothing & Direct WhatsApp Shopping",
    whatsapp_number: "918451812014",
    currency_symbol: "₹",
    greeting_template: "Assalamualaikum, I would like to place an order for the following item:",
    meta_phone_id: "",
    meta_access_token: "",
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdLoading(true);
    setPwdSuccess("");
    setPwdError("");

    if (newPassword !== confirmPassword) {
      setPwdError("New password and confirm password do not match");
      setPwdLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setPwdError("New password must be at least 6 characters");
      setPwdLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update password");

      setPwdSuccess("Admin password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPwdSuccess(""), 4000);
    } catch (err: any) {
      setPwdError(err.message || "Failed to update password");
    } finally {
      setPwdLoading(false);
    }
  };

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setSettings((prev) => ({
            ...prev,
            ...data,
          }));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError("");

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save settings");

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("settings-updated"));
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-neutral-400">Loading store settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">
            Store & WhatsApp Settings
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Configure order reception phone numbers, greetings, and optional Meta WhatsApp Cloud API credentials.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully and active across store!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Public Store Identity */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Store className="w-4 h-4 text-neutral-700" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-black">
              Store Identity & Currency
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Store Name
              </label>
              <input
                type="text"
                required
                value={settings.store_name}
                onChange={(e) => handleChange("store_name", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Currency Symbol
              </label>
              <input
                type="text"
                required
                value={settings.currency_symbol}
                onChange={(e) => handleChange("currency_symbol", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Brand Tagline
            </label>
            <input
              type="text"
              value={settings.store_tagline}
              onChange={(e) => handleChange("store_tagline", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>

        {/* WhatsApp Channel Configuration */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-black">
              WhatsApp Ordering Channel
            </h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Business WhatsApp Number (with Country Code) *
            </label>
            <input
              type="text"
              required
              value={settings.whatsapp_number}
              onChange={(e) => handleChange("whatsapp_number", e.target.value)}
              placeholder="e.g. 919876543210"
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-black"
            />
            <p className="text-[11px] text-neutral-400 mt-1">
              Digits only including country code (e.g. 91 for India, 1 for USA/Canada, 971 for UAE). All &quot;Order on WhatsApp&quot; buttons open this conversation.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Opening Greeting Line
            </label>
            <input
              type="text"
              value={settings.greeting_template}
              onChange={(e) => handleChange("greeting_template", e.target.value)}
              placeholder="Assalamualaikum, I would like to place an order for the following item:"
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>

        {/* WhatsApp Business Cloud API Configuration (Optional) */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-purple-600" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-black">
                Meta WhatsApp Cloud API (Optional Server Media Dispatch)
              </h2>
            </div>
            <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-200 font-semibold px-2 py-0.5 rounded">
              Advanced Integration
            </span>
          </div>

          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 flex items-start gap-3 text-xs text-neutral-600">
            <Info className="w-5 h-5 text-neutral-500 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>How this operates:</strong>
              <p className="mt-0.5 text-neutral-500">
                By default, the store uses the instantaneous <strong>Open Graph Rich Link Preview</strong> protocol via <code>wa.me</code> click-to-chat. If you also maintain an official Meta WhatsApp Business Cloud API app, filling the fields below activates backend dispatch of native media image messages directly via Meta Graph API.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Phone Number ID (Meta Graph API)
              </label>
              <input
                type="text"
                value={settings.meta_phone_id}
                onChange={(e) => handleChange("meta_phone_id", e.target.value)}
                placeholder="e.g. 1092837465928"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Permanent Access Token
              </label>
              <input
                type="password"
                value={settings.meta_access_token}
                onChange={(e) => handleChange("meta_access_token", e.target.value)}
                placeholder="EAABw..."
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Settings..." : "Save Settings"}</span>
          </button>
        </div>
      </form>

      {/* Admin Account Security & Password Change */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-5">
        <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
          <ShieldCheck className="w-4 h-4 text-neutral-900" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-black">
            Admin Account Security & Password
          </h2>
        </div>

        <p className="text-xs text-neutral-500">
          Update your administrator password to keep your store management console safe and protected.
        </p>

        {pwdError && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{pwdError}</span>
          </div>
        )}

        {pwdSuccess && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{pwdSuccess}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Current Password *
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                New Password *
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Confirm New Password *
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={pwdLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{pwdLoading ? "Updating..." : "Update Password"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
