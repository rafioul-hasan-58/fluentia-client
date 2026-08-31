import React from "react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#030712] border-t border-white/10 py-12 text-white">
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
          <span className="font-display text-xl font-bold text-white">
            Fluentia
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs font-medium text-slate-400">
          <Link href="#features" className="hover:text-cyan-300 transition-colors">Features</Link>
          <Link href="#demo" className="hover:text-cyan-300 transition-colors">Demo</Link>
          <Link href="/dashboard" className="hover:text-cyan-300 transition-colors">Learning Console</Link>
        </div>

        <div className="text-xs text-slate-500">
          © {new Date().getFullYear()} Fluentia App. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
