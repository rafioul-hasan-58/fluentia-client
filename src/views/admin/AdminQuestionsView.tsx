"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminHeader } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LevelTestQuestion } from "@/types/level-test";
import {
  fetchAdminLevelTestQuestions,
  createAdminQuestionApi,
  deleteAdminQuestionApi,
  CreateLevelTestQuestionDto,
  MOCK_LEVEL_TEST_QUESTIONS,
} from "@/lib/api/admin";

interface OptionFormState {
  id: string;
  content: string;
}

export function AdminQuestionsView() {
  const [questions, setQuestions] = useState<LevelTestQuestion[]>(MOCK_LEVEL_TEST_QUESTIONS);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState<string>("ALL");
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(40);
  const [totalPages, setTotalPages] = useState(2);

  const [previewQuestion, setPreviewQuestion] = useState<LevelTestQuestion | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionAlert, setActionAlert] = useState<{ message: string; type: "success" | "warn" } | null>(null);

  // New question form state
  const [newSection, setNewSection] = useState<string>("GRAMMAR");
  const [newLevel, setNewLevel] = useState<string>("B1");
  const [newDifficulty, setNewDifficulty] = useState<string>("MEDIUM");
  const [newPrompt, setNewPrompt] = useState<string>("");
  const [newPassage, setNewPassage] = useState<string>("");
  const [newExplanation, setNewExplanation] = useState<string>("");
  const [correctOptionIdx, setCorrectOptionIdx] = useState<number>(0);
  const [formOptions, setFormOptions] = useState<OptionFormState[]>([
    { id: "opt-1", content: "" },
    { id: "opt-2", content: "" },
    { id: "opt-3", content: "" },
    { id: "opt-4", content: "" },
  ]);

  const loadQuestions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchAdminLevelTestQuestions({
        page: currentPage,
        limit: pageSize,
        sectionType: selectedSection === "ALL" ? undefined : selectedSection,
        level: selectedLevel === "ALL" ? undefined : selectedLevel,
        difficulty: selectedDifficulty === "ALL" ? undefined : selectedDifficulty,
        search: searchQuery.trim() || undefined,
      });

      setQuestions(res.items);
      setTotalCount(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.warn("Could not load questions", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, selectedSection, selectedLevel, selectedDifficulty, searchQuery]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const triggerAlert = (message: string, type: "success" | "warn" = "success") => {
    setActionAlert({ message, type });
    setTimeout(() => setActionAlert(null), 4000);
  };

  const handleSectionChange = (sec: string) => {
    setSelectedSection(sec);
    setCurrentPage(1);
  };

  const handleLevelChange = (lvl: string) => {
    setSelectedLevel(lvl);
    setCurrentPage(1);
  };

  const handleDifficultyChange = (diff: string) => {
    setSelectedDifficulty(diff);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (val: number) => {
    setPageSize(val);
    setCurrentPage(1);
  };

  const resetForm = () => {
    setNewSection("GRAMMAR");
    setNewLevel("B1");
    setNewDifficulty("MEDIUM");
    setNewPrompt("");
    setNewPassage("");
    setNewExplanation("");
    setCorrectOptionIdx(0);
    setFormOptions([
      { id: "opt-1", content: "" },
      { id: "opt-2", content: "" },
      { id: "opt-3", content: "" },
      { id: "opt-4", content: "" },
    ]);
  };

  const handleOptionChange = (idx: number, val: string) => {
    const updated = [...formOptions];
    updated[idx] = { ...updated[idx], content: val };
    setFormOptions(updated);
  };

  const handleAddOptionField = () => {
    if (formOptions.length >= 6) return;
    setFormOptions([...formOptions, { id: `opt-${Date.now()}`, content: "" }]);
  };

  const handleRemoveOptionField = (idx: number) => {
    if (formOptions.length <= 2) return;
    const updated = formOptions.filter((_, i) => i !== idx);
    setFormOptions(updated);
    if (correctOptionIdx >= updated.length) {
      setCorrectOptionIdx(0);
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedPrompt = newPrompt.trim();
    if (!trimmedPrompt) {
      triggerAlert("Please enter a question prompt.", "warn");
      return;
    }

    const validOptions = formOptions
      .map((opt) => ({ id: opt.id, content: opt.content.trim() }))
      .filter((opt) => opt.content.length > 0);

    if (validOptions.length < 2) {
      triggerAlert("Please provide at least 2 answer choices.", "warn");
      return;
    }

    const selectedOptionContent = formOptions[correctOptionIdx]?.content?.trim();
    if (!selectedOptionContent) {
      triggerAlert("The selected correct answer option cannot be empty.", "warn");
      return;
    }

    const payloadOptions = validOptions.map((opt) => ({
      id: opt.id,
      content: opt.content,
      isCorrect: opt.content === selectedOptionContent,
    }));

    const hasCorrect = payloadOptions.some((o) => o.isCorrect);
    if (!hasCorrect) {
      payloadOptions[0].isCorrect = true;
    }

    const payload: CreateLevelTestQuestionDto = {
      question: trimmedPrompt,
      passage: newPassage.trim() || null,
      sectionType: newSection,
      level: newLevel,
      difficulty: newDifficulty,
      answer: selectedOptionContent || payloadOptions[0].content,
      explanation: newExplanation.trim() || undefined,
      options: payloadOptions,
    };

    setIsSubmitting(true);
    try {
      const res = await createAdminQuestionApi(payload);
      if (res.success) {
        triggerAlert(res.message || "New evaluation question added to repository!", "success");
        setIsAddModalOpen(false);
        resetForm();
        await loadQuestions();
      } else {
        triggerAlert(res.message || "Failed to create question on server.", "warn");
      }
    } catch (err: any) {
      triggerAlert(err.message || "Network error occurred while saving question.", "warn");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this question from the bank?")) return;

    setDeletingId(id);
    try {
      const res = await deleteAdminQuestionApi(id);
      if (res.success) {
        triggerAlert("Question deleted successfully.", "success");
        setQuestions((prev) => prev.filter((q) => q.id !== id));
        setTotalCount((prev) => Math.max(0, prev - 1));
        if (previewQuestion?.id === id) {
          setPreviewQuestion(null);
        }
      } else {
        triggerAlert(res.message || "Could not delete question.", "warn");
      }
    } catch (err: any) {
      triggerAlert(err.message || "Error deleting question.", "warn");
    } finally {
      setDeletingId(null);
    }
  };

  const getSectionBadgeClass = (section: string) => {
    switch (section?.toUpperCase()) {
      case "GRAMMAR":
        return "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30";
      case "VOCABULARY":
        return "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30";
      case "READING":
        return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
      case "SPEAKING":
        return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
      default:
        return "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30";
    }
  };

  const getDifficultyBadgeClass = (diff: string) => {
    switch (diff?.toUpperCase()) {
      case "EASY":
        return "text-emerald-600 dark:text-emerald-400";
      case "HARD":
        return "text-rose-600 dark:text-rose-400";
      default:
        return "text-amber-600 dark:text-amber-400";
    }
  };

  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalCount);

  // Helper Pagination Controls Bar
  const renderPaginationControls = (isTopPosition: boolean) => {
    if (totalCount === 0) return null;

    return (
      <div
        className={`p-3.5 sm:p-4 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn ${
          isTopPosition ? "border-primary/30 dark:border-primary/30" : "mt-2"
        }`}
      >
        {/* Counter Summary */}
        <div className="flex items-center gap-2.5 text-xs text-ink-soft">
          <span className="font-semibold text-ink">
            Showing <strong className="text-primary dark:text-purple-300">{startRecord} - {endRecord}</strong> of {totalCount} Questions
          </span>
          <span className="text-slate-300 dark:text-white/20">|</span>
          <span>Page {currentPage} of {totalPages || 1}</span>
        </div>

        {/* Page Size & Page Controls */}
        <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-end">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-ink-soft text-[11px] font-semibold">Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="h-8 px-2 rounded-lg bg-paper border border-slate-200 dark:border-white/10 text-xs font-semibold text-ink cursor-pointer"
            >
              {[10, 20, 30, 50].map((size) => (
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
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
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
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <AdminHeader
        title="Question Bank Manager"
        subtitle={`Repository of ${totalCount} CEFR placement and diagnostic evaluation questions`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadQuestions}
              disabled={isLoading}
              className="text-xs font-semibold"
              title="Reload questions from backend"
            >
              <span className={isLoading ? "animate-spin mr-1.5 inline-block" : "mr-1.5"}>
                🔄
              </span>
              <span>Refresh</span>
            </Button>
            <Button
              variant="gradient"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="text-xs font-bold shadow-sm"
            >
              <span>➕</span>
              <span className="ml-1.5">Add Question</span>
            </Button>
          </div>
        }
      />

      {/* Global Action Alert */}
      {actionAlert && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between gap-2 animate-fadeIn ${
            actionAlert.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
              : "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{actionAlert.type === "success" ? "✓" : "⚠️"}</span>
            <span>{actionAlert.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionAlert(null)}
            className="text-xs opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft text-sm">
              🔍
            </span>
            <Input
              type="text"
              placeholder="Search by keyword, question prompt, answer, or ID..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 pr-8 text-xs h-10"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1.5 self-end md:self-auto bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200/60 dark:border-white/5">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "grid"
                  ? "bg-white dark:bg-white/15 text-ink shadow-xs"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              ⊞ Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "table"
                  ? "bg-white dark:bg-white/15 text-ink shadow-xs"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              ☰ Table
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-white/10">
          {/* Section Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft min-w-[70px]">
              Section:
            </span>
            {["ALL", "GRAMMAR", "VOCABULARY", "READING", "SPEAKING"].map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => handleSectionChange(sec)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  selectedSection === sec
                    ? "bg-primary text-white shadow-xs"
                    : "bg-slate-100 dark:bg-white/5 text-ink-soft hover:text-ink"
                }`}
              >
                {sec}
              </button>
            ))}
          </div>

          {/* Level Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft min-w-[70px]">
              CEFR Level:
            </span>
            {["ALL", "A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => handleLevelChange(lvl)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                  selectedLevel === lvl
                    ? "bg-primary text-white shadow-xs"
                    : "bg-slate-100 dark:bg-white/5 text-ink-soft hover:text-ink"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft min-w-[70px]">
              Difficulty:
            </span>
            {["ALL", "EASY", "MEDIUM", "HARD"].map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => handleDifficultyChange(diff)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                  selectedDifficulty === diff
                    ? "bg-primary text-white shadow-xs"
                    : "bg-slate-100 dark:bg-white/5 text-ink-soft hover:text-ink"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TOP PAGINATION BAR */}
      {renderPaginationControls(true)}

      {/* Questions Content */}
      {isLoading ? (
        <div className="p-16 text-center text-ink-soft text-sm flex flex-col items-center justify-center gap-3">
          <span className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="font-semibold">Loading questions from Question Bank...</span>
        </div>
      ) : questions.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-paper-card border border-slate-200 dark:border-white/10 space-y-2">
          <p className="text-sm font-semibold text-ink">No questions matched your search criteria.</p>
          <p className="text-xs text-ink-soft">Try clearing your filters or adding a new question.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedSection("ALL");
              setSelectedLevel("ALL");
              setSelectedDifficulty("ALL");
            }}
            className="mt-2 text-xs"
          >
            Reset Filters
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questions.map((q, idx) => (
            <div
              key={q.id || idx}
              className="p-5 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 hover:border-primary/40 shadow-sm transition-all space-y-3 flex flex-col justify-between group"
            >
              <div className="space-y-2.5">
                {/* Badges Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getSectionBadgeClass(q.sectionType)}`}>
                      {q.sectionType}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary dark:text-purple-300 border border-primary/20">
                      {q.level}
                    </span>
                  </div>
                  <span className={`text-[11px] font-bold ${getDifficultyBadgeClass(q.difficulty)}`}>
                    ● {q.difficulty}
                  </span>
                </div>

                {/* Reading Passage snippet if present */}
                {q.passage && (
                  <p className="text-[11px] text-ink-soft bg-slate-50 dark:bg-white/[0.02] p-2 rounded-lg border border-slate-200/60 dark:border-white/5 line-clamp-2 italic">
                    &ldquo;{q.passage}&rdquo;
                  </p>
                )}

                {/* Question Prompt */}
                <h3 className="font-semibold text-sm text-ink group-hover:text-primary dark:group-hover:text-purple-300 transition-colors">
                  {q.question}
                </h3>

                {/* Options List */}
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {q.questionOptions.map((opt) => {
                    const isCorrect =
                      opt.content === q.answer || opt.id === q.answer;
                    return (
                      <div
                        key={opt.id}
                        className={`p-2 rounded-lg text-xs font-mono border flex items-center justify-between ${
                          isCorrect
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-bold"
                            : "bg-slate-50 dark:bg-white/[0.02] text-ink-soft border-slate-200/60 dark:border-white/5"
                        }`}
                      >
                        <span className="truncate">{opt.content}</span>
                        {isCorrect && <span className="text-emerald-500 font-bold">✓</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                <span className="text-[10px] text-ink-soft font-mono truncate max-w-[140px]" title={q.id}>
                  ID: {q.id}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => handleDeleteQuestion(q.id, e)}
                    disabled={deletingId === q.id}
                    className="p-1.5 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg transition-colors text-xs"
                    title="Delete Question"
                  >
                    {deletingId === q.id ? "⏳" : "🗑️"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewQuestion(q)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-primary hover:text-white dark:hover:bg-primary font-semibold transition-colors"
                  >
                    Inspect Question →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="p-4 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-ink-soft text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">Question</th>
                <th className="py-2.5 px-3">Section</th>
                <th className="py-2.5 px-3">Level</th>
                <th className="py-2.5 px-3">Difficulty</th>
                <th className="py-2.5 px-3">Correct Answer</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {questions.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                  <td className="py-3 px-3 font-medium text-ink max-w-xs truncate">
                    {q.question}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getSectionBadgeClass(q.sectionType)}`}>
                      {q.sectionType}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-primary dark:text-purple-300">
                    {q.level}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-[11px] font-bold ${getDifficultyBadgeClass(q.difficulty)}`}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    {q.answer}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleDeleteQuestion(q.id, e)}
                        disabled={deletingId === q.id}
                        className="p-1 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-md transition-colors"
                        title="Delete Question"
                      >
                        {deletingId === q.id ? "⏳" : "🗑️"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewQuestion(q)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-primary hover:text-white dark:hover:bg-primary font-semibold transition-colors"
                      >
                        Inspect
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* BOTTOM PAGINATION BAR */}
      {renderPaginationControls(false)}

      {/* Inspect Modal */}
      {previewQuestion && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-xl bg-paper-card border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getSectionBadgeClass(previewQuestion.sectionType)}`}>
                  {previewQuestion.sectionType}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary dark:text-purple-300">
                  {previewQuestion.level}
                </span>
                <span className={`text-[10px] font-bold ${getDifficultyBadgeClass(previewQuestion.difficulty)}`}>
                  {previewQuestion.difficulty}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewQuestion(null)}
                className="p-1 text-ink-soft hover:text-ink text-sm"
              >
                ✕
              </button>
            </div>

            {previewQuestion.passage && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 text-xs text-ink-soft leading-relaxed italic">
                &ldquo;{previewQuestion.passage}&rdquo;
              </div>
            )}

            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-ink-soft">Question Prompt</span>
              <h3 className="text-base font-bold text-ink">{previewQuestion.question}</h3>
            </div>

            {/* Options */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-ink-soft">Answer Choices</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {previewQuestion.questionOptions.map((opt) => {
                  const isCorrect =
                    opt.content === previewQuestion.answer || opt.id === previewQuestion.answer;
                  return (
                    <div
                      key={opt.id}
                      className={`p-3 rounded-xl text-xs font-mono border flex items-center justify-between ${
                        isCorrect
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 font-bold"
                          : "bg-slate-50 dark:bg-white/[0.02] text-ink border-slate-200/60 dark:border-white/5"
                      }`}
                    >
                      <span>{opt.content}</span>
                      {isCorrect && <span className="text-emerald-500 font-bold">✓ Correct</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Explanation */}
            {previewQuestion.explanation && (
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-1">
                <span className="text-[11px] font-bold text-primary dark:text-purple-300 uppercase tracking-wider">
                  💡 Pedagogical Explanation
                </span>
                <p className="text-xs text-ink leading-relaxed">{previewQuestion.explanation}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteQuestion(previewQuestion.id)}
                className="text-rose-500 hover:text-rose-600 border-rose-500/30 hover:bg-rose-500/10 text-xs"
              >
                🗑️ Delete Question
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewQuestion(null)}
                className="text-xs font-semibold"
              >
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Question Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-xl bg-paper-card border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <div>
                <h3 className="font-brand text-lg font-bold text-ink">Add New Question</h3>
                <p className="text-xs text-ink-soft">Create and publish a diagnostic test question to the question bank.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-ink-soft hover:text-ink text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="sec" className="text-xs font-semibold">Section</Label>
                  <select
                    id="sec"
                    value={newSection}
                    onChange={(e) => setNewSection(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-paper border border-slate-200 dark:border-white/10 text-xs font-medium text-ink cursor-pointer"
                  >
                    <option value="GRAMMAR">GRAMMAR</option>
                    <option value="VOCABULARY">VOCABULARY</option>
                    <option value="READING">READING</option>
                    <option value="SPEAKING">SPEAKING</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="lvl" className="text-xs font-semibold">CEFR Level</Label>
                  <select
                    id="lvl"
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-paper border border-slate-200 dark:border-white/10 text-xs font-medium text-ink cursor-pointer"
                  >
                    <option value="A1">A1 Beginner</option>
                    <option value="A2">A2 Elementary</option>
                    <option value="B1">B1 Intermediate</option>
                    <option value="B2">B2 Upper Intermediate</option>
                    <option value="C1">C1 Advanced</option>
                    <option value="C2">C2 Mastery</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="diff" className="text-xs font-semibold">Difficulty</Label>
                  <select
                    id="diff"
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-paper border border-slate-200 dark:border-white/10 text-xs font-medium text-ink cursor-pointer"
                  >
                    <option value="EASY">EASY</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HARD">HARD</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="qPrompt" className="text-xs font-semibold">Question Prompt *</Label>
                <Input
                  id="qPrompt"
                  placeholder="e.g. She ___ from Spain and lives in Madrid."
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  required
                  className="text-xs h-10"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="qPassage" className="text-xs font-semibold">Reading Context / Passage (Optional)</Label>
                <textarea
                  id="qPassage"
                  rows={2}
                  placeholder="Optional context paragraph or reading comprehension passage..."
                  value={newPassage}
                  onChange={(e) => setNewPassage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-slate-200 dark:border-white/10 text-xs text-ink placeholder:text-ink-soft/60 focus:outline-hidden focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">
                    Answer Choices * (Select the radio corresponding to the correct answer)
                  </Label>
                  {formOptions.length < 6 && (
                    <button
                      type="button"
                      onClick={handleAddOptionField}
                      className="text-[11px] text-primary font-bold hover:underline"
                    >
                      + Add Choice
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {formOptions.map((opt, i) => {
                    const isSelected = correctOptionIdx === i;
                    return (
                      <div
                        key={opt.id}
                        className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
                          isSelected
                            ? "border-emerald-500/50 bg-emerald-500/5"
                            : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02]"
                        }`}
                      >
                        <input
                          type="radio"
                          id={`radio-opt-${i}`}
                          name="correctOptionRadio"
                          checked={isSelected}
                          onChange={() => setCorrectOptionIdx(i)}
                          className="accent-emerald-600 w-4 h-4 cursor-pointer flex-shrink-0"
                          title="Mark this option as the correct answer"
                        />
                        <Input
                          placeholder={`Option ${i + 1}`}
                          value={opt.content}
                          onChange={(e) => handleOptionChange(i, e.target.value)}
                          className="text-xs h-8 flex-1"
                          required={i < 2}
                        />
                        {formOptions.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOptionField(i)}
                            className="text-slate-400 hover:text-rose-500 text-xs p-1"
                            title="Remove this option"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="text-[11px] text-ink-soft">
                  Selected correct answer: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{formOptions[correctOptionIdx]?.content || "(Option empty)"}</strong>
                </p>
              </div>

              <div className="space-y-1">
                <Label htmlFor="expl" className="text-xs font-semibold">Pedagogical Explanation</Label>
                <textarea
                  id="expl"
                  rows={2}
                  placeholder='e.g. "Is" is the correct third-person singular present form of the verb "to be".'
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper border border-slate-200 dark:border-white/10 text-xs text-ink placeholder:text-ink-soft/60 focus:outline-hidden focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-white/10">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isSubmitting}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gradient"
                  size="sm"
                  disabled={isSubmitting}
                  className="text-xs font-bold"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5" />
                      Saving to Bank...
                    </>
                  ) : (
                    "Save Question"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
