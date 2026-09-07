"use client";

import React, { useState } from "react";
import Link from "next/link";

interface DiagnosticTab {
  id: "grammar" | "speaking" | "ielts";
  label: string;
  icon: string;
}

const TABS: DiagnosticTab[] = [
  { id: "grammar", label: "Grammar Diagnosis", icon: "🔬" },
  { id: "speaking", label: "Speaking Fluency", icon: "🗣️" },
  { id: "ielts", label: "IELTS Band 7.5+", icon: "🎯" },
];

export function HeroProductPreview() {
  const [activeTab, setActiveTab] = useState<"grammar" | "speaking" | "ielts">("grammar");

  return (
    <div className="relative w-full max-w-xl lg:max-w-none mx-auto select-none">
      {/* Ambient Glow behind the dashboard */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-600/30 via-violet-500/20 to-fuchsia-400/30 rounded-3xl blur-2xl opacity-60 dark:opacity-80 -z-10 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Top Floating Satellite Badge: IELTS Band Goal */}
      <div className="hidden sm:flex absolute -top-5 -right-3 sm:-right-5 z-20 items-center gap-3 p-3.5 rounded-2xl bg-white/95 dark:bg-[#0f0c20]/95 border border-purple-500/25 dark:border-purple-400/30 shadow-xl backdrop-blur-xl animate-float-slow">
        <div className="w-10 h-10 rounded-xl bg-purple-500/15 dark:bg-purple-500/20 flex items-center justify-center text-xl">
          🎯
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-ink dark:text-white">IELTS Band Goal</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              Band 6.5 - 7.5
            </span>
          </div>
          <p className="text-[11px] text-ink-soft dark:text-slate-400 font-medium">
            Writing & Speaking Accuracy <span className="text-emerald-600 dark:text-emerald-400 font-bold">+18%</span>
          </p>
        </div>
      </div>

      {/* Bottom Floating Satellite Badge: Daily Streak */}
      <div className="hidden sm:flex absolute -bottom-5 -left-3 sm:-left-5 z-20 items-center gap-3 p-3.5 rounded-2xl bg-white/95 dark:bg-[#0f0c20]/95 border border-amber-500/25 dark:border-amber-400/30 shadow-xl backdrop-blur-xl animate-float-delayed">
        <div className="w-10 h-10 rounded-xl bg-amber-500/15 dark:bg-amber-500/20 flex items-center justify-center text-xl">
          🔥
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-ink dark:text-white">7-Day Study Streak</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              Active
            </span>
          </div>
          <p className="text-[11px] text-ink-soft dark:text-slate-400 font-medium">
            10 Personalized questions ready today
          </p>
        </div>
      </div>

      {/* Main Learning & Diagnosis Application Window */}
      <div className="rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-[#090514]/90 border border-slate-200/90 dark:border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden transition-all duration-300">
        {/* Mock Application Top Navigation Bar */}
        <div className="px-4 sm:px-5 py-3.5 bg-slate-100/80 dark:bg-white/[0.03] border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
            </div>
            <span className="text-slate-300 dark:text-white/20 text-xs">|</span>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-ink dark:text-white">
              <span>🧠 Fluentia Adaptive Tutor</span>
              <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.2 rounded bg-primary/10 text-primary dark:text-purple-300 font-mono">
                v2.4
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Adaptive Engine Online
            </span>
          </div>
        </div>

        {/* Interactive Mode Tabs */}
        <div className="px-4 sm:px-5 pt-3 pb-2 flex items-center gap-2 border-b border-slate-100 dark:border-white/5 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-sm shadow-purple-500/30"
                  : "text-ink-soft dark:text-slate-400 hover:text-ink dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Application Mockup Body */}
        <div className="p-4 sm:p-5 space-y-4 text-left">
          {/* Tab 1: Grammar Diagnosis (Default) */}
          {activeTab === "grammar" && (
            <>
              {/* User Learning Goal / Problem Prompt */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                  You
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-ink-soft dark:text-slate-400">
                      Learner Query • <span className="font-bangla text-primary dark:text-purple-400">আপনার সমস্যা</span>
                    </span>
                    <span className="text-[10px] text-ink-soft/60 dark:text-slate-500">Grammar Doctor</span>
                  </div>
                  <div className="p-3 rounded-2xl rounded-tl-sm bg-slate-100 dark:bg-white/[0.05] border border-slate-200/70 dark:border-white/10 text-xs sm:text-sm text-ink dark:text-slate-200 font-medium">
                    &ldquo;I always confuse past simple and present perfect when writing essays.&rdquo;
                  </div>
                </div>
              </div>

              {/* AI Diagnosis Output Card */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-purple-50/80 via-violet-50/40 to-slate-50/80 dark:from-purple-950/40 dark:via-violet-950/20 dark:to-[#0f0c20]/80 border border-purple-200/80 dark:border-purple-500/30 space-y-3.5 shadow-sm">
                {/* Diagnosis Header with Mastery Score */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-purple-500/15 text-primary dark:text-purple-300 flex items-center justify-center text-sm font-bold">
                      ⚡
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-ink dark:text-white">
                        AI Diagnosis: Present Perfect vs. Past Simple
                      </h4>
                      <p className="text-[10px] text-ink-soft dark:text-slate-400 font-bangla">
                        আপনার দুর্বলতা শনাক্ত করা হয়েছে
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-extrabold text-purple-600 dark:text-purple-300">
                      48% Mastery
                    </div>
                    <span className="text-[9px] text-ink-soft/70 dark:text-slate-400">Target: 85%+</span>
                  </div>
                </div>

                {/* Mastery Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-400 transition-all duration-1000 shadow-[0_0_12px_rgba(168,85,247,0.5)]"
                      style={{ width: "48%" }}
                    />
                  </div>
                </div>

                {/* Weakness Detection Alert Box */}
                <div className="p-2.5 sm:p-3 rounded-xl bg-white/90 dark:bg-black/40 border border-amber-500/30 dark:border-amber-400/25 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                    <span>⚠️ Root Weakness Detected:</span>
                    <span className="font-normal text-ink-soft dark:text-slate-300">
                      Finished-time expressions with Perfect Tense
                    </span>
                  </div>

                  {/* Contrast Before / After Example */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono pt-1">
                    <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                      <span>❌</span>
                      <span className="line-through opacity-80">&ldquo;I have seen him yesterday.&rdquo;</span>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 font-semibold">
                      <span>✓</span>
                      <span>&ldquo;I saw him yesterday.&rdquo;</span>
                    </div>
                  </div>
                </div>

                {/* Adaptive Action CTA */}
                <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 text-[11px] text-ink-soft dark:text-slate-300 font-medium font-bangla">
                    <span className="w-2 h-2 rounded-full bg-primary dark:bg-purple-400" />
                    <span>১০টি Targeted Questions তৈরি হয়েছে আপনার জন্য</span>
                  </div>

                  <Link
                    href="/dashboard/chat"
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-all shadow-md shadow-purple-500/20 hover:scale-[1.02] active:scale-95 text-center"
                  >
                    <span>Practice Weakness</span>
                  </Link>
                </div>
              </div>
            </>
          )}

          {/* Tab 2: Speaking Fluency */}
          {activeTab === "speaking" && (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200/70 dark:border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-ink dark:text-white">
                  <span>🗣️ Speaking Audio Analysis</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono">92% Intelligibility</span>
                </div>
                <p className="text-xs text-ink-soft dark:text-slate-300">
                  &ldquo;I think technology <span className="text-rose-500 font-bold underline">has improved</span> our lives substantially.&rdquo;
                </p>
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-primary dark:text-purple-300">
                  💡 <strong>Pronunciation Note:</strong> Stress the syllable &lsquo;PROVE&rsquo; in &lsquo;im-PROVED&rsquo; with standard IELTS linking rhythm.
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 border border-purple-500/20">
                <div className="text-xs font-medium text-ink dark:text-white">
                  Ready for live 2-way speaking simulation?
                </div>
                <Link
                  href="/dashboard/chat"
                  className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all"
                >
                  Start Speaking →
                </Link>
              </div>
            </div>
          )}

          {/* Tab 3: IELTS Band 7.5+ */}
          {activeTab === "ielts" && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200/70 dark:border-white/10">
                  <div className="text-[10px] text-ink-soft dark:text-slate-400 uppercase font-bold">Lexical Resource</div>
                  <div className="text-lg font-extrabold text-purple-600 dark:text-purple-300 mt-1">Band 7.5</div>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Idiomatic phrasing strong</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200/70 dark:border-white/10">
                  <div className="text-[10px] text-ink-soft dark:text-slate-400 uppercase font-bold">Grammar Accuracy</div>
                  <div className="text-lg font-extrabold text-indigo-600 dark:text-purple-300 mt-1">Band 7.0</div>
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">Complex clauses need polish</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
                <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                  🎯 IELTS Task 2 Essay Diagnostic ready to evaluate
                </span>
                <Link
                  href="/dashboard/chat"
                  className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all text-[11px]"
                >
                  Analyze Essay
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
