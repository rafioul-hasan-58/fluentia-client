import React from "react";
import { RefreshCw, Sparkles } from "lucide-react";

export function AiEnrichmentBanner() {
  return (
    <div className="relative overflow-hidden p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 dark:from-indigo-500/15 dark:via-purple-500/15 dark:to-indigo-500/15 border border-indigo-200/80 dark:border-indigo-800/80 flex items-center justify-between gap-3 shadow-2xs backdrop-blur-xs">
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <div className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-indigo-600 text-white shadow-xs shrink-0">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-indigo-100" />
        </div>
        <div className="min-w-0">
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 sm:gap-2">
            <span>AI Word Enrichment</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
          </h4>
          <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 truncate">
            Fetching collocations, contextual examples & word relations...
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-white/80 dark:bg-slate-800/80 text-indigo-600 dark:text-indigo-400 text-[10px] sm:text-xs font-semibold border border-indigo-100 dark:border-indigo-900/60 shrink-0 shadow-2xs">
        <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin text-indigo-500" />
        <span className="hidden sm:inline font-mono">Syncing</span>
      </div>
    </div>
  );
}
