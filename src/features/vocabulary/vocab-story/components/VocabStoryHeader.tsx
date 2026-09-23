"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, BookOpen, BookText, Layers } from "lucide-react";

interface VocabStoryHeaderProps {
  totalStories: number;
  totalTargetWords: number;
  onCreateStory?: () => void;
}

export const VocabStoryHeader: React.FC<VocabStoryHeaderProps> = ({
  totalStories,
  totalTargetWords,
  onCreateStory,
}) => {
  const router = useRouter();

  const handleCreateStory = () => {
    if (onCreateStory) {
      onCreateStory();
    } else {
      router.push("/dashboard/user/vocabulary?mode=create-story");
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-purple-600/15 dark:from-[#131127] dark:via-[#1a1435] dark:to-[#131127] border border-amber-500/20 dark:border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-sm dark:shadow-2xl">
      <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-3xl -z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-3xl -z-0 pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold font-brand tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>AI Contextual Storyteller</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Vocabulary Stories 📖
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Transform 5 to 10 vocabulary words from your vault into immersive, memorable bilingual stories (🇧🇩 Bangla-English mixed) and natural full English narratives (🇬🇧).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/dashboard/user/vocabulary"
            className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-indigo-500" />
            <span>Vocabulary Vault</span>
          </Link>

          <button
            onClick={handleCreateStory}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Create Story</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Strip */}
      <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 bg-white/70 dark:bg-white/5 rounded-2xl p-3.5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
            <BookText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Stories</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{totalStories}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/70 dark:bg-white/5 rounded-2xl p-3.5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Target Words Stored</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {totalTargetWords}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 bg-white/70 dark:bg-white/5 rounded-2xl p-3.5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Bilingual Learning</p>
            <p className="text-xs text-purple-600 dark:text-purple-400 font-bold mt-1">Bangla + English</p>
          </div>
        </div>
      </div>
    </div>
  );
};
