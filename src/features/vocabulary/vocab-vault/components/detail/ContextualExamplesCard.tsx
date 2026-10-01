import React from "react";
import { Lightbulb, Volume2 } from "lucide-react";

interface ContextualExamplesCardProps {
  exampleSentences?: string[];
  playPronunciation: (text: string) => void;
}

export function ContextualExamplesCard({
  exampleSentences,
  playPronunciation,
}: ContextualExamplesCardProps) {
  if (!exampleSentences || exampleSentences.length === 0) {
    return null;
  }

  return (
    <div className="p-3.5 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5 sm:space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-amber-500" />
        <span>Contextual Examples</span>
      </h3>
      <div className="space-y-2">
        {exampleSentences.map((sent, idx) => (
          <div
            key={idx}
            className="p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed flex items-start justify-between gap-2.5 sm:gap-3"
          >
            <span className="flex-1 break-words">&ldquo;{sent}&rdquo;</span>
            <button
              type="button"
              onClick={() => playPronunciation(sent)}
              className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors shrink-0 cursor-pointer"
              title="Pronounce sentence"
              aria-label="Pronounce sentence"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
