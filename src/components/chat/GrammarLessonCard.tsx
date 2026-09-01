"use client";

import React, { useState } from "react";
import { TeachGrammarData } from "@/types/grammar";

interface GrammarLessonCardProps {
  data: TeachGrammarData;
  onActionSelect?: (prompt: string) => void;
}

export function GrammarLessonCard({ data, onActionSelect }: GrammarLessonCardProps) {
  const { lesson, skill, sessionId } = data;
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [isSpeakingRule, setIsSpeakingRule] = useState<boolean>(false);
  const [copiedSentence, setCopiedSentence] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  // Web Speech API for English pronunciation
  const speakText = (text: string, index?: number) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95;

    if (index !== undefined) {
      setSpeakingIndex(index);
      utterance.onend = () => setSpeakingIndex(null);
      utterance.onerror = () => setSpeakingIndex(null);
    } else {
      setIsSpeakingRule(true);
      utterance.onend = () => setIsSpeakingRule(false);
      utterance.onerror = () => setIsSpeakingRule(false);
    }

    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = (text: string, isFullLesson = false) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (isFullLesson) {
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
      } else {
        setCopiedSentence(text);
        setTimeout(() => setCopiedSentence(null), 2000);
      }
    }
  };

  const fullLessonText = `[Lesson: ${lesson.title}]\n\nRule:\n${lesson.rule}\n\nExamples:\n${lesson.examples
    .map((ex, i) => `${i + 1}. ${ex.sentence} (${ex.note})`)
    .join("\n")}\n\nCommon Mistakes:\n${lesson.commonMistakes.map((m) => `• ${m}`).join("\n")}`;

  return (
    <div className="w-full bg-paper border border-slate-200 dark:border-white/10 rounded-2xl p-5 md:p-6 shadow-sm space-y-5 text-ink animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-blue-500/20 shrink-0">
            📖
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-cyan-300">
                Grammar Masterclass
              </span>
              <span className="bg-primary/10 dark:bg-cyan-500/20 text-primary dark:text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/20 dark:border-cyan-500/30">
                {skill.name}
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-ink mt-0.5 font-display">
              {lesson.title}
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            onClick={() => speakText(`${lesson.title}. ${lesson.rule}`)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              isSpeakingRule
                ? "bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400 animate-pulse"
                : "bg-paper-card border-slate-200 dark:border-white/10 hover:border-primary/40 text-ink-soft hover:text-ink"
            }`}
            title="Listen to lesson explanation"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z"
              />
            </svg>
            <span>{isSpeakingRule ? "Speaking..." : "Listen"}</span>
          </button>

          <button
            type="button"
            onClick={() => copyToClipboard(fullLessonText, true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-paper-card border border-slate-200 dark:border-white/10 hover:border-primary/40 text-ink-soft hover:text-ink transition-all"
            title="Copy entire lesson"
          >
            {copiedAll ? (
              <>
                <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Core Rule Section */}
      <div className="bg-primary/5 dark:bg-blue-950/40 border border-primary/20 dark:border-blue-500/30 rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-primary dark:text-cyan-300 uppercase tracking-wider">
          <span>💡</span>
          <span>Core Rule & Structure</span>
        </div>
        <p className="text-sm md:text-[15px] font-medium text-ink leading-relaxed">
          {lesson.rule}
        </p>
      </div>

      {/* Examples Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-ink-soft uppercase tracking-wider flex items-center gap-1.5">
            <span>✨</span>
            <span>Real-World Examples ({lesson.examples.length})</span>
          </h4>
          <span className="text-[11px] text-ink-soft/70">Click speaker to hear pronunciation</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {lesson.examples.map((item, idx) => {
            const isSpeakingThis = speakingIndex === idx;
            const isCopiedThis = copiedSentence === item.sentence;

            return (
              <div
                key={idx}
                className="group p-3.5 rounded-xl bg-paper-card border border-slate-200/80 dark:border-white/5 hover:border-primary/40 dark:hover:border-blue-500/30 transition-all space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-ink font-sans tracking-wide">
                    &ldquo;<span className="text-primary dark:text-cyan-300 font-bold">{item.sentence}</span>&rdquo;
                  </p>

                  <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                    {/* Speaker Button */}
                    <button
                      type="button"
                      onClick={() => speakText(item.sentence, idx)}
                      className={`p-1.5 rounded-lg text-xs transition-colors ${
                        isSpeakingThis
                          ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 animate-pulse"
                          : "text-ink-soft hover:text-primary hover:bg-primary/10"
                      }`}
                      title="Listen to pronunciation"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z"
                        />
                      </svg>
                    </button>

                    {/* Copy Button */}
                    <button
                      type="button"
                      onClick={() => copyToClipboard(item.sentence)}
                      className="p-1.5 rounded-lg text-ink-soft hover:text-ink hover:bg-slate-200/50 dark:hover:bg-white/10 text-xs transition-colors"
                      title="Copy sentence"
                    >
                      {isCopiedThis ? (
                        <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Explanatory Note */}
                <div className="flex items-center gap-1.5 text-xs text-ink-soft dark:text-slate-300">
                  <span className="text-primary dark:text-cyan-400 font-bold text-[10px]">➜</span>
                  <span className="italic">{item.note}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Common Mistakes Section */}
      {lesson.commonMistakes && lesson.commonMistakes.length > 0 && (
        <div className="bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20 dark:border-rose-500/30 rounded-xl p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
            <span>⚠️</span>
            <span>Common Pitfalls to Avoid</span>
          </div>

          <ul className="space-y-2 text-xs md:text-sm text-ink-soft dark:text-slate-300">
            {lesson.commonMistakes.map((mistake, idx) => (
              <li key={idx} className="flex items-start gap-2 leading-relaxed">
                <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Interactive Quick Practice Chips */}
      {onActionSelect && (
        <div className="pt-2 border-t border-slate-200 dark:border-white/10 space-y-2">
          <span className="text-[11px] font-bold text-ink-soft uppercase tracking-wider block">
            Next Interactive Steps:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onActionSelect(`Quiz me on ${lesson.title}! Give me a multiple choice question.`)}
              className="px-3 py-1.5 rounded-lg bg-paper-card border border-slate-200 dark:border-white/10 hover:border-primary hover:bg-primary/5 text-xs font-semibold text-ink hover:text-primary transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <span>🎯</span>
              <span>Quiz Me on This</span>
            </button>
            <button
              type="button"
              onClick={() => onActionSelect(`Let me practice making a sentence using ${lesson.title}: `)}
              className="px-3 py-1.5 rounded-lg bg-paper-card border border-slate-200 dark:border-white/10 hover:border-primary hover:bg-primary/5 text-xs font-semibold text-ink hover:text-primary transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <span>✍️</span>
              <span>Write My Own Sentence</span>
            </button>
            <button
              type="button"
              onClick={() => onActionSelect(`Show me more advanced IELTS examples using ${lesson.title}.`)}
              className="px-3 py-1.5 rounded-lg bg-paper-card border border-slate-200 dark:border-white/10 hover:border-primary hover:bg-primary/5 text-xs font-semibold text-ink hover:text-primary transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <span>🚀</span>
              <span>Advanced IELTS Examples</span>
            </button>
          </div>
        </div>
      )}

      {/* Session ID footer badge */}
      {sessionId && (
        <div className="flex items-center justify-between text-[10px] text-ink-soft/60 pt-1">
          <span>Active Learning Session</span>
          <span className="font-mono">ID: {sessionId.slice(0, 10)}...</span>
        </div>
      )}
    </div>
  );
}
