"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { ThemeToggle } from "@/components/shared";
import {
  MyVocabularyItem,
  VocabularyItem,
  PartOfSpeech,
  VocabularyStatus,
  VocabularyFilterOptions,
  getWordRelationText,
  getWordRelationWord,
} from "@/types/vocabulary";
import {
  fetchMyVocabularies,
  addSingleVocabulary,
  addVocabularyWithAi,
  updateMyVocabulary,
  deleteMyVocabulary,
} from "@/lib/api/vocabulary";
import {
  Sparkles,
  Plus,
  Search,
  Volume2,
  VolumeX,
  Bookmark,
  BookmarkCheck,
  Star,
  Trash2,
  Edit3,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Layers,
  Zap,
  Filter,
  RefreshCw,
  Share2,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Maximize2,
  Minimize2,
  GraduationCap,
  MessageSquare,
  FileText,
  Keyboard,
  LayoutGrid,
  Table,
} from "lucide-react";

const POS_COLORS: Record<
  PartOfSpeech,
  { bg: string; text: string; border: string; label: string }
> = {
  NOUN: {
    bg: "bg-blue-500/10 dark:bg-blue-500/20",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/30",
    label: "Noun",
  },
  VERB: {
    bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/30",
    label: "Verb",
  },
  ADJECTIVE: {
    bg: "bg-purple-500/10 dark:bg-purple-500/20",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-500/30",
    label: "Adjective",
  },
  ADVERB: {
    bg: "bg-amber-500/10 dark:bg-amber-500/20",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/30",
    label: "Adverb",
  },
  PREPOSITION: {
    bg: "bg-cyan-500/10 dark:bg-cyan-500/20",
    text: "text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-500/30",
    label: "Preposition",
  },
  CONJUNCTION: {
    bg: "bg-pink-500/10 dark:bg-pink-500/20",
    text: "text-pink-600 dark:text-pink-400",
    border: "border-pink-500/30",
    label: "Conjunction",
  },
  PRONOUN: {
    bg: "bg-indigo-500/10 dark:bg-indigo-500/20",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-500/30",
    label: "Pronoun",
  },
  INTERJECTION: {
    bg: "bg-rose-500/10 dark:bg-rose-500/20",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-500/30",
    label: "Interjection",
  },
  DETERMINER: {
    bg: "bg-teal-500/10 dark:bg-teal-500/20",
    text: "text-teal-600 dark:text-teal-400",
    border: "border-teal-500/30",
    label: "Determiner",
  },
  NUMERAL: {
    bg: "bg-orange-500/10 dark:bg-orange-500/20",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-500/30",
    label: "Numeral",
  },
  PARTICLE: {
    bg: "bg-slate-500/10 dark:bg-slate-500/20",
    text: "text-slate-600 dark:text-slate-400",
    border: "border-slate-500/30",
    label: "Particle",
  },
};

const ALL_POS_OPTIONS: PartOfSpeech[] = [
  "NOUN",
  "VERB",
  "ADJECTIVE",
  "ADVERB",
  "PREPOSITION",
  "CONJUNCTION",
  "PRONOUN",
  "INTERJECTION",
  "DETERMINER",
  "NUMERAL",
  "PARTICLE",
];

export default function VocabularyPage() {
  const [vocabularies, setVocabularies] = useState<MyVocabularyItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPos, setSelectedPos] = useState<PartOfSpeech | "ALL">("ALL");
  const [selectedSort, setSelectedSort] = useState<"recent" | "alphabetical" | "mastery">("recent");
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [playingWord, setPlayingWord] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Fullscreen Single Vocab View State
  const [fullscreenVocabId, setFullscreenVocabId] = useState<string | null>(null);

  // Modal State (Single Word Focused)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [inputWordText, setInputWordText] = useState<string>("");
  const [userNote, setUserNote] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Expanded card details tracker
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  // Editing notes tracker
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null);

  // New sentence builder tracker
  const [newSentenceInputs, setNewSentenceInputs] = useState<Record<string, string>>({});

  // Update/Edit Modal State
  const [editingItem, setEditingItem] = useState<MyVocabularyItem | null>(null);
  const [editNotes, setEditNotes] = useState<string>("");
  const [editSentences, setEditSentences] = useState<string[]>([]);
  const [editNewSentence, setEditNewSentence] = useState<string>("");
  const [editMastery, setEditMastery] = useState<number>(60);
  const [editStatus, setEditStatus] = useState<string>("LEARNED");
  const [editIsFavorite, setEditIsFavorite] = useState<boolean>(false);
  const [isSavingEdit, setIsSavingEdit] = useState<boolean>(false);
  const [editFeedback, setEditFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    loadVocabularies();
  }, [searchQuery, selectedPos, selectedSort, favoritesOnly]);

  // Handle Fullscreen Scroll Lock & Keyboard Navigation
  useEffect(() => {
    if (fullscreenVocabId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!fullscreenVocabId) return;

      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        if (e.key === "Escape") {
          target.blur();
        }
        return;
      }

      if (e.key === "Escape") {
        setFullscreenVocabId(null);
      } else if (e.key === "ArrowLeft") {
        navigateFullscreen(-1);
      } else if (e.key === "ArrowRight") {
        navigateFullscreen(1);
      } else if (e.key === " " || e.key === "p" || e.key === "P") {
        e.preventDefault();
        const currentItem = vocabularies.find((v) => v.id === fullscreenVocabId);
        if (currentItem) {
          playPronunciation(currentItem.word.word);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [fullscreenVocabId, vocabularies]);

  const loadVocabularies = async () => {
    setIsLoading(true);
    try {
      const items = await fetchMyVocabularies({
        search: searchQuery,
        partOfSpeech: selectedPos,
        sortBy: selectedSort,
        favoritesOnly,
      });
      setVocabularies(items);
    } catch (err) {
      console.error("Failed to load vocabularies", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Pronounce word using Web Speech API
  const playPronunciation = (word: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    setPlayingWord(word);
    utterance.onend = () => setPlayingWord(null);
    utterance.onerror = () => setPlayingWord(null);

    window.speechSynthesis.speak(utterance);
  };

  // Toggle favorite (supporting both isFavourate and isFavorite)
  const handleToggleFavorite = async (item: MyVocabularyItem) => {
    const isCurrentlyFav = item.isFavorite || item.isFavourate || false;
    const updatedFav = !isCurrentlyFav;
    setVocabularies((prev) =>
      prev.map((v) =>
        v.id === item.id
          ? { ...v, isFavorite: updatedFav, isFavourate: updatedFav }
          : v
      )
    );
    try {
      await updateMyVocabulary(item.id, {
        isFavorite: updatedFav,
        isFavourate: updatedFav,
      });
    } catch (err) {
      console.warn("Could not sync favorite toggle", err);
    }
  };

  // Toggle status (LEARNING / MASTERED / REVIEWING)
  const handleSetStatus = async (item: MyVocabularyItem, status: VocabularyStatus) => {
    setVocabularies((prev) =>
      prev.map((v) => (v.id === item.id ? { ...v, status } : v))
    );
    try {
      await updateMyVocabulary(item.id, { status });
    } catch (err) {
      console.warn("Could not sync status update", err);
    }
  };

  // Rate mastery (1-5)
  const handleSetMastery = async (item: MyVocabularyItem, level: number) => {
    setVocabularies((prev) =>
      prev.map((v) => (v.id === item.id ? { ...v, masteryLevel: level } : v))
    );
    try {
      await updateMyVocabulary(item.id, { masteryLevel: level });
    } catch (err) {
      console.warn("Could not sync mastery update", err);
    }
  };

  // Delete word
  const handleDeleteWord = async (id: string, word: string) => {
    if (!confirm(`Are you sure you want to remove '${word}' from your vocabulary vault?`)) return;
    if (fullscreenVocabId === id) {
      setFullscreenVocabId(null);
    }
    setVocabularies((prev) => prev.filter((v) => v.id !== id));
    try {
      await deleteMyVocabulary(id);
    } catch (err) {
      console.warn("Could not sync deletion", err);
    }
  };

  // Add Practice Sentence
  const handleAddSentence = async (item: MyVocabularyItem) => {
    const sentence = (newSentenceInputs[item.id] || "").trim();
    if (!sentence) return;

    const updatedSentences = [...(item.mySentences || []), sentence];
    setVocabularies((prev) =>
      prev.map((v) => (v.id === item.id ? { ...v, mySentences: updatedSentences } : v))
    );
    setNewSentenceInputs((prev) => ({ ...prev, [item.id]: "" }));

    try {
      await updateMyVocabulary(item.id, { mySentences: updatedSentences });
    } catch (err) {
      console.warn("Could not sync sentence addition", err);
    }
  };

  // Save Notes
  const handleSaveNotes = async (item: MyVocabularyItem) => {
    const noteText = editingNotes[item.id] ?? item.notes ?? "";
    setSavingNoteId(item.id);
    try {
      await updateMyVocabulary(item.id, { notes: noteText });
      setVocabularies((prev) =>
        prev.map((v) => (v.id === item.id ? { ...v, notes: noteText } : v))
      );
    } finally {
      setSavingNoteId(null);
    }
  };

  // Toggle card expanded
  const toggleCardExpand = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Fullscreen Navigation (Prev / Next)
  const navigateFullscreen = (direction: -1 | 1) => {
    if (!fullscreenVocabId || vocabularies.length === 0) return;
    const currentIndex = vocabularies.findIndex((v) => v.id === fullscreenVocabId);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) nextIndex = vocabularies.length - 1;
    if (nextIndex >= vocabularies.length) nextIndex = 0;

    setFullscreenVocabId(vocabularies[nextIndex].id);
  };

  // Execute Single Word AI generation & addition
  const handleExecuteAddSingleWord = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const targetWord = inputWordText.trim();
    if (!targetWord) {
      setFeedbackMessage({
        type: "error",
        text: "Please enter a vocabulary word to generate with AI.",
      });
      return;
    }

    setIsGenerating(true);
    setFeedbackMessage(null);

    try {
      const response = await addSingleVocabulary({
        word: targetWord,
        notes: userNote.trim() || undefined,
      });

      setFeedbackMessage({
        type: "success",
        text: response.message || `Successfully generated '${response.item.word.word}' with AI!`,
      });

      // Reload list
      await loadVocabularies();

      // Reset modal inputs after brief delay
      setTimeout(() => {
        setInputWordText("");
        setUserNote("");
        setIsModalOpen(false);
        setIsGenerating(false);
        setFeedbackMessage(null);
      }, 1200);
    } catch (err: any) {
      setIsGenerating(false);
      setFeedbackMessage({
        type: "error",
        text: err.message || "Failed to generate vocabulary with AI. Please try again.",
      });
    }
  };

  // Open Update Modal
  const handleOpenEditModal = (item: MyVocabularyItem) => {
    setEditingItem(item);
    setEditNotes(item.notes || "");
    setEditSentences(item.mySentences ? [...item.mySentences] : []);
    setEditNewSentence("");
    setEditMastery(
      item.masteryLevel !== undefined
        ? item.masteryLevel > 5
          ? item.masteryLevel
          : item.masteryLevel * 20
        : 60
    );
    setEditStatus(item.status === "MASTERED" ? "LEARNED" : item.status || "LEARNED");
    setEditIsFavorite(item.isFavorite || item.isFavourate || false);
    setEditFeedback(null);
  };

  // Remove sentence from edit modal list
  const handleRemoveSentence = (index: number) => {
    setEditSentences((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Add new sentence in edit modal list
  const handleAddSentenceToEdit = () => {
    const s = editNewSentence.trim();
    if (!s) return;
    setEditSentences((prev) => [...prev, s]);
    setEditNewSentence("");
  };

  // Save changes from Update Modal (calls PATCH /api/v1/my-vocabularies/:id/update)
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
      await updateMyVocabulary(editingItem.id, {
        notes: editNotes.trim() || null,
        mySentences: finalSentences,
        masteryLevel: editMastery,
        vocabularyStatus: editStatus,
        status: editStatus as any,
        isFavourate: editIsFavorite,
        isFavorite: editIsFavorite,
      });

      setVocabularies((prev) =>
        prev.map((v) =>
          v.id === editingItem.id
            ? {
                ...v,
                notes: editNotes.trim() || null,
                mySentences: finalSentences,
                masteryLevel: Math.round(editMastery / 20) || 1,
                status: editStatus as any,
                isFavourate: editIsFavorite,
                isFavorite: editIsFavorite,
              }
            : v
        )
      );

      setEditFeedback({
        type: "success",
        text: `Updated '${editingItem.word.word}' successfully!`,
      });

      setTimeout(() => {
        setIsSavingEdit(false);
        setEditingItem(null);
        setEditFeedback(null);
      }, 700);
    } catch (err: any) {
      setIsSavingEdit(false);
      setEditFeedback({
        type: "error",
        text: err.message || "Failed to update vocabulary. Please try again.",
      });
    }
  };

  // Metrics computation
  const stats = useMemo(() => {
    const total = vocabularies.length;
    const favorites = vocabularies.filter((v) => v.isFavorite || v.isFavourate).length;
    const posCounts: Partial<Record<PartOfSpeech, number>> = {};
    let masteredCount = 0;

    vocabularies.forEach((v) => {
      const pos = v.word.partOfSpeech;
      posCounts[pos] = (posCounts[pos] || 0) + 1;
      if ((v.masteryLevel || 0) >= 4 || v.status === "MASTERED") masteredCount++;
    });

    return { total, favorites, posCounts, masteredCount };
  }, [vocabularies]);

  // Active fullscreen vocabulary object & index
  const activeFullscreenVocab = useMemo(() => {
    if (!fullscreenVocabId) return null;
    return vocabularies.find((v) => v.id === fullscreenVocabId) || null;
  }, [fullscreenVocabId, vocabularies]);

  const activeFullscreenIndex = useMemo(() => {
    if (!fullscreenVocabId) return -1;
    return vocabularies.findIndex((v) => v.id === fullscreenVocabId);
  }, [fullscreenVocabId, vocabularies]);

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header Banner & Action (Soft theme matching Dashboard) */}
      <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-purple-600/15 via-primary/10 to-fuchsia-600/15 dark:from-[#0F0C20] dark:via-[#181236] dark:to-[#0F0C20] border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-2xl relative overflow-hidden text-ink">
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl -z-0" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 dark:bg-purple-500/20 border border-primary/20 dark:border-purple-500/30 text-primary dark:text-purple-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
              <span>AI-Powered Lexicon Vault</span>
            </div>
            <h1 className="font-brand text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight">
              Vocabulary Vault 📚
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-ink-soft leading-relaxed">
              Expand your active vocabulary with instant AI linguistic insights, Bengali definitions,
              collocations, synonyms, CEFR levels, and personal sentence building.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-primary to-fuchsia-600 hover:from-purple-500 hover:via-primary-dark hover:to-fuchsia-500 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-purple-500/25 hover:shadow-lg hover:shadow-purple-500/40 dark:shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:scale-[1.02] active:scale-95 text-center cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Vocabulary</span>
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
            </button>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 bg-white/70 dark:bg-white/5 rounded-2xl p-3.5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary dark:text-purple-300 flex items-center justify-center border border-primary/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-ink-soft font-medium">Total Words</p>
              <p className="text-xl font-bold text-ink">{stats.total}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/70 dark:bg-white/5 rounded-2xl p-3.5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-ink-soft font-medium">Favorites</p>
              <p className="text-xl font-bold text-ink">{stats.favorites}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/70 dark:bg-white/5 rounded-2xl p-3.5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-ink-soft font-medium">Mastered (4★+)</p>
              <p className="text-xl font-bold text-ink">{stats.masteredCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/70 dark:bg-white/5 rounded-2xl p-3.5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-300 flex items-center justify-center border border-purple-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-ink-soft font-medium">Parts of Speech</p>
              <p className="text-xl font-bold text-ink">
                {Object.keys(stats.posCounts).length} Types
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Search, Filter & Controls */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search words, English definitions, Bengali meanings, or synonyms..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort & Quick Filter Toggles */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              className={`inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold border transition-all cursor-pointer ${
                favoritesOnly
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 shadow-sm"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300"
              }`}
            >
              <Star
                className={`w-4 h-4 ${
                  favoritesOnly ? "fill-amber-400 text-amber-400" : "text-slate-400"
                }`}
              />
              <span>Favorites</span>
            </button>

            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as any)}
              className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer"
            >
              <option value="recent">Recently Added</option>
              <option value="alphabetical">Alphabetical (A - Z)</option>
              <option value="mastery">Mastery Level</option>
            </select>

            <button
              onClick={loadVocabularies}
              title="Refresh vocabulary"
              className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-sm cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>

            {/* View Mode Toggle (Grid vs Table) */}
            <div className="flex items-center p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <button
                onClick={() => setViewMode("grid")}
                title="Grid View"
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                title="Table View (Compact)"
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                <Table className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Part of Speech Pill Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedPos("ALL")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedPos === "ALL"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md"
                : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            All Words ({stats.total})
          </button>

          {ALL_POS_OPTIONS.map((pos) => {
            const count = stats.posCounts[pos] || 0;
            const config = POS_COLORS[pos];
            const isSelected = selectedPos === pos;
            return (
              <button
                key={pos}
                onClick={() => setSelectedPos(pos)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  isSelected
                    ? `${config.bg} ${config.text} ${config.border} ring-2 ring-indigo-500/20 shadow-sm`
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                }`}
              >
                <span>{config.label}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Vocabulary Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-64 rounded-3xl bg-slate-100 dark:bg-slate-800/50 animate-pulse border border-slate-200 dark:border-slate-800"
            />
          ))}
        </div>
      ) : vocabularies.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              No Vocabulary Found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
              {searchQuery || selectedPos !== "ALL" || favoritesOnly
                ? "No words matched your current search or filter criteria. Try resetting filters."
                : "You haven't added any words to your vault yet. Add a word to generate with AI!"}
            </p>
          </div>
          <button
            onClick={() => {
              if (searchQuery || selectedPos !== "ALL" || favoritesOnly) {
                setSearchQuery("");
                setSelectedPos("ALL");
                setFavoritesOnly(false);
              } else {
                setIsModalOpen(true);
              }
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md transition-colors cursor-pointer"
          >
            {searchQuery || selectedPos !== "ALL" || favoritesOnly ? (
              <>
                <RefreshCw className="w-4 h-4" />
                Reset Filters
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Your First Word
              </>
            )}
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vocabularies.map((item) => {
            const isExpanded = !!expandedCards[item.id];
            const posConfig = POS_COLORS[item.word.partOfSpeech] || POS_COLORS.NOUN;
            const isAudioPlaying = playingWord === item.word.word;
            const isFav = item.isFavorite || item.isFavourate;
            const displayLevel = item.word.englishLevel || item.word.cefrLevel;

            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-3xl bg-white dark:bg-[#141226] border border-slate-200/90 dark:border-white/10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_36px_-6px_rgba(0,0,0,0.12)] hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all duration-300 overflow-hidden hover:-translate-y-0.5"
              >
                {/* Top Accent Strip by Part of Speech */}
                <div
                  className={`h-1 w-full bg-gradient-to-r ${
                    item.word.partOfSpeech === "NOUN"
                      ? "from-blue-500 to-indigo-500"
                      : item.word.partOfSpeech === "VERB"
                      ? "from-emerald-500 to-teal-500"
                      : item.word.partOfSpeech === "ADJECTIVE"
                      ? "from-purple-500 to-pink-500"
                      : item.word.partOfSpeech === "ADVERB"
                      ? "from-amber-500 to-orange-500"
                      : "from-indigo-500 to-purple-500"
                  }`}
                />

                {/* Main Card Content */}
                <div className="p-6 space-y-4">
                  {/* Header: Word Name, Audio, Badges, & Actions */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <button
                          onClick={() => setFullscreenVocabId(item.id)}
                          className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left cursor-pointer capitalize"
                        >
                          {item.word.word}
                        </button>

                        {/* Pronunciation Audio Button */}
                        <button
                          onClick={() => playPronunciation(item.word.word)}
                          title="Listen pronunciation"
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
                            isAudioPlaying
                              ? "bg-indigo-600 text-white border-indigo-600 scale-105 shadow-sm shadow-indigo-500/40"
                              : "bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-800/80"
                          }`}
                        >
                          <Volume2 className={`w-3.5 h-3.5 ${isAudioPlaying ? "animate-pulse" : ""}`} />
                        </button>

                        {/* Phonetic IPA */}
                        {item.word.ipa && (
                          <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                            {item.word.ipa}
                          </span>
                        )}
                      </div>

                      {/* Part of Speech & CEFR Badges */}
                      <div className="flex items-center gap-2 pt-0.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${posConfig.bg} ${posConfig.text} ${posConfig.border}`}
                        >
                          {posConfig.label}
                        </span>

                        {displayLevel && (
                          <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            CEFR {displayLevel}
                          </span>
                        )}

                        {item.status && item.status !== "LEARNING" && (
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                            {item.status}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick Action Buttons: Update, Favorite, Delete */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        title="Update vocabulary"
                        className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleToggleFavorite(item)}
                        title={isFav ? "Remove from favorites" : "Add to favorites"}
                        className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                          isFav
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <Star
                          className={`w-4 h-4 ${isFav ? "fill-amber-400 text-amber-400" : ""}`}
                        />
                      </button>

                      <button
                        onClick={() => handleDeleteWord(item.id, item.word.word)}
                        title="Delete word"
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Bangla Meaning Card */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/8 via-teal-500/5 to-slate-50 dark:from-emerald-950/30 dark:via-slate-900/60 dark:to-slate-900 border border-emerald-500/20 dark:border-emerald-500/30 space-y-1">
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                      Bangla Meaning (বাংলা অর্থ)
                    </span>
                    <p className="text-base sm:text-lg font-bold text-emerald-950 dark:text-emerald-200 leading-snug">
                      {item.word.banglaMeaning}
                    </p>
                  </div>

                  {/* English Definition */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Definition
                    </span>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                      {item.word.meaning}
                    </p>
                  </div>

                  {/* Collocations Chips */}
                  {item.word.collocations && item.word.collocations.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Collocations & Phrases
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.word.collocations.slice(0, 4).map((col, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80"
                          >
                            <span className="text-indigo-500 text-[10px]">●</span>
                            {col}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Synonyms & Antonyms Shelves */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {/* Synonyms */}
                    <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/80 space-y-1.5">
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                        Synonyms
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {item.word.synonyms && item.word.synonyms.length > 0 ? (
                          item.word.synonyms.slice(0, 3).map((syn: any, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/70"
                            >
                              {getWordRelationWord(syn)}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-slate-400">—</span>
                        )}
                      </div>
                    </div>

                    {/* Antonyms */}
                    <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/80 space-y-1.5">
                      <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
                        Antonyms
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {item.word.antonyms && item.word.antonyms.length > 0 ? (
                          item.word.antonyms.slice(0, 3).map((ant: any, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-300 border border-rose-200/70 dark:border-rose-800/70"
                            >
                              {getWordRelationWord(ant)}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-slate-400">—</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Section: Examples, Word Family, Practice Sentences, Notes */}
                  {isExpanded && (
                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-in fade-in duration-200">
                      {/* Contextual Examples */}
                      {item.word.exampleSentences && item.word.exampleSentences.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                            Contextual Examples
                          </span>
                          <div className="space-y-1.5">
                            {item.word.exampleSentences.map((sent, idx) => (
                              <div
                                key={idx}
                                className="border-l-2 border-indigo-500 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-r-xl text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed"
                              >
                                &ldquo;{sent}&rdquo;
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Word Family */}
                      {item.word.wordFamily && item.word.wordFamily.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                            Word Family
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {item.word.wordFamily.map((wf: any, idx: number) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80"
                              >
                                {getWordRelationText(wf)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* User's Practice Sentences */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                          My Practice Sentences ({item.mySentences?.length || 0})
                        </span>
                        {item.mySentences && item.mySentences.length > 0 && (
                          <div className="space-y-1.5">
                            {item.mySentences.map((s, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2 p-2.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/60 text-xs text-slate-800 dark:text-slate-200"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0" />
                                <span>{s}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Write your own sentence using this word..."
                            value={newSentenceInputs[item.id] || ""}
                            onChange={(e) =>
                              setNewSentenceInputs((prev) => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddSentence(item);
                              }
                            }}
                            className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                          <button
                            onClick={() => handleAddSentence(item)}
                            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                          >
                            Save
                          </button>
                        </div>
                      </div>

                      {/* Personal Study Notes */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-indigo-500" />
                            Study Notes
                          </span>
                          {editingNotes[item.id] !== undefined &&
                            editingNotes[item.id] !== item.notes && (
                              <button
                                onClick={() => handleSaveNotes(item)}
                                disabled={savingNoteId === item.id}
                                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                              >
                                {savingNoteId === item.id ? "Saving..." : "Save Note"}
                              </button>
                            )}
                        </div>
                        <textarea
                          rows={2}
                          placeholder="Add your mnemonics, exam tips, or usage context..."
                          value={
                            editingNotes[item.id] !== undefined
                              ? editingNotes[item.id]
                              : item.notes || ""
                          }
                          onChange={(e) =>
                            setEditingNotes((prev) => ({
                              ...prev,
                              [item.id]: e.target.value,
                            }))
                          }
                          className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer with Mastery Stars, Update & Full View Details Button */}
                <div className="px-6 py-3.5 bg-slate-50/90 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  {/* Mastery Rating */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-slate-400">Mastery:</span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleSetMastery(item, star)}
                          title={`Set mastery to ${star} stars`}
                          className="p-0.5 hover:scale-125 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              star <= (item.masteryLevel || 1)
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300 dark:text-slate-600"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions: Update, Full View Details & Toggle Accordion */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                      title="Update vocabulary"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Update</span>
                    </button>

                    <button
                      onClick={() => setFullscreenVocabId(item.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Full Details</span>
                    </button>

                    <button
                      onClick={() => toggleCardExpand(item.id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                      title={isExpanded ? "Collapse inline view" : "Expand inline view"}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View Mode (Clean, Compact & Fit) */
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3 px-4 sm:px-6">Word</th>
                  <th className="py-3 px-3">Type & Level</th>
                  <th className="py-3 px-4">Bangla Meaning</th>
                  <th className="py-3 px-4 hidden md:table-cell">Definition</th>
                  <th className="py-3 px-3 hidden lg:table-cell">Key Synonyms</th>
                  <th className="py-3 px-3 hidden sm:table-cell">Mastery</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-sm">
                {vocabularies.map((item) => {
                  const posConfig = POS_COLORS[item.word.partOfSpeech] || POS_COLORS.NOUN;
                  const isAudioPlaying = playingWord === item.word.word;
                  const isFav = item.isFavorite || item.isFavourate;
                  const displayLevel = item.word.englishLevel || item.word.cefrLevel;

                  return (
                    <tr
                      key={item.id}
                      className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Word & Pronunciation */}
                      <td className="py-3 px-4 sm:px-6 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setFullscreenVocabId(item.id)}
                            className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer capitalize text-sm"
                          >
                            {item.word.word}
                          </button>
                          <button
                            onClick={() => playPronunciation(item.word.word)}
                            title="Listen pronunciation"
                            className={`p-1 rounded-lg transition-colors cursor-pointer ${
                              isAudioPlaying
                                ? "bg-indigo-600 text-white"
                                : "text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`}
                          >
                            <Volume2
                              className={`w-3.5 h-3.5 ${isAudioPlaying ? "animate-pulse" : ""}`}
                            />
                          </button>
                          {item.word.ipa && (
                            <span className="hidden xl:inline text-xs font-mono text-slate-400 dark:text-slate-500">
                              {item.word.ipa}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Type & Level */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${posConfig.bg} ${posConfig.text} ${posConfig.border}`}
                          >
                            {posConfig.label}
                          </span>
                          {displayLevel && (
                            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                              {displayLevel}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Bangla Meaning */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-medium text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                          {item.word.banglaMeaning}
                        </span>
                      </td>

                      {/* Definition */}
                      <td className="py-3 px-4 hidden md:table-cell max-w-xs">
                        <p
                          className="truncate text-xs text-slate-600 dark:text-slate-300"
                          title={item.word.meaning}
                        >
                          {item.word.meaning}
                        </p>
                      </td>

                      {/* Key Synonyms */}
                      <td className="py-3 px-3 hidden lg:table-cell">
                        <div className="flex items-center gap-1 flex-wrap">
                          {item.word.synonyms && item.word.synonyms.length > 0 ? (
                            item.word.synonyms.slice(0, 2).map((syn: any, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/70"
                              >
                                {getWordRelationWord(syn)}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </div>
                      </td>

                      {/* Mastery */}
                      <td className="py-3 px-3 hidden sm:table-cell whitespace-nowrap">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleSetMastery(item, star)}
                              title={`Set mastery to ${star} stars`}
                              className="p-0.5 hover:scale-125 transition-transform cursor-pointer"
                            >
                              <Star
                                className={`w-3.5 h-3.5 ${
                                  star <= (item.masteryLevel || 1)
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-slate-200 dark:text-slate-700"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleToggleFavorite(item)}
                            title={isFav ? "Remove from favorites" : "Add to favorites"}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isFav
                                ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`}
                          >
                            <Star
                              className={`w-3.5 h-3.5 ${isFav ? "fill-amber-400 text-amber-400" : ""}`}
                            />
                          </button>

                          <button
                            onClick={() => setFullscreenVocabId(item.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 transition-colors cursor-pointer"
                            title="Open full details"
                          >
                            <Maximize2 className="w-3 h-3" />
                            <span className="hidden xl:inline">Details</span>
                          </button>

                          <button
                            onClick={() => handleDeleteWord(item.id, item.word.word)}
                            title="Delete word"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Fullscreen Single Vocabulary Portal View (Natural, Clean, Theme-Aware & Scrollable) */}
      {isMounted &&
        activeFullscreenVocab &&
        createPortal(
          <div className="fixed inset-0 z-[99999] w-screen h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col overflow-hidden animate-in fade-in duration-200">
            {/* Top Bar */}
            <div className="shrink-0 w-full px-5 sm:px-8 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 z-30">
              {/* Left: Exit Fullscreen & Counter */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFullscreenVocabId(null)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Exit</span>
                </button>

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">
                    Word {activeFullscreenIndex + 1} of {vocabularies.length}
                  </span>
                </div>
              </div>

              {/* Center: Carousel Navigation */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => navigateFullscreen(-1)}
                  title="Previous Word (← Arrow key)"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Prev</span>
                </button>

                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-2 font-mono">
                  {activeFullscreenIndex + 1} / {vocabularies.length}
                </span>

                <button
                  onClick={() => navigateFullscreen(1)}
                  title="Next Word (→ Arrow key)"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Right: Status Switcher, Theme Toggle, Favorite & Close */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Status Switcher */}
                <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                  {(["LEARNING", "REVIEWING", "MASTERED"] as VocabularyStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleSetStatus(activeFullscreenVocab, st)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        (activeFullscreenVocab.status || "LEARNING") === st
                          ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Favorite Toggle */}
                <button
                  onClick={() => handleToggleFavorite(activeFullscreenVocab)}
                  title={
                    activeFullscreenVocab.isFavorite || activeFullscreenVocab.isFavourate
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                  className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                    activeFullscreenVocab.isFavorite || activeFullscreenVocab.isFavourate
                      ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <Star
                    className={`w-4 h-4 ${
                      activeFullscreenVocab.isFavorite || activeFullscreenVocab.isFavourate
                        ? "fill-amber-400 text-amber-400"
                        : ""
                    }`}
                  />
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setFullscreenVocabId(null)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                  title="Close (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Content Area (Two Columns with Independent Scroll) */}
            <div className="flex-1 w-full min-h-0 overflow-y-auto lg:overflow-hidden p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 z-10">
              {/* Left Column (Hero Card, Audio, Meaning, Word Family, Mastery) */}
              <div className="lg:col-span-5 min-h-0 h-full overflow-y-auto pr-0 lg:pr-2 space-y-5 pb-8">
                <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                  {/* Top: Word, Level, POS, Audio Button */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${
                          POS_COLORS[activeFullscreenVocab.word.partOfSpeech]?.bg || "bg-indigo-500/10"
                        } ${
                          POS_COLORS[activeFullscreenVocab.word.partOfSpeech]?.text || "text-indigo-600 dark:text-indigo-400"
                        } ${
                          POS_COLORS[activeFullscreenVocab.word.partOfSpeech]?.border || "border-indigo-500/30"
                        }`}
                      >
                        {POS_COLORS[activeFullscreenVocab.word.partOfSpeech]?.label ||
                          activeFullscreenVocab.word.partOfSpeech}
                      </span>

                      {(activeFullscreenVocab.word.englishLevel || activeFullscreenVocab.word.cefrLevel) && (
                        <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                          CEFR {activeFullscreenVocab.word.englishLevel || activeFullscreenVocab.word.cefrLevel}
                        </span>
                      )}

                      {activeFullscreenVocab.word.ipa && (
                        <span className="text-sm font-mono text-slate-400 dark:text-slate-500">
                          {activeFullscreenVocab.word.ipa}
                        </span>
                      )}
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight capitalize">
                        {activeFullscreenVocab.word.word}
                      </h1>

                      {/* Natural Pronounce Button */}
                      <button
                        onClick={() => playPronunciation(activeFullscreenVocab.word.word)}
                        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border shrink-0 ${
                          playingWord === activeFullscreenVocab.word.word
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                            : "bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                        }`}
                        title="Pronounce (Space / P)"
                      >
                        <Volume2
                          className={`w-4 h-4 ${
                            playingWord === activeFullscreenVocab.word.word ? "animate-pulse" : ""
                          }`}
                        />
                        <span>
                          {playingWord === activeFullscreenVocab.word.word ? "Playing..." : "Pronounce"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Bangla Meaning */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Bangla Meaning (বাংলা অর্থ)
                    </span>
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {activeFullscreenVocab.word.banglaMeaning}
                    </p>
                  </div>

                  {/* English Definition */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Definition
                    </span>
                    <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                      {activeFullscreenVocab.word.meaning}
                    </p>
                  </div>

                  {/* Word Family */}
                  {activeFullscreenVocab.word.wordFamily &&
                    activeFullscreenVocab.word.wordFamily.length > 0 && (
                      <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                          Word Family
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {activeFullscreenVocab.word.wordFamily.map((wf: any, idx: number) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80"
                            >
                              {getWordRelationText(wf)}
                            </span>
                          ))}
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
                          onClick={() => handleSetMastery(activeFullscreenVocab, star)}
                          className="p-1 hover:scale-125 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= (activeFullscreenVocab.masteryLevel || 1)
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
              <div className="lg:col-span-7 min-h-0 h-full overflow-y-auto pr-0 lg:pr-2 space-y-5 pb-8">
                {/* Collocations */}
                {activeFullscreenVocab.word.collocations &&
                  activeFullscreenVocab.word.collocations.length > 0 && (
                    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-indigo-500" />
                        Collocations & Common Phrases
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {activeFullscreenVocab.word.collocations.map((col, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200"
                          >
                            {col}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Synonyms & Antonyms Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Synonyms */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Synonyms
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeFullscreenVocab.word.synonyms && activeFullscreenVocab.word.synonyms.length > 0 ? (
                        activeFullscreenVocab.word.synonyms.map((syn: any, idx: number) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80"
                          >
                            {getWordRelationWord(syn)}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">None listed</span>
                      )}
                    </div>
                  </div>

                  {/* Antonyms */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                      <X className="w-4 h-4 text-rose-500" />
                      Antonyms
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeFullscreenVocab.word.antonyms && activeFullscreenVocab.word.antonyms.length > 0 ? (
                        activeFullscreenVocab.word.antonyms.map((ant: any, idx: number) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/80"
                          >
                            {getWordRelationWord(ant)}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">None listed</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Example Sentences */}
                {activeFullscreenVocab.word.exampleSentences &&
                  activeFullscreenVocab.word.exampleSentences.length > 0 && (
                    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        Contextual Examples
                      </h3>
                      <div className="space-y-2">
                        {activeFullscreenVocab.word.exampleSentences.map((sent, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed"
                          >
                            &ldquo;{sent}&rdquo;
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Practice Sentences */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-500" />
                    My Practice Sentences ({activeFullscreenVocab.mySentences?.length || 0})
                  </h3>

                  {activeFullscreenVocab.mySentences &&
                    activeFullscreenVocab.mySentences.length > 0 && (
                      <div className="space-y-2">
                        {activeFullscreenVocab.mySentences.map((s, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/60 text-xs text-slate-800 dark:text-slate-200"
                          >
                            <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{s}</span>
                          </div>
                        ))}
                      </div>
                    )}

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Write a practice sentence using this word..."
                      value={newSentenceInputs[activeFullscreenVocab.id] || ""}
                      onChange={(e) =>
                        setNewSentenceInputs((prev) => ({
                          ...prev,
                          [activeFullscreenVocab.id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSentence(activeFullscreenVocab);
                        }
                      }}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      onClick={() => handleAddSentence(activeFullscreenVocab)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                </div>

                {/* Personal Study Notes */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-500" />
                      Study Notes & Mnemonics
                    </h3>
                    <button
                      onClick={() => handleSaveNotes(activeFullscreenVocab)}
                      disabled={savingNoteId === activeFullscreenVocab.id}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      {savingNoteId === activeFullscreenVocab.id ? "Saving..." : "Save Note"}
                    </button>
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Add mnemonics, exam tips, usage notes or IELTS ideas..."
                    value={
                      editingNotes[activeFullscreenVocab.id] !== undefined
                        ? editingNotes[activeFullscreenVocab.id]
                        : activeFullscreenVocab.notes || ""
                    }
                    onChange={(e) =>
                      setEditingNotes((prev) => ({
                        ...prev,
                        [activeFullscreenVocab.id]: e.target.value,
                      }))
                    }
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Controls Bar */}
            <div className="shrink-0 w-full px-6 py-2.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 z-30 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                  <Keyboard className="w-3 h-3" />
                  <span>← / →</span>
                </span>
                <span className="hidden sm:inline">Navigate</span>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-600 dark:text-slate-300 ml-1">
                  <span>Space</span>
                </span>
                <span className="hidden sm:inline">Pronounce</span>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-600 dark:text-slate-300 ml-1">
                  <span>Esc</span>
                </span>
                <span className="hidden sm:inline">Exit</span>
              </div>

              <div>
                <button
                  onClick={() => setFullscreenVocabId(null)}
                  className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* 5. Add Vocabulary Modal (Single Word Focused) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-purple-600/10 via-primary/10 to-fuchsia-600/10 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Add Vocabulary with AI
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Generate definitions, Bengali meanings, collocations & examples
                  </p>
                </div>
              </div>
              <button
                onClick={() => !isGenerating && setIsModalOpen(false)}
                disabled={isGenerating}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleExecuteAddSingleWord} className="p-6 space-y-5">
              {/* Single Word Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Vocabulary Word</span>
                  <span className="text-[11px] font-normal text-slate-400">e.g. significant</span>
                </label>

                <div className="relative">
                  <input
                    type="text"
                    value={inputWordText}
                    onChange={(e) => setInputWordText(e.target.value)}
                    disabled={isGenerating}
                    autoFocus
                    placeholder="Enter an English word (e.g. significant)..."
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-base font-medium shadow-inner"
                  />
                  {inputWordText && !isGenerating && (
                    <button
                      type="button"
                      onClick={() => setInputWordText("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Optional Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Optional Study Note / Context
                </label>
                <input
                  type="text"
                  value={userNote}
                  onChange={(e) => setUserNote(e.target.value)}
                  disabled={isGenerating}
                  placeholder="e.g. Academic writing / IELTS Task 2 / Oxford 3000..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Feedback / Progress Indicator */}
              {isGenerating && (
                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center gap-3 text-purple-700 dark:text-purple-300 animate-pulse">
                  <Sparkles className="w-5 h-5 animate-spin text-purple-500" />
                  <div className="text-xs font-semibold">
                    <p>AI is analyzing &apos;{inputWordText.trim()}&apos;...</p>
                    <p className="text-[11px] opacity-75">
                      Extracting meaning, Bengali translation, collocations & CEFR level.
                    </p>
                  </div>
                </div>
              )}

              {feedbackMessage && (
                <div
                  className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold border ${
                    feedbackMessage.type === "success"
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20"
                  }`}
                >
                  {feedbackMessage.type === "success" ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                  <span>{feedbackMessage.text}</span>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isGenerating}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isGenerating || !inputWordText.trim()}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-primary to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-sm font-bold shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Generate with AI</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
