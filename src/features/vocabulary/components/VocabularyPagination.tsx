import React from "react";
import { Button } from "@/components/ui/button";

export interface VocabularyPaginationProps {
  currentPage: number;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  totalPages: number;
  totalCount: number;
  startRecord: number;
  endRecord: number;
  pageSize: number;
  setPageSize: (size: number) => void;
  isLoading?: boolean;
  isTopPosition?: boolean;
}

export default function VocabularyPagination({
  currentPage,
  setCurrentPage,
  totalPages,
  totalCount,
  startRecord,
  endRecord,
  pageSize,
  setPageSize,
  isLoading = false,
  isTopPosition = false,
}: VocabularyPaginationProps) {
  if (totalCount === 0) return null;

  return (
    <div
      className={`p-3.5 sm:p-4 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn ${
        isTopPosition ? "border-primary/30 dark:border-primary/30" : "mt-2"
      }`}
    >
      <div className="flex items-center gap-2.5 text-xs text-ink-soft">
        <span className="font-semibold text-ink">
          Showing{" "}
          <strong className="text-primary dark:text-purple-300">
            {startRecord} - {endRecord}
          </strong>{" "}
          of {totalCount} Words
        </span>
        <span className="text-slate-300 dark:text-white/20">|</span>
        <span>
          Page {currentPage} of {totalPages || 1}
        </span>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-end">
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-ink-soft text-[11px] font-semibold">
            Per page:
          </span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="h-8 px-2 rounded-lg bg-paper border border-slate-200 dark:border-white/10 text-xs font-semibold text-ink cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/40"
          >
            {[12, 24, 36, 48].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1 || isLoading}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="h-8 px-2.5 text-xs font-semibold"
          >
            ‹ Prev
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            if (
              totalPages > 6 &&
              p !== 1 &&
              p !== totalPages &&
              Math.abs(p - currentPage) > 1
            ) {
              if (p === 2 || p === totalPages - 1) {
                return (
                  <span key={p} className="px-1 text-xs text-ink-soft">
                    ...
                  </span>
                );
              }
              return null;
            }

            return (
              <button
                key={p}
                type="button"
                onClick={() => setCurrentPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentPage === p
                    ? "bg-primary text-white shadow-xs"
                    : "bg-slate-100 dark:bg-white/5 text-ink-soft hover:text-ink hover:bg-slate-200 dark:hover:bg-white/10"
                }`}
              >
                {p}
              </button>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages || isLoading}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="h-8 px-2.5 text-xs font-semibold"
          >
            Next ›
          </Button>
        </div>
      </div>
    </div>
  );
}
