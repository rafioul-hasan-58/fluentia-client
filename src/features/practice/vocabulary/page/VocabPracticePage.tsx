"use client";

import React, { useState, useEffect, useMemo } from "react";
import { MyVocabularyItem, PartOfSpeech, VocabularyStats } from "@/types";
import { fetchMyVocabularies, getDateWordCounts, updateMyVocabulary } from "@/lib/api";
import { fetchMyVocabularyStats } from "@/features/vocabulary";
import { PracticeMode } from "../types";
import {
    VocabPracticeHeader,
    VocabPracticeFilterBar,
    VocabPracticeSessionBar,
    VocabFlashcard,
    VocabQuiz,
    VocabPracticeEmptyState,
} from "../components";

const VocabPracticePage = () => {
    const [vocabularies, setVocabularies] = useState<MyVocabularyItem[]>([]);
    const [allVaultWords, setAllVaultWords] = useState<MyVocabularyItem[]>([]);
    const [stats, setStats] = useState<VocabularyStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [mode, setMode] = useState<PracticeMode>("flashcards");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [playingWord, setPlayingWord] = useState<string | null>(null);

    // Filters state
    const [selectedPos, setSelectedPos] = useState<PartOfSpeech | "ALL">("ALL");
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [todayOnly, setTodayOnly] = useState<boolean>(false);
    const [wordLimit, setWordLimit] = useState<number>(20);

    // Quiz state
    const [quizOptions, setQuizOptions] = useState<string[]>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [quizFeedback, setQuizFeedback] = useState<"correct" | "incorrect" | null>(null);
    const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });

    // Load vocabulary stats on mount
    useEffect(() => {
        let isCancelled = false;

        async function loadStats() {
            try {
                const currentMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
                const statsData = await fetchMyVocabularyStats(currentMonth);
                if (!isCancelled && statsData) {
                    setStats(statsData);
                }
            } catch (err) {
                console.warn("Could not load vocabulary stats:", err);
            }
        }

        loadStats();

        return () => {
            isCancelled = true;
        };
    }, []);

    // Map of YYYY-MM-DD -> word count for calendar indicators
    const calendarWordCounts = useMemo(() => {
        if (stats?.dateWordCounts && Object.keys(stats.dateWordCounts).length > 0) {
            return stats.dateWordCounts;
        }
        return getDateWordCounts(allVaultWords);
    }, [stats, allVaultWords]);

    // Total words count for "All Types" from stats
    const totalStatsCount = typeof stats?.totalWords === "number" ? stats.totalWords : allVaultWords.length;

    // Counts of words per Part of Speech from stats with fallback
    const posCounts = useMemo(() => {
        const counts: Partial<Record<PartOfSpeech, number>> = {};
        if (stats?.partOfSpeeches && Object.keys(stats.partOfSpeeches).length > 0) {
            Object.entries(stats.partOfSpeeches).forEach(([key, val]) => {
                counts[key as PartOfSpeech] = val;
            });
            return counts;
        }
        allVaultWords.forEach((item) => {
            const pos = item.word?.partOfSpeech as PartOfSpeech;
            if (pos) {
                counts[pos] = (counts[pos] || 0) + 1;
            }
        });
        return counts;
    }, [stats, allVaultWords]);

    // Helper to robustly check if a word matches a given date (local or UTC)
    const isWordFromDate = (item: MyVocabularyItem, targetDate: string): boolean => {
        const ds = item.createdAt || item.updatedAt;
        if (!ds) return false;
        if (ds.startsWith(targetDate)) return true;
        const d = new Date(ds);
        if (isNaN(d.getTime())) return false;
        const ly = d.getFullYear();
        const lm = String(d.getMonth() + 1).padStart(2, "0");
        const ld = String(d.getDate()).padStart(2, "0");
        if (`${ly}-${lm}-${ld}` === targetDate) return true;
        const uy = d.getUTCFullYear();
        const um = String(d.getUTCMonth() + 1).padStart(2, "0");
        const ud = String(d.getUTCDate()).padStart(2, "0");
        return `${uy}-${um}-${ud}` === targetDate;
    };

    // Active target date string (YYYY-MM-DD) whether from todayOnly or selectedDate
    const activeTargetDate = useMemo(() => {
        if (todayOnly) {
            const now = new Date();
            return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
        }
        return selectedDate;
    }, [todayOnly, selectedDate]);

    // Today's words count from stats with fallback to vault words
    const todayCount = useMemo(() => {
        const now = new Date();
        const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
        const localMatchCount = allVaultWords.filter((w) => isWordFromDate(w, todayStr)).length;
        if (localMatchCount > 0) return localMatchCount;
        if (typeof stats?.todaysVocab === "number" && stats.todaysVocab > 0) {
            return stats.todaysVocab;
        }
        return 0;
    }, [stats, allVaultWords]);

    // Load initial vault words fallback for calendar/part of speech counts
    useEffect(() => {
        let isCancelled = false;
        async function loadVaultFallback() {
            try {
                const res = await fetchMyVocabularies({ limit: 100 });
                if (!isCancelled && res.data && res.data.length > 0) {
                    setAllVaultWords(res.data);
                }
            } catch (err) {
                console.warn("Could not load vault fallback words:", err);
            }
        }
        loadVaultFallback();
        return () => {
            isCancelled = true;
        };
    }, []);

    // Fetch words directly based on filters & selected word limit via backend
    useEffect(() => {
        let isCancelled = false;

        async function loadFilteredWords() {
            setIsLoading(true);
            try {
                const fetchLimit = wordLimit === 0 ? 100 : Math.min(wordLimit, 100);

                const res = await fetchMyVocabularies({
                    partOfSpeech: selectedPos !== "ALL" ? selectedPos : undefined,
                    date: activeTargetDate || undefined,
                    limit: fetchLimit,
                });

                if (!isCancelled) {
                    let matchedWords = res.data || [];
                    if (wordLimit > 0 && matchedWords.length > wordLimit) {
                        matchedWords = matchedWords.slice(0, wordLimit);
                    }

                    setVocabularies(matchedWords);
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
    }, [selectedPos, activeTargetDate, wordLimit]);

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
        setWordLimit(20);
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            const currentMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
            const fetchLimit = wordLimit === 0 ? 100 : Math.min(wordLimit, 100);

            const [statsData, wordsRes, vaultRes] = await Promise.all([
                fetchMyVocabularyStats(currentMonth).catch(() => null),
                fetchMyVocabularies({
                    partOfSpeech: selectedPos !== "ALL" ? selectedPos : undefined,
                    date: activeTargetDate || undefined,
                    limit: fetchLimit,
                }).catch(() => null),
                fetchMyVocabularies({ limit: 100 }).catch(() => null),
            ]);

            if (statsData) setStats(statsData);
            if (vaultRes?.data && vaultRes.data.length > 0) {
                setAllVaultWords(vaultRes.data);
            }
            if (wordsRes?.data) {
                let matchedWords = wordsRes.data;
                if (wordLimit > 0 && matchedWords.length > wordLimit) {
                    matchedWords = matchedWords.slice(0, wordLimit);
                }
                setVocabularies(matchedWords);
                setCurrentIndex(0);
                setIsFlipped(false);
                setSelectedOption(null);
                setQuizFeedback(null);
                setQuizScore({ correct: 0, total: 0 });
            }
        } catch (err) {
            console.warn("Could not refresh practice vocabulary:", err);
        } finally {
            setIsRefreshing(false);
        }
    };

    const hasActiveFilters = selectedPos !== "ALL" || selectedDate !== null || todayOnly || wordLimit !== 20;

    return (
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6 animate-in fade-in duration-300">
            {/* Navigation & Header with Mode Switcher */}
            <VocabPracticeHeader mode={mode} onModeChange={setMode} />

            {/* Filter Bar with Presets, Dropdowns, Refresh and Active Summary */}
            <VocabPracticeFilterBar
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                todayOnly={todayOnly}
                onToggleTodayOnly={setTodayOnly}
                todayCount={todayCount}
                calendarWordCounts={calendarWordCounts}
                onMonthChange={(monthStr) => {
                    fetchMyVocabularyStats(monthStr).then((data) => {
                        if (data) setStats(data);
                    });
                }}
                selectedPos={selectedPos}
                onSelectPos={setSelectedPos}
                totalStatsCount={totalStatsCount}
                posCounts={posCounts}
                wordLimit={wordLimit}
                onSelectWordLimit={setWordLimit}
                loadedWordsCount={vocabularies.length}
                hasActiveFilters={hasActiveFilters}
                onResetFilters={handleResetFilters}
                isRefreshing={isRefreshing}
                isLoading={isLoading}
                onRefresh={handleRefresh}
            />

            {isLoading ? (
                /* Loading Skeleton */
                <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-4 animate-pulse">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60" />
                    <div className="h-5 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-4 w-64 bg-slate-100 dark:bg-slate-800/60 rounded" />
                </div>
            ) : vocabularies.length === 0 ? (
                /* Empty State */
                <VocabPracticeEmptyState
                    hasActiveFilters={hasActiveFilters}
                    onResetFilters={handleResetFilters}
                />
            ) : (
                /* Practice Session Container */
                <div className="space-y-5">
                    {/* Session Progress & Navigation Bar */}
                    <VocabPracticeSessionBar
                        currentIndex={currentIndex}
                        totalWords={vocabularies.length}
                        selectedPos={selectedPos}
                        onPrev={handlePrev}
                        onNext={handleNext}
                        onShuffle={handleShuffle}
                    />

                    {/* Mode 1: Flashcard Mode */}
                    {mode === "flashcards" && currentWord && (
                        <VocabFlashcard
                            currentWord={currentWord}
                            isFlipped={isFlipped}
                            onToggleFlip={() => setIsFlipped(!isFlipped)}
                            playingWord={playingWord}
                            onPlayPronunciation={playPronunciation}
                            onRateMastery={handleRateMastery}
                        />
                    )}

                    {/* Mode 2: Definition Quiz Mode */}
                    {mode === "quiz" && currentWord && (
                        <VocabQuiz
                            currentWord={currentWord}
                            quizOptions={quizOptions}
                            selectedOption={selectedOption}
                            quizFeedback={quizFeedback}
                            quizScore={quizScore}
                            onSelectOption={handleSelectQuizOption}
                            onNext={handleNext}
                        />
                    )}
                </div>
            )}
        </main>
    );
};

export default VocabPracticePage;