import React from "react";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-paper/85 backdrop-blur-md border-b border-ink/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-jade flex items-center justify-center text-paper font-display font-bold text-xl shadow-md shadow-jade/10 group-hover:scale-105 transition-transform duration-200">
            F
          </div>
          <span className="font-display text-2xl font-bold tracking-tight text-ink">
            Fluentia
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-soft">
          <a href="#features" className="hover:text-jade transition-colors">Features</a>
          <a href="#demo" className="hover:text-jade transition-colors">Interactive Demo</a>
          <a href="#cta" className="hover:text-jade transition-colors">Get Started</a>
        </nav>

        <div>
          <a
            href="#demo"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-jade hover:bg-jade-dark text-paper text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow hover:scale-[1.02]"
          >
            Start Free Practice
          </a>
        </div>
      </div>
    </header>
  );
}
