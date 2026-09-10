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
} from "@/types/vocabulary";
import {
  fetchMyVocabularies,
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
  const [playingWord, setPlayingWord] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Fullscreen Single Vocab View State
  const [fullscreenVocabId, setFullscreenVocabId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [inputWordText, setInputWordText] = useState<string>("");
  const [pendingChips, setPendingChips] = useState<string[]>([]);
  const [userNote, setUserNote] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<string>("");
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

      // Don't trigger shortcuts if user is typing in an input or textarea
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

  // Chip input handlers
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addChipFromInput();
    }
  };

  const addChipFromInput = () => {
    const raw = inputWordText.trim();
    if (!raw) return;

    // Support comma or newline separated pasting
    const splitWords = raw
      .split(/[,\n]/)
      .map((w) => w.trim())
      .filter((w) => w.length > 0 && !pendingChips.includes(w.toLowerCase()));

    if (splitWords.length > 0) {
      setPendingChips((prev) => [...prev, ...splitWords]);
      setInputWordText("");
    }
  };

  const removeChip = (indexToRemove: number) => {
    setPendingChips((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  // Execute AI generation & addition
  const handleExecuteAddVocabulary = async () => {
    const allWordsToAdd = [...pendingChips];
    if (inputWordText.trim()) {
      const remaining = inputWordText
        .split(/[,\n]/)
        .map((w) => w.trim())
        .filter((w) => w.length > 0 && !allWordsToAdd.includes(w.toLowerCase()));
      allWordsToAdd.push(...remaining);
    }

    if (allWordsToAdd.length === 0) {
      setFeedbackMessage({
        type: "error",
        text: "Please enter at least one word to analyze with AI.",
      });
      return;
    }

    setIsGenerating(true);
    setFeedbackMessage(null);
    setGenerationProgress(`AI is analyzing ${allWordsToAdd.length} vocabulary word(s)...`);

    try {
      const response = await addVocabularyWithAi({
        words: allWordsToAdd,
        notes: userNote.trim() || undefined,
      });

      setFeedbackMessage({
        type: "success",
        text: response.message || `Successfully generated and added ${allWordsToAdd.length} words!`,
      });

      // Reload list
      await loadVocabularies();

      // Reset modal inputs after brief delay
      setTimeout(() => {
        setPendingChips([]);
        setInputWordText("");
        setUserNote("");
        setIsModalOpen(false);
        setIsGenerating(false);
        setFeedbackMessage(null);
      }, 1400);
    } catch (err: any) {
      setIsGenerating(false);
      setFeedbackMessage({
        type: "error",
        text: err.message || "Failed to generate vocabulary with AI. Please try again.",
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
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort & Quick Filter Toggles */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              className={`inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold border transition-all ${
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
              className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            >
              <option value="recent">Recently Added</option>
              <option value="alphabetical">Alphabetical (A - Z)</option>
              <option value="mastery">Mastery Level</option>
            </select>

            <button
              onClick={loadVocabularies}
              title="Refresh vocabulary"
              className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Part of Speech Pill Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedPos("ALL")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
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
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
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
                : "You haven't added any words to your vault yet. Add single or multiple words with AI!"}
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md transition-colors"
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vocabularies.map((item) => {
            const isExpanded = !!expandedCards[item.id];
            const posConfig = POS_COLORS[item.word.partOfSpeech] || POS_COLORS.NOUN;
            const isAudioPlaying = playingWord === item.word.word;
            const isFav = item.isFavorite || item.isFavourate;

            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all duration-300 overflow-hidden"
              >
                {/* Top Card Header */}
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <button
                          onClick={() => setFullscreenVocabId(item.id)}
                          className="text-2xl font-black tracking-tight text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                        >
                          {item.word.word}
                        </button>

                        {/* Pronunciation Audio Button */}
                        <button
                          onClick={() => playPronunciation(item.word.word)}
                          title="Listen to pronunciation"
                          className={`p-1.5 rounded-xl transition-all ${
                            isAudioPlaying
                              ? "bg-indigo-600 text-white scale-110 shadow-md shadow-indigo-500/30"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600"
                          }`}
                        >
                          {isAudioPlaying ? (
                            <Volume2 className="w-4 h-4 animate-pulse" />
                          ) : (
                            <Volume2 className="w-4 h-4" />
                          )}
                        </button>

                        {/* IPA guide */}
                        {item.word.ipa && (
                          <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                            {item.word.ipa}
                          </span>
                        )}
                      </div>

                      {/* Part of Speech & CEFR Badges */}
                      <div className="flex items-center gap-2 pt-1">
                        <span
                          className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${posConfig.bg} ${posConfig.text} ${posConfig.border}`}
                        >
                          {posConfig.label}
                        </span>
                        {item.word.cefrLevel && (
                          <span className="px-2 py-0.5 rounded-lg text-[11px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            CEFR {item.word.cefrLevel}
                          </span>
                        )}
                        {item.status && item.status !== "LEARNING" && (
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 uppercase tracking-wider">
                            {item.status}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Controls: Fullscreen, Favorite & Delete */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setFullscreenVocabId(item.id)}
                        title="Open Fullscreen View"
                        className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleToggleFavorite(item)}
                        title={isFav ? "Remove from favorites" : "Add to favorites"}
                        className={`p-2 rounded-xl transition-all ${
                          isFav
                            ? "bg-amber-500/15 text-amber-500 hover:bg-amber-500/25"
                            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <Star
                          className={`w-4 h-4 ${isFav ? "fill-amber-400 text-amber-400" : ""}`}
                        />
                      </button>

                      <button
                        onClick={() => handleDeleteWord(item.id, item.word.word)}
                        title="Delete word"
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Bengali Meaning Highlight Box */}
                  <div className="rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 dark:from-emerald-500/20 dark:via-teal-500/20 dark:to-indigo-500/20 p-3.5 border border-emerald-500/20">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider mb-1">
                      <Sparkles className="w-3 h-3 text-emerald-500" />
                      বাংলা অর্থ (Bangla Meaning)
                    </div>
                    <p className="text-base font-semibold text-slate-900 dark:text-emerald-100">
                      {item.word.banglaMeaning}
                    </p>
                  </div>

                  {/* English Definition */}
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Definition
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {item.word.meaning}
                    </p>
                  </div>

                  {/* Collocations Pills */}
                  {item.word.collocations && item.word.collocations.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Collocations & Phrases
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {item.word.collocations.map((col, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80"
                          >
                            🔗 {col}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Synonyms & Antonyms */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {item.word.synonyms && item.word.synonyms.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                          Synonyms
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {item.word.synonyms.slice(0, 4).map((syn, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                            >
                              {syn}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.word.antonyms && item.word.antonyms.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                          Antonyms
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {item.word.antonyms.slice(0, 3).map((ant, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                            >
                              {ant}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Expanded Section: Examples, Word Family, Practice Sentences, Notes */}
                  {isExpanded && (
                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-4 animate-in fade-in-50 duration-200">
                      {/* Example Sentences */}
                      {item.word.exampleSentences && item.word.exampleSentences.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                            Contextual Example Sentences
                          </p>
                          <div className="space-y-1.5">
                            {item.word.exampleSentences.map((sent, idx) => (
                              <p
                                key={idx}
                                className="text-xs text-slate-600 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60"
                              >
                                &ldquo;{sent}&rdquo;
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Word Family */}
                      {item.word.wordFamily && item.word.wordFamily.length > 0 && (
                        <div className="space-y-1.5">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Word Family
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {item.word.wordFamily.map((wf, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 rounded-lg text-xs bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                              >
                                {wf}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* User's Practice Sentences */}
                      <div className="space-y-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          My Practice Sentences ({item.mySentences?.length || 0})
                        </p>
                        {item.mySentences && item.mySentences.length > 0 && (
                          <div className="space-y-1.5">
                            {item.mySentences.map((s, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2 p-2 rounded-xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20 text-xs text-purple-900 dark:text-purple-200"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 mt-0.5 shrink-0" />
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
                            className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors"
                          >
                            Save
                          </button>
                        </div>
                      </div>

                      {/* Personal Study Notes */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Study Notes
                          </p>
                          {editingNotes[item.id] !== undefined &&
                            editingNotes[item.id] !== item.notes && (
                              <button
                                onClick={() => handleSaveNotes(item)}
                                disabled={savingNoteId === item.id}
                                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
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

                {/* Card Footer with Mastery Stars & Full View Details Button */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                  {/* Mastery Rating */}
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-semibold text-slate-400 mr-1">Mastery:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleSetMastery(item, star)}
                        title={`Set mastery to ${star} stars`}
                        className="p-0.5 hover:scale-125 transition-transform"
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

                  {/* Actions: Full View Details & Toggle Accordion */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFullscreenVocabId(item.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Full View Details</span>
                    </button>

                    <button
                      onClick={() => toggleCardExpand(item.id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
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
      )}

      {/* 4. True Edge-to-Edge Fullscreen Single Vocabulary Portal View (Dark & Light Theme) */}
      {isMounted &&
        activeFullscreenVocab &&
        createPortal(
          <div className="fixed inset-0 z-[99999] w-screen h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col overflow-hidden select-none animate-in fade-in duration-200">
            {/* Top Bar (Edge-to-Edge) */}
            <div className="shrink-0 w-full px-6 py-3.5 bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border-b border-slate-200 dark:border-white/10 flex items-center justify-between gap-4 z-30 shadow-sm">
              {/* Left: Exit Fullscreen + Counter */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setFullscreenVocabId(null)}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-white text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer border border-slate-200 dark:border-white/10"
                >
                  <Minimize2 className="w-4 h-4" />
                  <span>Exit Fullscreen</span>
                </button>

                <div className="hidden sm:flex items-center gap-2.5 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 font-bold border border-indigo-500/20 dark:border-indigo-500/30">
                    Word {activeFullscreenIndex + 1} of {vocabularies.length}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    ({stats.total} words in vault)
                  </span>
                </div>
              </div>

              {/* Center: Navigation Carousel Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateFullscreen(-1)}
                  title="Previous Word (← Arrow key)"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/15 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white border border-slate-200 dark:border-white/10 text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden md:inline">Previous</span>
                </button>

                <div className="text-xs font-black text-indigo-600 dark:text-indigo-300 px-2 font-mono">
                  {activeFullscreenIndex + 1} / {vocabularies.length}
                </div>

                <button
                  onClick={() => navigateFullscreen(1)}
                  title="Next Word (→ Arrow key)"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/15 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white border border-slate-200 dark:border-white/10 text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span className="hidden md:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Right: Status Switcher, ThemeToggle, Favorite & Close */}
              <div className="flex items-center gap-3">
                {/* Status Switcher */}
                <div className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10">
                  {(["LEARNING", "REVIEWING", "MASTERED"] as VocabularyStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleSetStatus(activeFullscreenVocab, st)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                        (activeFullscreenVocab.status || "LEARNING") === st
                          ? "bg-indigo-600 text-white shadow-md"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {/* Theme Toggle in Fullscreen Header */}
                <ThemeToggle />

                {/* Favorite Toggle */}
                <button
                  onClick={() => handleToggleFavorite(activeFullscreenVocab)}
                  title={
                    activeFullscreenVocab.isFavorite || activeFullscreenVocab.isFavourate
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    activeFullscreenVocab.isFavorite || activeFullscreenVocab.isFavourate
                      ? "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                      : "bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-slate-700 dark:hover:text-white border border-slate-200 dark:border-white/10"
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
                  className="p-2 rounded-xl bg-slate-100 hover:bg-rose-500 hover:text-white dark:bg-white/10 dark:hover:bg-rose-600/80 text-slate-700 dark:text-white transition-colors cursor-pointer border border-slate-200 dark:border-transparent"
                  title="Close Fullscreen (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Edge-to-Edge Fullscreen Main Body (2-Column Expansive Workspace) */}
            <div className="flex-1 w-full p-6 lg:p-10 overflow-y-auto lg:overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 z-10">
              {/* Left Column: 5 Cols (Hero linguistic card, pronunciation, Bangla, definition) */}
              <div className="lg:col-span-5 flex flex-col gap-6 lg:overflow-y-auto pr-0 lg:pr-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-white/10">
                {/* Hero Header Box */}
                <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-gradient-to-br dark:from-indigo-950/90 dark:via-purple-950/70 dark:to-slate-900 p-8 border border-slate-200 dark:border-white/15 shadow-xl dark:shadow-2xl space-y-6">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-xl text-xs font-extrabold uppercase tracking-wider border ${
                          POS_COLORS[activeFullscreenVocab.word.partOfSpeech]?.bg || "bg-indigo-500/20"
                        } ${
                          POS_COLORS[activeFullscreenVocab.word.partOfSpeech]?.text || "text-indigo-600 dark:text-indigo-300"
                        } ${
                          POS_COLORS[activeFullscreenVocab.word.partOfSpeech]?.border || "border-indigo-500/30"
                        }`}
                      >
                        {POS_COLORS[activeFullscreenVocab.word.partOfSpeech]?.label ||
                          activeFullscreenVocab.word.partOfSpeech}
                      </span>

                      {activeFullscreenVocab.word.cefrLevel && (
                        <span className="px-3 py-1 rounded-xl text-xs font-black bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/20 text-slate-800 dark:text-indigo-200">
                          CEFR {activeFullscreenVocab.word.cefrLevel}
                        </span>
                      )}

                      {activeFullscreenVocab.word.ipa && (
                        <span className="text-sm font-mono text-slate-500 dark:text-slate-400">
                          {activeFullscreenVocab.word.ipa}
                        </span>
                      )}
                    </div>

                    {/* Word Typography */}
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight bg-gradient-to-r from-slate-950 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-100 dark:to-purple-200 bg-clip-text text-transparent break-words">
                      {activeFullscreenVocab.word.word}
                    </h1>
                  </div>

                  {/* Pronunciation Audio Button */}
                  <button
                    onClick={() => playPronunciation(activeFullscreenVocab.word.word)}
                    className={`w-full py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all cursor-pointer shadow-lg ${
                      playingWord === activeFullscreenVocab.word.word
                        ? "bg-indigo-600 text-white scale-[1.02] shadow-indigo-500/40"
                        : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white border border-indigo-200 dark:border-white/20 hover:scale-[1.01]"
                    }`}
                  >
                    <Volume2
                      className={`w-6 h-6 ${
                        playingWord === activeFullscreenVocab.word.word ? "animate-pulse" : ""
                      }`}
                    />
                    <span className="text-base">
                      {playingWord === activeFullscreenVocab.word.word
                        ? "Playing Audio..."
                        : "Listen Pronunciation (Space / P)"}
                    </span>
                  </button>

                  {/* Bangla Meaning Card */}
                  <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 p-5 space-y-2 backdrop-blur-md">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                      বাংলা অর্থ ও ভাবার্থ (Bangla Meaning)
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-emerald-950 dark:text-emerald-100 leading-snug">
                      {activeFullscreenVocab.word.banglaMeaning}
                    </p>
                  </div>

                  {/* English Definition */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      English Meaning & Definition
                    </span>
                    <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 font-normal leading-relaxed">
                      {activeFullscreenVocab.word.meaning}
                    </p>
                  </div>

                  {/* Word Family Tree */}
                  {activeFullscreenVocab.word.wordFamily &&
                    activeFullscreenVocab.word.wordFamily.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-white/10">
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4" />
                          Word Family
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {activeFullscreenVocab.word.wordFamily.map((wf, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 rounded-xl text-xs font-semibold bg-purple-500/10 dark:bg-purple-500/15 text-purple-700 dark:text-purple-200 border border-purple-500/20 dark:border-purple-500/30"
                            >
                              {wf}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Mastery Rating */}
                  <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Mastery Level:</span>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleSetMastery(activeFullscreenVocab, star)}
                          className="p-1 hover:scale-125 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= (activeFullscreenVocab.masteryLevel || 1)
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300 dark:text-slate-600"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: 7 Cols (Collocations, Synonyms/Antonyms, Examples, Practice Sentences, Study Notes) */}
              <div className="lg:col-span-7 flex flex-col gap-6 lg:overflow-y-auto pr-0 lg:pr-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-white/10">
                {/* Collocations & Natural Phrases */}
                {activeFullscreenVocab.word.collocations &&
                  activeFullscreenVocab.word.collocations.length > 0 && (
                    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-300 flex items-center gap-2">
                        <Layers className="w-4 h-4" />
                        Collocations & Natural Pairings
                      </h3>
                      <div className="flex flex-wrap gap-2.5 pt-1">
                        {activeFullscreenVocab.word.collocations.map((col, idx) => (
                          <span
                            key={idx}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                          >
                            🔗 {col}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Synonyms & Antonyms Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Synonyms */}
                  <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Synonyms
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {(activeFullscreenVocab.word.synonyms && activeFullscreenVocab.word.synonyms.length > 0
                        ? activeFullscreenVocab.word.synonyms
                        : ["fluent", "expressive"]
                      ).map((syn, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30"
                        >
                          {syn}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Antonyms */}
                  <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                      <X className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      Antonyms
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {(activeFullscreenVocab.word.antonyms && activeFullscreenVocab.word.antonyms.length > 0
                        ? activeFullscreenVocab.word.antonyms
                        : ["opposite", "contrary"]
                      ).map((ant, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30"
                        >
                          {ant}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Example Sentences */}
                {activeFullscreenVocab.word.exampleSentences &&
                  activeFullscreenVocab.word.exampleSentences.length > 0 && (
                    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-amber-600 dark:text-amber-300 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Contextual Example Sentences
                      </h3>
                      <div className="space-y-2.5">
                        {activeFullscreenVocab.word.exampleSentences.map((sent, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-sm text-slate-800 dark:text-slate-200 italic leading-relaxed"
                          >
                            &ldquo;{sent}&rdquo;
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Personal Practice Sentences Workspace */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-300 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    My Practice Sentences ({activeFullscreenVocab.mySentences?.length || 0})
                  </h3>

                  {activeFullscreenVocab.mySentences &&
                    activeFullscreenVocab.mySentences.length > 0 && (
                      <div className="space-y-2">
                        {activeFullscreenVocab.mySentences.map((s, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200/80 dark:border-purple-500/20 text-xs text-purple-900 dark:text-purple-200"
                          >
                            <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{s}</span>
                          </div>
                        ))}
                      </div>
                    )}

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Write your own sentence using this word..."
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
                      className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={() => handleAddSentence(activeFullscreenVocab)}
                      className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
                    >
                      Save Sentence
                    </button>
                  </div>
                </div>

                {/* Personal Study Notes & Mnemonics */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
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
                    placeholder="Add your mnemonics, exam tips, memory triggers or IELTS writing ideas..."
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
                    className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Edge-to-Edge Bottom Controls Bar */}
            <div className="shrink-0 w-full px-8 py-3.5 bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-4 z-30 text-xs font-semibold text-slate-500 dark:text-slate-400 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                  <Keyboard className="w-3.5 h-3.5" />
                  <span>← / →</span>
                </span>
                <span>Navigate words</span>

                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-mono text-[11px] text-slate-700 dark:text-slate-300 ml-2">
                  <span>Space</span>
                </span>
                <span>Pronounce</span>

                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-mono text-[11px] text-slate-700 dark:text-slate-300 ml-2">
                  <span>Esc</span>
                </span>
                <span>Exit</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFullscreenVocabId(null)}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all cursor-pointer shadow-md"
                >
                  Close Fullscreen
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}


      {/* 5. Add Vocabulary Modal (Supports Single & Multiple Words) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Add Vocabulary with AI
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enter one or multiple words to automatically generate deep linguistic profiles
                  </p>
                </div>
              </div>
              <button
                onClick={() => !isGenerating && setIsModalOpen(false)}
                disabled={isGenerating}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Chips Input Box */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center justify-between">
                  <span>Enter Words (Single or Multiple)</span>
                  <span className="text-[11px] font-normal text-slate-400">
                    Press Enter or comma (,) to add chip
                  </span>
                </label>

                <div className="min-h-[110px] p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-wrap content-start gap-2 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                  {pendingChips.map((chip, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 text-xs font-semibold animate-in zoom-in-95 duration-150"
                    >
                      <span>{chip}</span>
                      <button
                        type="button"
                        onClick={() => removeChip(idx)}
                        disabled={isGenerating}
                        className="hover:text-rose-500 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}

                  <input
                    type="text"
                    value={inputWordText}
                    onChange={(e) => setInputWordText(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    onBlur={addChipFromInput}
                    disabled={isGenerating}
                    placeholder={
                      pendingChips.length === 0
                        ? "e.g. Resilient, Pragmatic, Ephemeral (or paste a comma-separated list)..."
                        : "Add another word..."
                    }
                    className="flex-1 min-w-[200px] bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none py-1"
                  />
                </div>

                <p className="text-[11px] text-slate-400">
                  Tip: You can paste a comma-separated list like{" "}
                  <span className="font-mono text-indigo-500 dark:text-indigo-400">
                    ubiquitous, articulate, meticulous
                  </span>{" "}
                  to batch process at once.
                </p>
              </div>

              {/* Optional Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Optional Study Note or Category (Applied to these words)
                </label>
                <input
                  type="text"
                  value={userNote}
                  onChange={(e) => setUserNote(e.target.value)}
                  disabled={isGenerating}
                  placeholder="e.g. IELTS Speaking Part 2 / Oxford 3000..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Feedback / Progress Indicator */}
              {isGenerating && (
                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-3 text-indigo-700 dark:text-indigo-300 animate-pulse">
                  <Sparkles className="w-5 h-5 animate-spin text-indigo-500" />
                  <div className="text-xs font-semibold">
                    <p>{generationProgress || "AI is generating linguistic analysis..."}</p>
                    <p className="text-[11px] opacity-75">
                      Extracting definitions, Bengali meanings, collocations, and example sentences.
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
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={isGenerating}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleExecuteAddVocabulary}
                disabled={isGenerating || (pendingChips.length === 0 && !inputWordText.trim())}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:via-purple-700 hover:to-pink-600 text-white text-sm font-bold shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>
                      Generate & Add {pendingChips.length > 0 ? `(${pendingChips.length + (inputWordText.trim() ? 1 : 0)})` : ""}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
