"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Volume2,
  Star,
  Sparkles,
  BookOpen,
  Layers,
  GraduationCap,
  MessageSquare,
  FileText,
  ExternalLink,
  Copy,
  Check,
  Plus,
  Trash2,
  ArrowRight,
  RefreshCw,
  Search,
  AlertCircle,
  Lightbulb,
  Share2,
} from "lucide-react";
import {
  MyVocabularyItem,
  PartOfSpeech,
  VocabularyStatus,
  getVerbForms,
  getCollocationBangla,
  getCollocationExample,
  getCollocationMeaning,
  getCollocationText,
  getWordRelationText,
  getWordRelationPartOfSpeech,
  getWordRelationBangla,
} from "@/types";
import {
  POS_COLORS,
  highlightPhrase,
} from "../vocab-vault/constants/vocabularyConstants";
import {
  fetchMyVocabularyByWord,
  updateMyVocabulary,
  addSingleVocabulary,
} from "../vocab-vault/api/myVocabulary";

interface VocabularyDetailPageProps {
  word: string;
}

export function VocabularyDetailPage({ word }: VocabularyDetailPageProps) {
  const router = useRouter();
  const decodedWord = useMemo(() => decodeURIComponent(word || "").trim().toLowerCase(), [word]);

  // Ensure URL in browser bar is lowercase if accessed with uppercase letters
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      const lowerPath = currentPath.toLowerCase();
      if (currentPath !== lowerPath && currentPath.startsWith("/dashboard/user/vocabulary/")) {
        router.replace(lowerPath);
      }
    }
  }, [router]);

  const [item, setItem] = useState<MyVocabularyItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isAddingToVault, setIsAddingToVault] = useState(false);

  // Notes state
  const [notesText, setNotesText] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSavedSuccess, setNotesSavedSuccess] = useState(false);

  // Sentences state
  const [newSentence, setNewSentence] = useState("");
  const [isAddingSentence, setIsAddingSentence] = useState(false);

  // Load word details
  const loadWord = useCallback(async () => {
    if (!decodedWord) return;
    setIsLoading(true);
    try {
      const data = await fetchMyVocabularyByWord(decodedWord);
      setItem(data);
      if (data) {
        setNotesText(data.notes || "");
      }
    } catch (err) {
      console.error("[VocabularyDetailPage] Error loading word:", err);
    } finally {
      setIsLoading(false);
    }
  }, [decodedWord]);

  useEffect(() => {
    loadWord();
  }, [loadWord]);

  // Pronunciation handler
  const playPronunciation = useCallback((text: string) => {
    if (!text || typeof window === "undefined") return;
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Copy URL to clipboard
  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Toggle Favorite
  const handleToggleFavorite = async () => {
    if (!item) return;
    const nextVal = !item.isFavorite;
    setItem((prev) => (prev ? { ...prev, isFavorite: nextVal } : null));

    if (item.id && !item.id.startsWith("untracked-")) {
      try {
        await updateMyVocabulary(item.id, { isFavorite: nextVal });
      } catch (err) {
        console.warn("Could not save favorite state:", err);
      }
    }
  };

  // Change Mastery Level
  const handleSetMastery = async (stars: number) => {
    if (!item) return;
    setItem((prev) => (prev ? { ...prev, masteryLevel: stars } : null));

    if (item.id && !item.id.startsWith("untracked-")) {
      try {
        await updateMyVocabulary(item.id, { masteryLevel: stars });
      } catch (err) {
        console.warn("Could not update mastery level:", err);
      }
    }
  };

  // Change Status
  const handleSetStatus = async (newStatus: VocabularyStatus) => {
    if (!item) return;
    setItem((prev) => (prev ? { ...prev, vocabularyStatus: newStatus } : null));

    if (item.id && !item.id.startsWith("untracked-")) {
      try {
        await updateMyVocabulary(item.id, { vocabularyStatus: newStatus });
      } catch (err) {
        console.warn("Could not update status:", err);
      }
    }
  };

  // Save Notes
  const handleSaveNotes = async () => {
    if (!item) return;
    setIsSavingNotes(true);
    try {
      if (item.id && !item.id.startsWith("untracked-")) {
        await updateMyVocabulary(item.id, { notes: notesText.trim() });
      }
      setItem((prev) => (prev ? { ...prev, notes: notesText.trim() } : null));
      setNotesSavedSuccess(true);
      setTimeout(() => setNotesSavedSuccess(false), 2500);
    } catch (err) {
      console.warn("Could not save notes:", err);
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Add Custom Sentence
  const handleAddSentence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !newSentence.trim()) return;

    const trimmed = newSentence.trim();
    const currentSentences = Array.isArray(item.mySentences) ? item.mySentences : [];
    const updatedSentences = [...currentSentences, trimmed];

    setIsAddingSentence(true);
    try {
      if (item.id && !item.id.startsWith("untracked-")) {
        await updateMyVocabulary(item.id, { mySentences: updatedSentences });
      }
      setItem((prev) => (prev ? { ...prev, mySentences: updatedSentences } : null));
      setNewSentence("");
    } catch (err) {
      console.warn("Could not add custom sentence:", err);
    } finally {
      setIsAddingSentence(false);
    }
  };

  // Remove Custom Sentence
  const handleDeleteSentence = async (indexToDelete: number) => {
    if (!item) return;
    const currentSentences = Array.isArray(item.mySentences) ? item.mySentences : [];
    const updatedSentences = currentSentences.filter((_, i) => i !== indexToDelete);

    setItem((prev) => (prev ? { ...prev, mySentences: updatedSentences } : null));

    if (item.id && !item.id.startsWith("untracked-")) {
      try {
        await updateMyVocabulary(item.id, { mySentences: updatedSentences });
      } catch (err) {
        console.warn("Could not delete sentence:", err);
      }
    }
  };

  // Add untracked word to user's personal vault
  const handleAddToVault = async () => {
    if (!item) return;
    setIsAddingToVault(true);
    try {
      const res = await addSingleVocabulary({
        word: item.word.word,
        notes: notesText.trim() || undefined,
        mySentences: item.mySentences || [],
      });
      if (res?.item) {
        setItem(res.item);
      }
    } catch (err) {
      console.error("Failed to add to vault:", err);
    } finally {
      setIsAddingToVault(false);
    }
  };

  // Render Loading Skeleton
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-10 w-44 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
          <div className="h-20 w-full bg-slate-100 dark:bg-slate-800/60 rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-36 bg-slate-100 dark:bg-slate-800/60 rounded-2xl" />
            <div className="h-36 bg-slate-100 dark:bg-slate-800/60 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // Render Not Found / Empty State
  if (!item) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto shadow-sm">
          <Search className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Word Not Found
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            We couldn&apos;t locate personal vocabulary details for &ldquo;
            <span className="font-semibold text-purple-600 dark:text-purple-400">
              {decodedWord}
            </span>
            &rdquo;. It may not have been added to your vault yet.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/dashboard/user/vocabulary"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-all shadow-sm shadow-purple-500/25"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Vocabulary Vault</span>
          </Link>
          <Link
            href={`/dashboard/user/practice/vocab`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-colors"
          >
            <span>Practice Drills</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const { word: wordData } = item;
  const posConfig = POS_COLORS[wordData.partOfSpeech] || POS_COLORS.NOUN;
  const verbForms = wordData.partOfSpeech === "VERB" ? wordData.verbForms || getVerbForms(wordData) : null;
  const isUntracked = item.id.startsWith("untracked-");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full space-y-6 animate-in fade-in duration-300">
      {/* 1. Top Breadcrumb & Action Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Link
            href="/dashboard/user/vocabulary"
            className="inline-flex items-center gap-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Vocabulary Vault</span>
          </Link>
          <span>/</span>
          <span className="text-purple-600 dark:text-purple-400 font-bold capitalize">
            {wordData.word}
          </span>
        </div>

        {/* Action Buttons: Practice, Share, Favorite */}
        <div className="flex items-center gap-2">
          {/* Practice in Drills */}
          <Link
            href="/dashboard/user/practice/vocab"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/80 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Practice Drills</span>
          </Link>

          {/* Copy Link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
            title="Copy page link"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Share</span>
              </>
            )}
          </button>

          {/* Favorite Toggle */}
          <button
            type="button"
            onClick={handleToggleFavorite}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              item.isFavorite
                ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-500 hover:border-amber-400"
            }`}
            title={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Star
              className={`w-4 h-4 ${
                item.isFavorite ? "fill-amber-400 text-amber-400" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Untracked Banner if word is not yet saved to personal vault */}
      {isUntracked && (
        <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              This word is in the global dictionary, but not yet saved in your personal study vault.
            </span>
          </div>
          <button
            type="button"
            onClick={handleAddToVault}
            disabled={isAddingToVault}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
          >
            {isAddingToVault ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
            <span>Add to My Vault</span>
          </button>
        </div>
      )}

      {/* 2. Main Hero Word Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Header: Title, Audio, POS, CEFR */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight capitalize">
                {wordData.word}
              </h1>

              {/* Pronunciation Audio Button */}
              <button
                type="button"
                onClick={() => playPronunciation(wordData.word)}
                className={`p-2.5 rounded-2xl transition-all border cursor-pointer ${
                  isPlayingAudio
                    ? "bg-purple-600 text-white border-purple-600 scale-105 shadow-md shadow-purple-500/30"
                    : "bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border-purple-200/80 dark:border-purple-800/80"
                }`}
                title="Listen to native pronunciation"
              >
                <Volume2 className={`w-5 h-5 ${isPlayingAudio ? "animate-pulse" : ""}`} />
              </button>

              {/* IPA Phonetic */}
              {wordData.ipa && (
                <span className="font-mono text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                  {wordData.ipa}
                </span>
              )}
            </div>

            {/* Badges: Part of Speech, CEFR Level, Oxford Frequency */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`px-3 py-1 rounded-xl text-xs font-bold border ${posConfig.bg} ${posConfig.text} ${posConfig.border}`}
              >
                {posConfig.label}
              </span>

              {(wordData.englishLevel || wordData.cefrLevel) && (
                <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  CEFR {wordData.englishLevel || wordData.cefrLevel}
                </span>
              )}

              {(wordData as any).frequency && (
                <span className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                  Freq: {(wordData as any).frequency}
                </span>
              )}
            </div>
          </div>

          {/* Personal Mastery & Status Rating */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5 min-w-[200px]">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span>Mastery</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {item.masteryLevel || 1} / 5
              </span>
            </div>

            {/* 5-Star Interactive Rating */}
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleSetMastery(star)}
                  className="p-1 hover:scale-125 transition-transform cursor-pointer"
                  title={`Rate mastery as ${star} star${star > 1 ? "s" : ""}`}
                >
                  <Star
                    className={`w-4 h-4 ${
                      star <= (item.masteryLevel || 1)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300 dark:text-slate-600"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Status Selector */}
            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-1 text-xs">
              {(["LEARNING", "LEARNED", "MASTERED"] as VocabularyStatus[]).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleSetStatus(status)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer uppercase ${
                    item.vocabularyStatus === status
                      ? status === "MASTERED"
                        ? "bg-emerald-500 text-white shadow-xs"
                        : status === "LEARNED"
                        ? "bg-amber-500 text-white shadow-xs"
                        : "bg-purple-600 text-white shadow-xs"
                      : "bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bengali Meaning Highlight Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50/90 via-teal-50/70 to-emerald-50/90 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-emerald-950/40 border border-emerald-500/30 flex items-center justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              বাংলা অর্থ
            </span>
            <p className="text-xl sm:text-2xl font-bold text-emerald-950 dark:text-emerald-200">
              {wordData.banglaMeaning}
            </p>
          </div>

          {wordData.banglaPronunciation && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100/80 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300/80 dark:border-emerald-700/80 text-xs font-semibold">
              <span className="text-emerald-700 dark:text-emerald-400 text-[11px]">উচ্চারণ:</span>
              <span>{wordData.banglaPronunciation}</span>
            </div>
          )}
        </div>

        {/* English Definition */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-purple-500" />
            <span>Definition</span>
          </h2>
          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {wordData.meaning}
          </p>
        </div>

        {/* Example Sentences */}
        {((wordData.exampleSentences && wordData.exampleSentences.length > 0) || (wordData as any).example) && (
          <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/70 dark:border-purple-900/50 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              <span>Example Usage</span>
            </span>
            {(wordData.exampleSentences || [(wordData as any).example]).filter(Boolean).map((ex: string, idx: number) => (
              <p key={idx} className="text-sm font-semibold text-slate-800 dark:text-slate-200 italic">
                &ldquo;{highlightPhrase(ex, wordData.word)}&rdquo;
              </p>
            ))}
            {(wordData as any).exampleBangla && (
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {(wordData as any).exampleBangla}
              </p>
            )}
          </div>
        )}
      </div>

      {/* 3. Collocations Section */}
      {wordData.collocations && wordData.collocations.length > 0 && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span>Collocations & Key Phrases</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                {wordData.collocations.length}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {wordData.collocations.map((col, idx) => {
              const text = getCollocationText(col);
              const bangla = getCollocationBangla(col, wordData);
              const example = getCollocationExample(col, wordData);
              const meaning = getCollocationMeaning(col);

              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-1.5 hover:border-purple-300 dark:hover:border-purple-700 transition-all"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-bold text-sm text-purple-700 dark:text-purple-300">
                      {text}
                    </span>
                    {bangla && (
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                        {bangla}
                      </span>
                    )}
                  </div>
                  {meaning && meaning !== bangla && (
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {meaning}
                    </p>
                  )}
                  {example && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                      {highlightPhrase(example, text)}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Verb Forms Table (if verb) */}
      {verbForms && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <GraduationCap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Conjugation & Verb Forms</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "V1 (Base / Present)", val: verbForms.v1 },
              { label: "V2 (Past Simple)", val: verbForms.v2 },
              { label: "V3 (Past Participle)", val: verbForms.v3 },
            ].map((f, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/20 text-center space-y-1"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  {f.label}
                </span>
                <p className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                  {f.val || "-"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Word Relations (Synonyms, Antonyms) */}
      {(wordData.synonyms?.length || wordData.antonyms?.length || wordData.wordFamily?.length) && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-5">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
            Word Relationships
          </h2>

          {/* Synonyms */}
          {wordData.synonyms && wordData.synonyms.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Synonyms (সমার্থক শব্দ)
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {wordData.synonyms.map((syn: any, i: number) => {
                  const synWord = getWordRelationText(syn);
                  const synBangla = getWordRelationBangla(syn);
                  return (
                    <Link
                      key={i}
                      href={`/dashboard/user/vocabulary/${encodeURIComponent(synWord.toLowerCase())}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200/80 dark:border-emerald-800/80 text-xs font-semibold transition-all hover:scale-105"
                    >
                      <span>{synWord}</span>
                      {synBangla && (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                          ({synBangla})
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Antonyms */}
          {wordData.antonyms && wordData.antonyms.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Antonyms (বিপরীতার্থক শব্দ)
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {wordData.antonyms.map((ant: any, i: number) => {
                  const antWord = getWordRelationText(ant);
                  const antBangla = getWordRelationBangla(ant);
                  return (
                    <Link
                      key={i}
                      href={`/dashboard/user/vocabulary/${encodeURIComponent(antWord.toLowerCase())}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-800 dark:text-rose-200 border border-rose-200/80 dark:border-rose-800/80 text-xs font-semibold transition-all hover:scale-105"
                    >
                      <span>{antWord}</span>
                      {antBangla && (
                        <span className="text-[10px] text-rose-600 dark:text-rose-400">
                          ({antBangla})
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
      {/* 6. Personal Study Workspace: Notes & Custom Sentences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Study Notes */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>My Study Notes</span>
              </h2>
              {notesSavedSuccess && (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in">
                  <Check className="w-3.5 h-3.5" /> Saved
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personal memory hooks, mnemonic tricks, or contextual hints for this word.
            </p>

            <textarea
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="e.g., Remembered from Chapter 3 of Atomic Habits; opposite of deliberate..."
              rows={5}
              className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/30 transition-all resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleSaveNotes}
              disabled={isSavingNotes}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-all shadow-sm shadow-purple-500/25 cursor-pointer disabled:opacity-50"
            >
              {isSavingNotes ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              <span>{isSavingNotes ? "Saving..." : "Save Notes"}</span>
            </button>
          </div>
        </div>

        {/* My Practice Sentences */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>My Practice Sentences</span>
              </h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                {item.mySentences?.length || 0}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Formulate your own real-world sentences using &ldquo;{wordData.word}&rdquo; to solidify active recall.
            </p>

            {/* List of Sentences */}
            <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
              {!item.mySentences || item.mySentences.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500 italic p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-center">
                  No practice sentences yet. Add your first sentence below!
                </p>
              ) : (
                item.mySentences.map((sentence, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70 flex items-start justify-between gap-2 text-xs"
                  >
                    <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed flex-1">
                      {highlightPhrase(sentence, wordData.word)}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleDeleteSentence(idx)}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete sentence"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Add Sentence Form */}
          <form onSubmit={handleAddSentence} className="pt-2 flex items-center gap-2">
            <input
              type="text"
              value={newSentence}
              onChange={(e) => setNewSentence(e.target.value)}
              placeholder={`Write a sentence with '${wordData.word}'...`}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/30 transition-all"
            />
            <button
              type="submit"
              disabled={isAddingSentence || !newSentence.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-all shadow-sm shadow-purple-500/25 cursor-pointer disabled:opacity-50"
            >
              {isAddingSentence ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              <span>Add</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VocabularyDetailPage;
