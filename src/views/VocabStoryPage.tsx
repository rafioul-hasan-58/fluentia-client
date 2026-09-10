"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  Search,
  Plus,
  RefreshCw,
  Trash2,
  Copy,
  Check,
  Calendar,
  Layers,
  ArrowRight,
  AlertCircle,
  X,
  BookText,
} from "lucide-react";
import {
  VocabStoryItem,
  MyVocabularyItem,
} from "@/types/vocabulary";
import {
  fetchVocabStoriesApi,
  deleteVocabStoryApi,
  generateVocabStoryApi,
  fetchMyVocabularies,
} from "@/lib/api/vocabulary";

export default function VocabStoryPage() {
  const [stories, setStories] = useState<VocabStoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("" );
  const [error, setError] = useState<string | null>(null);

  // Deletion Modal State
  const [storyToDelete, setStoryToDelete] = useState<VocabStoryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Copy State
  const [copiedId, setCopiedId] = useState<{ id: string; type: "bangla" | "english" } | null>(null);

  // Generate New Story Modal State
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState<boolean>(false);
  const [vaultWords, setVaultWords] = useState<MyVocabularyItem[]>([]);
  const [isLoadingVault, setIsLoadingVault] = useState<boolean>(false);
  const [selectedWordIds, setSelectedWordIds] = useState<string[]>([]);
  const [storyContext, setStoryContext] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [newlyCreatedStory, setNewlyCreatedStory] = useState<VocabStoryItem | null>(null);

  // Load Stories
  const loadStories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchVocabStoriesApi();
      setStories(res.items || []);
    } catch (err: any) {
      setError(err.message || "Failed to load vocabulary stories.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  // Load Vault words when modal opens
  useEffect(() => {
    if (isGenerateModalOpen) {
      setIsLoadingVault(true);
      fetchMyVocabularies()
        .then((items) => setVaultWords(items))
        .catch(() => setVaultWords([]))
        .finally(() => setIsLoadingVault(false));
    }
  }, [isGenerateModalOpen]);

  // Filtered stories
  const filteredStories = useMemo(() => {
    if (!searchQuery.trim()) return stories;
    const q = searchQuery.toLowerCase().trim();
    return stories.filter(
      (s) =>
        s.storyEnglish.toLowerCase().includes(q) ||
        s.storyBangla.toLowerCase().includes(q) ||
        s.usedVocabulary.some((w) => w.toLowerCase().includes(q))
    );
  }, [stories, searchQuery]);

  // Copy helper
  const handleCopy = (storyId: string, text: string, type: "bangla" | "english") => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId({ id: storyId, type });
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Delete helper
  const handleConfirmDelete = async () => {
    if (!storyToDelete) return;
    setIsDeleting(true);
    try {
      await deleteVocabStoryApi(storyToDelete.id);
      setStories((prev) => prev.filter((s) => s.id !== storyToDelete.id));
      setStoryToDelete(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete story.");
    } finally {
      setIsDeleting(false);
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

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-purple-600/10 dark:from-amber-500/5 dark:via-orange-500/5 dark:to-purple-600/5 border border-amber-500/20 dark:border-amber-500/10 p-6 sm:p-8 backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold font-brand tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>AI Contextual Storyteller</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              AI Vocabulary Stories
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Transform 5 to 10 vocabulary words from your vault into immersive, memorable bilingual stories (🇧🇩 Bangla-English mixed) and natural full English narratives (🇬🇧).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/dashboard/vocabulary"
              className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all flex items-center gap-2 shadow-xs"
            >
              <BookOpen className="w-4 h-4 text-indigo-500" />
              <span>Vocabulary Vault</span>
            </Link>

            <button
              onClick={() => {
                setNewlyCreatedStory(null);
                setGenerationError(null);
                setIsGenerateModalOpen(true);
              }}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Generate New Story</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Search & Stats Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search stories by keyword or vocabulary word..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-500" />
            <span>{stories.length} Stories Total</span>
          </div>

          <button
            onClick={loadStories}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Refresh stories"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-amber-500" : ""}`} />
          </button>
        </div>
      </div>

      {/* 3. Main Content / Story List */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Loading your vocabulary stories...
          </p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-center space-y-2">
          <AlertCircle className="w-6 h-6 mx-auto" />
          <p className="text-sm font-semibold">{error}</p>
          <button
            onClick={loadStories}
            className="px-4 py-2 rounded-lg bg-rose-600 text-white text-xs font-bold mt-2 hover:bg-rose-700 transition"
          >
            Try Again
          </button>
        </div>
      ) : filteredStories.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 p-8 space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-500">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {searchQuery ? "No matching stories found" : "No Vocabulary Stories Yet"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {searchQuery
                ? "Try searching for a different word or clear your search query."
                : "Select 5 to 10 vocabulary words from your vault to generate bilingual contextual stories."}
            </p>
          </div>
          {!searchQuery && (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setNewlyCreatedStory(null);
                  setGenerationError(null);
                  setIsGenerateModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs sm:text-sm font-bold shadow-md hover:scale-105 transition cursor-pointer"
              >
                Generate Story Now
              </button>
              <Link
                href="/dashboard/vocabulary"
                className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition"
              >
                Go to Vocabulary Vault
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredStories.map((story, index) => (
            <div
              key={story.id}
              className="rounded-3xl bg-white dark:bg-[#121124] border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all space-y-6"
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm">
                    #{index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg flex items-center gap-2">
                      <span>Bilingual Contextual Story</span>
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(story.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setStoryToDelete(story)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    title="Delete story"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Target Words Pill Tags */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Target Words Used ({story.usedVocabulary.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {story.usedVocabulary.map((word) => (
                    <span
                      key={word}
                      className="px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-500/20 capitalize shadow-2xs"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>

              {/* Story 1: Bangla-English Mixed */}
              <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/15 border border-amber-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🇧🇩</span>
                    <h4 className="font-bold text-amber-900 dark:text-amber-300 text-xs sm:text-sm">
                      Bangla-English Mixed Story
                    </h4>
                  </div>
                  <button
                    onClick={() => handleCopy(story.id, story.storyBangla, "bangla")}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 hover:underline cursor-pointer"
                  >
                    {copiedId?.id === story.id && copiedId?.type === "bangla" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Story</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                  {story.storyBangla}
                </p>
              </div>

              {/* Story 2: Full English */}
              <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/15 border border-indigo-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🇬🇧</span>
                    <h4 className="font-bold text-indigo-900 dark:text-indigo-300 text-xs sm:text-sm">
                      Full English Story
                    </h4>
                  </div>
                  <button
                    onClick={() => handleCopy(story.id, story.storyEnglish, "english")}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-800 dark:text-indigo-300 hover:underline cursor-pointer"
                  >
                    {copiedId?.id === story.id && copiedId?.type === "english" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Story</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                  {story.storyEnglish}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Delete Confirmation Modal */}
      {storyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Delete Vocabulary Story?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Are you sure you want to delete this story? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStoryToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Generate New Story Modal */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#141226] border border-amber-500/30 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Interactive Story Creator</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Generate Contextual Story
                </h3>
              </div>
              <button
                onClick={() => setIsGenerateModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {newlyCreatedStory ? (
              /* Success View */
              <div className="space-y-6 animate-in zoom-in-95 duration-150">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Story generated and saved successfully!</span>
                </div>

                {/* Mixed Story */}
                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-500/30 space-y-2">
                  <h4 className="font-bold text-amber-900 dark:text-amber-300 text-xs">
                    🇧🇩 Bangla-English Mixed Story
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                    {newlyCreatedStory.storyBangla}
                  </p>
                </div>

                {/* English Story */}
                <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-500/30 space-y-2">
                  <h4 className="font-bold text-indigo-900 dark:text-indigo-300 text-xs">
                    🇬🇧 Full English Story
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                    {newlyCreatedStory.storyEnglish}
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      setNewlyCreatedStory(null);
                      setSelectedWordIds([]);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    Create Another Story
                  </button>
                  <button
                    onClick={() => setIsGenerateModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-md hover:scale-105 transition cursor-pointer"
                  >
                    Done & View Stories
                  </button>
                </div>
              </div>
            ) : (
              /* Story Configuration Form */
              <div className="space-y-5">
                {/* 1. Word Selection */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      1. Select Vocabulary Words ({selectedWordIds.length}/5-10):
                    </label>
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">
                      {selectedWordIds.length < 5
                        ? `Select ${5 - selectedWordIds.length} more`
                        : "Ready to generate"}
                    </span>
                  </div>

                  {isLoadingVault ? (
                    <div className="p-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Loading vocabulary vault...</span>
                    </div>
                  ) : vaultWords.length === 0 ? (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
                      <p className="text-xs text-slate-500">
                        No vocabulary words found in your vault.
                      </p>
                      <Link
                        href="/dashboard/vocabulary"
                        className="inline-flex items-center gap-1.5 text-xs text-indigo-500 font-bold hover:underline"
                      >
                        <span>Add words to Vault</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-52 overflow-y-auto p-1">
                      {vaultWords.map((item) => {
                        const wordId = item.word?.id || item.wordId || item.id;
                        const isSelected = selectedWordIds.includes(wordId);

                        return (
                          <button
                            key={wordId}
                            type="button"
                            onClick={() => handleToggleWord(wordId)}
                            className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                              isSelected
                                ? "bg-amber-500/15 border-amber-500 text-amber-900 dark:text-amber-200 font-bold shadow-2xs"
                                : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <p className="text-xs truncate font-semibold capitalize">
                                {item.word?.word}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate">
                                {item.word?.banglaMeaning || item.word?.meaning}
                              </p>
                            </div>
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? "border-amber-500 bg-amber-500 text-white"
                                  : "border-slate-300 dark:border-slate-700"
                              }`}
                            >
                              {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2. Theme / Context Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    2. Story Theme / Scenario (Optional):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 'A thrilling cricket match', 'First day at university', 'Job interview in London'"
                    value={storyContext}
                    onChange={(e) => setStoryContext(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Error Banner */}
                {generationError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{generationError}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsGenerateModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleExecuteGenerate}
                    disabled={selectedWordIds.length < 5 || isGenerating}
                    className={`px-6 py-2.5 rounded-xl text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                      selectedWordIds.length >= 5 && !isGenerating
                        ? "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:scale-105 shadow-md shadow-orange-500/30 cursor-pointer"
                        : "bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-600 cursor-not-allowed"
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Generating Bilingual Story...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-200" />
                        <span>Generate Story ({selectedWordIds.length}/5-10)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
