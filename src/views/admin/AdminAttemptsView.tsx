"use client";

import React, { useState, useEffect, useMemo } from "react";
import { AdminHeader } from "@/components/admin";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  RecentTestAttempt,
  fetchAllSubmissions,
  fetchSubmissionById,
  MOCK_ALL_SUBMISSIONS,
} from "@/lib/api/admin";

export function AdminAttemptsView() {
  const [attempts, setAttempts] = useState<RecentTestAttempt[]>(MOCK_ALL_SUBMISSIONS);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [selectedScoreRange, setSelectedScoreRange] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [selectedAttempt, setSelectedAttempt] = useState<RecentTestAttempt | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const handleSelectAttempt = async (att: RecentTestAttempt) => {
    setSelectedAttempt(att);
    if (!att.summary || att.summary.includes("completed successfully")) {
      const detailed = await fetchSubmissionById(att.id);
      if (detailed) {
        setSelectedAttempt(detailed);
      }
    }
  };

  useEffect(() => {
    async function loadSubmissions() {
      setIsLoading(true);
      try {
        const data = await fetchAllSubmissions({ limit: 50 });
        if (data && data.items && data.items.length > 0) {
          setAttempts(data.items);
        }
      } catch {
        // fallback
      } finally {
        setIsLoading(false);
      }
    }
    loadSubmissions();
  }, []);

  const filteredAndSortedAttempts = useMemo(() => {
    let result = attempts.filter((att) => {
      const matchesSearch =
        att.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        att.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        att.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLevel =
        selectedLevel === "ALL" ||
        att.cefrLevel?.toUpperCase() === selectedLevel.toUpperCase();

      let matchesScore = true;
      if (selectedScoreRange === "HIGH") {
        matchesScore = att.percentage >= 80;
      } else if (selectedScoreRange === "MEDIUM") {
        matchesScore = att.percentage >= 50 && att.percentage < 80;
      } else if (selectedScoreRange === "LOW") {
        matchesScore = att.percentage < 50;
      }

      return matchesSearch && matchesLevel && matchesScore;
    });

    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === "score_high") {
        return b.percentage - a.percentage;
      }
      if (sortBy === "score_low") {
        return a.percentage - b.percentage;
      }
      if (sortBy === "speed") {
        return a.timeSpentSeconds - b.timeSpentSeconds;
      }
      return 0;
    });

    return result;
  }, [attempts, searchQuery, selectedLevel, selectedScoreRange, sortBy]);

  // Dynamic statistics from loaded attempts
  const stats = useMemo(() => {
    const total = attempts.length;
    if (total === 0) return { avgScore: 0, highAchievers: 0, avgTimeMins: 0 };
    const avgScore = Math.round(
      attempts.reduce((sum, item) => sum + item.percentage, 0) / total
    );
    const highAchievers = attempts.filter((i) => i.percentage >= 80).length;
    const avgTimeSecs = Math.round(
      attempts.reduce((sum, item) => sum + item.timeSpentSeconds, 0) / total
    );
    return {
      avgScore,
      highAchievers,
      avgTimeMins: (avgTimeSecs / 60).toFixed(1),
    };
  }, [attempts]);

  const getCefrBadge = (level: string) => {
    switch (level?.toUpperCase()) {
      case "C2":
        return "bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30";
      case "C1":
        return "bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/30";
      case "B2":
        return "bg-primary/15 text-primary dark:text-purple-300 border-primary/30";
      case "B1":
        return "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30";
      case "A2":
        return "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30";
      default:
        return "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30";
    }
  };

  const getScoreColor = (pct: number) => {
    if (pct >= 80) return "text-emerald-600 dark:text-emerald-400";
    if (pct >= 60) return "text-primary dark:text-purple-300";
    if (pct >= 40) return "text-amber-500";
    return "text-rose-500";
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <AdminHeader
        title="Placement Test Attempts"
        subtitle="Comprehensive log of learner evaluations, sectional proficiencies, and AI diagnostics."
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{attempts.length} Total Submissions</span>
            </span>
          </div>
        }
      />

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <div className="p-4 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-1">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-ink-soft font-semibold">
            Recorded Attempts
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-ink font-brand">
            {attempts.length}
          </h3>
          <p className="text-[11px] text-ink-soft">Evaluated tests</p>
        </div>

        <div className="p-4 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-1">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-ink-soft font-semibold">
            Cohort Avg Score
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-primary dark:text-purple-300 font-brand">
            {stats.avgScore}%
          </h3>
          <p className="text-[11px] text-ink-soft">Across all sections</p>
        </div>

        <div className="p-4 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-1">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-ink-soft font-semibold">
            High Achievers (80%+)
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-brand">
            {stats.highAchievers}
          </h3>
          <p className="text-[11px] text-ink-soft">Advanced / Mastery rank</p>
        </div>

        <div className="p-4 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-1">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-ink-soft font-semibold">
            Avg Duration
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-ink font-brand">
            {stats.avgTimeMins}m
          </h3>
          <p className="text-[11px] text-ink-soft">Per test completion</p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 sm:p-5 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft text-sm">
              🔍
            </span>
            <Input
              type="text"
              placeholder="Search by learner name, email, or attempt ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs h-10"
            />
          </div>

          {/* Sort & View Mode Toggle */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-ink-soft uppercase tracking-wider">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-9 px-2.5 rounded-xl bg-paper border border-slate-200 dark:border-white/10 text-xs font-semibold text-ink"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="score_high">Highest Score</option>
                <option value="score_low">Lowest Score</option>
                <option value="speed">Fastest Duration</option>
              </select>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200/60 dark:border-white/5">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "table"
                    ? "bg-white dark:bg-white/15 text-ink shadow-xs"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                ☰ Table
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-white/15 text-ink shadow-xs"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                ⊞ Grid
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft mr-1">
            CEFR Level:
          </span>
          {["ALL", "A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setSelectedLevel(lvl)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedLevel === lvl
                  ? "bg-primary text-white shadow-xs"
                  : "bg-slate-100 dark:bg-white/5 text-ink-soft hover:text-ink"
              }`}
            >
              {lvl}
            </button>
          ))}

          <div className="w-px h-4 bg-slate-200 dark:border-white/10 mx-1 hidden sm:block" />

          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft mr-1">
            Score:
          </span>
          {[
            { key: "ALL", label: "All Scores" },
            { key: "HIGH", label: "High (≥80%)" },
            { key: "MEDIUM", label: "Mid (50-79%)" },
            { key: "LOW", label: "Needs Help (<50%)" },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setSelectedScoreRange(item.key)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedScoreRange === item.key
                  ? "bg-primary text-white shadow-xs"
                  : "bg-slate-100 dark:bg-white/5 text-ink-soft hover:text-ink"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Attempts Content */}
      {isLoading ? (
        <div className="p-12 text-center text-ink-soft text-sm flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Loading placement test attempts...</span>
        </div>
      ) : filteredAndSortedAttempts.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-paper-card border border-slate-200 dark:border-white/10 space-y-2">
          <p className="text-sm font-semibold text-ink">No test attempts matched your filter criteria.</p>
          <p className="text-xs text-ink-soft">Try selecting a different CEFR level or resetting search filters.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedLevel("ALL");
              setSelectedScoreRange("ALL");
            }}
            className="mt-2 text-xs"
          >
            Reset Filters
          </Button>
        </div>
      ) : viewMode === "table" ? (
        /* Table Layout */
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-ink-soft text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Learner</th>
                <th className="py-3 px-3">CEFR Rating</th>
                <th className="py-3 px-3">Score</th>
                <th className="py-3 px-3">Section Breakdown</th>
                <th className="py-3 px-3">Duration</th>
                <th className="py-3 px-3">Submitted</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredAndSortedAttempts.map((att) => (
                <tr
                  key={att.id}
                  className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group"
                >
                  {/* Learner Info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={att.avatar || undefined}
                        fallback={att.userName.slice(0, 2).toUpperCase()}
                        size="sm"
                        className="w-8 h-8 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-ink truncate group-hover:text-primary dark:group-hover:text-purple-300 transition-colors">
                          {att.userName}
                        </p>
                        <p className="text-[11px] text-ink-soft truncate">{att.userEmail}</p>
                      </div>
                    </div>
                  </td>

                  {/* CEFR Level */}
                  <td className="py-3.5 px-3">
                    <span className={`inline-flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-full border ${getCefrBadge(att.cefrLevel)}`}>
                      <span>⭐</span>
                      <span>{att.cefrLevel}</span>
                    </span>
                  </td>

                  {/* Score */}
                  <td className="py-3.5 px-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className={getScoreColor(att.percentage)}>
                          {att.percentage}%
                        </span>
                        <span className="text-[11px] text-ink-soft font-normal">
                          ({att.score}/{att.totalQuestions})
                        </span>
                      </div>
                      <div className="h-1.5 w-24 rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-purple-600 to-primary"
                          style={{ width: `${att.percentage}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Section Breakdown */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1.5">
                      {att.sectionBreakdown?.grammar && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono">
                          G: {att.sectionBreakdown.grammar.correct}/{att.sectionBreakdown.grammar.total}
                        </span>
                      )}
                      {att.sectionBreakdown?.vocabulary && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono">
                          V: {att.sectionBreakdown.vocabulary.correct}/{att.sectionBreakdown.vocabulary.total}
                        </span>
                      )}
                      {att.sectionBreakdown?.reading && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono">
                          R: {att.sectionBreakdown.reading.correct}/{att.sectionBreakdown.reading.total}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Duration */}
                  <td className="py-3.5 px-3 text-ink-soft font-mono text-[11px]">
                    {Math.floor(att.timeSpentSeconds / 60)}m {att.timeSpentSeconds % 60}s
                  </td>

                  {/* Submitted Date */}
                  <td className="py-3.5 px-3 text-ink-soft text-[11px] whitespace-nowrap">
                    {formatDate(att.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleSelectAttempt(att)}
                      className="px-3 py-1 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white dark:text-purple-300 text-xs font-semibold transition-all"
                    >
                      View Report →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedAttempts.map((att) => (
            <div
              key={att.id}
              className="p-5 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 hover:border-primary/40 shadow-sm transition-all space-y-4 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar
                      src={att.avatar || undefined}
                      fallback={att.userName.slice(0, 2).toUpperCase()}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-xs text-ink truncate group-hover:text-primary dark:group-hover:text-purple-300 transition-colors">
                        {att.userName}
                      </p>
                      <p className="text-[10px] text-ink-soft truncate">{att.userEmail}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${getCefrBadge(att.cefrLevel)}`}>
                    ⭐ {att.cefrLevel}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-ink-soft">Raw Score:</span>
                    <span className="font-bold text-ink">
                      {att.score} / {att.totalQuestions} ({att.percentage}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-200/60 dark:bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-600 to-primary"
                      style={{ width: `${att.percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-ink-soft pt-1">
                    <span>⏱ {Math.floor(att.timeSpentSeconds / 60)}m {att.timeSpentSeconds % 60}s</span>
                    <span>{formatDate(att.createdAt)}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectAttempt(att)}
                className="w-full py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-primary hover:text-white dark:hover:bg-primary text-ink text-xs font-semibold transition-colors"
              >
                Inspect Full Report →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Evaluation Report Modal */}
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
                <span className="text-[10px] uppercase font-bold text-ink-soft">Score Result</span>
                <p className="text-xl font-bold font-brand text-ink">
                  {selectedAttempt.score} / {selectedAttempt.totalQuestions} ({selectedAttempt.percentage}%)
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-ink-soft">Time Spent</span>
                <p className="text-xl font-bold font-brand text-ink">
                  {Math.floor(selectedAttempt.timeSpentSeconds / 60)}m {selectedAttempt.timeSpentSeconds % 60}s
                </p>
              </div>
            </div>

            {/* Section Breakdown Cards */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-ink-soft">
                Section Performance Breakdown
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {selectedAttempt.sectionBreakdown?.grammar && (
                  <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">
                      Grammar
                    </span>
                    <p className="text-sm font-bold text-ink">
                      {selectedAttempt.sectionBreakdown.grammar.correct} / {selectedAttempt.sectionBreakdown.grammar.total}
                    </p>
                    <div className="h-1.5 w-full rounded-full bg-blue-500/10 overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${selectedAttempt.sectionBreakdown.grammar.percentage}%` }}
                      />
                    </div>
                  </div>
                )}
                {selectedAttempt.sectionBreakdown?.vocabulary && (
                  <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400">
                      Vocabulary
                    </span>
                    <p className="text-sm font-bold text-ink">
                      {selectedAttempt.sectionBreakdown.vocabulary.correct} / {selectedAttempt.sectionBreakdown.vocabulary.total}
                    </p>
                    <div className="h-1.5 w-full rounded-full bg-purple-500/10 overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${selectedAttempt.sectionBreakdown.vocabulary.percentage}%` }}
                      />
                    </div>
                  </div>
                )}
                {selectedAttempt.sectionBreakdown?.reading && (
                  <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                      Reading
                    </span>
                    <p className="text-sm font-bold text-ink">
                      {selectedAttempt.sectionBreakdown.reading.correct} / {selectedAttempt.sectionBreakdown.reading.total}
                    </p>
                    <div className="h-1.5 w-full rounded-full bg-emerald-500/10 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${selectedAttempt.sectionBreakdown.reading.percentage}%` }}
                      />
                    </div>
                  </div>
                )}
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
                  {selectedAttempt.strengths && selectedAttempt.strengths.length > 0 ? (
                    selectedAttempt.strengths.map((s, i) => {
                      if (!s) return null;
                      if (typeof s === "object") {
                        const itemObj = s as Record<string, any>;
                        return (
                          <li key={i}>
                            {itemObj.area && <strong className="font-semibold">{itemObj.area}: </strong>}
                            {itemObj.description || itemObj.title || JSON.stringify(itemObj)}
                          </li>
                        );
                      }
                      return <li key={i}>{String(s)}</li>;
                    })
                  ) : (
                    <li className="text-ink-soft italic">No specific strengths flagged</li>
                  )}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <span>▲</span> Targeted Growth Areas
                </span>
                <ul className="text-xs text-ink space-y-1 list-disc list-inside">
                  {selectedAttempt.weaknesses && selectedAttempt.weaknesses.length > 0 ? (
                    selectedAttempt.weaknesses.map((w, i) => {
                      if (!w) return null;
                      if (typeof w === "object") {
                        const itemObj = w as Record<string, any>;
                        return (
                          <li key={i}>
                            {itemObj.area && <strong className="font-semibold">{itemObj.area}: </strong>}
                            {itemObj.description || itemObj.recommendation || JSON.stringify(itemObj)}
                          </li>
                        );
                      }
                      return <li key={i}>{String(w)}</li>;
                    })
                  ) : (
                    <li className="text-ink-soft italic">Zero major weaknesses detected</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10">
              <span className="text-[10px] text-ink-soft font-mono">
                Submission ID: {selectedAttempt.id}
              </span>
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
