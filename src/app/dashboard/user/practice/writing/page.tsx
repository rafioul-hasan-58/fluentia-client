"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  PenTool,
  Sparkles,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Copy,
  RotateCcw,
  BookOpen,
  Award,
  Zap,
  Check,
} from "lucide-react";
import { fetchMyVocabularies } from "@/features/vocabulary/vocab-vault/api/vocabulary";
import { MyVocabularyItem } from "@/features/vocabulary/vocab-vault/types/vocabulary";

interface PromptItem {
  id: string;
  category: string;
  title: string;
  description: string;
  targetWordCount: number;
}

const PRESET_PROMPTS: PromptItem[] = [
  {
    id: "ielts-1",
    category: "IELTS Task 2",
    title: "AI and the Future of Education",
    description:
      "Some people argue that artificial intelligence will eventually replace human teachers in the classroom, while others believe that the human element is irreplaceable. Discuss both views and give your opinion.",
    targetWordCount: 250,
  },
  {
    id: "email-1",
    category: "Professional Email",
    title: "Project Timeline & Budget Request",
    description:
      "Write an email to your department director outlining recent milestones, explaining a delay caused by unexpected technical hurdles, and requesting an extension along with 10% additional budget.",
    targetWordCount: 150,
  },
  {
    id: "opinion-1",
    category: "Opinion Essay",
    title: "Remote Work vs Office Collaboration",
    description:
      "Has remote work improved productivity and work-life balance, or has it damaged teamwork, company culture, and mental well-being? Support your argument with specific examples.",
    targetWordCount: 200,
  },
  {
    id: "freeform",
    category: "Freeform",
    title: "Open Journal / Free Writing",
    description:
      "Write freely on any topic of your choice. Practice incorporating sophisticated vocabulary, varied sentence structures, and coherent transitional phrases.",
    targetWordCount: 100,
  },
];

interface AiEvaluation {
  estimatedCefr: string;
  overallBand: number;
  wordCount: number;
  grammarScore: number;
  vocabularyScore: number;
  coherenceScore: number;
  strengths: string[];
  suggestions: string[];
  enhancedVersion?: string;
}

export default function WritingPracticePage() {
  const [selectedPrompt, setSelectedPrompt] = useState<PromptItem>(PRESET_PROMPTS[0]);
  const [writingContent, setWritingContent] = useState("");
  const [vaultWords, setVaultWords] = useState<MyVocabularyItem[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [evaluation, setEvaluation] = useState<AiEvaluation | null>(null);
  const [copied, setCopied] = useState(false);

  // Load user vocabulary for word bank
  useEffect(() => {
    fetchMyVocabularies({ limit: 15 })
      .then((items) => setVaultWords(items))
      .catch((err) => console.warn("Failed to load vault words for writing helper", err));
  }, []);

  // Compute live statistics
  const wordCount = writingContent.trim() ? writingContent.trim().split(/\s+/).length : 0;
  const charCount = writingContent.length;
  const sentenceCount = writingContent.trim()
    ? (writingContent.match(/[.!?]+(?:\s|$)/g) || []).length || (wordCount > 0 ? 1 : 0)
    : 0;
  const readingTimeMins = Math.max(1, Math.ceil(wordCount / 200));

  // Insert word from vault into textarea
  const handleInsertWord = (wordText: string) => {
    setWritingContent((prev) => {
      const spacer = prev.length > 0 && !prev.endsWith(" ") ? " " : "";
      return prev + spacer + wordText + " ";
    });
  };

  const handleCopy = () => {
    if (!writingContent) return;
    navigator.clipboard.writeText(writingContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleAnalyze = () => {
    if (wordCount < 10) return;
    setIsAnalyzing(true);
    setEvaluation(null);

    // AI Evaluation analysis simulation based on text metrics and lexical complexity
    setTimeout(() => {
      const hasGoodLength = wordCount >= selectedPrompt.targetWordCount * 0.7;
      const averageWordLength =
        writingContent.replace(/\s+/g, "").length / Math.max(1, wordCount);

      let cefr = "B1 Intermediate";
      let band = 6.0;

      if (averageWordLength > 5.2 && wordCount >= 180) {
        cefr = "C1 Advanced";
        band = 7.5;
      } else if (averageWordLength > 4.6 && wordCount >= 120) {
        cefr = "B2 Upper-Intermediate";
        band = 6.5;
      }

      setEvaluation({
        estimatedCefr: cefr,
        overallBand: band,
        wordCount,
        grammarScore: hasGoodLength ? 8.5 : 7.0,
        vocabularyScore: averageWordLength > 4.8 ? 8.0 : 6.5,
        coherenceScore: sentenceCount >= 5 ? 8.0 : 6.5,
        strengths: [
          "Clear sentence progression with appropriate topic focus.",
          "Good use of connective phrases and contextual framing.",
          wordCount >= selectedPrompt.targetWordCount
            ? "Met the target word count threshold successfully."
            : "Direct and straightforward sentence structure.",
        ],
        suggestions: [
          "Try incorporating more varied clause structures (e.g. conditional sentences, passive voice in formal contexts).",
          "Replace repetitive descriptors with high-tier synonyms from your Vocabulary Vault.",
          "Ensure paragraphs begin with strong topic sentences before delving into supporting evidence.",
        ],
      });
      setIsAnalyzing(false);
    }, 1200);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6 animate-in fade-in duration-300">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/user/practice"
              className="text-xs font-semibold text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Practice Hub
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
              Writing Practice
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            AI Writing Studio
          </h1>
        </div>
      </div>

      {/* Prompt Selector */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Select Practice Prompt:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PRESET_PROMPTS.map((p) => {
            const isSelected = selectedPrompt.id === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelectedPrompt(p);
                  setEvaluation(null);
                }}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? "bg-purple-50/80 dark:bg-purple-950/40 border-purple-400 dark:border-purple-600 text-purple-900 dark:text-purple-100 shadow-2xs"
                    : "bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-300"
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    {p.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    ~{p.targetWordCount} words
                  </span>
                </div>
                <h4 className="text-xs font-bold truncate">{p.title}</h4>
              </button>
            );
          })}
        </div>

        {/* Selected Prompt Detail Callout */}
        <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/60 space-y-1">
          <div className="flex items-center gap-1.5 text-purple-700 dark:text-purple-300 text-xs font-bold">
            <PenTool className="w-3.5 h-3.5" />
            <span>{selectedPrompt.title}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {selectedPrompt.description}
          </p>
        </div>
      </div>

      {/* Target Word Bank Chips */}
      {vaultWords.length > 0 && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span>Vocabulary Bank (Click to insert):</span>
            </span>
            <span className="text-[10px] text-slate-400">From your saved words</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {vaultWords.slice(0, 10).map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => handleInsertWord(v.word.word)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-purple-100 dark:bg-slate-800 dark:hover:bg-purple-950/60 text-slate-700 hover:text-purple-700 dark:text-slate-300 dark:hover:text-purple-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                title={`Insert "${v.word.word}"`}
              >
                + {v.word.word}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Writing Studio Editor */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden flex flex-col">
        {/* Editor Toolbar */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 flex-wrap text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-4 font-mono">
            <span>
              Words:{" "}
              <strong
                className={
                  wordCount >= selectedPrompt.targetWordCount
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-slate-900 dark:text-white"
                }
              >
                {wordCount}
              </strong>{" "}
              / {selectedPrompt.targetWordCount}
            </span>
            <span>Sentences: <strong className="text-slate-900 dark:text-white">{sentenceCount}</strong></span>
            <span>Est. Read: <strong className="text-slate-900 dark:text-white">{readingTimeMins}m</strong></span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-xs font-medium"
              title="Copy text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm("Clear your current writing?")) {
                  setWritingContent("");
                  setEvaluation(null);
                }
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-xs font-medium text-rose-600"
              title="Clear editor"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Writing Textarea */}
        <textarea
          rows={12}
          value={writingContent}
          onChange={(e) => setWritingContent(e.target.value)}
          placeholder="Start writing your essay, response, or professional email here... Use sophisticated phrasing, connectors, and clear paragraphing."
          className="w-full p-5 sm:p-6 bg-transparent text-sm sm:text-base text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none resize-y leading-relaxed font-sans"
        />

        {/* Analyze Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 flex-wrap">
          <span className="text-xs text-slate-500">
            {wordCount < 10
              ? "Write at least 10 words to enable AI Evaluation."
              : "Ready for comprehensive AI grammar & vocabulary check."}
          </span>

          <button
            type="button"
            disabled={wordCount < 10 || isAnalyzing}
            onClick={handleAnalyze}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className={`w-4 h-4 ${isAnalyzing ? "animate-spin" : ""}`} />
            <span>{isAnalyzing ? "Analyzing Text..." : "Evaluate Writing with AI"}</span>
          </button>
        </div>
      </div>

      {/* AI Evaluation Report Card */}
      {evaluation && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-purple-200 dark:border-purple-800 shadow-lg space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between gap-3 flex-wrap pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  AI Writing Assessment
                </h3>
                <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                  Estimated Level: {evaluation.estimatedCefr}
                </span>
              </div>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block">
                Estimated Band
              </span>
              <span className="text-2xl font-extrabold text-purple-700 dark:text-purple-300 font-mono">
                {evaluation.overallBand.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Scores Breakdown Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500">Grammar & Syntax</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white font-mono">
                {evaluation.grammarScore} / 10
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500">Lexical Resource</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white font-mono">
                {evaluation.vocabularyScore} / 10
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500">Coherence & Structure</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white font-mono">
                {evaluation.coherenceScore} / 10
              </p>
            </div>
          </div>

          {/* Strengths & Improvement Suggestions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/60 space-y-2">
              <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Key Strengths
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {evaluation.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/60 space-y-2">
              <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Suggestions for Higher Bands
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {evaluation.suggestions.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
