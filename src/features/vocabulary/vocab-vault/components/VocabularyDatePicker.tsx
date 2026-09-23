"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  RotateCcw,
  Check,
} from "lucide-react";

interface VocabularyDatePickerProps {
  selectedDate: string | null; // Format: YYYY-MM-DD or null
  onSelectDate: (dateStr: string | null) => void;
  wordCounts?: Record<string, number>; // Map of YYYY-MM-DD -> word count
  className?: string;
  buttonClassName?: string;
  itemLabel?: string;
  onMonthChange?: (monthStr: string) => void; // Format: YYYY-MM
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function VocabularyDatePicker({
  selectedDate,
  onSelectDate,
  wordCounts = {},
  className = "",
  buttonClassName = "",
  itemLabel = "word",
  onMonthChange,
}: VocabularyDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize display month/year based on selected date or current date
  const [currentViewDate, setCurrentViewDate] = useState<Date>(() => {
    if (selectedDate) {
      const [year, month] = selectedDate.split("-").map(Number);
      return new Date(year, month - 1, 1);
    }
    return new Date();
  });

  // When selectedDate changes externally, sync the calendar view if it has value
  useEffect(() => {
    if (selectedDate) {
      const [year, month] = selectedDate.split("-").map(Number);
      setCurrentViewDate(new Date(year, month - 1, 1));
    }
  }, [selectedDate]);

  // Handle click outside to close popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const viewYear = currentViewDate.getFullYear();
  const viewMonth = currentViewDate.getMonth();

  // Notify parent on mount/open of current month
  useEffect(() => {
    if (isOpen && onMonthChange) {
      const monthStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}`;
      onMonthChange(monthStr);
    }
  }, [isOpen, viewYear, viewMonth, onMonthChange]);

  const handlePrevMonth = () => {
    const nextDate = new Date(viewYear, viewMonth - 1, 1);
    setCurrentViewDate(nextDate);
    if (onMonthChange) {
      const m = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, "0")}`;
      onMonthChange(m);
    }
  };

  const handleNextMonth = () => {
    const nextDate = new Date(viewYear, viewMonth + 1, 1);
    setCurrentViewDate(nextDate);
    if (onMonthChange) {
      const m = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, "0")}`;
      onMonthChange(m);
    }
  };

  const handleJumpToToday = () => {
    const today = new Date();
    const nextDate = new Date(today.getFullYear(), today.getMonth(), 1);
    setCurrentViewDate(nextDate);
    if (onMonthChange) {
      const m = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, "0")}`;
      onMonthChange(m);
    }
  };

  // Build calendar matrix (6 weeks x 7 days)
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const days: {
      dayNumber: number;
      dateStr: string;
      isCurrentMonth: boolean;
      isToday: boolean;
      isSelected: boolean;
      wordCount: number;
    }[] = [];

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      now.getDate()
    ).padStart(2, "0")}`;

    // Prev month padding days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
      const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}-${String(d).padStart(
        2,
        "0"
      )}`;
      days.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        isSelected: dateStr === selectedDate,
        wordCount: wordCounts[dateStr] || 0,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(
        2,
        "0"
      )}`;
      days.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        isSelected: dateStr === selectedDate,
        wordCount: wordCounts[dateStr] || 0,
      });
    }

    // Next month padding days to complete grid (up to 35 or 42 cells)
    const remainingCells = (7 - (days.length % 7)) % 7;
    const totalNeeded = days.length + remainingCells < 35 ? 35 - days.length : remainingCells;
    for (let d = 1; d <= totalNeeded; d++) {
      const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
      const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, "0")}-${String(d).padStart(
        2,
        "0"
      )}`;
      days.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        isSelected: dateStr === selectedDate,
        wordCount: wordCounts[dateStr] || 0,
      });
    }

    return days;
  }, [viewYear, viewMonth, selectedDate, wordCounts]);

  // Today and Yesterday date strings
  const todayStr = useMemo(() => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(
      t.getDate()
    ).padStart(2, "0")}`;
  }, []);

  const yesterdayStr = useMemo(() => {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    return `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, "0")}-${String(
      y.getDate()
    ).padStart(2, "0")}`;
  }, []);

  // Format active selected date label
  const formattedLabel = useMemo(() => {
    if (!selectedDate) return "Filter Date";
    if (selectedDate === todayStr) return "Today";
    if (selectedDate === yesterdayStr) return "Yesterday";

    try {
      const [y, m, d] = selectedDate.split("-").map(Number);
      const dateObj = new Date(y, m - 1, d);
      return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: y !== new Date().getFullYear() ? "numeric" : undefined,
      });
    } catch {
      return selectedDate;
    }
  }, [selectedDate, todayStr, yesterdayStr]);

  const selectedDayWordsCount = selectedDate ? wordCounts[selectedDate] || 0 : 0;

  const getItemCountLabel = (count: number) => {
    if (itemLabel === "story") {
      return count === 1 ? "story" : "stories";
    }
    return count === 1 ? itemLabel : `${itemLabel}s`;
  };

  return (
    <div ref={containerRef} className={`relative ${className || "inline-block"}`}>
      {/* Trigger Button */}
      <div className="flex items-center w-full">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`group inline-flex items-center gap-2 border transition-all cursor-pointer select-none ${
            buttonClassName
              ? buttonClassName
              : "px-4 py-3 rounded-2xl text-sm font-semibold"
          } ${
            selectedDate
              ? "bg-gradient-to-r from-purple-600/15 via-indigo-600/15 to-pink-600/15 border-purple-500/40 text-purple-700 dark:text-purple-300 shadow-sm shadow-purple-500/10 ring-2 ring-purple-500/20"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-purple-400 dark:hover:border-purple-500/50"
          }`}
          title={
            selectedDate
              ? `Filtering by ${formattedLabel}`
              : `Filter ${itemLabel === "story" ? "stories" : "vocabulary"} by date`
          }
        >
          <div
            className={`p-1 rounded-lg transition-colors ${
              selectedDate
                ? "bg-purple-600 text-white shadow-sm"
                : "text-slate-400 group-hover:text-purple-500"
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
          </div>

          <span>{formattedLabel}</span>

          {selectedDate && (
            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-purple-500/20 text-purple-700 dark:text-purple-300">
              {selectedDayWordsCount} {getItemCountLabel(selectedDayWordsCount)}
            </span>
          )}
        </button>

        {/* Instant Clear Icon Button when active */}
        {selectedDate && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectDate(null);
            }}
            title="Clear date filter"
            className="-ml-3 mr-1 z-10 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer shadow-sm"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Calendar Popover */}
      {isOpen && (
        <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 z-50 w-[320px] sm:w-[350px] p-4 rounded-3xl bg-white/95 dark:bg-[#120F24]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.25)] animate-in fade-in zoom-in-95 duration-200 origin-top-left sm:origin-top-right">
          {/* Header Month / Year & Navigation */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-1.5">
              <span className="font-brand font-bold text-slate-900 dark:text-white text-base">
                {MONTH_NAMES[viewMonth]}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                {viewYear}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleJumpToToday}
                className="px-2 py-1 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors cursor-pointer"
                title="Go to current month"
              >
                Current
              </button>
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                title="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                title="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 py-2.5 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => {
                onSelectDate(null);
                setIsOpen(false);
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
                !selectedDate
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-sm"
                  : "bg-slate-50 dark:bg-white/5 border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-purple-400"
              }`}
            >
              All Dates
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectDate(todayStr);
                const t = new Date();
                setCurrentViewDate(new Date(t.getFullYear(), t.getMonth(), 1));
                setIsOpen(false);
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
                selectedDate === todayStr
                  ? "bg-purple-600 text-white border-transparent shadow-sm shadow-purple-500/30"
                  : "bg-slate-50 dark:bg-white/5 border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-purple-400"
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectDate(yesterdayStr);
                const y = new Date();
                y.setDate(y.getDate() - 1);
                setCurrentViewDate(new Date(y.getFullYear(), y.getMonth(), 1));
                setIsOpen(false);
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
                selectedDate === yesterdayStr
                  ? "bg-purple-600 text-white border-transparent shadow-sm shadow-purple-500/30"
                  : "bg-slate-50 dark:bg-white/5 border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-purple-400"
              }`}
            >
              Yesterday
            </button>

            {selectedDate && (
              <button
                type="button"
                onClick={() => {
                  onSelectDate(null);
                }}
                className="ml-auto inline-flex items-center gap-1 text-[11px] text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>

          {/* Weekday Row */}
          <div className="grid grid-cols-7 gap-1 text-center py-1">
            {WEEKDAY_NAMES.map((name) => (
              <div
                key={name}
                className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500"
              >
                {name}
              </div>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div className="grid grid-cols-7 gap-1 mt-1">
            {calendarDays.map((cell) => {
              const hasWords = cell.wordCount > 0;

              return (
                <button
                  key={cell.dateStr}
                  type="button"
                  onClick={() => {
                    onSelectDate(cell.dateStr);
                    setIsOpen(false);
                  }}
                  className={`group relative flex flex-col items-center justify-center h-11 w-full rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
                    cell.isSelected
                      ? "bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold shadow-md shadow-purple-600/30 scale-105 z-10"
                      : cell.isToday
                      ? "ring-2 ring-purple-500/40 bg-purple-50/70 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-semibold"
                      : cell.isCurrentMonth
                      ? "text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-white/10"
                      : "text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
                  }`}
                  title={
                    hasWords
                      ? `${cell.dateStr}: ${cell.wordCount} ${
                          cell.wordCount === 1 ? "word" : "words"
                        } saved`
                      : cell.dateStr
                  }
                >
                  <span className="leading-none">{cell.dayNumber}</span>

                  {/* Activity Indicator Word Count Badge */}
                  {hasWords && (
                    <div className="flex items-center justify-center mt-0.5">
                      <span
                        className={`px-1 py-[0.5px] min-w-[15px] text-[9px] font-bold rounded-full leading-none transition-transform group-hover:scale-110 flex items-center justify-center ${
                          cell.isSelected
                            ? "bg-white/30 text-white shadow-sm"
                            : "bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-700/40 shadow-[0_0_6px_rgba(168,85,247,0.2)]"
                        }`}
                      >
                        {cell.wordCount}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Status / Summary */}
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5 truncate">
              {selectedDate ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="truncate">
                    <strong className="text-slate-700 dark:text-slate-200">
                      {selectedDayWordsCount}
                    </strong>{" "}
                    {getItemCountLabel(selectedDayWordsCount)} on {formattedLabel}
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                  <span>Select a date with activity dots</span>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-2.5 py-1 font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
