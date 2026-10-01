import React from "react";
import {
  Edit3,
  ExternalLink,
  GraduationCap,
  Sparkles,
  Star,
  Trash2,
  Volume2,
} from "lucide-react";
import {
  MyVocabularyItem,
  PartOfSpeech,
  getVerbForms,
  getWordRelationWord,
  getWordRelationPartOfSpeech,
  getWordRelationBangla,
} from "@/types";
import { POS_COLORS } from "../../constants/vocabularyConstants";

interface WordHeroCardProps {
  item: MyVocabularyItem;
  isPlayingAudio: boolean;
  playPronunciation: (text: string) => void;
  handleOpenEditModal: (item: MyVocabularyItem) => void;
  setItemToDelete: (item: MyVocabularyItem) => void;
  handleToggleFavorite: () => void;
  handleSetMastery: (star: number) => void;
}

export function WordHeroCard({
  item,
  isPlayingAudio,
  playPronunciation,
  handleOpenEditModal,
  setItemToDelete,
  handleToggleFavorite,
  handleSetMastery,
}: WordHeroCardProps) {
  const { word: wordData } = item;

  return (
    <div className="p-3.5 sm:p-6 lg:p-7 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3.5 sm:space-y-5">
      {/* Word Header, Level, POS, Audio Button & Actions */}
      <div className="space-y-3.5">
        {/* Row 1: Badges on left, Desktop Actions on right */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${
                POS_COLORS[wordData.partOfSpeech]?.bg || "bg-indigo-500/10"
              } ${
                POS_COLORS[wordData.partOfSpeech]?.text ||
                "text-indigo-600 dark:text-indigo-400"
              } ${
                POS_COLORS[wordData.partOfSpeech]?.border || "border-indigo-500/30"
              }`}
            >
              {POS_COLORS[wordData.partOfSpeech]?.label || wordData.partOfSpeech}
            </span>

            {(wordData.englishLevel || wordData.cefrLevel) && (
              <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                CEFR {wordData.englishLevel || wordData.cefrLevel}
              </span>
            )}

            {wordData.ipa && (
              <span className="text-sm font-mono text-slate-400 dark:text-slate-500">
                {wordData.ipa}
              </span>
            )}
          </div>

          {/* Desktop Actions: Edit, Delete, Favorite */}
          <div className="hidden lg:flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => handleOpenEditModal(item)}
              className="p-2 rounded-xl bg-indigo-50/80 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/60 transition-colors cursor-pointer"
              title="Update Vocabulary"
            >
              <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
            </button>
            <button
              type="button"
              onClick={() => setItemToDelete(item)}
              className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-500 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800/60 transition-colors cursor-pointer"
              title="Delete Vocabulary"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            </button>
            <button
              type="button"
              onClick={handleToggleFavorite}
              title={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                item.isFavorite
                  ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border-slate-200 dark:border-slate-700"
              }`}
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  item.isFavorite ? "fill-amber-400 text-amber-400" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Row 2: Full Width Word Title */}
        <div className="w-full min-w-0">
          <h1
            className={`font-bold text-slate-900 dark:text-white tracking-tight capitalize break-normal hyphens-auto leading-tight ${
              wordData.word.length > 16
                ? "text-xl sm:text-2xl lg:text-3xl"
                : wordData.word.length > 11
                ? "text-2xl sm:text-3xl lg:text-4xl"
                : "text-3xl sm:text-4xl lg:text-5xl"
            }`}
          >
            {wordData.word}
          </h1>
        </div>

        {/* Row 3: Pronounce Audio Button & Bangla Pronunciation */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => playPronunciation(wordData.word)}
            className={`inline-flex items-center justify-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border shrink-0 ${
              isPlayingAudio
                ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                : "bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
            }`}
            title="Pronounce"
          >
            <Volume2
              className={`w-4 h-4 ${isPlayingAudio ? "animate-pulse" : ""}`}
            />
            <span>{isPlayingAudio ? "Playing..." : "Pronounce"}</span>
          </button>

          {wordData.banglaPronunciation && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/70 shadow-2xs">
              <span className="text-[10px] sm:text-xs font-normal opacity-70">
                উচ্চারণ:
              </span>
              <span className="font-bold">{wordData.banglaPronunciation}</span>
            </span>
          )}
        </div>
      </div>

      {/* Bangla Meaning Card */}
      <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-slate-50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-slate-800/60 border border-emerald-200/70 dark:border-emerald-800/60 space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Bangla Meaning (বাংলা অর্থ)
          </span>
        </div>
        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-snug break-words">
          {wordData.banglaMeaning}
        </p>
      </div>

      {/* English Definition */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Definition
        </span>
        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
          {wordData.meaning}
        </p>
      </div>

      {/* Verb Forms (V1, V2, V3) */}
      {(() => {
        const verbForms = wordData.verbForms || getVerbForms(wordData);
        if (!verbForms) return null;

        const formsList = [
          {
            code: "V1",
            label: "Base / Present",
            banglaLabel: "মূল রূপ",
            value: verbForms.v1,
          },
          {
            code: "V2",
            label: "Past Simple",
            banglaLabel: "অতীত রূপ",
            value: verbForms.v2,
          },
          {
            code: "V3",
            label: "Past Participle",
            banglaLabel: "পুরাঘটিত রূপ",
            value: verbForms.v3,
          },
        ];

        return (
          <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                Verb Forms (ক্রিয়াপদের রূপ: V1, V2, V3)
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                Conjugation
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {formsList.map((form) => (
                <div
                  key={form.code}
                  className="p-2.5 rounded-xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 hover:border-emerald-400 dark:hover:border-emerald-500/50 hover:bg-white dark:hover:bg-slate-800 transition-all flex flex-col justify-between gap-1.5 group shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/60">
                      {form.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => playPronunciation(form.value)}
                      className="p-1 rounded-md text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer"
                      title={`Pronounce "${form.value}"`}
                      aria-label={`Pronounce ${form.value}`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white capitalize tracking-tight">
                      {form.value}
                    </p>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
                      {form.label}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium font-bangla block">
                      {form.banglaLabel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Word Family */}
      {wordData.wordFamily && wordData.wordFamily.length > 0 && (
        <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
              Word Family
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {wordData.wordFamily.map((wf: any, idx: number) => {
              const wfWord = getWordRelationWord(wf);
              const wfPos = getWordRelationPartOfSpeech(wf);
              const wfBangla = getWordRelationBangla(wf);

              return (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center justify-between gap-2.5 group shadow-2xs"
                >
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white capitalize">
                        {wfWord}
                      </span>
                      {wfPos && (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                            POS_COLORS[wfPos.toUpperCase() as PartOfSpeech]?.bg ||
                            "bg-indigo-500/10"
                          } ${
                            POS_COLORS[wfPos.toUpperCase() as PartOfSpeech]?.text ||
                            "text-indigo-600 dark:text-indigo-400"
                          } ${
                            POS_COLORS[wfPos.toUpperCase() as PartOfSpeech]?.border ||
                            "border-indigo-500/20"
                          }`}
                        >
                          {POS_COLORS[wfPos.toUpperCase() as PartOfSpeech]?.label ||
                            wfPos.toLowerCase()}
                        </span>
                      )}
                    </div>
                    {wfBangla && (
                      <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 truncate flex items-center gap-1">
                        <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-normal">
                          বাংলা:
                        </span>
                        <span className="font-bangla">{wfBangla}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => playPronunciation(wfWord)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-slate-700/60 transition-colors cursor-pointer"
                      title={`Pronounce "${wfWord}"`}
                      aria-label={`Pronounce ${wfWord}`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={`https://translate.google.com/?sl=en&tl=bn&text=${encodeURIComponent(
                        wfWord
                      )}&op=translate`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer"
                      title="Google Translator"
                      aria-label={`Google Translator for ${wfWord}`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mastery Rating */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Mastery Level:
        </span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleSetMastery(star)}
              className="p-1 hover:scale-125 transition-transform cursor-pointer"
              title={`Set mastery to ${star}`}
            >
              <Star
                className={`w-4 h-4 ${
                  star <= (item.masteryLevel || 1)
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-300 dark:text-slate-700"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
