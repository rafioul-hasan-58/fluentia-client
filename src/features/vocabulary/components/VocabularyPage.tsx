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
  Clock,
  ExternalLink,
} from "lucide-react";
import { ALL_POS_OPTIONS, highlightPhrase, POS_COLORS } from "../constants/vocabularyConstants";
import VocabularyHeader from "./VocabularyHeader";
import VocabularyFilterBar from "./VocabularyFilterBar";
import VocabularyStoryBanner from "./VocabularyStoryBanner";
import VocabularyPagination from "./VocabularyPagination";
import VocabularyCard from "./VocabularyCard";
import VocabularyTableView from "./VocabularyTableView";
import VocabularyFullscreenModal from "./modals/VocabularyFullscreenModal";



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

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header Banner & Action */}
      <VocabularyHeader
        stats={stats}
        todayOnly={todayOnly}
        setTodayOnly={setTodayOnly}
        setSelectedDate={setSelectedDate}
        isStorySelectMode={isStorySelectMode}
        setIsStorySelectMode={setIsStorySelectMode}
        selectedStoryItems={selectedStoryItems}
        setSelectedStoryItems={setSelectedStoryItems}
        setIsModalOpen={setIsModalOpen}
      />

      {/* 2. Search, Filter & Controls */}
      <VocabularyFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedPos={selectedPos}
        setSelectedPos={setSelectedPos}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
        selectedSort={selectedSort}
        setSelectedSort={setSelectedSort}
        favoritesOnly={favoritesOnly}
        setFavoritesOnly={setFavoritesOnly}
        todayOnly={todayOnly}
        setTodayOnly={setTodayOnly}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        calendarWordCounts={calendarWordCounts}
        viewMode={viewMode}
        setViewMode={setViewMode}
        loadVocabularies={loadVocabularies}
        isLoading={isLoading}
        isStorySelectMode={isStorySelectMode}
        setIsStorySelectMode={setIsStorySelectMode}
        selectedStoryItems={selectedStoryItems}
        setSelectedStoryItems={setSelectedStoryItems}
        stats={stats}
        totalFoundCount={vocabularies.length}
      />

      {/* Story Selection Mode Banner */}
      <VocabularyStoryBanner
        isStorySelectMode={isStorySelectMode}
        selectedStoryItems={selectedStoryItems}
        setIsStorySelectMode={setIsStorySelectMode}
        setSelectedStoryItems={setSelectedStoryItems}
      />

      {/* 3. Vocabulary Cards Section */}
      <div className="space-y-4">
        {/* TOP PAGINATION BAR */}
        <VocabularyPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          startRecord={startRecord}
          endRecord={endRecord}
          pageSize={pageSize}
          setPageSize={setPageSize}
          isLoading={isLoading}
          isTopPosition={true}
        />

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
                {paginatedVocabularies.map((item) => (
                  <VocabularyCard
                    key={item.id}
                    item={item}
                    isStorySelectMode={isStorySelectMode}
                    isSelectedForStory={selectedStoryItems.some((s) => s.id === item.id)}
                    handleToggleStoryWord={handleToggleStoryWord}
                    playingWord={playingWord}
                    playPronunciation={playPronunciation}
                    handleToggleFavorite={handleToggleFavorite}
                    handleOpenEditModal={handleOpenEditModal}
                    setItemToDelete={setItemToDelete}
                    handleSetMastery={handleSetMastery}
                    setFullscreenVocabId={setFullscreenVocabId}
                  />
                ))}
              </div>
            ) : (
              <VocabularyTableView
                items={paginatedVocabularies}
                isStorySelectMode={isStorySelectMode}
                selectedStoryItems={selectedStoryItems}
                handleToggleStoryWord={handleToggleStoryWord}
                playingWord={playingWord}
                playPronunciation={playPronunciation}
                handleToggleFavorite={handleToggleFavorite}
                handleOpenEditModal={handleOpenEditModal}
                setItemToDelete={setItemToDelete}
                handleSetMastery={handleSetMastery}
                setFullscreenVocabId={setFullscreenVocabId}
              />
            )}

            <VocabularyPagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              startRecord={startRecord}
              endRecord={endRecord}
              pageSize={pageSize}
              setPageSize={setPageSize}
              isLoading={isLoading}
              isTopPosition={false}
            />
          </>
        )
        }
      </div >

      {/* 4. Fullscreen Single Vocabulary Portal View */}
      <VocabularyFullscreenModal
        isMounted={isMounted}
        activeFullscreenVocab={activeFullscreenVocab}
        activeFullscreenIndex={activeFullscreenIndex}
        vocabularies={vocabularies}
        setFullscreenVocabId={setFullscreenVocabId}
        navigateFullscreen={navigateFullscreen}
        handleSetStatus={handleSetStatus}
        handleOpenEditModal={handleOpenEditModal}
        handleToggleFavorite={handleToggleFavorite}
        playPronunciation={playPronunciation}
        playingWord={playingWord}
        handleSetMastery={handleSetMastery}
        newSentenceInputs={newSentenceInputs}
        setNewSentenceInputs={setNewSentenceInputs}
        handleAddSentence={handleAddSentence}
        editingNotes={editingNotes}
        setEditingNotes={setEditingNotes}
        handleSaveNotes={handleSaveNotes}
        savingNoteId={savingNoteId}
      />

      {/* 5. Add Vocabulary Modal (Single Word Focused) */}
      {
        isModalOpen && (
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
        )
      }

      {/* 6. Update / Edit Vocabulary Modal */}
      {
        editingItem && (
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
        )
      }

      {/* 7. Sweet Custom Delete Confirmation Modal */}
      {
        itemToDelete && (
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
        )
      }

      {/* 8. Floating Create Story Button (Bottom Right) */}
      {
        isStorySelectMode && (
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
        )
      }

      {/* 9. Story Context Popup Modal */}
      {
        isStoryContextModalOpen && (
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
        )
      }
    </div >
  );
}

