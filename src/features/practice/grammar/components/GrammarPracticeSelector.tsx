"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  GraduationCap,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Layers,
  AlertCircle,
} from "lucide-react";
import { SkillTree, StartPracticeParams, DropdownOption } from "../types";
import { SkillDropdown } from "./SkillDropdown";
import { SubSkillDropdown } from "./SubSkillDropdown";

export interface GrammarPracticeSelectorProps {
  skills: SkillTree;
  onStart?: (params: StartPracticeParams) => void;
  className?: string;
}

export const GrammarPracticeSelector: React.FC<GrammarPracticeSelectorProps> = ({
  skills = [],
  onStart,
  className = "",
}) => {
  // Local state for two-level selection
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [selectedSubSkillSlug, setSelectedSubSkillSlug] = useState<string | null>(null);

  // When category changes, update category and reset sub-skill
  const handleCategoryChange = (slug: string) => {
    setSelectedCategorySlug(slug);
    setSelectedSubSkillSlug(null);
  };

  // When sub-skill changes
  const handleSubSkillChange = (slug: string) => {
    setSelectedSubSkillSlug(slug);
  };

  // Derive active category from prop data
  const selectedCategory = useMemo(() => {
    return skills.find((c) => c.slug === selectedCategorySlug) || null;
  }, [skills, selectedCategorySlug]);

  // Derive sub-skills from selected category in memory
  const subSkills = useMemo(() => {
    return selectedCategory?.children || [];
  }, [selectedCategory]);

  // Derive active sub-skill from category children
  const selectedSubSkill = useMemo(() => {
    return subSkills.find((s) => s.slug === selectedSubSkillSlug) || null;
  }, [subSkills, selectedSubSkillSlug]);

  // Map categories to presentational options
  const categoryOptions: DropdownOption[] = useMemo(() => {
    return skills.map((cat) => ({
      value: cat.slug,
      label: cat.name,
      badge: cat.category,
      description: `${cat.children?.length || 0} sub-skills`,
    }));
  }, [skills]);

  // Map sub-skills to presentational options
  const subSkillOptions: DropdownOption[] = useMemo(() => {
    return subSkills.map((sub) => ({
      value: sub.slug,
      label: sub.name,
      badge: sub.cefr,
    }));
  }, [subSkills]);

  // Can start only when both selections are made
  const isReady = Boolean(selectedCategorySlug && selectedSubSkillSlug);

  // Handle start button click
  const handleStartPractice = () => {
    if (selectedCategorySlug && selectedSubSkillSlug && onStart) {
      onStart({
        categorySlug: selectedCategorySlug,
        subSkillSlug: selectedSubSkillSlug,
      });
    }
  };

  return (
    <div className={`space-y-6 w-full ${className}`}>
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/user/practice"
              className="text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Practice Hub
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              Grammar Practice
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1 flex items-center gap-2.5">
            <span>Grammar Practice</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80">
              Selector
            </span>
          </h1>
        </div>
      </div>

      {skills.length === 0 ? (
        /* Empty / Unavailable State */
        <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              No Skills Available
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Unable to load the grammar skills catalog. Please check back shortly or refresh the page.
            </p>
          </div>
        </div>
      ) : (
        /* Main Practice Selector Card */
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Card Intro Header */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Select Your Focus Area
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Choose a high-level skill category, then drill down into a specific grammar rule or sub-skill before launching your interactive session.
              </p>
            </div>
          </div>

          {/* Two-Level Dropdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {/* 1. Skill / Category Dropdown */}
            <SkillDropdown
              id="grammar-category-select"
              label="1. Top-Level Skill"
              placeholder="Choose a skill category..."
              options={categoryOptions}
              value={selectedCategorySlug}
              onChange={handleCategoryChange}
              helperText={
                selectedCategory
                  ? `${subSkills.length} sub-skill${subSkills.length === 1 ? "" : "s"} available`
                  : "Select a grammar domain to unlock specific topics"
              }
            />

            {/* 2. Sub-skill Dropdown */}
            <SubSkillDropdown
              id="grammar-subskill-select"
              label="2. Sub-Skill / Topic"
              placeholder={
                selectedCategorySlug
                  ? "Choose a specific topic..."
                  : "Select a skill category first"
              }
              options={subSkillOptions}
              value={selectedSubSkillSlug}
              onChange={handleSubSkillChange}
              disabled={!selectedCategorySlug}
              helperText={
                !selectedCategorySlug
                  ? "Disabled until a top-level skill is chosen"
                  : selectedSubSkill?.cefr
                  ? `CEFR Level: ${selectedSubSkill.cefr}`
                  : "Select a topic to enable practice"
              }
            />
          </div>

          {/* Selection Status Summary */}
          {selectedCategory && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4 flex-wrap text-xs animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Layers className="w-4 h-4 text-indigo-500 shrink-0" />
                <span className="font-semibold">Selected:</span>
                <span className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200/60 dark:border-indigo-800/60">
                  {selectedCategory.name}
                </span>
                {selectedSubSkill ? (
                  <>
                    <span className="text-slate-400">→</span>
                    <span className="px-2 py-0.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold border border-purple-200/60 dark:border-purple-800/60 flex items-center gap-1.5">
                      <span>{selectedSubSkill.name}</span>
                      {selectedSubSkill.cefr && (
                        <span className="text-[10px] font-mono px-1 py-0.2 bg-purple-200/60 dark:bg-purple-900/60 rounded">
                          {selectedSubSkill.cefr}
                        </span>
                      )}
                    </span>
                  </>
                ) : (
                  <span className="text-slate-400 italic">No sub-skill selected yet</span>
                )}
              </div>

              {isReady && (
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Ready to practice</span>
                </div>
              )}
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isReady
                ? "Click below to begin your focused grammar practice."
                : "Select both a top-level skill and a sub-skill to proceed."}
            </p>

            <button
              type="button"
              onClick={handleStartPractice}
              disabled={!isReady}
              className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm transition-all shadow-sm ${
                isReady
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25 cursor-pointer hover:translate-x-0.5"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Practice</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrammarPracticeSelector;
