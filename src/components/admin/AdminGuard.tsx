"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        const redirectUrl = `/login?redirect=${encodeURIComponent(pathname || "/admin")}`;
        router.push(redirectUrl);
      } else {
        setHasChecked(true);
      }
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  // Loading screen
  if (isLoading || !hasChecked) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-4 text-ink">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 dark:bg-purple-600/20 border border-primary/30 flex items-center justify-center animate-pulse">
            <Image
              src="/logo.png"
              alt="Fluentia Admin"
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
          <span>Authenticating Admin Workspace...</span>
        </div>
        <p className="text-xs text-ink-soft mt-1">Verifying administrative security tokens</p>
      </div>
    );
  }

  // If user is authenticated but role is NOT ADMIN
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-6 text-ink">
        <div className="max-w-md w-full p-8 rounded-3xl bg-paper-card border border-rose-500/30 dark:border-rose-500/20 shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-center mx-auto text-2xl">
            🛡️
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold font-brand text-ink">Access Restricted</h2>
            <p className="text-xs text-ink-soft leading-relaxed">
              Your account (<span className="text-ink font-semibold">{user?.email}</span>) does not have administrative privileges to access the Fluentia Command Center.
            </p>
            <div className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-xs font-mono text-ink-soft">
              Current Role: <strong className="text-amber-500">{user?.role || "USER"}</strong>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => {
                logout();
                router.push("/login?redirect=/admin");
              }}
              className="flex-1 text-xs font-semibold"
            >
              Switch Account
            </Button>
            <Button
              variant="gradient"
              onClick={() => router.push("/dashboard")}
              className="flex-1 text-xs font-bold"
            >
              Go to Learner Hub →
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
