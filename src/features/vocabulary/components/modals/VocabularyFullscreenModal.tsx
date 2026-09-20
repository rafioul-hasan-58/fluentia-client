"use client";

import React from "react";
import { createPortal } from "react-dom";
import { ThemeToggle } from "@/components/shared";
import { PartOfSpeech, VocabularyStatus } from "@/types";
import {
  MyVocabularyItem,
  getVerbForms,
  getWordRelationText,
  getWordRelationWord,
  getWordRelationPartOfSpeech,
  getWordRelationBangla,
  getCollocationText,
  getCollocationMeaning,
  getCollocationBangla,
  getCollocationExample,
} from "@/features/vocabulary/types/vocabulary";
import {
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Star,
  X,
  Volume2,
  Sparkles,
  Layers,
  MessageSquare,
  FileText,
  GraduationCap,
  ExternalLink,
  Lightbulb,
  CheckCircle2,
  Keyboard,
} from "lucide-react";
import { POS_COLORS, highlightPhrase } from "../../constants/vocabularyConstants";

export interface VocabularyFullscreenModalProps {
  isMounted: boolean;
  activeFullscreenVocab: MyVocabularyItem | null;
  activeFullscreenIndex: number;
  vocabularies: MyVocabularyItem[];
  setFullscreenVocabId: (id: string | null) => void;
  navigateFullscreen: (direction: -1 | 1) => void;
  handleSetStatus: (item: MyVocabularyItem, status: VocabularyStatus) => void;
  handleOpenEditModal: (item: MyVocabularyItem) => void;
  handleToggleFavorite: (item: MyVocabularyItem) => void;
  playPronunciation: (word: string) => void;
  playingWord: string | null;
  handleSetMastery: (item: MyVocabularyItem, star: number) => void;
  newSentenceInputs: Record<string, string>;
  setNewSentenceInputs: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleAddSentence: (item: MyVocabularyItem) => void;
  editingNotes: Record<string, string>;
  setEditingNotes: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleSaveNotes: (item: MyVocabularyItem) => void;
  savingNoteId: string | null;
}

export default function VocabularyFullscreenModal({
  isMounted,
  activeFullscreenVocab,
  activeFullscreenIndex,
  vocabularies,
  setFullscreenVocabId,
  navigateFullscreen,
  handleSetStatus,
  handleOpenEditModal,
  handleToggleFavorite,
  playPronunciation,
  playingWord,
  handleSetMastery,
  newSentenceInputs,
  setNewSentenceInputs,
  handleAddSentence,
  editingNotes,
  setEditingNotes,
  handleSaveNotes,
  savingNoteId,
}: VocabularyFullscreenModalProps) {
  if (!isMounted || !activeFullscreenVocab) return null;

  return createPortal(
          <div className="fixed inset-0 z-[99999] w-screen h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col overflow-hidden animate-in fade-in duration-200">
            {/* Top Bar */}
            <div className="shrink-0 w-full px-5 sm:px-8 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 z-30">
              {/* inset-inline-start: Exit Fullscreen & Counter */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFullscreenVocabId(null)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Exit</span>
                </button>

                <div className=" hidden lg:flex items-center gap-2 text-xs ">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">
                    Word {activeFullscreenIndex + 1} of {vocabularies.length}
                  </span>
                </div>
              </div>

              {/* Center: Carousel Navigation */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => navigateFullscreen(-1)}
                  title="Previous Word (← Arrow key)"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Prev</span>
                </button>

                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-2 font-mono">
                  {activeFullscreenIndex + 1} / {vocabularies.length}
                </span>

                <button
                  onClick={() => navigateFullscreen(1)}
                  title="Next Word (→ Arrow key)"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* inset-inline-end: Status Switcher, Theme Toggle, Favorite & Close */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Status Switcher */}
                <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                  {(["LEARNING", "LEARNED", "MASTERED"] as VocabularyStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleSetStatus(activeFullscreenVocab, st)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${(activeFullscreenVocab.status || "LEARNING") === st
                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                        }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {/* Update Vocabulary Button */}
                <button
                  onClick={() => handleOpenEditModal(activeFullscreenVocab)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                  title="Update Vocabulary"
                >
                  <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="hidden sm:inline">Update</span>
                </button>

                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Favorite Toggle */}
                <button
                  onClick={() => handleToggleFavorite(activeFullscreenVocab)}
                  title={
                    activeFullscreenVocab.isFavorite || activeFullscreenVocab.isFavourate
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                  className={`p-2 rounded-xl transition-colors cursor-pointer border ${activeFullscreenVocab.isFavorite || activeFullscreenVocab.isFavourate
                    ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border-slate-200 dark:border-slate-700"
                    }`}
                >
                  <Star
                    className={`w-4 h-4 ${activeFullscreenVocab.isFavorite || activeFullscreenVocab.isFavourate
                      ? "fill-amber-400 text-amber-400"
                      : ""
                      }`}
                  />
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setFullscreenVocabId(null)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                  title="Close (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Content Area (Two Columns with Independent Scroll) */}
            <div className="flex-1 w-full min-h-0 overflow-y-auto lg:overflow-hidden p-3.5 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 z-10">
              {/* Left Column (Hero Card, Audio, Meaning, Word Family, Mastery) */}
              <div className="lg:col-span-5 lg:min-h-0 lg:h-full lg:overflow-y-auto pr-0 lg:pr-2 space-y-5 pb-4 lg:pb-8">
                <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                  {/* inset-block-start: Word, Level, POS, Audio Button */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${POS_COLORS[activeFullscreenVocab.word.partOfSpeech]?.bg || "bg-indigo-500/10"
                          } ${POS_COLORS[activeFullscreenVocab.word.partOfSpeech]?.text || "text-indigo-600 dark:text-indigo-400"
                          } ${POS_COLORS[activeFullscreenVocab.word.partOfSpeech]?.border || "border-indigo-500/30"
                          }`}
                      >
                        {POS_COLORS[activeFullscreenVocab.word.partOfSpeech]?.label ||
                          activeFullscreenVocab.word.partOfSpeech}
                      </span>

                      {(activeFullscreenVocab.word.englishLevel || activeFullscreenVocab.word.cefrLevel) && (
                        <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                          CEFR {activeFullscreenVocab.word.englishLevel || activeFullscreenVocab.word.cefrLevel}
                        </span>
                      )}

                      {activeFullscreenVocab.word.ipa && (
                        <span className="text-sm font-mono text-slate-400 dark:text-slate-500">
                          {activeFullscreenVocab.word.ipa}
                        </span>
                      )}
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight capitalize">
                            {activeFullscreenVocab.word.word}
                          </h1>
                          {activeFullscreenVocab.word.banglaPronunciation && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-sm sm:text-base font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/70 shadow-xs">
                              <span className="text-xs font-normal opacity-75">উচ্চারণ:</span>
                              <span>{activeFullscreenVocab.word.banglaPronunciation}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Natural Pronounce Button */}
                      <button
                        onClick={() => playPronunciation(activeFullscreenVocab.word.word)}
                        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border shrink-0 ${playingWord === activeFullscreenVocab.word.word
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                          : "bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                          }`}
                        title="Pronounce (Space / P)"
                      >
                        <Volume2
                          className={`w-4 h-4 ${playingWord === activeFullscreenVocab.word.word ? "animate-pulse" : ""
                            }`}
                        />
                        <span>
                          {playingWord === activeFullscreenVocab.word.word ? "Playing..." : "Pronounce"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Bangla Meaning Card */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-slate-50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-slate-800/60 border border-emerald-200/70 dark:border-emerald-800/60 space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Bangla Meaning (বাংলা অর্থ)
                      </span>
                      {activeFullscreenVocab.word.banglaPronunciation && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-emerald-100/80 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300/60 dark:border-emerald-700/60">
                          <span className="text-[10px] opacity-75 font-normal">উচ্চারণ:</span>
                          <span>{activeFullscreenVocab.word.banglaPronunciation}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {activeFullscreenVocab.word.banglaMeaning}
                    </p>
                  </div>

                  {/* English Definition */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Definition
                    </span>
                    <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                      {activeFullscreenVocab.word.meaning}
                    </p>
                  </div>

                  {/* Verb Forms (V1, V2, V3) - Shown for VERBs */}
                  {(() => {
                    const verbForms =
                      activeFullscreenVocab.word.verbForms ||
                      getVerbForms(activeFullscreenVocab.word);
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
                  {activeFullscreenVocab.word.wordFamily &&
                    activeFullscreenVocab.word.wordFamily.length > 0 && (
                      <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                            Word Family
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {activeFullscreenVocab.word.wordFamily.map((wf: any, idx: number) => {
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
                                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${POS_COLORS[wfPos.toUpperCase() as PartOfSpeech]?.bg || "bg-indigo-500/10"
                                          } ${POS_COLORS[wfPos.toUpperCase() as PartOfSpeech]?.text || "text-indigo-600 dark:text-indigo-400"
                                          } ${POS_COLORS[wfPos.toUpperCase() as PartOfSpeech]?.border || "border-indigo-500/20"
                                          }`}
                                      >
                                        {POS_COLORS[wfPos.toUpperCase() as PartOfSpeech]?.label || wfPos.toLowerCase()}
                                      </span>
                                    )}
                                  </div>
                                  {wfBangla && (
                                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 truncate flex items-center gap-1">
                                      <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-normal">বাংলা:</span>
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
                                    title={`Google Translator-এ '${wfWord}' দেখুন`}
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
                          onClick={() => handleSetMastery(activeFullscreenVocab, star)}
                          className="p-1 hover:scale-125 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-4 h-4 ${star <= (activeFullscreenVocab.masteryLevel || 1)
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300 dark:text-slate-700"
                              }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (Collocations, Synonyms/Antonyms, Examples, Notes, Sentences) */}
              <div className="lg:col-span-7 lg:min-h-0 lg:h-full lg:overflow-y-auto pr-0 lg:pr-2 space-y-5 pb-8">
                {/* Collocations */}
                {activeFullscreenVocab.word.collocations &&
                  activeFullscreenVocab.word.collocations.length > 0 && (
                    <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Layers className="w-4 h-4 text-indigo-500 shrink-0" />
                          <span>Collocations & Common Phrases</span>
                        </h3>
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200/60 dark:border-slate-700/60">
                          {activeFullscreenVocab.word.collocations.length} phrases
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                        {activeFullscreenVocab.word.collocations.map((col, idx) => {
                          const colText = getCollocationText(col);
                          const meaning = getCollocationMeaning(col);
                          const rawBangla = getCollocationBangla(col, activeFullscreenVocab.word);
                          const rawExample = getCollocationExample(col, activeFullscreenVocab.word);

                          const bangla =
                            rawBangla ||
                            (activeFullscreenVocab.word.banglaMeaning
                              ? `${activeFullscreenVocab.word.banglaMeaning.split(/[,/]/)[0].trim()} সম্পর্কিত ভাবার্থ`
                              : `${colText}-এর বাংলা ভাবার্থ`);

                          const example =
                            rawExample ||
                            `Using "${colText}" helps express ideas naturally in practical English.`;

                          return (
                            <div
                              key={idx}
                              className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/90 dark:border-slate-700/70 hover:border-indigo-300 dark:hover:border-indigo-500/60 hover:bg-white dark:hover:bg-slate-800/80 transition-all shadow-xs flex flex-col justify-between gap-3 group"
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
                  )}

                {/* Synonyms & Antonyms Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Synonyms */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Synonyms
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeFullscreenVocab.word.synonyms && activeFullscreenVocab.word.synonyms.length > 0 ? (
                        activeFullscreenVocab.word.synonyms.map((syn: any, idx: number) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80"
                          >
                            {getWordRelationText(syn)}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">None listed</span>
                      )}
                    </div>
                  </div>

                  {/* Antonyms */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                      <X className="w-4 h-4 text-rose-500" />
                      Antonyms
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeFullscreenVocab.word.antonyms && activeFullscreenVocab.word.antonyms.length > 0 ? (
                        activeFullscreenVocab.word.antonyms.map((ant: any, idx: number) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/80"
                          >
                            {getWordRelationText(ant)}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">None listed</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Example Sentences */}
                {activeFullscreenVocab.word.exampleSentences &&
                  activeFullscreenVocab.word.exampleSentences.length > 0 && (
                    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        Contextual Examples
                      </h3>
                      <div className="space-y-2">
                        {activeFullscreenVocab.word.exampleSentences.map((sent, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed"
                          >
                            &ldquo;{sent}&rdquo;
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Practice Sentences */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-500" />
                    My Practice Sentences ({activeFullscreenVocab.mySentences?.length || 0})
                  </h3>

                  {activeFullscreenVocab.mySentences &&
                    activeFullscreenVocab.mySentences.length > 0 && (
                      <div className="space-y-2">
                        {activeFullscreenVocab.mySentences.map((s, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/60 text-xs text-slate-800 dark:text-slate-200"
                          >
                            <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{s}</span>
                          </div>
                        ))}
                      </div>
                    )}

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Write a practice sentence using this word..."
                      value={newSentenceInputs[activeFullscreenVocab.id] || ""}
                      onChange={(e) =>
                        setNewSentenceInputs((prev) => ({
                          ...prev,
                          [activeFullscreenVocab.id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSentence(activeFullscreenVocab);
                        }
                      }}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      onClick={() => handleAddSentence(activeFullscreenVocab)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                </div>

                {/* Personal Study Notes */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-500" />
                      Study Notes & Mnemonics
                    </h3>
                    <button
                      onClick={() => handleSaveNotes(activeFullscreenVocab)}
                      disabled={savingNoteId === activeFullscreenVocab.id}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      {savingNoteId === activeFullscreenVocab.id ? "Saving..." : "Save Note"}
                    </button>
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Add mnemonics, exam tips, usage notes or IELTS ideas..."
                    value={
                      editingNotes[activeFullscreenVocab.id] !== undefined
                        ? editingNotes[activeFullscreenVocab.id]
                        : activeFullscreenVocab.notes || ""
                    }
                    onChange={(e) =>
                      setEditingNotes((prev) => ({
                        ...prev,
                        [activeFullscreenVocab.id]: e.target.value,
                      }))
                    }
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Controls Bar */}
            <div className="shrink-0 w-full px-6 py-2.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 z-30 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                  <Keyboard className="w-3 h-3" />
                  <span>← / →</span>
                </span>
                <span className="hidden sm:inline">Navigate</span>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-600 dark:text-slate-300 ml-1">
                  <span>Space</span>
                </span>
                <span className="hidden sm:inline">Pronounce</span>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-600 dark:text-slate-300 ml-1">
                  <span>Esc</span>
                </span>
                <span className="hidden sm:inline">Exit</span>
              </div>

              <div>
                <button
                  onClick={() => setFullscreenVocabId(null)}
                  className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
    document.body
  );
}
