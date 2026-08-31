import React from "react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-paper border-t border-slate-200 dark:border-white/10 py-12 text-ink transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3.5">
          <div className="relative w-11 h-11">
            <Image
              src="/logo.png"
              alt="Fluentia Logo"
              width={44}
              height={44}
              className="object-contain w-full h-full"
            />
          </div>
          <span className="font-display text-xl font-bold text-ink">
            Fluentia
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs font-medium text-ink-soft">
          <Link href="#features" className="hover:text-primary dark:hover:text-cyan-300 transition-colors">Features</Link>
          <Link href="#demo" className="hover:text-primary dark:hover:text-cyan-300 transition-colors">Demo</Link>
          <Link href="/dashboard" className="hover:text-primary dark:hover:text-cyan-300 transition-colors">Learning Console</Link>
        </div>

        <div className="text-xs text-ink-soft/75">
          © {new Date().getFullYear()} Fluentia App. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
