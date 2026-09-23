import React from "react";
import { Check, Edit3, Maximize2, Star, Trash2, Volume2 } from "lucide-react";
import { POS_COLORS } from "../constants/vocabularyConstants";
import { getWordRelationText, MyVocabularyItem } from "@/types";

export interface VocabularyTableViewProps {
  items: MyVocabularyItem[];
  isStorySelectMode: boolean;
  selectedStoryItems: MyVocabularyItem[];
  handleToggleStoryWord: (item: MyVocabularyItem) => void;
  playingWord: string | null;
  playPronunciation: (word: string) => void;
  handleToggleFavorite: (item: MyVocabularyItem) => void;
  handleOpenEditModal: (item: MyVocabularyItem) => void;
  setItemToDelete: (item: MyVocabularyItem) => void;
  handleSetMastery: (item: MyVocabularyItem, star: number) => void;
  setFullscreenVocabId: (id: string) => void;
}

export default function VocabularyTableView({
  items,
  isStorySelectMode,
  selectedStoryItems,
  handleToggleStoryWord,
  playingWord,
  playPronunciation,
  handleToggleFavorite,
  handleOpenEditModal,
  setItemToDelete,
  handleSetMastery,
  setFullscreenVocabId,
}: VocabularyTableViewProps) {
  return (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {isStorySelectMode && (
                          <th className="py-3 px-3 w-10 text-center">
                            <span className="sr-only">Select</span>
                          </th>
                        )}
                        <th className="py-3 px-4 sm:px-6">Word</th>
                        <th className="py-3 px-3">Type & Level</th>
                        <th className="py-3 px-4">Bangla Meaning</th>
                        <th className="py-3 px-4 hidden md:table-cell">Definition</th>
                        <th className="py-3 px-3 hidden lg:table-cell">Key Synonyms</th>
                        <th className="py-3 px-3 hidden sm:table-cell">Mastery</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-sm">
                      {items.map((item) => {
                        const posConfig = POS_COLORS[item.word.partOfSpeech] || POS_COLORS.NOUN;
                        const isAudioPlaying = playingWord === item.word.word;
                        const isFav = item.isFavorite;
                        const displayLevel = item.word.englishLevel || item.word.cefrLevel;
                        const isSelectedForStory = selectedStoryItems.some((s) => s.id === item.id);

                        return (
                          <tr
                            key={item.id}
                            onClick={isStorySelectMode ? () => handleToggleStoryWord(item) : undefined}
                            className={`group hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${isStorySelectMode && isSelectedForStory
                              ? "bg-amber-50/40 dark:bg-amber-500/10"
                              : ""
                              } ${isStorySelectMode ? "cursor-pointer" : ""}`}
                          >
                            {isStorySelectMode && (
                              <td className="py-3 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleStoryWord(item);
                                  }}
                                  className={`w-5 h-5 rounded-md border-2 inline-flex items-center justify-center transition-all cursor-pointer ${isSelectedForStory
                                    ? "bg-amber-500 border-amber-500 text-white shadow-2xs"
                                    : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:border-amber-400"
                                    }`}
                                >
                                  {isSelectedForStory && <Check className="w-3 h-3 stroke-[3]" />}
                                </button>
                              </td>
                            )}
                            {/* Word & Pronunciation */}
                            <td className="py-3 px-4 sm:px-6 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    if (isStorySelectMode) {
                                      e.stopPropagation();
                                      handleToggleStoryWord(item);
                                    } else {
                                      setFullscreenVocabId(item.id);
                                    }
                                  }}
                                  className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer capitalize text-sm"
                                >
                                  {item.word.word}
                                </button>
                                <button
                                  onClick={() => playPronunciation(item.word.word)}
                                  title="Listen pronunciation"
                                  className={`p-1 rounded-lg transition-colors cursor-pointer ${isAudioPlaying
                                    ? "bg-indigo-600 text-white"
                                    : "text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    }`}
                                >
                                  <Volume2
                                    className={`w-3.5 h-3.5 ${isAudioPlaying ? "animate-pulse" : ""}`}
                                  />
                                </button>
                                {item.word.ipa && (
                                  <span className="hidden xl:inline text-xs font-mono text-slate-400 dark:text-slate-500">
                                    {item.word.ipa}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Type & Level */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${posConfig.bg} ${posConfig.text} ${posConfig.border}`}
                                >
                                  {posConfig.label}
                                </span>
                                {displayLevel && (
                                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                                    {displayLevel}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Bangla Meaning & Pronunciation */}
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span className="font-medium text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                                  {item.word.banglaMeaning}
                                </span>
                                {item.word.banglaPronunciation && (
                                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                                    উচ্চারণ: {item.word.banglaPronunciation}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Definition */}
                            <td className="py-3 px-4 hidden md:table-cell max-w-xs">
                              <p
                                className="truncate text-xs text-slate-600 dark:text-slate-300"
                                title={item.word.meaning}
                              >
                                {item.word.meaning}
                              </p>
                            </td>

                            {/* Key Synonyms */}
                            <td className="py-3 px-3 hidden lg:table-cell">
                              <div className="flex items-center gap-1 flex-wrap">
                                {item.word.synonyms && item.word.synonyms.length > 0 ? (
                                  item.word.synonyms.slice(0, 2).map((syn: any, idx: number) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/70"
                                    >
                                      {getWordRelationText(syn)}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-xs text-slate-400">—</span>
                                )}
                              </div>
                            </td>

                            {/* Mastery */}
                            <td className="py-3 px-3 hidden sm:table-cell whitespace-nowrap">
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    onClick={() => handleSetMastery(item, star)}
                                    title={`Set mastery to ${star} stars`}
                                    className="p-0.5 hover:scale-125 transition-transform cursor-pointer"
                                  >
                                    <Star
                                      className={`w-3.5 h-3.5 ${star <= (item.masteryLevel || 1)
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-slate-200 dark:text-slate-700"
                                        }`}
                                    />
                                  </button>
                                ))}
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleToggleFavorite(item)}
                                  title={isFav ? "Remove from favorites" : "Add to favorites"}
                                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isFav
                                    ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    }`}
                                >
                                  <Star
                                    className={`w-3.5 h-3.5 ${isFav ? "fill-amber-400 text-amber-400" : ""}`}
                                  />
                                </button>

                                <button
                                  onClick={() => handleOpenEditModal(item)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                                  title="Update vocabulary"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  <span className="hidden xl:inline">Update</span>
                                </button>

                                <button
                                  onClick={() => setFullscreenVocabId(item.id)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 transition-colors cursor-pointer"
                                  title="Open full details"
                                >
                                  <Maximize2 className="w-3 h-3" />
                                  <span className="hidden xl:inline">Details</span>
                                </button>

                                <button
                                  onClick={() => setItemToDelete(item)}
                                  title="Delete word"
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
  );
}
