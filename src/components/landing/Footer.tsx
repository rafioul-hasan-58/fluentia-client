import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-paper border-t border-ink/5 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-paper font-display font-bold text-base">
            F
          </div>
          <span className="font-display text-lg font-bold text-ink">
            Fluentia
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs font-medium text-ink-soft">
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="#demo" className="hover:text-primary transition-colors">Demo</Link>
          <Link href="#cta" className="hover:text-primary transition-colors">Learning Console</Link>
        </div>

        <div className="text-xs text-ink-soft/75">
          © {new Date().getFullYear()} Fluentia App. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
