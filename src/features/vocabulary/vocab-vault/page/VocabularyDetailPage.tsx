"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Minimize2,
  Edit3,
  Volume2,
  Star,
  Sparkles,
  Layers,
  GraduationCap,
  MessageSquare,
  FileText,
  ExternalLink,
  Check,
  Plus,
  Trash2,
  RefreshCw,
  Search,
  Lightbulb,
  Share2,
  CheckCircle2,
  X,
  ArrowRight,
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
  getWordRelationWord,
} from "@/types";
import {
  POS_COLORS,
  highlightPhrase,
} from "../constants/vocabularyConstants";
import {
  fetchMyVocabularyByWord,
  updateMyVocabulary,
  fetchMyVocabularyDetails,
  fetchMyVocabularies,
  deleteMyVocabulary,
} from "../api/myVocabulary";
import { getLocalVault } from "../hooks/utilFn";
import {
  DeleteVocabularyModal,
  EditVocabularyModal,
} from "../components/modals";

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
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Vault list for carousel (1/12) navigation
  const [vaultList, setVaultList] = useState<MyVocabularyItem[]>([]);

  useEffect(() => {
    fetchMyVocabularies({ limit: 100 })
      .then((res) => {
        if (res && res.data && res.data.length > 0) {
          setVaultList(res.data);
        } else {
          setVaultList(getLocalVault());
        }
      })
      .catch(() => {
        setVaultList(getLocalVault());
      });
  }, []);

  const currentIndex = useMemo(() => {
    return vaultList.findIndex(
      (v) => (v.word?.word || "").trim().toLowerCase() === decodedWord
    );
  }, [vaultList, decodedWord]);

  const totalCount = vaultList.length > 0 ? vaultList.length : 1;
  const displayIndex = currentIndex !== -1 ? currentIndex + 1 : 1;

  const navigateCarousel = useCallback((direction: -1 | 1) => {
    if (vaultList.length === 0 || currentIndex === -1) return;
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < vaultList.length) {
      const nextItem = vaultList[newIndex];
      const nextWord = (nextItem.word?.word || "").trim().toLowerCase();
      if (nextWord) {
        router.push(`/dashboard/user/vocabulary/${encodeURIComponent(nextWord)}`);
      }
    }
  }, [vaultList, currentIndex, router]);

  const handleExit = useCallback(() => {
    router.push("/dashboard/user/vocabulary");
  }, [router]);

  // Keyboard shortcuts (Escape = exit to vault, Left/Right arrow = carousel)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === "Escape") {
        handleExit();
      } else if (e.key === "ArrowLeft") {
        navigateCarousel(-1);
      } else if (e.key === "ArrowRight") {
        navigateCarousel(1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigateCarousel, handleExit]);

  // Delete modal state
  const [itemToDelete, setItemToDelete] = useState<MyVocabularyItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await deleteMyVocabulary(itemToDelete.id);
      router.push("/dashboard/user/vocabulary");
    } catch (err) {
      console.error("Error deleting vocabulary:", err);
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  // Edit modal state
  const [editingItem, setEditingItem] = useState<MyVocabularyItem | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editStatus, setEditStatus] = useState<string>("LEARNING");
  const [editIsFavorite, setEditIsFavorite] = useState(false);
  const [editSentences, setEditSentences] = useState<string[]>([]);
  const [editNewSentence, setEditNewSentence] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editFeedback, setEditFeedback] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleOpenEditModal = (target: MyVocabularyItem) => {
    setEditingItem(target);
    setEditStatus(target.vocabularyStatus || "LEARNING");
    setEditIsFavorite(target.isFavorite ?? false);
    setEditNotes(target.notes || "");
    setEditSentences(Array.isArray(target.mySentences) ? target.mySentences : []);
    setEditNewSentence("");
    setEditFeedback(null);
  };

  const handleRemoveSentence = (index: number) => {
    setEditSentences((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleAddSentenceToEdit = () => {
    const s = editNewSentence.trim();
    if (!s) return;
    setEditSentences((prev) => [...prev, s]);
    setEditNewSentence("");
  };

  const handleSaveEdit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingItem) return;
    setIsSavingEdit(true);
    setEditFeedback(null);

    let finalSentences = [...editSentences];
    if (editNewSentence.trim()) {
      finalSentences.push(editNewSentence.trim());
    }

    try {
      const updated = await updateMyVocabulary(editingItem.id, {
        vocabularyStatus: editStatus as VocabularyStatus,
        isFavorite: editIsFavorite,
        notes: editNotes,
        mySentences: finalSentences,
      });
      if (updated) {
        setItem(updated);
        setEditFeedback({ text: "Vocabulary updated successfully!", type: "success" });
        setTimeout(() => {
          setEditingItem(null);
          setEditFeedback(null);
        }, 500);
      } else {
        setEditingItem(null);
      }
    } catch (err) {
      console.error("Error saving edits:", err);
      setEditFeedback({ text: "Failed to update vocabulary", type: "error" });
    } finally {
      setIsSavingEdit(false);
    }
  };


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

      // Check if full details (collocations, examples, synonyms) should be enriched
      if (data && (!data.word?.collocations?.length || !data.word?.exampleSentences?.length || !data.word?.synonyms?.length)) {
        setIsLoadingDetails(true);
        fetchMyVocabularyDetails(data)
          .then((enriched) => {
            if (enriched) {
              setItem(enriched);
            }
          })
          .catch((e) => console.warn("Error enriching details:", e))
          .finally(() => setIsLoadingDetails(false));
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

  // Render Loading Skeleton
  if (isLoading) {
    return (
      <div className="-mx-3 -mt-3 -mb-3 sm:mx-0 sm:mt-0 sm:mb-0 w-[calc(100%+1.5rem)] sm:w-full min-h-[85vh] bg-slate-50/50 dark:bg-[#0b0c15] text-slate-900 dark:text-white flex flex-col animate-pulse">
        {/* Top Bar Skeleton (Mobile Only) */}
        <div className="lg:hidden w-full px-2.5 sm:px-6 lg:px-8 py-2 sm:py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="h-7 sm:h-8 w-20 sm:w-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="h-7 sm:h-8 w-24 sm:w-36 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-7 sm:h-8 w-7 sm:w-8 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
        </div>
        {/* Main Grid Skeleton */}
        <div className="flex-1 w-full max-w-[1600px] mx-auto p-2 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6">
          <div className="lg:col-span-5 space-y-3 sm:space-y-5">
            <div className="p-3.5 sm:p-6 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-96" />
          </div>
          <div className="lg:col-span-7 space-y-3 sm:space-y-5">
            <div className="p-3.5 sm:p-6 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-64" />
            <div className="p-3.5 sm:p-6 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-48" />
          </div>
        </div>
      </div>
    );
  }

  // Render Not Found State
  if (!item) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto shadow-xs">
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
            &rdquo;.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/dashboard/user/vocabulary"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-all shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Vocabulary Vault</span>
          </Link>
          <Link
            href="/dashboard/user/practice/vocab"
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

  return (
    <div className="-mx-3 -mt-3 -mb-3 sm:mx-0 sm:mt-0 sm:mb-0 w-[calc(100%+1.5rem)] sm:w-full min-h-[90vh] bg-slate-50/60 dark:bg-[#0b0c15] text-slate-900 dark:text-white flex flex-col animate-in fade-in duration-200">
      {/* 1. Top Header Bar (Mobile Mode Only: Exit, Carousel, Actions) */}
      <div className="lg:hidden shrink-0 w-full px-2.5 sm:px-6 py-2 sm:py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-1 z-30 sticky top-16 backdrop-blur-md">
        {/* inset-inline-start: Exit to Vocab Vault */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleExit}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all cursor-pointer border border-slate-200/90 dark:border-slate-700/80 shadow-xs shrink-0"
            title="Exit to Vocabulary Vault"
          >
            <Minimize2 className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
            <span>Exit</span>
          </button>
        </div>

        {/* Center: Carousel Navigation */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => navigateCarousel(-1)}
            disabled={currentIndex <= 0}
            title="Previous Word (← Arrow key)"
            className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all cursor-pointer border border-slate-200/90 dark:border-slate-700/80 shadow-xs disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Counter: 1/12 */}
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 px-1 font-mono select-none whitespace-nowrap">
            {displayIndex}/{totalCount}
          </span>

          <button
            type="button"
            onClick={() => navigateCarousel(1)}
            disabled={currentIndex === -1 || currentIndex >= vaultList.length - 1}
            title="Next Word (→ Arrow key)"
            className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all cursor-pointer border border-slate-200/90 dark:border-slate-700/80 shadow-xs disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* inset-inline-end: Actions (Edit, Delete, Favorite, Close) */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Edit Button */}
          <button
            type="button"
            onClick={() => handleOpenEditModal(item)}
            className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-indigo-50/80 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 transition-all cursor-pointer border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs shrink-0"
            title="Update Vocabulary"
          >
            <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => setItemToDelete(item)}
            className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-rose-50/90 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-500 dark:text-rose-400 transition-all cursor-pointer border border-rose-200/80 dark:border-rose-800/60 shadow-xs shrink-0"
            title="Delete Vocabulary"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
          </button>

          {/* Favorite Toggle */}
          <button
            type="button"
            onClick={handleToggleFavorite}
            title={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
            className={`inline-flex items-center justify-center w-7 h-7 rounded-xl transition-all cursor-pointer border shadow-xs shrink-0 ${item.isFavorite
              ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
              : "bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border-slate-200/90 dark:border-slate-700/80"
              }`}
          >
            <Star
              className={`w-3.5 h-3.5 ${item.isFavorite ? "fill-amber-400 text-amber-400" : ""}`}
            />
          </button>

          {/* Close (X) Button */}
          <button
            type="button"
            onClick={handleExit}
            className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer border border-slate-200/90 dark:border-slate-700/80 shadow-xs shrink-0"
            title="Close to Vocabulary Vault (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto p-2 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6">
        {/* Left Column (Hero Card, Audio, Meaning, Word Family, Mastery) */}
        <div className="lg:col-span-5 space-y-3 sm:space-y-5">
          {/* Desktop Back Link */}
          <div className="hidden lg:flex items-center justify-between pb-1">
            <Link
              href="/dashboard/user/vocabulary"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Vocabulary Vault</span>
            </Link>
          </div>

          <div className="p-3.5 sm:p-6 lg:p-7 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5 sm:space-y-5">
            {/* inset-block-start: Word, Level, POS, Audio Button & Actions */}
            <div className="space-y-3.5">
              {/* Row 1: Badges on left, Desktop Actions on right */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${POS_COLORS[wordData.partOfSpeech]?.bg || "bg-indigo-500/10"
                      } ${POS_COLORS[wordData.partOfSpeech]?.text || "text-indigo-600 dark:text-indigo-400"
                      } ${POS_COLORS[wordData.partOfSpeech]?.border || "border-indigo-500/30"
                      }`}
                  >
                    {POS_COLORS[wordData.partOfSpeech]?.label || wordData.partOfSpeech}
                  </span>

                  {(wordData.englishLevel || wordData.cefrLevel) && (
                    <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                      CEFR {wordData.englishLevel || wordData.cefrLevel}
                    </span>
                  )}

                  {wordData.ipa && (
                    <span className="text-sm font-mono text-slate-400 dark:text-slate-500">
                      {wordData.ipa}
                    </span>
                  )}
                </div>

                {/* Desktop Actions: Edit, Delete, Favorite */}
                <div className="hidden lg:flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(item)}
                    className="p-2 rounded-xl bg-indigo-50/80 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/60 transition-colors cursor-pointer"
                    title="Update Vocabulary"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setItemToDelete(item)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-500 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800/60 transition-colors cursor-pointer"
                    title="Delete Vocabulary"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  </button>
                  <button
                    type="button"
                    onClick={handleToggleFavorite}
                    title={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      item.isFavorite
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${item.isFavorite ? "fill-amber-400 text-amber-400" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Row 2: Full Width Word Title */}
              <div className="w-full min-w-0">
                <h1
                  className={`font-bold text-slate-900 dark:text-white tracking-tight capitalize break-normal hyphens-auto leading-tight ${
                    wordData.word.length > 16
                      ? "text-xl sm:text-2xl lg:text-3xl"
                      : wordData.word.length > 11
                      ? "text-2xl sm:text-3xl lg:text-4xl"
                      : "text-3xl sm:text-4xl lg:text-5xl"
                  }`}
                >
                  {wordData.word}
                </h1>
              </div>

              {/* Row 3: Pronounce Audio Button & Bangla Pronunciation */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                {/* Natural Pronounce Button */}
                <button
                  type="button"
                  onClick={() => playPronunciation(wordData.word)}
                  className={`inline-flex items-center justify-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border shrink-0 ${isPlayingAudio
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                    : "bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                    }`}
                  title="Pronounce"
                >
                  <Volume2
                    className={`w-4 h-4 ${isPlayingAudio ? "animate-pulse" : ""}`}
                  />
                  <span>{isPlayingAudio ? "Playing..." : "Pronounce"}</span>
                </button>

                {wordData.banglaPronunciation && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/70 shadow-2xs">
                    <span className="text-[10px] sm:text-xs font-normal opacity-70">উচ্চারণ:</span>
                    <span className="font-bold">{wordData.banglaPronunciation}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Bangla Meaning Card */}
            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-slate-50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-slate-800/60 border border-emerald-200/70 dark:border-emerald-800/60 space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Bangla Meaning (বাংলা অর্থ)
                </span>
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-snug break-words">
                {wordData.banglaMeaning}
              </p>
            </div>

            {/* English Definition */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Definition
              </span>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                {wordData.meaning}
              </p>
            </div>

            {/* Verb Forms (V1, V2, V3) */}
            {(() => {
              const verbForms = wordData.verbForms || getVerbForms(wordData);
              if (!verbForms) return null;

              const formsList = [
                {
                  code: "V1",
                  label: "Base / Present",
                  banglaLabel: "মূল রূপ",
                  value: verbForms.v1,
                },
                {
                  code: "V2",
                  label: "Past Simple",
                  banglaLabel: "অতীত রূপ",
                  value: verbForms.v2,
                },
                {
                  code: "V3",
                  label: "Past Participle",
                  banglaLabel: "পুরাঘটিত রূপ",
                  value: verbForms.v3,
                },
              ];

              return (
                <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                      Verb Forms (ক্রিয়াপদের রূপ: V1, V2, V3)
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                      Conjugation
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {formsList.map((form) => (
                      <div
                        key={form.code}
                        className="p-2.5 rounded-xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 hover:border-emerald-400 dark:hover:border-emerald-500/50 hover:bg-white dark:hover:bg-slate-800 transition-all flex flex-col justify-between gap-1.5 group shadow-2xs"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/60">
                            {form.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => playPronunciation(form.value)}
                            className="p-1 rounded-md text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer"
                            title={`Pronounce "${form.value}"`}
                            aria-label={`Pronounce ${form.value}`}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white capitalize tracking-tight">
                            {form.value}
                          </p>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
                            {form.label}
                          </span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium font-bangla block">
                            {form.banglaLabel}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Word Family */}
            {wordData.wordFamily && wordData.wordFamily.length > 0 && (
              <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                    Word Family
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {wordData.wordFamily.map((wf: any, idx: number) => {
                    const wfWord = getWordRelationWord(wf);
                    const wfPos = getWordRelationPartOfSpeech(wf);
                    const wfBangla = getWordRelationBangla(wf);

                    return (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center justify-between gap-2.5 group shadow-2xs"
                      >
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white capitalize">
                              {wfWord}
                            </span>
                            {wfPos && (
                              <span
                                className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${POS_COLORS[wfPos.toUpperCase() as PartOfSpeech]?.bg || "bg-indigo-500/10"
                                  } ${POS_COLORS[wfPos.toUpperCase() as PartOfSpeech]?.text || "text-indigo-600 dark:text-indigo-400"
                                  } ${POS_COLORS[wfPos.toUpperCase() as PartOfSpeech]?.border || "border-indigo-500/20"
                                  }`}
                              >
                                {POS_COLORS[wfPos.toUpperCase() as PartOfSpeech]?.label || wfPos.toLowerCase()}
                              </span>
                            )}
                          </div>
                          {wfBangla && (
                            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 truncate flex items-center gap-1">
                              <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-normal">বাংলা:</span>
                              <span className="font-bangla">{wfBangla}</span>
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => playPronunciation(wfWord)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-slate-700/60 transition-colors cursor-pointer"
                            title={`Pronounce "${wfWord}"`}
                            aria-label={`Pronounce ${wfWord}`}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={`https://translate.google.com/?sl=en&tl=bn&text=${encodeURIComponent(
                              wfWord
                            )}&op=translate`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer"
                            title={`Google Translator`}
                            aria-label={`Google Translator for ${wfWord}`}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mastery Rating */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Mastery Level:
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleSetMastery(star)}
                    className="p-1 hover:scale-125 transition-transform cursor-pointer"
                    title={`Set mastery to ${star}`}
                  >
                    <Star
                      className={`w-4 h-4 ${star <= (item.masteryLevel || 1)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300 dark:text-slate-700"
                        }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Collocations, Synonyms/Antonyms, Examples, Notes, Sentences) */}
        <div className="lg:col-span-7 space-y-3.5 sm:space-y-5 pb-8">
          {/* AI Enrichment Header Banner */}
          {isLoadingDetails && (
            <div className="relative overflow-hidden p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 dark:from-indigo-500/15 dark:via-purple-500/15 dark:to-indigo-500/15 border border-indigo-200/80 dark:border-indigo-800/80 flex items-center justify-between gap-3 shadow-2xs backdrop-blur-xs">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-indigo-600 text-white shadow-xs shrink-0">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-indigo-100" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 sm:gap-2">
                    <span>AI Word Enrichment</span>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                  </h4>
                  <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 truncate">
                    Fetching collocations, contextual examples & word relations...
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-white/80 dark:bg-slate-800/80 text-indigo-600 dark:text-indigo-400 text-[10px] sm:text-xs font-semibold border border-indigo-100 dark:border-indigo-900/60 shrink-0 shadow-2xs">
                <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin text-indigo-500" />
                <span className="hidden sm:inline font-mono">Syncing</span>
              </div>
            </div>
          )}

          {/* Collocations & Common Phrases */}
          {wordData.collocations && wordData.collocations.length > 0 && (
            <div className="p-3.5 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>Collocations & Common Phrases</span>
                </h3>
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200/60 dark:border-slate-700/60">
                  {wordData.collocations.length} phrases
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {wordData.collocations.map((col, idx) => {
                  const colText = getCollocationText(col);
                  const meaning = getCollocationMeaning(col);
                  const rawBangla = getCollocationBangla(col, wordData);
                  const rawExample = getCollocationExample(col, wordData);

                  const bangla =
                    rawBangla ||
                    (wordData.banglaMeaning
                      ? `${wordData.banglaMeaning.split(/[,/]/)[0].trim()} সম্পর্কিত ভাবার্থ`
                      : `${colText}-এর বাংলা ভাবার্থ`);

                  const example =
                    rawExample ||
                    `Using "${colText}" helps express ideas naturally in practical English.`;

                  return (
                    <div
                      key={idx}
                      className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/90 dark:border-slate-700/70 hover:border-indigo-300 dark:hover:border-indigo-500/60 hover:bg-white dark:hover:bg-slate-800/80 transition-all shadow-2xs flex flex-col justify-between gap-3 group"
                    >
                      {/* Header: Number + Phrase + Pronounce */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5 min-w-0 flex-1">
                          <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-[10px] sm:text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                            {idx + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight break-words capitalize group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {colText}
                            </h4>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => playPronunciation(colText)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-slate-700/60 transition-colors shrink-0 cursor-pointer"
                          title={`Pronounce "${colText}"`}
                          aria-label={`Pronounce ${colText}`}
                        >
                          <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>

                      {/* Bangla Meaning Section */}
                      {bangla && (
                        <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2.5">
                          <span className="self-start inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white shrink-0 shadow-2xs">
                            বাংলা অর্থ
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-emerald-950 dark:text-emerald-100 leading-snug break-words">
                            {bangla}
                          </span>
                        </div>
                      )}

                      {/* English Meaning (if present) */}
                      {meaning && (
                        <div className="text-xs text-slate-600 dark:text-slate-300 flex items-baseline gap-1.5 leading-relaxed">
                          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0">
                            Meaning:
                          </span>
                          <span className="break-words">{meaning}</span>
                        </div>
                      )}

                      {/* Example Sentence Callout */}
                      {example && (
                        <div className="pt-2.5 border-t border-slate-200/70 dark:border-slate-700/60 space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                              <Lightbulb className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                              Example Sentence
                            </span>
                            <button
                              type="button"
                              onClick={() => playPronunciation(example)}
                              className="p-1 sm:p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-slate-700/60 transition-colors shrink-0 cursor-pointer"
                              title="Pronounce example sentence"
                              aria-label="Pronounce example sentence"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800/80 shadow-2xs">
                            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 italic leading-relaxed break-words">
                              &ldquo;{highlightPhrase(example, colText)}&rdquo;
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Synonyms & Antonyms Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
            {/* Synonyms */}
            <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5 sm:space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Synonyms
              </span>
              <div className="flex flex-wrap gap-1.5">
                {wordData.synonyms && wordData.synonyms.length > 0 ? (
                  wordData.synonyms.map((syn: any, idx: number) => {
                    const synText = getWordRelationText(syn);
                    const synBangla = getWordRelationBangla(syn);
                    return (
                      <Link
                        key={idx}
                        href={`/dashboard/user/vocabulary/${encodeURIComponent(synText.toLowerCase())}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 hover:scale-105 transition-transform"
                      >
                        <span>{synText}</span>
                        {synBangla && (
                          <span className="text-[10px] opacity-75 font-bangla">({synBangla})</span>
                        )}
                      </Link>
                    );
                  })
                ) : (
                  <span className="text-xs text-slate-400">None listed</span>
                )}
              </div>
            </div>

            {/* Antonyms */}
            <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5 sm:space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <X className="w-4 h-4 text-rose-500" />
                Antonyms
              </span>
              <div className="flex flex-wrap gap-1.5">
                {wordData.antonyms && wordData.antonyms.length > 0 ? (
                  wordData.antonyms.map((ant: any, idx: number) => {
                    const antText = getWordRelationText(ant);
                    const antBangla = getWordRelationBangla(ant);
                    return (
                      <Link
                        key={idx}
                        href={`/dashboard/user/vocabulary/${encodeURIComponent(antText.toLowerCase())}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/80 hover:scale-105 transition-transform"
                      >
                        <span>{antText}</span>
                        {antBangla && (
                          <span className="text-[10px] opacity-75 font-bangla">({antBangla})</span>
                        )}
                      </Link>
                    );
                  })
                ) : (
                  <span className="text-xs text-slate-400">None listed</span>
                )}
              </div>
            </div>
          </div>

          {/* Contextual Examples */}
          {wordData.exampleSentences && wordData.exampleSentences.length > 0 && (
            <div className="p-3.5 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5 sm:space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                Contextual Examples
              </h3>
              <div className="space-y-2">
                {wordData.exampleSentences.map((sent, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed flex items-start justify-between gap-2.5 sm:gap-3"
                  >
                    <span className="flex-1 break-words">&ldquo;{sent}&rdquo;</span>
                    <button
                      type="button"
                      onClick={() => playPronunciation(sent)}
                      className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors shrink-0 cursor-pointer"
                      title="Pronounce sentence"
                      aria-label="Pronounce sentence"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Personal Study Notes */}
          <div className="p-3.5 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-500" />
                <span>Personal Study Notes</span>
              </h3>
              {notesSavedSuccess && (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in">
                  <Check className="w-3.5 h-3.5" /> Saved!
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personal memory hooks, mnemonic tricks, or contextual hints for this word.
            </p>
            <div className="space-y-3">
              <textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="e.g., Remembered from Chapter 3 of Atomic Habits; opposite of deliberate..."
                rows={3}
                className="w-full p-2.5 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                  className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isSavingNotes ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>Save Notes</span>
                </button>
              </div>
            </div>
          </div>

          {/* My Practice Sentences */}
          <div className="p-3.5 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-500" />
                <span>My Practice Sentences</span>
              </h3>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200/60 dark:border-slate-700/60">
                {item.mySentences?.length || 0}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Formulate your own real-world sentences using &ldquo;{wordData.word}&rdquo; to solidify active recall.
            </p>

            <form onSubmit={handleAddSentence} className="flex gap-2">
              <input
                type="text"
                value={newSentence}
                onChange={(e) => setNewSentence(e.target.value)}
                placeholder={`Write a sentence with '${wordData.word}'...`}
                className="min-w-0 flex-1 px-3 sm:px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all"
              />
              <button
                type="submit"
                disabled={isAddingSentence || !newSentence.trim()}
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>

            {item.mySentences && item.mySentences.length > 0 && (
              <div className="space-y-2 pt-2">
                {item.mySentences.map((sentence, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 sm:p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 flex items-start justify-between gap-2.5 sm:gap-3 group"
                  >
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic flex-1 break-words">
                      &ldquo;{sentence}&rdquo;
                    </p>
                    <button
                      type="button"
                      onClick={() => handleDeleteSentence(idx)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer shrink-0"
                      title="Delete sentence"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Vocabulary Modal */}
      <EditVocabularyModal
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        isSavingEdit={isSavingEdit}
        handleSaveEdit={handleSaveEdit}
        editStatus={editStatus}
        setEditStatus={setEditStatus}
        editIsFavorite={editIsFavorite}
        setEditIsFavorite={setEditIsFavorite}
        editSentences={editSentences}
        handleRemoveSentence={handleRemoveSentence}
        editNewSentence={editNewSentence}
        setEditNewSentence={setEditNewSentence}
        handleAddSentenceToEdit={handleAddSentenceToEdit}
        editNotes={editNotes}
        setEditNotes={setEditNotes}
        editFeedback={editFeedback}
      />

      {/* Delete Vocabulary Modal */}
      <DeleteVocabularyModal
        itemToDelete={itemToDelete}
        setItemToDelete={setItemToDelete}
        isDeleting={isDeleting}
        handleConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
}

export default VocabularyDetailPage;

