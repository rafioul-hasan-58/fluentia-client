"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  IMeta,
  MyVocabularyItem,
  PartOfSpeech,
  VocabularyStatus,
  VocabularyStats,
} from "@/features/vocabulary/types/vocabulary";
import {
  fetchMyVocabularies,
  fetchMyVocabularyStats,
  updateMyVocabulary,
  deleteMyVocabulary,
} from "@/features/vocabulary/api";

export function useVocabularies() {
  // Vocabulary data (single page at a time)
  const [vocabularies, setVocabularies] = useState<MyVocabularyItem[]>([]);
  const [meta, setMeta] = useState<IMeta | null>(null);
  const [stats, setStats] = useState<VocabularyStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Pagination state (default: 12 per screen, matching Question Bank)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);

  // Filter state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [selectedPos, setSelectedPos] = useState<PartOfSpeech | "ALL">("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [selectedSort, setSelectedSort] = useState<"asc" | "desc">("desc");
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);
  const [todayOnly, setTodayOnly] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Deletion modal state
  const [itemToDelete, setItemToDelete] = useState<MyVocabularyItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Inline notes editing tracker
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null);

  // Inline sentence builder tracker
  const [newSentenceInputs, setNewSentenceInputs] = useState<Record<string, string>>({});

  // Active AbortController for page requests
  const abortControllerRef = useRef<AbortController | null>(null);

  // 1. Debounce search query (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // 2. Reset currentPage to 1 whenever any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    debouncedSearchQuery,
    selectedPos,
    selectedStatus,
    selectedLevel,
    selectedSort,
    favoritesOnly,
    todayOnly,
    selectedDate,
    pageSize,
  ]);

  // 3. Fetch vocabulary stats from dedicated endpoint GET /my-vocabularies/stats?month=YYYY-MM
  const fetchStats = useCallback(async (month?: string) => {
    try {
      const targetMonth =
        month ||
        `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
      const data = await fetchMyVocabularyStats(targetMonth);
      if (data) {
        setStats(data);
      }
    } catch (err) {
      console.warn("Failed to fetch vocabulary stats", err);
    }
  }, []);

  // Load stats once on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // 4. Fetch server-side paginated list with AbortController
  const fetchFilteredList = useCallback(async () => {
    // Abort previous in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    try {
      const res = await fetchMyVocabularies(
        {
          page: currentPage,
          limit: pageSize,
          search: debouncedSearchQuery,
          partOfSpeech: selectedPos,
          status: selectedStatus !== "ALL" ? (selectedStatus as any) : undefined,
          englishLevel: selectedLevel !== "ALL" ? selectedLevel : undefined,
          sortBy: selectedSort,
          favoritesOnly,
          todayOnly,
          selectedDate,
        },
        controller.signal
      );

      if (!controller.signal.aborted) {
        setVocabularies(res.data);
        setMeta(res.meta);

        // Stage 6: If meta.total > 0 but page returned empty (out of bounds), auto-redirect
        if (
          res.meta &&
          res.meta.total > 0 &&
          res.data.length === 0 &&
          currentPage > res.meta.totalPages
        ) {
          setCurrentPage(res.meta.totalPages);
        }
      }
    } catch (err: any) {
      if (err?.name !== "AbortError" && !controller.signal.aborted) {
        console.error("Failed to load filtered vocabularies", err);
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [
    currentPage,
    pageSize,
    debouncedSearchQuery,
    selectedPos,
    selectedStatus,
    selectedLevel,
    selectedSort,
    favoritesOnly,
    todayOnly,
    selectedDate,
  ]);

  // Refetch whenever currentPage or any filter dependencies change
  useEffect(() => {
    fetchFilteredList();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchFilteredList]);

  // Combined reload function (e.g. for refresh button or after adding word)
  const loadVocabularies = useCallback(async () => {
    await Promise.all([fetchFilteredList(), fetchStats()]);
  }, [fetchFilteredList, fetchStats]);

  // Mutation: Toggle favorite
  const handleToggleFavorite = async (item: MyVocabularyItem) => {
    const isCurrentlyFav = item.isFavorite || false;
    const updatedFav = !isCurrentlyFav;

    setVocabularies((prev) =>
      prev.map((v) => (v.id === item.id ? { ...v, isFavorite: updatedFav } : v))
    );

    // Optimistic stats favorite count adjustment
    if (stats) {
      setStats({
        ...stats,
        favoriteCount: Math.max(0, stats.favoriteCount + (updatedFav ? 1 : -1)),
      });
    }

    try {
      await updateMyVocabulary(item.id, {
        isFavorite: updatedFav,
      });
      // Sync fresh stats
      fetchStats();
    } catch (err) {
      console.warn("Could not sync favorite toggle", err);
      // Revert optimistic update
      setVocabularies((prev) =>
        prev.map((v) => (v.id === item.id ? { ...v, isFavorite: isCurrentlyFav } : v))
      );
      fetchStats();
    }
  };

  // Mutation: Toggle status (LEARNING / MASTERED / REVIEWING)
  const handleSetStatus = async (item: MyVocabularyItem, status: VocabularyStatus) => {
    const oldStatus = item.vocabularyStatus;
    setVocabularies((prev) =>
      prev.map((v) => (v.id === item.id ? { ...v, vocabularyStatus: status } : v))
    );

    try {
      await updateMyVocabulary(item.id, { vocabularyStatus: status });
      fetchStats();
    } catch (err) {
      console.warn("Could not sync status update", err);
      setVocabularies((prev) =>
        prev.map((v) => (v.id === item.id ? { ...v, vocabularyStatus: oldStatus } : v))
      );
    }
  };

  // Mutation: Rate mastery (1-5)
  const handleSetMastery = async (item: MyVocabularyItem, level: number) => {
    setVocabularies((prev) =>
      prev.map((v) => (v.id === item.id ? { ...v, masteryLevel: level } : v))
    );

    try {
      await updateMyVocabulary(item.id, { masteryLevel: level });
      fetchStats();
    } catch (err) {
      console.warn("Could not sync mastery update", err);
    }
  };

  // Mutation: Add Practice Sentence
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

  // Mutation: Save Notes
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

  // Mutation: Delete word confirmation
  const handleConfirmDelete = async (onDeleted?: (id: string) => void) => {
    if (!itemToDelete) return;
    const targetId = itemToDelete.id;
    setIsDeleting(true);

    if (onDeleted) {
      onDeleted(targetId);
    }

    try {
      await deleteMyVocabulary(targetId);
      // Reload stats and refetch current page
      await fetchStats();
      await fetchFilteredList();
    } catch (err) {
      console.warn("Could not sync deletion", err);
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  return {
    vocabularies,
    meta,
    stats,
    isLoading,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    filters: {
      searchQuery,
      debouncedSearchQuery,
      selectedPos,
      selectedStatus,
      selectedLevel,
      selectedSort,
      favoritesOnly,
      todayOnly,
      selectedDate,
    },
    setters: {
      setSearchQuery,
      setSelectedPos,
      setSelectedStatus,
      setSelectedLevel,
      setSelectedSort,
      setFavoritesOnly,
      setTodayOnly,
      setSelectedDate,
      setVocabularies,
      setMeta,
      setStats,
    },
    loadVocabularies,
    fetchStats,
    handleToggleFavorite,
    handleSetStatus,
    handleSetMastery,
    handleAddSentence,
    handleSaveNotes,
    handleConfirmDelete,
    itemToDelete,
    setItemToDelete,
    isDeleting,
    editingNotes,
    setEditingNotes,
    savingNoteId,
    newSentenceInputs,
    setNewSentenceInputs,
  };
}
