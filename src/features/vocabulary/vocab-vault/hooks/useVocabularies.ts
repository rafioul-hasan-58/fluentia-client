"use client";

import { IMeta, MyVocabularyItem, PartOfSpeech, VocabularyStats, VocabularyStatus } from "@/types";
import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { deleteMyVocabulary, fetchMyVocabularies, fetchMyVocabularyStats, updateMyVocabulary } from "../api";

export function useVocabularies() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [stats, setStats] = useState<VocabularyStats | null>(null);

  // Pagination state derived from URL
  const currentPage = Number(searchParams?.get("page")) || 1;
  const [pageSize, setPageSize] = useState<number>(12);

  const setCurrentPage = useCallback(
    (pageOrUpdater: number | ((prev: number) => number)) => {
      const newPage =
        typeof pageOrUpdater === "function"
          ? pageOrUpdater(currentPage)
          : pageOrUpdater;

      const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
      params.set("page", String(newPage));
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [currentPage, pathname, router, searchParams]
  );

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


  // 1. Debounce search query (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const isMountedRef = useRef(false);
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

  // 2. Reset currentPage to 1 whenever any filter changes (skip initial mount)
  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }

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

    if (hasFilterChanged && currentPage !== 1) {
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
    currentPage,
    setCurrentPage,
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

  // 4. Declarative query key and useQuery for vocabulary list
  const queryKey = [
    "vocabularies",
    {
      page: currentPage,
      limit: pageSize,
      search: debouncedSearchQuery,
      partOfSpeech: selectedPos,
      status: selectedStatus,
      englishLevel: selectedLevel,
      masteryLevel: selectedMastery,
      sortBy: selectedSort,
      favoritesOnly,
      todayOnly,
      selectedDate,
    },
  ] as const;

  const {
    data,
    isLoading,
    isFetching,
    refetch: refetchVocabularies,
  } = useQuery({
    queryKey,
    queryFn: ({ signal }) =>
      fetchMyVocabularies(
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
        signal
      ),
    staleTime: 60 * 1000,
  });

  const vocabularies = data?.data ?? [];
  const meta = data?.meta ?? null;

  // Pre-seed individual word detail queries in TanStack cache from findAll for instant detail page loading
  useEffect(() => {
    if (data?.data && Array.isArray(data.data)) {
      data.data.forEach((item) => {
        const cleanWord = (item.word?.word || "").trim().toLowerCase();
        if (cleanWord) {
          queryClient.setQueryData(["vocabulary-detail", cleanWord], item);
        }
      });
    }
  }, [data?.data, queryClient]);

  // Stage 6: If meta.total > 0 but page returned empty (out of bounds), auto-redirect
  useEffect(() => {
    if (
      meta &&
      meta.total > 0 &&
      vocabularies.length === 0 &&
      currentPage > meta.totalPages
    ) {
      setCurrentPage(meta.totalPages);
    }
  }, [meta, vocabularies.length, currentPage, setCurrentPage]);

  // Query-cache updater for optimistic mutations
  const setVocabularies = useCallback(
    (updater: MyVocabularyItem[] | ((prev: MyVocabularyItem[]) => MyVocabularyItem[])) => {
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        const currentList = old.data || [];
        const updatedList =
          typeof updater === "function" ? updater(currentList) : updater;

        if (Array.isArray(updatedList)) {
          updatedList.forEach((item) => {
            const cleanWord = (item.word?.word || "").trim().toLowerCase();
            if (cleanWord) {
              queryClient.setQueryData(["vocabulary-detail", cleanWord], item);
            }
          });
        }

        return { ...old, data: updatedList };
      });
    },
    [queryClient, queryKey]
  );

  const setMeta = useCallback(
    (updater: IMeta | null | ((prev: IMeta | null) => IMeta | null)) => {
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        const currentMeta = old.meta || null;
        const updatedMeta =
          typeof updater === "function" ? updater(currentMeta) : updater;
        return { ...old, meta: updatedMeta };
      });
    },
    [queryClient, queryKey]
  );

  // Combined reload function (e.g. for refresh button or after adding word)
  const loadVocabularies = useCallback(async () => {
    await Promise.all([refetchVocabularies(), fetchStats()]);
  }, [refetchVocabularies, fetchStats]);

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
      await refetchVocabularies();
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
    isFetching,
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
