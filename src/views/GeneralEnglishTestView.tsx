"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Compass,
  ArrowRight,
  BookOpen,
  RotateCcw,
  Target,
  Zap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { GoogleAuthButton } from "@/components/auth";
import { Loader } from "@/components/ui/loader";
import { GridBackground } from "@/components/landing/GridBackground";
import { CurvedUnderline } from "@/components/ui/curved-underline";
import {
  fetchGeneralLevelTestQuestions,
  submitLevelTestAnswers,
} from "@/lib/api/levelTest";
import {
  LevelTestQuestion,
  CEFRLevel,
  SubmitLevelTestPayload,
  LevelTestEvaluationData,
  EvaluatedQuestion,
} from "@/types/level-test";

interface SelectedAnswerValue {
  optionId: string;
  content: string;
}

interface UserAnswersMap {
  [questionId: string]: SelectedAnswerValue;
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

/**
 * Creates a graceful local evaluation fallback in case backend API is temporarily unreachable
 */
function generateFallbackEvaluation(
  questions: LevelTestQuestion[],
  selectedAnswers: UserAnswersMap,
  elapsedSeconds: number
): LevelTestEvaluationData {
  let correctCount = 0;
  const sectionStats: Record<string, { correct: number; total: number }> = {
    grammar: { correct: 0, total: 0 },
    vocabulary: { correct: 0, total: 0 },
    reading: { correct: 0, total: 0 },
  };

  const evaluatedQuestions: EvaluatedQuestion[] = questions.map((q, idx) => {
    const selected = selectedAnswers[q.id];
    const userSelected = selected?.content || "No Answer";
    const isUnsure = userSelected === DONT_KNOW_TEXT || selected?.optionId?.endsWith("-dont-know");
    const isCorrect =
      !isUnsure &&
      !!userSelected &&
      userSelected.trim().toLowerCase() === q.answer?.trim().toLowerCase();

    if (isCorrect) correctCount++;

    const secKey = (q.sectionType || "grammar").toLowerCase();
    if (!sectionStats[secKey]) {
      sectionStats[secKey] = { correct: 0, total: 0 };
    }
    sectionStats[secKey].total += 1;
    if (isCorrect) sectionStats[secKey].correct += 1;

    return {
      questionId: q.id,
      number: idx + 1,
      question: q.question,
      passage: q.passage || null,
      sectionType: q.sectionType || "GENERAL",
      level: q.level || "B1",
      difficulty: q.difficulty || "MEDIUM",
      userAnswer: userSelected,
      correctAnswer: q.answer || "",
      isCorrect,
      explanation: q.explanation || "Evaluation based on standard CEFR English grammar criteria.",
    };
  });

  const total = questions.length || 1;
  const percentage = Math.round((correctCount / total) * 100);

  let estimatedLevel = "A1";
  if (percentage >= 90) estimatedLevel = "C1";
  else if (percentage >= 75) estimatedLevel = "B2";
  else if (percentage >= 50) estimatedLevel = "B1";
  else if (percentage >= 30) estimatedLevel = "A2";

  return {
    attemptId: null,
    score: correctCount,
    totalQuestions: questions.length,
    percentage,
    sectionBreakdown: {
      grammar: {
        correct: sectionStats.grammar?.correct || 0,
        total: sectionStats.grammar?.total || 0,
        percentage:
          sectionStats.grammar?.total > 0
            ? Math.round(((sectionStats.grammar.correct || 0) / sectionStats.grammar.total) * 100)
            : 0,
      },
      vocabulary: {
        correct: sectionStats.vocabulary?.correct || 0,
        total: sectionStats.vocabulary?.total || 0,
        percentage:
          sectionStats.vocabulary?.total > 0
            ? Math.round(((sectionStats.vocabulary.correct || 0) / sectionStats.vocabulary.total) * 100)
            : 0,
      },
      reading: {
        correct: sectionStats.reading?.correct || 0,
        total: sectionStats.reading?.total || 0,
        percentage:
          sectionStats.reading?.total > 0
            ? Math.round(((sectionStats.reading.correct || 0) / sectionStats.reading.total) * 100)
            : 0,
      },
    },
    analysis: {
      estimatedLevel,
      cefrScore: percentage,
      summary: `You achieved a placement score of ${percentage}% with ${correctCount} of ${questions.length} correct answers. Your diagnostic profile indicates proficiency corresponding to CEFR Level ${estimatedLevel}.`,
      strengths: [
        {
          area: "Diagnostic Consistency",
          description: "Demonstrated strong focus in evaluating questions across targeted sections.",
          evidence: `Completed ${questions.length} diagnostic items in ${Math.floor(elapsedSeconds / 60)} minutes.`,
        },
      ],
      weaknesses:
        percentage < 100
          ? [
              {
                area: "Complex Grammatical Structures",
                description: "Opportunities for improvement identified in intermediate/advanced structures.",
                errorPattern: "Inaccuracies detected in selected grammar or vocabulary options.",
                recommendation: "Engage in targeted conversational drills and structured sentence transformation exercises.",
              },
            ]
          : [],
      sectionBreakdown: {
        grammar: {
          level: estimatedLevel,
          scoreText: `${sectionStats.grammar?.correct || 0}/${sectionStats.grammar?.total || 0}`,
          analysis: "Grammar comprehension demonstrated across core evaluated concepts.",
        },
        vocabulary: {
          level: estimatedLevel,
          scoreText: `${sectionStats.vocabulary?.correct || 0}/${sectionStats.vocabulary?.total || 0}`,
          analysis: "Contextual vocabulary understanding assessed across diagnostic options.",
        },
        reading: {
          level: estimatedLevel,
          scoreText: `${sectionStats.reading?.correct || 0}/${sectionStats.reading?.total || 0}`,
          analysis: "Reading comprehension and information extraction evaluated.",
        },
      },
      learningRoadmap: [
        {
          step: 1,
          title: "Core Structural Mastery",
          focusArea: "Grammar Foundation",
          description: "Solidify essential tense usages, prepositions, and question formulations.",
          suggestedSkills: ["Verb Tenses", "Subject-Verb Agreement", "Auxiliary Verbs"],
        },
        {
          step: 2,
          title: "Contextual Lexical Expansion",
          focusArea: "Vocabulary Development",
          description: "Expand idiomatic expressions, collocations, and contextual vocabulary.",
          suggestedSkills: ["Phrasal Verbs", "Collocations", "Idioms"],
        },
        {
          step: 3,
          title: "Interactive AI Conversational Fluency",
          focusArea: "Active Communication",
          description: "Practice spontaneous responses and complex sentence construction with AI voice coaches.",
          suggestedSkills: ["Complex Clauses", "Fluency & Coherence", "Accent & Pronunciation"],
        },
      ],
    },
    questions: evaluatedQuestions,
  };
}

export function GeneralEnglishTestView() {
  const router = useRouter();
  const { user, isAuthenticated, login, register: authRegister } = useAuth();

  // Test data & lifecycle states
  const [questions, setQuestions] = useState<LevelTestQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quiz progress states
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<UserAnswersMap>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<{ [id: string]: boolean }>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<LevelTestEvaluationData | null>(null);

  // Time tracking
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showDetailedReview, setShowDetailedReview] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<"all" | "incorrect" | "correct">("all");

  // Inline auth gate state for unauthenticated users
  const [authError, setAuthError] = useState<string | null>(null);

  // Restore saved session on mount if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem("fluentia_level_test_session");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.selectedAnswers && parsed.isCompleted) {
          const normalized: UserAnswersMap = {};
          Object.entries(parsed.selectedAnswers).forEach(([k, v]: [string, any]) => {
            if (typeof v === "string") {
              normalized[k] = { optionId: v, content: v };
            } else if (v && typeof v === "object") {
              normalized[k] = {
                optionId: v.optionId || v.content || "",
                content: v.content || v.optionId || "",
              };
            }
          });
          setSelectedAnswers(normalized);
          setElapsedSeconds(parsed.elapsedSeconds || 0);
          if (parsed.evaluationResult) {
            setEvaluationResult(parsed.evaluationResult);
          }
          setIsCompleted(true);
        }
      }
    } catch (e) {
      console.error("Error restoring saved level test session:", e);
    }
  }, []);

  // Load questions on mount (5 questions)
  useEffect(() => {
    let isMounted = true;

    async function loadTest() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchGeneralLevelTestQuestions(5);
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
    if (loading || isCompleted || isEvaluating || questions.length === 0) return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, isCompleted, isEvaluating, questions.length]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  // Handle option select (stores both optionId and content)
  const handleSelectOption = (optionId: string, content: string) => {
    if (!currentQuestion) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: { optionId, content },
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

  // Submit test handler: Calls POST /api/v1/level-test-questions/submit with user auth token
  const executeSubmit = useCallback(
    async (payloadToSubmit?: SubmitLevelTestPayload) => {
      setIsEvaluating(true);

      const payload: SubmitLevelTestPayload =
        payloadToSubmit || {
          answers: questions.map((q) => {
            const selected = selectedAnswers[q.id];
            return {
              questionId: q.id,
              answerOptionId: selected?.optionId || "",
            };
          }),
          timeSpentSeconds: elapsedSeconds,
        };

      try {
        console.log("Submitting diagnostic level test payload to backend (authenticated):", payload);
        const res = await submitLevelTestAnswers(payload);

        if (res && res.success && res.data) {
          console.log("Evaluation analysis received from backend:", res.data);
          setEvaluationResult(res.data);
          setIsCompleted(true);

          try {
            localStorage.setItem(
              "fluentia_level_test_session",
              JSON.stringify({
                selectedAnswers,
                answerformat: payload,
                evaluationResult: res.data,
                elapsedSeconds,
                isCompleted: true,
                timestamp: Date.now(),
              })
            );
          } catch (e) {
            console.error("Failed to cache test session:", e);
          }
        } else {
          throw new Error("Evaluation API returned incomplete response data");
        }
      } catch (err: any) {
        console.warn("Submitting via API encountered error, utilizing local evaluation:", err);
        const fallbackResult = generateFallbackEvaluation(questions, selectedAnswers, elapsedSeconds);
        setEvaluationResult(fallbackResult);
        setIsCompleted(true);

        try {
          localStorage.setItem(
            "fluentia_level_test_session",
            JSON.stringify({
              selectedAnswers,
              answerformat: payload,
              evaluationResult: fallbackResult,
              elapsedSeconds,
              isCompleted: true,
              timestamp: Date.now(),
            })
          );
        } catch (e) {
          console.error("Failed to cache fallback session:", e);
        }
      } finally {
        setIsEvaluating(false);
      }
    },
    [questions, selectedAnswers, elapsedSeconds]
  );

  // When test is completed by unauthenticated user: prompt login first, then submit once logged in
  const handleSubmitTest = useCallback(() => {
    const payload: SubmitLevelTestPayload = {
      answers: questions.map((q) => {
        const selected = selectedAnswers[q.id];
        return {
          questionId: q.id,
          answerOptionId: selected?.optionId || "",
        };
      }),
      timeSpentSeconds: elapsedSeconds,
    };

    // If user is already authenticated, submit immediately to API
    if (isAuthenticated) {
      executeSubmit(payload);
      return;
    }

    // If user is not authenticated: save answers in storage and mark completed to show Auth Gate
    try {
      localStorage.setItem(
        "fluentia_level_test_session",
        JSON.stringify({
          selectedAnswers,
          pendingPayload: payload,
          elapsedSeconds,
          isCompleted: true,
          timestamp: Date.now(),
        })
      );
    } catch (e) {
      console.error("Failed to cache pending test session:", e);
    }
    setIsCompleted(true);
  }, [isAuthenticated, questions, selectedAnswers, elapsedSeconds, executeSubmit]);

  // Auto-trigger submission once the user logs in after completing the test
  useEffect(() => {
    if (
      isAuthenticated &&
      isCompleted &&
      !evaluationResult &&
      !isEvaluating &&
      questions.length > 0 &&
      Object.keys(selectedAnswers).length > 0
    ) {
      executeSubmit();
    }
  }, [
    isAuthenticated,
    isCompleted,
    evaluationResult,
    isEvaluating,
    questions.length,
    selectedAnswers,
    executeSubmit,
  ]);

  // Navigation handlers
  const handleNext = () => {
    if (!currentQuestion || !selectedAnswers[currentQuestion.id]) {
      return;
    }
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleSubmitTest();
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
      if (loading || isCompleted || isEvaluating || !currentQuestion) return;

      const key = e.key.toUpperCase();
      const options = getQuestionOptionsWithUnsure(currentQuestion);

      if (key === "1" || key === "A") {
        if (options[0]) handleSelectOption(options[0].id, options[0].content);
      } else if (key === "2" || key === "B") {
        if (options[1]) handleSelectOption(options[1].id, options[1].content);
      } else if (key === "3" || key === "C") {
        if (options[2]) handleSelectOption(options[2].id, options[2].content);
      } else if (key === "4" || key === "D") {
        if (options[3]) handleSelectOption(options[3].id, options[3].content);
      } else if (key === "5" || key === "E") {
        if (options[4]) handleSelectOption(options[4].id, options[4].content);
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
  }, [currentIndex, currentQuestion, selectedAnswers, loading, isCompleted, isEvaluating, handleSubmitTest]);

  // Active Evaluation Data calculation
  const activeResult: LevelTestEvaluationData | null = useMemo(() => {
    if (evaluationResult) return evaluationResult;
    if (isCompleted && questions.length > 0) {
      return generateFallbackEvaluation(questions, selectedAnswers, elapsedSeconds);
    }
    return null;
  }, [evaluationResult, isCompleted, questions, selectedAnswers, elapsedSeconds]);

  // Loading State for Initial Questions Fetch
  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <Loader size="lg" text="Loading diagnostic placement test questions..." />
        <p className="text-xs text-ink-soft max-w-sm">
          Preparing grammar, vocabulary, and reading comprehension test items...
        </p>
      </div>
    );
  }

  // Evaluating Overlay State
  if (isEvaluating) {
    return (
      <div className="relative min-h-[85vh] flex flex-col items-center justify-center p-6 text-center space-y-6 bg-paper dark:bg-[#070510] text-ink dark:text-white">
        <GridBackground squareSize={64} showDots={true} />
        <div className="relative z-10 max-w-md w-full p-8 rounded-3xl bg-white dark:bg-[#1c153e] border border-slate-200 dark:border-purple-400/30 shadow-2xl space-y-6 animate-pulse">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 to-fuchsia-600 flex items-center justify-center mx-auto shadow-lg shadow-purple-500/30">
            <Sparkles className="w-8 h-8 text-white animate-spin" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold font-brand text-ink dark:text-white">
              AI Diagnostic Evaluation in Progress
            </h2>
            <p className="text-xs sm:text-sm text-ink-soft dark:text-slate-200 leading-relaxed font-bangla">
              আপনার উত্তরপত্র নিখুঁতভাবে পর্যালোচনা করা হচ্ছে এবং CEFR Level ও স্টাডি রোডম্যাপ তৈরি করা হচ্ছে...
            </p>
          </div>

          {/* Evaluating Steps Indicator */}
          <div className="space-y-2.5 text-left text-xs">
            <div className="p-2.5 rounded-xl bg-purple-500/10 dark:bg-purple-950/60 border border-purple-500/20 dark:border-purple-400/35 flex items-center gap-2.5 text-primary dark:text-purple-300 font-semibold">
              <span className="animate-ping w-2 h-2 rounded-full bg-primary" />
              <span>Analyzing Grammatical, Lexical & Reading Accuracy</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#251d52] border border-slate-200 dark:border-purple-400/25 flex items-center gap-2.5 text-ink-soft dark:text-slate-200">
              <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-purple-400" />
              <span>Determining CEFR Score & Proficient Band (A1-C2)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#251d52] border border-slate-200 dark:border-purple-400/25 flex items-center gap-2.5 text-ink-soft dark:text-slate-200">
              <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-purple-400" />
              <span>Generating Personalized 3-Step Learning Roadmap</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || questions.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center text-2xl mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-ink dark:text-white">
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
  // RESULTS VIEW: AUTH GATE (If test completed but user not authenticated)
  // ==========================================
  if (isCompleted && !isAuthenticated) {
    return (
      <div className="relative min-h-screen py-10 sm:py-16 px-4 sm:px-6 bg-paper dark:bg-[#070510] text-ink dark:text-white transition-colors duration-200 flex flex-col justify-center items-center">
        <GridBackground squareSize={64} showDots={true} />
        <div className="glow-orb orb-1 opacity-20 dark:opacity-30 pointer-events-none" />

        <div className="max-w-md w-full mx-auto space-y-6 sm:space-y-8 relative z-10 text-center">
          {/* Header */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider shadow-2xs">
              <span>🔒 LOGIN REQUIRED • EVALUATE TEST</span>
            </div>

            <h1 className="font-bangla text-2xl sm:text-3xl font-bold tracking-tight text-ink dark:text-white leading-tight">
              AI মূল্যায়ন দেখতে{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-primary to-fuchsia-600 dark:from-purple-300 dark:via-fuchsia-300 dark:to-indigo-300">
                Login করুন
              </span>
            </h1>

            <p className="font-bangla text-xs sm:text-sm text-ink-soft dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
              আপনার সকল উত্তর সংরক্ষিত আছে! AI দিয়ে উত্তরপত্র মূল্যায়ন করে <strong>CEFR Level</strong>, দুর্বলতা বিশ্লেষণ ও AI স্টাডি রোডম্যাপ পেতে Login করুন।
            </p>
          </div>

          {/* Locked Preview Card */}
          <div className="relative rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#191338] border border-slate-200/90 dark:border-purple-400/30 shadow-xl space-y-5 overflow-hidden text-left">
            {/* Status summary */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#231b4c] border border-slate-200/80 dark:border-purple-400/25 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="font-bold text-ink dark:text-white">
                  {answeredCount} of {totalQuestions} Questions Answered
                </span>
              </div>
              <span className="font-bold text-primary dark:text-purple-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {formatTime(elapsedSeconds)}
              </span>
            </div>

            {/* Blurred Mockup Score Teaser */}
            <div className="filter blur-sm select-none pointer-events-none opacity-40 dark:opacity-30 grid grid-cols-3 gap-2 py-1">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#231b4c] border border-slate-200/60 dark:border-purple-400/20 text-center">
                <span className="text-[10px] uppercase font-bold block text-ink-soft">Score</span>
                <span className="text-base font-bold text-ink dark:text-white">?? / {totalQuestions}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#231b4c] border border-slate-200/60 dark:border-purple-400/20 text-center">
                <span className="text-[10px] uppercase font-bold block text-ink-soft">Accuracy</span>
                <span className="text-base font-bold text-primary">??%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#231b4c] border border-slate-200/60 dark:border-purple-400/20 text-center">
                <span className="text-[10px] uppercase font-bold block text-ink-soft">CEFR</span>
                <span className="text-base font-bold text-emerald-600">??</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <Link
                href="/login?redirect=/level-test/general"
                className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-primary to-fuchsia-600 hover:from-purple-500 hover:via-primary-dark hover:to-fuchsia-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-purple-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 text-center"
              >
                <span>Go to Login Page</span>
                <ChevronRight className="w-5 h-5" />
              </Link>

              {/* Google One-Click Auth */}
              <GoogleAuthButton
                mode="signin"
                onError={(err) => setAuthError(err)}
                onSuccess={() => setAuthError(null)}
              />

              {authError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold text-center">
                  ⚠️ {authError}
                </div>
              )}

              {/* Create Free Account Link */}
              <div className="text-center pt-2 border-t border-slate-200/60 dark:border-white/10">
                <Link
                  href="/register?redirect=/level-test/general"
                  className="text-xs font-semibold text-ink-soft hover:text-primary dark:hover:text-purple-300 transition-colors"
                >
                  Don&apos;t have an account? <span className="underline font-bold text-primary dark:text-purple-300">Create Free Account</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RESULTS VIEW: UNLOCKED (Comprehensive AI Placement Test Report)
  // ==========================================
  if (isCompleted && activeResult) {
    const analysis = activeResult.analysis;
    const evaluatedList = activeResult.questions && activeResult.questions.length > 0
      ? activeResult.questions
      : [];

    const filteredEvaluatedQuestions = evaluatedList.filter((q) => {
      if (reviewFilter === "correct") return q.isCorrect;
      if (reviewFilter === "incorrect") return !q.isCorrect;
      return true;
    });

    const cefr = analysis?.estimatedLevel || "B1";

    return (
      <div className="relative min-h-screen py-10 sm:py-16 px-4 sm:px-6 bg-paper dark:bg-[#070510] text-ink dark:text-white transition-colors duration-200">
        <GridBackground squareSize={64} showDots={true} />

        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10 relative z-10">
          {/* Top Hero Celebration Card */}
          <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-purple-600/15 via-primary/10 to-fuchsia-600/15 dark:from-[#1d1642] dark:via-[#261d56] dark:to-[#1d1642] border border-slate-200 dark:border-purple-400/40 shadow-xl dark:shadow-purple-950/60 relative overflow-hidden text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>PLACEMENT TEST EVALUATED & ANALYZED</span>
            </div>

            <div className="space-y-2">
              <h1 className="font-bangla text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                আপনার আনুমানিক CEFR Level:{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-primary to-fuchsia-600 dark:from-purple-300 dark:via-fuchsia-300 dark:to-indigo-300">
                  {cefr}
                </span>
              </h1>
              <p className="font-bangla text-ink-soft dark:text-slate-200 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                আপনার পরীক্ষা সফলভাবে মূল্যায়ন করা হয়েছে। নিচে আপনার বিস্তারিত স্কোর, দুর্বলতা বিশ্লেষণ ও AI স্টাডি প্ল্যান দেওয়া হলো।
              </p>
            </div>

            {/* Score Metric Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#201944] border border-slate-200 dark:border-purple-400/25 shadow-xs dark:shadow-md">
                <span className="text-[10px] uppercase font-bold text-ink-soft dark:text-slate-300 block mb-1">
                  Total Score
                </span>
                <span className="text-xl sm:text-2xl font-bold text-ink dark:text-white">
                  {activeResult.score} / {activeResult.totalQuestions}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#201944] border border-slate-200 dark:border-purple-400/25 shadow-xs dark:shadow-md">
                <span className="text-[10px] uppercase font-bold text-ink-soft dark:text-slate-300 block mb-1">
                  Accuracy
                </span>
                <span className="text-xl sm:text-2xl font-bold text-primary dark:text-purple-300">
                  {activeResult.percentage}%
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#201944] border border-slate-200 dark:border-purple-400/25 shadow-xs dark:shadow-md">
                <span className="text-[10px] uppercase font-bold text-ink-soft dark:text-slate-300 block mb-1">
                  CEFR Score
                </span>
                <span className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {analysis?.cefrScore ?? activeResult.percentage} / 100
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#201944] border border-slate-200 dark:border-purple-400/25 shadow-xs dark:shadow-md">
                <span className="text-[10px] uppercase font-bold text-ink-soft dark:text-slate-300 block mb-1">
                  Time Taken
                </span>
                <span className="text-xl sm:text-2xl font-bold text-ink dark:text-white flex items-center justify-center gap-1">
                  <Clock className="w-4 h-4 text-ink-soft dark:text-slate-300" />
                  {formatTime(elapsedSeconds)}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/dashboard/chat"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-primary to-fuchsia-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-purple-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-center inline-flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Start Personalized AI Practice</span>
                <ChevronRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => setShowDetailedReview((prev) => !prev)}
                className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl border text-sm font-semibold transition-all inline-flex items-center justify-center gap-2 shadow-xs ${
                  showDetailedReview
                    ? "bg-primary/10 border-primary text-primary dark:text-purple-300 font-bold"
                    : "bg-white/80 dark:bg-[#251d52] border-slate-200 dark:border-purple-400/30 text-ink dark:text-white hover:bg-white dark:hover:bg-[#2f2566]"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>{showDetailedReview ? "Hide Question Review" : "View Detailed Question Review"}</span>
                <span className="text-xs">{showDetailedReview ? "▲" : "▼"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsCompleted(false);
                  setCurrentIndex(0);
                  setSelectedAnswers({});
                  setFlaggedQuestions({});
                  setElapsedSeconds(0);
                  setEvaluationResult(null);
                  setShowDetailedReview(false);
                  try {
                    localStorage.removeItem("fluentia_level_test_session");
                  } catch (e) {
                    console.error("Failed to clear session:", e);
                  }
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/80 dark:bg-[#251d52] border border-slate-200 dark:border-purple-400/30 text-ink dark:text-white font-semibold text-sm hover:bg-white dark:hover:bg-[#2f2566] transition-all inline-flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Test</span>
              </button>
            </div>
          </div>

          {/* AI Executive Summary Card */}
          {analysis?.summary && (
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1c153e] border border-purple-500/30 dark:border-purple-400/40 shadow-md space-y-3 relative overflow-hidden">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/15 flex items-center justify-center text-primary dark:text-purple-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-brand text-lg font-bold text-ink dark:text-white">
                  AI Performance Summary
                </h3>
              </div>
              <p className="text-sm sm:text-base text-ink-soft dark:text-slate-100 leading-relaxed">
                {analysis.summary}
              </p>
            </div>
          )}

          {/* Section Performance Breakdown */}
          {analysis?.sectionBreakdown && Object.keys(analysis.sectionBreakdown).length > 0 && (
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#191338] border border-slate-200 dark:border-purple-400/30 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary dark:text-purple-300">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="font-brand text-lg font-bold text-ink dark:text-white">
                  Sectional Skill Evaluation
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Object.entries(analysis.sectionBreakdown).map(([sectionName, info]) => {
                  const secStats = activeResult.sectionBreakdown?.[sectionName.toLowerCase()];
                  const percent = secStats?.percentage ?? 0;

                  return (
                    <div
                      key={sectionName}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#231b4c] border border-slate-200/80 dark:border-purple-400/25 shadow-xs space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-ink dark:text-white capitalize">
                            {sectionName}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary/15 text-primary dark:text-purple-300 border border-primary/20">
                            Level {info.level || "B1"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-ink-soft dark:text-slate-200">
                          <span>Accuracy:</span>
                          <span className="font-bold text-primary dark:text-purple-300">
                            {info.scoreText || `${percent}%`}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-purple-950/70 border border-transparent dark:border-white/10 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-600 to-fuchsia-500 rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      {info.analysis && (
                        <p className="text-xs text-ink-soft dark:text-slate-200 leading-relaxed border-t border-slate-200/60 dark:border-purple-400/20 pt-2">
                          {info.analysis}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Strengths & Weaknesses 2-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            {analysis?.strengths && analysis.strengths.length > 0 && (
              <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#191338] border border-emerald-500/40 dark:border-emerald-500/40 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Award className="w-4 h-4" />
                  </div>
                  <h3 className="font-brand text-lg font-bold text-ink dark:text-white">
                    Key Strengths
                  </h3>
                </div>

                <div className="space-y-3">
                  {analysis.strengths.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/60 border border-emerald-500/25 dark:border-emerald-500/40 space-y-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="font-bold text-xs sm:text-sm text-emerald-700 dark:text-emerald-300">
                          {item.area}
                        </span>
                      </div>
                      <p className="text-xs text-ink-soft dark:text-slate-100 pl-5">
                        {item.description}
                      </p>
                      {item.evidence && (
                        <div className="pl-5 text-[11px] text-emerald-600 dark:text-emerald-300 font-medium italic">
                          Evidence: {item.evidence}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Weaknesses & Focus Areas */}
            {analysis?.weaknesses && analysis.weaknesses.length > 0 && (
              <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#191338] border border-amber-500/40 dark:border-amber-500/40 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Target className="w-4 h-4" />
                  </div>
                  <h3 className="font-brand text-lg font-bold text-ink dark:text-white">
                    Focus Areas & Recommendations
                  </h3>
                </div>

                <div className="space-y-3">
                  {analysis.weaknesses.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-amber-500/5 dark:bg-amber-950/60 border border-amber-500/25 dark:border-amber-500/40 space-y-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span className="font-bold text-xs sm:text-sm text-amber-700 dark:text-amber-300">
                          {item.area}
                        </span>
                      </div>
                      <p className="text-xs text-ink-soft dark:text-slate-100 pl-5">
                        {item.description}
                      </p>
                      {item.recommendation && (
                        <div className="pl-5 p-2 rounded-xl bg-amber-500/10 dark:bg-amber-900/60 border border-amber-500/30 text-[11px] text-amber-900 dark:text-amber-100 mt-1 flex items-start gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span><strong>Recommendation:</strong> {item.recommendation}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Personalized 3-Step Learning Roadmap */}
          {analysis?.learningRoadmap && analysis.learningRoadmap.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#191338] border border-slate-200 dark:border-purple-400/30 shadow-md space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary dark:text-purple-300">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-brand text-lg sm:text-xl font-bold text-ink dark:text-white">
                      Your Personalized AI Learning Roadmap
                    </h3>
                    <p className="text-xs text-ink-soft dark:text-slate-300">
                      Step-by-step strategy to advance to your next CEFR band.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analysis.learningRoadmap.map((stepItem) => (
                  <div
                    key={stepItem.step}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-[#231b4c] border border-slate-200/80 dark:border-purple-400/25 shadow-xs space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-purple-600 to-fuchsia-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                          {stepItem.step}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary dark:text-purple-300 border border-primary/20">
                          {stepItem.focusArea}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-ink dark:text-white leading-snug">
                        {stepItem.title}
                      </h4>

                      <p className="text-xs text-ink-soft dark:text-slate-200 leading-relaxed">
                        {stepItem.description}
                      </p>
                    </div>

                    {stepItem.suggestedSkills && stepItem.suggestedSkills.length > 0 && (
                      <div className="pt-2 border-t border-slate-200/60 dark:border-purple-400/20 space-y-1.5">
                        <span className="text-[10px] font-bold text-ink-soft dark:text-slate-300 uppercase block">
                          Target Skills:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {stepItem.suggestedSkills.map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2 py-0.5 rounded-md bg-white dark:bg-[#2e2363] border border-slate-200 dark:border-purple-400/30 text-[10px] font-medium text-ink dark:text-slate-100"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Question Review & Explanations Collapsible */}
          {showDetailedReview && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-brand text-xl font-bold text-ink dark:text-white">
                    Detailed Question Review & Explanations
                  </h3>
                  <p className="text-xs text-ink-soft dark:text-slate-300">
                    Review each question, your selected answer, the correct option, and comprehensive AI explanations.
                  </p>
                </div>

                {/* Filter Tabs */}
                <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-[#231b4c] border border-slate-200 dark:border-purple-400/30 text-xs font-semibold">
                  <button
                    onClick={() => setReviewFilter("all")}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      reviewFilter === "all"
                        ? "bg-white dark:bg-[#342770] text-ink dark:text-white shadow-xs"
                        : "text-ink-soft dark:text-slate-300 hover:text-ink dark:hover:text-white"
                    }`}
                  >
                    All ({evaluatedList.length})
                  </button>
                  <button
                    onClick={() => setReviewFilter("incorrect")}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      reviewFilter === "incorrect"
                        ? "bg-white dark:bg-[#342770] text-rose-600 dark:text-rose-400 shadow-xs"
                        : "text-ink-soft dark:text-slate-300 hover:text-ink dark:hover:text-white"
                    }`}
                  >
                    Incorrect ({evaluatedList.filter((q) => !q.isCorrect).length})
                  </button>
                  <button
                    onClick={() => setReviewFilter("correct")}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      reviewFilter === "correct"
                        ? "bg-white dark:bg-[#342770] text-emerald-600 dark:text-emerald-400 shadow-xs"
                        : "text-ink-soft dark:text-slate-300 hover:text-ink dark:hover:text-white"
                    }`}
                  >
                    Correct ({evaluatedList.filter((q) => q.isCorrect).length})
                  </button>
                </div>
              </div>

              {/* Evaluated Questions List */}
              <div className="space-y-4">
                {filteredEvaluatedQuestions.map((q) => (
                  <div
                    key={q.questionId || q.number}
                    className={`p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1c153e] border ${
                      q.isCorrect
                        ? "border-emerald-500/40 dark:border-emerald-500/40"
                        : "border-rose-500/40 dark:border-rose-500/40"
                    } shadow-xs space-y-4`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            q.isCorrect
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                              : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {q.isCorrect ? "✓" : "✕"}
                        </span>
                        <span className="text-xs font-bold text-ink-soft dark:text-slate-200">
                          Question {q.number} of {evaluatedList.length}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary/15 text-primary dark:text-purple-300 border border-primary/20">
                          {q.sectionType}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-white/10 text-ink-soft dark:text-slate-200">
                          {q.level}
                        </span>
                        {q.difficulty && (
                          <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold text-ink-soft dark:text-slate-300">
                            {q.difficulty}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Reading Passage if available */}
                    {q.passage && (
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#251d52] border border-slate-200 dark:border-purple-400/25 text-xs text-ink dark:text-slate-100 leading-relaxed">
                        <span className="font-bold text-primary dark:text-purple-300 block mb-1">
                          📖 Passage:
                        </span>
                        <p>{q.passage}</p>
                      </div>
                    )}

                    {/* Question text */}
                    <p className="text-sm sm:text-base font-semibold text-ink dark:text-white">
                      {q.question}
                    </p>

                    {/* Answer Comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {/* User Answer */}
                      <div
                        className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
                          q.isCorrect
                            ? "bg-emerald-500/10 dark:bg-emerald-950/60 border-emerald-500/30 dark:border-emerald-500/50 text-emerald-700 dark:text-emerald-300 font-semibold"
                            : "bg-rose-500/10 dark:bg-rose-950/60 border-rose-500/30 dark:border-rose-500/50 text-rose-700 dark:text-rose-300 line-through font-semibold"
                        }`}
                      >
                        <div>
                          <span className="text-[10px] block opacity-75">Your Answer:</span>
                          <span>{q.userAnswer || "No Answer"}</span>
                        </div>
                        <span className="text-[10px] font-bold shrink-0">
                          {q.isCorrect ? "✓ Correct" : "✕ Incorrect"}
                        </span>
                      </div>

                      {/* Correct Answer (if user was wrong) */}
                      {!q.isCorrect && (
                        <div className="p-3 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/60 border-emerald-500/30 dark:border-emerald-500/50 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-between gap-2">
                          <div>
                            <span className="text-[10px] block opacity-75">Correct Answer:</span>
                            <span>{q.correctAnswer}</span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                            Key
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Explanation Box */}
                    {q.explanation && (
                      <div className="p-3.5 rounded-xl bg-purple-500/5 dark:bg-purple-950/60 border border-purple-500/25 dark:border-purple-400/40 text-xs text-ink-soft dark:text-purple-100 space-y-1">
                        <span className="font-bold text-primary dark:text-purple-300 flex items-center gap-1">
                          <Lightbulb className="w-3.5 h-3.5" /> Explanation:
                        </span>
                        <p className="leading-relaxed">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // ONE QUESTION PER SCREEN MCQ ENGINE
  // ==========================================
  const currentSelected = selectedAnswers[currentQuestion.id];
  const isFlagged = !!flaggedQuestions[currentQuestion.id];
  const currentDisplayOptions = getQuestionOptionsWithUnsure(currentQuestion);

  return (
    <div className="relative min-h-screen bg-paper dark:bg-[#070510] text-ink dark:text-white transition-colors duration-200 flex flex-col justify-between">
      <GridBackground squareSize={64} showDots={true} />

      {/* Top Test Navigation Bar */}
      <header className="sticky top-0 z-30 bg-paper/95 dark:bg-[#070510]/95 backdrop-blur-md border-b border-slate-200 dark:border-purple-400/25">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-3">
          {/* Exit Test Button */}
          <button
            type="button"
            onClick={() => setShowExitModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-ink-soft dark:text-slate-200 hover:text-ink dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#201944] transition-colors"
          >
            <span>✕ Exit</span>
          </button>

          {/* Center Info: Question Counter & Timer */}
          <div className="flex items-center gap-3 sm:gap-6 font-nav">
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-ink-soft dark:text-slate-300 block">
                Question
              </span>
              <span className="text-xs sm:text-sm font-bold text-ink dark:text-white">
                <strong className="text-primary dark:text-purple-300 font-extrabold text-sm sm:text-base">
                  {currentIndex + 1}
                </strong>{" "}
                / {totalQuestions}
              </span>
            </div>

            <div className="h-6 w-px bg-slate-200 dark:border-purple-400/25" />

            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-ink-soft dark:text-slate-300 block">
                Time Elapsed
              </span>
              <span className="text-xs sm:text-sm font-bold text-ink dark:text-white flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5 text-ink-soft dark:text-slate-300" />
                {formatTime(elapsedSeconds)}
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
                  : "border-slate-200 dark:border-purple-400/25 text-ink-soft dark:text-slate-200 hover:text-ink dark:hover:text-white"
              }`}
              title={isFlagged ? "Flagged for review" : "Flag question for review"}
            >
              <span>{isFlagged ? "🚩" : "🏳️"}</span>
              <span className="hidden sm:inline">{isFlagged ? "Flagged" : "Flag"}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowDrawer(true)}
              className="p-2 rounded-xl border border-slate-200 dark:border-purple-400/25 text-xs font-semibold text-ink-soft dark:text-slate-200 hover:text-ink dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#201944] flex items-center gap-1.5 transition-colors"
            >
              <span>📋</span>
              <span className="hidden sm:inline">Overview ({answeredCount}/{totalQuestions})</span>
            </button>
          </div>
        </div>

        {/* Smooth Horizontal Progress Bar */}
        <div className="w-full h-1.5 bg-slate-200 dark:bg-white/15 overflow-hidden relative">
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
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-[#231b4c] text-ink-soft dark:text-slate-200 border border-slate-200 dark:border-purple-400/25">
                Level {currentQuestion.level}
              </span>
              {currentQuestion.difficulty && (
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-ink-soft dark:text-slate-300">
                  Difficulty: {currentQuestion.difficulty}
                </span>
              )}
            </div>

            <span className="text-xs font-medium text-ink-soft dark:text-slate-300">
              {totalQuestions - answeredCount > 0
                ? `${totalQuestions - answeredCount} remaining`
                : "All answered! 🎉"}
            </span>
          </div>

          {/* Reading Passage if available */}
          {currentQuestion.passage && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 dark:bg-[#231b4c] border border-slate-200 dark:border-purple-400/30 shadow-xs text-xs sm:text-sm text-ink dark:text-slate-100 leading-relaxed max-h-48 overflow-y-auto">
              <span className="font-bold text-primary dark:text-purple-300 block mb-1">
                📖 Passage Context:
              </span>
              <p>{currentQuestion.passage}</p>
            </div>
          )}

          {/* Primary Question Prompt Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#191338] border border-slate-200/90 dark:border-purple-400/30 shadow-md sm:shadow-lg dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] space-y-4 relative">
            <h2 className="font-brand text-lg sm:text-xl lg:text-2xl font-bold text-ink dark:text-white leading-relaxed">
              {currentQuestion.question}
            </h2>

            {/* MCQ Options (A, B, C, D, E) */}
            <div className="grid grid-cols-1 gap-3 pt-2">
              {currentDisplayOptions.map((option, idx) => {
                const isSelected =
                  currentSelected?.optionId === option.id ||
                  currentSelected?.content === option.content;
                const isDontKnow = option.content === DONT_KNOW_TEXT;
                const optionLetters = ["A", "B", "C", "D", "E", "F"];
                const letter = optionLetters[idx] || String(idx + 1);

                let containerStyle =
                  "bg-white dark:bg-[#201942] hover:bg-slate-50 dark:hover:bg-[#2b2259] border-slate-200 dark:border-purple-400/25 dark:hover:border-purple-400/60 text-ink dark:text-white shadow-xs";
                if (isSelected) {
                  containerStyle = isDontKnow
                    ? "bg-amber-500/10 dark:bg-amber-500/35 border-amber-500 dark:border-amber-400 ring-2 ring-amber-500/30 dark:ring-amber-400/50 shadow-md"
                    : "bg-primary/10 dark:bg-purple-600/40 border-primary dark:border-purple-400 ring-2 ring-primary/30 dark:ring-purple-400/50 shadow-md";
                } else if (isDontKnow) {
                  containerStyle =
                    "bg-slate-50 dark:bg-[#1a1438] border-slate-200/80 dark:border-purple-400/20 text-ink-soft dark:text-slate-300 hover:text-ink dark:hover:text-white hover:border-slate-400 dark:hover:border-purple-400/40";
                }

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelectOption(option.id, option.content)}
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
                            ? "bg-slate-200/80 dark:bg-[#2e2363] text-ink-soft dark:text-slate-300 group-hover:bg-amber-500/20 group-hover:text-amber-600 dark:group-hover:text-amber-400"
                            : "bg-slate-100 dark:bg-[#2e2363] text-ink-soft dark:text-slate-200 group-hover:bg-primary/20 group-hover:text-primary dark:group-hover:text-purple-300"
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
                              : "text-ink dark:text-white"
                          }`}
                        >
                          {option.content}
                        </span>
                        {isDontKnow && (
                          <span className="text-[11px] text-ink-soft dark:text-slate-300 font-normal">
                            Skip if uncertain (will evaluate diagnostic accuracy accordingly)
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
                          : "border-slate-300 dark:border-white/30"
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
      <footer className="sticky bottom-0 z-30 bg-paper/95 dark:bg-[#070510]/95 backdrop-blur-md border-t border-slate-200 dark:border-purple-400/25 py-3.5 sm:py-4">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl border border-slate-200 dark:border-purple-400/25 text-xs sm:text-sm font-semibold text-ink-soft dark:text-slate-200 hover:text-ink dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#201944] disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Center Question Jumper Note */}
          <div className="flex items-center gap-1.5 text-xs text-ink-soft dark:text-slate-300">
            <span className="hidden sm:inline">Use keys</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#231b4c] font-mono text-[10px] border border-slate-200 dark:border-purple-400/30">
              1-5 / A-E
            </kbd>
            <span className="hidden sm:inline">to select answer</span>
          </div>

          {/* Next / Submit Button */}
          {currentIndex === totalQuestions - 1 ? (
            <button
              type="button"
              onClick={() => {
                if (currentQuestion && selectedAnswers[currentQuestion.id]) {
                  handleSubmitTest();
                }
              }}
              disabled={!currentQuestion || !selectedAnswers[currentQuestion.id]}
              className="inline-flex items-center gap-1.5 px-6 sm:px-7 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:from-slate-300 disabled:via-slate-300 disabled:to-slate-300 dark:disabled:from-white/10 dark:disabled:via-white/10 dark:disabled:to-white/10 disabled:text-ink-soft/50 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/25 active:scale-95 transition-all"
              title={!selectedAnswers[currentQuestion?.id] ? "Please select an answer to finish" : "Submit Diagnostic Test"}
            >
              <span>Submit Diagnostic Test</span>
              <CheckCircle2 className="w-4 h-4" />
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
          <div className="w-full max-w-md bg-white dark:bg-[#191338] border border-slate-200 dark:border-purple-400/30 rounded-3xl p-6 shadow-2xl space-y-4 animate-scaleUp max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-brand text-lg font-bold text-ink dark:text-white">
                  Question Overview
                </h3>
                <p className="text-xs text-ink-soft dark:text-slate-300">
                  Answered: {answeredCount} / {totalQuestions}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDrawer(false)}
                className="p-2 text-ink-soft hover:text-ink dark:text-slate-300 dark:hover:text-white text-sm rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-ink-soft dark:text-slate-300 pt-1 border-t border-slate-200/60 dark:border-purple-400/20">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-primary text-white" /> Current
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500 text-emerald-600 dark:text-emerald-400" /> Answered
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500 text-amber-600 dark:text-amber-400" /> Flagged
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-slate-100 dark:bg-[#231b4c] border border-slate-200 dark:border-purple-400/25" /> Unanswered
              </span>
            </div>

            {/* Number buttons grid */}
            <div className="grid grid-cols-5 sm:grid-cols-8 gap-2 overflow-y-auto p-1 flex-1">
              {questions.map((q, idx) => {
                const isAns = !!selectedAnswers[q.id];
                const isCurr = idx === currentIndex;
                const isFlag = !!flaggedQuestions[q.id];

                let btnClass = "bg-slate-100 dark:bg-[#231b4c] text-ink-soft dark:text-slate-200 border-slate-200 dark:border-purple-400/25";
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

            <div className="pt-3 border-t border-slate-200/60 dark:border-purple-400/20 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowDrawer(false);
                  handleSubmitTest();
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
          <div className="w-full max-w-sm bg-white dark:bg-[#191338] border border-slate-200 dark:border-purple-400/30 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <span className="text-3xl">🚪</span>
            <h3 className="font-brand text-lg font-bold text-ink dark:text-white">
              Exit Placement Test?
            </h3>
            <p className="text-xs text-ink-soft dark:text-slate-200 leading-relaxed">
              Are you sure you want to leave? Your placement results won&apos;t be finalized until you submit your answers.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowExitModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-purple-400/30 text-xs font-semibold text-ink dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#251d52] transition-colors"
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
