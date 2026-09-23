"use client";

import React from "react";
import { BookOpen, RefreshCw, Sparkles } from "lucide-react";

interface VocabStoryEmptyStateProps {
  isFiltered: boolean;
  onResetFilters: () => void;
  onCreateStory: () => void;
}

export const VocabStoryEmptyState: React.FC<VocabStoryEmptyStateProps> = ({
  isFiltered,
  onResetFilters,
  onCreateStory,
}) => {
  return (
    <div className="py-16 text-center rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 p-8 space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-500">
        <BookOpen className="w-8 h-8" />
      </div>
      <div className="max-w-md mx-auto space-y-1">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          {isFiltered ? "No matching stories found" : "No Vocabulary Stories Yet"}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {isFiltered
            ? "Try clearing your date or search filters to view your other stories."
            : "Select 5 to 10 vocabulary words from your vault and let AI create an engaging bilingual story for you!"}
        </p>
      </div>
      <button
        onClick={isFiltered ? onResetFilters : onCreateStory}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs sm:text-sm font-bold shadow-md transition cursor-pointer"
      >
        {isFiltered ? (
          <>
            <RefreshCw className="w-4 h-4" />
            <span>Reset Filters</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Create Story</span>
          </>
        )}
      </button>
    </div>
  );
};
