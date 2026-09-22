"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
    Volume2,
    ChevronLeft,

    ChevronRight,
    RotateCw,
    CheckCircle2,
    XCircle,
    BookOpen,
    ArrowRight,
    Shuffle,
    HelpCircle,
    Clock,
    Calendar,
    X,
    Filter,
    ChevronDown,
    Tag,
} from "lucide-react";
import { MyVocabularyItem, PartOfSpeech } from "@/types";
import { fetchMyVocabularies, getDateWordCounts, updateMyVocabulary } from "@/lib/api";
import { VocabularyDatePicker } from "@/features/vocabulary/vocab-vault/components/VocabularyDatePicker";
import { ALL_POS_OPTIONS, POS_COLORS } from "@/features/vocabulary";

type PracticeMode = "flashcards" | "quiz";

const VocabPracticePage = () => {
    const [vocabularies, setVocabularies] = useState<MyVocabularyItem[]>([]);
    const [allVaultWords, setAllVaultWords] = useState<MyVocabularyItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mode, setMode] = useState<PracticeMode>("flashcards");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [playingWord, setPlayingWord] = useState<string | null>(null);

    // Filters state
    const [selectedPos, setSelectedPos] = useState<PartOfSpeech | "ALL">("ALL");
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [todayOnly, setTodayOnly] = useState<boolean>(false);
    const [isPosDropdownOpen, setIsPosDropdownOpen] = useState(false);
    const posDropdownRef = useRef<HTMLDivElement>(null);

    // Close POS dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                posDropdownRef.current &&
                !posDropdownRef.current.contains(event.target as Node)
            ) {
                setIsPosDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Quiz state
    const [quizOptions, setQuizOptions] = useState<string[]>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [quizFeedback, setQuizFeedback] = useState<"correct" | "incorrect" | null>(null);
    const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });

    // Map of YYYY-MM-DD -> word count for calendar indicators
    const calendarWordCounts = useMemo(() => {
        return getDateWordCounts(allVaultWords);
    }, [allVaultWords]);

    // Counts of words per Part of Speech
    const posCounts = useMemo(() => {
        const counts: Partial<Record<PartOfSpeech, number>> = {};
        allVaultWords.forEach((item) => {
            const pos = item.word?.partOfSpeech as PartOfSpeech;
            if (pos) {
                counts[pos] = (counts[pos] || 0) + 1;
            }
        });
        return counts;
    }, [allVaultWords]);

    // Today's words count
    const todayCount = useMemo(() => {
        const today = new Date();
        return allVaultWords.filter((v) => {
            const d = v.createdAt || v.updatedAt;
            if (!d) return false;
            const date = new Date(d);
            return (
                date.getFullYear() === today.getFullYear() &&
                date.getMonth() === today.getMonth() &&
                date.getDate() === today.getDate()
            );
        }).length;
    }, [allVaultWords]);

    // Fetch words based on filters
    useEffect(() => {
        let isCancelled = false;

        async function loadFilteredWords() {
            setIsLoading(true);
            try {
                const [filteredRes, totalVaultRes] = await Promise.all([
                    fetchMyVocabularies({
                        partOfSpeech: selectedPos !== "ALL" ? selectedPos : undefined,
                        selectedDate: selectedDate || undefined,
                        todayOnly,
                        limit: 100,
                    }),
                    allVaultWords.length === 0 ? fetchMyVocabularies({ limit: 100 }) : Promise.resolve(allVaultWords),
                ]);

                if (!isCancelled) {
                    setVocabularies(filteredRes.data);
                    if (allVaultWords.length === 0) {
                        setAllVaultWords(Array.isArray(totalVaultRes) ? totalVaultRes : totalVaultRes.data);
                    }
                    setCurrentIndex(0);
                    setIsFlipped(false);
                    setSelectedOption(null);
                    setQuizFeedback(null);
                    setQuizScore({ correct: 0, total: 0 });
                }
            } catch (err) {
                console.warn("Could not load filtered vocabularies for practice:", err);
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        }

        loadFilteredWords();

        return () => {
            isCancelled = true;
        };
    }, [selectedPos, selectedDate, todayOnly]);

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
        if (!currentWord) return;
        setSelectedOption(null);
        setQuizFeedback(null);

        const correctAnswer = currentWord.word.meaning;
        const pool = vocabularies.length >= 4 ? vocabularies : allVaultWords;
        const otherMeanings = pool
            .filter((v) => v.id !== currentWord.id && v.word.meaning !== correctAnswer)
            .map((v) => v.word.meaning)
            .filter(Boolean);

        // Pick 3 random distractor meanings
        const shuffledOthers = [...otherMeanings].sort(() => 0.5 - Math.random()).slice(0, 3);
        const options = [...shuffledOthers, correctAnswer].sort(() => 0.5 - Math.random());
        setQuizOptions(options);
    }, [currentIndex, currentWord, vocabularies, allVaultWords]);

    const handleNext = () => {
        if (vocabularies.length === 0) return;
        setIsFlipped(false);
        setSelectedOption(null);
        setQuizFeedback(null);
        setCurrentIndex((prev) => (prev + 1) % vocabularies.length);
    };

    const handlePrev = () => {
        if (vocabularies.length === 0) return;
        setIsFlipped(false);
        setSelectedOption(null);
        setQuizFeedback(null);
        setCurrentIndex((prev) => (prev - 1 + vocabularies.length) % vocabularies.length);
    };

    const handleShuffle = () => {
        if (vocabularies.length === 0) return;
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

    const handleResetFilters = () => {
        setSelectedPos("ALL");
        setSelectedDate(null);
        setTodayOnly(false);
    };

    const hasActiveFilters = selectedPos !== "ALL" || selectedDate !== null || todayOnly;

    return (
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6 animate-in fade-in duration-300">
            {/* Navigation & Header */}
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
                        onClick={() => setMode("flashcards")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${mode === "flashcards"
                                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                    >
                        Flashcards
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode("quiz")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${mode === "quiz"
                                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                    >
                        Definition Quiz
                    </button>
                </div>
            </div>

            {/* Filter Bar: Date Filter + Part of Speech Carousel */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                {/* Row 1: Date Filters & Quick Presets */}
                <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mr-1">
                        <Filter className="w-3.5 h-3.5" />
                        <span>Filter By:</span>
                    </span>

                    {/* All Dates Preset */}
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedDate(null);
                            setTodayOnly(false);
                        }}
                        className={`h-10 px-4 rounded-xl text-xs font-semibold inline-flex items-center justify-center border transition-all cursor-pointer ${!selectedDate && !todayOnly
                                ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 shadow-2xs font-bold"
                                : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                            }`}
                    >
                        All Dates
                    </button>

                    {/* Today's Words Toggle */}
                    <button
                        type="button"
                        onClick={() => {
                            const nextVal = !todayOnly;
                            setTodayOnly(nextVal);
                            if (nextVal) setSelectedDate(null);
                        }}
                        className={`h-10 px-4 rounded-xl text-xs font-semibold inline-flex items-center gap-2 border transition-all cursor-pointer ${todayOnly
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-xs font-bold"
                                : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                            }`}
                    >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Today&apos;s Words</span>
                        {todayCount > 0 && (
                            <span
                                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${todayOnly
                                        ? "bg-white/25 text-white"
                                        : "bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400"
                                    }`}
                            >
                                {todayCount}
                            </span>
                        )}
                    </button>

                    {/* Interactive Date Picker with Word Counts */}
                    <VocabularyDatePicker
                        selectedDate={selectedDate}
                        onSelectDate={(date: any) => {
                            setSelectedDate(date);
                            if (date) setTodayOnly(false);
                        }}
                        wordCounts={calendarWordCounts}
                        buttonClassName="h-10 px-4 rounded-xl text-xs font-semibold"
                    />

                    {/* Part of Speech Filter Dropdown */}
                    <div ref={posDropdownRef} className="relative inline-block">
                        <button
                            type="button"
                            onClick={() => setIsPosDropdownOpen((prev) => !prev)}
                            className={`h-10 px-4 rounded-xl text-xs font-semibold border inline-flex items-center gap-2 transition-all cursor-pointer select-none ${selectedPos !== "ALL"
                                    ? "bg-gradient-to-r from-purple-600/15 via-indigo-600/15 to-pink-600/15 border-purple-500/40 text-purple-700 dark:text-purple-300 shadow-sm shadow-purple-500/10 ring-2 ring-purple-500/20 font-bold"
                                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-purple-400 dark:hover:border-purple-500/50"
                                }`}
                            title="Filter by part of speech"
                        >
                            <div
                                className={`p-1 rounded-lg transition-colors ${selectedPos !== "ALL"
                                        ? "bg-purple-600 text-white shadow-sm"
                                        : "text-slate-400"
                                    }`}
                            >
                                <Tag className="w-3.5 h-3.5" />
                            </div>

                            <span>
                                {selectedPos === "ALL"
                                    ? "All Types"
                                    : POS_COLORS[selectedPos]?.label || selectedPos}
                            </span>

                            <span
                                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${selectedPos !== "ALL"
                                        ? "bg-purple-500/20 text-purple-700 dark:text-purple-300"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                                    }`}
                            >
                                {selectedPos === "ALL"
                                    ? allVaultWords.length
                                    : posCounts[selectedPos] || 0}
                            </span>

                            <ChevronDown
                                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isPosDropdownOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        {/* Dropdown Popover */}
                        {isPosDropdownOpen && (
                            <div className="absolute left-0 mt-2 z-50 w-56 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/15 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
                                {/* All Types option */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedPos("ALL");
                                        setIsPosDropdownOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${selectedPos === "ALL"
                                            ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold"
                                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-slate-400" />
                                        <span>All Types</span>
                                    </span>
                                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                                        {allVaultWords.length}
                                    </span>
                                </button>

                                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                                {/* Specific POS options */}
                                <div className="max-h-60 overflow-y-auto space-y-0.5">
                                    {ALL_POS_OPTIONS.map((pos: PartOfSpeech) => {
                                        const count = posCounts[pos] || 0;
                                        const config = POS_COLORS[pos];
                                        const isSelected = selectedPos === pos;

                                        return (
                                            <button
                                                key={pos}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedPos(pos);
                                                    setIsPosDropdownOpen(false);
                                                }}
                                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${isSelected
                                                        ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold"
                                                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                    } ${count === 0 ? "opacity-50" : ""}`}
                                            >
                                                <span className="flex items-center gap-2">
                                                    <span
                                                        className={`w-2 h-2 rounded-full ${config?.border?.replace("border-", "bg-") || "bg-indigo-400"
                                                            }`}
                                                    />
                                                    <span>{config?.label || pos}</span>
                                                </span>
                                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                                                    {count}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Clear Filters button */}
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={handleResetFilters}
                            className="h-10 inline-flex items-center gap-1.5 px-3.5 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/50 transition-colors ml-auto cursor-pointer"
                        >
                            <X className="w-3.5 h-3.5" />
                            <span>Reset Filters</span>
                        </button>
                    )}
                </div>

                {/* Active Filter Summary Bar */}
                {hasActiveFilters && (
                    <div className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 text-xs text-indigo-700 dark:text-indigo-300">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold">Active Session Filter:</span>
                            {todayOnly && (
                                <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white font-medium text-[11px]">
                                    Today&apos;s Words
                                </span>
                            )}
                            {selectedDate && (
                                <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white font-medium text-[11px] flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {selectedDate}
                                </span>
                            )}
                            {selectedPos !== "ALL" && (
                                <span className="px-2 py-0.5 rounded-md bg-purple-600 text-white font-medium text-[11px]">
                                    {POS_COLORS[selectedPos]?.label || selectedPos}
                                </span>
                            )}
                        </div>
                        <span className="font-semibold font-mono shrink-0">
                            {vocabularies.length} {vocabularies.length === 1 ? "word" : "words"} found
                        </span>
                    </div>
                )}
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
                                onClick={handleResetFilters}
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
            ) : (
                /* Practice Session Container */
                <div className="space-y-5">
                    {/* Session Progress & Navigation Bar */}
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">
                                Word {currentIndex + 1} of {vocabularies.length}
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
                                onClick={handleShuffle}
                                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                                title="Shuffle session words"
                            >
                                <Shuffle className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={handlePrev}
                                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                                title="Previous word"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={handleNext}
                                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                                title="Next word"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* 1. Flashcard Mode */}
                    {mode === "flashcards" && currentWord && (
                        <div className="space-y-4">
                            <div
                                onClick={() => setIsFlipped(!isFlipped)}
                                className="min-h-[350px] sm:min-h-[390px] p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600/60 shadow-md cursor-pointer transition-all flex flex-col justify-between select-none group relative overflow-hidden"
                            >
                                {/* Top card bar: Part of Speech + Flip hint */}
                                <div className="flex items-center justify-between">
                                    <span
                                        className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${POS_COLORS[currentWord.word.partOfSpeech]?.bg || "bg-indigo-50"
                                            } ${POS_COLORS[currentWord.word.partOfSpeech]?.text || "text-indigo-600"} ${POS_COLORS[currentWord.word.partOfSpeech]?.border || "border-indigo-200"
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
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold text-xs border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer"
                                            >
                                                <Volume2
                                                    className={`w-4 h-4 ${playingWord === currentWord.word.word ? "animate-pulse text-indigo-600" : ""
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
                                            className="px-3 py-1 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition-colors cursor-pointer"
                                        >
                                            Hard
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRateMastery(3)}
                                            className="px-3 py-1 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
                                        >
                                            Good
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRateMastery(5)}
                                            className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
                                        >
                                            Mastered ⭐
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. Definition Quiz Mode */}
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
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
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
export default VocabPracticePage