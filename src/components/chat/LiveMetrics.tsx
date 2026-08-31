"use client";

import React from "react";

interface LiveMetricsProps {
  messageCount: number;
  grammarScore: number;
  vocabXP: number;
  activeLevel: string;
}

export function LiveMetrics({
  messageCount,
  grammarScore,
  vocabXP,
  activeLevel,
}: LiveMetricsProps) {
  return (
    <div className="bg-[#0B132B] border border-white/10 rounded-2xl p-4 shadow-xl space-y-4 text-white">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-white">Session Analytics</span>
        </div>
        <span className="text-[11px] font-semibold text-cyan-300 bg-cyan-500/20 border border-cyan-500/30 px-2 py-0.5 rounded-md">
          {activeLevel}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-2.5 rounded-xl bg-[#030712]/60 border border-white/5">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Turns</span>
          <span className="text-lg font-bold text-white">{messageCount}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#030712]/60 border border-white/5">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Accuracy</span>
          <span className="text-lg font-bold text-emerald-400">{grammarScore}%</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#030712]/60 border border-white/5">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Earned XP</span>
          <span className="text-lg font-bold text-cyan-300">+{vocabXP}</span>
        </div>
      </div>

      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between text-[11px] font-medium text-slate-400">
          <span>Lexical Diversity</span>
          <span className="font-bold text-cyan-300">High (C1-C2)</span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500" style={{ width: "82%" }} />
        </div>
      </div>
    </div>
  );
}
