import React from "react";
import { MyVocabularyItem } from "@/features/vocabulary/types/vocabulary";
import { Sparkles, ArrowRight, X, AlertCircle, RefreshCw } from "lucide-react";

export interface StoryContextModalProps {
  isStorySelectMode: boolean;
  selectedStoryItems: MyVocabularyItem[];
  setSelectedStoryItems: React.Dispatch<React.SetStateAction<MyVocabularyItem[]>>;
  isStoryContextModalOpen: boolean;
  setIsStoryContextModalOpen: (open: boolean) => void;
  storyContext: string;
  setStoryContext: (val: string) => void;
  isCreatingStory: boolean;
  storyCreationError: string | null;
  setStoryCreationError: (err: string | null) => void;
  handleToggleStoryWord: (item: MyVocabularyItem) => void;
  handleExecuteStoryGeneration: () => void;
}

export default function StoryContextModal({
  isStorySelectMode,
  selectedStoryItems,
  setSelectedStoryItems,
  isStoryContextModalOpen,
  setIsStoryContextModalOpen,
  storyContext,
  setStoryContext,
  isCreatingStory,
  storyCreationError,
  setStoryCreationError,
  handleToggleStoryWord,
  handleExecuteStoryGeneration,
}: StoryContextModalProps) {
  return (
    <>
      {
        isStorySelectMode && (
          <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 animate-in fade-in slide-in-from-bottom-5 duration-200">
            <button
              type="button"
              onClick={() => {
                if (selectedStoryItems.length === 0) {
                  alert("Please select at least 1 vocabulary word (recommended 5 to 10) to create your story.");
                  return;
                }
                setStoryCreationError(null);
                setIsStoryContextModalOpen(true);
              }}
              className="group flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 text-white font-bold text-sm sm:text-base shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/60 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
              title="Create story with selected vocabulary"
            >
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
              </div>
              <span>Create Story</span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/25 text-xs font-black tracking-wide">
                {selectedStoryItems.length}
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        )
      }

      {/* 9. Story Context Popup Modal */}
      {
        isStoryContextModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#141226] border border-amber-500/30 shadow-2xl p-6 sm:p-8 space-y-5 animate-in zoom-in-95 duration-150">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Create AI Vocabulary Story
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedStoryItems.length} {selectedStoryItems.length === 1 ? "word" : "words"} chosen for this story
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!isCreatingStory) setIsStoryContextModalOpen(false);
                  }}
                  disabled={isCreatingStory}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Selected Words Pill List */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Selected Words ({selectedStoryItems.length}):
                  </label>
                  <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                    {selectedStoryItems.length >= 5 ? "Great selection! ✨" : "5–10 recommended"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  {selectedStoryItems.map((item) => (
                    <span
                      key={item.id}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-2xs capitalize"
                    >
                      <span>{item.word?.word}</span>
                      {!isCreatingStory && (
                        <button
                          type="button"
                          onClick={() => handleToggleStoryWord(item)}
                          className="text-slate-400 hover:text-rose-500 transition-colors ml-0.5 cursor-pointer"
                          title="Remove word"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* Context Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Story Context / Theme (Optional)</span>
                  <span className="text-[11px] font-normal text-slate-400">Optional</span>
                </label>
                <textarea
                  rows={3}
                  value={storyContext}
                  onChange={(e) => setStoryContext(e.target.value)}
                  disabled={isCreatingStory}
                  placeholder="e.g., A rainy day in Dhaka preparing for an IELTS exam, a conversation at an airport, a tech startup pitch, or a campus memory..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition resize-none disabled:opacity-50"
                />
              </div>

              {/* Generation Info Banner */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-200 space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Dual Language Generation</span>
                </p>
                <p className="text-[11px] opacity-90">
                  Will generate both a 🇧🇩 Bangla-English mixed narrative and a 🇬🇧 natural full English narrative incorporating your words.
                </p>
              </div>

              {/* Error Message if any */}
              {storyCreationError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{storyCreationError}</span>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsStoryContextModalOpen(false)}
                  disabled={isCreatingStory}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteStoryGeneration}
                  disabled={isCreatingStory || selectedStoryItems.length === 0}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isCreatingStory ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating Story...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>OK, Create Story</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
}
