import React from "react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-paper border-t border-slate-200 dark:border-white/10 pt-16 pb-12 text-ink transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-200 dark:border-white/10">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-11 h-11 group-hover:scale-105 transition-transform duration-200">
                <Image
                  src="/logo.png"
                  alt="Fluentia Logo"
                  width={44}
                  height={44}
                  className="object-contain w-full h-full"
                />
              </div>
              <span className="font-display text-2xl font-bold tracking-tight text-ink">
                Fluentia
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-ink-soft max-w-sm">
              Next-generation AI-powered English language tutor engineered for fluent conversations, IELTS band excellence, real-time grammar diagnostics, and vocabulary retention.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-ink-soft">
              Platform & Features
            </h4>
            <ul className="space-y-2 text-xs font-medium text-ink-soft">
              <li>
                <Link href="#features" className="hover:text-primary dark:hover:text-cyan-300 transition-colors">
                  Features & Tracks
                </Link>
              </li>
              <li>
                <Link href="#demo" className="hover:text-primary dark:hover:text-cyan-300 transition-colors">
                  Interactive AI Demo
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-primary dark:hover:text-cyan-300 transition-colors">
                  Learning Console
                </Link>
              </li>
              <li>
                <Link href="/dashboard/chat" className="hover:text-primary dark:hover:text-cyan-300 transition-colors">
                  AI Practice Coach
                </Link>
              </li>
            </ul>
          </div>

          {/* Developer Info Card */}
          <div className="md:col-span-5">
            <div className="p-5 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none hover:border-primary/40 dark:hover:border-blue-500/40 transition-all duration-300 relative overflow-hidden group">
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 -z-0" />

              <div className="relative z-10 flex items-center gap-4">
                {/* Developer Photo */}
                <div className="relative shrink-0">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-tr from-blue-600 via-primary to-indigo-500 shadow-md">
                    <div className="w-full h-full rounded-[14px] overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                      <Image
                        src="/developer.jpg"
                        alt="Rafioul Hasan - Developer"
                        fill
                        sizes="80px"
                        className="object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-300"
                        priority
                      />
                    </div>
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white dark:border-[#0f172a]" />
                  </span>
                </div>

                {/* Developer Details */}
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 dark:bg-cyan-500/15 text-primary dark:text-cyan-300 border border-primary/20 dark:border-cyan-500/30">
                      Lead Engineer & Creator
                    </span>
                  </div>
                  <h3 className="font-display text-base font-bold text-ink truncate">
                    Rafioul Hasan
                  </h3>
                  <p className="text-[11px] text-ink-soft truncate">
                    Full-Stack Developer & AI Systems Builder
                  </p>

                  {/* Social & Contact Links */}
                  <div className="flex items-center gap-3 pt-1.5">
                    <a
                      href="https://github.com/rafioul-hasan-58"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-ink-soft hover:text-primary dark:hover:text-cyan-300 font-medium transition-colors"
                      aria-label="GitHub Profile"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                      <span>GitHub</span>
                    </a>

                    <span className="text-ink-soft/40">•</span>

                    <a
                      href="mailto:rafioulhasan2@gmail.com"
                      className="inline-flex items-center gap-1.5 text-xs text-ink-soft hover:text-primary dark:hover:text-cyan-300 font-medium transition-colors"
                      aria-label="Email Developer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>Email</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-soft">
          <div>
            © {new Date().getFullYear()} Fluentia. Developed with passion by <span className="font-semibold text-ink">Rafioul Hasan</span>.
          </div>
          <div className="flex items-center gap-5">
            <span className="hover:text-ink transition-colors cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-ink transition-colors cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="text-primary dark:text-cyan-300 font-medium">All Rights Reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

