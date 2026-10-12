"use client";

import React from "react";
import { RotateCw, Volume2, ChevronLeft, ChevronRight } from "lucide-react";
import { MyVocabularyItem } from "@/types";
import { POS_COLORS } from "@/features/vocabulary";

interface VocabFlashcardProps {
    currentWord: MyVocabularyItem;
    isFlipped: boolean;
    onToggleFlip: () => void;
    playingWord: string | null;
    onPlayPronunciation: (word: string) => void;
    onRateMastery: (level: number) => void;
    onPrev: () => void;
    onNext: () => void;
}

export const VocabFlashcard: React.FC<VocabFlashcardProps> = ({
    currentWord,
    isFlipped,
    onToggleFlip,
    playingWord,
    onPlayPronunciation,
    onRateMastery,
    onPrev,
    onNext,
}) => {
    const pos = currentWord.word.partOfSpeech;
    const posConfig = POS_COLORS[pos];

    return (
        <div className="relative group/carousel">
            {/* Backward / Prev Carousel Button */}
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onPrev();
                }}
                className="absolute left-2 sm:-left-5 md:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-110 active:scale-95 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
                title="Previous word"
                aria-label="Previous word"
            >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div
                onClick={onToggleFlip}
                className="min-h-[350px] sm:min-h-[390px] p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600/60 shadow-md cursor-pointer transition-all flex flex-col justify-between select-none group relative overflow-hidden"
            >
                {/* Top card bar: Part of Speech + Flip hint */}
                <div className="flex items-center justify-between">
                    <span
                        className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${
                            posConfig?.bg || "bg-indigo-50"
                        } ${posConfig?.text || "text-indigo-600"} ${
                            posConfig?.border || "border-indigo-200"
                        }`}
                    >
                        {pos}
                    </span>

                    <span className="text-[11px] font-semibold text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center gap-1 transition-colors">
                        <RotateCw className="w-3.5 h-3.5" />
                        {isFlipped ? "Show Word" : "Flip for Meaning"}
                    </span>
                </div>

                {/* Card Body */}
                {!isFlipped ? (
                    /* FRONT: Word & Pronunciation */
                    <div className="my-auto text-center space-y-4">
                        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            {currentWord.word.word}
                        </h2>

                        {currentWord.word.banglaPronunciation && (
                            <p className="text-sm sm:text-base font-semibold text-indigo-600 dark:text-indigo-400 font-bangla">
                                উচ্চারণ: {currentWord.word.banglaPronunciation}
                            </p>
                        )}

                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onPlayPronunciation(currentWord.word.word);
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold text-xs border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer"
                            >
                                <Volume2
                                    className={`w-4 h-4 ${
                                        playingWord === currentWord.word.word
                                            ? "animate-pulse text-indigo-600"
                                            : ""
                                    }`}
                                />
                                <span>
                                    {playingWord === currentWord.word.word
                                        ? "Playing..."
                                        : "Pronounce"}
                                </span>
                            </button>
                        </div>
                    </div>
                ) : (
                    /* BACK: Meaning, Bangla, Example */
                    <div className="my-auto space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        {/* Bangla Meaning Card */}
                        {currentWord.word.banglaMeaning && (
                            <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-1">
                                    Bangla Meaning
                                </span>
                                <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-emerald-100 font-bangla">
                                    {currentWord.word.banglaMeaning}
                                </p>
                            </div>
                        )}

                        {/* English Definition */}
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                English Definition
                            </span>
                            <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                                {currentWord.word.meaning}
                            </p>
                        </div>

                        {/* Example Sentence */}
                        {currentWord.word.exampleSentences &&
                            currentWord.word.exampleSentences[0] && (
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic">
                                    &ldquo;{currentWord.word.exampleSentences[0]}&rdquo;
                                </div>
                            )}
                    </div>
                )}

                {/* Footer: Mastery Rating Buttons */}
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap"
                >
                    <span className="text-xs font-medium text-slate-500">Rate Recall:</span>
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => onRateMastery(1)}
                            className="px-3 py-1 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition-colors cursor-pointer"
                        >
                            Hard
                        </button>
                        <button
                            type="button"
                            onClick={() => onRateMastery(3)}
                            className="px-3 py-1 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
                        >
                            Good
                        </button>
                        <button
                            type="button"
                            onClick={() => onRateMastery(5)}
                            className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
                        >
                            Mastered ⭐
                        </button>
                    </div>
                </div>
            </div>

            {/* Forward / Next Carousel Button */}
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                }}
                className="absolute right-2 sm:-right-5 md:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-110 active:scale-95 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
                title="Next word"
                aria-label="Next word"
            >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
        </div>
    );
};
