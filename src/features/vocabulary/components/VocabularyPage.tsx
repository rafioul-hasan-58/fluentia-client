"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { ThemeToggle } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  MyVocabularyItem,
  PartOfSpeech,
  VocabularyStatus,
  VerbForms,
  getVerbForms,
  getWordRelationText,
  getWordRelationWord,
  getWordRelationPartOfSpeech,
  getWordRelationBangla,
  getCollocationText,
  getCollocationMeaning,
  getCollocationBangla,
  getCollocationExample,
} from "@/features/vocabulary/types/vocabulary";
import {
  fetchMyVocabularies,
  getDateWordCounts,
  addSingleVocabulary,
  updateMyVocabulary,
  deleteMyVocabulary,
  generateVocabStoryApi,
} from "@/features/vocabulary/api";
import {
  Sparkles,
  Plus,
  Search,
  Volume2,
  Star,
  Trash2,
  Edit3,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Layers,
  Filter,
  RefreshCw,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
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
  Clock,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { VocabularyDatePicker } from "@/features/vocabulary/components/VocabularyDatePicker";

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

/**
 * Highlights a collocation phrase inside an example sentence for enhanced visual learning
 */
function highlightPhrase(sentence: string, phrase: string) {
  if (!phrase || !phrase.trim() || !sentence) return sentence;
  const escaped = phrase.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = sentence.split(regex);
  if (parts.length === 1) return sentence;
  return parts.map((part, i) =>
    part.toLowerCase() === phrase.trim().toLowerCase() ? (
      <span
        key={i}
        className="font-semibold text-indigo-600 dark:text-indigo-400 underline decoration-indigo-300 dark:decoration-indigo-700 underline-offset-2 not-italic"
      >
        {part}
      </span>
    ) : (
      part
    )
  );
}

export default function VocabularyPage() {
  const [vocabularies, setVocabularies] = useState<MyVocabularyItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPos, setSelectedPos] = useState<PartOfSpeech | "ALL">("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [selectedSort, setSelectedSort] = useState<"recent" | "alphabetical" | "mastery">("recent");
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);
  const [todayOnly, setTodayOnly] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [allVaultWords, setAllVaultWords] = useState<MyVocabularyItem[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [playingWord, setPlayingWord] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Pagination State (Default 12 per screen, matching Question Bank style)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedPos,
    selectedStatus,
    selectedLevel,
    selectedSort,
    favoritesOnly,
    todayOnly,
    selectedDate,
  ]);

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


  // Editing notes tracker
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null);

  // New sentence builder tracker
  const [newSentenceInputs, setNewSentenceInputs] = useState<Record<string, string>>({});

  // Update/Edit Modal State
  const [editingItem, setEditingItem] = useState<MyVocabularyItem | null>(null);

  const router = useRouter();

  // Story Creation Mode State
  const [isStorySelectMode, setIsStorySelectMode] = useState<boolean>(false);
  const [selectedStoryItems, setSelectedStoryItems] = useState<MyVocabularyItem[]>([]);
  const [isStoryContextModalOpen, setIsStoryContextModalOpen] = useState<boolean>(false);
  const [storyContext, setStoryContext] = useState<string>("");
  const [isCreatingStory, setIsCreatingStory] = useState<boolean>(false);
  const [storyCreationError, setStoryCreationError] = useState<string | null>(null);

  // Check URL query parameters for mode=create-story on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("mode") === "create-story") {
        setIsStorySelectMode(true);
      }
    }
  }, []);

  const handleToggleStoryWord = (item: MyVocabularyItem) => {
    setSelectedStoryItems((prev) => {
      const exists = prev.some((p) => p.id === item.id);
      if (exists) {
        return prev.filter((p) => p.id !== item.id);
      }
      if (prev.length >= 10) {
        alert("You can select up to 10 vocabulary words for a story.");
        return prev;
      }
      return [...prev, item];
    });
  };

  const handleExecuteStoryGeneration = async () => {
    if (selectedStoryItems.length === 0) {
      setStoryCreationError("Please select at least 1 vocabulary word (recommended 5 to 10).");
      return;
    }
    setIsCreatingStory(true);
    setStoryCreationError(null);
    try {
      const vocabularyIds = selectedStoryItems.map(
        (item) => item.word?.id || item.wordId || item.id
      );
      await generateVocabStoryApi({
        vocabularyIds,
        context: storyContext.trim() || undefined,
      });
      setIsStoryContextModalOpen(false);
      setSelectedStoryItems([]);
      setIsStorySelectMode(false);
      router.push("/dashboard/vocabulary/stories");
    } catch (err: any) {
      setStoryCreationError(err.message || "Failed to generate vocabulary story. Please try again.");
    } finally {
      setIsCreatingStory(false);
    }
  };
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

  // Sweet Delete Modal State
  const [itemToDelete, setItemToDelete] = useState<MyVocabularyItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    loadVocabularies();
  }, [
    searchQuery,
    selectedPos,
    selectedStatus,
    selectedLevel,
    selectedSort,
    favoritesOnly,
    todayOnly,
    selectedDate,
  ]);

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
      const [items, allItems] = await Promise.all([
        fetchMyVocabularies({
          search: searchQuery,
          partOfSpeech: selectedPos,
          status: selectedStatus !== "ALL" ? (selectedStatus as any) : undefined,
          englishLevel: selectedLevel !== "ALL" ? selectedLevel : undefined,
          sortBy: selectedSort,
          favoritesOnly,
          todayOnly,
          selectedDate,
          limit: 100,
        }),
        fetchMyVocabularies({ limit: 100 }),
      ]);
      setVocabularies(items);
      setAllVaultWords(allItems);
    } catch (err) {
      console.error("Failed to load vocabularies", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Voice caching state for speech synthesis
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Preload and register SpeechSynthesis voices
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const updateVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available && available.length > 0) {
        setVoices(available);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  /**
   * Helper to retrieve the best high-quality female English voice available on device
   */
  const getFemaleVoice = (): SpeechSynthesisVoice | null => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
    const voiceList = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
    if (!voiceList || voiceList.length === 0) return null;

    // Prioritized list of known high-quality female voice identifiers across Chrome, Edge, Safari, iOS, macOS, and Windows
    const preferredFemalePatterns = [
      "microsoft jenny online (natural)",
      "microsoft aria online (natural)",
      "microsoft ava online (natural)",
      "microsoft emma online (natural)",
      "microsoft zira",
      "google us english",
      "google uk english female",
      "samantha",
      "victoria",
      "karen",
      "moira",
      "fiona",
      "serena",
      "tessa",
      "allison",
      "ava",
      "nora",
      "susan",
      "female",
    ];

    // 1. Search for preferred natural female voices in English
    for (const pattern of preferredFemalePatterns) {
      const match = voiceList.find((v) => {
        const nameLower = v.name.toLowerCase();
        const langLower = v.lang.toLowerCase();
        return langLower.startsWith("en") && nameLower.includes(pattern);
      });
      if (match) return match;
    }

    // 2. Search for any English voice explicitly tagged or named 'female' or 'woman'
    const anyFemaleEnglish = voiceList.find((v) => {
      const nameLower = v.name.toLowerCase();
      const langLower = v.lang.toLowerCase();
      return (
        langLower.startsWith("en") &&
        (nameLower.includes("female") || nameLower.includes("woman") || nameLower.includes("girl"))
      );
    });
    if (anyFemaleEnglish) return anyFemaleEnglish;

    // 3. Fallback to standard US/UK English voices
    const fallbackEn = voiceList.find(
      (v) => v.lang.startsWith("en-US") || v.lang.startsWith("en-GB") || v.lang.startsWith("en")
    );
    return fallbackEn || voiceList[0] || null;
  };

  // Pronounce word using Web Speech API with female voice
  const playPronunciation = (word: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.88; // clear natural pace
    utterance.pitch = 1.08; // clear female pitch

    const femaleVoice = getFemaleVoice();
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

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

  // Sweet Delete word confirmation
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    const targetId = itemToDelete.id;
    setIsDeleting(true);

    if (fullscreenVocabId === targetId) {
      setFullscreenVocabId(null);
    }

    setVocabularies((prev) => prev.filter((v) => v.id !== targetId));
    try {
      await deleteMyVocabulary(targetId);
    } catch (err) {
      console.warn("Could not sync deletion", err);
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
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
    setEditStatus(item.status || "LEARNING");
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

  // Map of YYYY-MM-DD -> word count for calendar indicators
  const calendarWordCounts = useMemo(() => {
    const list = allVaultWords.length > 0 ? allVaultWords : vocabularies;
    return getDateWordCounts(list);
  }, [allVaultWords, vocabularies]);

  // Metrics computation (always reflective of total vault or active list)
  const stats = useMemo(() => {
    const baseList = allVaultWords.length > 0 ? allVaultWords : vocabularies;
    const total = baseList.length;
    const favorites = baseList.filter((v) => v.isFavorite || v.isFavourate).length;
    const posCounts: Partial<Record<PartOfSpeech, number>> = {};
    let masteredCount = 0;
    const today = new Date();
    const todayCount = baseList.filter((v) => {
      const d = v.createdAt || v.updatedAt;
      if (!d) return false;
      const date = new Date(d);
      return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
      );
    }).length;

    baseList.forEach((v) => {
      const pos = v.word.partOfSpeech;
      posCounts[pos] = (posCounts[pos] || 0) + 1;
      if ((v.masteryLevel || 0) >= 4 || v.status === "MASTERED") masteredCount++;
    });

    return { total, favorites, todayCount, posCounts, masteredCount };
  }, [allVaultWords, vocabularies]);

  // Active fullscreen vocabulary object & index
  const activeFullscreenVocab = useMemo(() => {
    if (!fullscreenVocabId) return null;
    return vocabularies.find((v) => v.id === fullscreenVocabId) || null;
  }, [fullscreenVocabId, vocabularies]);

  const activeFullscreenIndex = useMemo(() => {
    if (!fullscreenVocabId) return -1;
    return vocabularies.findIndex((v) => v.id === fullscreenVocabId);
  }, [fullscreenVocabId, vocabularies]);

  // Pagination calculations (Default 12 per screen)
  const totalCount = vocabularies.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Keep currentPage valid when totalCount or pageSize changes
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startRecord = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalCount);

  // Slice vocabularies for current screen display
  const paginatedVocabularies = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return vocabularies.slice(start, start + pageSize);
  }, [vocabularies, currentPage, pageSize]);

  // Helper Pagination for Vocabulary Vault (matching Question Bank in Admin Dashboard)
  const renderPaginationControls = (isTopPosition: boolean) => {
    if (totalCount === 0) return null;

    return (
      <div
        className={`p-3.5 sm:p-4 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn ${isTopPosition ? "border-primary/30 dark:border-primary/30" : "mt-2"
          }`}
      >
        <div className="flex items-center gap-2.5 text-xs text-ink-soft">
          <span className="font-semibold text-ink">
            Showing <strong className="text-primary dark:text-purple-300">{startRecord} - {endRecord}</strong> of {totalCount} Words
          </span>
          <span className="text-slate-300 dark:text-white/20">|</span>
          <span>Page {currentPage} of {totalPages || 1}</span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-end">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-ink-soft text-[11px] font-semibold">Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="h-8 px-2 rounded-lg bg-paper border border-slate-200 dark:border-white/10 text-xs font-semibold text-ink cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/40"
            >
              {[12, 24, 36, 48].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1 || isLoading}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-8 px-2.5 text-xs font-semibold"
            >
              ‹ Prev
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              if (totalPages > 6 && p !== 1 && p !== totalPages && Math.abs(p - currentPage) > 1) {
                if (p === 2 || p === totalPages - 1) {
                  return (
                    <span key={p} className="px-1 text-xs text-ink-soft">
                      ...
                    </span>
                  );
                }
                return null;
              }

              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setCurrentPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPage === p
                    ? "bg-primary text-white shadow-xs"
                    : "bg-slate-100 dark:bg-white/5 text-ink-soft hover:text-ink hover:bg-slate-200 dark:hover:bg-white/10"
                    }`}
                >
                  {p}
                </button>
              );
            })}

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages || isLoading}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 px-2.5 text-xs font-semibold"
            >
              Next ›
            </Button>
          </div>
        </div>
      </div>
    );
  };

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

          <div
            onClick={() => {
              const nextVal = !todayOnly;
              setTodayOnly(nextVal);
              if (nextVal) setSelectedDate(null);
            }}
            className={`flex items-center gap-3 bg-white/70 dark:bg-white/5 rounded-2xl p-3.5 backdrop-blur-md border transition-all cursor-pointer ${todayOnly
              ? "border-purple-500/50 dark:border-purple-500/60 bg-purple-500/15 dark:bg-purple-500/20 shadow-md ring-2 ring-purple-500/20"
              : "border-slate-200/80 dark:border-white/10 shadow-sm hover:border-purple-500/30"
              }`}
            title="Click to filter Today's Words"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-300 flex items-center justify-center border border-purple-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-ink-soft font-medium">Today&apos;s Vocab</p>
              <p className="text-xl font-bold text-ink">{stats.todayCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Search, Filter & Controls */}
      <div className="space-y-4">
        {/* Line 1: Favorites, Quick Filters, Dropdowns & Actions (Left-aligned) */}
        <div className="flex flex-wrap items-center gap-3 justify-start">
          <button
            onClick={() => setFavoritesOnly(!favoritesOnly)}
            className={`inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold border transition-all cursor-pointer ${favoritesOnly
              ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 shadow-sm"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300"
              }`}
          >
            <Star
              className={`w-4 h-4 ${favoritesOnly ? "fill-amber-400 text-amber-400" : "text-slate-400"
                }`}
            />
            <span>Favorites</span>
          </button>

          <button
            onClick={() => {
              const nextVal = !todayOnly;
              setTodayOnly(nextVal);
              if (nextVal) setSelectedDate(null);
            }}
            className={`inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold border transition-all cursor-pointer ${todayOnly
              ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 shadow-sm"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300"
              }`}
          >
            <Clock
              className={`w-4 h-4 ${todayOnly ? "text-indigo-500" : "text-slate-400"
                }`}
            />
            <span>Today&apos;s Words</span>
            {stats.todayCount > 0 && (
              <span
                className={`ml-0.5 text-xs px-1.5 py-0.5 rounded-full font-bold ${todayOnly
                  ? "bg-indigo-500/20 text-indigo-600 dark:text-indigo-300"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }`}
              >
                {stats.todayCount}
              </span>
            )}
          </button>

          {/* Calendar Date Filter Picker */}
          <VocabularyDatePicker
            selectedDate={selectedDate}
            onSelectDate={(date: any) => {
              setSelectedDate(date);
              if (date) setTodayOnly(false);
            }}
            wordCounts={calendarWordCounts}
          />

          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value as any)}
            className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer"
          >
            <option value="recent">Recently Added</option>
            <option value="alphabetical">Alphabetical (A - Z)</option>
            <option value="mastery">Mastery Level</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="LEARNING">Learning</option>
            <option value="LEARNED">Learned</option>
            <option value="MASTERED">Mastered</option>
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer"
          >
            <option value="ALL">All Levels</option>
            <option value="A1">A1 Level</option>
            <option value="A2">A2 Level</option>
            <option value="B1">B1 Level</option>
            <option value="B2">B2 Level</option>
            <option value="C1">C1 Level</option>
            <option value="C2">C2 Level</option>
          </select>

          <button
            onClick={() => {
              setIsStorySelectMode(!isStorySelectMode);
              if (isStorySelectMode) setSelectedStoryItems([]);
            }}
            className={`inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold border transition-all cursor-pointer ${isStorySelectMode
              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-500 shadow-md shadow-orange-500/20"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-amber-400"
              }`}
            title="Toggle Story Selection Mode"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{isStorySelectMode ? `Story Mode (${selectedStoryItems.length})` : "Create Story"}</span>
          </button>
        </div>

        {/* Line 2: Search Bar, Refresh & View Mode Switch (Left-aligned) */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 justify-start">
          {/* Search Bar - Expanded & Prominent */}
          <div className="relative w-full sm:max-w-xl md:max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search words, English definitions, Bengali meanings, or synonyms..."
              className="w-full pl-12 pr-10 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all text-sm"
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

          <div className="flex items-center gap-3 shrink-0">
            {/* Refresh Button */}
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
                className={`p-2 rounded-xl transition-all cursor-pointer ${viewMode === "grid"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                title="Table View (Compact)"
                className={`p-2 rounded-xl transition-all cursor-pointer ${viewMode === "table"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
              >
                <Table className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Line 3: Part of Speech Pill Carousel (Left-aligned) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start">
          <button
            onClick={() => setSelectedPos("ALL")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${selectedPos === "ALL"
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
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${isSelected
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

        {/* Active Date Filter Notice Banner */}
        {selectedDate && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-pink-500/10 border border-purple-500/30 text-xs sm:text-sm text-purple-700 dark:text-purple-300 backdrop-blur-md animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-600 text-white shadow-sm">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <span>
                Filtering vocabulary saved on{" "}
                <strong className="font-bold text-slate-900 dark:text-white">
                  {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </strong>{" "}
                ({vocabularies.length} {vocabularies.length === 1 ? "word" : "words"} found)
              </span>
            </div>
            <button
              onClick={() => setSelectedDate(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-800 text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 font-bold border border-rose-200/60 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer shadow-sm text-xs"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Date Filter</span>
            </button>
          </div>
        )}
      </div>

      {/* Story Selection Mode Banner */}
      {isStorySelectMode && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-2 border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shrink-0 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
                <span>AI Story Selection Mode</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-extrabold">
                  {selectedStoryItems.length} selected
                </span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Click the square radio button on the top-left of any card to choose words (5–10 recommended). Then click &quot;Create Story&quot; at the bottom right.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {selectedStoryItems.length > 0 && (
              <button
                onClick={() => setSelectedStoryItems([])}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => {
                setIsStorySelectMode(false);
                setSelectedStoryItems([]);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              Exit Story Mode
            </button>
          </div>
        </div>
      )}

      {/* 3. Vocabulary Cards Section */}
      <div className="space-y-4">
        {/* TOP PAGINATION BAR */}
        {renderPaginationControls(true)}

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
                {selectedDate
                  ? `No vocabulary words found for ${new Date(
                    selectedDate + "T00:00:00"
                  ).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}. Try selecting another date with activity dots or reset filters.`
                  : searchQuery ||
                    selectedPos !== "ALL" ||
                    selectedStatus !== "ALL" ||
                    selectedLevel !== "ALL" ||
                    favoritesOnly ||
                    todayOnly
                    ? "No words matched your current search or filter criteria. Try resetting filters."
                    : "You haven't added any words to your vault yet. Add a word to generate with AI!"}
              </p>
            </div>
            <button
              onClick={() => {
                if (
                  selectedDate ||
                  searchQuery ||
                  selectedPos !== "ALL" ||
                  selectedStatus !== "ALL" ||
                  selectedLevel !== "ALL" ||
                  favoritesOnly ||
                  todayOnly
                ) {
                  setSearchQuery("");
                  setSelectedPos("ALL");
                  setSelectedStatus("ALL");
                  setSelectedLevel("ALL");
                  setFavoritesOnly(false);
                  setTodayOnly(false);
                  setSelectedDate(null);
                } else {
                  setIsModalOpen(true);
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md transition-colors cursor-pointer"
            >
              {selectedDate ||
                searchQuery ||
                selectedPos !== "ALL" ||
                selectedStatus !== "ALL" ||
                selectedLevel !== "ALL" ||
                favoritesOnly ||
                todayOnly ? (
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
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {paginatedVocabularies.map((item) => {
                  const posConfig = POS_COLORS[item.word.partOfSpeech] || POS_COLORS.NOUN;
                  const isAudioPlaying = playingWord === item.word.word;
                  const isFav = item.isFavorite || item.isFavourate;
                  const displayLevel = item.word.englishLevel || item.word.cefrLevel;
                  const isSelectedForStory = selectedStoryItems.some((s) => s.id === item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={isStorySelectMode ? () => handleToggleStoryWord(item) : undefined}
                      className={`group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-[#141226] border transition-all duration-300 overflow-hidden hover:-translate-y-0.5 ${isStorySelectMode && isSelectedForStory
                        ? "ring-2 ring-amber-500 border-amber-500 shadow-md shadow-amber-500/20 bg-amber-500/[0.03]"
                        : "border-slate-200/90 dark:border-white/10 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.12)] hover:border-indigo-500/40 dark:hover:border-indigo-500/40"
                        } ${isStorySelectMode ? "cursor-pointer" : ""}`}
                    >
                      {/* Top Accent Strip by Part of Speech */}
                      <div
                        className={`h-1 w-full bg-gradient-to-r ${item.word.partOfSpeech === "NOUN"
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
                      <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                        {/* Top: Word, Pronounce & Quick Action Icons */}
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            {/* Word Title & Audio */}
                            <div className="flex items-center gap-2 min-w-0 flex-wrap">
                              {/* Square Radio Button in Top Left */}
                              {isStorySelectMode && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleStoryWord(item);
                                  }}
                                  className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer shrink-0 ${isSelectedForStory
                                    ? "bg-amber-500 border-amber-500 text-white shadow-sm shadow-amber-500/30 scale-105"
                                    : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:border-amber-400"
                                    }`}
                                  title={isSelectedForStory ? "Deselect word" : "Select word for story"}
                                >
                                  {isSelectedForStory && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </button>
                              )}

                              <button
                                onClick={(e) => {
                                  if (isStorySelectMode) {
                                    e.stopPropagation();
                                    handleToggleStoryWord(item);
                                  } else {
                                    setFullscreenVocabId(item.id);
                                  }
                                }}
                                className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left cursor-pointer capitalize truncate"
                                title={`View ${item.word.word} full details`}
                              >
                                {item.word.word}
                              </button>

                              <button
                                onClick={() => playPronunciation(item.word.word)}
                                title="Listen pronunciation"
                                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 border ${isAudioPlaying
                                  ? "bg-indigo-600 text-white border-indigo-600 scale-105 shadow-sm shadow-indigo-500/40"
                                  : "bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-800/80"
                                  }`}
                              >
                                <Volume2 className={`w-3 h-3 ${isAudioPlaying ? "animate-pulse" : ""}`} />
                              </button>
                            </div>

                            {/* Action Icons: Edit / Favorite / Delete */}
                            <div className="flex items-center gap-0.5 shrink-0">
                              <button
                                onClick={() => handleOpenEditModal(item)}
                                title="Update vocabulary"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleToggleFavorite(item)}
                                title={isFav ? "Remove from favorites" : "Add to favorites"}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer border ${isFav
                                  ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
                                  }`}
                              >
                                <Star
                                  className={`w-3.5 h-3.5 ${isFav ? "fill-amber-400 text-amber-400" : ""}`}
                                />
                              </button>

                              <button
                                onClick={() => setItemToDelete(item)}
                                title="Delete word"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Tags: Part of Speech & CEFR & Status & Pronunciation */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${posConfig.bg} ${posConfig.text} ${posConfig.border}`}
                            >
                              {posConfig.label}
                            </span>

                            {displayLevel && (
                              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                {displayLevel}
                              </span>
                            )}

                            {item.status && item.status !== "LEARNING" && (
                              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                                {item.status}
                              </span>
                            )}

                            {item.word.ipa && (
                              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 ml-auto">
                                {item.word.ipa}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Bangla Meaning Box */}
                        <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-50/80 to-teal-50/60 dark:from-emerald-950/40 dark:to-teal-950/20 border border-emerald-500/20 dark:border-emerald-500/30 flex items-center justify-between gap-2">
                          <p className="text-xs sm:text-sm font-bold text-emerald-900 dark:text-emerald-300 truncate">
                            {item.word.banglaMeaning}
                          </p>
                          {item.word.banglaPronunciation && (
                            <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-900/50 px-2 py-0.5 rounded-md border border-emerald-300/60 dark:border-emerald-700/60">
                              <span className="text-[9px] opacity-70 font-normal">উচ্চারণ:</span>
                              <span>{item.word.banglaPronunciation}</span>
                            </span>
                          )}
                        </div>

                        {/* English Definition (Clean 2-line clamped preview) */}
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                          {item.word.meaning}
                        </p>

                        {/* Verb Forms Preview (if VERB) */}
                        {item.word.partOfSpeech === "VERB" && (() => {
                          const vf = item.word.verbForms || getVerbForms(item.word);
                          if (!vf) return null;
                          return (
                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-400 bg-emerald-50/50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-lg border border-emerald-200/50 dark:border-emerald-800/40 overflow-x-auto scrollbar-none">
                              <span className="font-bold text-emerald-700 dark:text-emerald-400 text-[10px] uppercase shrink-0">
                                Forms:
                              </span>
                              <span className="font-semibold text-slate-900 dark:text-slate-200" title="V1 (Base)">
                                {vf.v1}
                              </span>
                              <span className="text-slate-300 dark:text-slate-600 shrink-0">•</span>
                              <span className="font-semibold text-slate-900 dark:text-slate-200" title="V2 (Past Simple)">
                                {vf.v2}
                              </span>
                              <span className="text-slate-300 dark:text-slate-600 shrink-0">•</span>
                              <span className="font-semibold text-slate-900 dark:text-slate-200" title="V3 (Past Participle)">
                                {vf.v3}
                              </span>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Card Bottom Bar: Mastery Stars + Details (Full Screen) Button */}
                      <div className="px-4 py-2.5 bg-slate-50/90 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                        {/* Mastery Rating */}
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleSetMastery(item, star)}
                              title={`Set mastery to ${star} stars`}
                              className="p-0.5 hover:scale-125 transition-transform cursor-pointer"
                            >
                              <Star
                                className={`w-3.5 h-3.5 ${star <= (item.masteryLevel || 1)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-300 dark:text-slate-600"
                                  }`}
                              />
                            </button>
                          ))}
                        </div>

                        {/* Details -> Full Screen Button */}
                        <button
                          onClick={() => setFullscreenVocabId(item.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200/80 dark:border-indigo-800/80 transition-all hover:scale-[1.02] cursor-pointer"
                          title="View full screen details"
                        >
                          <Maximize2 className="w-3 h-3" />
                          <span>Details</span>
                        </button>
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
                        {isStorySelectMode && (
                          <th className="py-3 px-3 w-10 text-center">
                            <span className="sr-only">Select</span>
                          </th>
                        )}
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
                      {paginatedVocabularies.map((item) => {
                        const posConfig = POS_COLORS[item.word.partOfSpeech] || POS_COLORS.NOUN;
                        const isAudioPlaying = playingWord === item.word.word;
                        const isFav = item.isFavorite || item.isFavourate;
                        const displayLevel = item.word.englishLevel || item.word.cefrLevel;
                        const isSelectedForStory = selectedStoryItems.some((s) => s.id === item.id);

                        return (
                          <tr
                            key={item.id}
                            onClick={isStorySelectMode ? () => handleToggleStoryWord(item) : undefined}
                            className={`group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${isStorySelectMode && isSelectedForStory
                              ? "bg-amber-50/40 dark:bg-amber-500/10"
                              : ""
                              } ${isStorySelectMode ? "cursor-pointer" : ""}`}
                          >
                            {isStorySelectMode && (
                              <td className="py-3 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleStoryWord(item);
                                  }}
                                  className={`w-5 h-5 rounded-md border-2 inline-flex items-center justify-center transition-all cursor-pointer ${isSelectedForStory
                                    ? "bg-amber-500 border-amber-500 text-white shadow-2xs"
                                    : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:border-amber-400"
                                    }`}
                                >
                                  {isSelectedForStory && <Check className="w-3 h-3 stroke-[3]" />}
                                </button>
                              </td>
                            )}
                            {/* Word & Pronunciation */}
                            <td className="py-3 px-4 sm:px-6 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    if (isStorySelectMode) {
                                      e.stopPropagation();
                                      handleToggleStoryWord(item);
                                    } else {
                                      setFullscreenVocabId(item.id);
                                    }
                                  }}
                                  className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer capitalize text-sm"
                                >
                                  {item.word.word}
                                </button>
                                <button
                                  onClick={() => playPronunciation(item.word.word)}
                                  title="Listen pronunciation"
                                  className={`p-1 rounded-lg transition-colors cursor-pointer ${isAudioPlaying
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

                            {/* Bangla Meaning & Pronunciation */}
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span className="font-medium text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                                  {item.word.banglaMeaning}
                                </span>
                                {item.word.banglaPronunciation && (
                                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                                    উচ্চারণ: {item.word.banglaPronunciation}
                                  </span>
                                )}
                              </div>
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
                                      {getWordRelationText(syn)}
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
                                      className={`w-3.5 h-3.5 ${star <= (item.masteryLevel || 1)
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
                                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isFav
                                    ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    }`}
                                >
                                  <Star
                                    className={`w-3.5 h-3.5 ${isFav ? "fill-amber-400 text-amber-400" : ""}`}
                                  />
                                </button>

                                <button
                                  onClick={() => handleOpenEditModal(item)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                                  title="Update vocabulary"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  <span className="hidden xl:inline">Update</span>
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
                                  onClick={() => setItemToDelete(item)}
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

            {/* BOTTOM PAGINATION BAR */}
            {renderPaginationControls(false)}
          </>
        )}
      </div>

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
                  {(["LEARNING", "LEARNED", "MASTERED"] as VocabularyStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleSetStatus(activeFullscreenVocab, st)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${(activeFullscreenVocab.status || "LEARNING") === st
                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                        }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {/* Update Vocabulary Button */}
                <button
                  onClick={() => handleOpenEditModal(activeFullscreenVocab)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                  title="Update Vocabulary"
                >
                  <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="hidden sm:inline">Update</span>
                </button>

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
                  className={`p-2 rounded-xl transition-colors cursor-pointer border ${activeFullscreenVocab.isFavorite || activeFullscreenVocab.isFavourate
                    ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border-slate-200 dark:border-slate-700"
                    }`}
                >
                  <Star
                    className={`w-4 h-4 ${activeFullscreenVocab.isFavorite || activeFullscreenVocab.isFavourate
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
            <div className="flex-1 w-full min-h-0 overflow-y-auto lg:overflow-hidden p-3.5 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 z-10">
              {/* Left Column (Hero Card, Audio, Meaning, Word Family, Mastery) */}
              <div className="lg:col-span-5 lg:min-h-0 lg:h-full lg:overflow-y-auto pr-0 lg:pr-2 space-y-5 pb-4 lg:pb-8">
                <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                  {/* Top: Word, Level, POS, Audio Button */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${POS_COLORS[activeFullscreenVocab.word.partOfSpeech]?.bg || "bg-indigo-500/10"
                          } ${POS_COLORS[activeFullscreenVocab.word.partOfSpeech]?.text || "text-indigo-600 dark:text-indigo-400"
                          } ${POS_COLORS[activeFullscreenVocab.word.partOfSpeech]?.border || "border-indigo-500/30"
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
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight capitalize">
                            {activeFullscreenVocab.word.word}
                          </h1>
                          {activeFullscreenVocab.word.banglaPronunciation && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-sm sm:text-base font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/70 shadow-xs">
                              <span className="text-xs font-normal opacity-75">উচ্চারণ:</span>
                              <span>{activeFullscreenVocab.word.banglaPronunciation}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Natural Pronounce Button */}
                      <button
                        onClick={() => playPronunciation(activeFullscreenVocab.word.word)}
                        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border shrink-0 ${playingWord === activeFullscreenVocab.word.word
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                          : "bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                          }`}
                        title="Pronounce (Space / P)"
                      >
                        <Volume2
                          className={`w-4 h-4 ${playingWord === activeFullscreenVocab.word.word ? "animate-pulse" : ""
                            }`}
                        />
                        <span>
                          {playingWord === activeFullscreenVocab.word.word ? "Playing..." : "Pronounce"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Bangla Meaning Card */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-slate-50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-slate-800/60 border border-emerald-200/70 dark:border-emerald-800/60 space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Bangla Meaning (বাংলা অর্থ)
                      </span>
                      {activeFullscreenVocab.word.banglaPronunciation && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-emerald-100/80 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300/60 dark:border-emerald-700/60">
                          <span className="text-[10px] opacity-75 font-normal">উচ্চারণ:</span>
                          <span>{activeFullscreenVocab.word.banglaPronunciation}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
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

                  {/* Verb Forms (V1, V2, V3) - Shown for VERBs */}
                  {(() => {
                    const verbForms =
                      activeFullscreenVocab.word.verbForms ||
                      getVerbForms(activeFullscreenVocab.word);
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
                      ...(verbForms.vIng
                        ? [
                            {
                              code: "V-ing",
                              label: "Present Participle",
                              banglaLabel: "চলমান রূপ",
                              value: verbForms.vIng,
                            },
                          ]
                        : []),
                      ...(verbForms.v3s
                        ? [
                            {
                              code: "V-s/es",
                              label: "3rd Person Singular",
                              banglaLabel: "একবচন বর্তমান",
                              value: verbForms.v3s,
                            },
                          ]
                        : []),
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

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                  {activeFullscreenVocab.word.wordFamily &&
                    activeFullscreenVocab.word.wordFamily.length > 0 && (
                      <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                            Word Family
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {activeFullscreenVocab.word.wordFamily.map((wf: any, idx: number) => {
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
                                    title={`Google Translator-এ '${wfWord}' দেখুন`}
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
                          onClick={() => handleSetMastery(activeFullscreenVocab, star)}
                          className="p-1 hover:scale-125 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-4 h-4 ${star <= (activeFullscreenVocab.masteryLevel || 1)
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
              <div className="lg:col-span-7 lg:min-h-0 lg:h-full lg:overflow-y-auto pr-0 lg:pr-2 space-y-5 pb-8">
                {/* Collocations */}
                {activeFullscreenVocab.word.collocations &&
                  activeFullscreenVocab.word.collocations.length > 0 && (
                    <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Layers className="w-4 h-4 text-indigo-500 shrink-0" />
                          <span>Collocations & Common Phrases</span>
                        </h3>
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200/60 dark:border-slate-700/60">
                          {activeFullscreenVocab.word.collocations.length} phrases
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                        {activeFullscreenVocab.word.collocations.map((col, idx) => {
                          const colText = getCollocationText(col);
                          const meaning = getCollocationMeaning(col);
                          const rawBangla = getCollocationBangla(col, activeFullscreenVocab.word);
                          const rawExample = getCollocationExample(col, activeFullscreenVocab.word);

                          const bangla =
                            rawBangla ||
                            (activeFullscreenVocab.word.banglaMeaning
                              ? `${activeFullscreenVocab.word.banglaMeaning.split(/[,/]/)[0].trim()} সম্পর্কিত ভাবার্থ`
                              : `${colText}-এর বাংলা ভাবার্থ`);

                          const example =
                            rawExample ||
                            `Using "${colText}" helps express ideas naturally in practical English.`;

                          return (
                            <div
                              key={idx}
                              className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/90 dark:border-slate-700/70 hover:border-indigo-300 dark:hover:border-indigo-500/60 hover:bg-white dark:hover:bg-slate-800/80 transition-all shadow-xs flex flex-col justify-between gap-3 group"
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
                            {getWordRelationText(syn)}
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
                            {getWordRelationText(ant)}
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
                  className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold border ${feedbackMessage.type === "success"
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

      {/* 6. Update / Edit Vocabulary Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white capitalize">
                      Update &apos;{editingItem.word.word}&apos;
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${POS_COLORS[editingItem.word.partOfSpeech]?.bg || "bg-indigo-500/10"
                        } ${POS_COLORS[editingItem.word.partOfSpeech]?.text || "text-indigo-600 dark:text-indigo-400"
                        } ${POS_COLORS[editingItem.word.partOfSpeech]?.border || "border-indigo-500/30"
                        }`}
                    >
                      {POS_COLORS[editingItem.word.partOfSpeech]?.label || editingItem.word.partOfSpeech}
                    </span>
                    {editingItem.word.banglaPronunciation && (
                      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md border border-indigo-200/60 dark:border-indigo-800/60">
                        উচ্চারণ: {editingItem.word.banglaPronunciation}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {editingItem.word.banglaMeaning}
                  </p>
                </div>
              </div>

              <button
                onClick={() => !isSavingEdit && setEditingItem(null)}
                disabled={isSavingEdit}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Scrollable Form */}
            <form onSubmit={handleSaveEdit} className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 min-h-0">
              {/* Status & Favorite Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Status Switcher */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Vocabulary Status
                  </label>
                  <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    {[
                      { id: "LEARNING", label: "Learning" },
                      { id: "LEARNED", label: "Learned" },
                      { id: "MASTERED", label: "Mastered" },
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setEditStatus(st.id)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center ${editStatus === st.id
                          ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm"
                          : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                          }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Favorite Toggle */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Favorite Status
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditIsFavorite((prev) => !prev)}
                    className={`w-full py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${editIsFavorite
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                  >
                    <Star
                      className={`w-4 h-4 ${editIsFavorite ? "fill-amber-400 text-amber-400" : "text-slate-400"
                        }`}
                    />
                    <span>{editIsFavorite ? "Marked as Favorite" : "Add to Favorites"}</span>
                  </button>
                </div>
              </div>

              {/* My Practice Sentences */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                    Practice Sentences ({editSentences.length})
                  </label>
                  <span className="text-[11px] text-slate-400">Add personal usage</span>
                </div>

                {/* Sentences List */}
                {editSentences.length > 0 ? (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {editSentences.map((sentence, idx) => (
                      <div
                        key={idx}
                        className="group flex items-start justify-between gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
                      >
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                          <span className="leading-relaxed break-words">{sentence}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSentence(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer shrink-0 rounded"
                          title="Remove sentence"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic py-1">
                    No practice sentences added yet. Write one below!
                  </p>
                )}

                {/* Add Sentence Input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Write a new sentence with this word..."
                    value={editNewSentence}
                    onChange={(e) => setEditNewSentence(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSentenceToEdit();
                      }
                    }}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSentenceToEdit}
                    disabled={!editNewSentence.trim()}
                    className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-indigo-200 dark:border-indigo-800 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Study Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-500" />
                  Study Notes & Mnemonics
                </label>
                <textarea
                  rows={3}
                  placeholder='e.g. Remember to use with prepositions "in" or "for". IELTS Speaking Part 2...'
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Feedback Banner */}
              {editFeedback && (
                <div
                  className={`p-3.5 rounded-xl flex items-center gap-2.5 text-xs font-semibold border ${editFeedback.type === "success"
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20"
                    }`}
                >
                  {editFeedback.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  )}
                  <span>{editFeedback.text}</span>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  disabled={isSavingEdit}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  {isSavingEdit ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Sweet Custom Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#141226] border border-rose-500/20 dark:border-rose-500/30 shadow-[0_25px_60px_-15px_rgba(244,63,94,0.3)] overflow-hidden animate-in zoom-in-95 duration-150 p-6 space-y-5">
            {/* Glow decorative background */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header with animated icon and close */}
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-inner">
                <Trash2 className="w-6 h-6" />
              </div>
              <button
                onClick={() => !isDeleting && setItemToDelete(null)}
                disabled={isDeleting}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title and Message */}
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Remove Word from Vault?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Are you sure you want to remove this vocabulary item? You can re-add it anytime with AI.
              </p>
            </div>

            {/* Word Preview Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white capitalize">
                    {itemToDelete.word.word}
                  </h4>
                  {itemToDelete.word.banglaPronunciation && (
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.5 rounded border border-indigo-200/60 dark:border-indigo-800/60">
                      উচ্চারণ: {itemToDelete.word.banglaPronunciation}
                    </span>
                  )}
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium mt-0.5">
                  {itemToDelete.word.banglaMeaning}
                </p>
              </div>
              <span
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${POS_COLORS[itemToDelete.word.partOfSpeech]?.bg || "bg-indigo-500/10"
                  } ${POS_COLORS[itemToDelete.word.partOfSpeech]?.text || "text-indigo-600 dark:text-indigo-400"
                  } ${POS_COLORS[itemToDelete.word.partOfSpeech]?.border || "border-indigo-500/30"
                  }`}
              >
                {POS_COLORS[itemToDelete.word.partOfSpeech]?.label || itemToDelete.word.partOfSpeech}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Keep Word
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold shadow-lg shadow-rose-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Removing...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Remove Word</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Floating Create Story Button (Bottom Right) */}
      {isStorySelectMode && (
        <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <button
            type="button"
            onClick={() => {
              if (selectedStoryItems.length === 0) {
                alert("Please select at least 1 vocabulary word (recommended 5 to 10) to create your story.");
                return;
              }
              setStoryCreationError(null);
              setIsStoryContextModalOpen(true);
            }}
            className="group flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 text-white font-bold text-sm sm:text-base shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/60 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
            title="Create story with selected vocabulary"
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
            </div>
            <span>Create Story</span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/25 text-xs font-black tracking-wide">
              {selectedStoryItems.length}
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      )}

      {/* 9. Story Context Popup Modal */}
      {isStoryContextModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#141226] border border-amber-500/30 shadow-2xl p-6 sm:p-8 space-y-5 animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Create AI Vocabulary Story
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedStoryItems.length} {selectedStoryItems.length === 1 ? "word" : "words"} chosen for this story
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!isCreatingStory) setIsStoryContextModalOpen(false);
                }}
                disabled={isCreatingStory}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selected Words Pill List */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Selected Words ({selectedStoryItems.length}):
                </label>
                <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                  {selectedStoryItems.length >= 5 ? "Great selection! ✨" : "5–10 recommended"}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                {selectedStoryItems.map((item) => (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-2xs capitalize"
                  >
                    <span>{item.word?.word}</span>
                    {!isCreatingStory && (
                      <button
                        type="button"
                        onClick={() => handleToggleStoryWord(item)}
                        className="text-slate-400 hover:text-rose-500 transition-colors ml-0.5 cursor-pointer"
                        title="Remove word"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Context Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Story Context / Theme (Optional)</span>
                <span className="text-[11px] font-normal text-slate-400">Optional</span>
              </label>
              <textarea
                rows={3}
                value={storyContext}
                onChange={(e) => setStoryContext(e.target.value)}
                disabled={isCreatingStory}
                placeholder="e.g., A rainy day in Dhaka preparing for an IELTS exam, a conversation at an airport, a tech startup pitch, or a campus memory..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition resize-none disabled:opacity-50"
              />
            </div>

            {/* Generation Info Banner */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-200 space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Dual Language Generation</span>
              </p>
              <p className="text-[11px] opacity-90">
                Will generate both a 🇧🇩 Bangla-English mixed narrative and a 🇬🇧 natural full English narrative incorporating your words.
              </p>
            </div>

            {/* Error Message if any */}
            {storyCreationError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{storyCreationError}</span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsStoryContextModalOpen(false)}
                disabled={isCreatingStory}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteStoryGeneration}
                disabled={isCreatingStory || selectedStoryItems.length === 0}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                {isCreatingStory ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Creating Story...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>OK, Create Story</span>
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

