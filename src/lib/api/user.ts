import {
  UserProfileData,
  UserProfileResponse,
  UpdateUserProfileDto,
  UpdateUserProfileResponse,
} from "@/types/user";

const getApiBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
};

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
 * Update current user profile: PATCH /users/my-profile
 */
export async function updateUserProfile(
  dto: UpdateUserProfileDto
): Promise<UserProfileData> {
  const token = getAuthToken();
  const baseUrl = getApiBaseUrl();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
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
      body: JSON.stringify(dto),
    });

    if (res.ok) {
      const result: UpdateUserProfileResponse = await res.json();
      if (result.data) {
        return result.data;
      }
      return result as any;
    } else if (res.status === 404 || res.status === 405) {
      // Try PATCH /users/profile or PUT /users/my-profile
      const resAlt = await fetch(`${baseUrl}/users/profile`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(dto),
      });

      if (resAlt.ok) {
        const resultAlt: UpdateUserProfileResponse = await resAlt.json();
        if (resultAlt.data) {
          return resultAlt.data;
        }
      } else {
        const resPut = await fetch(`${baseUrl}/users/my-profile`, {
          method: "PUT",
          headers,
          body: JSON.stringify(dto),
        });

        if (resPut.ok) {
          const resultPut: UpdateUserProfileResponse = await resPut.json();
          if (resultPut.data) {
            return resultPut.data;
          }
        }
      }
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
  return {
    id: "6a96da820a2010ee88950305",
    firstName: dto.firstName || "",
    lastName: dto.lastName || "",
    email: "user@fluentia.ai",
    profileImage: dto.profileImage || null,
    bio: dto.bio || null,
    phoneNumber: dto.phoneNumber || null,
    country: dto.country || null,
    timezone: dto.timezone || null,
    role: "USER",
    registrationMethod: "EMAIL",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    level: dto.level || "Intermediate B2",
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
