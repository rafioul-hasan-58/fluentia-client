import React from "react";
import { Layers, Lightbulb, Volume2 } from "lucide-react";
import {
  VocabularyItem,
  getCollocationBangla,
  getCollocationExample,
  getCollocationMeaning,
  getCollocationText,
} from "@/types";
import { highlightPhrase } from "../../constants/vocabularyConstants";

interface CollocationsCardProps {
  wordData: VocabularyItem;
  playPronunciation: (text: string) => void;
}

export function CollocationsCard({
  wordData,
  playPronunciation,
}: CollocationsCardProps) {
  if (!wordData.collocations || wordData.collocations.length === 0) {
    return null;
  }

  return (
    <div className="p-3.5 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>Collocations & Common Phrases</span>
        </h3>
        <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200/60 dark:border-slate-700/60">
          {wordData.collocations.length} phrases
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        {wordData.collocations.map((col, idx) => {
          const colText = getCollocationText(col);
          const meaning = getCollocationMeaning(col);
          const rawBangla = getCollocationBangla(col, wordData);
          const rawExample = getCollocationExample(col, wordData);

          const bangla =
            rawBangla ||
            (wordData.banglaMeaning
              ? `${wordData.banglaMeaning.split(/[,/]/)[0].trim()} সম্পর্কিত ভাবার্থ`
              : `${colText}-এর বাংলা ভাবার্থ`);

          const example =
            rawExample ||
            `Using "${colText}" helps express ideas naturally in practical English.`;

          return (
            <div
              key={idx}
              className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/90 dark:border-slate-700/70 hover:border-indigo-300 dark:hover:border-indigo-500/60 hover:bg-white dark:hover:bg-slate-800/80 transition-all shadow-2xs flex flex-col justify-between gap-3 group"
            >
              {/* Header: Number + Phrase + Pronounce */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-[10px] sm:text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight break-words capitalize group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {colText}
                    </h4>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => playPronunciation(colText)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-slate-700/60 transition-colors shrink-0 cursor-pointer"
                  title={`Pronounce "${colText}"`}
                  aria-label={`Pronounce ${colText}`}
                >
                  <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* Bangla Meaning Section */}
              {bangla && (
                <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2.5">
                  <span className="self-start inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white shrink-0 shadow-2xs">
                    বাংলা অর্থ
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-emerald-950 dark:text-emerald-100 leading-snug break-words">
                    {bangla}
                  </span>
                </div>
              )}

              {/* English Meaning (if present) */}
              {meaning && (
                <div className="text-xs text-slate-600 dark:text-slate-300 flex items-baseline gap-1.5 leading-relaxed">
                  <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0">
                    Meaning:
                  </span>
                  <span className="break-words">{meaning}</span>
                </div>
              )}

              {/* Example Sentence Callout */}
              {example && (
                <div className="pt-2.5 border-t border-slate-200/70 dark:border-slate-700/60 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      Example Sentence
                    </span>
                    <button
                      type="button"
                      onClick={() => playPronunciation(example)}
                      className="p-1 sm:p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-slate-700/60 transition-colors shrink-0 cursor-pointer"
                      title="Pronounce example sentence"
                      aria-label="Pronounce example sentence"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800/80 shadow-2xs">
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 italic leading-relaxed break-words">
                      &ldquo;{highlightPhrase(example, colText)}&rdquo;
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
