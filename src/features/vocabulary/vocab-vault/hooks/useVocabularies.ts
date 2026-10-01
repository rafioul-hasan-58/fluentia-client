"use client";

import { IMeta, MyVocabularyItem, PartOfSpeech, VocabularyStats, VocabularyStatus } from "@/types";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { deleteMyVocabulary, fetchMyVocabularies, fetchMyVocabularyStats, updateMyVocabulary } from "../api";

export interface UseVocabulariesOptions {
  initialPage?: number;
  initialLimit?: number;
}

export function useVocabularies(options?: UseVocabulariesOptions) {
  const searchParams = useSearchParams();
  const pageParam = searchParams?.get("page");
  const limitParam = searchParams?.get("limit");

  const initialLimit = useMemo(() => {
    if (options?.initialLimit && options.initialLimit > 0) {
      return options.initialLimit;
    }
    const parsed = limitParam ? parseInt(limitParam, 10) : 12;
    return isNaN(parsed) || parsed <= 0 ? 12 : parsed;
  }, [options?.initialLimit, limitParam]);

  const initialPage = useMemo(() => {
    if (options?.initialPage && options.initialPage > 0) {
      return options.initialPage;
    }
    if (pageParam) {
      const parsed = parseInt(pageParam, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    if (typeof window !== "undefined") {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const winPage = urlParams.get("page");
        if (winPage) {
          const parsed = parseInt(winPage, 10);
          if (!isNaN(parsed) && parsed > 0) return parsed;
        }
        const saved = sessionStorage.getItem("fluentia_vocab_page");
        if (saved) {
          const parsed = parseInt(saved, 10);
          if (!isNaN(parsed) && parsed > 0) return parsed;
        }
      } catch {}
    }
    return 1;
  }, [options?.initialPage, pageParam]);

  // Vocabulary data (single page at a time)
  const [vocabularies, setVocabularies] = useState<MyVocabularyItem[]>([]);
  const [meta, setMeta] = useState<IMeta | null>(null);
  const [stats, setStats] = useState<VocabularyStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Pagination state (default: 12 per screen, matching Question Bank)
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialLimit);

  // Sync state if URL query params change (e.g. browser back/forward)
  useEffect(() => {
    if (pageParam) {
      const parsed = parseInt(pageParam, 10);
      if (!isNaN(parsed) && parsed > 0 && parsed !== currentPage) {
        setCurrentPage(parsed);
      }
    } else if (initialPage > 1 && currentPage === 1) {
      setCurrentPage(initialPage);
    }
  }, [pageParam, initialPage, currentPage]);

  useEffect(() => {
    if (limitParam) {
      const parsed = parseInt(limitParam, 10);
      if (!isNaN(parsed) && parsed > 0 && parsed !== pageSize) {
        setPageSize(parsed);
      }
    }
  }, [limitParam]);

  // Persist current page to sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined" && currentPage > 0) {
      try {
        sessionStorage.setItem("fluentia_vocab_page", String(currentPage));
      } catch {}
    }
  }, [currentPage]);

  // Sync browser URL search params when currentPage or pageSize changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      let changed = false;

      if (currentPage > 1) {
        if (url.searchParams.get("page") !== String(currentPage)) {
          url.searchParams.set("page", String(currentPage));
          changed = true;
        }
      } else {
        if (url.searchParams.has("page")) {
          url.searchParams.delete("page");
          changed = true;
        }
      }

      if (pageSize !== 12) {
        if (url.searchParams.get("limit") !== String(pageSize)) {
          url.searchParams.set("limit", String(pageSize));
          changed = true;
        }
      } else {
        if (url.searchParams.has("limit")) {
          url.searchParams.delete("limit");
          changed = true;
        }
      }

      if (changed) {
        window.history.replaceState(null, "", url.toString());
      }
    }
  }, [currentPage, pageSize]);

  // Filter state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [selectedPos, setSelectedPos] = useState<PartOfSpeech | "ALL">("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [selectedMastery, setSelectedMastery] = useState<string>("ALL");
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

  const prevFiltersRef = useRef({
    debouncedSearchQuery,
    selectedPos,
    selectedStatus,
    selectedLevel,
    selectedMastery,
    selectedSort,
    favoritesOnly,
    todayOnly,
    selectedDate,
    pageSize,
  });

  // 2. Reset currentPage to 1 only when filters actually change
  useEffect(() => {
    const prev = prevFiltersRef.current;
    const hasFilterChanged =
      prev.debouncedSearchQuery !== debouncedSearchQuery ||
      prev.selectedPos !== selectedPos ||
      prev.selectedStatus !== selectedStatus ||
      prev.selectedLevel !== selectedLevel ||
      prev.selectedMastery !== selectedMastery ||
      prev.selectedSort !== selectedSort ||
      prev.favoritesOnly !== favoritesOnly ||
      prev.todayOnly !== todayOnly ||
      prev.selectedDate !== selectedDate ||
      prev.pageSize !== pageSize;

    prevFiltersRef.current = {
      debouncedSearchQuery,
      selectedPos,
      selectedStatus,
      selectedLevel,
      selectedMastery,
      selectedSort,
      favoritesOnly,
      todayOnly,
      selectedDate,
      pageSize,
    };

    if (hasFilterChanged) {
      setCurrentPage(1);
    }
  }, [
    debouncedSearchQuery,
    selectedPos,
    selectedStatus,
    selectedLevel,
    selectedMastery,
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
          masteryLevel:
            selectedMastery !== "ALL" ? selectedMastery : undefined,
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
    selectedMastery,
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
      selectedMastery,
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
      setSelectedMastery,
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
