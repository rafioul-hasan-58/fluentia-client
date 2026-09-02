import React from "react";
import Link from "next/link";

const DashboardPage = () => {
  return (
    <div className="space-y-6 sm:space-y-8 text-ink">
      {/* Welcome Banner */}
      <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-600/10 via-primary/5 to-indigo-600/10 dark:from-[#0B132B] dark:via-[#101d42] dark:to-[#0B132B] border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl -z-0" />
        
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-primary/10 dark:bg-cyan-500/20 border border-primary/20 dark:border-cyan-500/30 text-primary dark:text-cyan-300 text-[11px] sm:text-xs font-semibold">
            <span>🔥</span>
            <span>Day 5 Streak: Master Fluency</span>
          </div>
          <h1 className="font-brand text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight">
            Welcome back to Fluentia! 👋
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-ink-soft leading-relaxed">
            Your personalized AI coaching is ready. You are currently on track for <strong className="text-ink font-semibold">Intermediate B2</strong> fluency goals.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <Link
              href="/dashboard/chat"
              className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-blue-600 via-primary to-indigo-600 hover:from-blue-500 hover:via-primary-dark hover:to-indigo-500 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/40 dark:shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:scale-[1.02] active:scale-95 text-center"
            >
              Resume AI Conversation →
            </Link>
            <Link
              href="/dashboard/vocabulary"
              className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-white to-slate-100 dark:from-white/10 dark:to-white/5 hover:from-white hover:to-slate-200 dark:hover:from-white/15 dark:hover:to-white/10 text-ink text-xs sm:text-sm font-semibold border border-slate-200 dark:border-white/10 transition-all hover:scale-[1.02] active:scale-95 shadow-xs text-center"
            >
              Review Daily Words
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-1.5 sm:space-y-2">
          <span className="text-[10px] sm:text-xs uppercase tracking-wider text-ink-soft font-semibold">Active Streak</span>
          <h3 className="text-xl sm:text-2xl font-bold text-ink">🔥 5 Days</h3>
          <p className="text-[10px] sm:text-[11px] text-primary dark:text-cyan-300 font-medium line-clamp-1">Top 15% this week</p>
        </div>

        <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-1.5 sm:space-y-2">
          <span className="text-[10px] sm:text-xs uppercase tracking-wider text-ink-soft font-semibold">Words Mastered</span>
          <h3 className="text-xl sm:text-2xl font-bold text-ink">📚 148 Words</h3>
          <p className="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 font-medium line-clamp-1">+12 words today</p>
        </div>

        <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-1.5 sm:space-y-2">
          <span className="text-[10px] sm:text-xs uppercase tracking-wider text-ink-soft font-semibold">Accuracy</span>
          <h3 className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">🎯 96%</h3>
          <p className="text-[10px] sm:text-[11px] text-ink-soft font-medium line-clamp-1">Last 50 turns</p>
        </div>

        <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-1.5 sm:space-y-2">
          <span className="text-[10px] sm:text-xs uppercase tracking-wider text-ink-soft font-semibold">IELTS Est.</span>
          <h3 className="text-xl sm:text-2xl font-bold text-primary dark:text-cyan-300">⭐ Band 7.5</h3>
          <p className="text-[10px] sm:text-[11px] text-ink-soft font-medium line-clamp-1">Target: Band 8.0</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;