"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

import {
  UserProfileData,
  UpdateUserProfileDto,
} from "@/types/user";
import { fetchUserProfile, updateUserProfile as apiUpdateUserProfile } from "@/lib/api/user";

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
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (params: RegisterParams | { name: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (googleCredential: string) => Promise<{ success: boolean; error?: string }>;
  updateUser: (userData: Partial<User>) => void;
  updateProfile: (dto: UpdateUserProfileDto) => Promise<{ success: boolean; data?: User; error?: string }>;
  refreshProfile: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "fluentia_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore user session on initial load
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveUserSession = (userData: User | null) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      // Simulate network authentication
      await new Promise((res) => setTimeout(res, 600));

      if (!email || !password) {
        return { success: false, error: "Please enter your email and password." };
      }

      if (password.length < 4) {
        return { success: false, error: "Invalid password. Must be at least 4 characters." };
      }

      const derivedName = email.split("@")[0].replace(/[._-]/g, " ");
      const formattedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);

      const loggedInUser: User = {
        id: `user_${Date.now()}`,
        name: formattedName || "Learner",
        email: email.toLowerCase(),
        avatar: null,
        level: "Intermediate B2",
        role: "student",
        provider: "email",
      };

      saveUserSession(loggedInUser);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to log in" };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    params: RegisterParams | { name: string; email: string; password: string }
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 600));

      let fullName = "";
      let fName = "";
      let lName = "";

      if ("firstName" in params) {
        fName = params.firstName.trim();
        lName = params.lastName.trim();
        fullName = `${fName} ${lName}`.trim();
      } else {
        fullName = params.name.trim();
        const parts = fullName.split(" ");
        fName = parts[0] || "";
        lName = parts.slice(1).join(" ") || "";
      }

      if (!fullName || !params.email || !params.password) {
        return { success: false, error: "All fields are required." };
      }

      const newUser: User = {
        id: `user_${Date.now()}`,
        name: fullName,
        firstName: fName,
        lastName: lName,
        email: params.email.toLowerCase().trim(),
        avatar: null,
        level: "Beginner A1",
        role: "student",
        provider: "email",
      };

      saveUserSession(newUser);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to create account" };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (googleCredential: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/auth/google-login`;
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
      return { success: true };
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

      const updatedUser: User = {
        ...(user || {
          id: responseData.id || `user_${Date.now()}`,
          email: responseData.email || "user@fluentia.ai",
        }),
        ...responseData,
        name: fullName || "Learner",
        firstName: dto.firstName !== undefined ? dto.firstName : responseData.firstName,
        lastName: dto.lastName !== undefined ? dto.lastName : responseData.lastName,
        profileImage: dto.profileImage !== undefined ? dto.profileImage : responseData.profileImage,
        avatar: dto.profileImage !== undefined ? dto.profileImage : (responseData.profileImage || user?.avatar || null),
        bio: dto.bio !== undefined ? dto.bio : responseData.bio,
        phoneNumber: dto.phoneNumber !== undefined ? dto.phoneNumber : responseData.phoneNumber,
        country: dto.country !== undefined ? dto.country : responseData.country,
        timezone: dto.timezone !== undefined ? dto.timezone : responseData.timezone,
        level: dto.level !== undefined ? dto.level : (responseData.level || user?.level),
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
