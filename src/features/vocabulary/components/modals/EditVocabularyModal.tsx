import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MyVocabularyItem } from "@/features/vocabulary/types/vocabulary";
import {
  Edit3,
  Star,
  X,
  MessageSquare,
  CheckCircle2,
  Trash2,
  Plus,
  FileText,
  AlertCircle,
  RefreshCw,
  Check,
} from "lucide-react";
import { POS_COLORS } from "../../constants/vocabularyConstants";

export interface EditVocabularyModalProps {
  editingItem: MyVocabularyItem | null;
  setEditingItem: (item: MyVocabularyItem | null) => void;
  isSavingEdit: boolean;
  handleSaveEdit: (e: React.FormEvent) => void;
  editStatus: string;
  setEditStatus: (status: string) => void;
  editIsFavorite: boolean;
  setEditIsFavorite: React.Dispatch<React.SetStateAction<boolean>>;
  editSentences: string[];
  handleRemoveSentence: (idx: number) => void;
  editNewSentence: string;
  setEditNewSentence: (val: string) => void;
  handleAddSentenceToEdit: () => void;
  editNotes: string;
  setEditNotes: (notes: string) => void;
  editFeedback: { text: string; type: "success" | "error" } | null;
}

export default function EditVocabularyModal({
  editingItem,
  setEditingItem,
  isSavingEdit,
  handleSaveEdit,
  editStatus,
  setEditStatus,
  editIsFavorite,
  setEditIsFavorite,
  editSentences,
  handleRemoveSentence,
  editNewSentence,
  setEditNewSentence,
  handleAddSentenceToEdit,
  editNotes,
  setEditNotes,
  editFeedback,
}: EditVocabularyModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSavingEdit) {
        setEditingItem(null);
      }
    };
    if (editingItem) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editingItem, isSavingEdit, setEditingItem]);

  if (!isMounted || !editingItem) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => !isSavingEdit && setEditingItem(null)}
    >
      <div
        className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
              {/* Modal Header */}
              <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white capitalize">
                        Update &apos;{editingItem.word.word}&apos;
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${POS_COLORS[editingItem.word.partOfSpeech]?.bg || "bg-indigo-500/10"
                          } ${POS_COLORS[editingItem.word.partOfSpeech]?.text || "text-indigo-600 dark:text-indigo-400"
                          } ${POS_COLORS[editingItem.word.partOfSpeech]?.border || "border-indigo-500/30"
                          }`}
                      >
                        {POS_COLORS[editingItem.word.partOfSpeech]?.label || editingItem.word.partOfSpeech}
                      </span>
                      {editingItem.word.banglaPronunciation && (
                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md border border-indigo-200/60 dark:border-indigo-800/60">
                          উচ্চারণ: {editingItem.word.banglaPronunciation}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {editingItem.word.banglaMeaning}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => !isSavingEdit && setEditingItem(null)}
                  disabled={isSavingEdit}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body - Scrollable Form */}
              <form onSubmit={handleSaveEdit} className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 min-h-0">
                {/* Status & Favorite Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Status Switcher */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Vocabulary Status
                    </label>
                    <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                      {[
                        { id: "LEARNING", label: "Learning" },
                        { id: "LEARNED", label: "Learned" },
                        { id: "MASTERED", label: "Mastered" },
                      ].map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => setEditStatus(st.id)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center ${editStatus === st.id
                            ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm"
                            : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                            }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Favorite Toggle */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Favorite Status
                    </label>
                    <button
                      type="button"
                      onClick={() => setEditIsFavorite((prev) => !prev)}
                      className={`w-full py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${editIsFavorite
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                    >
                      <Star
                        className={`w-4 h-4 ${editIsFavorite ? "fill-amber-400 text-amber-400" : "text-slate-400"
                          }`}
                      />
                      <span>{editIsFavorite ? "Marked as Favorite" : "Add to Favorites"}</span>
                    </button>
                  </div>
                </div>

                {/* My Practice Sentences */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                      Practice Sentences ({editSentences.length})
                    </label>
                    <span className="text-[11px] text-slate-400">Add personal usage</span>
                  </div>

                  {/* Sentences List */}
                  {editSentences.length > 0 ? (
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {editSentences.map((sentence, idx) => (
                        <div
                          key={idx}
                          className="group flex items-start justify-between gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
                        >
                          <div className="flex items-start gap-2 flex-1 min-w-0">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                            <span className="leading-relaxed break-words">{sentence}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSentence(idx)}
                            className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer shrink-0 rounded"
                            title="Remove sentence"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic py-1">
                      No practice sentences added yet. Write one below!
                    </p>
                  )}

                  {/* Add Sentence Input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Write a new sentence with this word..."
                      value={editNewSentence}
                      onChange={(e) => setEditNewSentence(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSentenceToEdit();
                        }
                      }}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddSentenceToEdit}
                      disabled={!editNewSentence.trim()}
                      className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-indigo-200 dark:border-indigo-800 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {/* Study Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-500" />
                    Study Notes & Mnemonics
                  </label>
                  <textarea
                    rows={3}
                    placeholder='e.g. Remember to use with prepositions "in" or "for". IELTS Speaking Part 2...'
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                  />
                </div>

                {/* Feedback Banner */}
                {editFeedback && (
                  <div
                    className={`p-3.5 rounded-xl flex items-center gap-2.5 text-xs font-semibold border ${editFeedback.type === "success"
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20"
                      }`}
                  >
                    {editFeedback.type === "success" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    )}
                    <span>{editFeedback.text}</span>
                  </div>
                )}

                {/* Modal Footer Actions */}
                <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    disabled={isSavingEdit}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSavingEdit}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    {isSavingEdit ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
    </div>,
    document.body
  );
}
