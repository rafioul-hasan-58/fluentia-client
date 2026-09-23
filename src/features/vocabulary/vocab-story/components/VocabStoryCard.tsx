"use client";

import React from "react";
import { Calendar, Pencil, Trash2, Eye, ArrowRight } from "lucide-react";
import { VocabStoryItem } from "@/features/vocabulary/vocab-vault/types/vocabulary";

interface VocabStoryCardProps {
  story: VocabStoryItem;
  index: number;
  onOpenEditTitle: (story: VocabStoryItem) => void;
  onDelete: (story: VocabStoryItem) => void;
  onViewDetails: (storyId: string) => void;
}

export const VocabStoryCard: React.FC<VocabStoryCardProps> = ({
  story,
  index,
  onOpenEditTitle,
  onDelete,
  onViewDetails,
}) => {
  const displayTitle = story.title || "Vocabulary Story";
  const wordCount = story.usedVocabulary?.length || 0;
  const previewText = story.storyBangla || story.storyEnglish;

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-[#141226] border border-slate-200/90 dark:border-white/10 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.12)] hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-all duration-300 overflow-hidden hover:-translate-y-0.5">
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

            {/* Actions: Edit & Delete */}
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenEditTitle(story);
                }}
                title="Edit story title"
                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(story);
                }}
                title="Delete story"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* AI Generated Story Title */}
          <div>
            <h3
              onClick={() => onViewDetails(story.id)}
              className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors cursor-pointer line-clamp-1 capitalize"
              title={displayTitle}
            >
              {displayTitle}
            </h3>
          </div>

          {/* Story Preview Excerpt */}
          <p
            onClick={() => onViewDetails(story.id)}
            className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 cursor-pointer"
          >
            {previewText}
          </p>

          {/* Target Words Pill Tags (First 3 + more) */}
          <div className="space-y-1.5 pt-1">
            <div className="flex flex-wrap gap-1.5">
              {story.usedVocabulary.slice(0, 3).map((word) => {
                const clean = word.replace(/^['"‘’“”]+|['"‘’“”]+$/g, "");
                return (
                  <span
                    key={clean}
                    className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-slate-700 capitalize"
                  >
                    {clean}
                  </span>
                );
              })}
              {story.usedVocabulary.length > 3 && (
                <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[11px] font-bold border border-amber-500/20">
                  +{story.usedVocabulary.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card bottom: View Details Action */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <button
            onClick={() => onViewDetails(story.id)}
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
};
