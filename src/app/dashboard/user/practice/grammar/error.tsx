"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, ChevronLeft } from "lucide-react";

export default function GrammarPracticeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GrammarPracticeError]", error);
  }, [error]);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full animate-in fade-in duration-300">
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-950/60 p-8 sm:p-12 shadow-sm text-center flex flex-col items-center max-w-lg mx-auto space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-xs">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Failed to Load Skills
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {error.message ||
              "An unexpected error occurred while loading grammar skills. Please try again."}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-center pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-sm shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/dashboard/user/practice"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Practice Hub</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
