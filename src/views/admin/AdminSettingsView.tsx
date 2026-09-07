"use client";

import React, { useState } from "react";
import { AdminHeader } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiBaseUrl } from "@/lib/api/config";

export function AdminSettingsView() {
  const [apiEndpoint, setApiEndpoint] = useState(getApiBaseUrl());
  const [questionsPerTest, setQuestionsPerTest] = useState(20);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(15);
  const [aiModel, setAiModel] = useState("gpt-4o-mini");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <AdminHeader
        title="Platform & Evaluation Settings"
        subtitle="Manage backend API connections, AI model parameters, and CEFR placement thresholds."
      />

      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <span>✓</span>
          <span>Platform configuration updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* System Health & Endpoints */}
        <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
            <div className="space-y-0.5">
              <h2 className="font-brand text-base sm:text-lg font-bold text-ink">
                Backend API & System Connection
              </h2>
              <p className="text-xs text-ink-soft">
                Core REST API URL and connection health
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Operational</span>
            </span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiBase">Primary Backend API URL</Label>
            <Input
              id="apiBase"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              className="font-mono text-xs"
            />
            <p className="text-[11px] text-ink-soft">
              Default: <code className="text-primary dark:text-purple-300">https://api.fluentia.sourob.com/api/v1</code>
            </p>
          </div>
        </div>

        {/* Placement Test Rules */}
        <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <div className="border-b border-slate-200 dark:border-white/10 pb-3">
            <h2 className="font-brand text-base sm:text-lg font-bold text-ink">
              Placement Test Engine Configuration
            </h2>
            <p className="text-xs text-ink-soft">
              Control the number of items and timer rules for the general English placement test
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="qCount">Questions Per Test Session</Label>
              <Input
                id="qCount"
                type="number"
                min={4}
                max={60}
                value={questionsPerTest}
                onChange={(e) => setQuestionsPerTest(Number(e.target.value))}
                className="text-xs"
              />
              <p className="text-[11px] text-ink-soft">Currently serving 20 questions</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="timeLim">Test Time Limit (Minutes)</Label>
              <Input
                id="timeLim"
                type="number"
                min={5}
                max={60}
                value={timeLimitMinutes}
                onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                className="text-xs"
              />
              <p className="text-[11px] text-ink-soft">Recommended: 15 minutes</p>
            </div>
          </div>
        </div>

        {/* AI Evaluation Engine */}
        <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <div className="border-b border-slate-200 dark:border-white/10 pb-3">
            <h2 className="font-brand text-base sm:text-lg font-bold text-ink">
              AI Analysis & Diagnostic Models
            </h2>
            <p className="text-xs text-ink-soft">
              Configure generative reasoning parameters for personalized roadmaps and strengths/weaknesses
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="model">Evaluation AI Model</Label>
              <select
                id="model"
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-paper border border-slate-200 dark:border-white/10 text-xs font-semibold text-ink"
              >
                <option value="gpt-4o-mini">gpt-4o-mini (Fast & Cost Efficient)</option>
                <option value="gpt-4o">gpt-4o (High Precision Syntactic Analysis)</option>
                <option value="claude-3-5-sonnet">claude-3-5-sonnet (Pedagogical Deep Reasoning)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label>Temperature Setting</Label>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 text-xs text-ink font-mono flex items-center justify-between">
                <span>0.2 (Deterministic / Academic)</span>
                <span className="text-[10px] text-emerald-500 font-bold">Standard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="submit"
            variant="gradient"
            className="px-6 h-11 text-xs font-bold shadow-md"
          >
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
