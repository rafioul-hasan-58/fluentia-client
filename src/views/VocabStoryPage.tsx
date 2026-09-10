"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
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
  ChevronLeft,
  ChevronRight,
  Eye,
  Minimize2,
  Clock,
  Columns,
  GraduationCap,
} from "lucide-react";
import {
  VocabStoryItem,
  MyVocabularyItem,
  KeywordExplanationItem,
} from "@/types/vocabulary";
import {
  fetchVocabStoriesApi,
  deleteVocabStoryApi,
  generateVocabStoryApi,
  fetchMyVocabularies,
} from "@/lib/api/vocabulary";

// Helper to underline target vocabulary keywords within story text (pure underline, no background color)
function renderHighlightedStory(text: string, keywords: string[]) {
  if (!text) return null;
  if (!keywords || keywords.length === 0) {
    return text.split("\n\n").map((para, i) => (
      <p key={i} className="mb-4 last:mb-0 leading-relaxed sm:leading-8">
        {para}
      </p>
    ));
  }

  // Filter and sort keywords by length descending so multi-word or longer keywords match first
  const validKeywords = keywords
    .map((k) => k.trim())
    .filter((k) => k.length > 0)
    .sort((a, b) => b.length - a.length);

  if (validKeywords.length === 0) {
    return text.split("\n\n").map((para, i) => (
      <p key={i} className="mb-4 last:mb-0 leading-relaxed sm:leading-8">
        {para}
      </p>
    ));
  }

  const escaped = validKeywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  // Match keyword with possible inflectional variations (s, es, ed, d, ing, ly)
  const regex = new RegExp(`\\b(${escaped.join("|")})(?:s|es|ed|d|ing|ly)?\\b`, "gi");

  // Split into paragraphs for editorial reading rhythm
  const paragraphs = text.split(/\n+/);

  return paragraphs.map((paragraph, pIdx) => {
    const parts: (string | React.ReactNode)[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    // Reset regex index for each paragraph
    regex.lastIndex = 0;

    while ((match = regex.exec(paragraph)) !== null) {
      if (match.index > lastIndex) {
        parts.push(paragraph.substring(lastIndex, match.index));
      }
      const matchedWord = match[0];
      parts.push(
        <span
          key={`match-${pIdx}-${match.index}-${matchedWord}`}
          className="font-bold underline decoration-amber-500 dark:decoration-amber-400 decoration-2 underline-offset-4 text-amber-700 dark:text-amber-300 transition-colors"
          title={`Target Keyword: ${matchedWord}`}
        >
          {matchedWord}
        </span>
      );
      lastIndex = match.index + matchedWord.length;
    }

    if (lastIndex < paragraph.length) {
      parts.push(paragraph.substring(lastIndex));
    }

    return (
      <p key={`p-${pIdx}`} className="mb-4 sm:mb-5 last:mb-0 leading-relaxed sm:leading-8 text-slate-800 dark:text-slate-200">
        {parts}
      </p>
    );
  });
}

export default function VocabStoryPage() {
  const [stories, setStories] = useState<VocabStoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Fullscreen / Detailed View Modal State
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [viewTab, setViewTab] = useState<"bangla" | "english" | "split">("bangla");

  // Deletion Modal State
  const [storyToDelete, setStoryToDelete] = useState<VocabStoryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

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

  // Fetch stories on load
  const loadStories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchVocabStoriesApi({ limit: 100 });
      setStories(data.items || []);
    } catch (err: any) {
      setError(err.message || "Failed to load vocabulary stories.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  // Load vault words when opening generate modal
  useEffect(() => {
    if (isGenerateModalOpen) {
      loadVaultWords();
    }
  }, [isGenerateModalOpen]);

  const loadVaultWords = async () => {
    setIsLoadingVault(true);
    try {
      const items = await fetchMyVocabularies();
      setVaultWords(items);
    } catch (err: any) {
      console.error("Failed to load vault words", err);
    } finally {
      setIsLoadingVault(false);
    }
  };

  // Filtered stories
  const filteredStories = useMemo(() => {
    if (!searchQuery.trim()) return stories;
    const q = searchQuery.toLowerCase().trim();
    return stories.filter(
      (s) =>
        (s.title && s.title.toLowerCase().includes(q)) ||
        s.storyEnglish.toLowerCase().includes(q) ||
        s.storyBangla.toLowerCase().includes(q) ||
        s.usedVocabulary.some((w) => w.toLowerCase().includes(q))
    );
  }, [stories, searchQuery]);

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
      {/* 1. Header Banner & Action */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-purple-600/15 dark:from-[#131127] dark:via-[#1a1435] dark:to-[#131127] border border-amber-500/20 dark:border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-sm dark:shadow-2xl">
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-3xl -z-0 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold font-brand tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>AI Contextual Storyteller</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              AI Vocabulary Stories 📖
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Transform 5 to 10 vocabulary words from your vault into immersive, memorable bilingual stories (🇧🇩 Bangla-English mixed) and natural full English narratives (🇬🇧).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/dashboard/vocabulary"
              className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
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

        {/* Quick Stats Strip */}
        <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 bg-white/70 dark:bg-white/5 rounded-2xl p-3.5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
              <BookText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Stories</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{stories.length}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/70 dark:bg-white/5 rounded-2xl p-3.5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Target Words Stored</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {stories.reduce((acc, s) => acc + (s.usedVocabulary?.length || 0), 0)}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 bg-white/70 dark:bg-white/5 rounded-2xl p-3.5 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Bilingual Learning</p>
              <p className="text-xs text-purple-600 dark:text-purple-400 font-bold mt-1">Bangla + English</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search stories by title, vocabulary or text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#141226] border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition shadow-xs"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-500" />
            <span>{filteredStories.length} {filteredStories.length === 1 ? "Story" : "Stories"}</span>
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

      {/* 3. Main Content: Compact Card Grid (Small like Vocab Vault) */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-800/50 animate-pulse border border-slate-200 dark:border-slate-800"
            />
          ))}
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
                ? "Try searching for a different keyword or vocabulary word."
                : "Select 5 to 10 vocabulary words from your vault and let AI create an engaging bilingual story for you!"}
            </p>
          </div>
          <button
            onClick={() => {
              if (searchQuery) {
                setSearchQuery("");
              } else {
                setIsGenerateModalOpen(true);
              }
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs sm:text-sm font-bold shadow-md transition cursor-pointer"
          >
            {searchQuery ? (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Clear Search</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Create Your First Story</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredStories.map((story, index) => {
            const displayTitle = story.title || "Vocabulary Story";
            const wordCount = story.usedVocabulary?.length || 0;
            const previewText = story.storyBangla || story.storyEnglish;

            return (
              <div
                key={story.id}
                className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-[#141226] border border-slate-200/90 dark:border-white/10 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.12)] hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-all duration-300 overflow-hidden hover:-translate-y-0.5"
              >
                {/* Top Accent Strip with Gradient */}
                <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />

                {/* Main Card Content */}
                <div className="p-4 sm:p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Top: Badges & Quick Action */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold text-[10px] border border-amber-500/20">
                          #{index + 1}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-semibold text-[10px] border border-indigo-500/20">
                          {wordCount} Words
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(story.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      {/* Delete Quick Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setStoryToDelete(story);
                        }}
                        title="Delete story"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* AI Generated Story Title */}
                    <div>
                      <h3
                        onClick={() => setActiveStoryId(story.id)}
                        className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors cursor-pointer line-clamp-1 capitalize"
                        title={displayTitle}
                      >
                        {displayTitle}
                      </h3>
                    </div>

                    {/* Story Preview Excerpt */}
                    <p
                      onClick={() => setActiveStoryId(story.id)}
                      className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 cursor-pointer"
                    >
                      {previewText}
                    </p>

                    {/* Target Words Pill Tags (First 3 + more) */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex flex-wrap gap-1.5">
                        {story.usedVocabulary.slice(0, 3).map((word) => (
                          <span
                            key={word}
                            className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-700 capitalize"
                          >
                            {word}
                          </span>
                        ))}
                        {story.usedVocabulary.length > 3 && (
                          <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[11px] font-bold border border-amber-500/20">
                            +{story.usedVocabulary.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom: View Details Action */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setActiveStoryId(story.id)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-800 hover:border-amber-500 cursor-pointer group/btn"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-500 group-hover/btn:text-white transition-colors" />
                      <span>View Details</span>
                      <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover/btn:opacity-100 -translate-x-1 group-hover/btn:translate-x-0 transition-all" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Professional Detailed View Modal (Fullscreen Reader) */}
      {isMounted &&
        activeStory &&
        createPortal(
          <div className="fixed inset-0 z-[99999] w-screen h-screen bg-slate-100/95 dark:bg-[#0c0a17]/95 backdrop-blur-md text-slate-900 dark:text-white flex flex-col overflow-hidden animate-in fade-in duration-200">
            {/* Top Navigation & Controls Bar */}
            <div className="shrink-0 w-full px-4 sm:px-8 py-3 bg-white/90 dark:bg-[#131024]/90 border-b border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 sm:gap-4 z-30 shadow-xs">
              {/* Left: Breadcrumbs / Back & Story Counter */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setActiveStoryId(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700/60"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden xs:inline">Back</span>
                </button>

                <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block" />

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">
                    Story <span className="font-bold text-amber-600 dark:text-amber-400">#{activeStoryIndex + 1}</span> of {stories.length}
                  </span>
                </div>
              </div>

              {/* Center: Story Navigation Controls */}
              <div className="flex items-center gap-1.5 bg-slate-100/80 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60">
                <button
                  onClick={() => navigateStory(-1)}
                  title="Previous Story (← Arrow key)"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Prev</span>
                </button>

                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 px-1.5 font-mono">
                  {activeStoryIndex + 1} / {stories.length}
                </span>

                <button
                  onClick={() => navigateStory(1)}
                  title="Next Story (→ Arrow key)"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Right: Copy All, Delete & Close */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleCopy(
                      activeStory.id,
                      `Title: ${activeStory.title || "Vocabulary Story"}\n\n=== 🇧🇩 Bangla-English Mixed ===\n${activeStory.storyBangla}\n\n=== 🇬🇧 Full English ===\n${activeStory.storyEnglish}`,
                      "all"
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold transition-colors cursor-pointer border border-amber-500/30"
                  title="Copy full story content"
                >
                  {copiedState?.id === activeStory.id && copiedState?.type === "all" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="hidden sm:inline">Copied All!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Copy All</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setStoryToDelete(activeStory)}
                  title="Delete story"
                  className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer border border-transparent hover:border-rose-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveStoryId(null)}
                  className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                  title="Close Reader (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Editorial Scrollable Area */}
            <div className="flex-1 w-full overflow-y-auto p-4 sm:p-6 lg:p-10 space-y-6 max-w-5xl mx-auto">
              {/* 1. Story Header Editorial Card */}
              <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#141226] border border-slate-200/90 dark:border-white/10 p-6 sm:p-8 shadow-sm space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-500/20 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                      <span>AI Storyteller</span>
                    </span>
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-500/20">
                      {activeStory.usedVocabulary?.length || 0} Target Words
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>~1 min read</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {new Date(activeStory.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Main Story Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight capitalize font-brand">
                  {activeStory.title || "Vocabulary Story"}
                </h1>

                {/* Target Words Underlined Pill Strip */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-500" />
                      <span>Target Vocabulary in this Story:</span>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeStory.usedVocabulary.map((word) => (
                      <span
                        key={word}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-amber-700 dark:text-amber-300 text-xs sm:text-sm font-bold border border-slate-200 dark:border-slate-700 capitalize underline decoration-amber-500 decoration-2 underline-offset-4 shadow-2xs"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Reader View Mode Switcher (Bangla / English / Side-by-Side) */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex p-1.5 rounded-2xl bg-slate-200/80 dark:bg-slate-900 border border-slate-300/60 dark:border-slate-800">
                  <button
                    onClick={() => setViewTab("bangla")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      viewTab === "bangla"
                        ? "bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <span>🇧🇩 Bangla-English Mixed</span>
                  </button>
                  <button
                    onClick={() => setViewTab("english")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      viewTab === "english"
                        ? "bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <span>🇬🇧 Full English Narrative</span>
                  </button>
                  <button
                    onClick={() => setViewTab("split")}
                    className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      viewTab === "split"
                        ? "bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 shadow-sm"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Columns className="w-3.5 h-3.5" />
                    <span>Side-by-Side View</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    💡 Target words are <span className="font-bold underline decoration-amber-500 underline-offset-4 text-amber-600 dark:text-amber-400">underlined</span> throughout the story
                  </span>
                </div>
              </div>

              {/* 3. Story Reader Container */}
              {viewTab === "bangla" ? (
                /* Single View: Bangla-English Mixed */
                <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#141226] border border-amber-500/25 dark:border-amber-500/20 space-y-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">🇧🇩</span>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                          Bangla-English Mixed Narrative
                        </h3>
                        <p className="text-xs text-slate-400">
                          Contextual storytelling blending natural Bangla with your English target words
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopy(activeStory.id, activeStory.storyBangla, "bangla")}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shadow-2xs"
                    >
                      {copiedState?.id === activeStory.id && copiedState?.type === "bangla" ? (
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

                  {/* Story Text with Underlined Keywords (No background color) */}
                  <div className="text-base sm:text-lg text-slate-800 dark:text-slate-200 font-sans">
                    {renderHighlightedStory(activeStory.storyBangla, activeStory.usedVocabulary)}
                  </div>
                </div>
              ) : viewTab === "english" ? (
                /* Single View: Full English */
                <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#141226] border border-indigo-500/25 dark:border-indigo-500/20 space-y-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">🇬🇧</span>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                          Natural Full English Narrative
                        </h3>
                        <p className="text-xs text-slate-400">
                          Complete English prose incorporating your target vocabulary words smoothly
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopy(activeStory.id, activeStory.storyEnglish, "english")}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shadow-2xs"
                    >
                      {copiedState?.id === activeStory.id && copiedState?.type === "english" ? (
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

                  {/* Story Text with Underlined Keywords (No background color) */}
                  <div className="text-base sm:text-lg text-slate-800 dark:text-slate-200 font-sans">
                    {renderHighlightedStory(activeStory.storyEnglish, activeStory.usedVocabulary)}
                  </div>
                </div>
              ) : (
                /* Side-by-Side Dual View */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: Bangla-English Mixed */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#141226] border border-amber-500/25 space-y-5 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🇧🇩</span>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                          Bangla-English Mixed
                        </h3>
                      </div>
                      <button
                        onClick={() => handleCopy(activeStory.id, activeStory.storyBangla, "bangla")}
                        className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </button>
                    </div>
                    <div className="text-sm sm:text-base text-slate-800 dark:text-slate-200">
                      {renderHighlightedStory(activeStory.storyBangla, activeStory.usedVocabulary)}
                    </div>
                  </div>

                  {/* Right: Full English */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#141226] border border-indigo-500/25 space-y-5 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🇬🇧</span>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                          Full English Prose
                        </h3>
                      </div>
                      <button
                        onClick={() => handleCopy(activeStory.id, activeStory.storyEnglish, "english")}
                        className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </button>
                    </div>
                    <div className="text-sm sm:text-base text-slate-800 dark:text-slate-200">
                      {renderHighlightedStory(activeStory.storyEnglish, activeStory.usedVocabulary)}
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Keyword Analysis Section */}
              {Array.isArray(activeStory.keywordExplanations) && (activeStory.keywordExplanations as unknown[]).length > 0 && (
                <div className="rounded-3xl bg-white dark:bg-[#141226] border border-violet-500/25 dark:border-violet-500/20 shadow-sm overflow-hidden">
                  {/* Section Header */}
                  <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                        Keyword Usage Analysis
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        ????? ??????? ?????? ??????? ? ????????
                      </p>
                    </div>
                  </div>

                  {/* Keyword Cards Grid */}
                  <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {(activeStory.keywordExplanations as KeywordExplanationItem[]).map((item, idx) => (
                      <div
                        key={`kw-${item.word}-${idx}`}
                        className="group flex gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-violet-400/50 dark:hover:border-violet-500/40 transition-all duration-200"
                      >
                        {/* Keyword Badge */}
                        <div className="shrink-0 mt-0.5">
                          <span className="inline-flex items-center justify-center min-w-[2rem] h-8 px-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-bold capitalize">
                            {item.word}
                          </span>
                        </div>
                        {/* Explanation Text */}
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {item.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}

      {/* 5. Delete Confirmation Modal */}
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
                Are you sure you want to delete &ldquo;{storyToDelete.title || "this story"}&rdquo;? This action cannot be undone.
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

      {/* 6. Generate New Story Modal */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#141226] border border-amber-500/30 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    Generate AI Vocabulary Story
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pick 5 to 10 vocabulary words from your vault
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsGenerateModalOpen(false);
                  setNewlyCreatedStory(null);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content: If Story Generated Successfully */}
            {newlyCreatedStory ? (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center gap-3">
                  <Check className="w-5 h-5 shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold">Story successfully generated!</p>
                    <p className="opacity-90">
                      Your story is ready and added to your vocabulary stories collection.
                    </p>
                  </div>
                </div>

                {/* Generated Title Preview */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                    AI Title
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white capitalize">
                    {newlyCreatedStory.title || "Vocabulary Story"}
                  </h4>
                </div>

                {/* Target Words */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Target Words Used:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {newlyCreatedStory.usedVocabulary.map((w) => (
                      <span
                        key={w}
                        className="px-2.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-500/20 capitalize"
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bangla Snippet */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <span>🇧🇩 Bangla-English Mixed Preview</span>
                    </span>
                    <button
                      onClick={() =>
                        handleCopy(newlyCreatedStory.id, newlyCreatedStory.storyBangla, "bangla")
                      }
                      className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedState?.id === newlyCreatedStory.id && copiedState?.type === "bangla" ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-4">
                    {renderHighlightedStory(newlyCreatedStory.storyBangla, newlyCreatedStory.usedVocabulary)}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
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
                    onClick={() => {
                      const id = newlyCreatedStory.id;
                      setIsGenerateModalOpen(false);
                      setNewlyCreatedStory(null);
                      setActiveStoryId(id);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs shadow-md hover:scale-105 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Full Details</span>
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
