"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { StarfieldCanvas } from "./StarfieldCanvas";
import { HeroProductPreview } from "./HeroProductPreview";
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
    id: "grammar",
    badge: "Instant Fix",
    title: "Grammar Doctor",
    subtitle: "Clauses & Verb Tenses",
    icon: "🔬",
    glowColor: "from-sky-600/20 to-indigo-500/10",
    borderColor: "hover:border-sky-500/60",
    badgeColor: "bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-500/30",
    href: "/dashboard/chat",
  },
  {
    id: "ielts",
    badge: "Band 7.5+",
    title: "IELTS Prep",
    subtitle: "Speaking & Writing Tasks",
    icon: "🎯",
    glowColor: "from-indigo-600/20 to-blue-500/10",
    borderColor: "hover:border-blue-500/60",
    badgeColor: "bg-blue-500/15 text-primary dark:text-blue-300 border-blue-500/30",
    href: "/dashboard/chat",
  },
  {
    id: "speaking",
    badge: "AI Active",
    title: "Speaking AI",
    subtitle: "Real-time Pronunciation",
    icon: "🗣️",
    glowColor: "from-blue-600/20 to-cyan-500/10",
    borderColor: "hover:border-cyan-500/60",
    badgeColor: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border-cyan-500/30",
    href: "/dashboard/chat",
  },
  {
    id: "vocab",
    badge: "Daily XP",
    title: "Vocab Vault",
    subtitle: "Idioms & Phrasal Verbs",
    icon: "📚",
    glowColor: "from-amber-600/20 to-orange-500/10",
    borderColor: "hover:border-amber-500/60",
    badgeColor: "bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30",
    href: "/dashboard/vocabulary",
  },
  {
    id: "writing",
    badge: "Pro Essays",
    title: "Writing Clarity",
    subtitle: "Structure & Coherence",
    icon: "✍️",
    glowColor: "from-emerald-600/20 to-teal-500/10",
    borderColor: "hover:border-emerald-500/60",
    badgeColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30",
    href: "/dashboard/chat",
  },
  {
    id: "listening",
    badge: "Audio Lab",
    title: "Listening Pro",
    subtitle: "Native Accents & Speed",
    icon: "🎧",
    glowColor: "from-purple-600/20 to-blue-500/10",
    borderColor: "hover:border-purple-500/60",
    badgeColor: "bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/30",
    href: "/dashboard/listening",
  },
];

const HIGHLIGHT_TAGS = [
  { label: "Grammar Diagnosis", icon: "🔬" },
  { label: "IELTS Band 7.5+", icon: "🎯" },
  { label: "Speaking Audio AI", icon: "🗣️" },
  { label: "Vocab Vault", icon: "📚" },
];

export function Hero() {
  const [showDemoModal, setShowDemoModal] = useState(false);

  // Interactive spark particle burst on click
  const handleHeroClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    // Don't trigger on buttons, inputs or links
    if (target.closest("button") || target.closest("a") || target.closest("input")) {
      return;
    }

    const colors = ["#818cf8", "#c084fc", "#38bdf8", "#34d399", "#f472b6", "#60a5fa"];
    const sparkCount = 8;
    for (let i = 0; i < sparkCount; i++) {
      const spark = document.createElement("div");
      spark.className = "spark";
      spark.style.left = `${e.clientX}px`;
      spark.style.top = `${e.clientY}px`;
      const angle = ((Math.PI * 2) / sparkCount) * i + (Math.random() - 0.5) * 0.5;
      const dist = 32 + Math.random() * 40;
      spark.style.setProperty("--tx", `${Math.cos(angle) * dist}px`);
      spark.style.setProperty("--ty", `${Math.sin(angle) * dist}px`);
      const color = colors[Math.floor(Math.random() * colors.length)];
      spark.style.backgroundColor = color;
      spark.style.boxShadow = `0 0 10px ${color}`;
      document.body.appendChild(spark);
      setTimeout(() => {
        if (spark.parentNode) spark.remove();
      }, 800);
    }
  }, []);

  return (
    <section
      onClick={handleHeroClick}
      className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-paper dark:bg-[#030712] text-ink dark:text-white transition-colors duration-200 cursor-default"
    >
      {/* Animated Sky & Constellation Canvas with Interactive Mouse Physics */}
      <StarfieldCanvas />

      {/* Ambient Floating Glow Orbs */}
      <div className="glow-orb orb-1 opacity-25 dark:opacity-35" />
      <div className="glow-orb orb-2 opacity-25 dark:opacity-35" />
      <div className="glow-orb orb-3 opacity-20 dark:opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main 2-Column Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
          {/* Left Column: Educational Framing, Bangla Messaging & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Top Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-emerald-500/10 border border-blue-500/20 dark:border-emerald-500/25 backdrop-blur-md text-xs font-semibold tracking-wide text-primary dark:text-emerald-300 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />
              <span>✨ AI-POWERED ENGLISH & IELTS LEARNING</span>
            </div>

            {/* Primary Bilingual Headline */}
            <h1 className="font-bangla text-3xl sm:text-4xl lg:text-[40px] xl:text-[46px] font-bold text-ink dark:text-white leading-[1.22] tracking-tight">
              Grammar বুঝছেন,{" "}
              <span className="block mt-1 sm:mt-1.5 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-primary to-indigo-600 dark:from-cyan-300 dark:via-blue-400 dark:to-indigo-300 drop-shadow-[0_0_25px_rgba(56,189,248,0.25)]">
                কিন্তু English-এ ব্যবহার করতে পারছেন না?
              </span>
            </h1>

            {/* Supporting Core Bangla Statement Callout */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-md space-y-2 relative overflow-hidden before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-gradient-to-b before:from-blue-500 before:to-indigo-600">
              <p className="font-bangla text-base sm:text-lg text-ink dark:text-white font-bold leading-snug">
                &ldquo;IELTS প্রস্তুতি হোক বা Everyday English — আপনার শেখার পথ হবে আপনার জন্যই।&rdquo;
              </p>
              <p className="text-xs sm:text-sm text-ink-soft dark:text-slate-300 leading-relaxed">
                মুখস্থ নয়—AI আপনার ভুল খুঁজে বের করবে, দুর্বলতা বুঝবে এবং আপনার জন্য তৈরি করবে personalized practice ও instant feedback।
              </p>
            </div>

            {/* Learning Feature Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {HIGHLIGHT_TAGS.map((tag) => (
                <span
                  key={tag.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100/90 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/10 text-ink dark:text-slate-200 shadow-2xs"
                >
                  <span>{tag.icon}</span>
                  <span>{tag.label}</span>
                </span>
              ))}
            </div>

            {/* CTA Buttons Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                href="/dashboard/chat"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-primary to-indigo-600 hover:from-blue-500 hover:via-primary-dark hover:to-indigo-500 text-white font-bold text-base transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 dark:shadow-[0_0_30px_rgba(37,99,235,0.45)] hover:scale-[1.02] active:scale-95 text-center"
              >
                <span className="font-bangla text-lg font-bold">শেখা শুরু করুন</span>
              </Link>

              <button
                onClick={() => setShowDemoModal(true)}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white/90 dark:bg-white/10 hover:bg-white dark:hover:bg-white/15 text-ink dark:text-white font-semibold text-base border border-slate-300/80 dark:border-white/15 backdrop-blur-md transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-sm hover:shadow-md cursor-pointer"
              >
                <span>🎮 How It Works</span>
              </button>
            </div>

            {/* Trust Checkmarks Checklist */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 pt-1 text-xs text-ink-soft dark:text-slate-300 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-500 dark:text-emerald-400 font-bold">✓</span>
                <span>Personalized Practice</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-500 dark:text-emerald-400 font-bold">✓</span>
                <span>Instant Weakness Diagnosis</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-500 dark:text-emerald-400 font-bold">✓</span>
                <span>IELTS Band 7.5+ Benchmarks</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive AI Learning Product Visualization */}
          <div className="lg:col-span-6 mt-6 lg:mt-0">
            <HeroProductPreview />
          </div>
        </div>

        {/* Illuminated Learning Tracks Exploration Section */}
        <div className="mt-16 pt-10 border-t border-slate-200/70 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-primary dark:text-cyan-300">
                EXPLORE LEARNING TRACKS
              </span>
              <h3 className="font-bangla text-base sm:text-lg font-bold text-ink dark:text-white mt-0.5">
                আপনার লক্ষ্য অনুযায়ী মডিউল বেছে নিন
              </h3>
            </div>
            <span className="text-xs text-ink-soft dark:text-slate-400">
              6 Specialized Practice Areas
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {LEARNING_TRACKS.map((track) => (
              <Link
                key={track.id}
                href={track.href}
                className={`group relative p-4 rounded-2xl bg-white/85 dark:bg-white/[0.04] hover:bg-white dark:hover:bg-white/[0.08] border border-slate-200/80 dark:border-white/10 ${track.borderColor} backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 shadow-sm dark:shadow-none hover:shadow-lg dark:hover:shadow-[0_10px_25px_rgba(0,0,0,0.5)] flex flex-col justify-between overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-blue-500 before:via-indigo-500 before:to-purple-500 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300`}
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
                    <h4 className="font-display text-sm font-bold text-ink dark:text-white group-hover:text-primary dark:group-hover:text-cyan-300 transition-colors">
                      {track.title}
                    </h4>
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
              className="absolute -top-12 right-0 text-white hover:text-white/80 bg-white/20 hover:bg-white/30 p-2 rounded-full text-sm backdrop-blur-md transition-colors cursor-pointer"
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


