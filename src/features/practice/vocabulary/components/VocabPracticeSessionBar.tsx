"use client";

import React from "react";
import { Shuffle, ChevronLeft, ChevronRight } from "lucide-react";
import { PartOfSpeech } from "@/types";
import { POS_COLORS } from "@/features/vocabulary";

interface VocabPracticeSessionBarProps {
    currentIndex: number;
    totalWords: number;
    selectedPos: PartOfSpeech | "ALL";
    onPrev: () => void;
    onNext: () => void;
    onShuffle: () => void;
}

export const VocabPracticeSessionBar: React.FC<VocabPracticeSessionBarProps> = ({
    currentIndex,
    totalWords,
    selectedPos,
    onPrev,
    onNext,
    onShuffle,
}) => {
    return (
        <div className="flex items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">
                    Word {currentIndex + 1} of {totalWords}
                </span>
                {selectedPos !== "ALL" && (
                    <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                        ({POS_COLORS[selectedPos]?.label})
                    </span>
                )}
            </div>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={onShuffle}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                    title="Shuffle session words"
                >
                    <Shuffle className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={onPrev}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                    title="Previous word"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                    title="Next word"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
