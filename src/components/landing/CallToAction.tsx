import React from "react";
import Link from "next/link";

export function CallToAction() {
  return (
    <section id="cta" className="relative overflow-hidden bg-gradient-to-b from-[#060b19] via-[#0b132b] to-[#030712] border-y border-white/10 py-20 text-white">
      {/* Background glow orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-blue-600/20 rounded-full blur-[100px] -z-10" />

      <div className="max-w-4xl mx-auto px-6 text-center space-y-6 relative z-10">
        <h3 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Ready to take your English to the next level?
        </h3>
        <p className="text-slate-300 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
          Start engaging in guided daily conversations and receive structured, actionable reports highlighting your progress, lexical range, and grammatical accuracy.
        </p>
        <div className="pt-2">
          <Link
            href="/dashboard/chat"
            className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-base transition-all duration-300 shadow-[0_0_30px_rgba(37,99,235,0.5)] hover:shadow-[0_0_40px_rgba(37,99,235,0.8)] hover:scale-[1.03]"
          >
            Launch Learning Console →
          </Link>
        </div>
      </div>
    </section>
  );
}
