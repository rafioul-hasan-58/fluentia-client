"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Clock,
    Calendar,
    CalendarDays,
    X,
    Filter,
    ChevronDown,
    Tag,
    Layers,
    RefreshCw,
    CheckCircle2,
} from "lucide-react";
import { PartOfSpeech } from "@/types";
import { VocabularyDatePicker } from "@/features/vocabulary/vocab-vault/components/VocabularyDatePicker";
import { ALL_POS_OPTIONS, POS_COLORS } from "@/features/vocabulary";

interface VocabPracticeFilterBarProps {
    selectedDate: string | null;
    onSelectDate: (date: string | null) => void;
    todayOnly: boolean;
    onToggleTodayOnly: (val: boolean) => void;
    todayCount: number;
    calendarWordCounts: Record<string, number>;
    onMonthChange: (monthStr: string) => void;
    selectedPos: PartOfSpeech | "ALL";
    onSelectPos: (pos: PartOfSpeech | "ALL") => void;
    totalStatsCount: number;
    posCounts: Partial<Record<PartOfSpeech, number>>;
    wordLimit: number;
    onSelectWordLimit: (limit: number) => void;
    loadedWordsCount: number;
    hasActiveFilters: boolean;
    onResetFilters: () => void;
    isRefreshing: boolean;
    isLoading: boolean;
    onRefresh: () => void;
}

export const VocabPracticeFilterBar: React.FC<VocabPracticeFilterBarProps> = ({
    selectedDate,
    onSelectDate,
    todayOnly,
    onToggleTodayOnly,
    todayCount,
    calendarWordCounts,
    onMonthChange,
    selectedPos,
    onSelectPos,
    totalStatsCount,
    posCounts,
    wordLimit,
    onSelectWordLimit,
    loadedWordsCount,
    hasActiveFilters,
    onResetFilters,
    isRefreshing,
    isLoading,
    onRefresh,
}) => {
    const [isPosDropdownOpen, setIsPosDropdownOpen] = useState(false);
    const [isLimitDropdownOpen, setIsLimitDropdownOpen] = useState(false);
    const posDropdownRef = useRef<HTMLDivElement>(null);
    const limitDropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                posDropdownRef.current &&
                !posDropdownRef.current.contains(event.target as Node)
            ) {
                setIsPosDropdownOpen(false);
            }
            if (
                limitDropdownRef.current &&
                !limitDropdownRef.current.contains(event.target as Node)
            ) {
                setIsLimitDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5 sm:space-y-4">
            {/* Header: Label & Reset Filters */}
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-purple-500" />
                    <span>Filter By:</span>
                </span>

                {/* Clear Filters button */}
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={onResetFilters}
                        className="h-8 inline-flex items-center gap-1.5 px-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/50 transition-colors cursor-pointer"
                    >
                        <X className="w-3.5 h-3.5" />
                        <span>Reset Filters</span>
                    </button>
                )}
            </div>

            {/* Filter Controls: 2 items per row on mobile (grid-cols-2), flex on desktop */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5">
                {/* Row 1, Col 1: All Dates Preset */}
                <button
                    type="button"
                    onClick={() => {
                        onSelectDate(null);
                        onToggleTodayOnly(false);
                    }}
                    className={`h-10 w-full sm:w-auto px-2.5 sm:px-4 rounded-xl text-xs font-semibold inline-flex items-center justify-start gap-1.5 sm:gap-2 border transition-all cursor-pointer select-none ${!selectedDate && !todayOnly
                        ? "bg-purple-50 dark:bg-purple-950/60 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 shadow-2xs font-bold"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-purple-300 dark:hover:border-purple-600/50"
                        }`}
                >
                    <div
                        className={`p-1 rounded-lg shrink-0 transition-colors ${!selectedDate && !todayOnly
                            ? "bg-purple-600 text-white shadow-xs"
                            : "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/80"
                            }`}
                    >
                        <CalendarDays className="w-3.5 h-3.5" />
                    </div>
                    <span className="truncate">All Dates</span>
                </button>

                {/* Row 1, Col 2: Today's Words Toggle */}
                <button
                    type="button"
                    onClick={() => {
                        const nextVal = !todayOnly;
                        onToggleTodayOnly(nextVal);
                        if (nextVal) onSelectDate(null);
                    }}
                    className={`h-10 w-full sm:w-auto px-2.5 sm:px-4 rounded-xl text-xs font-semibold inline-flex items-center justify-start gap-1.5 sm:gap-2 border transition-all cursor-pointer select-none ${todayOnly
                        ? "bg-purple-600 text-white border-purple-600 shadow-xs font-bold"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-purple-300 dark:hover:border-purple-600/50"
                        }`}
                >
                    <div
                        className={`p-1 rounded-lg shrink-0 transition-colors ${todayOnly
                            ? "bg-white/20 text-white"
                            : "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/80"
                            }`}
                    >
                        <Clock className="w-3.5 h-3.5" />
                    </div>
                    <span className="truncate">Today&apos;s Words</span>
                    {todayCount > 0 && (
                        <span
                            className={`hidden sm:block text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${todayOnly
                                ? "bg-white/25 text-white"
                                : "bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400"
                                }`}
                        >
                            {todayCount}
                        </span>
                    )}
                </button>

                {/* Row 2, Col 1: Interactive Date Picker with Word Counts */}
                <VocabularyDatePicker
                    selectedDate={selectedDate}
                    onSelectDate={(date: any) => {
                        onSelectDate(date);
                        if (date) onToggleTodayOnly(false);
                    }}
                    onMonthChange={onMonthChange}
                    wordCounts={calendarWordCounts}
                    className="w-full sm:w-auto"
                    buttonClassName="h-10 w-full sm:w-auto px-2.5 sm:px-4 rounded-xl text-xs font-semibold justify-start gap-1.5 sm:gap-2"
                />

                {/* Row 2, Col 2: Part of Speech Filter Dropdown */}
                <div ref={posDropdownRef} className="relative w-full sm:w-auto sm:inline-block">
                    <button
                        type="button"
                        onClick={() => {
                            setIsPosDropdownOpen((prev) => !prev);
                            setIsLimitDropdownOpen(false);
                        }}
                        className={`h-10 w-full sm:w-auto px-2.5 sm:px-4 rounded-xl text-xs font-semibold border inline-flex items-center justify-between sm:justify-start gap-1.5 sm:gap-2 transition-all cursor-pointer select-none ${selectedPos !== "ALL"
                            ? "bg-gradient-to-r from-purple-600/15 via-indigo-600/15 to-pink-600/15 border-purple-500/40 text-purple-700 dark:text-purple-300 shadow-sm shadow-purple-500/10 ring-2 ring-purple-500/20 font-bold"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-purple-400 dark:hover:border-purple-500/50"
                            }`}
                        title="Filter by part of speech"
                    >
                        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                            <div
                                className={`p-1 rounded-lg shrink-0 transition-colors ${selectedPos !== "ALL"
                                    ? "bg-purple-600 text-white shadow-sm"
                                    : "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/80"
                                    }`}
                            >
                                <Tag className="w-3.5 h-3.5" />
                            </div>

                            <span className="truncate">
                                {selectedPos === "ALL"
                                    ? "All Types"
                                    : POS_COLORS[selectedPos]?.label || selectedPos}
                            </span>

                            <span
                                className={`hidden sm:block text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${selectedPos !== "ALL"
                                    ? "bg-purple-500/20 text-purple-700 dark:text-purple-300"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                                    }`}
                            >
                                {selectedPos === "ALL"
                                    ? totalStatsCount
                                    : posCounts[selectedPos] || 0}
                            </span>
                        </div>

                        <ChevronDown
                            className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${isPosDropdownOpen ? "rotate-180" : ""
                                }`}
                        />
                    </button>

                    {/* Dropdown Popover */}
                    {isPosDropdownOpen && (
                        <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 z-50 w-56 max-w-[90vw] p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/15 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
                            {/* All Types option */}
                            <button
                                type="button"
                                onClick={() => {
                                    onSelectPos("ALL");
                                    setIsPosDropdownOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${selectedPos === "ALL"
                                    ? "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold"
                                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    }`}
                            >
                                <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                                    <span>All Types</span>
                                </span>
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                                    {totalStatsCount}
                                </span>
                            </button>

                            <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                            {/* Specific POS options */}
                            <div className="max-h-60 overflow-y-auto space-y-0.5">
                                {ALL_POS_OPTIONS.map((pos: PartOfSpeech) => {
                                    const count = posCounts[pos] || 0;
                                    const config = POS_COLORS[pos];
                                    const isSelected = selectedPos === pos;

                                    return (
                                        <button
                                            key={pos}
                                            type="button"
                                            onClick={() => {
                                                onSelectPos(pos);
                                                setIsPosDropdownOpen(false);
                                            }}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${isSelected
                                                ? "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold"
                                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                } ${count === 0 ? "opacity-50" : ""}`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span
                                                    className={`w-2 h-2 rounded-full ${config?.border?.replace("border-", "bg-") || "bg-purple-400"
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

                {/* Row 3, Col 1: Words to Load / Session Size Dropdown */}
                <div ref={limitDropdownRef} className="relative w-full sm:w-auto sm:inline-block">
                    <button
                        type="button"
                        onClick={() => {
                            setIsLimitDropdownOpen((prev) => !prev);
                            setIsPosDropdownOpen(false);
                        }}
                        className={`h-10 w-full sm:w-auto px-2.5 sm:px-4 rounded-xl text-xs font-semibold border inline-flex items-center justify-between sm:justify-start gap-1.5 sm:gap-2 transition-all cursor-pointer select-none ${wordLimit !== 20
                            ? "bg-purple-50/90 dark:bg-purple-950/60 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 font-bold shadow-2xs"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-purple-300 dark:hover:border-purple-600/50"
                            }`}
                        title="Select how many words to load for practice"
                    >
                        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                            <div className={`p-1 rounded-lg shrink-0 transition-colors ${wordLimit !== 20 ? "bg-purple-600 text-white shadow-xs" : "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/80"}`}>
                                <Layers className="w-3.5 h-3.5" />
                            </div>

                            <span className="whitespace-nowrap shrink-0">
                                Loaded
                            </span>

                            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0 whitespace-nowrap">
                                {loadedWordsCount}
                            </span>
                        </div>

                        <ChevronDown
                            className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${isLimitDropdownOpen ? "rotate-180" : ""
                                }`}
                        />
                    </button>

                    {/* Dropdown Popover */}
                    {isLimitDropdownOpen && (
                        <div className="absolute left-0 mt-2 z-50 w-52 max-w-[90vw] p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/15 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
                            <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                            <div className="space-y-0.5">
                                {[
                                    { value: 10, label: "10 Words" },
                                    { value: 20, label: "20 Words (Default)" },
                                    { value: 30, label: "30 Words" },
                                    { value: 50, label: "50 Words" },
                                    { value: 100, label: "100 Words" },
                                    { value: 0, label: "All Words" },
                                ].map((option) => {
                                    const isSelected = wordLimit === option.value;
                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => {
                                                onSelectWordLimit(option.value);
                                                setIsLimitDropdownOpen(false);
                                            }}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${isSelected
                                                ? "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold"
                                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                }`}
                                        >
                                            <span>{option.label}</span>
                                            {isSelected && (
                                                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Row 3, Col 2: Sync / Refresh Button */}
                <button
                    type="button"
                    onClick={onRefresh}
                    disabled={isRefreshing || isLoading}
                    className={`h-10 w-full sm:w-auto px-2.5 sm:px-4 rounded-xl text-xs font-semibold inline-flex items-center justify-start gap-1.5 sm:gap-2 border transition-all cursor-pointer select-none ${isRefreshing
                        ? "bg-purple-50 dark:bg-purple-950/60 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 shadow-2xs font-bold"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-purple-400 dark:hover:border-purple-500/50 hover:text-purple-600 dark:hover:text-purple-400"
                        }`}
                    title="Sync and refresh vocabulary words"
                >
                    <div className={`p-1 rounded-lg shrink-0 transition-colors ${isRefreshing ? "bg-purple-600 text-white shadow-sm" : "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/80"}`}>
                        <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${isRefreshing ? "animate-spin" : ""}`} />
                    </div>
                    <span className="truncate">{isRefreshing ? "Syncing..." : "Sync Words"}</span>
                </button>
            </div>

            {/* Active Filter Summary Bar */}
            {hasActiveFilters && (
                <div className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/60 text-xs text-purple-700 dark:text-purple-300">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">Active Session Filter:</span>
                        {todayOnly && (
                            <span className="px-2 py-0.5 rounded-md bg-purple-600 text-white font-medium text-[11px]">
                                Today&apos;s Words
                            </span>
                        )}
                        {selectedDate && (
                            <span className="px-2 py-0.5 rounded-md bg-purple-600 text-white font-medium text-[11px] flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {selectedDate}
                            </span>
                        )}
                        {selectedPos !== "ALL" && (
                            <span className="px-2 py-0.5 rounded-md bg-purple-600 text-white font-medium text-[11px]">
                                {POS_COLORS[selectedPos]?.label || selectedPos}
                            </span>
                        )}
                        {wordLimit !== 20 && (
                            <span className="px-2 py-0.5 rounded-md bg-purple-600 text-white font-medium text-[11px] flex items-center gap-1">
                                <Layers className="w-3 h-3" />
                                {wordLimit === 0 ? "All Words" : `${wordLimit} Words`}
                            </span>
                        )}
                    </div>
                    <span className="font-semibold font-mono shrink-0">
                        {loadedWordsCount} {loadedWordsCount === 1 ? "word" : "words"} loaded
                    </span>
                </div>
            )}
        </div>
    );
};
