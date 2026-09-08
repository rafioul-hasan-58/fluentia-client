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
  recordDailyStreak,
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
  streakDays?: number;
  lastActiveDate?: string | null;
  longestStreak?: number;
  streakFreezeCount?: number;
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
  recordStreak: (customTimezone?: string) => Promise<{ success: boolean; streakDays?: number; message?: string; isNewDay?: boolean }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "fluentia_auth_user";

/**
 * Safely parse JWT payload without external dependencies
 */
function parseJwtPayload(token?: string | null): Record<string, any> | null {
  if (!token || typeof token !== "string") return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore user session on initial load and refresh latest real data from backend
  useEffect(() => {
    const initAuth = async () => {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        let parsedUser: User | null = null;
        if (stored) {
          try {
            parsedUser = JSON.parse(stored);
            // Self-heal "Google User" placeholder from stored email
            if (parsedUser && (parsedUser.name === "Google User" || parsedUser.name === "Google")) {
              if (parsedUser.email) {
                const nameFromEmail = parsedUser.email
                  .split("@")[0]
                  .replace(/[._0-9]/g, " ")
                  .trim()
                  .replace(/\b\w/g, (c: string) => c.toUpperCase());
                parsedUser.name = nameFromEmail || "Learner";
                parsedUser.firstName = nameFromEmail ? nameFromEmail.split(" ")[0] : "Learner";
                parsedUser.lastName = nameFromEmail ? nameFromEmail.split(" ").slice(1).join(" ") : "";
              }
            }
            setUser(parsedUser);
          } catch {
            // ignore
          }
        }

        const token = localStorage.getItem("fluentia_auth_token");
        const tokenPayload = parseJwtPayload(token);

        if (token || stored) {
          const profileData = await fetchUserProfile();
          if (profileData) {
            const rawName = (profileData as any).name;
            const fName =
              profileData.firstName && profileData.firstName !== "Google"
                ? profileData.firstName
                : (tokenPayload?.given_name || parsedUser?.firstName || "");
            const lName =
              profileData.lastName && profileData.lastName !== "Learner" && profileData.lastName !== "User"
                ? profileData.lastName
                : (tokenPayload?.family_name || parsedUser?.lastName || "");

            const emailName = profileData.email
              ? profileData.email
                  .split("@")[0]
                  .replace(/[._0-9]/g, " ")
                  .trim()
                  .replace(/\b\w/g, (c: string) => c.toUpperCase())
              : "";

            const fullName =
              fName || lName
                ? `${fName || ""} ${lName || ""}`.trim()
                : (rawName && rawName !== "Google User"
                    ? rawName
                    : (tokenPayload?.name || (parsedUser?.name && parsedUser.name !== "Google User" ? parsedUser.name : "") || emailName || "Learner"));

            const sDays = profileData.streakDays ?? profileData.profile?.streakDays ?? parsedUser?.streakDays ?? parsedUser?.profile?.streakDays ?? 0;
            const sLastActive = profileData.lastActiveDate ?? profileData.profile?.lastActiveDate ?? parsedUser?.lastActiveDate ?? parsedUser?.profile?.lastActiveDate ?? null;
            const sLongest = profileData.longestStreak ?? profileData.profile?.longestStreak ?? parsedUser?.longestStreak ?? parsedUser?.profile?.longestStreak ?? sDays;
            const sFreeze = profileData.streakFreezeCount ?? profileData.profile?.streakFreezeCount ?? parsedUser?.streakFreezeCount ?? 0;

            const updated: User = {
              id: profileData.id || parsedUser?.id || `user_${Date.now()}`,
              name: fullName,
              firstName: fName || (fullName ? fullName.split(" ")[0] : "Learner"),
              lastName: lName || (fullName ? fullName.split(" ").slice(1).join(" ") : ""),
              email: profileData.email || tokenPayload?.email || parsedUser?.email || "",
              avatar: profileData.profileImage || tokenPayload?.picture || parsedUser?.avatar || null,
              profileImage: profileData.profileImage || tokenPayload?.picture || parsedUser?.profileImage || null,
              bio: profileData.bio || null,
              phoneNumber: profileData.phoneNumber || null,
              country: profileData.country || null,
              timezone: profileData.timezone || null,
              streakDays: sDays,
              lastActiveDate: sLastActive,
              longestStreak: sLongest,
              streakFreezeCount: sFreeze,
              role: profileData.role || parsedUser?.role || "USER",
              level: profileData.level || parsedUser?.level || "Intermediate B2",
              provider: profileData.registrationMethod === "GOOGLE" ? "google" : (parsedUser?.provider || "email"),
              registrationMethod: profileData.registrationMethod || parsedUser?.registrationMethod || "EMAIL",
              createdAt: profileData.createdAt,
              updatedAt: profileData.updatedAt,
              profile: {
                ...(profileData.profile || {}),
                streakDays: sDays,
                lastActiveDate: sLastActive,
                longestStreak: sLongest,
                streakFreezeCount: sFreeze,
              },
            };
            setUser(updated);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));

            // Auto-record streak for the active day once per calendar date
            const tz =
              profileData.timezone ||
              (typeof Intl !== "undefined" && Intl.DateTimeFormat
                ? Intl.DateTimeFormat().resolvedOptions().timeZone
                : "UTC") ||
              "UTC";
            const todayKey = `fluentia_streak_sync_${updated.id}_${new Date().toISOString().slice(0, 10)}`;
            if (token && typeof window !== "undefined" && !sessionStorage.getItem(todayKey)) {
              sessionStorage.setItem(todayKey, "1");
              recordDailyStreak(tz)
                .then((res) => {
                  if (res?.data) {
                    const resData: any = res.data;
                    const liveStreak =
                      typeof resData.streakDays === "number"
                        ? resData.streakDays
                        : typeof (resData.user?.streakDays) === "number"
                        ? resData.user.streakDays
                        : typeof (resData.user?.profile?.streakDays) === "number"
                        ? resData.user.profile.streakDays
                        : undefined;
                    const liveLongest =
                      typeof resData.longestStreak === "number"
                        ? resData.longestStreak
                        : typeof (resData.user?.longestStreak) === "number"
                        ? resData.user.longestStreak
                        : undefined;
                    const liveLastActive = resData.lastActiveDate || resData.user?.lastActiveDate;

                    if (liveStreak !== undefined) {
                      setUser((curr) => {
                        if (!curr) return null;
                        const syncUser: User = {
                          ...curr,
                          streakDays: liveStreak,
                          lastActiveDate: liveLastActive || curr.lastActiveDate,
                          longestStreak: liveLongest ?? curr.longestStreak,
                          profile: {
                            ...(curr.profile || {}),
                            streakDays: liveStreak,
                            lastActiveDate: liveLastActive || curr.profile?.lastActiveDate,
                            longestStreak: liveLongest ?? curr.profile?.longestStreak,
                          },
                        };
                        saveUserSession(syncUser);
                        return syncUser;
                      });
                    }
                  }
                })
                .catch(() => {});
            }
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

      const sDays = userPayload.streakDays ?? userPayload.profile?.streakDays ?? 0;
      const sLastActive = userPayload.lastActiveDate ?? userPayload.profile?.lastActiveDate ?? null;
      const sLongest = userPayload.longestStreak ?? userPayload.profile?.longestStreak ?? sDays;
      const sFreeze = userPayload.streakFreezeCount ?? userPayload.profile?.streakFreezeCount ?? 0;

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
        streakDays: sDays,
        lastActiveDate: sLastActive,
        longestStreak: sLongest,
        streakFreezeCount: sFreeze,
        role: userPayload.role || "USER",
        level: userPayload.level || userPayload.targetLevel || "Intermediate B2",
        provider: userPayload.registrationMethod === "GOOGLE" ? "google" : "email",
        registrationMethod: userPayload.registrationMethod || "EMAIL",
        createdAt: userPayload.createdAt,
        updatedAt: userPayload.updatedAt,
        profile: {
          ...(userPayload.profile || {}),
          streakDays: sDays,
          lastActiveDate: sLastActive,
          longestStreak: sLongest,
          streakFreezeCount: sFreeze,
        },
      };

      saveUserSession(loggedInUser);

      // Trigger daily streak sync in background upon login
      const tz =
        userPayload.timezone ||
        (typeof Intl !== "undefined" && Intl.DateTimeFormat
          ? Intl.DateTimeFormat().resolvedOptions().timeZone
          : "UTC") ||
        "UTC";
      recordDailyStreak(tz)
        .then((res) => {
          if (res?.data) {
            const resData: any = res.data;
            const liveStreak =
              typeof resData.streakDays === "number"
                ? resData.streakDays
                : typeof (resData.user?.streakDays) === "number"
                ? resData.user.streakDays
                : typeof (resData.user?.profile?.streakDays) === "number"
                ? resData.user.profile.streakDays
                : undefined;
            const liveLongest =
              typeof resData.longestStreak === "number"
                ? resData.longestStreak
                : typeof (resData.user?.longestStreak) === "number"
                ? resData.user.longestStreak
                : undefined;
            const liveLastActive = resData.lastActiveDate || resData.user?.lastActiveDate;

            if (liveStreak !== undefined) {
              setUser((curr) => {
                if (!curr) return null;
                const syncUser: User = {
                  ...curr,
                  streakDays: liveStreak,
                  lastActiveDate: liveLastActive || curr.lastActiveDate,
                  longestStreak: liveLongest ?? curr.longestStreak,
                  profile: {
                    ...(curr.profile || {}),
                    streakDays: liveStreak,
                    lastActiveDate: liveLastActive || curr.profile?.lastActiveDate,
                    longestStreak: liveLongest ?? curr.profile?.longestStreak,
                  },
                };
                saveUserSession(syncUser);
                return syncUser;
              });
            }
          }
        })
        .catch(() => {});

      // Hydrate additional profile details from /users/my-profile in the background
      try {
        const fullProfile = await fetchUserProfile();
        if (fullProfile) {
          const mergedName = (fullProfile.firstName || fullProfile.lastName)
            ? `${fullProfile.firstName || ""} ${fullProfile.lastName || ""}`.trim()
            : loggedInUser.name;

          const pStreak = fullProfile.streakDays ?? fullProfile.profile?.streakDays ?? loggedInUser.streakDays ?? 0;
          const pLastActive = fullProfile.lastActiveDate ?? fullProfile.profile?.lastActiveDate ?? loggedInUser.lastActiveDate;
          const pLongest = fullProfile.longestStreak ?? fullProfile.profile?.longestStreak ?? loggedInUser.longestStreak;

          loggedInUser = {
            ...loggedInUser,
            ...fullProfile,
            name: mergedName,
            avatar: fullProfile.profileImage || loggedInUser.avatar,
            profileImage: fullProfile.profileImage || loggedInUser.profileImage,
            streakDays: pStreak,
            lastActiveDate: pLastActive,
            longestStreak: pLongest,
            profile: {
              ...(fullProfile.profile || {}),
              streakDays: pStreak,
              lastActiveDate: pLastActive,
              longestStreak: pLongest,
            },
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
      // Decode Google ID token to extract authentic user profile directly from Google
      const googleProfile = parseJwtPayload(googleCredential);
      const googleFullName =
        googleProfile?.name ||
        (googleProfile?.given_name
          ? `${googleProfile.given_name} ${googleProfile.family_name || ""}`.trim()
          : null);
      const googleFirstName =
        googleProfile?.given_name || (googleFullName ? googleFullName.split(" ")[0] : "");
      const googleLastName =
        googleProfile?.family_name ||
        (googleFullName ? googleFullName.split(" ").slice(1).join(" ") : "");
      const googlePicture = googleProfile?.picture || null;
      const googleEmail = googleProfile?.email || "";

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

      const resData = data.data || data;
      const backendUser = data.user || resData.user || (resData.id ? resData : null) || {};

      const finalFirstName =
        backendUser.firstName && backendUser.firstName !== "Google"
          ? backendUser.firstName
          : googleFirstName || (backendUser.name && backendUser.name !== "Google User" ? backendUser.name.split(" ")[0] : "") || (googleEmail ? googleEmail.split("@")[0] : "Learner");

      const finalLastName =
        backendUser.lastName && backendUser.lastName !== "Learner" && backendUser.lastName !== "User"
          ? backendUser.lastName
          : googleLastName || (backendUser.name && backendUser.name !== "Google User" ? backendUser.name.split(" ").slice(1).join(" ") : "");

      const finalFullName =
        backendUser.name && backendUser.name !== "Google User"
          ? backendUser.name
          : googleFullName || ((finalFirstName || finalLastName) ? `${finalFirstName} ${finalLastName}`.trim() : (googleEmail ? googleEmail.split("@")[0] : "Learner"));

      const finalAvatar =
        backendUser.profileImage ||
        backendUser.avatar ||
        backendUser.picture ||
        googlePicture ||
        null;

      const finalEmail = backendUser.email || googleEmail || "";

      const sDays = backendUser.streakDays ?? backendUser.profile?.streakDays ?? 0;
      const sLastActive = backendUser.lastActiveDate ?? backendUser.profile?.lastActiveDate ?? null;
      const sLongest = backendUser.longestStreak ?? backendUser.profile?.longestStreak ?? sDays;
      const sFreeze = backendUser.streakFreezeCount ?? backendUser.profile?.streakFreezeCount ?? 0;

      // Extract user and token from backend response
      const authenticatedUser: User = {
        id: backendUser.id || data.id || googleProfile?.sub || `google_${Date.now()}`,
        name: finalFullName,
        firstName: finalFirstName,
        lastName: finalLastName,
        email: finalEmail,
        avatar: finalAvatar,
        profileImage: finalAvatar,
        streakDays: sDays,
        lastActiveDate: sLastActive,
        longestStreak: sLongest,
        streakFreezeCount: sFreeze,
        role: backendUser.role || data.role || "USER",
        level: backendUser.level || backendUser.estimatedCEFR || "Intermediate B2",
        provider: "google",
        registrationMethod: "GOOGLE",
        profile: {
          ...(backendUser.profile || {}),
          streakDays: sDays,
          lastActiveDate: sLastActive,
          longestStreak: sLongest,
          streakFreezeCount: sFreeze,
        },
      };

      const token =
        data.accessToken ||
        data.access_token ||
        data.token ||
        (data.data && (data.data.accessToken || data.data.token || data.data.access_token));

      saveUserSession(authenticatedUser);
      if (token) {
        localStorage.setItem("fluentia_auth_token", token);
      }

      // Trigger daily streak sync in background upon Google login
      const tz =
        backendUser.timezone ||
        (typeof Intl !== "undefined" && Intl.DateTimeFormat
          ? Intl.DateTimeFormat().resolvedOptions().timeZone
          : "UTC") ||
        "UTC";
      recordDailyStreak(tz)
        .then((res) => {
          if (res?.data) {
            const resData: any = res.data;
            const liveStreak =
              typeof resData.streakDays === "number"
                ? resData.streakDays
                : typeof (resData.user?.streakDays) === "number"
                ? resData.user.streakDays
                : typeof (resData.user?.profile?.streakDays) === "number"
                ? resData.user.profile.streakDays
                : undefined;
            const liveLongest =
              typeof resData.longestStreak === "number"
                ? resData.longestStreak
                : typeof (resData.user?.longestStreak) === "number"
                ? resData.user.longestStreak
                : undefined;
            const liveLastActive = resData.lastActiveDate || resData.user?.lastActiveDate;

            if (liveStreak !== undefined) {
              setUser((curr) => {
                if (!curr) return null;
                const syncUser: User = {
                  ...curr,
                  streakDays: liveStreak,
                  lastActiveDate: liveLastActive || curr.lastActiveDate,
                  longestStreak: liveLongest ?? curr.longestStreak,
                  profile: {
                    ...(curr.profile || {}),
                    streakDays: liveStreak,
                    lastActiveDate: liveLastActive || curr.profile?.lastActiveDate,
                    longestStreak: liveLongest ?? curr.profile?.longestStreak,
                  },
                };
                saveUserSession(syncUser);
                return syncUser;
              });
            }
          }
        })
        .catch(() => {});

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

          const sDays = profileData.streakDays ?? profileData.profile?.streakDays ?? prev?.streakDays ?? 0;
          const sLastActive = profileData.lastActiveDate ?? profileData.profile?.lastActiveDate ?? prev?.lastActiveDate ?? null;
          const sLongest = profileData.longestStreak ?? profileData.profile?.longestStreak ?? prev?.longestStreak ?? sDays;
          const sFreeze = profileData.streakFreezeCount ?? profileData.profile?.streakFreezeCount ?? prev?.streakFreezeCount ?? 0;

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
            streakDays: sDays,
            lastActiveDate: sLastActive,
            longestStreak: sLongest,
            streakFreezeCount: sFreeze,
            role: profileData.role || prev?.role || "USER",
            level: profileData.level || prev?.level || "Intermediate B2",
            provider: prev?.provider || (profileData.registrationMethod === "GOOGLE" ? "google" : "email"),
            registrationMethod: profileData.registrationMethod || (prev?.provider === "google" ? "GOOGLE" : "EMAIL"),
            createdAt: profileData.createdAt || prev?.createdAt,
            updatedAt: profileData.updatedAt || prev?.updatedAt,
            profile: {
              ...(profileData.profile || prev?.profile || {}),
              streakDays: sDays,
              lastActiveDate: sLastActive,
              longestStreak: sLongest,
              streakFreezeCount: sFreeze,
            },
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

  const recordStreak = async (
    customTimezone?: string
  ): Promise<{ success: boolean; streakDays?: number; message?: string; isNewDay?: boolean }> => {
    try {
      const tz =
        customTimezone ||
        user?.timezone ||
        (typeof Intl !== "undefined" && Intl.DateTimeFormat
          ? Intl.DateTimeFormat().resolvedOptions().timeZone
          : "UTC") ||
        "UTC";

      const res = await recordDailyStreak(tz);
      if (res && (res.success || res.data)) {
        const streakData: any = res.data || res;
        const newStreakDays =
          typeof streakData.streakDays === "number"
            ? streakData.streakDays
            : typeof (streakData.user?.streakDays) === "number"
            ? streakData.user.streakDays
            : typeof (streakData.user?.profile?.streakDays) === "number"
            ? streakData.user.profile.streakDays
            : undefined;

        const newLastActiveDate =
          streakData.lastActiveDate ||
          streakData.user?.lastActiveDate ||
          new Date().toISOString();

        const newLongestStreak =
          typeof streakData.longestStreak === "number"
            ? streakData.longestStreak
            : typeof (streakData.user?.longestStreak) === "number"
            ? streakData.user.longestStreak
            : undefined;

        setUser((prev) => {
          if (!prev) return null;
          const currentStreak = newStreakDays !== undefined ? newStreakDays : (prev.streakDays || 0) + 1;
          const updated: User = {
            ...prev,
            streakDays: currentStreak,
            lastActiveDate: newLastActiveDate,
            longestStreak: newLongestStreak !== undefined ? newLongestStreak : Math.max(prev.longestStreak || 0, currentStreak),
            profile: {
              ...(prev.profile || {}),
              streakDays: currentStreak,
              lastActiveDate: newLastActiveDate,
              longestStreak: newLongestStreak !== undefined ? newLongestStreak : Math.max(prev.profile?.longestStreak || 0, currentStreak),
            },
          };
          saveUserSession(updated);
          return updated;
        });

        return {
          success: true,
          streakDays: newStreakDays,
          message: res.message || "Streak check-in successful!",
          isNewDay: streakData.isNewDay ?? true,
        };
      }

      return {
        success: false,
        message: res?.message || "Could not record streak",
      };
    } catch (err: any) {
      console.warn("recordStreak error:", err);
      return {
        success: false,
        message: err.message || "Failed to record streak",
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
        recordStreak,
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
