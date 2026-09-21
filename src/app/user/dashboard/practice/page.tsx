import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  PenTool,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "AI Practice Hub | Fluentia",
  description:
    "Accelerate your English fluency with targeted AI vocabulary drills and comprehensive essay and email writing practice.",
};

export default function PracticeHubPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-white/10">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-60 h-60 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-purple-200 border border-white/15 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>AI Practice Center</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Transform Passive Knowledge into Active Fluency
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Choose a targeted practice module below to train your spontaneous recall, test your vocabulary retention with interactive flashcards, or craft essays with instant AI evaluation.
          </p>
        </div>
      </div>

      {/* Main Two Practice Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Vocab Practice Card */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500/60 transition-all group">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80">
                Interactive Vault
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Vocab Practice
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Test and reinforce your saved vocabulary with dynamic flashcards, multiple-choice definition challenges, and collocation recall sessions.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Spaced repetition flashcards & quizzes</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Collocation & contextual sentence drills</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Audio pronunciation with natural female voice</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/dashboard/practice/vocab"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm hover:shadow-indigo-500/25 transition-all group-hover:translate-x-0.5"
            >
              <span>Launch Vocab Practice</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 2. Writing Practice Card */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-purple-400 dark:hover:border-purple-500/60 transition-all group">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <PenTool className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/80">
                AI Coach & Scoring
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Writing Practice
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Compose essays, workplace emails, and creative responses with instant AI grammar analysis, band scores, and advanced vocabulary suggestions.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                <span>IELTS Task 2, Professional Email & Freeform prompts</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                <span>Live word count, reading time & lexical analysis</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                <span>Grammar correction & sentence enhancement tips</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/dashboard/practice/writing"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-sm hover:shadow-purple-500/25 transition-all group-hover:translate-x-0.5"
            >
              <span>Launch Writing Practice</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
