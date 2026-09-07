"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Loader } from "@/components/ui/loader";
import { GridBackground } from "@/components/landing/GridBackground";
import { CurvedUnderline } from "@/components/ui/curved-underline";
import { fetchGeneralLevelTestQuestions } from "@/lib/api/levelTest";
import { LevelTestQuestion, CEFRLevel } from "@/types/level-test";

interface UserAnswersMap {
  [questionId: string]: string; // questionId -> selectedOptionContent
}

export const DONT_KNOW_TEXT = "I don't know";

export function getQuestionOptionsWithUnsure(question: LevelTestQuestion) {
  const options = question.questionOptions || [];
  return [
    ...options,
    {
      id: `${question.id}-dont-know`,
      content: DONT_KNOW_TEXT,
    },
  ];
}

export function GeneralEnglishTestView() {
  const router = useRouter();

  // Test data & lifecycle states
  const [questions, setQuestions] = useState<LevelTestQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quiz progress states
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<UserAnswersMap>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<{ [id: string]: boolean }>({});
  const [isCompleted, setIsCompleted] = useState(false);

  // Time tracking
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<"all" | "incorrect" | "correct" | "unsure">("all");

  // Load questions on mount
  useEffect(() => {
    let isMounted = true;

    async function loadTest() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchGeneralLevelTestQuestions(40);
        if (isMounted) {
          setQuestions(data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to load test questions.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadTest();
    return () => {
      isMounted = false;
    };
  }, []);

  // Timer interval
  useEffect(() => {
    if (loading || isCompleted || questions.length === 0) return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, isCompleted, questions.length]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  // Handle option select
  const handleSelectOption = (content: string) => {
    if (!currentQuestion) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: content,
    }));
  };

  // Toggle question flag
  const toggleFlag = () => {
    if (!currentQuestion) return;
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  // Navigation handlers
  const handleNext = () => {
    if (!currentQuestion || !selectedAnswers[currentQuestion.id]) {
      return;
    }
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Keyboard navigation support (1-5 or A-E for options, Arrow keys for navigation)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (loading || isCompleted || !currentQuestion) return;

      const key = e.key.toUpperCase();
      const options = getQuestionOptionsWithUnsure(currentQuestion);

      if (key === "1" || key === "A") {
        if (options[0]) handleSelectOption(options[0].content);
      } else if (key === "2" || key === "B") {
        if (options[1]) handleSelectOption(options[1].content);
      } else if (key === "3" || key === "C") {
        if (options[2]) handleSelectOption(options[2].content);
      } else if (key === "4" || key === "D") {
        if (options[3]) handleSelectOption(options[3].content);
      } else if (key === "5" || key === "E") {
        if (options[4]) handleSelectOption(options[4].content);
      } else if (e.key === "ArrowRight" || e.key === "Enter") {
        if (selectedAnswers[currentQuestion.id]) {
          handleNext();
        }
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, currentQuestion, selectedAnswers, loading, isCompleted]);

  // Results calculation
  const results = useMemo(() => {
    if (!isCompleted || questions.length === 0) return null;

    let correctCount = 0;
    let unsureCount = 0;
    const sectionStats: {
      [key: string]: { total: number; correct: number };
    } = {};

    questions.forEach((q) => {
      const userSelected = selectedAnswers[q.id];
      const isUnsure = userSelected === DONT_KNOW_TEXT;
      if (isUnsure) unsureCount++;

      const isCorrect =
        !isUnsure &&
        userSelected?.trim().toLowerCase() === q.answer?.trim().toLowerCase();

      if (isCorrect) correctCount++;

      const sec = q.sectionType || "GENERAL";
      if (!sectionStats[sec]) {
        sectionStats[sec] = { total: 0, correct: 0 };
      }
      sectionStats[sec].total += 1;
      if (isCorrect) sectionStats[sec].correct += 1;
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);
    const incorrectCount = questions.length - correctCount - unsureCount;

    // CEFR Level Determination
    let estimatedLevel: CEFRLevel = "A1";
    let levelTitle = "Beginner (A1)";
    let levelDescription =
      "You understand basic everyday expressions and phrases. With targeted practice on essential sentence structures, you will rapidly advance.";

    if (scorePercentage >= 90) {
      estimatedLevel = "C1";
      levelTitle = "Advanced (C1)";
      levelDescription =
        "Exceptional fluency! You can express ideas fluently and spontaneously with a broad lexical resource and complex grammatical structures.";
    } else if (scorePercentage >= 75) {
      estimatedLevel = "B2";
      levelTitle = "Upper-Intermediate (B2)";
      levelDescription =
        "Strong command of English! You interact with high degree of fluency and grammar accuracy with minor slips in complex structures.";
    } else if (scorePercentage >= 55) {
      estimatedLevel = "B1";
      levelTitle = "Intermediate (B1)";
      levelDescription =
        "Good solid foundation! You can handle most everyday conversation situations and clearly convey main points on familiar matters.";
    } else if (scorePercentage >= 35) {
      estimatedLevel = "A2";
      levelTitle = "Elementary (A2)";
      levelDescription =
        "You can communicate in simple, routine tasks and basic sentence structures. Ready to step up to intermediate grammar.";
    }

    return {
      total: questions.length,
      correct: correctCount,
      unsure: unsureCount,
      incorrect: incorrectCount,
      percentage: scorePercentage,
      level: estimatedLevel,
      levelTitle,
      levelDescription,
      sectionStats,
    };
  }, [isCompleted, questions, selectedAnswers]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6">
        <Loader size="lg" text="Loading diagnostic placement test questions..." />
      </div>
    );
  }

  // Error State
  if (error || questions.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center text-2xl mx-auto">
          ⚠️
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-ink">
          Unable to load test questions
        </h2>
        <p className="text-sm text-ink-soft max-w-md mx-auto">
          {error || "No test questions were returned by the server."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:bg-primary-dark transition-colors"
        >
          Retry Test Loading
        </button>
      </div>
    );
  }

  // ==========================================
  // RESULTS VIEW (Once test is completed)
  // ==========================================
  if (isCompleted && results) {
    const filteredQuestions = questions.filter((q) => {
      const userSelected = selectedAnswers[q.id];
      const isUnsure = userSelected === DONT_KNOW_TEXT;
      const isCorrect =
        !isUnsure &&
        userSelected?.trim().toLowerCase() === q.answer?.trim().toLowerCase();

      if (reviewFilter === "correct") return isCorrect;
      if (reviewFilter === "incorrect") return !isCorrect && !isUnsure;
      if (reviewFilter === "unsure") return isUnsure;
      return true;
    });

    return (
      <div className="relative min-h-screen py-10 sm:py-14 px-4 sm:px-6 bg-paper dark:bg-[#070510] text-ink dark:text-white transition-colors duration-200">
        <GridBackground squareSize={64} showDots={true} />

        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10 relative z-10">
          {/* Top Celebration Banner */}
          <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-purple-600/15 via-primary/10 to-fuchsia-600/15 dark:from-[#0F0C20] dark:via-[#181236] dark:to-[#0F0C20] border border-slate-200 dark:border-white/10 shadow-xl relative overflow-hidden text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
              <span>🎉 TEST COMPLETED SUCCESSFULLY</span>
            </div>

            <h1 className="font-bangla text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              আপনার আনুমানিক Level:{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-primary to-fuchsia-600 dark:from-purple-300 dark:via-fuchsia-300 dark:to-indigo-300">
                {results.levelTitle}
              </span>
            </h1>

            <p className="font-bangla text-ink-soft dark:text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              {results.levelDescription}
            </p>

            {/* Score Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-ink-soft block">
                  Total Score
                </span>
                <span className="text-xl sm:text-2xl font-bold text-ink dark:text-white">
                  {results.correct} / {results.total}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-ink-soft block">
                  Accuracy
                </span>
                <span className="text-xl sm:text-2xl font-bold text-primary dark:text-purple-300">
                  {results.percentage}%
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-ink-soft block">
                  Unsure (Skipped)
                </span>
                <span className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {results.unsure}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-ink-soft block">
                  CEFR Rating
                </span>
                <span className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {results.level}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-xs col-span-2 sm:col-span-1">
                <span className="text-[10px] uppercase font-bold text-ink-soft block">
                  Time Taken
                </span>
                <span className="text-xl sm:text-2xl font-bold text-ink dark:text-white">
                  ⏱️ {formatTime(elapsedSeconds)}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/dashboard/chat"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-primary to-fuchsia-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-purple-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-center inline-flex items-center justify-center gap-2"
              >
                <span>Start Personalized AI Practice</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => {
                  setIsCompleted(false);
                  setCurrentIndex(0);
                  setSelectedAnswers({});
                  setFlaggedQuestions({});
                  setElapsedSeconds(0);
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/80 dark:bg-white/10 border border-slate-200 dark:border-white/15 text-ink dark:text-white font-semibold text-sm hover:bg-white dark:hover:bg-white/15 transition-all"
              >
                Retake Placement Test
              </button>
            </div>
          </div>

          {/* Section Breakdown */}
          <div className="p-6 rounded-3xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
            <h3 className="font-brand text-lg font-bold text-ink dark:text-white">
              Section Performance Breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.entries(results.sectionStats).map(([section, stats]) => {
                const secPercent =
                  stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                return (
                  <div
                    key={section}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-ink dark:text-slate-200">{section}</span>
                      <span className="font-bold text-primary dark:text-purple-300">
                        {secPercent}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-fuchsia-500 rounded-full"
                        style={{ width: `${secPercent}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-ink-soft">
                      {stats.correct} of {stats.total} correct
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Question Review Section with Filter */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-brand text-xl font-bold text-ink dark:text-white">
                  Detailed Question Review & Explanations
                </h3>
                <p className="text-xs text-ink-soft dark:text-slate-400">
                  Review every question, your selected answer, and the AI explanation.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-semibold">
                <button
                  onClick={() => setReviewFilter("all")}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    reviewFilter === "all"
                      ? "bg-white dark:bg-slate-800 text-ink dark:text-white shadow-xs"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  All ({questions.length})
                </button>
                <button
                  onClick={() => setReviewFilter("incorrect")}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    reviewFilter === "incorrect"
                      ? "bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-xs"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  Incorrect ({results.incorrect})
                </button>
                <button
                  onClick={() => setReviewFilter("unsure")}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    reviewFilter === "unsure"
                      ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  Unsure ({results.unsure})
                </button>
                <button
                  onClick={() => setReviewFilter("correct")}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    reviewFilter === "correct"
                      ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  Correct ({results.correct})
                </button>
              </div>
            </div>

            {/* List of Review Cards */}
            <div className="space-y-4">
              {filteredQuestions.map((q) => {
                const userSelected = selectedAnswers[q.id];
                const isUnsure = userSelected === DONT_KNOW_TEXT;
                const isCorrect =
                  !isUnsure &&
                  userSelected?.trim().toLowerCase() === q.answer?.trim().toLowerCase();

                let statusBadgeBg = "bg-rose-500/15 text-rose-600 dark:text-rose-400";
                let statusSymbol = "✕";
                if (isCorrect) {
                  statusBadgeBg = "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400";
                  statusSymbol = "✓";
                } else if (isUnsure) {
                  statusBadgeBg = "bg-amber-500/15 text-amber-600 dark:text-amber-400";
                  statusSymbol = "🤷";
                }

                const reviewOptions = getQuestionOptionsWithUnsure(q);

                return (
                  <div
                    key={q.id}
                    className={`p-5 sm:p-6 rounded-2xl bg-paper-card border ${
                      isCorrect
                        ? "border-emerald-500/30 dark:border-emerald-500/20"
                        : isUnsure
                        ? "border-amber-500/30 dark:border-amber-500/20"
                        : "border-rose-500/30 dark:border-rose-500/20"
                    } shadow-xs space-y-4`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${statusBadgeBg}`}
                        >
                          {statusSymbol}
                        </span>
                        <span className="text-xs font-bold text-ink-soft">
                          Question {questions.indexOf(q) + 1} of {questions.length}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary/10 text-primary dark:text-purple-300">
                          {q.sectionType}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-white/10 text-ink-soft">
                          {q.level}
                        </span>
                      </div>
                    </div>

                    {/* Question text */}
                    <p className="text-sm sm:text-base font-semibold text-ink dark:text-white">
                      {q.question}
                    </p>

                    {/* Options list showing user choice and correct answer */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {reviewOptions.map((opt) => {
                        const isOptionCorrect =
                          opt.content.trim().toLowerCase() === q.answer?.trim().toLowerCase();
                        const isOptionUserSelected =
                          opt.content.trim().toLowerCase() === userSelected?.trim().toLowerCase();
                        const isOptionDontKnow = opt.content === DONT_KNOW_TEXT;

                        let optStyle =
                          "bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 text-ink-soft";
                        if (isOptionCorrect) {
                          optStyle =
                            "bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-bold";
                        } else if (isOptionUserSelected) {
                          if (isOptionDontKnow) {
                            optStyle =
                              "bg-amber-500/10 border-amber-500/40 text-amber-700 dark:text-amber-300 font-semibold";
                          } else if (!isCorrect) {
                            optStyle =
                              "bg-rose-500/10 border-rose-500/40 text-rose-700 dark:text-rose-300 line-through font-semibold";
                          }
                        }

                        return (
                          <div
                            key={opt.id}
                            className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${optStyle}`}
                          >
                            <span>{opt.content}</span>
                            {isOptionCorrect && (
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px] shrink-0">
                                Correct Answer
                              </span>
                            )}
                            {isOptionUserSelected && !isOptionCorrect && (
                              <span
                                className={`font-bold text-[10px] shrink-0 ${
                                  isOptionDontKnow
                                    ? "text-amber-600 dark:text-amber-400"
                                    : "text-rose-600 dark:text-rose-400"
                                }`}
                              >
                                {isOptionDontKnow ? "Your Choice (Unsure)" : "Your Choice"}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation Box */}
                    {q.explanation && (
                      <div className="p-3.5 rounded-xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20 text-xs text-ink-soft dark:text-purple-200 space-y-1">
                        <span className="font-bold text-primary dark:text-purple-300 block">
                          💡 Explanation:
                        </span>
                        <p className="leading-relaxed">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ONE QUESTION PER SCREEN MCQ ENGINE
  // ==========================================
  const currentSelectedOption = selectedAnswers[currentQuestion.id];
  const isFlagged = !!flaggedQuestions[currentQuestion.id];
  const currentDisplayOptions = getQuestionOptionsWithUnsure(currentQuestion);

  return (
    <div className="relative min-h-screen bg-paper dark:bg-[#070510] text-ink dark:text-white transition-colors duration-200 flex flex-col justify-between">
      <GridBackground squareSize={64} showDots={true} />

      {/* Top Test Navigation Bar */}
      <header className="sticky top-0 z-30 bg-paper/95 dark:bg-[#070510]/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-3">
          {/* Exit Test Button */}
          <button
            type="button"
            onClick={() => setShowExitModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-ink-soft hover:text-ink hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <span>✕ Exit</span>
          </button>

          {/* Center Info: Question Counter & Timer */}
          <div className="flex items-center gap-3 sm:gap-6 font-nav">
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-ink-soft block">
                Question
              </span>
              <span className="text-xs sm:text-sm font-bold text-ink dark:text-white">
                <strong className="text-primary dark:text-purple-300 font-extrabold text-sm sm:text-base">
                  {currentIndex + 1}
                </strong>{" "}
                / {totalQuestions}
              </span>
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-white/10" />

            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-ink-soft block">
                Time Elapsed
              </span>
              <span className="text-xs sm:text-sm font-bold text-ink dark:text-white">
                ⏱️ {formatTime(elapsedSeconds)}
              </span>
            </div>
          </div>

          {/* Right Action: Bookmark / Flag & Question Drawer Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleFlag}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isFlagged
                  ? "bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400"
                  : "border-slate-200 dark:border-white/10 text-ink-soft hover:text-ink"
              }`}
              title={isFlagged ? "Flagged for review" : "Flag question for review"}
            >
              <span>{isFlagged ? "🚩" : "🏳️"}</span>
              <span className="hidden sm:inline">{isFlagged ? "Flagged" : "Flag"}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowDrawer(true)}
              className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-ink-soft hover:text-ink hover:bg-slate-100 dark:hover:bg-white/10 flex items-center gap-1.5 transition-colors"
            >
              <span>📋</span>
              <span className="hidden sm:inline">Overview ({answeredCount}/{totalQuestions})</span>
            </button>
          </div>
        </div>

        {/* Smooth Horizontal Progress Bar */}
        <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-purple-600 via-primary to-fuchsia-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Main MCQ Content Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center relative z-10">
        <div className="space-y-6 sm:space-y-8">
          {/* Question Metadata Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/15 text-primary dark:text-purple-300 border border-primary/20">
                {currentQuestion.sectionType}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-white/10 text-ink-soft border border-slate-200 dark:border-white/10">
                Level {currentQuestion.level}
              </span>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-ink-soft">
                Difficulty: {currentQuestion.difficulty}
              </span>
            </div>

            <span className="text-xs font-medium text-ink-soft">
              {totalQuestions - answeredCount > 0
                ? `${totalQuestions - answeredCount} remaining`
                : "All answered! 🎉"}
            </span>
          </div>

          {/* Reading Passage if available */}
          {currentQuestion.passage && (
            <div className="p-4 sm:p-5 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-xs text-xs sm:text-sm text-ink leading-relaxed max-h-48 overflow-y-auto">
              <span className="font-bold text-primary dark:text-purple-300 block mb-1">
                📖 Passage Context:
              </span>
              <p>{currentQuestion.passage}</p>
            </div>
          )}

          {/* Primary Question Prompt */}
          <div className="p-6 sm:p-8 rounded-3xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-md sm:shadow-lg space-y-4 relative">
            <h2 className="font-brand text-lg sm:text-xl lg:text-2xl font-bold text-ink dark:text-white leading-relaxed">
              {currentQuestion.question}
            </h2>

            {/* MCQ Options (A, B, C, D, E) */}
            <div className="grid grid-cols-1 gap-3 pt-2">
              {currentDisplayOptions.map((option, idx) => {
                const isSelected = currentSelectedOption === option.content;
                const isDontKnow = option.content === DONT_KNOW_TEXT;
                const optionLetters = ["A", "B", "C", "D", "E", "F"];
                const letter = optionLetters[idx] || String(idx + 1);

                let containerStyle =
                  "bg-paper hover:bg-slate-50 dark:hover:bg-white/[0.04] border-slate-200 dark:border-white/10 text-ink dark:text-slate-200 hover:border-primary/40";
                if (isSelected) {
                  containerStyle = isDontKnow
                    ? "bg-amber-500/10 dark:bg-amber-500/20 border-amber-500 dark:border-amber-400 ring-2 ring-amber-500/30 shadow-md"
                    : "bg-primary/10 dark:bg-purple-600/20 border-primary dark:border-purple-400 ring-2 ring-primary/30 shadow-md";
                } else if (isDontKnow) {
                  containerStyle =
                    "bg-slate-50/70 dark:bg-white/[0.02] border-slate-200/80 dark:border-white/10 text-ink-soft hover:text-ink hover:border-slate-400 dark:hover:border-white/20";
                }

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelectOption(option.content)}
                    className={`w-full p-4 sm:p-5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between gap-3 group relative cursor-pointer active:scale-[0.99] ${containerStyle}`}
                  >
                    <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
                      {/* Option Letter Tag */}
                      <span
                        className={`w-8 h-8 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? isDontKnow
                              ? "bg-amber-500 text-white shadow-xs"
                              : "bg-primary text-white shadow-xs"
                            : isDontKnow
                            ? "bg-slate-200/80 dark:bg-white/10 text-ink-soft group-hover:bg-amber-500/20 group-hover:text-amber-600 dark:group-hover:text-amber-400"
                            : "bg-slate-100 dark:bg-white/10 text-ink-soft group-hover:bg-primary/20 group-hover:text-primary"
                        }`}
                      >
                        {letter}
                      </span>

                      {/* Option text */}
                      <div className="min-w-0">
                        <span
                          className={`text-sm sm:text-base font-semibold leading-normal block ${
                            isSelected
                              ? isDontKnow
                                ? "text-amber-700 dark:text-amber-300 font-bold"
                                : "text-primary dark:text-purple-300 font-bold"
                              : "text-ink dark:text-slate-200"
                          }`}
                        >
                          {option.content}
                        </span>
                        {isDontKnow && (
                          <span className="text-[11px] text-ink-soft dark:text-slate-400 font-normal">
                            Skip if you are uncertain (will not penalize score accuracy analysis)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Radio check icon */}
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? isDontKnow
                            ? "border-amber-500 bg-amber-500 text-white"
                            : "border-primary bg-primary text-white"
                          : "border-slate-300 dark:border-white/20"
                      }`}
                    >
                      {isSelected && <span className="text-xs font-bold">✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Sticky Control Bar */}
      <footer className="sticky bottom-0 z-30 bg-paper/95 dark:bg-[#070510]/95 backdrop-blur-md border-t border-slate-200 dark:border-white/10 py-3.5 sm:py-4">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs sm:text-sm font-semibold text-ink-soft hover:text-ink hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Center Question Jumper */}
          <div className="flex items-center gap-1.5 text-xs text-ink-soft">
            <span className="hidden sm:inline">Use</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 font-mono text-[10px] border border-slate-200 dark:border-white/10">
              1-5 / A-E
            </kbd>
            <span className="hidden sm:inline">to answer</span>
          </div>

          {/* Next / Submit Button */}
          {currentIndex === totalQuestions - 1 ? (
            <button
              type="button"
              onClick={() => {
                if (currentQuestion && selectedAnswers[currentQuestion.id]) {
                  setIsCompleted(true);
                }
              }}
              disabled={!currentQuestion || !selectedAnswers[currentQuestion.id]}
              className="inline-flex items-center gap-1.5 px-6 sm:px-7 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:from-slate-300 disabled:via-slate-300 disabled:to-slate-300 dark:disabled:from-white/10 dark:disabled:via-white/10 dark:disabled:to-white/10 disabled:text-ink-soft/50 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/25 active:scale-95 transition-all"
              title={!selectedAnswers[currentQuestion?.id] ? "Please select an answer to finish" : "Submit Diagnostic Test"}
            >
              <span>Submit Diagnostic Test</span>
              <span>✓</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              disabled={!currentQuestion || !selectedAnswers[currentQuestion.id]}
              className="inline-flex items-center gap-1.5 px-6 sm:px-7 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-primary to-fuchsia-600 hover:from-purple-500 hover:via-primary-dark hover:to-fuchsia-500 disabled:from-slate-300 disabled:via-slate-300 disabled:to-slate-300 dark:disabled:from-white/10 dark:disabled:via-white/10 dark:disabled:to-white/10 disabled:text-ink-soft/50 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100 text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-500/25 active:scale-95 transition-all"
              title={!selectedAnswers[currentQuestion?.id] ? "Please select an answer to continue" : "Next Question"}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </footer>

      {/* Question Overview Grid Drawer (Sidebar/Modal) */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-paper-card border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl space-y-4 animate-scaleUp max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-brand text-lg font-bold text-ink dark:text-white">
                  Question Overview
                </h3>
                <p className="text-xs text-ink-soft">
                  Answered: {answeredCount} / {totalQuestions}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDrawer(false)}
                className="p-2 text-ink-soft hover:text-ink text-sm rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-ink-soft pt-1 border-t border-slate-200/60 dark:border-white/10">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-primary text-white" /> Current
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500 text-emerald-600" /> Answered
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500 text-amber-600" /> Flagged
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-slate-100 dark:bg-white/10 border" /> Unanswered
              </span>
            </div>

            {/* Number buttons grid */}
            <div className="grid grid-cols-5 sm:grid-cols-8 gap-2 overflow-y-auto p-1 flex-1">
              {questions.map((q, idx) => {
                const isAns = !!selectedAnswers[q.id];
                const isCurr = idx === currentIndex;
                const isFlag = !!flaggedQuestions[q.id];

                let btnClass = "bg-slate-100 dark:bg-white/5 text-ink-soft border-slate-200 dark:border-white/10";
                if (isCurr) {
                  btnClass = "bg-primary text-white border-primary shadow-xs font-bold";
                } else if (isFlag) {
                  btnClass = "bg-amber-500/20 border-amber-500/40 text-amber-600 dark:text-amber-400 font-bold";
                } else if (isAns) {
                  btnClass = "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold";
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowDrawer(false);
                    }}
                    className={`h-9 rounded-xl border text-xs flex items-center justify-center transition-all hover:scale-105 ${btnClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-200/60 dark:border-white/10 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowDrawer(false);
                  setIsCompleted(true);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold text-xs shadow-md inline-flex items-center justify-center gap-1.5"
              >
                <span>Finish & View Results</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Confirmation Dialog */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-paper-card border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <span className="text-3xl">🚪</span>
            <h3 className="font-brand text-lg font-bold text-ink dark:text-white">
              Exit Placement Test?
            </h3>
            <p className="text-xs text-ink-soft leading-relaxed">
              Are you sure you want to leave? Your placement results won&apos;t be finalized until you submit all questions.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowExitModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-ink hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                Keep Testing
              </button>
              <button
                type="button"
                onClick={() => router.push("/level-test")}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-sm"
              >
                Yes, Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GeneralEnglishTestView;
