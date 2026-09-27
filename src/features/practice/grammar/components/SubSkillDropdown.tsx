import React from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { DropdownOption } from "../types";

export interface SubSkillDropdownProps {
  id?: string;
  label?: string;
  placeholder?: string;
  options: DropdownOption[];
  value: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  helperText?: string;
  error?: string;
}

export const SubSkillDropdown: React.FC<SubSkillDropdownProps> = ({
  id = "sub-skill-dropdown",
  label = "Sub-skill / Topic",
  placeholder = "Select a sub-skill...",
  options,
  value,
  onChange,
  disabled = false,
  className = "",
  helperText,
  error,
}) => {
  return (
    <div className={`space-y-2 w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          <span>{label}</span>
        </label>
      )}

      <div className="relative">
        <select
          id={id}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full appearance-none rounded-2xl border bg-slate-50/70 dark:bg-slate-900/80 px-4 py-3.5 pr-10 text-sm font-semibold transition-all cursor-pointer ${
            error
              ? "border-rose-500 text-rose-900 dark:text-rose-200 focus:ring-rose-500/20"
              : "border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-purple-400 dark:hover:border-purple-500/60 focus:border-purple-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-purple-500/10"
          } ${
            disabled
              ? "opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-950/60 hover:border-slate-200 dark:hover:border-slate-800"
              : ""
          } focus:outline-hidden`}
        >
          <option value="" disabled className="text-slate-400 dark:text-slate-500">
            {placeholder}
          </option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-2"
            >
              {option.label}
              {option.badge ? ` [${option.badge}]` : ""}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error ? (
        <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
};

export default SubSkillDropdown;
