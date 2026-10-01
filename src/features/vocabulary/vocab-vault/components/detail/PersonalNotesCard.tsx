import React from "react";
import { Check, FileText, RefreshCw } from "lucide-react";

interface PersonalNotesCardProps {
  notesText: string;
  setNotesText: (val: string) => void;
  isSavingNotes: boolean;
  notesSavedSuccess: boolean;
  handleSaveNotes: () => void;
}

export function PersonalNotesCard({
  notesText,
  setNotesText,
  isSavingNotes,
  notesSavedSuccess,
  handleSaveNotes,
}: PersonalNotesCardProps) {
  return (
    <div className="p-3.5 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-500" />
          <span>Personal Study Notes</span>
        </h3>
        {notesSavedSuccess && (
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in">
            <Check className="w-3.5 h-3.5" /> Saved!
          </span>
        )}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Personal memory hooks, mnemonic tricks, or contextual hints for this word.
      </p>
      <div className="space-y-3">
        <textarea
          value={notesText}
          onChange={(e) => setNotesText(e.target.value)}
          placeholder="e.g., Remembered from Chapter 3 of Atomic Habits; opposite of deliberate..."
          rows={3}
          className="w-full p-2.5 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all resize-none"
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSaveNotes}
            disabled={isSavingNotes}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-all cursor-pointer"
          >
            {isSavingNotes ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            <span>Save Notes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
