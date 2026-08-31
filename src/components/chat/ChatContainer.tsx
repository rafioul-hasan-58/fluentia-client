"use client";

import React, { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
}

const SKILL_OPTIONS = [
  { id: "speaking", label: "🗣️ Speaking Practice", prompt: "Hello! Let's practice spoken English. How are you feeling today, and what would you like to talk about?" },
  { id: "vocabulary", label: "📚 Vocabulary Building", prompt: "Welcome to Vocabulary Practice! Give me a topic, or ask me for new advanced collocations and idioms to practice today." },
  { id: "grammar", label: "✍️ Grammar & Syntax", prompt: "Grammar mode activated! Paste any sentence you'd like me to analyze and correct, or ask a grammar question." },
  { id: "reading", label: "📖 Reading Comprehension", prompt: "Let's work on Reading skills. I can provide a short paragraph with comprehension questions whenever you're ready." },
  { id: "writing", label: "📝 Writing Assistant", prompt: "Welcome to Writing Practice! Paste an essay paragraph or email draft and I'll help you refine its clarity and style." },
  { id: "listening", label: "🎧 Listening Practice", prompt: "Listening mode active! I'll share spoken scenarios and ask you follow-up questions to test your listening comprehension." },
  { id: "ielts", label: "🎯 IELTS Speaking Coach", prompt: "Welcome to IELTS Prep! Let's start with Part 1: 'Can you describe the neighborhood or town where you grew up?'" },
  { id: "casual", label: "☕ Casual Chit-Chat", prompt: "Hey there! Ready to chat about everyday life, hobbies, travel, or movies? How has your day been?" },
];

export function ChatContainer() {
  const [selectedSkill, setSelectedSkill] = useState<string>("speaking");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: SKILL_OPTIONS[0].prompt,
      timestamp: "Just now",
    },
  ]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSkillChange = (skillId: string) => {
    setSelectedSkill(skillId);
    const chosen = SKILL_OPTIONS.find((s) => s.id === skillId) || SKILL_OPTIONS[0];
    setMessages([
      {
        id: Date.now().toString(),
        sender: "ai",
        text: chosen.prompt,
        timestamp: "Just now",
      },
    ]);
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setInputValue("I really enjoy practicing English conversation every day with Fluentia.");
      }, 2500);
    } else {
      setIsRecording(false);
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userText,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      let aiText = "";
      const lower = userText.toLowerCase();

      if (selectedSkill === "grammar") {
        aiText = `Great effort! Your sentence "${userText}" is clearly understood. To make it sound even more natural: try phrasing it with varied conjunctions. Keep going!`;
      } else if (selectedSkill === "vocabulary") {
        aiText = `Good point! A great advanced idiom or phrase you can use here is "broaden your horizons" or "hit the ground running". How would you use that in a sentence?`;
      } else if (selectedSkill === "ielts") {
        aiText = `Well answered! You gave a clear response. For IELTS Part 1 & 2, expanding with a specific example or sensory detail will boost your Fluency & Coherence score. What else can you add?`;
      } else {
        aiText = `That's very interesting! Thanks for sharing. How long have you felt that way, and what do you think is the best next step?`;
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiText,
        timestamp: "Just now",
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Header with Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-paper-card border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-ink">
            AI English Coach
          </h1>
          <p className="text-xs text-ink-soft">
            Select a skill and chat naturally with your AI tutor
          </p>
        </div>

        {/* Skill Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="skill-select" className="text-xs font-semibold text-ink-soft whitespace-nowrap">
            Practice Skill:
          </label>
          <select
            id="skill-select"
            value={selectedSkill}
            onChange={(e) => handleSkillChange(e.target.value)}
            className="bg-paper border border-slate-200 dark:border-white/10 text-ink text-sm font-medium rounded-xl px-3.5 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer shadow-xs"
          >
            {SKILL_OPTIONS.map((skill) => (
              <option key={skill.id} value={skill.id} className="bg-paper-card text-ink">
                {skill.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Single Chatbox Container */}
      <div className="bg-paper-card border border-slate-200 dark:border-white/10 rounded-3xl shadow-sm overflow-hidden flex flex-col h-[600px]">
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-paper/30">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  isUser ? "items-end" : "items-start"
                } space-y-1`}
              >
                <span className="text-[10px] text-ink-soft px-1">
                  {isUser ? "You" : "Fluentia AI"} • {msg.timestamp}
                </span>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isUser
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none shadow-sm"
                      : "bg-paper border border-slate-200 dark:border-white/10 text-ink rounded-tl-none shadow-xs"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex flex-col items-start space-y-1">
              <span className="text-[10px] text-ink-soft px-1">Fluentia AI is typing...</span>
              <div className="bg-paper border border-slate-200 dark:border-white/10 rounded-2xl rounded-tl-none px-4 py-3 text-sm flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar with Capsule Pill, Mic, and Circular Upward Arrow Button */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 bg-paper-card border-t border-slate-200 dark:border-white/10"
        >
          <div className="relative flex items-center bg-paper border border-slate-200 dark:border-white/10 rounded-full pl-5 pr-2 py-1.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-xs">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isRecording ? "Listening to your voice..." : "Type your message in English..."}
              className="flex-1 bg-transparent text-sm text-ink placeholder-ink-soft/60 focus:outline-none pr-3"
            />

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Microphone Icon Button */}
              <button
                type="button"
                onClick={toggleRecording}
                className={`p-2 rounded-full text-ink-soft hover:text-ink hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors ${
                  isRecording ? "text-rose-500 animate-pulse bg-rose-500/10" : ""
                }`}
                title={isRecording ? "Recording..." : "Voice input"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>

              {/* Circular Gradient Upward Arrow Send Button (Matching user image) */}
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-blue-600 via-primary to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-200 disabled:to-slate-300 dark:disabled:from-white/10 dark:disabled:to-white/5 disabled:text-ink-soft text-white flex items-center justify-center font-bold transition-all duration-200 active:scale-90 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/40"
                aria-label="Send message"
              >
                <svg className="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
