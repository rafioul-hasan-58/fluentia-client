"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { fetchUserLevelTestHistory } from "@/lib/api/levelTest";
import { LevelTestEvaluationData } from "@/types/level-test";
import {
  Award,
  CheckCircle2,
  TrendingUp,
  Clock,
  BookOpen,
  Sparkles,
  RotateCcw,
  ArrowRight,
  FileText,
  BarChart3,
  Target,
  Brain,
  Check,
  X,
  ChevronRight,
  Flame,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { StreakWidget } from "@/components/dashboard";

export default function DashboardPage() {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<any[]>([]);
  const [latestEvaluation, setLatestEvaluation] = useState<LevelTestEvaluationData | null>(null);
  const [selectedAttempt, setSelectedAttempt] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"all" | "diagnostic" | "ielts">("all");

  useEffect(() => {
    let isMounted = true;
    async function loadTestHistory() {
      setIsLoading(true);
      try {
        const history = await fetchUserLevelTestHistory(user?.email);
        if (isMounted) {
          setAttempts(history.attempts);
          setLatestEvaluation(history.latestEvaluation);
        }
      } catch (err) {
        console.warn("Could not load user test history:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadTestHistory();
    return () => {
      isMounted = false;
    };
  }, [user?.email]);

  const latestAttempt = attempts.length > 0 ? attempts[0] : null;

  // Compute CEFR level & label
  const userCEFR =
    user?.estimatedCEFR ||
    latestAttempt?.cefrLevel ||
    user?.level ||
    "B2";

  const getCEFRDescription = (lvl: string) => {
    switch (lvl?.toUpperCase()) {
      case "A1":
        return { label: "Beginner", ielts: "Band 3.0-3.5", color: "from-slate-500 to-slate-700", badge: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20" };
      case "A2":
        return { label: "Elementary", ielts: "Band 4.0-4.5", color: "from-blue-500 to-cyan-600", badge: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20" };
      case "B1":
        return { label: "Intermediate", ielts: "Band 5.0-6.0", color: "from-amber-500 to-orange-600", badge: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20" };
      case "B2":
        return { label: "Upper Intermediate", ielts: "Band 6.5-7.5", color: "from-purple-600 to-indigo-600", badge: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20" };
      case "C1":
        return { label: "Advanced", ielts: "Band 7.5-8.5", color: "from-emerald-500 to-teal-600", badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20" };
      case "C2":
        return { label: "Proficiency / Mastery", ielts: "Band 9.0", color: "from-rose-500 to-fuchsia-600", badge: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20" };
      default:
        return { label: "Upper Intermediate", ielts: "Band 6.5-7.5", color: "from-purple-600 to-indigo-600", badge: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20" };
    }
  };

  const cefrInfo = getCEFRDescription(userCEFR);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Recent";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const filteredAttempts = attempts.filter((att) => {
    if (activeTab === "diagnostic") {
      return !att.id?.includes("ielts");
    }
    if (activeTab === "ielts") {
      return att.id?.includes("ielts");
    }
    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-8 text-ink pb-12 animate-fadeIn">
      {/* Welcome & Placement Banner */}
      <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-purple-600/15 via-primary/10 to-fuchsia-600/15 dark:from-[#0F0C20] dark:via-[#181236] dark:to-[#0F0C20] border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl -z-0" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 dark:bg-purple-500/20 border border-primary/20 dark:border-purple-500/30 text-primary dark:text-purple-300 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
              <span>
                Day {user?.streakDays ?? user?.profile?.streakDays ?? 0} Streak: {user?.streakDays ? "Active Fluency Routine" : "Start Today's Streak"}
              </span>
            </div>

            <h1 className="font-brand text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight">
              Welcome back, {user?.firstName || user?.name || "Learner"}! 👋
            </h1>

            <p className="text-xs sm:text-sm lg:text-base text-ink-soft leading-relaxed">
              Your AI curriculum is actively calibrated to{" "}
              <strong className="text-ink font-semibold">
                CEFR {userCEFR} ({cefrInfo.label})
              </strong>
              . Complete diagnostic assessments to adjust your AI tutor’s speaking tempo and vocabulary difficulty.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/level-test/general"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-primary to-fuchsia-600 hover:from-purple-500 hover:via-primary-dark hover:to-fuchsia-500 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-purple-500/25 hover:shadow-lg hover:shadow-purple-500/40 dark:shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:scale-[1.02] active:scale-95 text-center"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Take Level Diagnostic</span>
              </Link>

              <Link
                href="/dashboard/chat"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white/10 dark:text-white hover:bg-slate-800 dark:hover:bg-white/15 text-xs sm:text-sm font-semibold border border-slate-200/20 dark:border-white/10 transition-all hover:scale-[1.02] active:scale-95 text-center"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>AI Conversation</span>
              </Link>

              <Link
                href="/dashboard/level-test"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-ink text-xs sm:text-sm font-semibold border border-slate-200 dark:border-white/10 transition-all text-center"
              >
                <BookOpen className="w-4 h-4 text-ink-soft" />
                <span>Assessment Options</span>
              </Link>
            </div>
          </div>

          {/* CEFR Badge Card */}
          <div className="shrink-0 p-5 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-lg flex flex-col items-center justify-center text-center min-w-[200px]">
            <span className="text-[10px] uppercase font-bold tracking-wider text-ink-soft">
              Current CEFR Level
            </span>
            <div className="my-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-brand font-extrabold text-3xl shadow-md shadow-purple-500/30">
              {userCEFR}
            </div>
            <p className="text-xs font-bold text-ink">{cefrInfo.label}</p>
            <span className="text-[11px] text-ink-soft font-medium">{cefrInfo.ielts} Equiv.</span>
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-white/10 w-full flex items-center justify-between text-[11px]">
              <span className="text-ink-soft">Tests Completed</span>
              <span className="font-bold text-primary dark:text-purple-300">
                {attempts.length} {attempts.length === 1 ? "Test" : "Tests"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-1.5 sm:space-y-2 relative overflow-hidden group hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-ink-soft font-semibold">
              Diagnostic Level
            </span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-ink">CEFR {userCEFR}</h3>
          <p className="text-[10px] sm:text-[11px] text-primary dark:text-purple-300 font-medium line-clamp-1">
            {cefrInfo.label} ({cefrInfo.ielts})
          </p>
        </div>

        <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-1.5 sm:space-y-2 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-ink-soft font-semibold">
              Best Accuracy
            </span>
            <Target className="w-4 h-4 text-emerald-500" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {latestAttempt ? `${latestAttempt.percentage}%` : "80%"}
          </h3>
          <p className="text-[10px] sm:text-[11px] text-ink-soft font-medium line-clamp-1">
            {latestAttempt
              ? `${latestAttempt.score}/${latestAttempt.totalQuestions} Questions Correct`
              : "Diagnostic score"}
          </p>
        </div>

        <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-1.5 sm:space-y-2 relative overflow-hidden group hover:border-blue-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-ink-soft font-semibold">
              Total Attempts
            </span>
            <BarChart3 className="w-4 h-4 text-blue-500" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-ink">
            {attempts.length} {attempts.length === 1 ? "Attempt" : "Attempts"}
          </h3>
          <p className="text-[10px] sm:text-[11px] text-blue-600 dark:text-blue-400 font-medium line-clamp-1">
            Last evaluated {latestAttempt ? formatDate(latestAttempt.createdAt).split(",")[0] : "Recently"}
          </p>
        </div>

        <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-1.5 sm:space-y-2 relative overflow-hidden group hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-ink-soft font-semibold">
              Study Streak
            </span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-ink">
            🔥 {user?.streakDays ?? user?.profile?.streakDays ?? 0} {user?.streakDays === 1 ? "Day" : "Days"}
          </h3>
          <p className="text-[10px] sm:text-[11px] text-amber-600 dark:text-amber-400 font-medium line-clamp-1">
            {user?.lastActiveDate && user.lastActiveDate.startsWith(new Date().toISOString().slice(0, 10))
              ? "Secured for today ✅"
              : `Target: ${user?.profile?.dailyGoalMinutes || 15} mins / day`}
          </p>
        </div>
      </div>

      {/* Streak Consistency Widget & Placement Assessment Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        <div className="lg:col-span-1">
          <StreakWidget variant="card" />
        </div>

        <div className="lg:col-span-2">
          {latestAttempt ? (
            <div className="h-full p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-5 flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Latest Diagnostic Result
                      </span>
                      <span className="text-xs text-ink-soft">
                        • {formatDate(latestAttempt.createdAt)}
                      </span>
                    </div>
                    <h2 className="font-brand text-lg sm:text-xl font-bold text-ink">
                      General English Placement Evaluation
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedAttempt(latestAttempt)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary dark:text-purple-300 text-xs font-semibold transition-colors border border-primary/20"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Full AI Report</span>
                    </button>
                    <Link
                      href="/level-test/general"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-ink text-xs font-medium transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retake</span>
                    </Link>
                  </div>
                </div>

                {/* Result Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                  {/* Score & CEFR */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-500/5 to-primary/10 border border-purple-500/20 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-primary text-white flex flex-col items-center justify-center shadow-sm shrink-0">
                      <span className="font-brand font-extrabold text-lg leading-none">
                        {latestAttempt.cefrLevel}
                      </span>
                      <span className="text-[8px] uppercase font-bold tracking-wider opacity-80">
                        CEFR
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-ink-soft">
                        Accuracy
                      </span>
                      <h4 className="text-base font-bold text-ink">
                        {latestAttempt.percentage}%
                      </h4>
                      <p className="text-[10px] text-ink-soft">
                        {latestAttempt.score}/{latestAttempt.totalQuestions} Correct
                      </p>
                    </div>
                  </div>

                  {/* Time Spent */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-ink-soft">
                        Time
                      </span>
                      <h4 className="text-base font-bold text-ink">
                        {formatDuration(latestAttempt.timeSpentSeconds)}
                      </h4>
                      <p className="text-[10px] text-ink-soft">Completed</p>
                    </div>
                  </div>

                  {/* Proficiency Band */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-ink-soft">
                        Level
                      </span>
                      <h4 className="text-sm font-bold text-ink truncate">
                        {getCEFRDescription(latestAttempt.cefrLevel).label}
                      </h4>
                      <p className="text-[10px] text-ink-soft">
                        {getCEFRDescription(latestAttempt.cefrLevel).ielts}
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Qualitative Feedback preview */}
                {latestAttempt.summary && (
                  <div className="mt-3.5 p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/5 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary dark:text-purple-300">
                      <Brain className="w-3.5 h-3.5" />
                      <span>AI Tutor Recommendation</span>
                    </div>
                    <p className="text-xs text-ink-soft leading-relaxed line-clamp-2">
                      "{latestAttempt.summary}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full p-6 rounded-2xl sm:rounded-3xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary dark:text-purple-300 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="font-brand text-base font-bold text-ink">
                  Diagnostic Placement Test
                </h3>
                <p className="text-xs text-ink-soft">
                  Take a 5-minute placement assessment to unlock adaptive AI learning calibrated to your CEFR level.
                </p>
              </div>
              <Link
                href="/level-test/general"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold shadow-sm transition-all"
              >
                <span>Take Diagnostic Test</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Level Test Attempts & History Log */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-brand text-xl sm:text-2xl font-bold text-ink">
              Level Assessment History & Attempts
            </h2>
            <p className="text-xs sm:text-sm text-ink-soft">
              Track your proficiency trajectory and review detailed diagnostic reports.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === "all"
                    ? "bg-white dark:bg-white/10 text-ink shadow-xs"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                All ({attempts.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("diagnostic")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === "diagnostic"
                    ? "bg-white dark:bg-white/10 text-ink shadow-xs"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                General English
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("ielts")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === "ielts"
                    ? "bg-white dark:bg-white/10 text-ink shadow-xs"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                IELTS
              </button>
            </div>

            <Link
              href="/level-test/general"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-colors shadow-sm"
            >
              <span>+ New Test</span>
            </Link>
          </div>
        </div>

        {/* Attempts Table / List */}
        {filteredAttempts.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary dark:text-purple-300 flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="font-brand text-lg font-bold text-ink">
                No level tests taken yet
              </h3>
              <p className="text-xs sm:text-sm text-ink-soft">
                Take our 5-minute diagnostic test to establish your baseline CEFR level and unlock custom AI tutoring.
              </p>
            </div>
            <Link
              href="/level-test/general"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-semibold hover:bg-primary-dark transition-all shadow-md"
            >
              <span>Take First Diagnostic Test</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/75 dark:bg-white/[0.02] text-ink-soft uppercase text-[10px] tracking-wider font-semibold">
                    <th className="py-3.5 px-4 sm:px-6">Assessment Title</th>
                    <th className="py-3.5 px-4">CEFR Level</th>
                    <th className="py-3.5 px-4">Score & Accuracy</th>
                    <th className="py-3.5 px-4">Duration</th>
                    <th className="py-3.5 px-4">Date Completed</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-white/5">
                  {filteredAttempts.map((att, idx) => {
                    const isIELTS = att.id?.includes("ielts");
                    const levelMeta = getCEFRDescription(att.cefrLevel);

                    return (
                      <tr
                        key={att.id || idx}
                        className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors"
                      >
                        {/* Assessment Title */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary dark:text-purple-300 flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
                              {isIELTS ? "IE" : "GE"}
                            </div>
                            <div>
                              <p className="font-semibold text-ink">
                                {isIELTS
                                  ? "IELTS Benchmark Assessment"
                                  : "General English Diagnostic Test"}
                              </p>
                              <span className="text-[11px] text-ink-soft">
                                {att.totalQuestions} Questions • CEFR Standard
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* CEFR Level */}
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${levelMeta.badge}`}
                          >
                            <span>{att.cefrLevel}</span>
                            <span className="text-[10px] opacity-80">({levelMeta.label})</span>
                          </span>
                        </td>

                        {/* Score & Accuracy */}
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-ink">
                                {att.score} / {att.totalQuestions}
                              </span>
                              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                {att.percentage}%
                              </span>
                            </div>
                            <div className="w-24 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${Math.max(5, att.percentage)}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Duration */}
                        <td className="py-4 px-4 text-ink-soft font-mono text-[11px]">
                          {formatDuration(att.timeSpentSeconds)}
                        </td>

                        {/* Date */}
                        <td className="py-4 px-4 text-ink-soft">
                          {formatDate(att.createdAt)}
                        </td>

                        {/* Action */}
                        <td className="py-4 px-4 sm:px-6 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedAttempt(att)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-primary hover:text-white dark:hover:bg-primary text-ink text-xs font-semibold transition-colors"
                          >
                            <span>View Report</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Evaluation Report Modal */}
      {selectedAttempt && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-2xl bg-paper-card border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-primary text-white flex items-center justify-center font-brand font-extrabold text-lg shadow-md shadow-purple-500/20">
                  {selectedAttempt.cefrLevel}
                </div>
                <div>
                  <h3 className="font-brand text-lg font-bold text-ink">
                    Diagnostic Assessment Report
                  </h3>
                  <p className="text-xs text-ink-soft">
                    Evaluated on {formatDate(selectedAttempt.createdAt)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAttempt(null)}
                className="w-8 h-8 rounded-xl text-ink-soft hover:text-ink hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center text-sm font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Score & CEFR Summary */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-ink-soft">
                  Assigned Level
                </span>
                <p className="text-xl font-bold font-brand text-primary dark:text-purple-300">
                  CEFR {selectedAttempt.cefrLevel}
                </p>
                <span className="text-[10px] text-ink-soft">
                  {getCEFRDescription(selectedAttempt.cefrLevel).label}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-ink-soft">
                  Total Score
                </span>
                <p className="text-xl font-bold font-brand text-ink">
                  {selectedAttempt.score} / {selectedAttempt.totalQuestions}
                </p>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  {selectedAttempt.percentage}% Accuracy
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-ink-soft">
                  Time Spent
                </span>
                <p className="text-xl font-bold font-brand text-ink">
                  {formatDuration(selectedAttempt.timeSpentSeconds)}
                </p>
                <span className="text-[10px] text-ink-soft">Completed</span>
              </div>
            </div>

            {/* Section Breakdown Cards */}
            {selectedAttempt.sectionBreakdown && (
              <div className="space-y-2">
                <span className="text-xs uppercase font-bold text-ink-soft">
                  Section Performance Breakdown
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {selectedAttempt.sectionBreakdown.grammar && (
                    <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">
                        Grammar
                      </span>
                      <p className="text-sm font-bold text-ink">
                        {selectedAttempt.sectionBreakdown.grammar.correct} /{" "}
                        {selectedAttempt.sectionBreakdown.grammar.total} (
                        {Math.round(selectedAttempt.sectionBreakdown.grammar.percentage || 0)}%)
                      </p>
                      <div className="h-1.5 w-full rounded-full bg-blue-500/10 overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{
                            width: `${Math.max(5, selectedAttempt.sectionBreakdown.grammar.percentage || 0)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {selectedAttempt.sectionBreakdown.vocabulary && (
                    <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400">
                        Vocabulary
                      </span>
                      <p className="text-sm font-bold text-ink">
                        {selectedAttempt.sectionBreakdown.vocabulary.correct} /{" "}
                        {selectedAttempt.sectionBreakdown.vocabulary.total} (
                        {Math.round(selectedAttempt.sectionBreakdown.vocabulary.percentage || 0)}%)
                      </p>
                      <div className="h-1.5 w-full rounded-full bg-purple-500/10 overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{
                            width: `${Math.max(5, selectedAttempt.sectionBreakdown.vocabulary.percentage || 0)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {selectedAttempt.sectionBreakdown.reading && (
                    <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                        Reading
                      </span>
                      <p className="text-sm font-bold text-ink">
                        {selectedAttempt.sectionBreakdown.reading.correct} /{" "}
                        {selectedAttempt.sectionBreakdown.reading.total} (
                        {Math.round(selectedAttempt.sectionBreakdown.reading.percentage || 0)}%)
                      </p>
                      <div className="h-1.5 w-full rounded-full bg-emerald-500/10 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{
                            width: `${Math.max(5, selectedAttempt.sectionBreakdown.reading.percentage || 0)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* AI Summary */}
            {selectedAttempt.summary && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-primary dark:text-purple-300">
                  <Brain className="w-4 h-4" />
                  <span>AI Proficiency Analysis</span>
                </div>
                <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
                  {selectedAttempt.summary}
                </p>
              </div>
            )}

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedAttempt.strengths && selectedAttempt.strengths.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Identified Strengths
                  </span>
                  <ul className="space-y-1 text-xs text-ink-soft">
                    {selectedAttempt.strengths.map((str: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedAttempt.weaknesses && selectedAttempt.weaknesses.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    Priority Focus Areas
                  </span>
                  <ul className="space-y-1 text-xs text-ink-soft">
                    {selectedAttempt.weaknesses.map((wk: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{wk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => setSelectedAttempt(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-ink text-xs sm:text-sm font-medium transition-colors"
              >
                Close Report
              </button>
              <Link
                href="/level-test/general"
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm font-semibold transition-colors"
              >
                Retake Placement Test
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}