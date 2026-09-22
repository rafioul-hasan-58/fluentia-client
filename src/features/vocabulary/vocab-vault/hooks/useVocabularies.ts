"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  IMeta,
  MyVocabularyItem,
  PartOfSpeech,
  VocabularyStatus,
} from "@/features/vocabulary/types/vocabulary";
import {
  fetchMyVocabularies,
  updateMyVocabulary,
  deleteMyVocabulary,
} from "@/features/vocabulary/api";

export function useVocabularies() {
  // Vocabulary data
  const [vocabularies, setVocabularies] = useState<MyVocabularyItem[]>([]);
  const [allVaultWords, setAllVaultWords] = useState<MyVocabularyItem[]>([]);
  const [meta, setMeta] = useState<IMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filter state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [selectedPos, setSelectedPos] = useState<PartOfSpeech | "ALL">("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [selectedSort, setSelectedSort] = useState<"recent" | "alphabetical" | "mastery">("recent");
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

  // Active AbortController for filtered fetch
  const abortControllerRef = useRef<AbortController | null>(null);

  // 1. Debounce search query (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // 2. Fetch full vault (runs once on mount, and callable after mutations)
  const fetchFullVault = useCallback(async () => {
    try {
      const res = await fetchMyVocabularies({ limit: 100 });
      setAllVaultWords(res.data);
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        console.error("Failed to fetch full vault words", err);
      }
    }
  }, []);

  useEffect(() => {
    fetchFullVault();
  }, [fetchFullVault]);

  // 3. Fetch filtered list with AbortController to prevent race conditions
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
          search: debouncedSearchQuery,
          partOfSpeech: selectedPos,
          status: selectedStatus !== "ALL" ? (selectedStatus as any) : undefined,
          englishLevel: selectedLevel !== "ALL" ? selectedLevel : undefined,
          sortBy: selectedSort,
          favoritesOnly,
          todayOnly,
          selectedDate,
          limit: 100,
        },
        controller.signal
      );

      if (!controller.signal.aborted) {
        setVocabularies(res.data);
        setMeta(res.meta);
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
    debouncedSearchQuery,
    selectedPos,
    selectedStatus,
    selectedLevel,
    selectedSort,
    favoritesOnly,
    todayOnly,
    selectedDate,
  ]);

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
    await Promise.all([fetchFilteredList(), fetchFullVault()]);
  }, [fetchFilteredList, fetchFullVault]);

  // Mutation: Toggle favorite
  const handleToggleFavorite = async (item: MyVocabularyItem) => {
    const isCurrentlyFav = item.isFavorite || item.isFavourate || false;
    const updatedFav = !isCurrentlyFav;

    const updater = (prev: MyVocabularyItem[]) =>
      prev.map((v) =>
        v.id === item.id
          ? { ...v, isFavorite: updatedFav, isFavourate: updatedFav }
          : v
      );

    setVocabularies(updater);
    setAllVaultWords(updater);

    try {
      await updateMyVocabulary(item.id, {
        isFavorite: updatedFav,
        isFavourate: updatedFav,
      });
    } catch (err) {
      console.warn("Could not sync favorite toggle", err);
    }
  };

  // Mutation: Toggle status (LEARNING / MASTERED / REVIEWING)
  const handleSetStatus = async (item: MyVocabularyItem, status: VocabularyStatus) => {
    const updater = (prev: MyVocabularyItem[]) =>
      prev.map((v) => (v.id === item.id ? { ...v, status } : v));

    setVocabularies(updater);
    setAllVaultWords(updater);

    try {
      await updateMyVocabulary(item.id, { status });
    } catch (err) {
      console.warn("Could not sync status update", err);
    }
  };

  // Mutation: Rate mastery (1-5)
  const handleSetMastery = async (item: MyVocabularyItem, level: number) => {
    const updater = (prev: MyVocabularyItem[]) =>
      prev.map((v) => (v.id === item.id ? { ...v, masteryLevel: level } : v));

    setVocabularies(updater);
    setAllVaultWords(updater);

    try {
      await updateMyVocabulary(item.id, { masteryLevel: level });
    } catch (err) {
      console.warn("Could not sync mastery update", err);
    }
  };

  // Mutation: Add Practice Sentence
  const handleAddSentence = async (item: MyVocabularyItem) => {
    const sentence = (newSentenceInputs[item.id] || "").trim();
    if (!sentence) return;

    const updatedSentences = [...(item.mySentences || []), sentence];
    const updater = (prev: MyVocabularyItem[]) =>
      prev.map((v) => (v.id === item.id ? { ...v, mySentences: updatedSentences } : v));

    setVocabularies(updater);
    setAllVaultWords(updater);
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
      const updater = (prev: MyVocabularyItem[]) =>
        prev.map((v) => (v.id === item.id ? { ...v, notes: noteText } : v));
      setVocabularies(updater);
      setAllVaultWords(updater);
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

    setVocabularies((prev) => prev.filter((v) => v.id !== targetId));
    setAllVaultWords((prev) => prev.filter((v) => v.id !== targetId));

    try {
      await deleteMyVocabulary(targetId);
    } catch (err) {
      console.warn("Could not sync deletion", err);
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  return {
    vocabularies,
    allVaultWords,
    meta,
    isLoading,
    filters: {
      searchQuery,
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
      setAllVaultWords,
      setMeta,
    },
    loadVocabularies,
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
