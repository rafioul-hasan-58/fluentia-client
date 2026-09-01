"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/shared";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-paper/90 dark:bg-[#030712]/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 group">
          <div className="relative w-10 h-10 sm:w-13 sm:h-13 group-hover:scale-105 transition-transform duration-200">
            <Image
              src="/logo.png"
              alt="Fluentia Logo"
              width={48}
              height={48}
              className="object-contain w-full h-full"
              priority
            />
          </div>
          <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink dark:text-white">
            Fluentia
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-8 text-sm font-medium text-ink-soft dark:text-slate-300">
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

          <Link
            href="/dashboard/chat"
            className="hidden sm:inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-primary to-indigo-600 hover:from-blue-500 hover:via-primary-dark hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-95"
          >
            Start Practice
          </Link>

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-ink-soft hover:text-ink hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
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

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-white/10 bg-paper dark:bg-[#030712] px-4 py-4 space-y-3 animate-fadeIn shadow-lg">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-ink-soft dark:text-slate-300">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 hover:text-ink"
            >
              ✨ Features & Tracks
            </a>
            <a
              href="#demo"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 hover:text-ink"
            >
              🎮 Interactive Demo
            </a>
            <a
              href="#cta"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 hover:text-ink"
            >
              🚀 Get Started
            </a>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 hover:text-ink"
            >
              📊 Learning Dashboard
            </Link>
          </nav>

          <div className="pt-2 border-t border-slate-200 dark:border-white/10">
            <Link
              href="/dashboard/chat"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-primary to-indigo-600 text-white text-sm font-bold shadow-md shadow-blue-500/25"
            >
              Start AI Practice Now →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
