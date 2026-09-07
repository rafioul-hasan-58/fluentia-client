"use client";

import React from "react";
import { AdminHeader } from "@/components/admin";
import { Button } from "@/components/ui/button";

const WEAKNESS_STATS = [
  { concept: "Third & Mixed Conditionals", section: "Grammar", errorRate: 42, attempts: 1840 },
  { concept: "Phrasal Verbs & Dependent Prepositions", section: "Vocabulary", errorRate: 38, attempts: 2100 },
  { concept: "Inverted Syntactic Structures", section: "Grammar", errorRate: 35, attempts: 1420 },
  { concept: "Subjunctive Mood & Hypothetical Clauses", section: "Grammar", errorRate: 29, attempts: 1180 },
  { concept: "Nuanced Academic Idioms", section: "Vocabulary", errorRate: 26, attempts: 1690 },
  { concept: "Complex Inference & Author Tone", section: "Reading", errorRate: 21, attempts: 940 },
  { concept: "Relative Clauses & Connectors", section: "Grammar", errorRate: 14, attempts: 2400 },
];

export function AdminAnalyticsView() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <AdminHeader
        title="Placement Test Analytics"
        subtitle="Deep behavioral diagnostics, error frequency metrics, and CEFR grading analytics."
        actions={
          <Button variant="outline" size="sm" className="text-xs font-semibold">
            <span>📥</span>
            <span className="ml-1.5">Export CSV Report</span>
          </Button>
        }
      />

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <div className="p-4 sm:p-5 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-ink-soft font-semibold">
            Completion Rate
          </span>
          <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-brand">
            94.8%
          </h3>
          <p className="text-[11px] text-ink-soft">Finished all 20 questions</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-ink-soft font-semibold">
            Avg Speed / Question
          </span>
          <h3 className="text-2xl font-bold text-primary dark:text-purple-300 font-brand">
            24.5s
          </h3>
          <p className="text-[11px] text-ink-soft">Target pacing: &lt;45s</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-ink-soft font-semibold">
            B2+ Placement Rate
          </span>
          <h3 className="text-2xl font-bold text-ink font-brand">
            38.2%
          </h3>
          <p className="text-[11px] text-ink-soft">Achieved Upper-Int or higher</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-ink-soft font-semibold">
            Avg Retest Period
          </span>
          <h3 className="text-2xl font-bold text-ink font-brand">
            21 Days
          </h3>
          <p className="text-[11px] text-ink-soft">Before re-evaluating</p>
        </div>
      </div>

      {/* Weakest Concepts Matrix */}
      <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <h2 className="font-brand text-base sm:text-lg font-bold text-ink">
              Top Grammatical & Lexical Error Points
            </h2>
            <p className="text-xs text-ink-soft">
              Most common error areas where learners select incorrect choices
            </p>
          </div>
          <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 self-start sm:self-auto">
            High Priority
          </span>
        </div>

        <div className="space-y-4">
          {WEAKNESS_STATS.map((item) => (
            <div key={item.concept} className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-ink">{item.concept}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 text-ink-soft font-mono">
                    {item.section}
                  </span>
                </div>
                <span className="font-bold text-rose-500 font-mono">
                  {item.errorRate}% Failure Rate
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full rounded-full bg-slate-200/80 dark:bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-500"
                  style={{ width: `${item.errorRate * 2}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-ink-soft">
                <span>Evaluated across {item.attempts.toLocaleString()} questions</span>
                <span>Recommendation: Increase practice modules for this topic</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
