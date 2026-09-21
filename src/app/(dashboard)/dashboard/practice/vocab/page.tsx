"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Volume2,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  CheckCircle2,
  XCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  Star,
  Shuffle,
  Layers,
  HelpCircle,
} from "lucide-react";
import { MyVocabularyItem } from "@/features/vocabulary/types/vocabulary";
import { fetchMyVocabularies } from "@/features/vocabulary/api/vocabulary";
import { updateMyVocabulary } from "@/features/vocabulary/api/myVocabulary";
import { POS_COLORS } from "@/features/vocabulary/constants/vocabularyConstants";

type PracticeMode = "flashcards" | "quiz";

export default function VocabPracticePage() {
  const [vocabularies, setVocabularies] = useState<MyVocabularyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mode, setMode] = useState<PracticeMode>("flashcards");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  // Quiz state
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });

  // Load user vocabulary
  useEffect(() => {
    async function loadWords() {
      setIsLoading(true);
      try {
        const items = await fetchMyVocabularies({ limit: 100 });
        setVocabularies(items);
      } catch (err) {
        console.warn("Could not load vocabularies for practice:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadWords();
  }, []);

  const currentWord = vocabularies[currentIndex];

  // Speech pronunciation helper
  const playPronunciation = (wordText: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(wordText);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.toLowerCase().includes("jenny") ||
          v.name.toLowerCase().includes("natural") ||
          v.name.toLowerCase().includes("female") ||
          v.name.toLowerCase().includes("samantha"))
    );
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    setPlayingWord(wordText);
    utterance.onend = () => setPlayingWord(null);
    utterance.onerror = () => setPlayingWord(null);
    window.speechSynthesis.speak(utterance);
  };

  // Setup quiz when word changes
  useEffect(() => {
    if (!currentWord || vocabularies.length < 2) return;
    setSelectedOption(null);
    setQuizFeedback(null);

    const correctAnswer = currentWord.word.meaning;
    const otherMeanings = vocabularies
      .filter((v) => v.id !== currentWord.id)
      .map((v) => v.word.meaning)
      .filter(Boolean);

    // Pick 3 random distractor meanings
    const shuffledOthers = [...otherMeanings].sort(() => 0.5 - Math.random()).slice(0, 3);
    const options = [...shuffledOthers, correctAnswer].sort(() => 0.5 - Math.random());
    setQuizOptions(options);
  }, [currentIndex, currentWord, vocabularies]);

  const handleNext = () => {
    setIsFlipped(false);
    setSelectedOption(null);
    setQuizFeedback(null);
    setCurrentIndex((prev) => (prev + 1) % vocabularies.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setSelectedOption(null);
    setQuizFeedback(null);
    setCurrentIndex((prev) => (prev - 1 + vocabularies.length) % vocabularies.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setSelectedOption(null);
    setQuizFeedback(null);
    const shuffled = [...vocabularies].sort(() => 0.5 - Math.random());
    setVocabularies(shuffled);
    setCurrentIndex(0);
  };

  const handleRateMastery = async (level: number) => {
    if (!currentWord) return;
    try {
      await updateMyVocabulary(currentWord.id, { masteryLevel: level });
      setVocabularies((prev) =>
        prev.map((v) => (v.id === currentWord.id ? { ...v, masteryLevel: level } : v))
      );
    } catch (err) {
      console.warn("Could not sync mastery level:", err);
    }
    handleNext();
  };

  const handleSelectQuizOption = (option: string) => {
    if (selectedOption || !currentWord) return;
    setSelectedOption(option);
    const isCorrect = option === currentWord.word.meaning;
    setQuizFeedback(isCorrect ? "correct" : "incorrect");
    setQuizScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6 animate-in fade-in duration-300">
      {/* Navigation Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/practice"
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
            onClick={() => setMode("flashcards")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === "flashcards"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Flashcards
          </button>
          <button
            type="button"
            onClick={() => setMode("quiz")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === "quiz"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Definition Quiz
          </button>
        </div>
      </div>

      {isLoading ? (
        /* Loading Skeleton */
        <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-4 animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60" />
          <div className="h-5 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-4 w-64 bg-slate-100 dark:bg-slate-800/60 rounded" />
        </div>
      ) : vocabularies.length === 0 ? (
        /* Empty State */
        <div className="p-10 sm:p-16 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <BookOpen className="w-7 h-7" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            No Saved Vocabulary Yet
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Add words to your personal Vocabulary Vault to start interactive flashcard recall sessions and definition quizzes.
          </p>
          <Link
            href="/dashboard/vocabulary"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-all"
          >
            <span>Go to Vocabulary Vault</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        /* Practice Container */
        <div className="space-y-5">
          {/* Progress & Control Bar */}
          <div className="flex items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 dark:text-white font-mono">
                {currentIndex + 1} / {vocabularies.length}
              </span>
              <span className="hidden sm:inline">words in session</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShuffle}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                title="Shuffle words"
              >
                <Shuffle className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handlePrev}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                title="Previous word"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                title="Next word"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Flashcard Mode */}
          {mode === "flashcards" && currentWord && (
            <div className="space-y-4">
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="min-h-[340px] sm:min-h-[380px] p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600/60 shadow-md cursor-pointer transition-all flex flex-col justify-between select-none group relative overflow-hidden"
              >
                {/* Top card bar: Part of Speech + Flip hint */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${
                      POS_COLORS[currentWord.word.partOfSpeech]?.bg || "bg-indigo-50"
                    } ${POS_COLORS[currentWord.word.partOfSpeech]?.text || "text-indigo-600"} ${
                      POS_COLORS[currentWord.word.partOfSpeech]?.border || "border-indigo-200"
                    }`}
                  >
                    {currentWord.word.partOfSpeech}
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
                          playPronunciation(currentWord.word.word);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold text-xs border border-indigo-200 dark:border-indigo-800 transition-colors"
                      >
                        <Volume2
                          className={`w-4 h-4 ${
                            playingWord === currentWord.word.word ? "animate-pulse text-indigo-600" : ""
                          }`}
                        />
                        <span>{playingWord === currentWord.word.word ? "Playing..." : "Pronounce"}</span>
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

                    {/* Definition */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        English Definition
                      </span>
                      <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                        {currentWord.word.meaning}
                      </p>
                    </div>

                    {/* Example Sentence */}
                    {currentWord.word.exampleSentences && currentWord.word.exampleSentences[0] && (
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
                      onClick={() => handleRateMastery(1)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition-colors"
                    >
                      Hard
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRateMastery(3)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors"
                    >
                      Good
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRateMastery(5)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
                    >
                      Mastered ⭐
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quiz Mode */}
          {mode === "quiz" && currentWord && (
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
                    "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-800 dark:text-slate-200";
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
                      onClick={() => handleSelectQuizOption(opt)}
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
                    onClick={handleNext}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs"
                  >
                    <span>Next Word</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
