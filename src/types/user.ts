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
  role?: string;
  registrationMethod?: string;
  createdAt?: string;
  updatedAt?: string;
  profile?: Record<string, any> | null;
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
  profileImage?: string | null;
  level?: string;
}

export interface UpdateUserProfileResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: UserProfileData;
  timestamp: string;
}
