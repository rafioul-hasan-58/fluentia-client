import React from "react";
import { PartOfSpeech } from "@/types";
import { MyVocabularyItem } from "../types/vocabulary";
import {
  Calendar,
  Clock,
  LayoutGrid,
  RefreshCw,
  Search,
  Sparkles,
  Star,
  Table,
  X,
} from "lucide-react";
import { VocabularyDatePicker } from "./VocabularyDatePicker";
import { ALL_POS_OPTIONS, POS_COLORS } from "../constants/vocabularyConstants";

export interface VocabularyFilterBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedPos: PartOfSpeech | "ALL";
  setSelectedPos: (val: PartOfSpeech | "ALL") => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  selectedLevel: string;
  setSelectedLevel: (val: string) => void;
  selectedSort: "recent" | "alphabetical" | "mastery";
  setSelectedSort: (val: "recent" | "alphabetical" | "mastery") => void;
  favoritesOnly: boolean;
  setFavoritesOnly: (val: boolean | ((prev: boolean) => boolean)) => void;
  todayOnly: boolean;
  setTodayOnly: (val: boolean | ((prev: boolean) => boolean)) => void;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  calendarWordCounts: Record<string, number>;
  viewMode: "grid" | "table";
  setViewMode: (mode: "grid" | "table") => void;
  loadVocabularies: () => void;
  isLoading: boolean;
  isStorySelectMode: boolean;
  setIsStorySelectMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  selectedStoryItems: MyVocabularyItem[];
  setSelectedStoryItems: (items: MyVocabularyItem[]) => void;
  stats: {
    total: number;
    todayCount: number;
    posCounts: Record<string, number>;
  };
  totalFoundCount: number;
}

export default function VocabularyFilterBar({
  searchQuery,
  setSearchQuery,
  selectedPos,
  setSelectedPos,
  selectedStatus,
  setSelectedStatus,
  selectedLevel,
  setSelectedLevel,
  selectedSort,
  setSelectedSort,
  favoritesOnly,
  setFavoritesOnly,
  todayOnly,
  setTodayOnly,
  selectedDate,
  setSelectedDate,
  calendarWordCounts,
  viewMode,
  setViewMode,
  loadVocabularies,
  isLoading,
  isStorySelectMode,
  setIsStorySelectMode,
  selectedStoryItems,
  setSelectedStoryItems,
  stats,
  totalFoundCount,
}: VocabularyFilterBarProps) {
  return (
    <div className="space-y-4">
      {/* Line 1: Favorites, Quick Filters, Dropdowns & Actions (Left-aligned) */}
      <div className="flex flex-wrap items-center gap-3 justify-start">
        <button
          onClick={() => setFavoritesOnly(!favoritesOnly)}
          className={`inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold border transition-all cursor-pointer ${
            favoritesOnly
              ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 shadow-sm"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300"
          }`}
        >
          <Star
            className={`w-4 h-4 ${
              favoritesOnly ? "fill-amber-400 text-amber-400" : "text-slate-400"
            }`}
          />
          <span>Favorites</span>
        </button>

        <button
          onClick={() => {
            const nextVal = !todayOnly;
            setTodayOnly(nextVal);
            if (nextVal) setSelectedDate(null);
          }}
          className={`inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold border transition-all cursor-pointer ${
            todayOnly
              ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 shadow-sm"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300"
          }`}
        >
          <Clock
            className={`w-4 h-4 ${
              todayOnly ? "text-indigo-500" : "text-slate-400"
            }`}
          />
          <span>Today&apos;s Words</span>
          {stats.todayCount > 0 && (
            <span
              className={`ml-0.5 text-xs px-1.5 py-0.5 rounded-full font-bold ${
                todayOnly
                  ? "bg-indigo-500/20 text-indigo-600 dark:text-indigo-300"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
              }`}
            >
              {stats.todayCount}
            </span>
          )}
        </button>

        {/* Calendar Date Filter Picker */}
        <VocabularyDatePicker
          selectedDate={selectedDate}
          onSelectDate={(date: any) => {
            setSelectedDate(date);
            if (date) setTodayOnly(false);
          }}
          wordCounts={calendarWordCounts}
        />

        <select
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value as any)}
          className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer"
        >
          <option value="recent">Recently Added</option>
          <option value="alphabetical">Alphabetical (A - Z)</option>
          <option value="mastery">Mastery Level</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer"
        >
          <option value="ALL">All Statuses</option>
          <option value="LEARNING">Learning</option>
          <option value="LEARNED">Learned</option>
          <option value="MASTERED">Mastered</option>
        </select>

        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer"
        >
          <option value="ALL">All Levels</option>
          <option value="A1">A1 Level</option>
          <option value="A2">A2 Level</option>
          <option value="B1">B1 Level</option>
          <option value="B2">B2 Level</option>
          <option value="C1">C1 Level</option>
          <option value="C2">C2 Level</option>
        </select>

        <button
          onClick={() => {
            setIsStorySelectMode(!isStorySelectMode);
            if (isStorySelectMode) setSelectedStoryItems([]);
          }}
          className={`inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold border transition-all cursor-pointer ${
            isStorySelectMode
              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-500 shadow-md shadow-orange-500/20"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-amber-400"
          }`}
          title="Toggle Story Selection Mode"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>
            {isStorySelectMode
              ? `Story Mode (${selectedStoryItems.length})`
              : "Create Story"}
          </span>
        </button>
      </div>

      {/* Line 2: Search Bar, Refresh & View Mode Switch (Left-aligned) */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 justify-start">
        {/* Search Bar - Expanded & Prominent */}
        <div className="relative w-full sm:max-w-xl md:max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search words, English definitions, Bengali meanings, or synonyms..."
            className="w-full pl-12 pr-10 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Refresh Button */}
          <button
            onClick={loadVocabularies}
            title="Refresh vocabulary"
            className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-sm cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          {/* View Mode Toggle (Grid vs Table) */}
          <div className="flex items-center p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <button
              onClick={() => setViewMode("grid")}
              title="Grid View"
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              title="Table View (Compact)"
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              <Table className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Line 3: Part of Speech Pill Carousel (Left-aligned) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start">
        <button
          onClick={() => setSelectedPos("ALL")}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            selectedPos === "ALL"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md"
              : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          All Words ({stats.total})
        </button>

        {ALL_POS_OPTIONS.map((pos) => {
          const count = stats.posCounts[pos] || 0;
          const config = POS_COLORS[pos];
          const isSelected = selectedPos === pos;
          return (
            <button
              key={pos}
              onClick={() => setSelectedPos(pos)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                isSelected
                  ? `${config.bg} ${config.text} ${config.border} ring-2 ring-indigo-500/20 shadow-sm`
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
              }`}
            >
              <span>{config.label}</span>
              <span className="text-[10px] opacity-75">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Active Date Filter Notice Banner */}
      {selectedDate && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-pink-500/10 border border-purple-500/30 text-xs sm:text-sm text-purple-700 dark:text-purple-300 backdrop-blur-md animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-600 text-white shadow-sm">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <span>
              Filtering vocabulary saved on{" "}
              <strong className="font-bold text-slate-900 dark:text-white">
                {new Date(selectedDate + "T00:00:00").toLocaleDateString(
                  "en-US",
                  {
                    weekday: "short",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }
                )}
              </strong>{" "}
              ({totalFoundCount}{" "}
              {totalFoundCount === 1 ? "word" : "words"} found)
            </span>
          </div>
          <button
            onClick={() => setSelectedDate(null)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-800 text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 font-bold border border-rose-200/60 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer shadow-sm text-xs"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Date Filter</span>
          </button>
        </div>
      )}
    </div>
  );
}
