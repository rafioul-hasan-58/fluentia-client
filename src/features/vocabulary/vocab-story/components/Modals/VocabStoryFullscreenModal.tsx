"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Trash2,
  X,
  Sparkles,
  Calendar,
  Columns,
  GraduationCap,
} from "lucide-react";
import {
  VocabStoryItem,
  KeywordExplanationItem,
} from "@/features/vocabulary/vocab-vault/types/vocabulary";
import { renderHighlightedStory } from "../../utils/storyHighlighter";

interface VocabStoryFullscreenModalProps {
  isOpen: boolean;
  activeStory: VocabStoryItem | null;
  activeStoryIndex: number;
  totalStories: number;
  onClose: () => void;
  onNavigateStory: (direction: number) => void;
  viewTab: "bangla" | "english" | "split";
  setViewTab: (tab: "bangla" | "english" | "split") => void;
  copiedState: { id: string; type: "bangla" | "english" | "all" } | null;
  onCopy: (storyId: string, text: string, type: "bangla" | "english" | "all") => void;
  onDelete: (story: VocabStoryItem) => void;
}

export const VocabStoryFullscreenModal: React.FC<VocabStoryFullscreenModalProps> = ({
  isOpen,
  activeStory,
  activeStoryIndex,
  totalStories,
  onClose,
  onNavigateStory,
  viewTab,
  setViewTab,
  copiedState,
  onCopy,
  onDelete,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isOpen || !activeStory || !isMounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] w-screen h-screen bg-slate-100/95 dark:bg-[#0c0a17]/95 backdrop-blur-md text-slate-900 dark:text-white flex flex-col overflow-hidden animate-in fade-in duration-200">
      {/* Top Navigation & Controls Bar */}
      <div className="shrink-0 w-full px-4 sm:px-8 py-3 bg-white/90 dark:bg-[#131024]/90 border-b border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 sm:gap-4 z-30 shadow-xs">
        {/* Left: Breadcrumbs / Back & Story Counter */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700/60"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden xs:inline">Back</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-600 dark:text-slate-400">
              Story <span className="font-bold text-amber-600 dark:text-amber-400">#{activeStoryIndex + 1}</span> of {totalStories}
            </span>
          </div>
        </div>

        {/* Center: Story Navigation Controls */}
        <div className="flex items-center gap-1.5 bg-slate-100/80 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60">
          <button
            onClick={() => onNavigateStory(-1)}
            title="Previous Story (← Arrow key)"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 px-1.5 font-mono">
            {activeStoryIndex + 1} / {totalStories}
          </span>

          <button
            onClick={() => onNavigateStory(1)}
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
              onCopy(
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
            onClick={() => onDelete(activeStory)}
            title="Delete story"
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer border border-transparent hover:border-rose-500/20"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
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

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                Created on{" "}
                {new Date(activeStory.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight capitalize leading-tight">
              {activeStory.title || "Vocabulary Story"}
            </h1>
          </div>

          {/* Target Words Pill Strip */}
          <div className="space-y-2 pt-1">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Integrated Vocabulary Words
            </p>
            <div className="flex flex-wrap gap-2">
              {activeStory.usedVocabulary?.map((word) => {
                const clean = word.replace(/^['"‘’“”]+|['"‘’“”]+$/g, "");
                return (
                  <span
                    key={clean}
                    className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 text-xs font-semibold capitalize hover:border-amber-400 transition-colors"
                  >
                    {clean}
                  </span>
                );
              })}
            </div>
          </div>

          {/* View Tab Selector: Bangla / English / Split */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 flex-wrap gap-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Select Reading Mode:
            </span>
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-[#1a1733] border border-slate-200 dark:border-white/5">
              <button
                onClick={() => setViewTab("bangla")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewTab === "bangla"
                    ? "bg-white dark:bg-amber-500 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span>🇧🇩</span>
                <span>Bangla-English</span>
              </button>

              <button
                onClick={() => setViewTab("english")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewTab === "english"
                    ? "bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span>🇬🇧</span>
                <span>English</span>
              </button>

              <button
                onClick={() => setViewTab("split")}
                className={`hidden md:flex px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer items-center gap-1.5 ${
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

        {/* 2. Story Content Presentation */}
        {viewTab === "bangla" && (
          <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#141226] border border-amber-500/20 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇧🇩</span>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                    Bangla-English Mixed Context Story
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Target words integrated naturally in bilingual flow
                  </p>
                </div>
              </div>
              <button
                onClick={() => onCopy(activeStory.id, activeStory.storyBangla, "bangla")}
                className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedState?.id === activeStory.id && copiedState?.type === "bangla" ? (
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
            <div className="text-sm sm:text-base text-slate-800 dark:text-slate-200">
              {renderHighlightedStory(activeStory.storyBangla, activeStory.usedVocabulary)}
            </div>
          </div>
        )}

        {viewTab === "english" && (
          <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#141226] border border-indigo-500/20 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇬🇧</span>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                    Full English Narrative Prose
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Idiomatic English storytelling with target keywords
                  </p>
                </div>
              </div>
              <button
                onClick={() => onCopy(activeStory.id, activeStory.storyEnglish, "english")}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedState?.id === activeStory.id && copiedState?.type === "english" ? (
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
            <div className="text-sm sm:text-base text-slate-800 dark:text-slate-200">
              {renderHighlightedStory(activeStory.storyEnglish, activeStory.usedVocabulary)}
            </div>
          </div>
        )}

        {/* 3. Side-by-Side Dual Column View */}
        {viewTab === "split" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Bangla-English */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#141226] border border-amber-500/25 space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🇧🇩</span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                    Bangla-English Mixed
                  </h3>
                </div>
                <button
                  onClick={() => onCopy(activeStory.id, activeStory.storyBangla, "bangla")}
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
                  onClick={() => onCopy(activeStory.id, activeStory.storyEnglish, "english")}
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
                      {item.word.replace(/^['"‘’“”]+|['"‘’“”]+$/g, "")}
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
  );
};
