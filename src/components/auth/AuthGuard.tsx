"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function AuthGuard({ children, redirectTo = "/login" }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  const [hasChecked, setHasChecked] = useState(() => !isLoading && isAuthenticated);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        const fullPath =
          typeof window !== "undefined"
            ? `${pathname || "/dashboard/user"}${window.location.search || ""}`
            : pathname || "/dashboard/user";

        const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(fullPath)}`;
        router.replace(redirectUrl);
      } else {
        setHasChecked(true);
      }
    }
  }, [isLoading, isAuthenticated, pathname, redirectTo, router]);

  // Loading screen while verifying authentication or waiting for redirect
  if (isLoading || !hasChecked || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-4 text-ink transition-colors duration-200">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 dark:bg-purple-600/20 border border-primary/30 flex items-center justify-center animate-pulse">
            <Image
              src="/logo.png"
              alt="Fluentia"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
          <div className="absolute -inset-2 bg-primary/20 dark:bg-purple-500/20 rounded-2xl blur-lg -z-10 animate-pulse" />
        </div>
        <div className="flex items-center gap-2.5 text-sm font-semibold text-ink">
          <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Verifying authentication...</span>
        </div>
        <p className="text-xs text-ink-soft mt-1">Please wait while we secure your session</p>
      </div>
    );
  }

  return <>{children}</>;
}
