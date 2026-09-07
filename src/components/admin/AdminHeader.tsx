"use client";

import React from "react";
import { ThemeToggle } from "@/components/shared";
import { useAuth } from "@/context/AuthContext";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function AdminHeader({ title, subtitle, actions }: AdminHeaderProps) {
  const { user } = useAuth();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10 mb-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Fluentia Admin Console
          </span>
        </div>
        <h1 className="font-brand text-2xl sm:text-3xl font-bold text-ink tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-ink-soft">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {actions}
        <div className="hidden sm:block">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
