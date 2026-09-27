"use client";

import React from "react";
import { HelpCircle, CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import { MyVocabularyItem } from "@/types";

interface VocabQuizProps {
    currentWord: MyVocabularyItem;
    quizOptions: string[];
    selectedOption: string | null;
    quizFeedback: "correct" | "incorrect" | null;
    quizScore: { correct: number; total: number };
    onSelectOption: (option: string) => void;
    onNext: () => void;
}

export const VocabQuiz: React.FC<VocabQuizProps> = ({
    currentWord,
    quizOptions,
    selectedOption,
    quizFeedback,
    quizScore,
    onSelectOption,
    onNext,
}) => {
    return (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
            {/* Question Header */}
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-indigo-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        What does this word mean?
                    </span>
                </div>
                {quizScore.total > 0 && (
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                        Score: {quizScore.correct} / {quizScore.total} (
                        {Math.round((quizScore.correct / quizScore.total) * 100)}%)
                    </span>
                )}
            </div>

            {/* Target Word Display */}
            <div className="text-center py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {currentWord.word.word}
                </h2>
                {currentWord.word.banglaPronunciation && (
                    <p className="text-xs font-semibold text-slate-500 font-bangla">
                        {currentWord.word.banglaPronunciation}
                    </p>
                )}
            </div>

            {/* Options Grid */}
            <div className="space-y-2.5">
                {quizOptions.map((opt, idx) => {
                    const isSelected = selectedOption === opt;
                    const isCorrect = opt === currentWord.word.meaning;

                    let style =
                        "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-800 dark:text-slate-200 cursor-pointer";
                    if (selectedOption) {
                        if (isCorrect) {
                            style =
                                "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold shadow-xs";
                        } else if (isSelected) {
                            style =
                                "bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-900 dark:text-rose-200";
                        } else {
                            style = "opacity-50 border-slate-200 dark:border-slate-700";
                        }
                    }

                    return (
                        <button
                            key={idx}
                            type="button"
                            disabled={!!selectedOption}
                            onClick={() => onSelectOption(opt)}
                            className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-3 ${style}`}
                        >
                            <span>{opt}</span>
                            {selectedOption && isCorrect && (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                            )}
                            {selectedOption && isSelected && !isCorrect && (
                                <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Feedback Callout */}
            {selectedOption && (
                <div className="flex items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                        {quizFeedback === "correct" ? (
                            <span className="text-xs sm:text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4" /> Correct answer! Well done!
                            </span>
                        ) : (
                            <span className="text-xs sm:text-sm font-bold text-rose-600 flex items-center gap-1.5">
                                <XCircle className="w-4 h-4" /> Not quite right. Keep practicing!
                            </span>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onNext}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
                    >
                        <span>Next Word</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};
