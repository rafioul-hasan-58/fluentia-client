"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MOCK_ADMIN_STATS,
  MOCK_RECENT_SUBMISSIONS,
  RecentTestAttempt,
} from "@/lib/api/admin";

export function AdminDashboardView() {
  const [selectedAttempt, setSelectedAttempt] = useState<RecentTestAttempt | null>(null);
  const stats = MOCK_ADMIN_STATS;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Admin Header */}
      <AdminHeader
        title="Command Center"
        subtitle="Real-time monitoring, placement test intelligence, and learner analytics."
        actions={
          <div className="flex items-center gap-2.5">
            <Link href="/admin/questions">
              <Button variant="outline" size="sm" className="text-xs font-semibold">
                <span>📚</span>
                <span className="hidden sm:inline ml-1.5">Question Bank</span>
              </Button>
            </Link>
            <Link href="/admin/analytics">
              <Button variant="gradient" size="sm" className="text-xs font-bold shadow-sm">
                <span>📊</span>
                <span className="ml-1.5">View Analytics</span>
              </Button>
            </Link>
          </div>
        }
      />

      {/* Hero KPI Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {/* Metric 1 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden group hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-ink-soft font-semibold">
              Total Learners
            </span>
            <span className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm">
              👥
            </span>
          </div>
          <div className="mt-2 space-y-1">
            <h3 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight font-brand">
              {stats.totalLearners.toLocaleString()}
            </h3>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              <span>↑ +{stats.newLearnersThisMonth}</span>
              <span className="text-ink-soft font-normal">this month</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden group hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-ink-soft font-semibold">
              Tests Evaluated
            </span>
            <span className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm">
              📝
            </span>
          </div>
          <div className="mt-2 space-y-1">
            <h3 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight font-brand">
              {stats.totalTestsEvaluated.toLocaleString()}
            </h3>
            <div className="flex items-center gap-1.5 text-[11px] text-primary dark:text-purple-300 font-semibold">
              <span>⚡ {stats.testsEvaluatedToday} today</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden group hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-ink-soft font-semibold">
              Avg Proficiency
            </span>
            <span className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-sm">
              🎯
            </span>
          </div>
          <div className="mt-2 space-y-1">
            <h3 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight font-brand">
              {stats.averageScorePercentage}%
            </h3>
            <div className="flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
              <span>{stats.averageCEFR}</span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden group hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-ink-soft font-semibold">
              Live AI Sessions
            </span>
            <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm">
              🟢
            </span>
          </div>
          <div className="mt-2 space-y-1">
            <h3 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight font-brand flex items-center gap-2">
              <span>{stats.activeSessions}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </h3>
            <div className="flex items-center gap-1.5 text-[11px] text-ink-soft">
              <span>Concurrent active practice</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Grid: CEFR Level Distribution & Section Accuracy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CEFR Distribution (2 Columns) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="font-brand text-base sm:text-lg font-bold text-ink">
                Learner CEFR Distribution
              </h2>
              <p className="text-xs text-ink-soft">
                Calculated across all evaluated placement tests
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary dark:text-purple-300 border border-primary/20">
              Active Cohort
            </span>
          </div>

          {/* CEFR visual stacked progress bar */}
          <div className="space-y-2">
            <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-white/5 flex overflow-hidden p-0.5 gap-0.5">
              {stats.cefrDistribution.map((item) => (
                <div
                  key={item.level}
                  style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  className="h-full rounded-xs transition-all hover:opacity-80 relative group"
                  title={`${item.level} (${item.label}): ${item.count} learners (${item.percentage}%)`}
                />
              ))}
            </div>

            {/* Legend items */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2">
              {stats.cefrDistribution.map((item) => (
                <div
                  key={item.level}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 space-y-1"
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs font-bold font-brand text-ink">
                      {item.level}
                    </span>
                  </div>
                  <div className="text-[11px] text-ink-soft leading-tight truncate">
                    {item.label}
                  </div>
                  <div className="text-xs font-semibold text-ink pt-0.5">
                    {item.percentage}% <span className="text-[10px] text-ink-soft font-normal">({item.count})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section Accuracy (1 Column) */}
        <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-5">
          <div className="space-y-0.5">
            <h2 className="font-brand text-base sm:text-lg font-bold text-ink">
              Section Performance
            </h2>
            <p className="text-xs text-ink-soft">
              Average accuracy per skill module
            </p>
          </div>

          <div className="space-y-4">
            {stats.sectionAccuracy.map((sec) => (
              <div key={sec.section} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-ink">{sec.section}</span>
                  <span className={sec.accuracy >= 75 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-500"}>
                    {sec.accuracy}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-600 to-primary transition-all duration-500"
                    style={{ width: `${sec.accuracy}%` }}
                  />
                </div>
                <div className="text-[10px] text-ink-soft text-right">
                  {sec.totalAnswered.toLocaleString()} questions analyzed
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-white/10">
            <Link
              href="/admin/analytics"
              className="w-full flex items-center justify-center py-2 px-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-ink text-xs font-semibold transition-colors"
            >
              Deep Diagnostic Breakdown →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Test Submissions Table */}
      <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="font-brand text-base sm:text-lg font-bold text-ink">
                Recent Placement Test Submissions
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Live Feed
              </span>
            </div>
            <p className="text-xs text-ink-soft">
              Real-time evaluations processed via <code className="text-primary dark:text-purple-300 font-mono">/level-test-questions/submit</code>
            </p>
          </div>

          <Link href="/admin/attempts">
            <Button variant="outline" size="sm" className="text-xs font-semibold">
              View All Attempts →
            </Button>
          </Link>
        </div>

        {/* Table / List */}
        <div className="overflow-x-auto -mx-5 sm:mx-0">
          <table className="w-full text-left text-xs border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-ink-soft text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Learner</th>
                <th className="py-3 px-3">CEFR Rating</th>
                <th className="py-3 px-3">Score</th>
                <th className="py-3 px-3">Section Breakdown</th>
                <th className="py-3 px-3">Duration</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {MOCK_RECENT_SUBMISSIONS.map((attempt) => (
                <tr
                  key={attempt.id}
                  className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group"
                >
                  {/* Learner */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={attempt.avatar || undefined}
                        fallback={attempt.userName.slice(0, 2).toUpperCase()}
                        size="sm"
                        className="w-8 h-8 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-ink truncate group-hover:text-primary dark:group-hover:text-purple-300 transition-colors">
                          {attempt.userName}
                        </p>
                        <p className="text-[11px] text-ink-soft truncate">{attempt.userEmail}</p>
                      </div>
                    </div>
                  </td>

                  {/* CEFR Rating */}
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary dark:text-purple-300 border border-primary/20">
                      <span>⭐</span>
                      <span>{attempt.cefrLevel}</span>
                    </span>
                  </td>

                  {/* Score */}
                  <td className="py-3.5 px-3">
                    <div className="space-y-0.5">
                      <span className="font-bold text-ink">
                        {attempt.score} / {attempt.totalQuestions}
                      </span>
                      <span className="text-[11px] text-ink-soft ml-1.5">
                        ({attempt.percentage}%)
                      </span>
                    </div>
                  </td>

                  {/* Section Breakdown Badges */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1.5">
                      {attempt.sectionBreakdown.grammar && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono">
                          G: {attempt.sectionBreakdown.grammar.correct}/{attempt.sectionBreakdown.grammar.total}
                        </span>
                      )}
                      {attempt.sectionBreakdown.vocabulary && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono">
                          V: {attempt.sectionBreakdown.vocabulary.correct}/{attempt.sectionBreakdown.vocabulary.total}
                        </span>
                      )}
                      {attempt.sectionBreakdown.reading && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono">
                          R: {attempt.sectionBreakdown.reading.correct}/{attempt.sectionBreakdown.reading.total}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Duration */}
                  <td className="py-3.5 px-3 text-ink-soft font-mono text-[11px]">
                    {Math.floor(attempt.timeSpentSeconds / 60)}m {attempt.timeSpentSeconds % 60}s
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedAttempt(attempt)}
                      className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-primary hover:text-white dark:hover:bg-primary text-ink text-xs font-semibold transition-all"
                    >
                      Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal Dialog for Selected Submission */}
      {selectedAttempt && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-2xl bg-paper-card border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <Avatar
                  src={selectedAttempt.avatar || undefined}
                  fallback={selectedAttempt.userName.slice(0, 2).toUpperCase()}
                  size="md"
                />
                <div>
                  <h3 className="font-brand text-lg font-bold text-ink">
                    {selectedAttempt.userName}
                  </h3>
                  <p className="text-xs text-ink-soft">{selectedAttempt.userEmail}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAttempt(null)}
                className="p-2 rounded-xl text-ink-soft hover:text-ink hover:bg-slate-100 dark:hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            {/* Score & CEFR Summary */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-ink-soft">CEFR Rating</span>
                <p className="text-xl font-bold font-brand text-primary dark:text-purple-300">
                  {selectedAttempt.cefrLevel}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-ink-soft">Raw Score</span>
                <p className="text-xl font-bold font-brand text-ink">
                  {selectedAttempt.score} / {selectedAttempt.totalQuestions} ({selectedAttempt.percentage}%)
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-ink-soft">Test Time</span>
                <p className="text-xl font-bold font-brand text-ink">
                  {Math.floor(selectedAttempt.timeSpentSeconds / 60)}m {selectedAttempt.timeSpentSeconds % 60}s
                </p>
              </div>
            </div>

            {/* AI Summary */}
            {selectedAttempt.summary && (
              <div className="p-4 rounded-2xl bg-primary/5 dark:bg-purple-600/10 border border-primary/20 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary dark:text-purple-300 uppercase tracking-wider">
                  <span>✨</span>
                  <span>AI Proficiency Analysis</span>
                </div>
                <p className="text-xs text-ink leading-relaxed">
                  {selectedAttempt.summary}
                </p>
              </div>
            )}

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span>✓</span> Identified Strengths
                </span>
                <ul className="text-xs text-ink space-y-1 list-disc list-inside">
                  {selectedAttempt.strengths?.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <span>▲</span> Targeted Growth Areas
                </span>
                <ul className="text-xs text-ink space-y-1 list-disc list-inside">
                  {selectedAttempt.weaknesses?.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => setSelectedAttempt(null)}
                className="text-xs font-semibold"
              >
                Close Report
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
