"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { fetchMyVocabularyStats, getDateWordCounts } from "../api/vocabulary";
import { fetchMyVocabularies } from "../api/myVocabulary";

function getCurrentMonthString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

/**
 * Hook for fetching and caching vocabulary date counts for the calendar.
 * Integrates directly with: GET /api/v1/my-vocabularies/stats?month=YYYY-MM
 * Backend returns: dateWordCounts { "YYYY-MM-DD": count, ... }
 */
export function useCalendarCounts(initialMonth?: string) {
  const [calendarWordCounts, setCalendarWordCounts] = useState<Record<string, number>>({});
  const [isLoadingCalendar, setIsLoadingCalendar] = useState<boolean>(false);
  const fetchedMonthsRef = useRef<Set<string>>(new Set());

  const fetchMonthCounts = useCallback(async (monthStr?: string) => {
    const targetMonth = monthStr || getCurrentMonthString();
    
    // Don't refetch if already loaded unless forced
    setIsLoadingCalendar(true);
    try {
      const stats = await fetchMyVocabularyStats(targetMonth);
      if (stats && stats.dateWordCounts && Object.keys(stats.dateWordCounts).length > 0) {
        setCalendarWordCounts((prev) => ({
          ...prev,
          ...stats.dateWordCounts,
        }));
        fetchedMonthsRef.current.add(targetMonth);
      } else {
        // Fallback for offline or legacy backend
        const res = await fetchMyVocabularies({ limit: 100 });
        if (res && Array.isArray(res.data)) {
          const counts = getDateWordCounts(res.data);
          setCalendarWordCounts((prev) => ({
            ...prev,
            ...counts,
          }));
        }
      }
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        console.warn("useCalendarCounts: Failed to load calendar word counts", err);
      }
    } finally {
      setIsLoadingCalendar(false);
    }
  }, []);

  const reloadCalendarCounts = useCallback(async (monthStr?: string) => {
    fetchedMonthsRef.current.clear();
    const targetMonth = monthStr || getCurrentMonthString();
    await fetchMonthCounts(targetMonth);
  }, [fetchMonthCounts]);

  useEffect(() => {
    fetchMonthCounts(initialMonth || getCurrentMonthString());
  }, [fetchMonthCounts, initialMonth]);

  return {
    calendarWordCounts,
    isLoadingCalendar,
    fetchMonthCounts,
    reloadCalendarCounts,
  };
}

// Backward-compatibility alias
export const useLegacyCalendarCounts = useCalendarCounts;
