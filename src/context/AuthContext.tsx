"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  role?: string;
  level?: string;
  provider?: "email" | "google";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
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

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 600));

      if (!name || !email || !password) {
        return { success: false, error: "All fields are required." };
      }

      const newUser: User = {
        id: `user_${Date.now()}`,
        name: name.trim(),
        email: email.toLowerCase().trim(),
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

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      // Simulate authentic Google OAuth profile flow
      await new Promise((res) => setTimeout(res, 800));

      const googleUser: User = {
        id: `google_${Date.now()}`,
        name: "Google Learner",
        email: "learner.google@fluentia.ai",
        avatar: null,
        level: "Intermediate B2",
        role: "student",
        provider: "google",
      };

      saveUserSession(googleUser);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Google sign in failed" };
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
