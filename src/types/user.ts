export interface UserProfileData {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  profileImage?: string | null;
  avatar?: string | null;
  bio?: string | null;
  phoneNumber?: string | null;
  country?: string | null;
  timezone?: string | null;
  nativeLanguage?: string | null;
  learningGoals?: string | string[] | null;
  estimatedCEFR?: string | null;
  targetLevel?: string | null;
  dailyGoalMinutes?: number | string | null;
  streakDays?: number;
  lastActiveDate?: string | null;
  longestStreak?: number;
  streakFreezeCount?: number;
  role?: string;
  registrationMethod?: string;
  createdAt?: string;
  updatedAt?: string;
  profile?: {
    nativeLanguage?: string | null;
    learningGoals?: string | string[] | null;
    estimatedCEFR?: string | null;
    targetLevel?: string | null;
    dailyGoalMinutes?: number | string | null;
    streakDays?: number;
    lastActiveDate?: string | null;
    longestStreak?: number;
    streakFreezeCount?: number;
    [key: string]: any;
  } | null;
  level?: string;
}

export interface UserProfileResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: UserProfileData;
  timestamp: string;
}

export interface UpdateUserProfileDto {
  firstName?: string;
  lastName?: string;
  bio?: string | null;
  phoneNumber?: string | null;
  country?: string | null;
  timezone?: string | null;
  nativeLanguage?: string | null;
  learningGoals?: string | string[] | null;
  estimatedCEFR?: string | null;
  targetLevel?: string | null;
  dailyGoalMinutes?: number | string | null;
  profileImage?: File | string | null;
  level?: string;
}

export interface UpdateUserProfileResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: UserProfileData;
  timestamp: string;
}

export interface StreakRecordDto {
  timezone?: string;
}

export interface StreakData {
  streakDays?: number;
  lastActiveDate?: string;
  longestStreak?: number;
  isNewDay?: boolean;
  streakUpdated?: boolean;
  user?: UserProfileData;
  [key: string]: any;
}

export interface StreakRecordResponse {
  success: boolean;
  statusCode?: number;
  message?: string;
  data?: StreakData | UserProfileData;
  timestamp?: string;
}

