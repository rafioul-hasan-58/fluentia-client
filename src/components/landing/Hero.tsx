"use client";

import React, { useState } from "react";
import Link from "next/link";
import { StarfieldCanvas } from "./StarfieldCanvas";
import { ChatDemo } from "./ChatDemo";

interface TrackCard {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  icon: string;
  glowColor: string;
  borderColor: string;
  badgeColor: string;
  href: string;
}

const LEARNING_TRACKS: TrackCard[] = [
  {
    id: "speaking",
    badge: "AI Active",
    title: "Speaking AI",
    subtitle: "Real-time Fluency",
    icon: "🗣️",
    glowColor: "from-blue-600/20 to-cyan-500/10",
    borderColor: "hover:border-cyan-500/60",
    badgeColor: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border-cyan-500/30",
    href: "/dashboard/chat",
  },
  {
    id: "ielts",
    badge: "Band 8.0+",
    title: "IELTS Prep",
    subtitle: "Speaking & Writing",
    icon: "🎯",
    glowColor: "from-indigo-600/20 to-blue-500/10",
    borderColor: "hover:border-blue-500/60",
    badgeColor: "bg-blue-500/15 text-primary dark:text-blue-300 border-blue-500/30",
    href: "/dashboard/chat",
  },
  {
    id: "grammar",
    badge: "Instant Fix",
    title: "Grammar Doctor",
    subtitle: "Syntax & Clauses",
    icon: "🔬",
    glowColor: "from-sky-600/20 to-indigo-500/10",
    borderColor: "hover:border-sky-500/60",
    badgeColor: "bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-500/30",
    href: "/dashboard/chat",
  },
  {
    id: "vocab",
    badge: "Daily XP",
    title: "Vocab Vault",
    subtitle: "Idioms & Phrasing",
    icon: "📚",
    glowColor: "from-amber-600/20 to-orange-500/10",
    borderColor: "hover:border-amber-500/60",
    badgeColor: "bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30",
    href: "/dashboard/vocabulary",
  },
  {
    id: "interview",
    badge: "Career Pro",
    title: "Interview Prep",
    subtitle: "Executive English",
    icon: "💼",
    glowColor: "from-emerald-600/20 to-teal-500/10",
    borderColor: "hover:border-emerald-500/60",
    badgeColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30",
    href: "/dashboard/chat",
  },
  {
    id: "listening",
    badge: "Audio Lab",
    title: "Listening Pro",
    subtitle: "Native Dialects",
    icon: "🎧",
    glowColor: "from-purple-600/20 to-blue-500/10",
    borderColor: "hover:border-purple-500/60",
    badgeColor: "bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/30",
    href: "/dashboard/listening",
  },
];

export function Hero() {
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-paper dark:bg-[#030712] text-ink dark:text-white transition-colors duration-200">
      {/* Animated Sky Canvas with Twinkling Stars & Glowing Horizon Arc */}
      <StarfieldCanvas />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Top Announcement Tag */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 dark:bg-white/5 border border-primary/20 dark:border-white/10 backdrop-blur-md text-xs font-semibold tracking-wide text-primary dark:text-blue-200 shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-primary dark:bg-cyan-400 animate-ping" />
            <span className="text-primary dark:text-cyan-300">✨ NEXT-GEN AI LANGUAGE COACH</span>
            <span className="text-ink-soft/40 dark:text-white/40">•</span>
            <span className="text-ink-soft dark:text-white/80">Real-time Pronunciation & Grammar</span>
          </div>
        </div>

        {/* Hero Central Header */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-ink dark:text-white leading-[1.1] drop-shadow-xs">
            Speak English With{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-primary to-indigo-600 dark:from-cyan-300 dark:via-blue-400 dark:to-indigo-300 drop-shadow-[0_0_25px_rgba(56,189,248,0.3)]">
              Absolute
            </span>{" "}
            Confidence
          </h1>

          <p className="text-base sm:text-lg text-ink-soft dark:text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Your 24/7 personalized AI companion for mastering accent fluency, IELTS prep, writing clarity, and natural vocabulary.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/dashboard/chat"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-base transition-all duration-300 shadow-md dark:shadow-[0_0_30px_rgba(37,99,235,0.5)] hover:scale-[1.03] active:scale-95"
            >
              Start Free Practice Now →
            </Link>

            <button
              onClick={() => setShowDemoModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/15 text-ink dark:text-white font-semibold text-base border border-slate-200 dark:border-white/15 backdrop-blur-md transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-sm"
            >
              🎮 Try Interactive Demo
            </button>
          </div>

          {/* Trust Checkmarks */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs text-ink-soft dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="text-primary dark:text-cyan-400 font-bold">✓</span> No credit card required
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-primary dark:text-cyan-400 font-bold">✓</span> Instant sentence diagnosis
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-primary dark:text-cyan-400 font-bold">✓</span> IELTS Band 8.0+ Benchmarks
            </div>
          </div>
        </div>

        {/* Illuminated Learning Tracks Category Cards Row */}
        <div className="mt-16 pt-8">
          <div className="text-center mb-6">
            <span className="text-xs uppercase tracking-widest font-bold text-primary dark:text-cyan-300/80">
              Explore Practice Modules & Learning Tracks
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {LEARNING_TRACKS.map((track) => (
              <Link
                key={track.id}
                href={track.href}
                className={`group relative p-4 rounded-2xl bg-white/85 dark:bg-white/[0.04] hover:bg-white dark:hover:bg-white/[0.08] border border-slate-200/80 dark:border-white/10 ${track.borderColor} backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 shadow-sm dark:shadow-none hover:shadow-lg dark:hover:shadow-[0_10px_25px_rgba(0,0,0,0.5)] flex flex-col justify-between overflow-hidden`}
              >
                {/* Glow Backdrop Pill */}
                <div
                  className={`absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br ${track.glowColor} rounded-full blur-xl group-hover:scale-150 transition-transform duration-500`}
                />

                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                      {track.icon}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${track.badgeColor}`}
                    >
                      {track.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-sm font-bold text-ink dark:text-white group-hover:text-primary dark:group-hover:text-cyan-300 transition-colors">
                      {track.title}
                    </h3>
                    <p className="text-[11px] text-ink-soft dark:text-slate-400 mt-0.5">
                      {track.subtitle}
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] font-semibold text-primary dark:text-blue-400 group-hover:text-primary-dark dark:group-hover:text-cyan-300 transition-colors relative z-10">
                  <span>Start Practice</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg">
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-white/80 bg-white/20 hover:bg-white/30 p-2 rounded-full text-sm backdrop-blur-md transition-colors"
            >
              ✕ Close Demo
            </button>
            <ChatDemo />
          </div>
        </div>
      )}
    </section>
  );
}
