import React from "react";
import { Sparkles, X, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

export interface AddVocabularyModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  handleExecuteAddSingleWord: (e: React.FormEvent) => void;
  inputWordText: string;
  setInputWordText: (text: string) => void;
  userNote: string;
  setUserNote: (note: string) => void;
  isGenerating: boolean;
  feedbackMessage: { text: string; type: "success" | "error" } | null;
}

export default function AddVocabularyModal({
  isModalOpen,
  setIsModalOpen,
  handleExecuteAddSingleWord,
  inputWordText,
  setInputWordText,
  userNote,
  setUserNote,
  isGenerating,
  feedbackMessage,
}: AddVocabularyModalProps) {
  if (!isModalOpen) return null;

  return (
            <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="p-6 bg-gradient-to-r from-purple-600/10 via-primary/10 to-fuchsia-600/10 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Add Vocabulary with AI
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Generate definitions, Bengali meanings, collocations & examples
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => !isGenerating && setIsModalOpen(false)}
                  disabled={isGenerating}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body Form */}
              <form onSubmit={handleExecuteAddSingleWord} className="p-6 space-y-5">
                {/* Single Word Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Vocabulary Word</span>
                    <span className="text-[11px] font-normal text-slate-400">e.g. significant</span>
                  </label>

                  <div className="relative">
                    <input
                      type="text"
                      value={inputWordText}
                      onChange={(e) => setInputWordText(e.target.value)}
                      disabled={isGenerating}
                      autoFocus
                      placeholder="Enter an English word (e.g. significant)..."
                      className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-base font-medium shadow-inner"
                    />
                    {inputWordText && !isGenerating && (
                      <button
                        type="button"
                        onClick={() => setInputWordText("")}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Optional Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Optional Study Note / Context
                  </label>
                  <input
                    type="text"
                    value={userNote}
                    onChange={(e) => setUserNote(e.target.value)}
                    disabled={isGenerating}
                    placeholder="e.g. Academic writing / IELTS Task 2 / Oxford 3000..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Feedback / Progress Indicator */}
                {isGenerating && (
                  <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center gap-3 text-purple-700 dark:text-purple-300 animate-pulse">
                    <Sparkles className="w-5 h-5 animate-spin text-purple-500" />
                    <div className="text-xs font-semibold">
                      <p>AI is analyzing &apos;{inputWordText.trim()}&apos;...</p>
                      <p className="text-[11px] opacity-75">
                        Extracting meaning, Bengali translation, collocations & CEFR level.
                      </p>
                    </div>
                  </div>
                )}

                {feedbackMessage && (
                  <div
                    className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold border ${feedbackMessage.type === "success"
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20"
                      }`}
                  >
                    {feedbackMessage.type === "success" ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    )}
                    <span>{feedbackMessage.text}</span>
                  </div>
                )}

                {/* Modal Footer Actions */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isGenerating}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isGenerating || !inputWordText.trim()}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-primary to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-sm font-bold shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Generate with AI</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
  );
}
