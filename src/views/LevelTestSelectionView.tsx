"use client";

import React from "react";
import Link from "next/link";
import { GridBackground } from "@/components/landing/GridBackground";
import { CurvedUnderline } from "@/components/ui/curved-underline";

interface TestCardInfo {
  id: string;
  badge: string;
  badgeColor: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  questions: string;
  benchmark: string;
  ratingLabel: string;
  features: string[];
  gradientBg: string;
  borderColor: string;
  buttonGradient: string;
  buttonText: string;
  href: string;
  popular?: boolean;
}

const TEST_OPTIONS: TestCardInfo[] = [
  {
    id: "general",
    badge: "Most Popular • CEFR A1 - C2",
    badgeColor: "bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/30",
    icon: "🌍",
    title: "General English Level Test",
    subtitle: "দৈনন্দিন ইংরেজি, Grammar ও Vocabulary দক্ষতা যাচাই",
    description:
      "Assess your everyday communication proficiency across Grammar accuracy, Vocabulary range, Reading comprehension, and Sentence construction based on the international CEFR standard.",
    duration: "15 - 20 Mins",
    questions: "20 Questions",
    benchmark: "CEFR Level (A1 - C2)",
    ratingLabel: "CEFR Benchmark",
    features: [
      "Grammar & Tenses Diagnostic (Clauses, Prepositions, Voice)",
      "Lexical Range & Common Collocations Evaluation",
      "Reading Comprehension & Context Inference",
      "Instant AI Weakness Report & Custom Practice Plan",
    ],
    gradientBg: "from-purple-600/10 via-indigo-600/5 to-transparent dark:from-purple-900/20 dark:via-[#181236]/40 dark:to-[#0F0C20]",
    borderColor: "border-purple-500/30 dark:border-purple-500/30 hover:border-purple-500/60",
    buttonGradient: "from-purple-600 via-primary to-fuchsia-600 hover:from-purple-500 hover:via-primary-dark hover:to-fuchsia-500 shadow-purple-500/25",
    buttonText: "Start General English Test",
    href: "/level-test/general",
    popular: true,
  },
  {
    id: "ielts",
    badge: "Target Band 7.5+ • Academic & GT",
    badgeColor: "bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-300 border-fuchsia-500/30",
    icon: "🎯",
    title: "IELTS Benchmark Test",
    subtitle: "IELTS প্রস্তুতি ও আনুমানিক ব্যান্ড স্কোর মূল্যায়ন",
    description:
      "Designed specifically for IELTS candidates. Evaluate your readiness across Reading, Grammatical Range & Accuracy (GRA), Lexical Resource, and Task Response with an estimated Band prediction.",
    duration: "20 - 25 Mins",
    questions: "30 Questions",
    benchmark: "Band Score (4.0 - 9.0)",
    ratingLabel: "Estimated Band",
    features: [
      "Academic & General Reading Speed & Precision",
      "Complex Sentence Structures & Paraphrasing Accuracy",
      "Band 7.5+ Lexical Resource & Formal Register Check",
      "Personalized IELTS Roadmap & Band Gap Analysis",
    ],
    gradientBg: "from-fuchsia-600/10 via-purple-600/5 to-transparent dark:from-fuchsia-900/20 dark:via-[#181236]/40 dark:to-[#0F0C20]",
    borderColor: "border-fuchsia-500/30 dark:border-fuchsia-500/30 hover:border-fuchsia-500/60",
    buttonGradient: "from-fuchsia-600 via-primary to-purple-600 hover:from-fuchsia-500 hover:via-primary-dark hover:to-purple-500 shadow-fuchsia-500/25",
    buttonText: "Start IELTS Benchmark Test",
    href: "/dashboard/chat?mode=level-test-ielts",
    popular: false,
  },
];

export function LevelTestSelectionView() {
  return (
    <div className="relative min-h-[85vh] py-10 sm:py-16 overflow-hidden">
      {/* Background Grid & Ambient Glows */}
      <GridBackground squareSize={64} showDots={true} />
      <div className="glow-orb orb-1 opacity-20 dark:opacity-30 pointer-events-none" />
      <div className="glow-orb orb-2 opacity-20 dark:opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-10 sm:space-y-14">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 text-primary dark:text-purple-300 text-xs font-bold uppercase tracking-wider shadow-2xs">
            <span>✨ AI DIAGNOSTIC ASSESSMENT</span>
          </div>

          <h1 className="font-bangla text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink dark:text-white leading-[1.3] sm:leading-[1.28]">
            আপনার জন্য সঠিক{" "}
            <span className="relative inline-block mt-1 sm:mt-0">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-600 to-fuchsia-500 dark:from-purple-300 dark:via-fuchsia-300 dark:to-indigo-300">
                Level Test বেছে নিন
              </span>
              <CurvedUnderline className="absolute -bottom-2 left-0 w-full" />
            </span>
          </h1>

          <p className="font-bangla text-ink-soft dark:text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed pt-1 max-w-2xl mx-auto">
            আপনার বর্তমান দক্ষতা নির্ভুলভাবে মূল্যায়ন করুন। AI আপনার প্রতিটি উত্তর বিশ্লেষণ করে আপনার weaknesses চিহ্নিত করবে এবং একটি customized learning path তৈরি করে দেবে।
          </p>
        </div>

        {/* 2 Diagnostic Test Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          {TEST_OPTIONS.map((test) => (
            <div
              key={test.id}
              className={`relative rounded-3xl p-6 sm:p-8 bg-paper-card border ${test.borderColor} shadow-lg hover:shadow-2xl dark:shadow-[0_10px_35px_rgba(0,0,0,0.5)] transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1`}
            >
              {/* Top Accent Gradient Wash */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${test.gradientBg} opacity-80 pointer-events-none`}
              />

              <div className="relative z-10 space-y-6">
                {/* Header: Icon, Badge, Popular Pill */}
                <div className="flex items-start justify-between gap-3">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/90 dark:bg-white/10 border border-slate-200 dark:border-white/10 flex items-center justify-center text-3xl sm:text-4xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                    {test.icon}
                  </div>

                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${test.badgeColor} shadow-2xs`}
                  >
                    {test.badge}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="space-y-2">
                  <h2 className="font-brand text-2xl sm:text-3xl font-bold text-ink dark:text-white tracking-tight group-hover:text-primary dark:group-hover:text-purple-300 transition-colors">
                    {test.title}
                  </h2>
                  <p className="font-bangla text-xs sm:text-sm font-semibold text-primary dark:text-purple-300">
                    {test.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-ink-soft dark:text-slate-300 leading-relaxed pt-1">
                    {test.description}
                  </p>
                </div>

                {/* Test Meta Chips */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 py-3 border-y border-slate-200/80 dark:border-white/10">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 text-center">
                    <span className="text-[10px] uppercase font-bold text-ink-soft block">
                      Duration
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-ink dark:text-white">
                      ⏱️ {test.duration}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 text-center">
                    <span className="text-[10px] uppercase font-bold text-ink-soft block">
                      Format
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-ink dark:text-white">
                      📝 {test.questions}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 text-center">
                    <span className="text-[10px] uppercase font-bold text-ink-soft block">
                      {test.ratingLabel}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-primary dark:text-purple-300">
                      🎯 {test.benchmark}
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2.5 pt-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-soft block font-brand">
                    What this test measures:
                  </span>
                  <ul className="space-y-2 text-xs sm:text-sm text-ink-soft dark:text-slate-300">
                    {test.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="relative z-10 pt-6 mt-6 border-t border-slate-200/60 dark:border-white/5">
                <Link
                  href={test.href}
                  className={`w-full inline-flex items-center justify-center gap-2 py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r ${test.buttonGradient} text-white font-bold text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 text-center`}
                >
                  <span>{test.buttonText}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Note */}
        <div className="text-center pt-4">
          <p className="font-bangla text-xs sm:text-sm text-ink-soft dark:text-slate-400">
            🔒 কোনো ক্রেডিট কার্ড বা পেমেন্ট প্রয়োজন নেই • বিনামূল্যে টেস্ট দিয়ে ইনস্ট্যান্ট রেজাল্ট পান
          </p>
        </div>
      </div>
    </div>
  );
}

export default LevelTestSelectionView;
