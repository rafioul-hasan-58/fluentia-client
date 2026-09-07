"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

import {
  UserProfileData,
  UpdateUserProfileDto,
} from "@/types/user";
import {
  fetchUserProfile,
  updateUserProfile as apiUpdateUserProfile,
  uploadProfileImage as apiUploadProfileImage,
  getApiBaseUrl,
} from "@/lib/api";

export interface User {
  id: string;
  name: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  avatar?: string | null;
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
  level?: string;
  provider?: "email" | "google";
  registrationMethod?: string;
  createdAt?: string;
  updatedAt?: string;
  profile?: Record<string, any> | null;
}

export interface RegisterParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  register: (params: RegisterParams | { name: string; email: string; password: string }) => Promise<{ success: boolean; user?: User; error?: string }>;
  loginWithGoogle: (googleCredential: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  updateUser: (userData: Partial<User>) => void;
  updateProfile: (dto: UpdateUserProfileDto) => Promise<{ success: boolean; data?: User; error?: string }>;
  uploadAvatar: (file: File) => Promise<{ success: boolean; profileImageUrl?: string; error?: string }>;
  refreshProfile: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "fluentia_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore user session on initial load and refresh latest real data from backend
  useEffect(() => {
    const initAuth = async () => {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        }

        const token = localStorage.getItem("fluentia_auth_token");
        if (token || stored) {
          const profileData = await fetchUserProfile();
          if (profileData) {
            const fullName = profileData.firstName || profileData.lastName
              ? `${profileData.firstName || ""} ${profileData.lastName || ""}`.trim()
              : "Learner";

            const updated: User = {
              id: profileData.id || `user_${Date.now()}`,
              name: fullName,
              firstName: profileData.firstName,
              lastName: profileData.lastName,
              email: profileData.email || "",
              avatar: profileData.profileImage || null,
              profileImage: profileData.profileImage || null,
              bio: profileData.bio || null,
              phoneNumber: profileData.phoneNumber || null,
              country: profileData.country || null,
              timezone: profileData.timezone || null,
              role: profileData.role || "USER",
              level: profileData.level || "Intermediate B2",
              provider: profileData.registrationMethod === "GOOGLE" ? "google" : "email",
              registrationMethod: profileData.registrationMethod || "EMAIL",
              createdAt: profileData.createdAt,
              updatedAt: profileData.updatedAt,
              profile: profileData.profile || null,
            };
            setUser(updated);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
          }
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const saveUserSession = (userData: User | null) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    setIsLoading(true);
    try {
      if (!email || !password) {
        return { success: false, error: "Please enter your email and password." };
      }

      const url = `${getApiBaseUrl()}/auth/login`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        let errMessage = "Invalid credentials";
        if (data.message) {
          errMessage = Array.isArray(data.message) ? data.message.join(", ") : data.message;
        }
        throw new Error(errMessage);
      }

      // Extract token from backend response
      const token =
        data.accessToken ||
        data.access_token ||
        data.token ||
        (data.data && (data.data.accessToken || data.data.token || data.data.access_token));

      if (token) {
        localStorage.setItem("fluentia_auth_token", token);
      }

      // Extract user payload
      const userPayload = data.user || (data.data && data.data.user) || data.data || data;
      const fName = userPayload.firstName || "";
      const lName = userPayload.lastName || "";
      const fullName = (fName || lName)
        ? `${fName} ${lName}`.trim()
        : userPayload.name || email.split("@")[0];

      let loggedInUser: User = {
        id: userPayload.id || `user_${Date.now()}`,
        name: fullName || "Learner",
        firstName: userPayload.firstName || null,
        lastName: userPayload.lastName || null,
        email: (userPayload.email || email).toLowerCase().trim(),
        avatar: userPayload.profileImage || userPayload.avatar || null,
        profileImage: userPayload.profileImage || userPayload.avatar || null,
        bio: userPayload.bio || null,
        phoneNumber: userPayload.phoneNumber || null,
        country: userPayload.country || null,
        timezone: userPayload.timezone || null,
        nativeLanguage: userPayload.nativeLanguage || null,
        learningGoals: userPayload.learningGoals || null,
        estimatedCEFR: userPayload.estimatedCEFR || null,
        targetLevel: userPayload.targetLevel || null,
        dailyGoalMinutes: userPayload.dailyGoalMinutes || 15,
        role: userPayload.role || "USER",
        level: userPayload.level || userPayload.targetLevel || "Intermediate B2",
        provider: userPayload.registrationMethod === "GOOGLE" ? "google" : "email",
        registrationMethod: userPayload.registrationMethod || "EMAIL",
        createdAt: userPayload.createdAt,
        updatedAt: userPayload.updatedAt,
        profile: userPayload.profile || null,
      };

      saveUserSession(loggedInUser);

      // Hydrate additional profile details from /users/my-profile in the background
      try {
        const fullProfile = await fetchUserProfile();
        if (fullProfile) {
          const mergedName = (fullProfile.firstName || fullProfile.lastName)
            ? `${fullProfile.firstName || ""} ${fullProfile.lastName || ""}`.trim()
            : loggedInUser.name;

          loggedInUser = {
            ...loggedInUser,
            ...fullProfile,
            name: mergedName,
            avatar: fullProfile.profileImage || loggedInUser.avatar,
            profileImage: fullProfile.profileImage || loggedInUser.profileImage,
          };
          saveUserSession(loggedInUser);
        }
      } catch {
        // non-blocking
      }

      return { success: true, user: loggedInUser };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to log in" };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    params: RegisterParams | { name: string; email: string; password: string }
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    setIsLoading(true);
    try {
      let fName = "";
      let lName = "";

      if ("firstName" in params) {
        fName = params.firstName.trim();
        lName = params.lastName.trim();
      } else {
        const parts = params.name.trim().split(" ");
        fName = parts[0] || "";
        lName = parts.slice(1).join(" ") || "";
      }

      if (!fName || !params.email || !params.password) {
        return { success: false, error: "All fields are required." };
      }

      const url = `${getApiBaseUrl()}/auth/register`;
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
          body: JSON.stringify({
            firstName: fName,
            lastName: lName,
            email: params.email.trim().toLowerCase(),
            password: params.password,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          const token =
            data.accessToken ||
            data.access_token ||
            data.token ||
            (data.data && (data.data.accessToken || data.data.token || data.data.access_token));

          if (token) {
            localStorage.setItem("fluentia_auth_token", token);
          } else {
            // Auto-authenticate with login endpoint if token not returned in register response
            return await login(params.email, params.password);
          }

          const userPayload = data.user || (data.data && data.data.user) || data.data || data;
          let registeredUser: User = {
            id: userPayload.id || `user_${Date.now()}`,
            name: `${fName} ${lName}`.trim(),
            firstName: fName,
            lastName: lName,
            email: params.email.toLowerCase().trim(),
            avatar: userPayload.profileImage || userPayload.avatar || null,
            profileImage: userPayload.profileImage || userPayload.avatar || null,
            level: "Beginner A1",
            role: userPayload.role || "USER",
            provider: "email",
          };

          saveUserSession(registeredUser);

          // Hydrate profile in background
          try {
            const fullProfile = await fetchUserProfile();
            if (fullProfile) {
              registeredUser = {
                ...registeredUser,
                ...fullProfile,
                name: `${fullProfile.firstName || fName} ${fullProfile.lastName || lName}`.trim(),
              };
              saveUserSession(registeredUser);
            }
          } catch {
            // non-blocking
          }

          return { success: true, user: registeredUser };
        } else {
          let errMessage = "Failed to create account";
          if (data.message) {
            errMessage = Array.isArray(data.message) ? data.message.join(", ") : data.message;
          }
          throw new Error(errMessage);
        }
      } catch (apiErr: any) {
        if (apiErr.message && apiErr.message !== "Failed to fetch") {
          throw apiErr;
        }
        // Fallback local registration if server unreachable
        const newUser: User = {
          id: `user_${Date.now()}`,
          name: `${fName} ${lName}`.trim(),
          firstName: fName,
          lastName: lName,
          email: params.email.toLowerCase().trim(),
          avatar: null,
          level: "Beginner A1",
          role: "USER",
          provider: "email",
        };
        saveUserSession(newUser);
        return { success: true, user: newUser };
      }
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to create account" };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (googleCredential: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    setIsLoading(true);
    try {
      const url = `${getApiBaseUrl()}/auth/google-login`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: googleCredential,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to authenticate with Google");
      }

      // Extract user and token from backend response
      const authenticatedUser: User = data.user || (data.data && data.data.user) || {
        id: data.id || `google_${Date.now()}`,
        name: data.name || (data.firstName ? `${data.firstName} ${data.lastName || ""}`.trim() : "Google User"),
        firstName: data.firstName || "Google",
        lastName: data.lastName || "Learner",
        email: data.email || "",
        avatar: data.avatar || data.picture || null,
        role: data.role || "student",
        level: data.level || "Intermediate B2",
        provider: "google",
      };

      const token = data.accessToken || data.access_token || data.token || (data.data && (data.data.accessToken || data.data.token));

      saveUserSession(authenticatedUser);
      if (token) {
        localStorage.setItem("fluentia_auth_token", token);
      }
      return { success: true, user: authenticatedUser };
    } catch (err: any) {
      return { success: false, error: err.message || "Google sign-in failed" };
    } finally {
      setIsLoading(false);
    }
  };


  const updateUser = (userData: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated: User = {
        ...prev,
        ...userData,
        name:
          userData.name ||
          (userData.firstName || userData.lastName
            ? `${userData.firstName || prev.firstName || ""} ${userData.lastName || prev.lastName || ""}`.trim()
            : prev.name),
        avatar: userData.profileImage !== undefined ? userData.profileImage : (userData.avatar !== undefined ? userData.avatar : prev.avatar),
      };
      saveUserSession(updated);
      return updated;
    });
  };

  const refreshProfile = async () => {
    try {
      const profileData = await fetchUserProfile();
      if (profileData) {
        setUser((prev) => {
          const fullName = profileData.firstName || profileData.lastName
            ? `${profileData.firstName || ""} ${profileData.lastName || ""}`.trim()
            : (prev?.name || "Learner");

          const updated: User = {
            id: profileData.id || prev?.id || `user_${Date.now()}`,
            name: fullName,
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            email: profileData.email || prev?.email || "",
            avatar: profileData.profileImage || prev?.avatar || null,
            profileImage: profileData.profileImage || null,
            bio: profileData.bio || null,
            phoneNumber: profileData.phoneNumber || null,
            country: profileData.country || null,
            timezone: profileData.timezone || null,
            role: profileData.role || prev?.role || "USER",
            level: profileData.level || prev?.level || "Intermediate B2",
            provider: prev?.provider || (profileData.registrationMethod === "GOOGLE" ? "google" : "email"),
            registrationMethod: profileData.registrationMethod || (prev?.provider === "google" ? "GOOGLE" : "EMAIL"),
            createdAt: profileData.createdAt || prev?.createdAt,
            updatedAt: profileData.updatedAt || prev?.updatedAt,
            profile: profileData.profile || prev?.profile || null,
          };
          saveUserSession(updated);
          return updated;
        });
      }
    } catch (err) {
      console.warn("Could not refresh profile from server:", err);
    }
  };

  const updateProfile = async (
    dto: UpdateUserProfileDto
  ): Promise<{ success: boolean; data?: User; error?: string }> => {
    setIsLoading(true);
    try {
      const responseData = await apiUpdateUserProfile(dto);
      const fullName = (dto.firstName !== undefined || dto.lastName !== undefined)
        ? `${dto.firstName ?? user?.firstName ?? ""} ${dto.lastName ?? user?.lastName ?? ""}`.trim()
        : user?.name || "Learner";

      const imageStr =
        dto.profileImage instanceof File
          ? responseData.profileImage || user?.profileImage || user?.avatar || null
          : dto.profileImage !== undefined
          ? dto.profileImage
          : responseData.profileImage || user?.profileImage || user?.avatar || null;

      const updatedUser: User = {
        ...(user || {
          id: responseData.id || `user_${Date.now()}`,
          email: responseData.email || "user@fluentia.ai",
        }),
        ...responseData,
        name: fullName || "Learner",
        firstName: dto.firstName !== undefined ? dto.firstName : responseData.firstName,
        lastName: dto.lastName !== undefined ? dto.lastName : responseData.lastName,
        profileImage: imageStr,
        avatar: imageStr,
        bio: dto.bio !== undefined ? dto.bio : responseData.bio,
        phoneNumber: dto.phoneNumber !== undefined ? dto.phoneNumber : responseData.phoneNumber,
        country: dto.country !== undefined ? dto.country : responseData.country,
        timezone: dto.timezone !== undefined ? dto.timezone : responseData.timezone,
        nativeLanguage: dto.nativeLanguage !== undefined ? dto.nativeLanguage : responseData.nativeLanguage,
        learningGoals: dto.learningGoals !== undefined ? dto.learningGoals : responseData.learningGoals,
        estimatedCEFR: dto.estimatedCEFR !== undefined ? dto.estimatedCEFR : responseData.estimatedCEFR,
        targetLevel: dto.targetLevel !== undefined ? dto.targetLevel : responseData.targetLevel,
        dailyGoalMinutes: dto.dailyGoalMinutes !== undefined ? dto.dailyGoalMinutes : responseData.dailyGoalMinutes,
        level: (dto.targetLevel || dto.level || responseData.level || user?.level) || "Intermediate B2",
        updatedAt: responseData.updatedAt || new Date().toISOString(),
      };

      saveUserSession(updatedUser);
      return { success: true, data: updatedUser };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Failed to update profile settings.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const uploadAvatar = async (
    file: File
  ): Promise<{ success: boolean; profileImageUrl?: string; error?: string }> => {
    try {
      const { profileImageUrl, data } = await apiUploadProfileImage(file);
      if (profileImageUrl) {
        setUser((prev) => {
          if (!prev) return null;
          const updated: User = {
            ...prev,
            ...(data || {}),
            avatar: profileImageUrl,
            profileImage: profileImageUrl,
            updatedAt: data?.updatedAt || new Date().toISOString(),
          };
          saveUserSession(updated);
          return updated;
        });
        return { success: true, profileImageUrl };
      }
      return { success: false, error: "Image upload did not return a valid URL" };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Failed to upload image file.",
      };
    }
  };

  const logout = () => {
    saveUserSession(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("fluentia_auth_token");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginWithGoogle,
        updateUser,
        updateProfile,
        uploadAvatar,
        refreshProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
