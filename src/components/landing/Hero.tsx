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
    glowColor: "from-blue-600/30 to-cyan-500/10",
    borderColor: "hover:border-cyan-400/60",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    href: "/dashboard/chat",
  },
  {
    id: "ielts",
    badge: "Band 8.0+",
    title: "IELTS Prep",
    subtitle: "Speaking & Writing",
    icon: "🎯",
    glowColor: "from-indigo-600/30 to-blue-500/10",
    borderColor: "hover:border-blue-400/60",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    href: "/dashboard/chat",
  },
  {
    id: "grammar",
    badge: "Instant Fix",
    title: "Grammar Doctor",
    subtitle: "Syntax & Clauses",
    icon: "🔬",
    glowColor: "from-sky-600/30 to-indigo-500/10",
    borderColor: "hover:border-sky-400/60",
    badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    href: "/dashboard/chat",
  },
  {
    id: "vocab",
    badge: "Daily XP",
    title: "Vocab Vault",
    subtitle: "Idioms & Phrasing",
    icon: "📚",
    glowColor: "from-amber-600/30 to-orange-500/10",
    borderColor: "hover:border-amber-400/60",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    href: "/dashboard/vocabulary",
  },
  {
    id: "interview",
    badge: "Career Pro",
    title: "Interview Prep",
    subtitle: "Executive English",
    icon: "💼",
    glowColor: "from-emerald-600/30 to-teal-500/10",
    borderColor: "hover:border-emerald-400/60",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    href: "/dashboard/chat",
  },
  {
    id: "listening",
    badge: "Audio Lab",
    title: "Listening Pro",
    subtitle: "Native Dialects",
    icon: "🎧",
    glowColor: "from-purple-600/30 to-blue-500/10",
    borderColor: "hover:border-purple-400/60",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    href: "/dashboard/listening",
  },
];

export function Hero() {
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-[#030712] text-white">
      {/* Animated Night Sky Canvas with Twinkling Stars & Glowing Planetary Horizon Arc */}
      <StarfieldCanvas />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Top Announcement Tag */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-semibold tracking-wide text-blue-200 shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-cyan-300">✨ NEXT-GEN AI LANGUAGE COACH</span>
            <span className="text-white/40">•</span>
            <span className="text-white/80">Real-time Pronunciation & Grammar</span>
          </div>
        </div>

        {/* Hero Central Header */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] drop-shadow-sm">
            Speak English With{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-300 drop-shadow-[0_0_25px_rgba(56,189,248,0.4)]">
              Absolute
            </span>{" "}
            Confidence
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Your 24/7 personalized AI companion for mastering accent fluency, IELTS prep, writing clarity, and natural vocabulary.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/dashboard/chat"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-base transition-all duration-300 shadow-[0_0_30px_rgba(37,99,235,0.5)] hover:shadow-[0_0_40px_rgba(37,99,235,0.8)] hover:scale-[1.03] active:scale-95"
            >
              Start Free Practice Now →
            </Link>

            <button
              onClick={() => setShowDemoModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-base border border-white/15 backdrop-blur-md transition-all duration-200 hover:scale-[1.02] active:scale-95"
            >
              🎮 Try Interactive Demo
            </button>
          </div>

          {/* Trust Checkmarks */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="text-cyan-400 font-bold">✓</span> No credit card required
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-cyan-400 font-bold">✓</span> Instant sentence diagnosis
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-cyan-400 font-bold">✓</span> IELTS Band 8.0+ Benchmarks
            </div>
          </div>
        </div>

        {/* Illuminated Learning Tracks Category Cards Row (Inspired by reference design) */}
        <div className="mt-16 pt-8">
          <div className="text-center mb-6">
            <span className="text-xs uppercase tracking-widest font-bold text-cyan-300/80">
              Explore Practice Modules & Learning Tracks
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {LEARNING_TRACKS.map((track) => (
              <Link
                key={track.id}
                href={track.href}
                className={`group relative p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 ${track.borderColor} backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_10px_25px_rgba(0,0,0,0.5)] flex flex-col justify-between overflow-hidden`}
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
                    <h3 className="font-display text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {track.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {track.subtitle}
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-semibold text-blue-400 group-hover:text-cyan-300 transition-colors relative z-10">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg">
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute -top-12 right-0 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full text-sm backdrop-blur-md transition-colors"
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
