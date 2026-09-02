"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  avatar?: string | null;
  role?: string;
  level?: string;
  provider?: "email" | "google";
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const res = await fetch(`${apiUrl}/auth/google-login`, {
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


  const logout = () => {
    saveUserSession(null);
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
