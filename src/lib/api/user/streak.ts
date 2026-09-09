import { StreakRecordResponse } from "@/types/user";

/**
 * Dummy streak check-in simulation (no network call)
 */
export async function recordDailyStreak(
  customTimezone?: string
): Promise<StreakRecordResponse> {
  return {
    success: true,
    message: "Streak check-in recorded successfully!",
    data: {
      streakDays: 5,
      longestStreak: 14,
      lastActiveDate: new Date().toISOString(),
      isNewDay: true,
      streakUpdated: true,
    },
  };
}
