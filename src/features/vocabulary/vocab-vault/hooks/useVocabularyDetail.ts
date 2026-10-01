"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
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

export function useVocabularyDetail(word: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams?.get("page");
  const limitParam = searchParams?.get("limit");

  const pageSize = useMemo(() => {
    const parsed = limitParam ? parseInt(limitParam, 10) : 12;
    return isNaN(parsed) || parsed <= 0 ? 12 : parsed;
  }, [limitParam]);

  const initialPage = useMemo(() => {
    const parsed = pageParam ? parseInt(pageParam, 10) : 1;
    return isNaN(parsed) || parsed <= 0 ? 1 : parsed;
  }, [pageParam]);

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

  const [item, setItem] = useState<MyVocabularyItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Cache pages of vocab items: pageNumber -> items[]
  const [pagesCache, setPagesCache] = useState<Record<number, MyVocabularyItem[]>>({});
  const [activePage, setActivePage] = useState<number>(initialPage);
  const [totalWordCount, setTotalWordCount] = useState<number>(0);
  const [isNavigatingPage, setIsNavigatingPage] = useState<boolean>(false);
  const isFetchingDiscoveryRef = useRef(false);

  // Keep activePage in sync if query param changes
  useEffect(() => {
    if (pageParam) {
      const parsed = parseInt(pageParam, 10);
      if (!isNaN(parsed) && parsed > 0 && parsed !== activePage) {
        setActivePage(parsed);
      }
    }
  }, [pageParam, activePage]);

  // Fetch a specific page and cache it
  const fetchPage = useCallback(
    async (pageToFetch: number, limitToFetch: number = pageSize) => {
      try {
        const res = await fetchMyVocabularies({ page: pageToFetch, limit: limitToFetch });
        if (res && res.data && res.data.length > 0) {
          setPagesCache((prev) => ({
            ...prev,
            [pageToFetch]: res.data,
          }));
          const realTotal =
            typeof res.meta?.total === "number"
              ? res.meta.total
              : res.data.length;
          if (realTotal > 0) {
            setTotalWordCount(realTotal);
          }
          return { items: res.data, total: realTotal };
        } else {
          // Fallback to local vault
          const local = getLocalVault();
          if (local.length > 0) {
            const start = (pageToFetch - 1) * limitToFetch;
            const sliced = local.slice(start, start + limitToFetch);
            setPagesCache((prev) => ({
              ...prev,
              [pageToFetch]: sliced,
            }));
            setTotalWordCount(local.length);
            return { items: sliced, total: local.length };
          }
        }
      } catch (err) {
        console.warn(`[useVocabularyDetail] Failed to fetch page ${pageToFetch}:`, err);
        const local = getLocalVault();
        if (local.length > 0) {
          const start = (pageToFetch - 1) * limitToFetch;
          const sliced = local.slice(start, start + limitToFetch);
          setPagesCache((prev) => ({
            ...prev,
            [pageToFetch]: sliced,
          }));
          setTotalWordCount(local.length);
          return { items: sliced, total: local.length };
        }
      }
      return null;
    },
    [pageSize]
  );

  // 1. Fetch current active page if not yet cached
  useEffect(() => {
    if (!pagesCache[activePage]) {
      fetchPage(activePage, pageSize);
    }
  }, [activePage, pageSize, pagesCache, fetchPage]);

  // 2. Pre-fetch adjacent pages in background for instant transition
  useEffect(() => {
    if (pagesCache[activePage]) {
      const totalPages = totalWordCount > 0 ? Math.ceil(totalWordCount / pageSize) : 1;
      const nextPage = activePage + 1;
      if (nextPage <= totalPages && !pagesCache[nextPage]) {
        fetchPage(nextPage, pageSize);
      }
      const prevPage = activePage - 1;
      if (prevPage >= 1 && !pagesCache[prevPage]) {
        fetchPage(prevPage, pageSize);
      }
    }
  }, [activePage, totalWordCount, pageSize, pagesCache, fetchPage]);

  // 3. Discovery: If decodedWord is not found on activePage, locate which page it belongs to
  useEffect(() => {
    const currentItems = pagesCache[activePage];
    if (!currentItems || currentItems.length === 0) return;

    const foundInActive = currentItems.some(
      (v) => (v.word?.word || "").trim().toLowerCase() === decodedWord
    );

    if (!foundInActive && !pageParam && !isFetchingDiscoveryRef.current) {
      // Check other cached pages first
      for (const [pgStr, items] of Object.entries(pagesCache)) {
        const pgNum = Number(pgStr);
        if (items.some((v) => (v.word?.word || "").trim().toLowerCase() === decodedWord)) {
          setActivePage(pgNum);
          return;
        }
      }

      // Check local vault
      const local = getLocalVault();
      const localIdx = local.findIndex(
        (v) => (v.word?.word || "").trim().toLowerCase() === decodedWord
      );
      if (localIdx !== -1) {
        const targetPage = Math.floor(localIdx / pageSize) + 1;
        setActivePage(targetPage);
        return;
      }

      // Query server if total words > pageSize to find true page
      if (totalWordCount > pageSize) {
        isFetchingDiscoveryRef.current = true;
        fetchMyVocabularies({ limit: 100 })
          .then((res) => {
            if (res && res.data) {
              const idx = res.data.findIndex(
                (v) => (v.word?.word || "").trim().toLowerCase() === decodedWord
              );
              if (idx !== -1) {
                const targetPage = Math.floor(idx / pageSize) + 1;
                setActivePage(targetPage);
                const start = (targetPage - 1) * pageSize;
                const pageSlice = res.data.slice(start, start + pageSize);
                setPagesCache((prev) => ({
                  ...prev,
                  [targetPage]: pageSlice,
                }));
              }
            }
          })
          .catch(() => {})
          .finally(() => {
            isFetchingDiscoveryRef.current = false;
          });
      }
    }
  }, [decodedWord, activePage, pagesCache, pageParam, pageSize, totalWordCount]);

  // Active page's items
  const currentItems = useMemo(
    () => pagesCache[activePage] || [],
    [pagesCache, activePage]
  );

  const relativeIndex = useMemo(() => {
    return currentItems.findIndex(
      (v) => (v.word?.word || "").trim().toLowerCase() === decodedWord
    );
  }, [currentItems, decodedWord]);

  // Real total word count across entire vault
  const totalCount = useMemo(() => {
    if (totalWordCount > 0) return totalWordCount;
    const local = getLocalVault();
    if (local.length > 0) return local.length;
    return currentItems.length > 0 ? currentItems.length : 1;
  }, [totalWordCount, currentItems.length]);

  // Global 1-based display index (e.g. 13/250)
  const displayIndex = useMemo(() => {
    if (relativeIndex !== -1) {
      return (activePage - 1) * pageSize + relativeIndex + 1;
    }
    // Check if found in any other cached page
    for (const [pgStr, items] of Object.entries(pagesCache)) {
      const pgNum = Number(pgStr);
      const idx = items.findIndex(
        (v) => (v.word?.word || "").trim().toLowerCase() === decodedWord
      );
      if (idx !== -1) {
        return (pgNum - 1) * pageSize + idx + 1;
      }
    }
    return 1;
  }, [relativeIndex, activePage, pageSize, pagesCache, decodedWord]);

  // Compatibility with existing components
  const vaultList = currentItems;
  const currentIndex = relativeIndex;

  // Navigate next / prev following pagination behind the scenes
  const navigateCarousel = useCallback(
    async (direction: -1 | 1) => {
      if (isNavigatingPage) return;

      const items = pagesCache[activePage] || [];
      const currentRelIdx = items.findIndex(
        (v) => (v.word?.word || "").trim().toLowerCase() === decodedWord
      );
      const effectiveRelIdx = currentRelIdx !== -1 ? currentRelIdx : 0;

      if (direction === 1) {
        // NEXT BUTTON
        if (displayIndex >= totalCount) return;

        // 1. Next word is on the CURRENT page
        if (effectiveRelIdx + 1 < items.length) {
          const nextItem = items[effectiveRelIdx + 1];
          const nextWord = (nextItem.word?.word || "").trim().toLowerCase();
          if (nextWord) {
            router.push(
              `/dashboard/user/vocabulary/${encodeURIComponent(nextWord)}?page=${activePage}&limit=${pageSize}`
            );
          }
          return;
        }

        // 2. Next word is on the NEXT page (e.g. at index 11 of 12 items -> fetch page 2)
        const nextPage = activePage + 1;
        const totalPages = Math.ceil(totalCount / pageSize);
        if (nextPage <= totalPages) {
          setIsNavigatingPage(true);
          let nextPageItems = pagesCache[nextPage];
          if (!nextPageItems || nextPageItems.length === 0) {
            const res = await fetchPage(nextPage, pageSize);
            nextPageItems = res?.items || [];
          }

          if (nextPageItems && nextPageItems.length > 0) {
            setActivePage(nextPage);
            const nextItem = nextPageItems[0];
            const nextWord = (nextItem.word?.word || "").trim().toLowerCase();
            if (nextWord) {
              router.push(
                `/dashboard/user/vocabulary/${encodeURIComponent(nextWord)}?page=${nextPage}&limit=${pageSize}`
              );
            }
          }
          setIsNavigatingPage(false);
        }
      } else if (direction === -1) {
        // PREVIOUS BUTTON
        if (displayIndex <= 1) return;

        // 1. Previous word is on the CURRENT page
        if (effectiveRelIdx > 0) {
          const prevItem = items[effectiveRelIdx - 1];
          const prevWord = (prevItem.word?.word || "").trim().toLowerCase();
          if (prevWord) {
            router.push(
              `/dashboard/user/vocabulary/${encodeURIComponent(prevWord)}?page=${activePage}&limit=${pageSize}`
            );
          }
          return;
        }

        // 2. Previous word is on the PREVIOUS page (e.g. at index 0 of page 2 -> go to last of page 1)
        const prevPage = activePage - 1;
        if (prevPage >= 1) {
          setIsNavigatingPage(true);
          let prevPageItems = pagesCache[prevPage];
          if (!prevPageItems || prevPageItems.length === 0) {
            const res = await fetchPage(prevPage, pageSize);
            prevPageItems = res?.items || [];
          }

          if (prevPageItems && prevPageItems.length > 0) {
            setActivePage(prevPage);
            const prevItem = prevPageItems[prevPageItems.length - 1];
            const prevWord = (prevItem.word?.word || "").trim().toLowerCase();
            if (prevWord) {
              router.push(
                `/dashboard/user/vocabulary/${encodeURIComponent(prevWord)}?page=${prevPage}&limit=${pageSize}`
              );
            }
          }
          setIsNavigatingPage(false);
        }
      }
    },
    [
      isNavigatingPage,
      pagesCache,
      activePage,
      decodedWord,
      displayIndex,
      totalCount,
      pageSize,
      router,
      fetchPage,
    ]
  );

  const handleExit = useCallback(() => {
    router.push("/dashboard/user/vocabulary");
  }, [router]);

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
      if (
        data &&
        (!data.word?.collocations?.length ||
          !data.word?.exampleSentences?.length ||
          !data.word?.synonyms?.length)
      ) {
        setIsLoadingDetails(true);
        fetchMyVocabularyDetails(data)
          .then((enriched) => {
            if (enriched) {
              setItem(enriched);
            }
          })
          .catch((e: unknown) => console.warn("Error enriching details:", e))
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

  return {
    item,
    setItem,
    wordData: item?.word,
    decodedWord,
    isLoading,
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
  };
}
