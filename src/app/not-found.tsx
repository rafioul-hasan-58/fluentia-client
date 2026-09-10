"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/shared";
import {
  Sparkles,
  Flame,
  Utensils,
  ArrowLeft,
  Home,
  BookOpen,
} from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="h-screen w-screen max-h-screen overflow-hidden bg-paper dark:bg-[#0A0718] text-ink transition-colors duration-200 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative select-none">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-amber-500/15 via-orange-500/10 to-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-primary to-amber-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-amber-200 fill-amber-200" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-brand font-bold text-base sm:text-lg text-ink tracking-tight">
              Fluentia
            </span>
            <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
              404
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>

      {/* Center Minimal Card */}
      <main className="relative z-10 max-w-lg mx-auto w-full flex flex-col items-center text-center my-auto space-y-6">
        
        {/* Animated Icon */}
        <div className="relative">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-amber-500/20 via-orange-500/20 to-purple-600/20 blur-xl animate-pulse" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/90 dark:bg-[#140F2B]/90 border border-amber-500/30 shadow-2xl flex flex-col items-center justify-center backdrop-blur-xl group">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/25">
              <Utensils className="w-6 h-6 sm:w-7 sm:h-7 animate-spin-slow" />
            </div>
            <span className="absolute -bottom-2.5 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-md">
              Chef at Work 👨‍🍳
            </span>
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-2.5 max-w-md">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 text-xs font-bold shadow-sm">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-bounce" />
            <span>AI Kitchen • Feature is Cooking</span>
          </div>

          <h1 className="font-brand text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            We&apos;re <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 bg-clip-text text-transparent">cooking this feature</span> 🍳🔥
          </h1>

          <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
            Our AI chefs are currently simmering models and seasoning lessons. This dish will be served hot and fresh very soon!
          </p>
        </div>

        {/* Minimal Progress Bar */}
        <div className="w-full max-w-xs p-3 rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm space-y-2 text-left backdrop-blur-md">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-ink-soft flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Recipe Preparation
            </span>
            <span className="text-amber-600 dark:text-amber-400">78% Cooked</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 animate-pulse w-[78%]" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1 w-full max-w-xs sm:max-w-sm">
          <Link
            href="/dashboard"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-primary to-amber-500 hover:from-purple-500 hover:via-primary-dark hover:to-amber-400 text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer text-center"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/dashboard/vocabulary"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/15 border border-slate-200 dark:border-white/10 text-ink text-xs sm:text-sm font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-primary dark:text-purple-400" />
            <span>Vault</span>
          </Link>

          <button
            onClick={() => router.back()}
            className="p-3 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/15 border border-slate-200 dark:border-white/10 text-ink-soft hover:text-ink text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto text-center text-[11px] text-ink-soft">
        <span>Fluentia AI • 404 • Feature in Development</span>
      </footer>
    </div>
  );
}
