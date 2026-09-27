"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, RotateCw, ArrowRight } from "lucide-react";

interface VocabPracticeEmptyStateProps {
    hasActiveFilters: boolean;
    onResetFilters: () => void;
}

export const VocabPracticeEmptyState: React.FC<VocabPracticeEmptyStateProps> = ({
    hasActiveFilters,
    onResetFilters,
}) => {
    return (
        <div className="p-10 sm:p-16 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                <BookOpen className="w-7 h-7" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {hasActiveFilters
                    ? "No Words Match Your Selected Filters"
                    : "No Saved Vocabulary Yet"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                {hasActiveFilters
                    ? "Try picking a different date or part of speech, or reset your filters to practice all words in your vault."
                    : "Add words to your personal Vocabulary Vault to start interactive flashcard recall sessions and definition quizzes."}
            </p>
            <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
                {hasActiveFilters ? (
                    <button
                        type="button"
                        onClick={onResetFilters}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
                    >
                        <span>Reset Filters to Practice All</span>
                        <RotateCw className="w-3.5 h-3.5" />
                    </button>
                ) : (
                    <Link
                        href="/dashboard/user/vocabulary"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-all"
                    >
                        <span>Go to Vocabulary Vault</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                )}
            </div>
        </div>
    );
};
