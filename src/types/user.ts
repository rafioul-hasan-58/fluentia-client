export interface UserProfileData {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  profileImage?: string | null;
  bio?: string | null;
  phoneNumber?: string | null;
  country?: string | null;
  timezone?: string | null;
  nativeLanguage?: string | null;
  learningGoals?: string | string[] | null;
  estimatedCEFR?: string | null;
  targetLevel?: string | null;
  dailyGoalMinutes?: number | string | null;
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
