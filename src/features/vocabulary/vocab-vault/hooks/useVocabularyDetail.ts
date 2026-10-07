"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { MyVocabularyItem, VocabularyStatus } from "@/types";
import {
  fetchMyVocabularyByWord,
  updateMyVocabulary,
  fetchMyVocabularyDetails,
  fetchMyVocabularies,
  deleteMyVocabulary,
} from "../api/myVocabulary";
import { getLocalVault } from "./utilFn";
import { fetchMyVocabularyStats } from "../api";

export function useVocabularyDetail(word: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const decodedWord = useMemo(
    () => decodeURIComponent(word || "").trim().toLowerCase(),
    [word]
  );

  // Ensure URL in browser bar is lowercase if accessed with uppercase letters
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      const lowerPath = currentPath.toLowerCase();
      if (
        currentPath !== lowerPath &&
        currentPath.startsWith("/dashboard/user/vocabulary/")
      ) {
        router.replace(lowerPath);
      }
    }
  }, [router]);

  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // totalWord state
  const [totalWordCount, setTotalWord] = useState<number | null>(null);
  // currentWord calculation

  const indexNumber = Number(searchParams.get("index"));
  const wordLimit = Number(searchParams.get("limit"));
  const pageNumber = Number(searchParams.get("from"))
  const currentWordIndex = Number(((pageNumber - 1) * wordLimit) + (indexNumber + 1));

  // Vault list for carousel (1/12) navigation cached via TanStack Query
  const { data: vaultListData } = useQuery({
    queryKey: ["vocabularies", "carousel"],
    queryFn: async () => {
      try {
        const res = await fetchMyVocabularies({ limit: 100 });
        if (res && res.data && res.data.length > 0) {
          return res.data;
        }
        return getLocalVault();
      } catch {
        return getLocalVault();
      }
    },
    staleTime: 5 * 60 * 1000, // 5 min
  });

  const vaultList = vaultListData ?? [];

  const currentIndex = useMemo(() => {
    return vaultList.findIndex(
      (v) => (v.word?.word || "").trim().toLowerCase() === decodedWord
    );
  }, [vaultList, decodedWord]);

  const totalCount = 500;
  // const totalCount = vaultList.length > 0 ? vaultList.length : 1;
  const displayIndex = currentIndex !== -1 ? currentIndex + 1 : 1;

  const navigateCarousel = useCallback(
    (direction: -1 | 1) => {
      if (vaultList.length === 0 || currentIndex === -1) return;
      const newIndex = currentIndex + direction;
      if (newIndex >= 0 && newIndex < vaultList.length) {
        const nextItem = vaultList[newIndex];
        const nextWord = (nextItem.word?.word || "").trim().toLowerCase();
        if (nextWord) {
          const fromPage = searchParams?.get("from");
          const query = fromPage ? `?from=${fromPage}` : "";
          router.push(
            `/dashboard/user/vocabulary/${encodeURIComponent(nextWord)}${query}`
          );
        }
      }
    },
    [vaultList, currentIndex, router, searchParams]
  );

  const handleExit = useCallback(() => {
    const fromPage = searchParams?.get("from");
    router.push(
      fromPage
        ? `/dashboard/user/vocabulary?page=${fromPage}`
        : "/dashboard/user/vocabulary"
    );
  }, [router, searchParams]);

  // Keyboard shortcuts (Escape = exit to vault, Left/Right arrow = carousel)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
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
  const [itemToDelete, setItemToDelete] = useState<MyVocabularyItem | null>(
    null
  );
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
  const [editFeedback, setEditFeedback] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleOpenEditModal = (target: MyVocabularyItem) => {
    setEditingItem(target);
    setEditStatus(target.vocabularyStatus || "LEARNING");
    setEditIsFavorite(target.isFavorite ?? false);
    setEditNotes(target.notes || "");
    setEditSentences(
      Array.isArray(target.mySentences) ? target.mySentences : []
    );
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

    const finalSentences = [...editSentences];
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
        setEditFeedback({
          text: "Vocabulary updated successfully!",
          type: "success",
        });
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

  // TanStack Query for word detail
  const {
    data: rawItem,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["vocabulary-detail", decodedWord],
    queryFn: () => fetchMyVocabularyByWord(decodedWord),
    enabled: Boolean(decodedWord),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const item = rawItem ?? null;

  // Sync notes text state when item is loaded
  useEffect(() => {
    if (item?.notes !== undefined) {
      setNotesText(item.notes || "");
    }
  }, [item?.notes]);

  // Progressive AI enrichment: if collocations/examples are missing, fetch & enrich in background
  useEffect(() => {
    if (
      item &&
      (!item.word?.collocations?.length ||
        !item.word?.exampleSentences?.length ||
        !item.word?.synonyms?.length)
    ) {
      setIsLoadingDetails(true);
      fetchMyVocabularyDetails(item)
        .then((enriched) => {
          if (enriched) {
            queryClient.setQueryData(["vocabulary-detail", decodedWord], enriched);
          }
        })
        .catch((e: unknown) => console.warn("Error enriching details:", e))
        .finally(() => setIsLoadingDetails(false));
    }
  }, [item?.id, decodedWord, queryClient]);

  // Keep setItem compatible for optimistic mutations by updating TanStack cache directly
  const setItem = useCallback(
    (
      updater:
        | MyVocabularyItem
        | null
        | ((prev: MyVocabularyItem | null) => MyVocabularyItem | null)
    ) => {
      queryClient.setQueryData(
        ["vocabulary-detail", decodedWord],
        (old: MyVocabularyItem | null | undefined) => {
          const current = old ?? null;
          return typeof updater === "function" ? updater(current) : updater;
        }
      );
    },
    [queryClient, decodedWord]
  );

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
    const currentSentences = Array.isArray(item.mySentences)
      ? item.mySentences
      : [];
    const updatedSentences = [...currentSentences, trimmed];

    setIsAddingSentence(true);
    try {
      if (item.id && !item.id.startsWith("untracked-")) {
        await updateMyVocabulary(item.id, { mySentences: updatedSentences });
      }
      setItem((prev) =>
        prev ? { ...prev, mySentences: updatedSentences } : null
      );
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
    const currentSentences = Array.isArray(item.mySentences)
      ? item.mySentences
      : [];
    const updatedSentences = currentSentences.filter(
      (_, i) => i !== indexToDelete
    );

    setItem((prev) =>
      prev ? { ...prev, mySentences: updatedSentences } : null
    );

    if (item.id && !item.id.startsWith("untracked-")) {
      try {
        await updateMyVocabulary(item.id, { mySentences: updatedSentences });
      } catch (err) {
        console.warn("Could not delete sentence:", err);
      }
    }
  };
  // fetch total wordCount
  const fetchWordCount = useCallback(async () => {
    try {
      const data = await fetchMyVocabularyStats();
      if (data) {
        setTotalWord(data.totalWords || null);
      }
    } catch (err) {
      console.warn("Failed to fetch vocabulary stats", err);
    }
  }, []);

  // Load stats once on mount
  useEffect(() => {
    fetchWordCount();
  }, [fetchWordCount]);
  return {
    item,
    setItem,
    wordData: item?.word,
    decodedWord,
    isLoading,
    isFetching,
    isLoadingDetails,
    isPlayingAudio,
    isCopied,
    handleCopyLink,
    // Carousel & Navigation
    vaultList,
    currentIndex,
    totalCount,
    displayIndex,
    navigateCarousel,
    handleExit,
    // Actions & Audio
    playPronunciation,
    handleToggleFavorite,
    handleSetMastery,
    handleSetStatus,
    // Notes
    notesText,
    setNotesText,
    isSavingNotes,
    notesSavedSuccess,
    handleSaveNotes,
    // Sentences
    newSentence,
    setNewSentence,
    isAddingSentence,
    handleAddSentence,
    handleDeleteSentence,
    // Delete Modal
    itemToDelete,
    setItemToDelete,
    isDeleting,
    handleConfirmDelete,
    // Edit Modal
    editingItem,
    setEditingItem,
    isSavingEdit,
    editStatus,
    setEditStatus,
    editIsFavorite,
    setEditIsFavorite,
    editSentences,
    editNewSentence,
    setEditNewSentence,
    editNotes,
    setEditNotes,
    editFeedback,
    handleOpenEditModal,
    handleRemoveSentence,
    handleAddSentenceToEdit,
    handleSaveEdit,
    // word count showcase
    totalWordCount,
    currentWordIndex
  };
}
