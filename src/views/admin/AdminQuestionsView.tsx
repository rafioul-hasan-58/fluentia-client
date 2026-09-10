"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { AdminHeader } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LevelTestQuestion, LevelTestQuestionSet } from "@/types/level-test";
import {
  fetchAdminLevelTestQuestions,
  createAdminQuestionApi,
  updateAdminQuestionApi,
  deleteAdminQuestionApi,
  fetchAdminQuestionSets,
  fetchAdminQuestionSetById,
  createAdminQuestionSetApi,
  updateAdminQuestionSetApi,
  deleteAdminQuestionSetApi,
  toggleAdminQuestionSetStatusApi,
  CreateLevelTestQuestionDto,
  CreateQuestionSetDto,
  UpdateQuestionSetDto,
  MOCK_LEVEL_TEST_QUESTIONS,
  MOCK_LEVEL_TEST_SETS,
} from "@/lib/api/admin";
import {
  Pencil,
  Trash2,
  Eye,
  Loader2,
  Plus,
  RotateCw,
  Layers,
  HelpCircle,
  CheckCircle2,
  Check,
  Search,
  Activity,
  ListChecks,
  Sparkles,
} from "lucide-react";

interface OptionFormState {
  id: string;
  content: string;
}

export function AdminQuestionsView() {
  // Main Tab State: "questions" (All Questions) | "sets" (Question Sets)
  const [activeTab, setActiveTab] = useState<"questions" | "sets">("questions");

  // ==========================================
  // TAB 1: ALL QUESTIONS STATE
  // ==========================================
  const [questions, setQuestions] = useState<LevelTestQuestion[]>(MOCK_LEVEL_TEST_QUESTIONS);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState<string>("ALL");
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Pagination for Questions
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(40);
  const [totalPages, setTotalPages] = useState(2);

  // Question Modals
  const [previewQuestion, setPreviewQuestion] = useState<LevelTestQuestion | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<LevelTestQuestion | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(null);

  // Question Form Fields
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

  // ==========================================
  // TAB 2: QUESTION SETS STATE
  // ==========================================
  const [questionSets, setQuestionSets] = useState<LevelTestQuestionSet[]>(MOCK_LEVEL_TEST_SETS);
  const [isLoadingSets, setIsLoadingSets] = useState(false);
  const [setsSearchQuery, setSetsSearchQuery] = useState("");
  const [setsStatusFilter, setSetsStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [setsPage, setSetsPage] = useState(1);
  const [setsLimit, setSetsLimit] = useState(10);
  const [totalSetsCount, setTotalSetsCount] = useState(2);
  const [totalSetsPages, setTotalSetsPages] = useState(1);

  // Set Modals & Actions
  const [inspectingSet, setInspectingSet] = useState<LevelTestQuestionSet | null>(null);
  const [isLoadingSetDetails, setIsLoadingSetDetails] = useState(false);
  const [isSetModalOpen, setIsSetModalOpen] = useState(false);
  const [editingSet, setEditingSet] = useState<LevelTestQuestionSet | null>(null);
  const [isSubmittingSet, setIsSubmittingSet] = useState(false);
  const [deletingSetId, setDeletingSetId] = useState<string | null>(null);
  const [togglingSetId, setTogglingSetId] = useState<string | null>(null);

  // Set Form Fields
  const [setName, setSetName] = useState("");
  const [setDescription, setSetDescription] = useState("");
  const [setIsActive, setSetIsActive] = useState(true);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);

  // Question Picker (within Create/Edit Set modal)
  const [allAvailableQuestions, setAllAvailableQuestions] = useState<LevelTestQuestion[]>([]);
  const [isLoadingAvailableQuestions, setIsLoadingAvailableQuestions] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");
  const [pickerSection, setPickerSection] = useState("ALL");
  const [pickerLevel, setPickerLevel] = useState("ALL");
  const [pickerDifficulty, setPickerDifficulty] = useState("ALL");

  // Global Alert
  const [actionAlert, setActionAlert] = useState<{ message: string; type: "success" | "warn" } | null>(null);

  const triggerAlert = (message: string, type: "success" | "warn" = "success") => {
    setActionAlert({ message, type });
    setTimeout(() => setActionAlert(null), 4000);
  };

  // ==========================================
  // DATA FETCHING: QUESTIONS
  // ==========================================
  const loadQuestions = useCallback(async () => {
    setIsLoadingQuestions(true);
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
      setIsLoadingQuestions(false);
    }
  }, [currentPage, pageSize, selectedSection, selectedLevel, selectedDifficulty, searchQuery]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  // ==========================================
  // DATA FETCHING: QUESTION SETS
  // ==========================================
  const loadQuestionSets = useCallback(async () => {
    setIsLoadingSets(true);
    try {
      const isActiveParam =
        setsStatusFilter === "ACTIVE" ? true : setsStatusFilter === "INACTIVE" ? false : undefined;

      const res = await fetchAdminQuestionSets({
        page: setsPage,
        limit: setsLimit,
        search: setsSearchQuery.trim() || undefined,
        isActive: isActiveParam,
      });

      setQuestionSets(res.items);
      setTotalSetsCount(res.total);
      setTotalSetsPages(res.totalPages);
    } catch (err) {
      console.warn("Could not load question sets", err);
    } finally {
      setIsLoadingSets(false);
    }
  }, [setsPage, setsLimit, setsSearchQuery, setsStatusFilter]);

  useEffect(() => {
    if (activeTab === "sets") {
      loadQuestionSets();
    }
  }, [activeTab, loadQuestionSets]);

  // Load all available questions for the set builder picker
  const loadAvailableQuestionsForPicker = async () => {
    setIsLoadingAvailableQuestions(true);
    try {
      const res = await fetchAdminLevelTestQuestions({ page: 1, limit: 100 });
      setAllAvailableQuestions(res.items);
    } catch (err) {
      console.warn("Could not load questions for picker", err);
      setAllAvailableQuestions(MOCK_LEVEL_TEST_QUESTIONS);
    } finally {
      setIsLoadingAvailableQuestions(false);
    }
  };

  // ==========================================
  // QUESTION ACTIONS
  // ==========================================
  const resetQuestionForm = () => {
    setEditingQuestion(null);
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

  const handleOpenAddQuestionModal = () => {
    resetQuestionForm();
    setIsFormModalOpen(true);
  };

  const handleOpenEditQuestionModal = (q: LevelTestQuestion, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingQuestion(q);
    setNewSection(q.sectionType || "GRAMMAR");
    setNewLevel(q.level || "B1");
    setNewDifficulty(q.difficulty || "MEDIUM");
    setNewPrompt(q.question || "");
    setNewPassage(q.passage || "");
    setNewExplanation(q.explanation || "");

    const existingOpts =
      Array.isArray(q.questionOptions) && q.questionOptions.length > 0
        ? q.questionOptions.map((opt) => ({
            id: opt.id || `opt-${Math.random()}`,
            content: opt.content || "",
          }))
        : [
            { id: "opt-1", content: "" },
            { id: "opt-2", content: "" },
            { id: "opt-3", content: "" },
            { id: "opt-4", content: "" },
          ];

    setFormOptions(existingOpts);

    const correctIdx = existingOpts.findIndex(
      (opt) => opt.content === q.answer || opt.id === q.answer
    );
    setCorrectOptionIdx(correctIdx >= 0 ? correctIdx : 0);

    setIsFormModalOpen(true);
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

  const handleSubmitQuestion = async (e: React.FormEvent) => {
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

    setIsSubmittingQuestion(true);
    try {
      if (editingQuestion) {
        const res = await updateAdminQuestionApi(editingQuestion.id, payload);
        if (res.success) {
          triggerAlert(res.message || "Question updated successfully!", "success");
          setIsFormModalOpen(false);
          resetQuestionForm();
          await loadQuestions();
          if (previewQuestion?.id === editingQuestion.id && res.data) {
            setPreviewQuestion(res.data);
          }
        } else {
          triggerAlert(res.message || "Failed to update question on server.", "warn");
        }
      } else {
        const res = await createAdminQuestionApi(payload);
        if (res.success) {
          triggerAlert(res.message || "New question added to bank successfully!", "success");
          setIsFormModalOpen(false);
          resetQuestionForm();
          await loadQuestions();
        } else {
          triggerAlert(res.message || "Failed to create question on server.", "warn");
        }
      }
    } catch (err: any) {
      triggerAlert(err.message || "Network error occurred while saving question.", "warn");
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  const handleDeleteQuestion = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this question from the bank?")) return;

    setDeletingQuestionId(id);
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
      setDeletingQuestionId(null);
    }
  };

  // ==========================================
  // QUESTION SET ACTIONS
  // ==========================================
  const resetSetForm = () => {
    setEditingSet(null);
    setSetName("");
    setSetDescription("");
    setSetIsActive(true);
    setSelectedQuestionIds([]);
    setPickerSearch("");
    setPickerSection("ALL");
    setPickerLevel("ALL");
    setPickerDifficulty("ALL");
  };

  const handleOpenCreateSetModal = () => {
    resetSetForm();
    loadAvailableQuestionsForPicker();
    setIsSetModalOpen(true);
  };

  const handleOpenEditSetModal = async (set: LevelTestQuestionSet, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingSet(set);
    setSetName(set.name);
    setSetDescription(set.description || "");
    setSetIsActive(set.isActive);

    setIsSetModalOpen(true);
    loadAvailableQuestionsForPicker();

    try {
      const fullSetRes = await fetchAdminQuestionSetById(set.id);
      if (fullSetRes.success && fullSetRes.data?.questions) {
        setSelectedQuestionIds(fullSetRes.data.questions.map((q) => q.id));
      } else if (set.questions) {
        setSelectedQuestionIds(set.questions.map((q) => q.id));
      }
    } catch {
      if (set.questions) {
        setSelectedQuestionIds(set.questions.map((q) => q.id));
      }
    }
  };

  const handleInspectSet = async (set: LevelTestQuestionSet) => {
    setInspectingSet(set);
    setIsLoadingSetDetails(true);
    try {
      const res = await fetchAdminQuestionSetById(set.id);
      if (res.success && res.data) {
        setInspectingSet(res.data);
      }
    } catch (err) {
      console.warn("Could not fetch set details", err);
    } finally {
      setIsLoadingSetDetails(false);
    }
  };

  const handleToggleQuestionSelection = (questionId: string) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId]
    );
  };

  const handleSelectAllFiltered = (filteredQuestions: LevelTestQuestion[]) => {
    const newIds = filteredQuestions.map((q) => q.id);
    setSelectedQuestionIds((prev) => Array.from(new Set([...prev, ...newIds])));
  };

  const handleDeselectAllFiltered = (filteredQuestions: LevelTestQuestion[]) => {
    const removeIds = new Set(filteredQuestions.map((q) => q.id));
    setSelectedQuestionIds((prev) => prev.filter((id) => !removeIds.has(id)));
  };

  const handleSubmitSet = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = setName.trim();
    if (!trimmedName) {
      triggerAlert("Please enter a name for the Question Set.", "warn");
      return;
    }

    if (selectedQuestionIds.length === 0) {
      if (!window.confirm("You have not selected any questions for this set. Do you want to create an empty set?")) {
        return;
      }
    }

    setIsSubmittingSet(true);
    try {
      if (editingSet) {
        const updatePayload: UpdateQuestionSetDto = {
          name: trimmedName,
          description: setDescription.trim() || undefined,
          isActive: setIsActive,
          questionIds: selectedQuestionIds,
        };

        const res = await updateAdminQuestionSetApi(editingSet.id, updatePayload);
        if (res.success) {
          triggerAlert(res.message || "Question set updated successfully!", "success");
          setIsSetModalOpen(false);
          resetSetForm();
          await loadQuestionSets();
          if (inspectingSet?.id === editingSet.id && res.data) {
            setInspectingSet(res.data);
          }
        } else {
          triggerAlert(res.message || "Failed to update question set.", "warn");
        }
      } else {
        // POST /level-test-questions/create-set
        const createPayload: CreateQuestionSetDto = {
          name: trimmedName,
          description: setDescription.trim() || undefined,
          isActive: setIsActive,
          questionIds: selectedQuestionIds,
        };

        const res = await createAdminQuestionSetApi(createPayload);
        if (res.success) {
          triggerAlert(res.message || "New question set created successfully!", "success");
          setIsSetModalOpen(false);
          resetSetForm();
          await loadQuestionSets();
        } else {
          triggerAlert(res.message || "Failed to create question set.", "warn");
        }
      }
    } catch (err: any) {
      triggerAlert(err.message || "Network error while saving question set.", "warn");
    } finally {
      setIsSubmittingSet(false);
    }
  };

  const handleDeleteSet = async (setId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this question set? This action cannot be undone.")) return;

    setDeletingSetId(setId);
    try {
      const res = await deleteAdminQuestionSetApi(setId);
      if (res.success) {
        triggerAlert("Question set deleted successfully.", "success");
        setQuestionSets((prev) => prev.filter((s) => s.id !== setId));
        setTotalSetsCount((prev) => Math.max(0, prev - 1));
        if (inspectingSet?.id === setId) {
          setInspectingSet(null);
        }
      } else {
        triggerAlert(res.message || "Could not delete question set.", "warn");
      }
    } catch (err: any) {
      triggerAlert(err.message || "Error deleting question set.", "warn");
    } finally {
      setDeletingSetId(null);
    }
  };

  const handleToggleSetStatus = async (set: LevelTestQuestionSet, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newStatus = !set.isActive;
    setTogglingSetId(set.id);
    try {
      const res = await toggleAdminQuestionSetStatusApi(set.id, newStatus);
      if (res.success) {
        triggerAlert(
          `Set "${set.name}" is now ${newStatus ? "ACTIVE for testing" : "INACTIVE"}.`,
          "success"
        );
        setQuestionSets((prev) =>
          prev.map((s) => (s.id === set.id ? { ...s, isActive: newStatus } : s))
        );
        if (inspectingSet?.id === set.id) {
          setInspectingSet((prev) => (prev ? { ...prev, isActive: newStatus } : null));
        }
      } else {
        triggerAlert(res.message || "Failed to update set status.", "warn");
      }
    } catch (err: any) {
      triggerAlert(err.message || "Error toggling status.", "warn");
    } finally {
      setTogglingSetId(null);
    }
  };

  // Filter questions for the modal question picker
  const filteredPickerQuestions = useMemo(() => {
    return allAvailableQuestions.filter((q) => {
      if (pickerSection !== "ALL" && q.sectionType?.toUpperCase() !== pickerSection) return false;
      if (pickerLevel !== "ALL" && q.level?.toUpperCase() !== pickerLevel) return false;
      if (pickerDifficulty !== "ALL" && q.difficulty?.toUpperCase() !== pickerDifficulty) return false;
      if (pickerSearch.trim()) {
        const query = pickerSearch.toLowerCase();
        return (
          q.question.toLowerCase().includes(query) ||
          (q.explanation && q.explanation.toLowerCase().includes(query)) ||
          q.id.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [allAvailableQuestions, pickerSection, pickerLevel, pickerDifficulty, pickerSearch]);

  // Selected questions breakdown
  const selectedBreakdown = useMemo(() => {
    const selectedList = allAvailableQuestions.filter((q) => selectedQuestionIds.includes(q.id));
    const bySection: Record<string, number> = {};
    const byLevel: Record<string, number> = {};

    selectedList.forEach((q) => {
      const sec = q.sectionType?.toUpperCase() || "OTHER";
      const lvl = q.level?.toUpperCase() || "OTHER";
      bySection[sec] = (bySection[sec] || 0) + 1;
      byLevel[lvl] = (byLevel[lvl] || 0) + 1;
    });

    return { bySection, byLevel, count: selectedList.length };
  }, [allAvailableQuestions, selectedQuestionIds]);

  // ==========================================
  // BADGE STYLING HELPERS
  // ==========================================
  const getSectionBadgeClass = (section?: string) => {
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

  const getDifficultyBadgeClass = (diff?: string) => {
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

  // Helper Pagination for Questions
  const renderPaginationControls = (isTopPosition: boolean) => {
    if (totalCount === 0) return null;

    return (
      <div
        className={`p-3.5 sm:p-4 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn ${
          isTopPosition ? "border-primary/30 dark:border-primary/30" : "mt-2"
        }`}
      >
        <div className="flex items-center gap-2.5 text-xs text-ink-soft">
          <span className="font-semibold text-ink">
            Showing <strong className="text-primary dark:text-purple-300">{startRecord} - {endRecord}</strong> of {totalCount} Questions
          </span>
          <span className="text-slate-300 dark:text-white/20">|</span>
          <span>Page {currentPage} of {totalPages || 1}</span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-end">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-ink-soft text-[11px] font-semibold">Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
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
              disabled={currentPage <= 1 || isLoadingQuestions}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-8 px-2.5 text-xs font-semibold"
            >
              ‹ Prev
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              if (totalPages > 6 && p !== 1 && p !== totalPages && Math.abs(p - currentPage) > 1) {
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
              disabled={currentPage >= totalPages || isLoadingQuestions}
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
        subtitle="Manage CEFR placement evaluation questions and configure structured test sets"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={activeTab === "questions" ? loadQuestions : loadQuestionSets}
              disabled={isLoadingQuestions || isLoadingSets}
              className="text-xs font-semibold gap-1.5"
              title="Reload data from server"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isLoadingQuestions || isLoadingSets ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </Button>

            {activeTab === "questions" ? (
              <Button
                variant="gradient"
                size="sm"
                onClick={handleOpenAddQuestionModal}
                className="text-xs font-bold shadow-sm gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Question</span>
              </Button>
            ) : (
              <Button
                variant="gradient"
                size="sm"
                onClick={handleOpenCreateSetModal}
                className="text-xs font-bold shadow-sm gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create Question Set</span>
              </Button>
            )}
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

      {/* ========================================================================= */}
      {/* TWO-TAB SWITCHER */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 p-1.5 bg-paper-card border border-slate-200 dark:border-white/10 rounded-2xl shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab("questions")}
          className={`flex-1 flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "questions"
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "text-ink-soft hover:text-ink hover:bg-slate-100 dark:hover:bg-white/5"
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>All Questions</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeTab === "questions"
                ? "bg-white/20 text-white"
                : "bg-slate-100 dark:bg-white/10 text-ink-soft"
            }`}
          >
            {totalCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("sets")}
          className={`flex-1 flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "sets"
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "text-ink-soft hover:text-ink hover:bg-slate-100 dark:hover:bg-white/5"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Question Sets</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeTab === "sets"
                ? "bg-white/20 text-white"
                : "bg-slate-100 dark:bg-white/10 text-ink-soft"
            }`}
          >
            {totalSetsCount}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ALL QUESTIONS VIEW */}
      {/* ========================================================================= */}
      {activeTab === "questions" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Filter and Search Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft text-sm">
                  <Search className="w-4 h-4 text-ink-soft" />
                </span>
                <Input
                  type="text"
                  placeholder="Search by keyword, question prompt, answer, or ID..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9 pr-8 text-xs h-10"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setCurrentPage(1);
                    }}
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
                    onClick={() => {
                      setSelectedSection(sec);
                      setCurrentPage(1);
                    }}
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
                    onClick={() => {
                      setSelectedLevel(lvl);
                      setCurrentPage(1);
                    }}
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
                    onClick={() => {
                      setSelectedDifficulty(diff);
                      setCurrentPage(1);
                    }}
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
          {isLoadingQuestions ? (
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
                  setCurrentPage(1);
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

                    {/* Reading Passage snippet */}
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
                        const isCorrect = opt.content === q.answer || opt.id === q.answer || Boolean(opt.isCorrect);
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
                  <div className="pt-2.5 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPreviewQuestion(q)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-ink-soft hover:text-ink bg-slate-100 dark:bg-white/5 hover:bg-slate-200/70 dark:hover:bg-white/10 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-ink-soft" />
                      <span>Inspect</span>
                    </button>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleOpenEditQuestionModal(q, e)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-primary dark:text-purple-300 bg-primary/10 hover:bg-primary/20 dark:bg-primary/15 dark:hover:bg-primary/25 border border-primary/20 transition-all shadow-xs"
                        title="Update Question"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Update</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteQuestion(q.id, e)}
                        disabled={deletingQuestionId === q.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 disabled:opacity-50 transition-all shadow-xs"
                        title="Delete Question"
                      >
                        {deletingQuestionId === q.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                        <span>Delete</span>
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
                    <th className="py-2.5 px-3 text-right">Actions</th>
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
                            onClick={() => setPreviewQuestion(q)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-ink-soft hover:text-ink bg-slate-100 dark:bg-white/5 hover:bg-slate-200/70 dark:hover:bg-white/10 transition-colors"
                            title="Inspect Question"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleOpenEditQuestionModal(q, e)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold text-primary dark:text-purple-300 bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-colors"
                            title="Update Question"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Update</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteQuestion(q.id, e)}
                            disabled={deletingQuestionId === q.id}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold text-rose-500 hover:text-rose-600 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 disabled:opacity-50 transition-colors"
                            title="Delete Question"
                          >
                            {deletingQuestionId === q.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                            <span>Delete</span>
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: QUESTION SETS VIEW */}
      {/* ========================================================================= */}
      {activeTab === "sets" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-ink-soft uppercase tracking-wider">Total Test Sets</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-ink font-mono">{totalSetsCount}</span>
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[10px] text-ink-soft">Configured diagnostic sets</p>
            </div>

            <div className="p-4 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-ink-soft uppercase tracking-wider">Active Sets</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {questionSets.filter((s) => s.isActive).length}
                </span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[10px] text-ink-soft">Currently live for testing</p>
            </div>

            <div className="p-4 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-ink-soft uppercase tracking-wider">Total Set Questions</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">
                  {questionSets.reduce((acc, s) => acc + (s.questionsCount || 0), 0)}
                </span>
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <ListChecks className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[10px] text-ink-soft">Linked across active sets</p>
            </div>

            <div className="p-4 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-ink-soft uppercase tracking-wider">Learner Attempts</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
                  {questionSets.reduce((acc, s) => acc + (s.attemptsCount || 0), 0)}
                </span>
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[10px] text-ink-soft">Diagnostic evaluations taken</p>
            </div>
          </div>

          {/* Sets Filter and Search Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft text-sm">
                  <Search className="w-4 h-4 text-ink-soft" />
                </span>
                <Input
                  type="text"
                  placeholder="Search question sets by name or description..."
                  value={setsSearchQuery}
                  onChange={(e) => {
                    setSetsSearchQuery(e.target.value);
                    setSetsPage(1);
                  }}
                  className="pl-9 pr-8 text-xs h-10"
                />
                {setsSearchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSetsSearchQuery("");
                      setSetsPage(1);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft mr-1">
                  Status:
                </span>
                {(["ALL", "ACTIVE", "INACTIVE"] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      setSetsStatusFilter(status);
                      setSetsPage(1);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      setsStatusFilter === status
                        ? "bg-primary text-white shadow-xs"
                        : "bg-slate-100 dark:bg-white/5 text-ink-soft hover:text-ink"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question Sets List */}
          {isLoadingSets ? (
            <div className="p-16 text-center text-ink-soft text-sm flex flex-col items-center justify-center gap-3">
              <span className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="font-semibold">Loading diagnostic question sets...</span>
            </div>
          ) : questionSets.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-paper-card border border-slate-200 dark:border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-ink">No Question Sets Found</h4>
              <p className="text-xs text-ink-soft max-w-md mx-auto">
                Create structured question sets to bundle placement and diagnostic test questions for learners.
              </p>
              <Button
                variant="gradient"
                size="sm"
                onClick={handleOpenCreateSetModal}
                className="mt-2 text-xs font-bold gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Question Set</span>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questionSets.map((set) => (
                <div
                  key={set.id}
                  className="p-5 rounded-2xl bg-paper-card border border-slate-200 dark:border-white/10 hover:border-primary/40 shadow-sm transition-all space-y-4 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {/* Header Row */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                          <Layers className="w-4 h-4" />
                        </span>
                        <span className="font-mono text-[11px] font-semibold text-ink-soft truncate max-w-[150px]">
                          ID: {set.id.slice(-6)}
                        </span>
                      </div>

                      {/* Active Status Badge & Quick Toggle */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleSetStatus(set, e)}
                        disabled={togglingSetId === set.id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${
                          set.isActive
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25"
                            : "bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20 hover:bg-slate-500/20"
                        }`}
                        title="Click to toggle set activation"
                      >
                        {togglingSetId === set.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <span
                            className={`w-2 h-2 rounded-full ${
                              set.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                            }`}
                          />
                        )}
                        <span>{set.isActive ? "Active Set" : "Inactive"}</span>
                      </button>
                    </div>

                    {/* Set Name & Description */}
                    <div>
                      <h3 className="font-bold text-base text-ink group-hover:text-primary dark:group-hover:text-purple-300 transition-colors">
                        {set.name}
                      </h3>
                      {set.description && (
                        <p className="text-xs text-ink-soft line-clamp-2 mt-1 leading-relaxed">
                          {set.description}
                        </p>
                      )}
                    </div>

                    {/* Metrics Strip */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 space-y-0.5">
                        <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">
                          Questions Included
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-ink">
                          <ListChecks className="w-3.5 h-3.5 text-primary" />
                          <span>{set.questionsCount || (set.questions?.length ?? 0)} Questions</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 space-y-0.5">
                        <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">
                          Test Submissions
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-ink">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>{set.attemptsCount || 0} Attempts</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-3 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => handleInspectSet(set)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-ink-soft hover:text-ink bg-slate-100 dark:bg-white/5 hover:bg-slate-200/70 dark:hover:bg-white/10 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-ink-soft" />
                      <span>Inspect Set</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleOpenEditSetModal(set, e)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-primary dark:text-purple-300 bg-primary/10 hover:bg-primary/20 dark:bg-primary/15 dark:hover:bg-primary/25 border border-primary/20 transition-all shadow-xs"
                        title="Edit Set"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteSet(set.id, e)}
                        disabled={deletingSetId === set.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 disabled:opacity-50 transition-all shadow-xs"
                        title="Delete Set"
                      >
                        {deletingSetId === set.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: INSPECT SINGLE QUESTION */}
      {/* ========================================================================= */}
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
                    opt.content === previewQuestion.answer ||
                    opt.id === previewQuestion.answer ||
                    Boolean(opt.isCorrect);
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
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const q = previewQuestion;
                    setPreviewQuestion(null);
                    handleOpenEditQuestionModal(q);
                  }}
                  className="text-primary hover:bg-primary/10 border-primary/30 text-xs font-semibold gap-1.5"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Update Question</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteQuestion(previewQuestion.id)}
                  className="text-rose-500 hover:text-rose-600 border-rose-500/30 hover:bg-rose-500/10 text-xs gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </Button>
              </div>
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

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT SINGLE QUESTION */}
      {/* ========================================================================= */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-xl bg-paper-card border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <div>
                <h3 className="font-brand text-lg font-bold text-ink">
                  {editingQuestion ? "Edit Question" : "Add New Question"}
                </h3>
                <p className="text-xs text-ink-soft">
                  {editingQuestion
                    ? `Update question prompt, passage context, answer choices, or explanation (ID: ${editingQuestion.id})`
                    : "Create and publish a diagnostic test question to the question bank."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="p-1 text-ink-soft hover:text-ink text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitQuestion} className="space-y-4">
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
                    Answer Choices * (Select radio corresponding to the correct answer)
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
                  Selected correct answer:{" "}
                  <strong className="text-emerald-600 dark:text-emerald-400 font-mono">
                    {formOptions[correctOptionIdx]?.content || "(Option empty)"}
                  </strong>
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
                  onClick={() => setIsFormModalOpen(false)}
                  disabled={isSubmittingQuestion}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gradient"
                  size="sm"
                  disabled={isSubmittingQuestion}
                  className="text-xs font-bold"
                >
                  {isSubmittingQuestion ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5" />
                      {editingQuestion ? "Updating Question..." : "Saving to Bank..."}
                    </>
                  ) : editingQuestion ? (
                    "Save Changes"
                  ) : (
                    "Save Question"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: INSPECT QUESTION SET DETAILS */}
      {/* ========================================================================= */}
      {inspectingSet && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-3xl bg-paper-card border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-primary/10 text-primary">
                    <Layers className="w-4 h-4" />
                  </span>
                  <h3 className="font-brand text-lg font-bold text-ink">{inspectingSet.name}</h3>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      inspectingSet.isActive
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                        : "bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20"
                    }`}
                  >
                    {inspectingSet.isActive ? "● Active Placement Set" : "○ Inactive"}
                  </span>
                </div>
                {inspectingSet.description && (
                  <p className="text-xs text-ink-soft">{inspectingSet.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setInspectingSet(null)}
                className="p-1 text-ink-soft hover:text-ink text-sm"
              >
                ✕
              </button>
            </div>

            {/* Set Statistics Bar */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 space-y-0.5">
                <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">
                  Total Questions
                </span>
                <p className="text-sm font-bold text-ink">
                  {inspectingSet.questions?.length ?? inspectingSet.questionsCount ?? 0} Questions
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 space-y-0.5">
                <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">
                  Learner Attempts
                </span>
                <p className="text-sm font-bold text-ink">
                  {inspectingSet.attemptsCount || 0} Submissions
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 space-y-0.5">
                <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">
                  Created
                </span>
                <p className="text-xs font-semibold text-ink">
                  {new Date(inspectingSet.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                  Questions Assigned to this Set
                </h4>
                <span className="text-xs font-semibold text-primary">
                  {inspectingSet.questions?.length || 0} Items
                </span>
              </div>

              {isLoadingSetDetails ? (
                <div className="p-8 text-center text-ink-soft text-xs flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span>Loading set questions...</span>
                </div>
              ) : !inspectingSet.questions || inspectingSet.questions.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 text-xs text-ink-soft">
                  No questions are currently attached to this set.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[45vh] overflow-y-auto pr-1">
                  {inspectingSet.questions.map((q, idx) => (
                    <div
                      key={q.id || idx}
                      className="p-3.5 rounded-xl bg-paper border border-slate-200 dark:border-white/10 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-ink-soft">
                            #{idx + 1}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getSectionBadgeClass(q.sectionType)}`}>
                            {q.sectionType}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary dark:text-purple-300">
                            {q.level}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold ${getDifficultyBadgeClass(q.difficulty)}`}>
                          ● {q.difficulty}
                        </span>
                      </div>

                      <p className="text-xs font-bold text-ink">{q.question}</p>

                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        {q.questionOptions.map((opt) => {
                          const isCorrect = opt.content === q.answer || opt.id === q.answer || Boolean(opt.isCorrect);
                          return (
                            <div
                              key={opt.id}
                              className={`p-1.5 px-2 rounded-lg text-[11px] font-mono border flex items-center justify-between ${
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
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const currentSet = inspectingSet;
                    setInspectingSet(null);
                    handleOpenEditSetModal(currentSet);
                  }}
                  className="text-xs font-semibold gap-1.5"
                >
                  <Pencil className="w-3.5 h-3.5 text-primary" />
                  <span>Edit Set & Questions</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteSet(inspectingSet.id)}
                  className="text-xs font-semibold text-rose-500 border-rose-500/30 hover:bg-rose-500/10 gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Set</span>
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setInspectingSet(null)}
                className="text-xs font-semibold"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT QUESTION SET */}
      {/* ========================================================================= */}
      {isSetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-3xl bg-paper-card border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <div>
                <h3 className="font-brand text-lg font-bold text-ink">
                  {editingSet ? "Edit Question Set" : "Create New Question Set"}
                </h3>
                <p className="text-xs text-ink-soft">
                  {editingSet
                    ? `Update question set configuration and question assignments (ID: ${editingSet.id})`
                    : "Configure a placement or diagnostic test set and select questions from the repository."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSetModalOpen(false)}
                className="p-1 text-ink-soft hover:text-ink text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitSet} className="space-y-5">
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <Label htmlFor="setName" className="text-xs font-semibold">
                    Set Name *
                  </Label>
                  <Input
                    id="setName"
                    placeholder="e.g. Standard CEFR Placement Set 1"
                    value={setName}
                    onChange={(e) => setSetName(e.target.value)}
                    required
                    className="text-xs h-10"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <Label htmlFor="setDescription" className="text-xs font-semibold">
                    Description (Optional)
                  </Label>
                  <Input
                    id="setDescription"
                    placeholder="e.g. Standard placement test set covering A1 to C1 levels"
                    value={setDescription}
                    onChange={(e) => setSetDescription(e.target.value)}
                    className="text-xs h-10"
                  />
                </div>

                {/* Active Switch */}
                <div className="sm:col-span-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="setIsActive" className="text-xs font-bold text-ink cursor-pointer">
                      Activate Set for Live Placement Tests
                    </Label>
                    <p className="text-[11px] text-ink-soft">
                      When enabled, learners will be evaluated using this active question set.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    id="setIsActive"
                    checked={setIsActive}
                    onChange={(e) => setSetIsActive(e.target.checked)}
                    className="accent-primary w-4 h-4 cursor-pointer"
                  />
                </div>
              </div>

              {/* ========================================================================= */}
              {/* QUESTION SELECTION BUILDER */}
              {/* ========================================================================= */}
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-primary" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-ink">
                      Select Questions for this Set
                    </h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                        selectedQuestionIds.length > 0
                          ? "bg-primary text-white shadow-xs"
                          : "bg-slate-100 dark:bg-white/10 text-ink-soft"
                      }`}
                    >
                      {selectedQuestionIds.length} Selected
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectAllFiltered(filteredPickerQuestions)}
                      className="text-[11px] h-7 px-2.5 font-semibold"
                    >
                      Select All Filtered ({filteredPickerQuestions.length})
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeselectAllFiltered(filteredPickerQuestions)}
                      className="text-[11px] h-7 px-2.5 font-semibold text-rose-500 hover:text-rose-600"
                    >
                      Clear
                    </Button>
                  </div>
                </div>

                {/* Selected Summary Chips */}
                {selectedBreakdown.count > 0 && (
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-1.5 animate-fadeIn">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-primary dark:text-purple-300">
                        Selected Set Distribution ({selectedBreakdown.count} Questions):
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 text-[10px]">
                      {Object.entries(selectedBreakdown.bySection).map(([sec, cnt]) => (
                        <span
                          key={sec}
                          className="px-2 py-0.5 rounded-md bg-paper border border-primary/20 font-semibold text-ink"
                        >
                          {sec}: <strong className="text-primary">{cnt}</strong>
                        </span>
                      ))}
                      {Object.entries(selectedBreakdown.byLevel).map(([lvl, cnt]) => (
                        <span
                          key={lvl}
                          className="px-2 py-0.5 rounded-md bg-paper border border-primary/20 font-semibold text-ink"
                        >
                          {lvl}: <strong className="text-primary">{cnt}</strong>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Question Search & Filters within modal */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 space-y-2.5">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
                    <Input
                      type="text"
                      placeholder="Search questions by prompt or ID..."
                      value={pickerSearch}
                      onChange={(e) => setPickerSearch(e.target.value)}
                      className="pl-8 pr-7 text-xs h-8 bg-paper"
                    />
                    {pickerSearch && (
                      <button
                        type="button"
                        onClick={() => setPickerSearch("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {/* Section Pill Filters */}
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold uppercase text-ink-soft">Sec:</span>
                      {["ALL", "GRAMMAR", "VOCABULARY", "READING"].map((sec) => (
                        <button
                          key={sec}
                          type="button"
                          onClick={() => setPickerSection(sec)}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                            pickerSection === sec
                              ? "bg-primary text-white"
                              : "bg-paper text-ink-soft hover:text-ink border border-slate-200 dark:border-white/10"
                          }`}
                        >
                          {sec === "ALL" ? "All" : sec.slice(0, 4)}
                        </button>
                      ))}
                    </div>

                    {/* Level Pill Filters */}
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold uppercase text-ink-soft">Lvl:</span>
                      {["ALL", "A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setPickerLevel(lvl)}
                          className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                            pickerLevel === lvl
                              ? "bg-primary text-white"
                              : "bg-paper text-ink-soft hover:text-ink border border-slate-200 dark:border-white/10"
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>

                    {/* Difficulty Pill Filters */}
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold uppercase text-ink-soft">Diff:</span>
                      {["ALL", "EASY", "MEDIUM", "HARD"].map((diff) => (
                        <button
                          key={diff}
                          type="button"
                          onClick={() => setPickerDifficulty(diff)}
                          className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                            pickerDifficulty === diff
                              ? "bg-primary text-white"
                              : "bg-paper text-ink-soft hover:text-ink border border-slate-200 dark:border-white/10"
                          }`}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Scrollable Questions Selection List */}
                {isLoadingAvailableQuestions ? (
                  <div className="p-8 text-center text-ink-soft text-xs flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span>Loading repository questions...</span>
                  </div>
                ) : filteredPickerQuestions.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-paper border border-slate-200 dark:border-white/10 text-xs text-ink-soft">
                    No questions matched your filter criteria.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[36vh] overflow-y-auto pr-1">
                    {filteredPickerQuestions.map((q) => {
                      const isSelected = selectedQuestionIds.includes(q.id);
                      return (
                        <div
                          key={q.id}
                          onClick={() => handleToggleQuestionSelection(q.id)}
                          className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                            isSelected
                              ? "bg-primary/5 border-primary/50 shadow-xs"
                              : "bg-paper border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
                          }`}
                        >
                          {/* Radio / Selection Indicator */}
                          <div className="pt-0.5 flex-shrink-0">
                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                                isSelected
                                  ? "bg-primary border-primary text-white shadow-xs"
                                  : "border-slate-300 dark:border-white/20 bg-paper"
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>

                          {/* Question Details */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${getSectionBadgeClass(q.sectionType)}`}>
                                  {q.sectionType}
                                </span>
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary dark:text-purple-300">
                                  {q.level}
                                </span>
                                <span className={`text-[9px] font-bold ${getDifficultyBadgeClass(q.difficulty)}`}>
                                  ● {q.difficulty}
                                </span>
                              </div>
                              <span className="font-mono text-[9px] text-ink-soft">
                                ID: {q.id.slice(-6)}
                              </span>
                            </div>

                            <p className="text-xs font-semibold text-ink line-clamp-2">
                              {q.question}
                            </p>

                            <p className="text-[11px] text-ink-soft font-mono">
                              Answer: <strong className="text-emerald-600 dark:text-emerald-400">{q.answer}</strong>
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-white/10">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSetModalOpen(false)}
                  disabled={isSubmittingSet}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gradient"
                  size="sm"
                  disabled={isSubmittingSet}
                  className="text-xs font-bold gap-1.5"
                >
                  {isSubmittingSet ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{editingSet ? "Updating Set..." : "Creating Set..."}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{editingSet ? "Save Changes" : "Create Question Set"}</span>
                    </>
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
