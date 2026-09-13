"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/shared";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/avatar";

interface SubNavItem {
  name: string;
  href: string;
  badge?: string;
  icon?: (props: { className?: string }) => React.JSX.Element;
}

interface NavItem {
  name: string;
  href?: string;
  badge?: string;
  icon: (props: { className?: string }) => React.JSX.Element;
  children?: SubNavItem[];
}

const NAV_ITEMS: { category?: string; items: NavItem[] }[] = [
  {
    category: "Main",
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
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
        name: "AI Practice Chat",
        href: "/dashboard/chat",
        badge: "AI",
        icon: ({ className }) => (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
            <path d="M8 12h.01" />
            <path d="M12 12h.01" />
            <path d="M16 12h.01" />
          </svg>
        ),
      },
    ],
  },
  {
    category: "Core Skills",
    items: [
      {
        name: "Skills",
        href: "/dashboard/skills",
        icon: ({ className }) => (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          </svg>
        ),
      },
      {
        name: "Vocabulary",
        icon: ({ className }) => (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            <path d="M6 6h10" />
            <path d="M6 10h10" />
          </svg>
        ),
        children: [
          {
            name: "Vocabulary Vault",
            href: "/dashboard/vocabulary",
            icon: ({ className }) => (
              <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            ),
          },
          {
            name: "Vocab Story",
            href: "/dashboard/vocabulary/stories",
            badge: "AI",
            icon: ({ className }) => (
              <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M8 7h6" />
                <path d="M8 11h8" />
                <path d="m14 16 2 2 4-4" />
              </svg>
            ),
          },
        ],
      },
      {
        name: "Reading",
        href: "/dashboard/reading",
        icon: ({ className }) => (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        ),
      },
      {
        name: "Speaking",
        href: "/dashboard/speaking",
        icon: ({ className }) => (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
        ),
      },
      {
        name: "Writing",
        href: "/dashboard/writing",
        icon: ({ className }) => (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          </svg>
        ),
      },
    ],
  },
  {
    category: "Assessment & Test",
    items: [
      {
        name: "Level Test",
        href: "/dashboard/level-test",
        badge: "Adaptive",
        icon: ({ className }) => (
          <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        ),
      },
    ],
  },
];

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export function Sidebar({
  mobileOpen: controlledMobileOpen,
  setMobileOpen: setControlledMobileOpen,
}: SidebarProps = {}) {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  const isControlled = controlledMobileOpen !== undefined;
  const mobileOpen = isControlled ? controlledMobileOpen : internalMobileOpen;
  const setMobileOpen =
    isControlled && setControlledMobileOpen
      ? setControlledMobileOpen
      : setInternalMobileOpen;

  // Auto-close mobile drawer when route changes
  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    Vocabulary: true,
  });

  const toggleDropdown = (name: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName || user?.name || user?.email?.split("@")[0] || "Learner";

  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : (displayName[0] || "U").toUpperCase();

  return (
    <>
      {/* Mobile Top App Bar / Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/95 dark:bg-[#070510]/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10 z-30 flex items-center justify-between px-4 sm:px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 group"
        >
          <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-purple-500 p-0.5 shadow-xs group-hover:scale-105 transition-transform flex items-center justify-center">
            <Image
              src="/icon.png"
              alt="Fluentia"
              width={28}
              height={28}
              className="w-full h-full object-contain rounded-[10px]"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-brand text-base font-bold tracking-tight text-ink">
              Fluentia
            </span>
            <span className="text-[9px] text-primary dark:text-purple-300 font-semibold font-brand -mt-1">
              Learning Hub
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {((user?.streakDays !== undefined && user.streakDays > 0) ||
            (user?.profile?.streakDays && user.profile.streakDays > 0)) && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 shadow-2xs">
              🔥 {user.streakDays ?? user.profile?.streakDays}
            </span>
          )}

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl text-ink-soft hover:text-ink hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 max-w-[85vw] bg-white dark:bg-paper-card border-r border-slate-200 dark:border-white/10 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200 dark:border-white/10">
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 group"
          >
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-purple-500 p-0.5 shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center">
              <Image
                src="/icon.png"
                alt="Fluentia"
                width={28}
                height={28}
                className="w-full h-full object-contain rounded-[10px]"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-brand text-lg font-bold tracking-tight text-ink">
                Fluentia
              </span>
              <span className="text-[10px] text-primary dark:text-purple-300 font-semibold font-brand -mt-1">
                Learning Hub
              </span>
            </div>
          </Link>

          {/* Close button for mobile drawer */}
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

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 font-nav">
          {NAV_ITEMS.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {section.category && (
                <div className="px-3 pb-1.5 text-[10px] font-bold text-ink-soft uppercase tracking-wider font-brand">
                  {section.category}
                </div>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;

                // Handle Dropdown Menu (items with children)
                if (item.children && item.children.length > 0) {
                  const isAnyChildActive = item.children.some((child) => {
                    if (child.href === "/dashboard/vocabulary") {
                      return pathname === "/dashboard/vocabulary";
                    }
                    return pathname === child.href || pathname?.startsWith(child.href);
                  });

                  const isDropdownOpen =
                    openDropdowns[item.name] !== undefined
                      ? openDropdowns[item.name]
                      : isAnyChildActive;

                  return (
                    <div key={item.name} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => toggleDropdown(item.name)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 group cursor-pointer ${
                          isAnyChildActive
                            ? "bg-slate-100 dark:bg-white/[0.08] text-ink font-semibold"
                            : "text-ink-soft hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:text-ink"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                              isAnyChildActive
                                ? "text-primary dark:text-purple-400"
                                : "text-ink-soft group-hover:text-primary dark:group-hover:text-purple-300"
                            }`}
                          />
                          <span>{item.name}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {item.badge && (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-amber-500/20 text-amber-500 dark:text-amber-300 border border-amber-500/30">
                              {item.badge}
                            </span>
                          )}
                          <svg
                            className={`w-4 h-4 text-ink-soft transition-transform duration-200 ${
                              isDropdownOpen ? "rotate-180 text-primary dark:text-purple-400" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>

                      {/* Dropdown Options */}
                      {isDropdownOpen && (
                        <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-primary/20 dark:border-purple-500/20 ml-5 my-1 animate-in fade-in slide-in-from-top-1 duration-150">
                          {item.children.map((child) => {
                            const isChildActive =
                              child.href === "/dashboard/vocabulary"
                                ? pathname === "/dashboard/vocabulary"
                                : pathname === child.href || pathname?.startsWith(child.href);

                            const SubIcon = child.icon;

                            return (
                              <Link
                                key={child.name}
                                href={child.href}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                                  isChildActive
                                    ? "bg-primary text-white shadow-xs font-semibold"
                                    : "text-ink-soft hover:text-ink hover:bg-slate-100 dark:hover:bg-white/[0.05]"
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  {SubIcon ? (
                                    <SubIcon
                                      className={`w-3.5 h-3.5 ${
                                        isChildActive ? "text-white" : "text-ink-soft"
                                      }`}
                                    />
                                  ) : (
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        isChildActive ? "bg-white" : "bg-ink-soft/50"
                                      }`}
                                    />
                                  )}
                                  <span>{child.name}</span>
                                </div>

                                {child.badge && (
                                  <span
                                    className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                                      isChildActive
                                        ? "bg-white/20 text-white"
                                        : "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30"
                                    }`}
                                  >
                                    {child.badge}
                                  </span>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                // Regular Nav Item
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname?.startsWith(item.href || ""));

                return (
                  <Link
                    key={item.name}
                    href={item.href || "#"}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 group ${
                      isActive
                        ? "bg-primary text-white shadow-sm dark:shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                        : "text-ink-soft hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:text-ink"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                          isActive
                            ? "text-white"
                            : "text-ink-soft group-hover:text-primary dark:group-hover:text-purple-300"
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-amber-500/20 text-amber-500 dark:text-amber-300 border border-amber-500/30"
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

          {/* Admin Switcher for ADMIN users */}
          {user?.role?.toUpperCase() === "ADMIN" && (
            <div className="pt-2 border-t border-slate-200 dark:border-white/10">
              <div className="px-3 pb-1.5 text-[10px] font-bold text-amber-500 uppercase tracking-wider font-brand flex items-center justify-between">
                <span>Admin Suite</span>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              </div>
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-amber-500/10 to-purple-600/10 hover:from-amber-500/20 hover:to-purple-600/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 shadow-2xs transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">🛡️</span>
                  <span>Admin Console</span>
                </div>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                  Panel →
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* User Card / Bottom Profile & Theme */}
        <div className="p-3.5 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02]">
          {isAuthenticated && user ? (
            <div className="space-y-2">
              <Link
                href="/dashboard/settings"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/5 shadow-2xs transition-all group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar
                    src={user.profileImage || user.avatar}
                    fallback={initials}
                    size="sm"
                    className="w-8 h-8 shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-semibold text-ink truncate group-hover:text-primary dark:group-hover:text-purple-300 transition-colors">
                        {displayName}
                      </p>
                      {(user.streakDays !== undefined && user.streakDays > 0) || (user.profile?.streakDays && user.profile.streakDays > 0) ? (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.2 rounded-full border border-amber-500/20 shrink-0 shadow-2xs">
                          🔥 {user.streakDays ?? user.profile?.streakDays}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-[10px] text-ink-soft truncate">{user.level || "Intermediate"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-ink-soft group-hover:text-primary transition-colors p-1" title="Settings">
                    ⚙️
                  </span>
                </div>
              </Link>

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
          ) : (
            <div className="space-y-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center justify-center py-2 rounded-xl bg-primary text-white text-xs font-bold font-brand shadow-sm"
              >
                Sign In to Fluentia
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
