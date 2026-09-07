"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LevelTestQuestion } from "@/types/level-test";
import { fetchGeneralLevelTestQuestions } from "@/lib/api/levelTest";

export function AdminQuestionsView() {
  const [questions, setQuestions] = useState<LevelTestQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState<string>("ALL");
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [previewQuestion, setPreviewQuestion] = useState<LevelTestQuestion | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New question form state
  const [newQuestion, setNewQuestion] = useState<Partial<LevelTestQuestion>>({
    sectionType: "GRAMMAR",
    level: "B1",
    difficulty: "MEDIUM",
    question: "",
    passage: null,
    explanation: "",
    answer: "",
    questionOptions: [
      { id: "opt-1", content: "" },
      { id: "opt-2", content: "" },
      { id: "opt-3", content: "" },
      { id: "opt-4", content: "" },
    ],
  });

  useEffect(() => {
    async function loadQuestions() {
      setIsLoading(true);
      try {
        const data = await fetchGeneralLevelTestQuestions(50);
        setQuestions(data);
      } catch {
        // fallback handles errors
      } finally {
        setIsLoading(false);
      }
    }
    loadQuestions();
  }, []);

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.explanation && q.explanation.toLowerCase().includes(searchQuery.toLowerCase())) ||
      q.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSection =
      selectedSection === "ALL" ||
      q.sectionType?.toUpperCase() === selectedSection.toUpperCase();

    const matchesLevel =
      selectedLevel === "ALL" ||
      q.level?.toUpperCase() === selectedLevel.toUpperCase();

    const matchesDifficulty =
      selectedDifficulty === "ALL" ||
      q.difficulty?.toUpperCase() === selectedDifficulty.toUpperCase();

    return matchesSearch && matchesSection && matchesLevel && matchesDifficulty;
  });

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.question) return;

    const created: LevelTestQuestion = {
      id: `q-custom-${Date.now()}`,
      question: newQuestion.question,
      passage: newQuestion.passage || null,
      sectionType: newQuestion.sectionType || "GRAMMAR",
      level: newQuestion.level || "B1",
      difficulty: newQuestion.difficulty || "MEDIUM",
      answer: newQuestion.answer || (newQuestion.questionOptions?.[0]?.content || ""),
      explanation: newQuestion.explanation || "",
      questionOptions: (newQuestion.questionOptions || []).filter((opt) => opt.content.trim() !== ""),
    };

    setQuestions([created, ...questions]);
    setIsAddModalOpen(false);
    setNewQuestion({
      sectionType: "GRAMMAR",
      level: "B1",
      difficulty: "MEDIUM",
      question: "",
      passage: null,
      explanation: "",
      answer: "",
      questionOptions: [
        { id: "opt-1", content: "" },
        { id: "opt-2", content: "" },
        { id: "opt-3", content: "" },
        { id: "opt-4", content: "" },
      ],
    });
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

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <AdminHeader
        title="Question Bank Manager"
        subtitle={`Total of ${questions.length} active placement and evaluation questions indexed`}
        actions={
          <Button
            variant="gradient"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs font-bold shadow-sm"
          >
            <span>➕</span>
            <span className="ml-1.5">Add Question</span>
          </Button>
        }
      />

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
              placeholder="Search by keyword, question prompt, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs h-10"
            />
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
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft mr-1">
            Section:
          </span>
          {["ALL", "GRAMMAR", "VOCABULARY", "READING"].map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => setSelectedSection(sec)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedSection === sec
                  ? "bg-primary text-white shadow-xs"
                  : "bg-slate-100 dark:bg-white/5 text-ink-soft hover:text-ink"
              }`}
            >
              {sec}
            </button>
          ))}

          <div className="w-px h-4 bg-slate-200 dark:border-white/10 mx-1 hidden sm:block" />

          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft mr-1">
            Level:
          </span>
          {["ALL", "A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setSelectedLevel(lvl)}
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
      </div>

      {/* Questions Content */}
      {isLoading ? (
        <div className="p-12 text-center text-ink-soft text-sm flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Loading Question Bank...</span>
        </div>
      ) : filteredQuestions.length === 0 ? (
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
            }}
            className="mt-2 text-xs"
          >
            Reset Filters
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredQuestions.map((q, idx) => (
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
                        {isCorrect && <span>✓</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                <span className="text-[10px] text-ink-soft font-mono">ID: {q.id}</span>
                <button
                  type="button"
                  onClick={() => setPreviewQuestion(q)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-primary hover:text-white dark:hover:bg-primary font-semibold transition-colors"
                >
                  Inspect Question →
                </button>
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
              {filteredQuestions.map((q) => (
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
                    <button
                      type="button"
                      onClick={() => setPreviewQuestion(q)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-primary hover:text-white dark:hover:bg-primary font-semibold transition-colors"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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

            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
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
              <h3 className="font-brand text-lg font-bold text-ink">Add New Question</h3>
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
                  <Label htmlFor="sec">Section</Label>
                  <select
                    id="sec"
                    value={newQuestion.sectionType}
                    onChange={(e) => setNewQuestion({ ...newQuestion, sectionType: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-paper border border-slate-200 dark:border-white/10 text-xs font-medium text-ink"
                  >
                    <option value="GRAMMAR">GRAMMAR</option>
                    <option value="VOCABULARY">VOCABULARY</option>
                    <option value="READING">READING</option>
                    <option value="SPEAKING">SPEAKING</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="lvl">CEFR Level</Label>
                  <select
                    id="lvl"
                    value={newQuestion.level}
                    onChange={(e) => setNewQuestion({ ...newQuestion, level: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-paper border border-slate-200 dark:border-white/10 text-xs font-medium text-ink"
                  >
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="C1">C1</option>
                    <option value="C2">C2</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="diff">Difficulty</Label>
                  <select
                    id="diff"
                    value={newQuestion.difficulty}
                    onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-paper border border-slate-200 dark:border-white/10 text-xs font-medium text-ink"
                  >
                    <option value="EASY">EASY</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HARD">HARD</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="qPrompt">Question Prompt</Label>
                <Input
                  id="qPrompt"
                  placeholder="e.g., If she ___ earlier, she wouldn't have missed the flight."
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Answer Choices (Select the correct one)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {newQuestion.questionOptions?.map((opt, i) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctAnswerRadio"
                        checked={newQuestion.answer === opt.content && opt.content !== ""}
                        onChange={() => setNewQuestion({ ...newQuestion, answer: opt.content })}
                        className="accent-primary w-4 h-4 cursor-pointer"
                        title="Mark as correct answer"
                      />
                      <Input
                        placeholder={`Option ${i + 1}`}
                        value={opt.content}
                        onChange={(e) => {
                          const updated = [...(newQuestion.questionOptions || [])];
                          updated[i] = { ...opt, content: e.target.value };
                          setNewQuestion({ ...newQuestion, questionOptions: updated });
                        }}
                        className="text-xs h-9"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="expl">Pedagogical Explanation</Label>
                <Input
                  id="expl"
                  placeholder="Explain why the correct answer fits grammatically or semantically..."
                  value={newQuestion.explanation || ""}
                  onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-white/10">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gradient"
                  size="sm"
                  className="text-xs font-bold"
                >
                  Save Question
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
