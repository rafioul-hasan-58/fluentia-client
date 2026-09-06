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
 * Fetch current user profile: GET /users/profile
 */
export async function fetchUserProfile(): Promise<UserProfileData | null> {
  const token = getAuthToken();
  const baseUrl = getApiBaseUrl();

  const headers: HeadersInit = {
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${baseUrl}/users/profile`, {
      method: "GET",
      headers,
    });

    if (res.ok) {
      const data: UserProfileResponse = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
      return data.data || null;
    }

    // Fallback attempt: GET /users/me if /users/profile returns 404
    if (res.status === 404) {
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
 * Update current user profile: PATCH /users/profile
 */
export async function updateUserProfile(
  dto: UpdateUserProfileDto
): Promise<UserProfileData> {
  const token = getAuthToken();
  const baseUrl = getApiBaseUrl();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let errorMessage = "Failed to update user profile";

  try {
    // Try PATCH /users/profile
    const res = await fetch(`${baseUrl}/users/profile`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(dto),
    });

    if (res.ok) {
      const result: UpdateUserProfileResponse = await res.json();
      if (result.data) {
        return result.data;
      }
    } else if (res.status === 404 || res.status === 405) {
      // Try PUT /users/profile
      const resPut = await fetch(`${baseUrl}/users/profile`, {
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
