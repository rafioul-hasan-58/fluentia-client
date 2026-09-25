"use client";

import React from "react";
import { Search, X, Clock, Layers, RefreshCw, Calendar, ArrowUpDown } from "lucide-react";
import { VocabularyDatePicker } from "@/features/vocabulary/vocab-vault/components/VocabularyDatePicker";

interface VocabStoryFilterBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  todayOnly: boolean;
  setTodayOnly: (val: boolean) => void;
  storyDateCounts: Record<string, number>;
  todayCount: number;
  totalFiltered: number;
  isLoading: boolean;
  onRefresh: () => void;
  onResetFilters: () => void;
  sortOrder: "asc" | "desc";
  onToggleSortOrder: () => void;
}

export const VocabStoryFilterBar: React.FC<VocabStoryFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedDate,
  setSelectedDate,
  todayOnly,
  setTodayOnly,
  storyDateCounts,
  todayCount,
  totalFiltered,
  isLoading,
  onRefresh,
  onResetFilters,
  sortOrder,
  onToggleSortOrder,
}) => {
  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#141226] border border-slate-200 dark:border-white/10 shadow-sm space-y-3.5">
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search stories by title, vocabulary or text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 h-10 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Date Filters & Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* All Dates Preset */}
          <button
            type="button"
            onClick={() => {
              setSelectedDate(null);
              setTodayOnly(false);
            }}
            className={`h-10 px-4 rounded-xl text-xs font-semibold inline-flex items-center justify-center border transition-all cursor-pointer ${
              !selectedDate && !todayOnly
                ? "bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/40 text-amber-700 dark:text-amber-300 shadow-2xs font-bold"
                : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-300"
            }`}
          >
            All Dates
          </button>

          {/* Today's Stories Preset */}
          <button
            type="button"
            onClick={() => {
              const nextVal = !todayOnly;
              setTodayOnly(nextVal);
              if (nextVal) setSelectedDate(null);
            }}
            className={`h-10 px-4 rounded-xl text-xs font-semibold inline-flex items-center gap-2 border transition-all cursor-pointer ${
              todayOnly
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-transparent shadow-xs font-bold"
                : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-300"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Today&apos;s Stories</span>
            {todayCount > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  todayOnly
                    ? "bg-white/25 text-white"
                    : "bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400"
                }`}
              >
                {todayCount}
              </span>
            )}
          </button>

          {/* Interactive Calendar Date Picker */}
          <VocabularyDatePicker
            selectedDate={selectedDate}
            onSelectDate={(date: any) => {
              setSelectedDate(date);
              if (date) setTodayOnly(false);
            }}
            wordCounts={storyDateCounts}
            itemLabel="story"
            buttonClassName="h-10 px-4 rounded-xl text-xs font-semibold"
          />

          {/* Sort Order Toggle Button */}
          <button
            type="button"
            onClick={onToggleSortOrder}
            disabled={isLoading}
            className={`h-10 px-3.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 border transition-all cursor-pointer shadow-2xs group ${
              sortOrder === "asc"
                ? "bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/40 text-amber-700 dark:text-amber-300 font-bold"
                : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-300 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
            title={`Sort Order: ${sortOrder === "desc" ? "Newest First (desc)" : "Oldest First (asc)"} — Click to switch`}
          >
            <ArrowUpDown
              className={`w-3.5 h-3.5 text-amber-500 transition-transform duration-200 ${
                sortOrder === "asc" ? "rotate-180" : ""
              }`}
            />
            <span>{sortOrder === "desc" ? "Newest First" : "Oldest First"}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/20">
              {sortOrder}
            </span>
          </button>

          {/* Stories Count Badge */}
          <div className="h-10 px-3.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-500" />
            <span>
              {totalFiltered} {totalFiltered === 1 ? "Story" : "Stories"}
            </span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            title="Refresh stories"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-amber-500" : ""}`} />
          </button>

          {/* Reset Filters Button */}
          {(selectedDate || todayOnly || searchQuery || sortOrder !== "desc") && (
            <button
              type="button"
              onClick={onResetFilters}
              className="h-10 inline-flex items-center gap-1.5 px-3.5 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/50 transition-colors cursor-pointer"
              title="Reset filters"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Date Filter Notice Banner */}
      {(selectedDate || todayOnly) && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-300 backdrop-blur-md animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-amber-500 text-white shadow-sm">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <span>
              {todayOnly ? (
                <>
                  Showing stories generated <strong>today</strong>
                </>
              ) : (
                <>
                  Filtering stories created on{" "}
                  <strong className="font-bold text-slate-900 dark:text-white">
                    {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </strong>
                </>
              )}{" "}
              ({totalFiltered} {totalFiltered === 1 ? "story" : "stories"} found)
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedDate(null);
              setTodayOnly(false);
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 font-bold border border-rose-200/60 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer shadow-sm text-xs"
          >
            <X className="w-3 h-3" />
            <span>Clear Date Filter</span>
          </button>
        </div>
      )}
    </div>
  );
};
