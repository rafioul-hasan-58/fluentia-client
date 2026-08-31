import React from "react";
import Link from "next/link";

export function CallToAction() {
  return (
    <section id="cta" className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-slate-50 to-blue-100/40 dark:from-[#060b19] dark:via-[#0b132b] dark:to-[#030712] border-y border-slate-200 dark:border-white/10 py-20 text-ink dark:text-white transition-colors duration-200">
      {/* Background glow orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-primary/10 dark:bg-blue-600/20 rounded-full blur-[100px] -z-10" />

      <div className="max-w-4xl mx-auto px-6 text-center space-y-6 relative z-10">
        <h3 className="font-display text-3xl sm:text-4xl font-bold text-ink dark:text-white tracking-tight">
          Ready to take your English to the next level?
        </h3>
        <p className="text-ink-soft dark:text-slate-300 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
          Start engaging in guided daily conversations and receive structured, actionable reports highlighting your progress, lexical range, and grammatical accuracy.
        </p>
        <div className="pt-2">
          <Link
            href="/dashboard/chat"
            className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-primary to-indigo-600 hover:from-blue-500 hover:via-primary-dark hover:to-indigo-500 text-white font-bold text-base transition-all duration-300 shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 dark:shadow-[0_0_30px_rgba(37,99,235,0.5)] hover:scale-[1.03] active:scale-95"
          >
            Launch Learning Console →
          </Link>
        </div>
      </div>
    </section>
  );
}
