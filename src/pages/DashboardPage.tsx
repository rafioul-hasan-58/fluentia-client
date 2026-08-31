import React from "react";
import Link from "next/link";

const DashboardPage = () => {
  return (
    <div className="space-y-8 text-ink">
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-600/10 via-primary/5 to-indigo-600/10 dark:from-[#0B132B] dark:via-[#101d42] dark:to-[#0B132B] border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl -z-0" />
        
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 dark:bg-cyan-500/20 border border-primary/20 dark:border-cyan-500/30 text-primary dark:text-cyan-300 text-xs font-semibold">
            <span>🔥</span>
            <span>Day 5 Streak: Master Fluency</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
            Welcome back to Fluentia! 👋
          </h1>
          <p className="text-sm sm:text-base text-ink-soft leading-relaxed">
            Your personalized AI coaching is ready. You are currently on track for <strong className="text-ink font-semibold">Intermediate B2</strong> fluency goals.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href="/dashboard/chat"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold transition-all shadow-sm dark:shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:scale-[1.02]"
            >
              Resume AI Conversation →
            </Link>
            <Link
              href="/dashboard/vocabulary"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/15 text-ink text-sm font-semibold border border-slate-200 dark:border-white/10 transition-all hover:scale-[1.02]"
            >
              Review Daily Words
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-2">
          <span className="text-xs uppercase tracking-wider text-ink-soft font-semibold">Active Streak</span>
          <h3 className="text-2xl font-bold text-ink">🔥 5 Days</h3>
          <p className="text-[11px] text-primary dark:text-cyan-300 font-medium">Top 15% of learners this week</p>
        </div>

        <div className="p-6 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-2">
          <span className="text-xs uppercase tracking-wider text-ink-soft font-semibold">Words Mastered</span>
          <h3 className="text-2xl font-bold text-ink">📚 148 Words</h3>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">+12 words added today</p>
        </div>

        <div className="p-6 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-2">
          <span className="text-xs uppercase tracking-wider text-ink-soft font-semibold">Grammar Accuracy</span>
          <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">🎯 96%</h3>
          <p className="text-[11px] text-ink-soft font-medium">Based on last 50 sentence turns</p>
        </div>

        <div className="p-6 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-2">
          <span className="text-xs uppercase tracking-wider text-ink-soft font-semibold">Estimated IELTS Band</span>
          <h3 className="text-2xl font-bold text-primary dark:text-cyan-300">⭐ Band 7.5</h3>
          <p className="text-[11px] text-ink-soft font-medium">Target: Band 8.0</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;