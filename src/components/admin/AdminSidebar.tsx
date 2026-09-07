"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/shared";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/avatar";

interface NavItem {
  name: string;
  href: string;
  badge?: string;
  badgeColor?: string;
  icon: (props: { className?: string }) => React.JSX.Element;
}

const ADMIN_NAV_SECTIONS: { category?: string; items: NavItem[] }[] = [
  {
    category: "Management",
    items: [
      {
        name: "Overview",
        href: "/admin",
        icon: ({ className }) => (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="7" height="9" x="3" y="3" rx="1" />
            <rect width="7" height="5" x="14" y="3" rx="1" />
            <rect width="7" height="9" x="14" y="12" rx="1" />
            <rect width="7" height="5" x="3" y="16" rx="1" />
          </svg>
        ),
      },
      {
        name: "Learners & Users",
        href: "/admin/users",
        icon: ({ className }) => (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        ),
      },
      {
        name: "Test Attempts",
        href: "/admin/attempts",
        badge: "Live",
        badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        icon: ({ className }) => (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
            <rect width="8" height="4" x="8" y="2" rx="1" />
            <path d="m9 14 2 2 4-4" />
          </svg>
        ),
      },
      {
        name: "Question Bank",
        href: "/admin/questions",
        badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
        icon: ({ className }) => (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            <path d="M9 10h6" />
            <path d="M9 14h6" />
            <path d="M9 6h6" />
          </svg>
        ),
      },

    ],
  },
  {
    category: "Insights & Platform",
    items: [
      {
        name: "Test Analytics",
        href: "/admin/analytics",
        badge: "Live",
        badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        icon: ({ className }) => (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18" />
            <path d="m19 9-5 5-4-4-3 3" />
          </svg>
        ),
      },
      {
        name: "Platform Settings",
        href: "/admin/settings",
        icon: ({ className }) => (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        ),
      },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
    : "AD";

  return (
    <>
      {/* Mobile Top App Bar for Admin */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-paper/95 dark:bg-[#070510]/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10 z-30 flex items-center justify-between px-4">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="relative w-8 h-8">
            <Image
              src="/logo.png"
              alt="Fluentia Admin"
              width={32}
              height={32}
              className="object-contain w-full h-full"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-brand text-base font-bold tracking-tight text-ink">
              Fluentia
            </span>
            <span className="text-[9px] text-amber-500 dark:text-amber-300 font-bold uppercase tracking-wider -mt-1">
              Admin Suite
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl text-ink-soft hover:text-ink hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            aria-label="Open Admin Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fadeIn"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 max-w-[85vw] bg-paper-card border-r border-slate-200 dark:border-white/10 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
          }`}
      >
        {/* Admin Brand Header */}
        <div className="h-16 lg:h-20 flex items-center justify-between px-5 border-b border-slate-200 dark:border-white/10">
          <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 group-hover:scale-105 transition-transform duration-200">
              <Image
                src="/logo.png"
                alt="Fluentia Admin"
                width={40}
                height={40}
                className="object-contain w-full h-full"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-brand text-lg font-bold tracking-tight text-ink">
                  Fluentia
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold border border-amber-500/30">
                  ADMIN
                </span>
              </div>
              <span className="text-[10px] text-primary dark:text-purple-300 font-semibold font-brand -mt-0.5">
                Command Center
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-ink-soft hover:text-ink hover:bg-slate-100 dark:hover:bg-white/10"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Switcher back to Learner Hub */}
        <div className="p-3 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.01]">
          <Link
            href="/dashboard"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-primary/10 dark:bg-purple-600/15 border border-primary/20 hover:border-primary/40 text-primary dark:text-purple-300 text-xs font-semibold transition-all group"
          >
            <span className="flex items-center gap-2">
              <span>🎓</span>
              <span>Switch to Learner Hub</span>
            </span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 font-nav">
          {ADMIN_NAV_SECTIONS.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {section.category && (
                <div className="px-3 pb-1.5 text-[10px] font-bold text-ink-soft uppercase tracking-wider font-brand">
                  {section.category}
                </div>
              )}
              {section.items.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname?.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 group ${isActive
                      ? "bg-primary text-white shadow-sm dark:shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                      : "text-ink-soft hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:text-ink"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${isActive
                          ? "text-white"
                          : "text-ink-soft group-hover:text-primary dark:group-hover:text-purple-300"
                          }`}
                      />
                      <span>{item.name}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${isActive
                          ? "bg-white/20 text-white border-transparent"
                          : item.badgeColor || "bg-amber-500/20 text-amber-500 border-amber-500/30"
                          }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Profile & Actions */}
        <div className="p-3.5 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02]">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/5 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar
                  src={user?.profileImage || user?.avatar}
                  fallback={initials}
                  size="sm"
                  className="w-8 h-8 shrink-0 ring-2 ring-amber-500/30"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-ink truncate">
                    {user?.name || "Admin"}
                  </p>
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider truncate">
                    Super Administrator
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 px-1">
              <button
                type="button"
                onClick={logout}
                className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 py-1 px-2 rounded-lg text-left flex items-center gap-1.5 transition-colors"
              >
                <span>🚪</span>
                <span>Sign Out</span>
              </button>

              <div className="hidden lg:block">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
