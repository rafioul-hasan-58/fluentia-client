import React from "react";
import Link from "next/link";
import {
  Compass,
  BookOpen,
  MessageSquare,
  Zap,
  CheckCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { CurvedUnderline } from "@/components/ui";


interface LearningStep {
  stepNumber: string;
  category: string;
  title: string;
  description: string;
  badgeStyle: string;
  iconBg: string;
  iconColor: string;
  icon: React.ComponentType<{ className?: string }>;
  accentGlow: string;
  borderColor: string;
}

const LEARNING_STEPS: LearningStep[] = [
  {
    stepNumber: "01",
    category: "ASSESS",
    title: "Find Your Level",
    description:
      "Start with a quick assessment that reveals your current level, strengths, grammar gaps, and vocabulary needs.",
    badgeStyle:
      "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    iconBg: "bg-purple-500/10 dark:bg-purple-500/20",
    iconColor: "text-purple-600 dark:text-purple-400",
    icon: Compass,
    accentGlow: "from-purple-500/20 to-transparent",
    borderColor: "hover:border-purple-500/50 dark:hover:border-purple-400/40",
  },
  {
    stepNumber: "02",
    category: "LEARN",
    title: "Learn What You Need",
    description:
      "Get focused lessons for the grammar, vocabulary, pronunciation, and language patterns you actually need.",
    badgeStyle:
      "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    iconBg: "bg-indigo-500/10 dark:bg-indigo-500/20",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    icon: BookOpen,
    accentGlow: "from-indigo-500/20 to-transparent",
    borderColor: "hover:border-indigo-500/50 dark:hover:border-indigo-400/40",
  },
  {
    stepNumber: "03",
    category: "APPLY",
    title: "Use It in Context",
    description:
      "Practice immediately in conversations, roleplays, sentence generation, and real-life tasks.",
    badgeStyle:
      "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/20",
    iconBg: "bg-fuchsia-500/10 dark:bg-fuchsia-500/20",
    iconColor: "text-fuchsia-600 dark:text-fuchsia-400",
    icon: MessageSquare,
    accentGlow: "from-fuchsia-500/20 to-transparent",
    borderColor: "hover:border-fuchsia-500/50 dark:hover:border-fuchsia-400/40",
  },
  {
    stepNumber: "04",
    category: "FEEDBACK",
    title: "Instant Diagnostic Feedback",
    description:
      "Receive real-time correction for grammatical slips, unnatural phrasing, and word-choice errors.",
    badgeStyle:
      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    iconBg: "bg-rose-500/10 dark:bg-rose-500/20",
    iconColor: "text-rose-600 dark:text-rose-400",
    icon: Zap,
    accentGlow: "from-rose-500/20 to-transparent",
    borderColor: "hover:border-rose-500/50 dark:hover:border-rose-400/40",
  },
  {
    stepNumber: "05",
    category: "RETAIN",
    title: "Mastery Tracking",
    description:
      "Every mistake is recorded into your personalized error profile and tracked until full mastery.",
    badgeStyle:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    icon: CheckCheck,
    accentGlow: "from-emerald-500/20 to-transparent",
    borderColor: "hover:border-emerald-500/50 dark:hover:border-emerald-400/40",
  },
  {
    stepNumber: "06",
    category: "PRACTICE",
    title: "Targeted Weakness Drills",
    description:
      "Generate custom follow-up exercises focused exactly on the gaps you struggled with before.",
    badgeStyle:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    iconBg: "bg-amber-500/10 dark:bg-amber-500/20",
    iconColor: "text-amber-600 dark:text-amber-400",
    icon: TrendingUp,
    accentGlow: "from-amber-500/20 to-transparent",
    borderColor: "hover:border-amber-500/50 dark:hover:border-amber-400/40",
  },
];

export function Features() {
  return (
    <section
      className="py-20 lg:py-28 bg-paper dark:bg-[#070510] text-ink dark:text-white relative overflow-hidden transition-colors duration-200"
    >
      <div id="features" className="absolute -top-20" aria-hidden="true" />
      {/* Subtle Background Radial Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary/5 dark:bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-fuchsia-500/5 dark:bg-fuchsia-500/10 rounded-full blur-[120px] pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-12 sm:space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 text-primary dark:text-purple-300 text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Adaptive Learning Loop</span>
          </div>

          <h2 className="font-bangla text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-ink dark:text-white leading-[1.35] sm:leading-[1.32]">
            যা প্রয়োজন, তা শিখুন।{" "}
            <span className="relative inline-block mt-1 sm:mt-0">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-600 to-fuchsia-500 dark:from-purple-300 dark:via-fuchsia-300 dark:to-indigo-300">
                যা শিখেছেন, তা প্রয়োগ করুন।
              </span>
              <CurvedUnderline className="absolute -bottom-1.5 sm:-bottom-2.5 left-0 w-full" />
            </span>
          </h2>

          <p className="font-bangla text-ink-soft dark:text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed pt-1 max-w-2xl mx-auto">
            Fluentia আপনার English-এর দুর্বল জায়গাগুলো চিহ্নিত করে, প্রয়োজনীয় বিষয়গুলো শেখায় এবং বাস্তব English-এ সেগুলো প্রয়োগ করার সুযোগ দেয়—যাতে প্রতিটি practice session আপনাকে আরও এক ধাপ এগিয়ে নিয়ে যায়।
          </p>
        </div>

        {/* 6-Step Connected Workflow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 relative">
          {LEARNING_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === LEARNING_STEPS.length - 1;

            return (
              <div
                key={idx}
                className={`group relative bg-paper-card border border-slate-200 dark:border-white/10 ${step.borderColor} rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-xl dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden`}
              >
                {/* Subtle Ambient Hover Glow */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${step.accentGlow} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />

                <div className="space-y-4 sm:space-y-5 relative z-10">
                  {/* Top Bar: Step Number, Category Pill & Icon */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-2xl sm:text-3xl font-black text-ink/20 dark:text-white/20 group-hover:text-primary dark:group-hover:text-purple-300 transition-colors duration-300">
                        {step.stepNumber}
                      </span>
                      <span
                        className={`text-[10px] sm:text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${step.badgeStyle}`}
                      >
                        {step.category}
                      </span>
                    </div>

                    <div
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl ${step.iconBg} ${step.iconColor} flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform duration-300 shrink-0`}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="font-brand text-lg sm:text-xl font-bold text-ink group-hover:text-primary dark:group-hover:text-purple-300 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Step Indicator & Flow Arrow */}
                <div className="pt-5 mt-4 border-t border-slate-200/80 dark:border-white/5 flex items-center justify-between text-xs font-semibold text-ink-soft group-hover:text-ink relative z-10 transition-colors">
                  <span className="text-[11px] tracking-wide text-ink-soft/80 font-mono">
                    Step {idx + 1} of 6
                  </span>

                  {isLast ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                      <span>Loops to Step 01</span>
                      <RotateCcw className="w-3.5 h-3.5 animate-spin-slow" />
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-primary dark:text-purple-300 text-[11px] font-semibold transform group-hover:translate-x-1 transition-transform">
                      <span>Next Step</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Continuous Adaptive Loop Footer Banner */}
        <div className="p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden backdrop-blur-md">
          {/* Subtle Accent Edge Glow */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 via-indigo-500 to-fuchsia-500 opacity-60" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
            {/* Workflow Concept Description */}
            <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 max-w-xl">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20 shadow-xs">
                <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 animate-spin-slow" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm sm:text-base font-brand font-bold text-ink flex items-center gap-2">
                  <span>Continuous Adaptive Feedback Loop</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Active System
                  </span>
                </h4>
                <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
                  Fluentia never puts you on a rigid, static track. Every practice
                  session automatically recalibrates around your real mistakes.
                </p>
              </div>
            </div>

            {/* Workflow Pipeline Ribbon & CTA Link */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-ink-soft w-full lg:w-auto justify-start lg:justify-end">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 overflow-x-auto max-w-full text-[11px] font-mono font-bold">
                <span className="px-2 py-1 rounded-lg bg-paper-card text-purple-600 dark:text-purple-400 border border-slate-200 dark:border-white/10 shrink-0">
                  ASSESS
                </span>
                <span className="text-slate-400">→</span>
                <span className="px-2 py-1 rounded-lg bg-paper-card text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-white/10 shrink-0">
                  LEARN
                </span>
                <span className="text-slate-400">→</span>
                <span className="px-2 py-1 rounded-lg bg-paper-card text-fuchsia-600 dark:text-fuchsia-400 border border-slate-200 dark:border-white/10 shrink-0">
                  APPLY
                </span>
                <span className="text-slate-400">→</span>
                <span className="px-2 py-1 rounded-lg bg-paper-card text-amber-600 dark:text-amber-400 border border-slate-200 dark:border-white/10 shrink-0">
                  PRACTICE
                </span>
                <span className="text-slate-400">→</span>
                <span className="px-2 py-1 rounded-lg bg-paper-card text-rose-600 dark:text-rose-400 border border-slate-200 dark:border-white/10 shrink-0">
                  CORRECT
                </span>
                <span className="text-slate-400">→</span>
                <span className="px-2 py-1 rounded-lg bg-emerald-600 text-white shadow-xs shrink-0 flex items-center gap-1">
                  <span>IMPROVE</span>
                  <span className="text-[9px]">↻</span>
                </span>
              </div>

              <Link
                href="/register"
                className="ml-auto lg:ml-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/40 transition-all hover:scale-[1.02] active:scale-95 text-center shrink-0"
              >
                Experience The Loop →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
