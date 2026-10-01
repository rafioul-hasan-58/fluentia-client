import React from "react";
import { MessageSquare, Plus, Trash2 } from "lucide-react";

interface PracticeSentencesCardProps {
  word: string;
  sentences?: string[];
  newSentence: string;
  setNewSentence: (val: string) => void;
  isAddingSentence: boolean;
  handleAddSentence: (e: React.FormEvent) => void;
  handleDeleteSentence: (idx: number) => void;
}

export function PracticeSentencesCard({
  word,
  sentences = [],
  newSentence,
  setNewSentence,
  isAddingSentence,
  handleAddSentence,
  handleDeleteSentence,
}: PracticeSentencesCardProps) {
  return (
    <div className="p-3.5 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-purple-500" />
          <span>My Practice Sentences</span>
        </h3>
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200/60 dark:border-slate-700/60">
          {sentences.length}
        </span>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Formulate your own real-world sentences using &ldquo;{word}&rdquo; to solidify active recall.
      </p>

      <form onSubmit={handleAddSentence} className="flex gap-2">
        <input
          type="text"
          value={newSentence}
          onChange={(e) => setNewSentence(e.target.value)}
          placeholder={`Write a sentence with '${word}'...`}
          className="min-w-0 flex-1 px-3 sm:px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all"
        />
        <button
          type="submit"
          disabled={isAddingSentence || !newSentence.trim()}
          className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </form>

      {sentences.length > 0 && (
        <div className="space-y-2 pt-2">
          {sentences.map((sentence, idx) => (
            <div
              key={idx}
              className="p-2.5 sm:p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 flex items-start justify-between gap-2.5 sm:gap-3 group"
            >
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic flex-1 break-words">
                &ldquo;{sentence}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => handleDeleteSentence(idx)}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer shrink-0"
                title="Delete sentence"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
