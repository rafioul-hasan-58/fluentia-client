import React, { useState, useEffect, useRef } from "react";
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
  ChevronDown,
  Tag,
  ArrowUpDown,
  CheckCircle2,
  BarChart3,
} from "lucide-react";
import { VocabularyDatePicker } from "./VocabularyDatePicker";
import { ALL_POS_OPTIONS, POS_COLORS } from "../constants/vocabularyConstants";

export const ALL_STATUS_OPTIONS = [
  { id: "LEARNING", label: "Learning", dotColor: "bg-amber-400" },
  { id: "LEARNED", label: "Learned", dotColor: "bg-blue-400" },
  { id: "MASTERED", label: "Mastered", dotColor: "bg-emerald-400" },
];

export const ALL_LEVEL_OPTIONS = [
  { id: "A1", label: "A1 Level", dotColor: "bg-emerald-400" },
  { id: "A2", label: "A2 Level", dotColor: "bg-teal-400" },
  { id: "B1", label: "B1 Level", dotColor: "bg-sky-400" },
  { id: "B2", label: "B2 Level", dotColor: "bg-indigo-400" },
  { id: "C1", label: "C1 Level", dotColor: "bg-purple-400" },
  { id: "C2", label: "C2 Level", dotColor: "bg-amber-400" },
];

export interface VocabularyFilterBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedPos: PartOfSpeech | "ALL";
  setSelectedPos: (val: PartOfSpeech | "ALL") => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  selectedLevel: string;
  setSelectedLevel: (val: string) => void;
  selectedSort: "asc" | "desc";
  setSelectedSort: (val: "asc" | "desc") => void;
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
    posCounts: Partial<Record<PartOfSpeech, number>> | Record<string, number>;
    statusCounts?: Record<string, number>;
    levelCounts?: Record<string, number>;
  };
  totalFoundCount: number;
}

const VocabularyFilterBar = ({
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
}: VocabularyFilterBarProps) => {
  const [isPosDropdownOpen, setIsPosDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false);

  const posDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const levelDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        posDropdownRef.current &&
        !posDropdownRef.current.contains(target)
      ) {
        setIsPosDropdownOpen(false);
      }
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(target)
      ) {
        setIsStatusDropdownOpen(false);
      }
      if (
        levelDropdownRef.current &&
        !levelDropdownRef.current.contains(target)
      ) {
        setIsLevelDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStatusCount = (statusKey: string): number => {
    if (!stats.statusCounts) return 0;
    return (
      stats.statusCounts[statusKey] ??
      stats.statusCounts[statusKey.toUpperCase()] ??
      stats.statusCounts[statusKey.toLowerCase()] ??
      0
    );
  };

  const getLevelCount = (levelKey: string): number => {
    if (!stats.levelCounts) return 0;
    return (
      stats.levelCounts[levelKey] ??
      stats.levelCounts[levelKey.toUpperCase()] ??
      stats.levelCounts[levelKey.toLowerCase()] ??
      0
    );
  };

  return (
    <div className="space-y-4">
      {/* Line 1: Quick Filters, Dropdowns & Actions - 2 in a line (50% / 50%) on mobile, flex-wrap on desktop */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-3 justify-start">
        <button
          type="button"
          onClick={() => setFavoritesOnly(!favoritesOnly)}
          className={`w-full sm:w-auto h-12 sm:h-auto inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${favoritesOnly
            ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 shadow-sm"
            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300"
            }`}
        >
          <Star
            className={`w-4 h-4 shrink-0 ${favoritesOnly ? "fill-amber-400 text-amber-400" : "text-slate-400"
              }`}
          />
          <span className="truncate sm:overflow-visible">Favorites</span>
        </button>

        <button
          type="button"
          onClick={() => {
            const nextVal = !todayOnly;
            setTodayOnly(nextVal);
            if (nextVal) setSelectedDate(null);
          }}
          className={`w-full sm:w-auto h-12 sm:h-auto inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${todayOnly
            ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400 shadow-sm"
            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300"
            }`}
        >
          <Clock
            className={`w-4 h-4 shrink-0 ${todayOnly ? "text-indigo-500" : "text-slate-400"
              }`}
          />
          <span className="truncate sm:overflow-visible">Today&apos;s Words</span>
          {stats.todayCount > 0 && (
            <span
              className={`hidden sm:inline-flex ml-0.5 text-xs px-1.5 py-0.5 rounded-full font-bold shrink-0 ${todayOnly
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
          className="w-full sm:w-auto"
          buttonClassName="w-full sm:w-auto h-12 sm:h-auto px-3 sm:px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold justify-center sm:justify-start"
        />
        {/* create story button */}
        <button
          type="button"
          onClick={() => {
            setIsStorySelectMode(!isStorySelectMode);
            if (isStorySelectMode) setSelectedStoryItems([]);
          }}
          className={`w-full sm:w-auto h-12 sm:h-auto inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${isStorySelectMode
            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-500 shadow-md shadow-orange-500/20"
            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-amber-400"
            }`}
          title="Toggle Story Selection Mode"
        >
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="truncate sm:overflow-visible">
            {isStorySelectMode
              ? `Story Mode (${selectedStoryItems.length})`
              : "Create Story"}
          </span>
        </button>

        {/* Part of Speech Filter Dropdown */}
        <div ref={posDropdownRef} className="relative w-full sm:w-auto sm:inline-block">
          <button
            type="button"
            onClick={() => {
              setIsPosDropdownOpen((prev) => !prev);
              setIsStatusDropdownOpen(false);
              setIsLevelDropdownOpen(false);
            }}
            className={`w-full sm:w-auto h-12 sm:h-auto inline-flex items-center gap-2 pl-3 sm:pl-3.5 pr-7 sm:pr-8 py-3 rounded-2xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer select-none relative ${selectedPos !== "ALL"
              ? "bg-gradient-to-r from-purple-600/15 via-indigo-600/15 to-pink-600/15 border-purple-500/40 text-purple-700 dark:text-purple-300 shadow-sm shadow-purple-500/10 ring-2 ring-purple-500/20 font-bold"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-purple-400 dark:hover:border-purple-500/50"
              }`}
            title="Filter vocabulary by part of speech"
          >
            <Tag
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${selectedPos !== "ALL"
                ? "text-purple-600 dark:text-purple-400"
                : "text-slate-400"
                }`}
            />

            <span className="truncate sm:overflow-visible">
              {selectedPos === "ALL"
                ? "All Types"
                : POS_COLORS[selectedPos]?.label || selectedPos}
            </span>

            <div className="pointer-events-none absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <ChevronDown
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 ${isPosDropdownOpen ? "rotate-180" : ""
                  }`}
              />
            </div>
          </button>

          {/* Dropdown Popover */}
          {isPosDropdownOpen && (
            <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 z-50 w-56 max-w-[90vw] p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/15 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
              {/* All Types option */}
              <button
                type="button"
                onClick={() => {
                  setSelectedPos("ALL");
                  setIsPosDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${selectedPos === "ALL"
                  ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>All Types</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                  {stats.total}
                </span>
              </button>

              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

              {/* Specific POS options */}
              <div className="max-h-60 overflow-y-auto space-y-0.5">
                {ALL_POS_OPTIONS.map((pos) => {
                  const count = (stats.posCounts as Record<string, number>)?.[pos] || 0;
                  const config = POS_COLORS[pos];
                  const isSelected = selectedPos === pos;

                  return (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => {
                        setSelectedPos(pos);
                        setIsPosDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${isSelected
                        ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        } ${count === 0 ? "opacity-50" : ""}`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${config?.border?.replace("border-", "bg-") || "bg-indigo-400"
                            }`}
                        />
                        <span>{config?.label || pos}</span>
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sort Select */}
        <div className="relative w-full sm:w-auto">
          <div className="pointer-events-none absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <ArrowUpDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value as any)}
            className="w-full sm:w-auto h-12 sm:h-auto pl-8 sm:pl-9 pr-7 sm:pr-8 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer appearance-none"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
          <div className="pointer-events-none absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>

        {/* Status Filter Dropdown */}
        <div ref={statusDropdownRef} className="relative w-full sm:w-auto sm:inline-block">
          <button
            type="button"
            onClick={() => {
              setIsStatusDropdownOpen((prev) => !prev);
              setIsPosDropdownOpen(false);
              setIsLevelDropdownOpen(false);
            }}
            className={`w-full sm:w-auto h-12 sm:h-auto inline-flex items-center gap-2 pl-3 sm:pl-3.5 pr-7 sm:pr-8 py-3 rounded-2xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer select-none relative ${selectedStatus !== "ALL"
              ? "bg-gradient-to-r from-emerald-600/15 via-teal-600/15 to-emerald-600/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 shadow-sm shadow-emerald-500/10 ring-2 ring-emerald-500/20 font-bold"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-emerald-400 dark:hover:border-emerald-500/50"
              }`}
            title="Filter vocabulary by status"
          >
            <CheckCircle2
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${selectedStatus !== "ALL"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-slate-400"
                }`}
            />

            <span className="truncate sm:overflow-visible">
              {selectedStatus === "ALL"
                ? "All Statuses"
                : ALL_STATUS_OPTIONS.find((s) => s.id === selectedStatus)?.label || selectedStatus}
            </span>

            <div className="pointer-events-none absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <ChevronDown
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 ${isStatusDropdownOpen ? "rotate-180" : ""
                  }`}
              />
            </div>
          </button>

          {/* Status Dropdown Popover */}
          {isStatusDropdownOpen && (
            <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 z-50 w-52 max-w-[90vw] p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/15 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
              {/* All Statuses option */}
              <button
                type="button"
                onClick={() => {
                  setSelectedStatus("ALL");
                  setIsStatusDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${selectedStatus === "ALL"
                  ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>All Statuses</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                  {stats.total}
                </span>
              </button>

              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

              {/* Status options */}
              <div className="space-y-0.5">
                {ALL_STATUS_OPTIONS.map((st) => {
                  const count = getStatusCount(st.id);
                  const isSelected = selectedStatus === st.id;

                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        setSelectedStatus(st.id);
                        setIsStatusDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${isSelected
                        ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        } ${count === 0 ? "opacity-50" : ""}`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${st.dotColor}`} />
                        <span>{st.label}</span>
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Level Filter Dropdown */}
        <div ref={levelDropdownRef} className="relative w-full sm:w-auto sm:inline-block">
          <button
            type="button"
            onClick={() => {
              setIsLevelDropdownOpen((prev) => !prev);
              setIsPosDropdownOpen(false);
              setIsStatusDropdownOpen(false);
            }}
            className={`w-full sm:w-auto h-12 sm:h-auto inline-flex items-center gap-2 pl-3 sm:pl-3.5 pr-7 sm:pr-8 py-3 rounded-2xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer select-none relative ${selectedLevel !== "ALL"
              ? "bg-gradient-to-r from-blue-600/15 via-indigo-600/15 to-cyan-600/15 border-blue-500/40 text-blue-700 dark:text-blue-300 shadow-sm shadow-blue-500/10 ring-2 ring-blue-500/20 font-bold"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500/50"
              }`}
            title="Filter vocabulary by CEFR level"
          >
            <BarChart3
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${selectedLevel !== "ALL"
                ? "text-blue-600 dark:text-blue-400"
                : "text-slate-400"
                }`}
            />

            <span className="truncate sm:overflow-visible">
              {selectedLevel === "ALL"
                ? "All Levels"
                : ALL_LEVEL_OPTIONS.find((l) => l.id === selectedLevel)?.label || `${selectedLevel} Level`}
            </span>

            {/* <span
              className={`hidden sm:inline-flex text-xs px-2 py-0.5 rounded-full font-bold shrink-0 ${selectedLevel !== "ALL"
                ? "bg-blue-500/20 text-blue-700 dark:text-blue-300"
                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                }`}
            >
              {selectedLevel === "ALL"
                ? stats.total
                : getLevelCount(selectedLevel)}
            </span> */}

            <div className="pointer-events-none absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <ChevronDown
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 ${isLevelDropdownOpen ? "rotate-180" : ""
                  }`}
              />
            </div>
          </button>

          {/* Level Dropdown Popover */}
          {isLevelDropdownOpen && (
            <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 z-50 w-52 max-w-[90vw] p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/15 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
              {/* All Levels option */}
              <button
                type="button"
                onClick={() => {
                  setSelectedLevel("ALL");
                  setIsLevelDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${selectedLevel === "ALL"
                  ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>All Levels</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                  {stats.total}
                </span>
              </button>

              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

              {/* Level options */}
              <div className="max-h-60 overflow-y-auto space-y-0.5">
                {ALL_LEVEL_OPTIONS.map((lvl) => {
                  const count = getLevelCount(lvl.id);
                  const isSelected = selectedLevel === lvl.id;

                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => {
                        setSelectedLevel(lvl.id);
                        setIsLevelDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${isSelected
                        ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        } ${count === 0 ? "opacity-50" : ""}`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${lvl.dotColor}`} />
                        <span>{lvl.label}</span>
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

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
              className={`p-2 rounded-xl transition-all cursor-pointer ${viewMode === "grid"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              title="Table View (Compact)"
              className={`p-2 rounded-xl transition-all cursor-pointer ${viewMode === "table"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
            >
              <Table className="w-4 h-4" />
            </button>
          </div>
        </div>
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
export default VocabularyFilterBar;