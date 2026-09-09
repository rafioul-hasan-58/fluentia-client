"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Flame,
  CheckCircle2,
  Calendar,
  Trophy,
  Zap,
  Sparkles,
  Shield,
  Info,
  Clock,
  ChevronRight,
  X,
} from "lucide-react";

interface StreakWidgetProps {
  variant?: "card" | "banner" | "compact" | "badge";
  className?: string;
  onOpenModal?: () => void;
}

const MILESTONES = [
  { days: 3, label: "Starter", icon: "🌱", description: "3 consecutive days of practice" },
  { days: 7, label: "Habit Builder", icon: "⚡", description: "1 full week consistency" },
  { days: 14, label: "Momentum", icon: "🚀", description: "2 weeks of daily fluency" },
  { days: 30, label: "Fluency Champion", icon: "👑", description: "1 full month dedication" },
  { days: 100, label: "Language Master", icon: "🏆", description: "Triple digit fluency master" },
];

export function StreakWidget({
  variant = "card",
  className = "",
  onOpenModal,
}: StreakWidgetProps) {
  const { user, recordStreak } = useAuth();
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMsg, setCelebrationMsg] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const streakDays = user?.streakDays ?? user?.profile?.streakDays ?? 5;
  const longestStreak = user?.longestStreak ?? user?.profile?.longestStreak ?? Math.max(streakDays, 14);
  const lastActiveDate = user?.lastActiveDate ?? user?.profile?.lastActiveDate;

  // Determine if already checked in today in client's local timezone
  const todayStr = new Date().toISOString().slice(0, 10);
  const isCheckedInToday = Boolean(
    lastActiveDate && lastActiveDate.startsWith(todayStr)
  );

  const handleCheckIn = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isCheckingIn || isCheckedInToday) return;

    setIsCheckingIn(true);
    try {
      const res = await recordStreak();
      if (res.success) {
        setCelebrationMsg(
          res.message || `🔥 Day ${res.streakDays || streakDays + 1} Streak Logged!`
        );
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 5000);
      }
    } catch (err) {
      console.warn("Streak check-in error:", err);
    } finally {
      setIsCheckingIn(false);
    }
  };

  // Find next milestone
  const nextMilestone =
    MILESTONES.find((m) => m.days > streakDays) || MILESTONES[MILESTONES.length - 1];
  const prevMilestoneDays =
    MILESTONES.slice()
      .reverse()
      .find((m) => m.days <= streakDays)?.days || 0;
  const milestoneProgress = Math.min(
    100,
    Math.max(
      10,
      Math.round(
        ((streakDays - prevMilestoneDays) /
          Math.max(1, nextMilestone.days - prevMilestoneDays)) *
          100
      )
    )
  );

  // Generate 7-day week schedule (Mon - Sun)
  const getWeekDays = () => {
    const today = new Date();
    const currentDayOfWeek = (today.getDay() + 6) % 7; // 0 = Mon, 6 = Sun
    const days = ["M", "T", "W", "T", "F", "S", "S"];
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return days.map((letter, idx) => {
      const isPast = idx < currentDayOfWeek;
      const isToday = idx === currentDayOfWeek;
      const isFuture = idx > currentDayOfWeek;
      const isDone = isPast || (isToday && isCheckedInToday);

      return {
        letter,
        name: dayNames[idx],
        isPast,
        isToday,
        isFuture,
        isDone,
      };
    });
  };

  const weekDays = getWeekDays();

  // Compact Pill / Badge Variant
  if (variant === "badge" || variant === "compact") {
    return (
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
          streakDays > 0
            ? "bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-rose-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:border-amber-500/50 shadow-xs"
            : "bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-ink-soft hover:text-ink"
        } ${className}`}
        title={`Current streak: ${streakDays} days`}
      >
        <Flame
          className={`w-3.5 h-3.5 ${
            streakDays > 0
              ? "text-amber-500 fill-amber-500 animate-pulse"
              : "text-slate-400"
          }`}
        />
        <span>
          {streakDays} {streakDays === 1 ? "Day" : "Days"}
        </span>
      </button>
    );
  }

  // Banner Variant for Top Placement
  if (variant === "banner") {
    return (
      <div
        className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-purple-600/10 border border-amber-500/25 dark:border-amber-500/20 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${className}`}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 text-white flex items-center justify-center shadow-md shadow-orange-500/25 shrink-0">
            <Flame className="w-6 h-6 fill-white text-white animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-ink">
                {streakDays} Day Study Streak 🔥
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 uppercase">
                {isCheckedInToday ? "Logged Today" : "Active Routine"}
              </span>
            </div>
            <p className="text-xs text-ink-soft">
              {isCheckedInToday
                ? "You've checked in today! Keep learning to retain your streak tomorrow."
                : "Practice for at least 5 minutes or click below to secure today's streak."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {!isCheckedInToday ? (
            <button
              type="button"
              onClick={handleCheckIn}
              disabled={isCheckingIn}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold shadow-md shadow-amber-500/25 transition-all hover:scale-102 active:scale-98 disabled:opacity-50"
            >
              <Flame className="w-3.5 h-3.5 fill-white" />
              <span>{isCheckingIn ? "Checking In..." : "Check In Now"}</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Checked in today</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 text-ink text-xs font-semibold transition-colors"
          >
            Details
          </button>
        </div>
      </div>
    );
  }

  // Full Card Widget (Standard Dashboard Grid Placement)
  return (
    <>
      <div
        className={`p-5 sm:p-6 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-4 relative overflow-hidden group hover:border-amber-500/40 transition-all ${className}`}
      >
        {/* Glow ambient background */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-2xl -z-0 pointer-events-none" />

        {/* Header with Flame & Status */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-sm shadow-amber-500/30">
              <Flame className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-ink-soft">
                Daily Study Streak
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-ink">
                {streakDays} {streakDays === 1 ? "Day" : "Days"}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="p-1.5 rounded-lg text-ink-soft hover:text-amber-500 hover:bg-amber-500/10 transition-colors"
            title="View Streak Insights"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* 7-Day Week Dot Tracker */}
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center justify-between text-[11px] text-ink-soft font-medium">
            <span>Weekly Consistency</span>
            <span className="text-amber-600 dark:text-amber-400 font-semibold">
              Best: {longestStreak} Days
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {weekDays.map((day, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center justify-center p-2 rounded-xl text-center border transition-all ${
                  day.isDone
                    ? "bg-gradient-to-b from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-700 dark:text-amber-300 font-bold shadow-2xs"
                    : day.isToday
                    ? "bg-slate-100 dark:bg-white/10 border-amber-500/60 text-ink ring-2 ring-amber-500/30 animate-pulse"
                    : "bg-slate-50 dark:bg-white/[0.02] border-slate-200/60 dark:border-white/5 text-ink-soft"
                }`}
              >
                <span className="text-[10px] font-bold uppercase">{day.letter}</span>
                <div className="mt-1">
                  {day.isDone ? (
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  ) : day.isToday ? (
                    <span className="w-2 h-2 rounded-full bg-amber-500 block" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 block" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestone Progress Bar */}
        <div className="space-y-1.5 pt-1 relative z-10">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-ink-soft flex items-center gap-1">
              <span>{nextMilestone.icon}</span>
              <span>Next: {nextMilestone.label}</span>
            </span>
            <span className="font-bold text-ink font-mono text-[10px]">
              {streakDays}/{nextMilestone.days} Days
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-700 shadow-xs"
              style={{ width: `${milestoneProgress}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-1 relative z-10">
          {isCheckedInToday ? (
            <div className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Today's Streak Secured!</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleCheckIn}
              disabled={isCheckingIn}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 text-white text-xs font-bold shadow-md shadow-orange-500/25 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60"
            >
              <Flame className="w-4 h-4 fill-white" />
              <span>{isCheckingIn ? "Recording Check-in..." : "Claim Today's Streak"}</span>
            </button>
          )}
        </div>

        {/* Celebration Toast Notice */}
        {showCelebration && celebrationMsg && (
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-purple-500/20 border border-amber-500/40 text-amber-800 dark:text-amber-200 text-xs font-semibold flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{celebrationMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setShowCelebration(false)}
              className="text-ink-soft hover:text-ink text-xs p-1"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Detailed Streak Information Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-paper-card border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30">
                  <Flame className="w-6 h-6 fill-white text-white" />
                </div>
                <div>
                  <h3 className="font-brand text-lg font-bold text-ink">
                    Fluency Habit & Daily Streak
                  </h3>
                  <p className="text-xs text-ink-soft">
                    Timezone: {user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-xl text-ink-soft hover:text-ink hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center text-sm font-bold transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Streak Metrics Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300">
                  Current Streak
                </span>
                <p className="text-2xl font-brand font-bold text-amber-600 dark:text-amber-400">
                  🔥 {streakDays}
                </p>
                <span className="text-[10px] text-ink-soft">Consecutive Days</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300">
                  Longest Streak
                </span>
                <p className="text-2xl font-brand font-bold text-purple-600 dark:text-purple-400">
                  ⚡ {longestStreak}
                </p>
                <span className="text-[10px] text-ink-soft">Personal Record</span>
              </div>

              <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300">
                  Today's Status
                </span>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1 pt-1">
                  {isCheckedInToday ? "✅ Secured" : "⏳ Pending"}
                </p>
                <span className="text-[10px] text-ink-soft">
                  {isCheckedInToday ? "All set for today" : "Check in to preserve"}
                </span>
              </div>
            </div>

            {/* Milestones Road */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-bold tracking-wider text-ink-soft">
                Streak Milestone Achievements
              </h4>
              <div className="space-y-2">
                {MILESTONES.map((m) => {
                  const isUnlocked = streakDays >= m.days;
                  return (
                    <div
                      key={m.days}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                        isUnlocked
                          ? "bg-amber-500/10 border-amber-500/30 text-ink"
                          : "bg-slate-50 dark:bg-white/[0.02] border-slate-200/60 dark:border-white/5 text-ink-soft opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{m.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-ink">
                            {m.label} ({m.days} Days)
                          </p>
                          <span className="text-[10px] text-ink-soft">
                            {m.description}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          isUnlocked
                            ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                            : "bg-slate-200 dark:bg-white/10 text-ink-soft"
                        }`}
                      >
                        {isUnlocked ? "Unlocked" : `${m.days - streakDays}d left`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* How Streak Works Note */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 space-y-1.5 text-xs text-ink-soft leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold text-ink">
                <Shield className="w-4 h-4 text-primary" />
                <span>How Fluentia Streaks Work</span>
              </div>
              <p>
                Your streak increments by completing lessons, assessments, or manually checking in every calendar day based on your timezone. Practicing every day solidifies neuro-linguistic memory and elevates your CEFR fluency.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-ink text-xs font-medium transition-colors"
              >
                Close
              </button>
              {!isCheckedInToday && (
                <button
                  type="button"
                  onClick={handleCheckIn}
                  disabled={isCheckingIn}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold transition-all shadow-md shadow-amber-500/25"
                >
                  {isCheckingIn ? "Checking In..." : "Check In Today"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StreakWidget;
