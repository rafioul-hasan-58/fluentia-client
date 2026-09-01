"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/avatar";

export function UserProfileDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "FL";

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Profile Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-full sm:rounded-2xl border border-slate-200 dark:border-white/10 bg-paper-card hover:bg-slate-100 dark:hover:bg-white/5 transition-all shadow-xs group focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="relative">
          <Avatar
            src={user.avatar}
            fallback={initials}
            size="sm"
            className="w-8 h-8 sm:w-9 sm:h-9"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#030712]" />
        </div>

        <div className="hidden sm:flex flex-col text-left pr-1">
          <span className="text-xs font-bold text-ink leading-tight group-hover:text-primary dark:group-hover:text-cyan-300 transition-colors truncate max-w-[120px]">
            {user.name}
          </span>
          <span className="text-[10px] text-ink-soft leading-tight truncate">
            {user.level || "Intermediate"}
          </span>
        </div>

        <svg
          className={`w-3.5 h-3.5 text-ink-soft transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu Modal */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl z-50 p-2 space-y-1 animate-fadeIn divide-y divide-slate-200/60 dark:divide-white/5 text-ink">
          {/* User Info Header */}
          <div className="px-3 py-2.5 pb-3">
            <div className="flex items-center gap-2.5">
              <Avatar
                src={user.avatar}
                fallback={initials}
                size="md"
                className="w-10 h-10 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-ink truncate">{user.name}</p>
                <p className="text-[11px] text-ink-soft truncate">{user.email}</p>
                <span className="inline-block mt-1 bg-primary/10 dark:bg-cyan-500/20 text-primary dark:text-cyan-300 text-[9px] font-bold px-2 py-0.5 rounded-md border border-primary/20 dark:border-cyan-500/30">
                  {user.level || "Intermediate B2"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="py-1.5 space-y-0.5 text-xs font-semibold">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-ink-soft hover:text-ink"
            >
              <span>📊</span>
              <span>Learning Dashboard</span>
            </Link>

            <Link
              href="/dashboard/chat"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-ink-soft hover:text-ink"
            >
              <span>💬</span>
              <span>AI Practice Chat</span>
            </Link>

            <Link
              href="/dashboard/vocabulary"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-ink-soft hover:text-ink"
            >
              <span>📚</span>
              <span>Vocabulary Vault</span>
            </Link>
          </div>

          {/* Logout Action */}
          <div className="pt-1.5">
            <button
              type="button"
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
