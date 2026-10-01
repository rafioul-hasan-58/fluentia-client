import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, Search } from "lucide-react";

export function DetailLoadingSkeleton() {
  return (
    <div className="-mx-3 -mt-3 -mb-3 sm:mx-0 sm:mt-0 sm:mb-0 w-[calc(100%+1.5rem)] sm:w-full min-h-[85vh] bg-slate-50/50 dark:bg-[#0b0c15] text-slate-900 dark:text-white flex flex-col animate-pulse">
      {/* Top Bar Skeleton (Mobile Only) */}
      <div className="lg:hidden w-full px-2.5 sm:px-6 lg:px-8 py-2 sm:py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="h-7 sm:h-8 w-20 sm:w-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="h-7 sm:h-8 w-24 sm:w-36 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-7 sm:h-8 w-7 sm:w-8 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
      {/* Main Grid Skeleton */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto p-2 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6">
        <div className="lg:col-span-5 space-y-3 sm:space-y-5">
          <div className="p-3.5 sm:p-6 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-96" />
        </div>
        <div className="lg:col-span-7 space-y-3 sm:space-y-5">
          <div className="p-3.5 sm:p-6 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-64" />
          <div className="p-3.5 sm:p-6 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-48" />
        </div>
      </div>
    </div>
  );
}

interface DetailNotFoundProps {
  decodedWord: string;
  handleExit?: () => void;
  returnPage?: number;
  returnLimit?: number;
}

export function DetailNotFound({
  decodedWord,
  handleExit,
  returnPage = 1,
  returnLimit = 12,
}: DetailNotFoundProps) {
  let effectivePage = returnPage;
  if (typeof window !== "undefined" && effectivePage <= 1) {
    try {
      const saved = sessionStorage.getItem("fluentia_vocab_page");
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed > 0) effectivePage = parsed;
      }
    } catch {}
  }

  const returnHref = `/dashboard/user/vocabulary${
    effectivePage > 1
      ? `?page=${effectivePage}${returnLimit !== 12 ? `&limit=${returnLimit}` : ""}`
      : returnLimit !== 12
      ? `?limit=${returnLimit}`
      : ""
  }`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto shadow-xs">
        <Search className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Word Not Found
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          We couldn&apos;t locate personal vocabulary details for &ldquo;
          <span className="font-semibold text-purple-600 dark:text-purple-400">
            {decodedWord}
          </span>
          &rdquo;.
        </p>
      </div>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        {handleExit ? (
          <button
            type="button"
            onClick={handleExit}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-all shadow-xs cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Vocabulary Vault</span>
          </button>
        ) : (
          <Link
            href={returnHref}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-all shadow-xs cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Vocabulary Vault</span>
          </Link>
        )}
        <Link
          href="/dashboard/user/practice/vocab"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-colors"
        >
          <span>Practice Drills</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
