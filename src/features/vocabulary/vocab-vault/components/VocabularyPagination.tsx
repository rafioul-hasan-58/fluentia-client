import React, { useMemo } from "react";
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

  const paginationItems = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => ({
        type: "page" as const,
        page: i + 1,
        hideOnMobile: false,
      }));
    }

    const items: Array<
      | { type: "page"; page: number; hideOnMobile: boolean }
      | {
          type: "dots";
          key: string;
          hideOnDesktop?: boolean;
          hideOnMobile?: boolean;
        }
    > = [];

    if (currentPage <= 3) {
      for (let p = 1; p <= 3; p++) {
        items.push({ type: "page", page: p, hideOnMobile: false });
      }
      for (let p = 4; p <= Math.min(5, totalPages - 1); p++) {
        items.push({ type: "page", page: p, hideOnMobile: true });
      }
      if (totalPages > 4) {
        items.push({
          type: "dots",
          key: "dots-end",
          hideOnDesktop: totalPages <= 6,
          hideOnMobile: false,
        });
      }
      items.push({ type: "page", page: totalPages, hideOnMobile: false });
    } else if (currentPage >= totalPages - 2) {
      items.push({ type: "page", page: 1, hideOnMobile: false });
      items.push({
        type: "dots",
        key: "dots-start",
        hideOnDesktop: totalPages <= 6,
        hideOnMobile: false,
      });
      for (let p = Math.max(2, totalPages - 4); p <= totalPages - 3; p++) {
        items.push({ type: "page", page: p, hideOnMobile: true });
      }
      for (let p = totalPages - 2; p <= totalPages; p++) {
        items.push({ type: "page", page: p, hideOnMobile: false });
      }
    } else {
      items.push({ type: "page", page: 1, hideOnMobile: false });
      items.push({
        type: "dots",
        key: "dots-start",
        hideOnDesktop: false,
        hideOnMobile: false,
      });
      items.push({ type: "page", page: currentPage - 1, hideOnMobile: true });
      items.push({ type: "page", page: currentPage, hideOnMobile: false });
      items.push({ type: "page", page: currentPage + 1, hideOnMobile: true });
      items.push({
        type: "dots",
        key: "dots-end",
        hideOnDesktop: false,
        hideOnMobile: false,
      });
      items.push({ type: "page", page: totalPages, hideOnMobile: false });
    }

    return items;
  }, [currentPage, totalPages]);

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

        <div className="flex items-center gap-1 sm:gap-1.5 flex-nowrap">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1 || isLoading}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="h-8 px-2 sm:px-2.5 text-xs font-semibold whitespace-nowrap shrink-0"
          >
            ‹ Prev
          </Button>

          {paginationItems.map((item) => {
            if (item.type === "dots") {
              return (
                <span
                  key={item.key}
                  className={`px-0.5 sm:px-1 text-xs text-ink-soft shrink-0 select-none ${
                    item.hideOnDesktop
                      ? "inline-block sm:hidden"
                      : item.hideOnMobile
                      ? "hidden sm:inline-block"
                      : "inline-block"
                  }`}
                >
                  ...
                </span>
              );
            }

            return (
              <button
                key={item.page}
                type="button"
                onClick={() => setCurrentPage(item.page)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center justify-center ${
                  item.hideOnMobile ? "hidden sm:inline-flex" : "inline-flex"
                } ${
                  currentPage === item.page
                    ? "bg-primary text-white shadow-xs"
                    : "bg-slate-100 dark:bg-white/5 text-ink-soft hover:text-ink hover:bg-slate-200 dark:hover:bg-white/10"
                }`}
              >
                {item.page}
              </button>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages || isLoading}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="h-8 px-2 sm:px-2.5 text-xs font-semibold whitespace-nowrap shrink-0"
          >
            Next ›
          </Button>
        </div>
      </div>
    </div>
  );
}
