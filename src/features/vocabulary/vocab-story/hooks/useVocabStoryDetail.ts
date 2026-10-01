"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { VocabStoryItem } from "@/types";
import {
  fetchVocabStoryByIdApi,
  fetchVocabStoriesApi,
  updateVocabStoryTitleApi,
  deleteVocabStoryApi,
} from "../api/vocabularyStory";

export function useVocabStoryDetail(storyId: string) {
  const router = useRouter();

  const [story, setStory] = useState<VocabStoryItem | null>(null);
  const [allStories, setAllStories] = useState<VocabStoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // View mode tab: bangla, english, or side-by-side split
  const [viewTab, setViewTab] = useState<"bangla" | "english" | "split">(
    "bangla"
  );

  // Copy feedback
  const [copiedState, setCopiedState] = useState<{
    id: string;
    type: "bangla" | "english" | "all";
  } | null>(null);

  // Edit title modal state
  const [editingStory, setEditingStory] = useState<VocabStoryItem | null>(null);
  const [titleInput, setTitleInput] = useState("");
  const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);
  const [updateTitleError, setUpdateTitleError] = useState<string | null>(null);

  // Delete modal state
  const [storyToDelete, setStoryToDelete] = useState<VocabStoryItem | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch story details
  const loadStory = useCallback(async () => {
    if (!storyId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchVocabStoryByIdApi(storyId);
      setStory(data);
    } catch (err: any) {
      console.error("[useVocabStoryDetail] Error loading story:", err);
      setError(err?.message || "Failed to load story details");
    } finally {
      setIsLoading(false);
    }
  }, [storyId]);

  useEffect(() => {
    loadStory();
  }, [loadStory]);

  // Fetch all stories for carousel traversal
  useEffect(() => {
    fetchVocabStoriesApi({ limit: 100 })
      .then((res) => {
        if (res && res.items && res.items.length > 0) {
          setAllStories(res.items);
        }
      })
      .catch((err) => {
        console.warn("[useVocabStoryDetail] Error loading all stories:", err);
      });
  }, []);

  const currentIndex = useMemo(() => {
    return allStories.findIndex((s) => s.id === storyId);
  }, [allStories, storyId]);

  const totalStories = allStories.length > 0 ? allStories.length : 1;
  const displayIndex = currentIndex !== -1 ? currentIndex + 1 : 1;

  const navigateCarousel = useCallback(
    (direction: -1 | 1) => {
      if (allStories.length === 0 || currentIndex === -1) return;
      const nextIdx = currentIndex + direction;
      if (nextIdx >= 0 && nextIdx < allStories.length) {
        const nextStory = allStories[nextIdx];
        if (nextStory?.id) {
          router.push(
            `/dashboard/user/vocabulary/story-details/${nextStory.id}`
          );
        }
      }
    },
    [allStories, currentIndex, router]
  );

  const handleExit = useCallback(() => {
    router.push("/dashboard/user/vocabulary/stories");
  }, [router]);

  // Keyboard navigation (Esc = back, Left/Right arrow = carousel)
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

  // Copy handler
  const handleCopy = useCallback(
    (id: string, text: string, type: "bangla" | "english" | "all") => {
      if (typeof window === "undefined" || !text) return;
      navigator.clipboard.writeText(text);
      setCopiedState({ id, type });
      setTimeout(() => setCopiedState(null), 2000);
    },
    []
  );

  // Edit title modal handlers
  const handleOpenEditTitle = (target: VocabStoryItem) => {
    setEditingStory(target);
    setTitleInput(target.title || "");
    setUpdateTitleError(null);
  };

  const handleCloseEditTitle = () => {
    setEditingStory(null);
    setTitleInput("");
    setUpdateTitleError(null);
  };

  const handleSaveEditTitle = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingStory || !titleInput.trim()) return;

    setIsUpdatingTitle(true);
    setUpdateTitleError(null);
    try {
      const updated = await updateVocabStoryTitleApi(
        editingStory.id,
        titleInput.trim()
      );
      setStory((prev) =>
        prev ? { ...prev, title: updated.title || titleInput.trim() } : null
      );
      setAllStories((prev) =>
        prev.map((s) =>
          s.id === editingStory.id
            ? { ...s, title: updated.title || titleInput.trim() }
            : s
        )
      );
      handleCloseEditTitle();
    } catch (err: any) {
      setUpdateTitleError(err?.message || "Failed to update story title.");
    } finally {
      setIsUpdatingTitle(false);
    }
  };

  // Delete modal handlers
  const handleConfirmDelete = async () => {
    if (!storyToDelete) return;
    setIsDeleting(true);
    try {
      await deleteVocabStoryApi(storyToDelete.id);
      router.push("/dashboard/user/vocabulary/stories");
    } catch (err: any) {
      console.error("[useVocabStoryDetail] Error deleting story:", err);
    } finally {
      setIsDeleting(false);
      setStoryToDelete(null);
    }
  };

  return {
    story,
    setStory,
    allStories,
    isLoading,
    error,
    viewTab,
    setViewTab,
    copiedState,
    handleCopy,
    // Carousel & Nav
    currentIndex,
    totalStories,
    displayIndex,
    navigateCarousel,
    handleExit,
    // Edit title
    editingStory,
    titleInput,
    setTitleInput,
    isUpdatingTitle,
    updateTitleError,
    handleOpenEditTitle,
    handleCloseEditTitle,
    handleSaveEditTitle,
    // Delete
    storyToDelete,
    setStoryToDelete,
    isDeleting,
    handleConfirmDelete,
    reloadStory: loadStory,
  };
}
