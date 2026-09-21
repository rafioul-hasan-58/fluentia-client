import React from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Copy,
  Eye,
  RefreshCw,
  Sparkles,
  X,
} from "lucide-react";
import {
  MyVocabularyItem,
  VocabStoryItem,
} from "@/features/vocabulary/vocab-vault/types/vocabulary";

export interface GenerateNewStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  newlyCreatedStory: VocabStoryItem | null;
  setNewlyCreatedStory: (story: VocabStoryItem | null) => void;
  copiedState: { id: string; type: "bangla" | "english" | "all" } | null;
  handleCopy: (id: string, text: string, type: "bangla" | "english" | "all") => void;
  renderHighlightedStory: (text: string, keywords: string[]) => React.ReactNode;
  selectedWordIds: string[];
  setSelectedWordIds: React.Dispatch<React.SetStateAction<string[]>>;
  setActiveStoryId: (id: string | null) => void;
  isLoadingVault: boolean;
  vaultWords: MyVocabularyItem[];
  handleToggleWord: (id: string) => void;
  storyContext: string;
  setStoryContext: (ctx: string) => void;
  generationError: string | null;
  handleExecuteGenerate: () => void;
  isGenerating: boolean;
}

export const GenerateNewStoryModal: React.FC<GenerateNewStoryModalProps> = ({
  isOpen,
  onClose,
  newlyCreatedStory,
  setNewlyCreatedStory,
  copiedState,
  handleCopy,
  renderHighlightedStory,
  selectedWordIds,
  setSelectedWordIds,
  setActiveStoryId,
  isLoadingVault,
  vaultWords,
  handleToggleWord,
  storyContext,
  setStoryContext,
  generationError,
  handleExecuteGenerate,
  isGenerating,
}) => {
  if (!isOpen) return null;

  return (
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
              onClose();
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
                {newlyCreatedStory.usedVocabulary?.map((w: string) => (
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
                {renderHighlightedStory(newlyCreatedStory.storyBangla, newlyCreatedStory.usedVocabulary || [])}
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
                  onClose();
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
                    href="/dashboard/user/vocabulary"
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-500 font-bold hover:underline"
                  >
                    <span>Add words to Vault</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-52 overflow-y-auto p-1">
                  {vaultWords.map((item: MyVocabularyItem) => {
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
                          <div className="flex items-center gap-1.5 truncate">
                            <p className="text-xs truncate font-semibold capitalize">
                              {item.word?.word}
                            </p>
                            {item.word?.banglaPronunciation && (
                              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium shrink-0">
                                /{item.word.banglaPronunciation}/
                              </span>
                            )}
                          </div>
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
                onClick={onClose}
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
  );
};

export default GenerateNewStoryModal;