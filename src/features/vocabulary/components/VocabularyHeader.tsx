import React from "react";
import { BookOpen, Clock, Plus, Sparkles, Star, TrendingUp } from "lucide-react";
import { PartOfSpeech } from "@/types";

interface VocabularyHeaderProps {
  stats: {
    total: number;
    favorites: number;
    todayCount: number;
    posCounts?: Partial<Record<PartOfSpeech, number>>;
    masteredCount: number;
  };
  todayOnly: boolean;
  setTodayOnly: (val: boolean | ((prev: boolean) => boolean)) => void;
  setSelectedDate: (date: string | null) => void;
  isStorySelectMode: boolean;
  setIsStorySelectMode: (mode: boolean | ((prev: boolean) => boolean)) => void;
  selectedStoryItems: any[];
  setSelectedStoryItems: (items: any[]) => void;
  setIsModalOpen: (open: boolean) => void;
}

const VocabularyHeader = ({
  stats,
  todayOnly,
  setTodayOnly,
  setSelectedDate,
  isStorySelectMode,
  setIsStorySelectMode,
  selectedStoryItems,
  setSelectedStoryItems,
  setIsModalOpen,
}: VocabularyHeaderProps) => {
  return (
    <div>
      <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-purple-600/15 via-primary/10 to-fuchsia-600/15 dark:from-[#0F0C20] dark:via-[#181236] dark:to-[#0F0C20] border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-2xl relative overflow-hidden text-ink">
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl -z-0" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 dark:bg-purple-500/20 border border-primary/20 dark:border-purple-500/30 text-primary dark:text-purple-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
              <span>AI-Powered Lexicon Vault</span>
            </div>
            <h1 className="font-brand text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight">
              Vocabulary Vault 📚
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-ink-soft leading-relaxed">
              Expand your active vocabulary with instant AI linguistic insights, Bengali definitions,
              collocations, synonyms, CEFR levels, and personal sentence building.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-primary to-fuchsia-600 hover:from-purple-500 hover:via-primary-dark hover:to-fuchsia-500 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-purple-500/25 hover:shadow-lg hover:shadow-purple-500/40 dark:shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:scale-[1.02] active:scale-95 text-center cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Vocabulary</span>
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
            </button>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 bg-white/70 dark:bg-white/5 rounded-2xl p-3.5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary dark:text-purple-300 flex items-center justify-center border border-primary/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-ink-soft font-medium">Total Words</p>
              <p className="text-xl font-bold text-ink">{stats.total}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/70 dark:bg-white/5 rounded-2xl p-3.5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-ink-soft font-medium">Favorites</p>
              <p className="text-xl font-bold text-ink">{stats.favorites}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/70 dark:bg-white/5 rounded-2xl p-3.5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-ink-soft font-medium">Mastered (4★+)</p>
              <p className="text-xl font-bold text-ink">{stats.masteredCount}</p>
            </div>
          </div>

          <div
            onClick={() => {
              const nextVal = !todayOnly;
              setTodayOnly(nextVal);
              if (nextVal) setSelectedDate(null);
            }}
            className={`flex items-center gap-3 bg-white/70 dark:bg-white/5 rounded-2xl p-3.5 backdrop-blur-md border transition-all cursor-pointer ${
              todayOnly
                ? "border-purple-500/50 dark:border-purple-500/60 bg-purple-500/15 dark:bg-purple-500/20 shadow-md ring-2 ring-purple-500/20"
                : "border-slate-200/80 dark:border-white/10 shadow-sm hover:border-purple-500/30"
            }`}
            title="Click to filter Today's Words"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-300 flex items-center justify-center border border-purple-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-ink-soft font-medium">Today&apos;s Vocab</p>
              <p className="text-xl font-bold text-ink">{stats.todayCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocabularyHeader;
