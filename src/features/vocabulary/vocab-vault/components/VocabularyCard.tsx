import React from "react";
import {
  MyVocabularyItem,
  getVerbForms,
} from "@/features/vocabulary/types/vocabulary";
import { Check, Edit3, Maximize2, Star, Trash2, Volume2 } from "lucide-react";
import { POS_COLORS } from "../constants/vocabularyConstants";

interface VocabularyCardProps {
  item: MyVocabularyItem;
  isStorySelectMode: boolean;
  isSelectedForStory: boolean;
  handleToggleStoryWord: (item: MyVocabularyItem) => void;
  playingWord: string | null;
  playPronunciation: (word: string) => void;
  handleToggleFavorite: (item: MyVocabularyItem) => void;
  handleOpenEditModal: (item: MyVocabularyItem) => void;
  setItemToDelete: (item: MyVocabularyItem) => void;
  handleSetMastery: (item: MyVocabularyItem, star: number) => void;
  setFullscreenVocabId: (id: string) => void;
}

export default function VocabularyCard({
  item,
  isStorySelectMode,
  isSelectedForStory,
  handleToggleStoryWord,
  playingWord,
  playPronunciation,
  handleToggleFavorite,
  handleOpenEditModal,
  setItemToDelete,
  handleSetMastery,
  setFullscreenVocabId,
}: VocabularyCardProps) {
  const posConfig = POS_COLORS[item.word.partOfSpeech] || POS_COLORS.NOUN;
  const isAudioPlaying = playingWord === item.word.word;
  const isFav = item.isFavorite;
  const displayLevel = item.word.englishLevel || item.word.cefrLevel;

  return (
    <div
      onClick={isStorySelectMode ? () => handleToggleStoryWord(item) : undefined}
      className={`group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-[#141226] border transition-all duration-300 overflow-hidden hover:-translate-y-0.5 ${
        isStorySelectMode && isSelectedForStory
          ? "ring-2 ring-amber-500 border-amber-500 shadow-md shadow-amber-500/20 bg-amber-500/[0.03]"
          : "border-slate-200/90 dark:border-white/10 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.12)] hover:border-indigo-500/40 dark:hover:border-indigo-500/40"
      } ${isStorySelectMode ? "cursor-pointer" : ""}`}
    >
      {/* Top Accent Strip by Part of Speech */}
      <div
        className={`h-1 w-full bg-gradient-to-r ${
          item.word.partOfSpeech === "NOUN"
            ? "from-blue-500 to-indigo-500"
            : item.word.partOfSpeech === "VERB"
            ? "from-emerald-500 to-teal-500"
            : item.word.partOfSpeech === "ADJECTIVE"
            ? "from-purple-500 to-pink-500"
            : item.word.partOfSpeech === "ADVERB"
            ? "from-amber-500 to-orange-500"
            : "from-indigo-500 to-purple-500"
        }`}
      />

      {/* Main Card Content */}
      <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
        {/* inset-block-start: Word, Pronounce & Quick Action Icons */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            {/* Word Title & Audio */}
            <div className="flex items-center gap-2 min-w-0 flex-wrap">
              {/* Square Radio Button in Top Left */}
              {isStorySelectMode && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleStoryWord(item);
                  }}
                  className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                    isSelectedForStory
                      ? "bg-amber-500 border-amber-500 text-white shadow-sm shadow-amber-500/30 scale-105"
                      : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:border-amber-400"
                  }`}
                  title={isSelectedForStory ? "Deselect word" : "Select word for story"}
                >
                  {isSelectedForStory && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              )}

              <button
                onClick={(e) => {
                  if (isStorySelectMode) {
                    e.stopPropagation();
                    handleToggleStoryWord(item);
                  } else {
                    setFullscreenVocabId(item.id);
                  }
                }}
                className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left cursor-pointer capitalize truncate"
                title={`View ${item.word.word} full details`}
              >
                {item.word.word}
              </button>

              <button
                onClick={() => playPronunciation(item.word.word)}
                title="Listen pronunciation"
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 border ${
                  isAudioPlaying
                    ? "bg-indigo-600 text-white border-indigo-600 scale-105 shadow-sm shadow-indigo-500/40"
                    : "bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-800/80"
                }`}
              >
                <Volume2 className={`w-3 h-3 ${isAudioPlaying ? "animate-pulse" : ""}`} />
              </button>
            </div>

            {/* Action Icons: Edit / Favorite / Delete */}
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                onClick={() => handleOpenEditModal(item)}
                title="Update vocabulary"
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleToggleFavorite(item)}
                title={isFav ? "Remove from favorites" : "Add to favorites"}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer border ${
                  isFav
                    ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Star
                  className={`w-3.5 h-3.5 ${isFav ? "fill-amber-400 text-amber-400" : ""}`}
                />
              </button>

              <button
                onClick={() => setItemToDelete(item)}
                title="Delete word"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Tags: Part of Speech & CEFR & Status & Pronunciation */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${posConfig.bg} ${posConfig.text} ${posConfig.border}`}
            >
              {posConfig.label}
            </span>

            {displayLevel && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {displayLevel}
              </span>
            )}

            {item.status && item.status !== "LEARNING" && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                {item.status}
              </span>
            )}

            {item.word.ipa && (
              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 ml-auto">
                {item.word.ipa}
              </span>
            )}
          </div>
        </div>

        {/* Bangla Meaning Box */}
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-50/80 to-teal-50/60 dark:from-emerald-950/40 dark:to-teal-950/20 border border-emerald-500/20 dark:border-emerald-500/30 flex items-center justify-between gap-2">
          <p className="text-xs sm:text-sm font-bold text-emerald-900 dark:text-emerald-300 truncate">
            {item.word.banglaMeaning}
          </p>
          {item.word.banglaPronunciation && (
            <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-900/50 px-2 py-0.5 rounded-md border border-emerald-300/60 dark:border-emerald-700/60">
              <span className="text-[9px] opacity-70 font-normal">উচ্চারণ:</span>
              <span>{item.word.banglaPronunciation}</span>
            </span>
          )}
        </div>

        {/* English Definition (Clean 2-line clamped preview) */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
          {item.word.meaning}
        </p>

        {/* Verb Forms Preview (if VERB) */}
        {item.word.partOfSpeech === "VERB" && (() => {
          const vf = item.word.verbForms || getVerbForms(item.word);
          if (!vf) return null;
          return (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-400 bg-emerald-50/50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-lg border border-emerald-200/50 dark:border-emerald-800/40 overflow-x-auto scrollbar-none">
              <span className="font-bold text-emerald-700 dark:text-emerald-400 text-[10px] uppercase shrink-0">
                Forms:
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-200" title="V1 (Base)">
                {vf.v1}
              </span>
              <span className="text-slate-300 dark:text-slate-600 shrink-0">•</span>
              <span className="font-semibold text-slate-900 dark:text-slate-200" title="V2 (Past Simple)">
                {vf.v2}
              </span>
              <span className="text-slate-300 dark:text-slate-600 shrink-0">•</span>
              <span className="font-semibold text-slate-900 dark:text-slate-200" title="V3 (Past Participle)">
                {vf.v3}
              </span>
            </div>
          );
        })()}
      </div>

      {/* Card Bottom Bar: Mastery Stars + Details (Full Screen) Button */}
      <div className="px-4 py-2.5 bg-slate-50/90 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        {/* Mastery Rating */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleSetMastery(item, star)}
              title={`Set mastery to ${star} stars`}
              className="p-0.5 hover:scale-125 transition-transform cursor-pointer"
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  star <= (item.masteryLevel || 1)
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-300 dark:text-slate-600"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Details -> Full Screen Button */}
        <button
          onClick={() => setFullscreenVocabId(item.id)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200/80 dark:border-indigo-800/80 transition-all hover:scale-[1.02] cursor-pointer"
          title="View full screen details"
        >
          <Maximize2 className="w-3 h-3" />
          <span>Details</span>
        </button>
      </div>
    </div>
  );
}
