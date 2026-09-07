"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle, UserProfileDropdown } from "@/components/shared";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-paper/90 dark:bg-[#070510]/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10 transition-colors duration-200">
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
          <a
            href="#how-it-works"
            className="hover:text-primary dark:hover:text-purple-300 transition-colors"
          >
            How It Works
          </a>
          <a
            href="#demo"
            className="hover:text-primary dark:hover:text-purple-300 transition-colors"
          >
            Interactive Demo
          </a>
          <a
            href="#cta"
            className="hover:text-primary dark:hover:text-purple-300 transition-colors"
          >
            Get Started
          </a>
          <Link
            href="/dashboard"
            className="hover:text-primary dark:hover:text-purple-300 transition-colors"
          >
            Dashboard
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <ThemeToggle />

          {/* If Authenticated: Show User Profile Avatar Dropdown */}
          {isAuthenticated && user ? (
            <UserProfileDropdown />
          ) : (
            /* If Unauthenticated: Show Login button */
            <div className="flex items-center gap-2 font-nav">
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-primary to-fuchsia-600 hover:from-purple-500 hover:via-primary-dark hover:to-fuchsia-500 text-white text-xs sm:text-sm font-bold transition-all duration-200 shadow-md shadow-purple-500/25 hover:shadow-lg hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-95"
              >
                Log In
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
