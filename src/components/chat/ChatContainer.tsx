"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  ChatMessage,
  SkillSummary,
  GrammarSkillPreset,
  TeachGrammarData,
} from "@/types/grammar";
import {
  teachGrammar,
  fetchSkills,
  DEFAULT_GRAMMAR_PRESETS,
} from "@/lib/api/grammar";
import { GrammarLessonCard } from "./GrammarLessonCard";

export function ChatContainer() {
  const [skills, setSkills] = useState<SkillSummary[]>([]);
  const [selectedSkillSlug, setSelectedSkillSlug] = useState<string>("first_conditional");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [lastSessionId, setLastSessionId] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({ turns: 0, accuracy: 96, xp: 45 });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Load skills on mount
  useEffect(() => {
    async function loadSkills() {
      try {
        const list = await fetchSkills();
        if (list && list.length > 0) {
          setSkills(list);
        } else {
          setSkills(
            DEFAULT_GRAMMAR_PRESETS.map((p) => ({
              slug: p.slug,
              name: p.name,
              category: p.category,
              cefr: p.cefr,
            }))
          );
        }
      } catch {
        setSkills(
          DEFAULT_GRAMMAR_PRESETS.map((p) => ({
            slug: p.slug,
            name: p.name,
            category: p.category,
            cefr: p.cefr,
          }))
        );
      }
    }
    loadSkills();
  }, []);

  // Initialize first welcome message when active skill changes
  useEffect(() => {
    const currentPreset = DEFAULT_GRAMMAR_PRESETS.find(
      (p) => p.slug === selectedSkillSlug
    );
    const skillName =
      currentPreset?.name ||
      skills.find((s) => s.slug === selectedSkillSlug)?.name ||
      "Grammar Skill";

    const initialAiMessage: ChatMessage = {
      id: `welcome-${selectedSkillSlug}`,
      sender: "ai",
      text: `👋 Welcome! You've selected **${skillName}**.\n\nAsk any question (e.g. *"When should I use will vs would?"*) or click one of the suggested prompts below to generate your personalized interactive lesson!`,
      timestamp: "Just now",
    };

    setMessages([initialAiMessage]);
  }, [selectedSkillSlug, skills]);

  // Scroll to bottom on new message or typing state change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Find active preset for sample prompts
  const activePreset: GrammarSkillPreset | undefined =
    DEFAULT_GRAMMAR_PRESETS.find((p) => p.slug === selectedSkillSlug) || {
      slug: selectedSkillSlug,
      name:
        skills.find((s) => s.slug === selectedSkillSlug)?.name ||
        "Grammar Concept",
      category: "grammar",
      cefr: "B1",
      samplePrompts: [
        "Explain the core rule and structure",
        "When should I use this in daily English?",
        "Give me real-world examples with explanations",
        "What are the most common mistakes?",
      ],
    };

  // Voice recording logic
  const toggleRecording = () => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!isRecording) {
        try {
          const recognition = new SpeechRecognitionClass();
          recognition.lang = "en-US";
          recognition.interimResults = false;
          recognition.maxAlternatives = 1;

          recognition.onstart = () => setIsRecording(true);
          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInputValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
            setIsRecording(false);
          };
          recognition.onerror = () => setIsRecording(false);
          recognition.onend = () => setIsRecording(false);

          recognitionRef.current = recognition;
          recognition.start();
        } catch {
          simulateRecording();
        }
      } else {
        recognitionRef.current?.stop();
        setIsRecording(false);
      }
    } else {
      simulateRecording();
    }
  };

  const simulateRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setInputValue(
          activePreset?.samplePrompts[0] || "When should I use will vs would?"
        );
      }, 2000);
    } else {
      setIsRecording(false);
    }
  };

  // Send prompt to Teach API
  const handleSendMessage = async (promptToSend?: string) => {
    const userPromptText = (promptToSend ?? inputValue).trim();
    if (!userPromptText || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: userPromptText,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await teachGrammar({
        skillSlug: selectedSkillSlug,
        userPrompt: userPromptText,
      });

      if (response.success && response.data?.lesson) {
        const teachData: TeachGrammarData = response.data;
        setLastSessionId(teachData.sessionId);

        const aiLessonMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          timestamp: "Just now",
          lessonData: teachData,
        };

        setMessages((prev) => [...prev, aiLessonMessage]);
        setMetrics((prev) => ({
          turns: prev.turns + 1,
          accuracy: Math.min(99, prev.accuracy + 1),
          xp: prev.xp + 25,
        }));
      } else {
        throw new Error(response.message || "Failed to generate grammar lesson");
      }
    } catch (error: any) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: `⚠️ **Unable to load lesson:** ${
          error.message || "Connection to the grammar service failed."
        }\n\nPlease check that the server is running at \`http://localhost:5000\` and try again.`,
        timestamp: "Just now",
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handlePromptChipClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Top Header & Skill Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 md:p-5 bg-paper-card border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-primary to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/25 shrink-0">
            ✨
          </div>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-ink flex items-center gap-2">
              AI Grammar & Skill Coach
            </h1>
            <p className="text-xs text-ink-soft">
              Select a grammar skill to receive AI-powered rules, examples, and mistake analysis
            </p>
          </div>
        </div>

        {/* Skill Selector Dropdown */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <label
            htmlFor="grammar-skill-select"
            className="text-xs font-bold text-ink-soft whitespace-nowrap"
          >
            Skill:
          </label>
          <div className="relative">
            <select
              id="grammar-skill-select"
              value={selectedSkillSlug}
              onChange={(e) => setSelectedSkillSlug(e.target.value)}
              className="bg-paper border border-slate-200 dark:border-white/10 text-ink text-xs sm:text-sm font-semibold rounded-xl px-3.5 py-2 pr-8 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer shadow-xs appearance-none"
            >
              {skills.length > 0 ? (
                skills.map((skill) => (
                  <option
                    key={skill.slug}
                    value={skill.slug}
                    className="bg-paper-card text-ink"
                  >
                    {skill.cefr ? `[${skill.cefr}] ` : ""}
                    {skill.name}
                  </option>
                ))
              ) : (
                DEFAULT_GRAMMAR_PRESETS.map((p) => (
                  <option
                    key={p.slug}
                    value={p.slug}
                    className="bg-paper-card text-ink"
                  >
                    [{p.cefr}] {p.name}
                  </option>
                ))
              )}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-ink-soft">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Starter Prompt Chips */}
      {activePreset && activePreset.samplePrompts?.length > 0 && (
        <div className="bg-paper-card/60 border border-slate-200/80 dark:border-white/5 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs text-ink-soft font-semibold">
            <span className="flex items-center gap-1.5 text-primary dark:text-cyan-300">
              <span>💡</span>
              <span>Quick Prompt Inspiration for {activePreset.name}:</span>
            </span>
            <span className="text-[11px] text-ink-soft/70">Click to ask instantly</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {activePreset.samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePromptChipClick(prompt)}
                disabled={isTyping}
                className="px-3 py-1.5 rounded-xl bg-paper border border-slate-200 dark:border-white/10 hover:border-primary/50 dark:hover:border-cyan-400/50 hover:bg-primary/5 dark:hover:bg-cyan-500/10 text-xs font-medium text-ink transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 text-left shadow-2xs"
              >
                &ldquo;{prompt}&rdquo;
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Single Chatbox Container */}
      <div className="bg-paper-card border border-slate-200 dark:border-white/10 rounded-3xl shadow-sm overflow-hidden flex flex-col h-[640px]">
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-paper/30">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  isUser ? "items-end" : "items-start"
                } space-y-1`}
              >
                {/* Message Header */}
                <div className="flex items-center gap-1.5 text-[11px] text-ink-soft px-1">
                  {!isUser && (
                    <div className="relative w-4 h-4 rounded-full overflow-hidden shrink-0">
                      <Image
                        src="/logo.png"
                        alt="Fluentia AI"
                        width={16}
                        height={16}
                        className="object-contain w-full h-full"
                      />
                    </div>
                  )}
                  <span>{isUser ? "You" : "Fluentia AI Coach"}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Lesson Card or Standard Bubble */}
                {msg.lessonData ? (
                  <div className="w-full max-w-3xl">
                    <GrammarLessonCard
                      data={msg.lessonData}
                      onActionSelect={(prompt) => {
                        setInputValue(prompt);
                      }}
                    />
                  </div>
                ) : (
                  <div
                    className={`max-w-[88%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      isUser
                        ? "bg-gradient-to-r from-blue-600 via-primary to-indigo-600 text-white rounded-tr-none shadow-sm shadow-blue-500/20"
                        : msg.isError
                        ? "bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-tl-none"
                        : "bg-paper border border-slate-200 dark:border-white/10 text-ink rounded-tl-none shadow-2xs"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* AI Typing / Generating Lesson Skeleton */}
          {isTyping && (
            <div className="flex flex-col items-start space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] text-ink-soft px-1">
                <div className="relative w-4 h-4 rounded-full overflow-hidden shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Fluentia AI"
                    width={16}
                    height={16}
                    className="object-contain w-full h-full"
                  />
                </div>
                <span className="text-primary dark:text-cyan-300 font-semibold">
                  Fluentia AI is generating your lesson...
                </span>
              </div>
              <div className="bg-paper border border-slate-200 dark:border-white/10 rounded-2xl rounded-tl-none px-5 py-3.5 text-sm flex items-center gap-2 shadow-2xs">
                <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                <span className="text-xs text-ink-soft font-medium pl-2">
                  Analyzing grammar rules & generating examples...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar with Capsule Pill, Mic, and Gradient Arrow */}
        <form
          onSubmit={handleFormSubmit}
          className="p-4 bg-paper-card border-t border-slate-200 dark:border-white/10"
        >
          <div className="relative flex items-center bg-paper border border-slate-200 dark:border-white/10 rounded-full pl-5 pr-2 py-1.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-xs">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                isRecording
                  ? "Listening to your voice..."
                  : `Ask about ${activePreset?.name || "grammar"} (e.g. When should I use will vs would?)...`
              }
              disabled={isTyping}
              className="flex-1 bg-transparent text-sm text-ink placeholder-ink-soft/60 focus:outline-none pr-3 disabled:opacity-50"
            />

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Microphone Icon Button */}
              <button
                type="button"
                onClick={toggleRecording}
                disabled={isTyping}
                className={`p-2 rounded-full text-ink-soft hover:text-ink hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors disabled:opacity-50 ${
                  isRecording ? "text-rose-500 animate-pulse bg-rose-500/10" : ""
                }`}
                title={isRecording ? "Recording... click to stop" : "Voice input"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </button>

              {/* Circular Gradient Upward Arrow Send Button */}
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-blue-600 via-primary to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-200 disabled:to-slate-300 dark:disabled:from-white/10 dark:disabled:to-white/5 disabled:text-ink-soft text-white flex items-center justify-center font-bold transition-all duration-200 active:scale-90 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/40"
                aria-label="Send prompt to AI"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
