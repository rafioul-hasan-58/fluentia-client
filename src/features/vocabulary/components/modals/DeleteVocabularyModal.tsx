import React from "react";
import { MyVocabularyItem } from "@/features/vocabulary/types/vocabulary";
import { Trash2, X, RefreshCw } from "lucide-react";
import { POS_COLORS } from "../../constants/vocabularyConstants";

export interface DeleteVocabularyModalProps {
  itemToDelete: MyVocabularyItem | null;
  setItemToDelete: (item: MyVocabularyItem | null) => void;
  isDeleting: boolean;
  handleConfirmDelete: () => void;
}

export default function DeleteVocabularyModal({
  itemToDelete,
  setItemToDelete,
  isDeleting,
  handleConfirmDelete,
}: DeleteVocabularyModalProps) {
  if (!itemToDelete) return null;

  return (
            <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#141226] border border-rose-500/20 dark:border-rose-500/30 shadow-[0_25px_60px_-15px_rgba(244,63,94,0.3)] overflow-hidden animate-in zoom-in-95 duration-150 p-6 space-y-5">
              {/* Glow decorative background */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Header with animated icon and close */}
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-inner">
                  <Trash2 className="w-6 h-6" />
                </div>
                <button
                  onClick={() => !isDeleting && setItemToDelete(null)}
                  disabled={isDeleting}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Title and Message */}
              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Remove Word from Vault?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Are you sure you want to remove this vocabulary item? You can re-add it anytime with AI.
                </p>
              </div>

              {/* Word Preview Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white capitalize">
                      {itemToDelete.word.word}
                    </h4>
                    {itemToDelete.word.banglaPronunciation && (
                      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.5 rounded border border-indigo-200/60 dark:border-indigo-800/60">
                        উচ্চারণ: {itemToDelete.word.banglaPronunciation}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium mt-0.5">
                    {itemToDelete.word.banglaMeaning}
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${POS_COLORS[itemToDelete.word.partOfSpeech]?.bg || "bg-indigo-500/10"
                    } ${POS_COLORS[itemToDelete.word.partOfSpeech]?.text || "text-indigo-600 dark:text-indigo-400"
                    } ${POS_COLORS[itemToDelete.word.partOfSpeech]?.border || "border-indigo-500/30"
                    }`}
                >
                  {POS_COLORS[itemToDelete.word.partOfSpeech]?.label || itemToDelete.word.partOfSpeech}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setItemToDelete(null)}
                  disabled={isDeleting}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Keep Word
                </button>

                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold shadow-lg shadow-rose-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {isDeleting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Removing...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Yes, Remove Word</span>
                    </>
                  )}
                </button>
              </div>
            </div>
  );
}
