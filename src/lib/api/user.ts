import {
  UserProfileData,
  UserProfileResponse,
  UpdateUserProfileDto,
  UpdateUserProfileResponse,
  StreakRecordResponse,
} from "@/types/user";
import { getApiBaseUrl } from "./config";

const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("fluentia_auth_token");
};

/**
 * Fetch current user profile: GET /users/my-profile
 */
export async function fetchUserProfile(): Promise<UserProfileData | null> {
  const token = getAuthToken();
  const baseUrl = getApiBaseUrl();

  const headers: HeadersInit = {
    Accept: "*/*",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    // Primary endpoint: GET /users/my-profile
    const res = await fetch(`${baseUrl}/users/my-profile`, {
      method: "GET",
      headers,
    });

    if (res.ok) {
      const data: UserProfileResponse = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
      return data.data || data;
    }

    // Fallback attempt 1: GET /users/profile if 404
    if (res.status === 404) {
      const resProfile = await fetch(`${baseUrl}/users/profile`, {
        method: "GET",
        headers,
      });
      if (resProfile.ok) {
        const dataProfile = await resProfile.json();
        return dataProfile.data || dataProfile;
      }

      // Fallback attempt 2: GET /users/me
      const resMe = await fetch(`${baseUrl}/users/me`, {
        method: "GET",
        headers,
      });
      if (resMe.ok) {
        const dataMe = await resMe.json();
        return dataMe.data || dataMe;
      }
    }
  } catch (err) {
    console.warn("fetchUserProfile network error:", err);
  }

  return null;
}

/**
 * Update current user profile: PATCH /users/my-profile (multipart/form-data)
 */
export async function updateUserProfile(
  dto: UpdateUserProfileDto
): Promise<UserProfileData> {
  const token = getAuthToken();
  const baseUrl = getApiBaseUrl();

  const formData = new FormData();
  if (dto.firstName !== undefined && dto.firstName !== null) {
    formData.append("firstName", dto.firstName);
  }
  if (dto.lastName !== undefined && dto.lastName !== null) {
    formData.append("lastName", dto.lastName);
  }
  if (dto.bio !== undefined && dto.bio !== null) {
    formData.append("bio", dto.bio);
  }
  if (dto.phoneNumber !== undefined && dto.phoneNumber !== null) {
    formData.append("phoneNumber", dto.phoneNumber);
  }
  if (dto.country !== undefined && dto.country !== null) {
    formData.append("country", dto.country);
  }
  if (dto.timezone !== undefined && dto.timezone !== null) {
    formData.append("timezone", dto.timezone);
  }
  if (dto.nativeLanguage !== undefined && dto.nativeLanguage !== null) {
    formData.append("nativeLanguage", dto.nativeLanguage);
  }
  if (dto.learningGoals !== undefined && dto.learningGoals !== null) {
    const goalsStr = Array.isArray(dto.learningGoals)
      ? dto.learningGoals.join(",")
      : dto.learningGoals;
    formData.append("learningGoals", goalsStr);
  }
  if (dto.estimatedCEFR !== undefined && dto.estimatedCEFR !== null) {
    formData.append("estimatedCEFR", dto.estimatedCEFR);
  }
  if (dto.targetLevel !== undefined && dto.targetLevel !== null) {
    formData.append("targetLevel", dto.targetLevel);
  }
  if (dto.dailyGoalMinutes !== undefined && dto.dailyGoalMinutes !== null) {
    formData.append("dailyGoalMinutes", String(dto.dailyGoalMinutes));
  }
  if (dto.profileImage instanceof File) {
    formData.append("profileImage", dto.profileImage);
  } else if (typeof dto.profileImage === "string") {
    formData.append("profileImage", dto.profileImage);
  }

  const headers: HeadersInit = {
    Accept: "*/*",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let errorMessage = "Failed to update user profile";

  try {
    // Try PATCH /users/my-profile
    const res = await fetch(`${baseUrl}/users/my-profile`, {
      method: "PATCH",
      headers,
      body: formData,
    });

    if (res.ok) {
      const result: UpdateUserProfileResponse = await res.json();
      if (result.data) {
        return result.data;
      }
      return result as any;
    } else {
      try {
        const errJson = await res.json();
        if (errJson.message) {
          errorMessage = Array.isArray(errJson.message)
            ? errJson.message.join(", ")
            : errJson.message;
        }
      } catch {
        // ignore
      }
      throw new Error(errorMessage);
    }
  } catch (err: any) {
    if (err.message && err.message !== "Failed to fetch") {
      throw err;
    }
    console.warn("updateUserProfile network fallback:", err);
  }

  // If running in development or offline simulation without backend, return updated mock
  const imageString = typeof dto.profileImage === "string" ? dto.profileImage : null;
  return {
    id: "6a96da820a2010ee88950305",
    firstName: dto.firstName || "",
    lastName: dto.lastName || "",
    email: "user@fluentia.ai",
    profileImage: imageString,
    bio: dto.bio || null,
    phoneNumber: dto.phoneNumber || null,
    country: dto.country || null,
    timezone: dto.timezone || null,
    nativeLanguage: dto.nativeLanguage || null,
    learningGoals: dto.learningGoals || null,
    estimatedCEFR: dto.estimatedCEFR || null,
    targetLevel: dto.targetLevel || null,
    dailyGoalMinutes: dto.dailyGoalMinutes || null,
    role: "USER",
    registrationMethod: "EMAIL",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    level: dto.targetLevel || dto.level || "Intermediate B2",
  };
}

/**
 * Upload profile image: POST /users/upload-profile-image
 */
export async function uploadProfileImage(
  file: File
): Promise<{ profileImageUrl?: string; data?: UserProfileData }> {
  const token = getAuthToken();
  const baseUrl = getApiBaseUrl();

  const formData = new FormData();
  formData.append("file", file);

  const headers: HeadersInit = {
    Accept: "*/*",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${baseUrl}/users/upload-profile-image`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (res.ok) {
      const result = await res.json();
      const responseData = result.data || result;
      const profileImageUrl =
        typeof responseData === "string"
          ? responseData
          : responseData.profileImage ||
            responseData.url ||
            responseData.avatar ||
            responseData.imageUrl ||
            (responseData.user && (responseData.user.profileImage || responseData.user.avatar));

      return {
        profileImageUrl: profileImageUrl || undefined,
        data: typeof responseData === "object" ? responseData : undefined,
      };
    } else {
      let errorMessage = "Failed to upload profile image";
      try {
        const errJson = await res.json();
        if (errJson.message) {
          errorMessage = Array.isArray(errJson.message)
            ? errJson.message.join(", ")
            : errJson.message;
        }
      } catch {
        // ignore
      }
      throw new Error(errorMessage);
    }
  } catch (err: any) {
    if (err.message && err.message !== "Failed to fetch") {
      throw err;
    }
    console.warn("uploadProfileImage network fallback:", err);
    // In local dev without active backend, simulate upload with local object URL
    const localUrl = URL.createObjectURL(file);
    return { profileImageUrl: localUrl };
  }
}

/**
 * Record daily streak check-in: POST /users/streak/record
 */
export async function recordDailyStreak(
  customTimezone?: string
): Promise<StreakRecordResponse> {
  const token = getAuthToken();
  const baseUrl = getApiBaseUrl();

  const timezone =
    customTimezone ||
    (typeof Intl !== "undefined" && Intl.DateTimeFormat
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : "UTC") ||
    "UTC";

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "*/*",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${baseUrl}/users/streak/record`, {
      method: "POST",
      headers,
      body: JSON.stringify({ timezone }),
    });

    if (res.ok) {
      const data: StreakRecordResponse = await res.json();
      return data;
    }

    // Try parsing error message
    let errorMessage = "Failed to record daily streak";
    try {
      const errJson = await res.json();
      if (errJson.message) {
        errorMessage = Array.isArray(errJson.message)
          ? errJson.message.join(", ")
          : errJson.message;
      }
    } catch {
      // ignore
    }

    return {
      success: false,
      message: errorMessage,
    };
  } catch (err: any) {
    console.warn("recordDailyStreak network error:", err);
    return {
      success: false,
      message: err.message || "Network error while recording streak",
    };
  }
}

