"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption<T extends string | number = string | number> {
  value: T;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SelectProps<T extends string | number = string | number> {
  value: T;
  onChange: (value: T) => void;
  options: (SelectOption<T> | T)[];
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  dropdownClassName?: string;
  optionClassName?: string;
  size?: "xs" | "sm" | "default" | "lg";
  direction?: "up" | "down" | "auto";
  disabled?: boolean;
  prefix?: React.ReactNode;
  align?: "left" | "right";
  ariaLabel?: string;
}

export function Select<T extends string | number = string | number>({
  value,
  onChange,
  options,
  placeholder,
  className,
  triggerClassName,
  dropdownClassName,
  optionClassName,
  size = "sm",
  direction = "auto",
  disabled = false,
  prefix,
  align = "left",
  ariaLabel,
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [openDirection, setOpenDirection] = useState<"up" | "down">("down");
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  // Normalize options to SelectOption objects
  const normalizedOptions: SelectOption<T>[] = options.map((opt) => {
    if (typeof opt === "object" && opt !== null && "value" in opt) {
      return opt as SelectOption<T>;
    }
    return { value: opt, label: String(opt) };
  });

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Auto calculate dropdown direction based on viewport space
  useEffect(() => {
    if (!isOpen) return;

    if (direction === "up") {
      setOpenDirection("up");
      return;
    }
    if (direction === "down") {
      setOpenDirection("down");
      return;
    }

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const estimatedHeight = Math.min(normalizedOptions.length * 36 + 16, 220);
      if (spaceBelow < estimatedHeight && rect.top > estimatedHeight) {
        setOpenDirection("up");
      } else {
        setOpenDirection("down");
      }
    }
  }, [isOpen, direction, normalizedOptions.length]);

  // Handle click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const sizeClasses = {
    xs: "h-7 px-2 text-[11px] rounded-lg gap-1.5",
    sm: "h-8 px-2.5 text-xs rounded-xl gap-2",
    default: "h-10 px-3.5 text-sm rounded-xl gap-2.5",
    lg: "h-12 px-4 text-base rounded-2xl gap-3",
  };

  const chevronSizes = {
    xs: "w-3 h-3",
    sm: "w-3.5 h-3.5",
    default: "w-4 h-4",
    lg: "w-4.5 h-4.5",
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-block text-left", className)}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-label={ariaLabel}
        className={cn(
          "inline-flex items-center justify-between font-semibold border transition-all duration-200 select-none cursor-pointer",
          "bg-white/95 dark:bg-[#1c1638] hover:bg-slate-50 dark:hover:bg-[#251d4b]",
          "border-slate-200/90 dark:border-white/10 hover:border-primary/50 dark:hover:border-purple-400/40",
          "text-ink shadow-xs hover:shadow-sm",
          "focus:outline-none focus:ring-2 focus:ring-primary/20",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          isOpen && "ring-2 ring-primary/20 border-primary dark:border-purple-400 shadow-sm",
          sizeClasses[size],
          triggerClassName
        )}
      >
        <div className="flex items-center gap-1.5 truncate">
          {prefix && <span className="shrink-0">{prefix}</span>}
          <span className="truncate">
            {selectedOption?.label ?? selectedOption?.value ?? placeholder ?? "Select..."}
          </span>
        </div>

        <ChevronDown
          className={cn(
            "shrink-0 text-slate-400 dark:text-slate-400 transition-transform duration-200",
            isOpen && "rotate-180 text-primary dark:text-purple-300",
            chevronSizes[size]
          )}
        />
      </button>

      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          className={cn(
            "absolute z-50 min-w-full w-max max-h-60 overflow-y-auto p-1 rounded-xl shadow-xl backdrop-blur-md",
            "bg-white/95 dark:bg-[#1a1438]/95 border border-slate-200/90 dark:border-purple-500/25",
            "shadow-purple-950/10 dark:shadow-black/60",
            "animate-in fade-in zoom-in-95 duration-150",
            openDirection === "up" ? "bottom-full mb-1.5" : "top-full mt-1.5",
            align === "right" ? "right-0" : "left-0",
            dropdownClassName
          )}
        >
          {normalizedOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={String(opt.value)}
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={opt.disabled}
                onClick={() => {
                  if (opt.disabled) return;
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between gap-3 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-150 text-left",
                  isSelected
                    ? "bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-primary dark:text-purple-300 font-bold dark:bg-purple-500/20"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white",
                  opt.disabled && "opacity-40 cursor-not-allowed",
                  optionClassName
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                  <span className="truncate">{opt.label ?? String(opt.value)}</span>
                </div>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-primary dark:text-purple-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Select;
