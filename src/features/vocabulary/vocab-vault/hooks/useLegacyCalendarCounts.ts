"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchMyVocabularies } from "../api/myVocabulary";
import { getDateWordCounts } from "../api/vocabulary";

/**
 * Legacy hook for computing calendar indicator dots from vocabulary timestamps.
 * 
 * TODO: Replace with a dedicated backend endpoint once available:
 *   GET /api/v1/my-vocabularies/calendar-counts?month=YYYY-MM
 *   or dateWordCounts field in GET /api/v1/my-vocabularies/stats
 * 
 * NOTE: This is a temporary fallback that fetches up to 100 items.
 * It does not scale past the current fetch cap for vaults with >1000 items.
 */
export function useLegacyCalendarCounts() {
  const [calendarWordCounts, setCalendarWordCounts] = useState<Record<string, number>>({});
  const [isLoadingCalendar, setIsLoadingCalendar] = useState<boolean>(false);

  const reloadCalendarCounts = useCallback(async () => {
    setIsLoadingCalendar(true);
    try {
      // Fetch up to 100 items for calendar date dots as temporary fallback
      const res = await fetchMyVocabularies({ limit: 100 });
      if (res && Array.isArray(res.data)) {
        const counts = getDateWordCounts(res.data);
        setCalendarWordCounts(counts);
      }
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        console.warn("useLegacyCalendarCounts: Failed to load calendar word counts", err);
      }
    } finally {
      setIsLoadingCalendar(false);
    }
  }, []);

  useEffect(() => {
    reloadCalendarCounts();
  }, [reloadCalendarCounts]);

  return {
    calendarWordCounts,
    isLoadingCalendar,
    reloadCalendarCounts,
  };
}
