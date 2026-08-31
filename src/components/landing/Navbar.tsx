import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/shared";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-paper/85 dark:bg-[#030712]/85 backdrop-blur-md border-b border-slate-200 dark:border-white/10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="relative w-14 h-14 group-hover:scale-105 transition-transform duration-200">
            <Image
              src="/logo.png"
              alt="Fluentia Logo"
              width={56}
              height={56}
              className="object-contain w-full h-full"
              priority
            />
          </div>
          <span className="font-display text-2xl font-bold tracking-tight text-ink dark:text-white">
            Fluentia
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-soft dark:text-slate-300">
          <a href="#features" className="hover:text-primary dark:hover:text-cyan-300 transition-colors">Features</a>
          <a href="#demo" className="hover:text-primary dark:hover:text-cyan-300 transition-colors">Interactive Demo</a>
          <a href="#cta" className="hover:text-primary dark:hover:text-cyan-300 transition-colors">Get Started</a>
          <Link href="/dashboard" className="hover:text-primary dark:hover:text-cyan-300 transition-colors">Dashboard</Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/dashboard/chat"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-primary to-indigo-600 hover:from-blue-500 hover:via-primary-dark hover:to-indigo-500 text-white text-sm font-semibold transition-all duration-200 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-95"
          >
            Start Free Practice
          </Link>
        </div>
      </div>
    </header>
  );
}
