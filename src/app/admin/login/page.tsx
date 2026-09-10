"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowRight, KeyRound } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@store.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center mx-auto mb-3 shadow-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide">
            MAISON ÉLÉGANCE
          </h1>
          <p className="text-xs text-neutral-400 mt-1 uppercase tracking-widest">
            Secured Owner & Staff Portal
          </p>
        </div>

        {/* Demo credentials hint box */}
        <div className="bg-neutral-800/80 border border-neutral-700 rounded-xl p-3.5 mb-6 text-xs text-neutral-300">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
            <KeyRound className="w-4 h-4" />
            <span>Default Administrator Credentials:</span>
          </div>
          <div className="text-neutral-400 font-mono text-[11px] space-y-0.5 mt-1">
            <p>Email: <strong className="text-neutral-200">admin@store.com</strong></p>
            <p>Password: <strong className="text-neutral-200">admin123</strong></p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-200 text-xs rounded-lg mb-5">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white text-xs placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
                placeholder="admin@store.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white text-xs placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-white focus:border-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-white hover:bg-neutral-200 text-black font-semibold text-xs tracking-wider uppercase rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            <span>{loading ? "Authenticating..." : "Access Dashboard"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
          <a
            href="/"
            className="text-xs text-neutral-400 hover:text-white transition-colors"
          >
            ← Return to Public Storefront
          </a>
        </div>
      </div>
    </div>
  );
}
