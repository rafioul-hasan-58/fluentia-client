import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  Minimize2,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { MyVocabularyItem } from "@/types";

interface DetailMobileHeaderProps {
  handleExit: () => void;
  navigateCarousel: (direction: -1 | 1) => void;
  currentIndex: number;
  totalWordCount: number;
  displayIndex: number;
  vaultListLength: number;
  item: MyVocabularyItem;
  handleOpenEditModal: (item: MyVocabularyItem) => void;
  setItemToDelete: (item: MyVocabularyItem) => void;
  handleToggleFavorite: () => void;
}

export function DetailMobileHeader({
  handleExit,
  navigateCarousel,
  currentIndex,
  totalWordCount,
  displayIndex,
  vaultListLength,
  item,
  handleOpenEditModal,
  setItemToDelete,
  handleToggleFavorite,
}: DetailMobileHeaderProps) {
  return (
    <div className="lg:hidden shrink-0 w-full px-2.5 sm:px-6 py-2 sm:py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-1 z-30 sticky top-16 backdrop-blur-md">
      {/* inset-inline-start: Exit to Vocab Vault */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={handleExit}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all cursor-pointer border border-slate-200/90 dark:border-slate-700/80 shadow-xs shrink-0"
          title="Exit to Vocabulary Vault"
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
          title="Previous Word (← Arrow key)"
          className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all cursor-pointer border border-slate-200/90 dark:border-slate-700/80 shadow-xs disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Counter: 1/12 */}
        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 px-1 font-mono select-none whitespace-nowrap">
          {displayIndex}/{totalWordCount}
        </span>

        <button
          type="button"
          onClick={() => navigateCarousel(1)}
          disabled={currentIndex === -1 || currentIndex >= vaultListLength - 1}
          title="Next Word (→ Arrow key)"
          className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all cursor-pointer border border-slate-200/90 dark:border-slate-700/80 shadow-xs disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* inset-inline-end: Actions (Edit, Delete, Favorite, Close) */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => handleOpenEditModal(item)}
          className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-indigo-50/80 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 transition-all cursor-pointer border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs shrink-0"
          title="Update Vocabulary"
        >
          <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
        </button>

        <button
          type="button"
          onClick={() => setItemToDelete(item)}
          className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-rose-50/90 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-500 dark:text-rose-400 transition-all cursor-pointer border border-rose-200/80 dark:border-rose-800/60 shadow-xs shrink-0"
          title="Delete Vocabulary"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
        </button>

        <button
          type="button"
          onClick={handleToggleFavorite}
          title={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
          className={`inline-flex items-center justify-center w-7 h-7 rounded-xl transition-all cursor-pointer border shadow-xs shrink-0 ${
            item.isFavorite
              ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
              : "bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border-slate-200/90 dark:border-slate-700/80"
          }`}
        >
          <Star
            className={`w-3.5 h-3.5 ${
              item.isFavorite ? "fill-amber-400 text-amber-400" : ""
            }`}
          />
        </button>

        <button
          type="button"
          onClick={handleExit}
          className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer border border-slate-200/90 dark:border-slate-700/80 shadow-xs shrink-0"
          title="Close to Vocabulary Vault (Esc)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
