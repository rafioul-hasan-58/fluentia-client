import React from "react";
import Link from "next/link";
import { CheckCircle2, X } from "lucide-react";
import {
  VocabularyItem,
  getWordRelationBangla,
  getWordRelationText,
} from "@/types";

interface SynonymsAntonymsCardProps {
  wordData: VocabularyItem;
}

export function SynonymsAntonymsCard({ wordData }: SynonymsAntonymsCardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
      {/* Synonyms */}
      <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5 sm:space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Synonyms
        </span>
        <div className="flex flex-wrap gap-1.5">
          {wordData.synonyms && wordData.synonyms.length > 0 ? (
            wordData.synonyms.map((syn: any, idx: number) => {
              const synText = getWordRelationText(syn);
              const synBangla = getWordRelationBangla(syn);
              return (
                <Link
                  key={idx}
                  href={`/dashboard/user/vocabulary/${encodeURIComponent(
                    synText.toLowerCase()
                  )}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 hover:scale-105 transition-transform"
                >
                  <span>{synText}</span>
                  {synBangla && (
                    <span className="text-[10px] opacity-75 font-bangla">
                      ({synBangla})
                    </span>
                  )}
                </Link>
              );
            })
          ) : (
            <span className="text-xs text-slate-400">None listed</span>
          )}
        </div>
      </div>

      {/* Antonyms */}
      <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5 sm:space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
          <X className="w-4 h-4 text-rose-500" />
          Antonyms
        </span>
        <div className="flex flex-wrap gap-1.5">
          {wordData.antonyms && wordData.antonyms.length > 0 ? (
            wordData.antonyms.map((ant: any, idx: number) => {
              const antText = getWordRelationText(ant);
              const antBangla = getWordRelationBangla(ant);
              return (
                <Link
                  key={idx}
                  href={`/dashboard/user/vocabulary/${encodeURIComponent(
                    antText.toLowerCase()
                  )}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/80 hover:scale-105 transition-transform"
                >
                  <span>{antText}</span>
                  {antBangla && (
                    <span className="text-[10px] opacity-75 font-bangla">
                      ({antBangla})
                    </span>
                  )}
                </Link>
              );
            })
          ) : (
            <span className="text-xs text-slate-400">None listed</span>
          )}
        </div>
      </div>
    </div>
  );
}
