"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle, UserProfileDropdown } from "@/components/shared";
import { useAuth } from "@/context/AuthContext";

interface NavLink {
  label: string;
  href: string;
  icon?: string;
  badge?: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Features", href: "#features", icon: "✨" },
  { label: "Demo", href: "#demo", icon: "🎮" },
  { label: "Get Started", href: "#cta", icon: "🚀" },
  { label: "Dashboard", href: "/dashboard", icon: "📊" },
  { label: "AI Practice Chat", href: "/dashboard/chat", icon: "💬", badge: "AI" },
];

const QUICK_TRACKS = [
  { name: "Grammar Doctor", href: "/dashboard/chat", icon: "🔬" },
  { name: "Speaking AI", href: "/dashboard/chat", icon: "🗣️" },
  { name: "IELTS Band 8.0+", href: "/dashboard/chat", icon: "🎯" },
  { name: "Vocabulary Vault", href: "/dashboard/vocabulary", icon: "📚" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-40 bg-paper/90 dark:bg-[#030712]/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 group">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 group-hover:scale-105 transition-transform duration-200">
              <Image
                src="/logo.png"
                alt="Fluentia Logo"
                width={48}
                height={48}
                className="object-contain w-full h-full"
                priority
              />
            </div>
            <span className="font-brand text-xl sm:text-2xl font-bold tracking-tight text-ink dark:text-white">
              Fluentia
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-8 text-sm font-semibold font-nav text-ink-soft dark:text-slate-300">
            <a href="#features" className="hover:text-primary dark:hover:text-cyan-300 transition-colors">
              Features
            </a>
            <a href="#demo" className="hover:text-primary dark:hover:text-cyan-300 transition-colors">
              Interactive Demo
            </a>
            <a href="#cta" className="hover:text-primary dark:hover:text-cyan-300 transition-colors">
              Get Started
            </a>
            <Link href="/dashboard" className="hover:text-primary dark:hover:text-cyan-300 transition-colors">
              Dashboard
            </Link>
          </nav>

          {/* Action Controls & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {/* If Authenticated: Show User Profile Avatar Dropdown */}
            {isAuthenticated && user ? (
              <UserProfileDropdown />
            ) : (
              /* If Unauthenticated: Show Login link and Start Practice button */
              <div className="flex items-center gap-2 font-nav">
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-ink-soft hover:text-ink hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                >
                  Log In
                </Link>

                <Link
                  href="/dashboard/chat"
                  className="inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-primary to-indigo-600 hover:from-blue-500 hover:via-primary-dark hover:to-indigo-500 text-white text-xs sm:text-sm font-bold transition-all duration-200 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-95"
                >
                  Start Practice
                </Link>
              </div>
            )}

            {/* Mobile Menu Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-ink-soft hover:text-ink hover:bg-slate-100 dark:hover:bg-white/10 transition-colors border border-slate-200/60 dark:border-white/10"
              aria-label="Toggle Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Quick Scroll Nav Strip */}
        <div className="md:hidden flex items-center gap-2 px-4 py-2 border-t border-slate-200/70 dark:border-white/5 overflow-x-auto no-scrollbar bg-slate-50/70 dark:bg-white/[0.02] font-nav">
          <a
            href="#features"
            className="px-3 py-1 rounded-lg text-xs font-semibold text-ink-soft hover:text-ink hover:bg-paper whitespace-nowrap transition-colors"
          >
            ✨ Features
          </a>
          <a
            href="#demo"
            className="px-3 py-1 rounded-lg text-xs font-semibold text-ink-soft hover:text-ink hover:bg-paper whitespace-nowrap transition-colors"
          >
            🎮 Demo
          </a>
          <a
            href="#cta"
            className="px-3 py-1 rounded-lg text-xs font-semibold text-ink-soft hover:text-ink hover:bg-paper whitespace-nowrap transition-colors"
          >
            🚀 Get Started
          </a>
          <Link
            href="/dashboard"
            className="px-3 py-1 rounded-lg text-xs font-semibold text-primary dark:text-cyan-300 hover:bg-paper whitespace-nowrap transition-colors"
          >
            📊 Dashboard
          </Link>
          <Link
            href="/dashboard/chat"
            className="px-3 py-1 rounded-lg text-xs font-semibold text-primary dark:text-cyan-300 hover:bg-paper whitespace-nowrap transition-colors"
          >
            💬 AI Chat
          </Link>
        </div>
      </header>

      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fadeIn"
          aria-hidden="true"
        />
      )}

      {/* Mobile Slide-Down Full Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 z-50 border-b border-slate-200 dark:border-white/10 bg-paper dark:bg-[#030712] p-5 space-y-4 shadow-2xl animate-fadeIn max-h-[85vh] overflow-y-auto">
          {/* User Status Bar if logged in */}
          {isAuthenticated && user && (
            <div className="p-3.5 rounded-2xl bg-primary/10 dark:bg-cyan-500/10 border border-primary/20 dark:border-cyan-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-ink truncate">{user.name}</p>
                  <p className="text-[10px] text-ink-soft truncate">{user.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline px-2 py-1"
              >
                Sign Out
              </button>
            </div>
          )}

          {/* Main Navigation Links */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-soft px-2 block mb-1 font-brand">
              Menu Navigation
            </span>
            <nav className="flex flex-col space-y-1 font-nav">
              {NAV_LINKS.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-sm font-semibold text-ink transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-primary/15 text-primary dark:text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded-full font-brand">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Quick Learning Tracks in Mobile Menu */}
          <div className="pt-3 border-t border-slate-200 dark:border-white/10 space-y-2 font-nav">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-soft px-2 block font-brand">
              Quick Practice Tracks
            </span>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_TRACKS.map((track, i) => (
                <Link
                  key={i}
                  href={track.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 hover:border-primary/40 text-left transition-colors"
                >
                  <span className="text-base block mb-1">{track.icon}</span>
                  <span className="text-xs font-bold text-ink block">{track.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Auth Actions in Mobile Menu */}
          <div className="pt-2 border-t border-slate-200 dark:border-white/10 space-y-2 font-nav">
            {!isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-ink text-sm font-semibold bg-paper"
                >
                  Log In to Account
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center py-3 rounded-xl bg-gradient-to-r from-blue-600 via-primary to-indigo-600 text-white text-sm font-bold shadow-md shadow-blue-500/25 active:scale-98 transition-all"
                >
                  Create Free Account →
                </Link>
              </div>
            ) : (
              <Link
                href="/dashboard/chat"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center py-3 rounded-xl bg-gradient-to-r from-blue-600 via-primary to-indigo-600 text-white text-sm font-bold shadow-md shadow-blue-500/25 active:scale-98 transition-all"
              >
                Resume AI Coaching →
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
