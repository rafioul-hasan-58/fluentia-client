"use client";

import React from "react";

export interface Scenario {
  id: string;
  title: string;
  icon: string;
  description: string;
  badge: string;
}

export const SCENARIOS: Scenario[] = [
  {
    id: "casual",
    title: "Casual Chit-Chat",
    icon: "☕",
    description: "Daily life, hobbies, current trends, and travel stories.",
    badge: "Friendly",
  },
  {
    id: "ielts",
    title: "IELTS Speaking Coach",
    icon: "🎯",
    description: "Part 1, 2, and 3 mock evaluation with band score benchmarks.",
    badge: "Band 7.5+",
  },
  {
    id: "interview",
    title: "Job Interview Prep",
    icon: "💼",
    description: "Behavioral questions, executive presence, and professional vocabulary.",
    badge: "Business",
  },
  {
    id: "grammar",
    title: "Grammar Doctor",
    icon: "🔬",
    description: "Deep dive into clauses, prepositions, and natural collocations.",
    badge: "Deep Learning",
  },
];

interface ScenarioSelectorProps {
  activeScenarioId: string;
  onSelectScenario: (id: string) => void;
}

export function ScenarioSelector({
  activeScenarioId,
  onSelectScenario,
}: ScenarioSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {SCENARIOS.map((sc) => {
        const isActive = activeScenarioId === sc.id;
        return (
          <button
            key={sc.id}
            onClick={() => onSelectScenario(sc.id)}
            className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
              isActive
                ? "bg-primary/10 dark:bg-blue-950/60 border-primary dark:border-cyan-400 shadow-sm dark:shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                : "bg-paper-card border-slate-200 dark:border-white/10 hover:border-primary/40 dark:hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{sc.icon}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  isActive
                    ? "bg-primary text-white dark:bg-cyan-500/20 dark:text-cyan-300 dark:border dark:border-cyan-500/40"
                    : "bg-slate-100 dark:bg-white/5 text-ink-soft dark:text-slate-400"
                }`}
              >
                {sc.badge}
              </span>
            </div>

            <div>
              <h4 className={`text-xs font-bold ${isActive ? "text-primary dark:text-cyan-300" : "text-ink"}`}>
                {sc.title}
              </h4>
              <p className="text-[11px] text-ink-soft mt-0.5 line-clamp-1">
                {sc.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
