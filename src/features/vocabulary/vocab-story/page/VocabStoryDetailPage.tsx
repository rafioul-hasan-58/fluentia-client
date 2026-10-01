"use client";

import React from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Trash2,
  Pencil,
  Edit3,
  Minimize2,
  X,
  Sparkles,
  Calendar,
  Columns,
  GraduationCap,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { KeywordExplanationItem } from "@/types";
import { useVocabStoryDetail } from "../hooks";
import { renderHighlightedStory } from "../utils/storyHighlighter";
import {
  EditStoryTitleModal,
  DeleteStoryModal,
} from "../components/Modals";

interface VocabStoryDetailPageProps {
  storyId: string;
}

export function VocabStoryDetailPage({ storyId }: VocabStoryDetailPageProps) {
  const {
    story,
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
    reloadStory,
  } = useVocabStoryDetail(storyId);

  // 1. Loading Skeleton State
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-pulse pb-16">
        <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-64 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
        <div className="h-96 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
      </div>
    );
  }

  // 2. Not Found or Error State
  if (!story || error) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
          <BookOpen className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Story Not Found
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            {error || "We couldn't locate the vocabulary story you requested."}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/dashboard/user/vocabulary/stories"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition-all shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Stories</span>
          </Link>
          {error && (
            <button
              onClick={reloadStory}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-colors cursor-pointer"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  const wordCount = story.usedVocabulary?.length || 0;

  return (
    <div className="-mx-3 -mt-3 sm:mx-0 sm:mt-0 w-[calc(100%+1.5rem)] sm:w-full min-h-[90vh] bg-transparent text-slate-900 dark:text-white flex flex-col animate-in fade-in duration-200">
      {/* 1. Top Header Bar (Mobile Mode Only: Exit, Carousel, Actions) */}
      <div className="lg:hidden shrink-0 w-full px-2.5 sm:px-6 py-2 sm:py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-1 z-30 sticky top-16 backdrop-blur-md">
        {/* Exit to Stories */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleExit}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all cursor-pointer border border-slate-200/90 dark:border-slate-700/80 shadow-xs shrink-0"
            title="Exit to Vocabulary Stories"
          >
            <Minimize2 className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
            <span>Exit</span>
          </button>
        </div>

        {/* Center: Carousel Navigation */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => navigateCarousel(-1)}
            disabled={currentIndex <= 0}
            title="Previous Story (← Arrow key)"
            className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all cursor-pointer border border-slate-200/90 dark:border-slate-700/80 shadow-xs disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Counter: 1/9 */}
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 px-1 font-mono select-none whitespace-nowrap">
            {displayIndex}/{totalStories}
          </span>

          <button
            type="button"
            onClick={() => navigateCarousel(1)}
            disabled={currentIndex === -1 || currentIndex >= allStories.length - 1}
            title="Next Story (→ Arrow key)"
            className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all cursor-pointer border border-slate-200/90 dark:border-slate-700/80 shadow-xs disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Action Controls: Edit, Delete, Copy, Close */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => handleOpenEditTitle(story)}
            className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-indigo-50/80 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 transition-all cursor-pointer border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs shrink-0"
            title="Update Story Title"
          >
            <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
          </button>

          <button
            type="button"
            onClick={() => setStoryToDelete(story)}
            className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-rose-50/90 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-500 dark:text-rose-400 transition-all cursor-pointer border border-rose-200/80 dark:border-rose-800/60 shadow-xs shrink-0"
            title="Delete Story"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
          </button>

          <button
            type="button"
            onClick={() =>
              handleCopy(
                story.id,
                `Title: ${story.title || "Vocabulary Story"}\n\n=== 🇧🇩 Bangla-English Mixed ===\n${story.storyBangla}\n\n=== 🇬🇧 Full English ===\n${story.storyEnglish}`,
                "all"
              )
            }
            className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-amber-50/80 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-600 dark:text-amber-400 transition-all cursor-pointer border border-amber-200/80 dark:border-amber-800/60 shadow-xs shrink-0"
            title="Copy Story Content"
          >
            {copiedState?.id === story.id && copiedState?.type === "all" ? (
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            )}
          </button>

          <button
            type="button"
            onClick={handleExit}
            className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer border border-slate-200/90 dark:border-slate-700/80 shadow-xs shrink-0"
            title="Close & Back to Stories (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-5xl mx-auto p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 pb-20">
        {/* Desktop Breadcrumb Navigation & Controls */}
        <div className="hidden lg:flex items-center justify-between pb-1 select-none">
          <Link
            href="/dashboard/user/vocabulary/stories"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Stories</span>
          </Link>

          {allStories.length > 1 && (
            <div className="flex items-center gap-1 bg-amber-500/10 dark:bg-amber-500/15 p-1 rounded-xl border border-amber-500/25">
              <button
                type="button"
                onClick={() => navigateCarousel(-1)}
                disabled={currentIndex <= 0}
                title="Previous Story (← Arrow key)"
                className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg hover:bg-amber-500/20 text-amber-800 dark:text-amber-200 text-xs font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              <span className="text-xs font-bold text-amber-900 dark:text-amber-200 px-2 font-mono whitespace-nowrap min-w-[3.5rem] text-center">
                {displayIndex}&nbsp;/&nbsp;{totalStories}
              </span>

              <button
                type="button"
                onClick={() => navigateCarousel(1)}
                disabled={currentIndex === -1 || currentIndex >= allStories.length - 1}
                title="Next Story (→ Arrow key)"
                className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg hover:bg-amber-500/20 text-amber-800 dark:text-amber-200 text-xs font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Desktop Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                handleCopy(
                  story.id,
                  `Title: ${story.title || "Vocabulary Story"}\n\n=== 🇧🇩 Bangla-English Mixed ===\n${story.storyBangla}\n\n=== 🇬🇧 Full English ===\n${story.storyEnglish}`,
                  "all"
                )
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold transition-colors cursor-pointer border border-amber-500/30"
              title="Copy full story content"
            >
              {copiedState?.id === story.id && copiedState?.type === "all" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Copied All!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy All</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleOpenEditTitle(story)}
              title="Edit story title"
              className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-amber-50 dark:bg-slate-800 dark:hover:bg-amber-950/40 text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setStoryToDelete(story)}
              title="Delete story"
              className="p-1.5 sm:p-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer border border-rose-200/80 dark:border-rose-900/60"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      {/* 2. Editorial Header Card */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-[#141226] border border-slate-200/90 dark:border-white/10 p-4 sm:p-7 lg:p-8 shadow-xs space-y-4 sm:space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3 sm:pb-4">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="px-2.5 sm:px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[11px] sm:text-xs font-bold border border-amber-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-500 animate-pulse" />
              <span>AI Storyteller</span>
            </span>
            <span className="px-2.5 sm:px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-[11px] sm:text-xs font-bold border border-indigo-500/20">
              {wordCount} Target Words
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              Created on{" "}
              {new Date(story.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="flex items-start justify-between gap-3">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight capitalize leading-snug sm:leading-tight">
            {story.title || "Vocabulary Story"}
          </h1>
          <button
            type="button"
            onClick={() => handleOpenEditTitle(story)}
            title="Edit story title"
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 border border-slate-200/80 dark:border-slate-700/60 transition-colors cursor-pointer shrink-0 mt-0.5"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>

        {/* Target Words Pill Strip (Interactive: click to open word in Vocab Vault) */}
        <div className="space-y-2 pt-1">
          <p className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Integrated Vocabulary Words (Click word for definition)
          </p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {story.usedVocabulary?.map((word) => {
              const clean = word.replace(/^['"‘’“”]+|['"‘’“”]+$/g, "");
              return (
                <Link
                  key={clean}
                  href={`/dashboard/user/vocabulary/${encodeURIComponent(clean.toLowerCase())}`}
                  className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 text-xs font-semibold capitalize hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 transition-all active:scale-95"
                  title={`View details for ${clean}`}
                >
                  <span>{clean}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* View Tab Selector: Bangla / English / Split */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-slate-100 dark:border-slate-800/80 gap-2.5 sm:gap-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Select Reading Mode:
          </span>
          <div className="grid grid-cols-2 md:flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-[#1a1733] border border-slate-200 dark:border-white/5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setViewTab("bangla")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                viewTab === "bangla"
                  ? "bg-white dark:bg-amber-500 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>🇧🇩</span>
              <span>Bangla-English</span>
            </button>

            <button
              type="button"
              onClick={() => setViewTab("english")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                viewTab === "english"
                  ? "bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>🇬🇧</span>
              <span>English</span>
            </button>

            <button
              type="button"
              onClick={() => setViewTab("split")}
              className={`hidden md:flex px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer items-center justify-center gap-1.5 ${
                viewTab === "split"
                  ? "bg-white dark:bg-purple-600 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Side by Side</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Story Content Presentation */}
      {viewTab === "bangla" && (
        <div className="p-4 sm:p-7 lg:p-9 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#141226] border border-amber-500/20 shadow-xs space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 sm:pb-4 gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">🇧🇩</span>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-lg">
                  Bangla-English Mixed Story
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                  Target words integrated in bilingual context
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(story.id, story.storyBangla, "bangla")}
              className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer shrink-0"
            >
              {copiedState?.id === story.id && copiedState?.type === "bangla" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>
          <div className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-bangla">
            {renderHighlightedStory(story.storyBangla, story.usedVocabulary)}
          </div>
        </div>
      )}

      {viewTab === "english" && (
        <div className="p-4 sm:p-7 lg:p-9 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#141226] border border-indigo-500/20 shadow-xs space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 sm:pb-4 gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">🇬🇧</span>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-lg">
                  Full English Narrative Prose
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                  Idiomatic English storytelling with target keywords
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(story.id, story.storyEnglish, "english")}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer shrink-0"
            >
              {copiedState?.id === story.id && copiedState?.type === "english" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>
          <div className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed">
            {renderHighlightedStory(story.storyEnglish, story.usedVocabulary)}
          </div>
        </div>
      )}

      {viewTab === "split" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Bangla Side */}
          <div className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#141226] border border-amber-500/20 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-xl">🇧🇩</span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                    Bangla-English Story
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(story.id, story.storyBangla, "bangla")}
                  className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
              </div>
              <div className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-bangla">
                {renderHighlightedStory(story.storyBangla, story.usedVocabulary)}
              </div>
            </div>
          </div>

          {/* English Side */}
          <div className="p-4 sm:p-7 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#141226] border border-indigo-500/20 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-xl">🇬🇧</span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                    Full English Prose
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(story.id, story.storyEnglish, "english")}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
              </div>
              <div className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed">
                {renderHighlightedStory(story.storyEnglish, story.usedVocabulary)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Keyword Analysis Section */}
      {Array.isArray(story.keywordExplanations) &&
        (story.keywordExplanations as unknown[]).length > 0 && (
          <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-[#141226] border border-violet-500/25 dark:border-violet-500/20 shadow-xs overflow-hidden">
            <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-xs">
                <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                  Keyword Usage Analysis & Context
                </h3>
              </div>
            </div>

            <div className="p-3.5 sm:p-5 lg:p-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
              {(story.keywordExplanations as KeywordExplanationItem[]).map(
                (item, idx) => {
                  const clean = item.word.replace(/^['"‘’“”]+|['"‘’“”]+$/g, "");
                  return (
                    <div
                      key={`kw-${clean}-${idx}`}
                      className="group flex gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-violet-400/50 dark:hover:border-violet-500/40 transition-all duration-200"
                    >
                      <div className="shrink-0 mt-0.5">
                        <Link
                          href={`/dashboard/user/vocabulary/${encodeURIComponent(clean.toLowerCase())}`}
                          className="inline-flex items-center justify-center min-w-[2rem] h-7 sm:h-8 px-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-bold capitalize hover:bg-violet-500/20 transition-colors"
                          title={`View ${clean} in Vocabulary Vault`}
                        >
                          {clean}
                        </Link>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.explanation}
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit Story Title Modal */}
      <EditStoryTitleModal
        isOpen={Boolean(editingStory)}
        onClose={handleCloseEditTitle}
        story={
          editingStory
            ? { id: editingStory.id, title: editingStory.title || "" }
            : null
        }
        titleInput={titleInput}
        setTitleInput={setTitleInput}
        isUpdating={isUpdatingTitle}
        error={updateTitleError}
        onSave={handleSaveEditTitle}
      />

      {/* Delete Story Modal */}
      <DeleteStoryModal
        isOpen={Boolean(storyToDelete)}
        story={storyToDelete}
        isDeleting={isDeleting}
        onClose={() => setStoryToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default VocabStoryDetailPage;
