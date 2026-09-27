"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PracticeMode } from "../types";

interface VocabPracticeHeaderProps {
    mode: PracticeMode;
    onModeChange: (mode: PracticeMode) => void;
}

export const VocabPracticeHeader: React.FC<VocabPracticeHeaderProps> = ({
    mode,
    onModeChange,
}) => {
    return (
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-slate-200 dark:border-slate-800">
            <div>
                <div className="flex items-center gap-2">
                    <Link
                        href="/dashboard/user/practice"
                        className="text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 flex items-center gap-1"
                    >
                        <ChevronLeft className="w-4 h-4" /> Practice Hub
                    </Link>
                    <span className="text-slate-300 dark:text-slate-700">/</span>
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        Vocab Practice
                    </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                    Vocabulary Active Recall
                </h1>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                    type="button"
                    onClick={() => onModeChange("flashcards")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${mode === "flashcards"
                            ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                >
                    Flashcards
                </button>
                <button
                    type="button"
                    onClick={() => onModeChange("quiz")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${mode === "quiz"
                            ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-white shadow-xs"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                >
                    Definition Quiz
                </button>
            </div>
        </div>
    );
};
