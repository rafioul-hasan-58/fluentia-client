import { useState, useEffect, useMemo, useCallback } from "react";
import {
  VocabStoryItem,
  MyVocabularyItem,
} from "@/features/vocabulary/vocab-vault/types/vocabulary";
import { fetchMyVocabularies } from "@/features/vocabulary/vocab-vault/api/vocabulary";
import {
  deleteVocabStoryApi,
  fetchVocabStoriesApi,
  generateVocabStoryApi,
  updateVocabStoryTitleApi,
} from "../api/vocabularyStory";

export function useVocabStories() {
  const [stories, setStories] = useState<VocabStoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Date Filter States
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [todayOnly, setTodayOnly] = useState<boolean>(false);
  const [cachedDateCounts, setCachedDateCounts] = useState<Record<string, number>>({});

  // Sort States (directly forwarded to backend API)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortBy, setSortBy] = useState<string>("createdAt");

  const toggleSortOrder = useCallback(() => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  }, []);

  // Fullscreen / Detailed View Modal State
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [viewTab, setViewTab] = useState<"bangla" | "english" | "split">("bangla");

  // Deletion Modal State
  const [storyToDelete, setStoryToDelete] = useState<VocabStoryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Edit Story Title Modal State
  const [storyToEditTitle, setStoryToEditTitle] = useState<{ id: string; title: string } | null>(null);
  const [editedTitleInput, setEditedTitleInput] = useState<string>("");
  const [isUpdatingTitle, setIsUpdatingTitle] = useState<boolean>(false);
  const [titleUpdateError, setTitleUpdateError] = useState<string | null>(null);

  // Copy State
  const [copiedState, setCopiedState] = useState<{ id: string; type: "bangla" | "english" | "all" } | null>(null);

  // Generate New Story Modal State
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState<boolean>(false);
  const [vaultWords, setVaultWords] = useState<MyVocabularyItem[]>([]);
  const [isLoadingVault, setIsLoadingVault] = useState<boolean>(false);
  const [selectedWordIds, setSelectedWordIds] = useState<string[]>([]);
  const [storyContext, setStoryContext] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [newlyCreatedStory, setNewlyCreatedStory] = useState<VocabStoryItem | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch stories on load or when filters change
  const loadStories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const effectiveDate = selectedDate
        ? selectedDate
        : todayOnly
        ? (() => {
            const now = new Date();
            return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
          })()
        : undefined;

      const data = await fetchVocabStoriesApi({
        date: effectiveDate,
        limit: 100,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      setStories(data.items || []);

      // If unfiltered by date, cache date counts for the calendar picker
      if (!effectiveDate) {
        const counts: Record<string, number> = {};
        (data.items || []).forEach((story) => {
          if (!story.createdAt) return;
          const d = new Date(story.createdAt);
          if (isNaN(d.getTime())) return;
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
          const key = `${y}-${m}-${day}`;
          counts[key] = (counts[key] || 0) + 1;
        });
        setCachedDateCounts(counts);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load vocabulary stories.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, todayOnly, sortBy, sortOrder]);

  useEffect(() => {
    loadStories();
  }, [loadStories]);

  // Load vault words when opening generate modal
  const loadVaultWords = async () => {
    setIsLoadingVault(true);
    try {
      const res = await fetchMyVocabularies();
      setVaultWords(res.data);
    } catch (err: any) {
      console.error("Failed to load vault words", err);
    } finally {
      setIsLoadingVault(false);
    }
  };

  useEffect(() => {
    if (isGenerateModalOpen) {
      loadVaultWords();
    }
  }, [isGenerateModalOpen]);

  // Map of YYYY-MM-DD -> story count for calendar indicators
  const storyDateCounts = useMemo(() => {
    if (Object.keys(cachedDateCounts).length > 0) {
      return cachedDateCounts;
    }
    const counts: Record<string, number> = {};
    stories.forEach((story) => {
      if (!story.createdAt) return;
      const d = new Date(story.createdAt);
      if (isNaN(d.getTime())) return;
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const key = `${y}-${m}-${day}`;
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [stories, cachedDateCounts]);

  // Today's stories count
  const todayCount = useMemo(() => {
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    if (cachedDateCounts[todayKey] !== undefined) {
      return cachedDateCounts[todayKey];
    }
    return stories.filter((story) => {
      if (!story.createdAt) return false;
      const d = new Date(story.createdAt);
      return (
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate()
      );
    }).length;
  }, [stories, cachedDateCounts]);

  // Filtered stories
  const filteredStories = useMemo(() => {
    let result = stories;

    // Filter by Today
    if (todayOnly) {
      const today = new Date();
      result = result.filter((s) => {
        if (!s.createdAt) return false;
        const d = new Date(s.createdAt);
        return (
          d.getFullYear() === today.getFullYear() &&
          d.getMonth() === today.getMonth() &&
          d.getDate() === today.getDate()
        );
      });
    }

    // Filter by Specific Date
    if (selectedDate) {
      result = result.filter((s) => {
        if (!s.createdAt) return false;
        const d = new Date(s.createdAt);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const key = `${y}-${m}-${day}`;
        return key === selectedDate;
      });
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          (s.title && s.title.toLowerCase().includes(q)) ||
          s.storyEnglish.toLowerCase().includes(q) ||
          s.storyBangla.toLowerCase().includes(q) ||
          s.usedVocabulary.some((w) => w.toLowerCase().includes(q))
      );
    }

    return result;
  }, [stories, todayOnly, selectedDate, searchQuery]);

  // Active detailed story object and index
  const activeStory = useMemo(() => {
    if (!activeStoryId) return null;
    return stories.find((s) => s.id === activeStoryId) || null;
  }, [activeStoryId, stories]);

  const activeStoryIndex = useMemo(() => {
    if (!activeStoryId) return -1;
    return stories.findIndex((s) => s.id === activeStoryId);
  }, [activeStoryId, stories]);

  // Navigate story in modal
  const navigateStory = (direction: number) => {
    if (stories.length === 0 || activeStoryIndex === -1) return;
    const nextIdx = (activeStoryIndex + direction + stories.length) % stories.length;
    setActiveStoryId(stories[nextIdx].id);
  };

  // Keyboard navigation for detailed view modal
  useEffect(() => {
    if (activeStoryId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeStoryId) return;

      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        if (e.key === "Escape") target.blur();
        return;
      }

      if (e.key === "Escape") {
        setActiveStoryId(null);
      } else if (e.key === "ArrowLeft") {
        navigateStory(-1);
      } else if (e.key === "ArrowRight") {
        navigateStory(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeStoryId, stories, activeStoryIndex]);

  // Copy helper
  const handleCopy = (storyId: string, text: string, type: "bangla" | "english" | "all") => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedState({ id: storyId, type });
      setTimeout(() => setCopiedState(null), 2000);
    }
  };

  // Delete helper
  const handleConfirmDelete = async () => {
    if (!storyToDelete) return;
    setIsDeleting(true);
    try {
      await deleteVocabStoryApi(storyToDelete.id);
      setStories((prev) => prev.filter((s) => s.id !== storyToDelete.id));
      if (activeStoryId === storyToDelete.id) {
        setActiveStoryId(null);
      }
      setStoryToDelete(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete story.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Edit story title helpers
  const handleOpenEditTitle = (story: VocabStoryItem) => {
    setStoryToEditTitle({ id: story.id, title: story.title || "" });
    setEditedTitleInput(story.title || "");
    setTitleUpdateError(null);
  };

  const handleSaveTitle = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!storyToEditTitle) return;
    const trimmed = editedTitleInput.trim();
    if (!trimmed) {
      setTitleUpdateError("Story title cannot be empty.");
      return;
    }

    setIsUpdatingTitle(true);
    setTitleUpdateError(null);

    try {
      const updated = await updateVocabStoryTitleApi(storyToEditTitle.id, trimmed);
      const newTitle = updated?.title || trimmed;
      setStories((prev) =>
        prev.map((s) => (s.id === storyToEditTitle.id ? { ...s, title: newTitle } : s))
      );
      setStoryToEditTitle(null);
    } catch (err: any) {
      setTitleUpdateError(err.message || "Failed to update story title.");
    } finally {
      setIsUpdatingTitle(false);
    }
  };

  // Toggle Word Selection in Modal
  const handleToggleWord = (id: string) => {
    setSelectedWordIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 10) {
        alert("You can select up to 10 vocabulary words.");
        return prev;
      }
      return [...prev, id];
    });
  };

  // Execute Story Generation
  const handleExecuteGenerate = async () => {
    if (selectedWordIds.length < 5) {
      setGenerationError("Please select at least 5 vocabulary words.");
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const res = await generateVocabStoryApi({
        vocabularyIds: selectedWordIds,
        context: storyContext.trim() || undefined,
      });

      setNewlyCreatedStory(res);
      setStories((prev) => [res, ...prev]);
      setSelectedWordIds([]);
      setStoryContext("");
    } catch (err: any) {
      setGenerationError(err.message || "Failed to generate vocabulary story. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    stories,
    setStories,
    filteredStories,
    isLoading,
    error,
    isMounted,
    loadStories,

    // Filters & Sorting
    searchQuery,
    setSearchQuery,
    selectedDate,
    setSelectedDate,
    todayOnly,
    setTodayOnly,
    storyDateCounts,
    todayCount,
    sortOrder,
    setSortOrder,
    sortBy,
    setSortBy,
    toggleSortOrder,

    // Active Story / Reader Modal
    activeStoryId,
    setActiveStoryId,
    activeStory,
    activeStoryIndex,
    viewTab,
    setViewTab,
    navigateStory,

    // Copying
    copiedState,
    handleCopy,

    // Deleting
    storyToDelete,
    setStoryToDelete,
    isDeleting,
    handleConfirmDelete,

    // Editing Title
    storyToEditTitle,
    setStoryToEditTitle,
    editedTitleInput,
    setEditedTitleInput,
    isUpdatingTitle,
    titleUpdateError,
    handleOpenEditTitle,
    handleSaveTitle,

    // Generation Modal
    isGenerateModalOpen,
    setIsGenerateModalOpen,
    vaultWords,
    isLoadingVault,
    selectedWordIds,
    setSelectedWordIds,
    storyContext,
    setStoryContext,
    isGenerating,
    generationError,
    newlyCreatedStory,
    setNewlyCreatedStory,
    handleToggleWord,
    handleExecuteGenerate,
  };
}
