"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageBubble, ChatMessage } from "./MessageBubble";
import { ScenarioSelector, SCENARIOS } from "./ScenarioSelector";
import { LiveMetrics } from "./LiveMetrics";

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  casual: [
    {
      id: "1",
      sender: "ai",
      text: "Hey there! Ready to chat? How has your week been going so far? Did you get a chance to relax or work on any exciting projects?",
      timestamp: "Just now",
      feedback: {
        explanation: "This is an open-ended conversational icebreaker. Feel free to use past tense verbs (went, stayed, visited) or present continuous (working, studying).",
        betterAlternatives: [
          "It has been pretty hectic, but I managed to catch up on sleep.",
          "I've been working on a new web project and making good progress!",
        ],
        vocabularyScore: 10,
      },
    },
  ],
  ielts: [
    {
      id: "1",
      sender: "ai",
      text: "Welcome to IELTS Speaking Practice. Let's start with Part 1: 'Do you prefer spending your free time indoors or outdoors, and why?'",
      timestamp: "Just now",
      feedback: {
        explanation: "For IELTS Speaking Part 1, aim for 2-3 full sentences with varied conjunctions (e.g. 'Although I enjoy...', 'It largely depends on...').",
        betterAlternatives: [
          "I would definitely say I'm an outdoor enthusiast because being in nature rejuvenates my energy.",
          "To be honest, it largely depends on the weather and my workload.",
        ],
        vocabularyScore: 25,
      },
    },
  ],
  interview: [
    {
      id: "1",
      sender: "ai",
      text: "Hello! Welcome to our mock interview session. Let's begin: 'Can you tell me about a challenging situation you faced at work and how you handled it?'",
      timestamp: "Just now",
      feedback: {
        explanation: "Use the STAR method (Situation, Task, Action, Result). Highlight your proactive attitude and measurable outcomes.",
        betterAlternatives: [
          "In my previous role, we encountered a critical deadline crunch, so I spearheaded a reorganization of our task pipeline...",
        ],
        vocabularyScore: 30,
      },
    },
  ],
  grammar: [
    {
      id: "1",
      sender: "ai",
      text: "Welcome to Grammar Doctor! Paste any sentence or paragraph you are unsure about, or ask me to test you on a grammatical topic (e.g., Conditionals, Inversion, Subjunctive mood).",
      timestamp: "Just now",
      feedback: {
        explanation: "You can write complex sentences to check subject-verb agreement, article usage, and punctuation.",
        vocabularyScore: 15,
      },
    },
  ],
};

const SUGGESTED_PROMPTS: Record<string, string[]> = {
  casual: [
    "I went for a hike in the mountains last Sunday.",
    "I've been trying to learn cooking Italian food recently.",
    "Can you recommend a good book to improve my vocabulary?",
  ],
  ielts: [
    "I definitely prefer spending time outdoors when the weather permits.",
    "In my hometown, the climate is quite humid throughout the year.",
  ],
  interview: [
    "I led a cross-functional team to resolve a major technical bottleneck.",
    "My biggest strength is clear communication under tight deadlines.",
  ],
  grammar: [
    "If I would have known, I would have told you.",
    "Neither of the solutions were acceptable.",
  ],
};

export function ChatContainer() {
  const [selectedScenario, setSelectedScenario] = useState<string>("casual");
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES.casual);
  const [inputVal, setInputVal] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [earnedXP, setEarnedXP] = useState<number>(45);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleScenarioChange = (id: string) => {
    setSelectedScenario(id);
    setMessages(INITIAL_MESSAGES[id] || INITIAL_MESSAGES.casual);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: text,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputVal("");
    setIsTyping(true);

    setTimeout(() => {
      let aiText = "";
      let explanation = "";
      let alternatives: string[] = [];
      const xpGain = 15;

      const lower = text.toLowerCase();
      if (selectedScenario === "ielts") {
        aiText = "That's a well-constructed point! You demonstrated good fluency. To push your score towards Band 8, try linking your ideas with more complex transitional phrases and idiomatic collocations.";
        explanation = "Band Descriptor note: Expanding on 'why' with specific sensory details or contrasting examples elevates Fluency & Coherence.";
        alternatives = [
          "Having said that, I do appreciate a quiet evening at home occasionally.",
          "Furthermore, it gives me an invaluable opportunity to unwind and recharge.",
        ];
      } else if (selectedScenario === "grammar") {
        if (lower.includes("if i would have")) {
          aiText = "Good try! Here is a grammar correction: in the 'if'-clause of a Third Conditional, use the Past Perfect ('If I had known'), not 'would have'.";
          explanation = "Rule: 'If + had + past participle, would have + past participle'.";
          alternatives = [
            "If I had known about the change, I would have told you immediately.",
          ];
        } else {
          aiText = "Your sentence grammar is solid! The subject and predicate are aligned correctly, and the tense consistency is maintained throughout.";
          explanation = "Grammar health check passed with zero fatal structural errors.";
          alternatives = [
            "Try converting this into a compound-complex structure for even richer syntax.",
          ];
        }
      } else {
        aiText = `That sounds wonderful! Thank you for sharing. How long have you been interested in that, and what inspired you in the first place?`;
        explanation = "Great use of conversational pacing. Your sentence conveys your message clearly with natural rhythm.";
        alternatives = [
          "I've always had a passion for it since my early college days.",
          "It actually started out as a casual hobby before turning into a daily routine.",
        ];
      }

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiText,
        timestamp: "Just now",
        feedback: {
          explanation,
          betterAlternatives: alternatives,
          vocabularyScore: xpGain,
        },
      };

      setMessages((prev) => [...prev, aiResponse]);
      setEarnedXP((prev) => prev + xpGain);
      setIsTyping(false);
    }, 1200);
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setInputVal("I really enjoy practicing English conversation every day with Fluentia.");
      }, 2500);
    } else {
      setIsRecording(false);
    }
  };

  const userTurnCount = messages.filter((m) => m.sender === "user").length;
  const currentScenario = SCENARIOS.find((s) => s.id === selectedScenario);

  return (
    <div className="space-y-6 text-ink">
      {/* Header & Scenario Selector */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink flex items-center gap-2.5">
              <span>AI English Coach</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 dark:bg-cyan-500/20 text-primary dark:text-cyan-300 border border-primary/20 dark:border-cyan-500/30">
                Live Interactive
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-ink-soft mt-0.5">
              Practice real conversations, receive instant grammar corrections, and improve fluency.
            </p>
          </div>
        </div>

        {/* Practice Scenario Selector */}
        <ScenarioSelector
          activeScenarioId={selectedScenario}
          onSelectScenario={handleScenarioChange}
        />
      </div>

      {/* Main Chat + Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Chat Feed Column */}
        <div className="lg:col-span-8 bg-paper-card border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[640px]">
          {/* Active Mode Banner */}
          <div className="px-6 py-3.5 bg-slate-50 dark:bg-[#080e21] border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">{currentScenario?.icon}</span>
              <div>
                <span className="text-xs font-bold text-ink block">{currentScenario?.title}</span>
                <span className="text-[11px] text-ink-soft line-clamp-1">{currentScenario?.description}</span>
              </div>
            </div>

            <button
              onClick={() => setMessages(INITIAL_MESSAGES[selectedScenario])}
              className="text-xs text-ink-soft hover:text-primary dark:hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg bg-slate-200/50 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10"
              title="Reset conversation"
            >
              <span>↺</span>
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-paper/40">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {isTyping && (
              <div className="flex flex-col items-start space-y-1">
                <span className="text-[11px] text-ink-soft px-1">Fluentia Coach is thinking...</span>
                <div className="bg-paper-card border border-slate-200 dark:border-white/10 rounded-2xl rounded-tl-none px-4 py-3 text-sm flex gap-1.5 items-center shadow-sm">
                  <span className="w-2 h-2 bg-primary dark:bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-primary dark:bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-primary dark:bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompts */}
          <div className="px-4 py-2 bg-slate-50 dark:bg-[#080e21] border-t border-slate-200 dark:border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider whitespace-nowrap">
              Suggestions:
            </span>
            {SUGGESTED_PROMPTS[selectedScenario]?.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="text-xs bg-paper hover:bg-primary/10 hover:text-primary dark:hover:bg-cyan-500/20 dark:hover:text-cyan-300 border border-slate-200 dark:border-white/10 hover:border-primary/40 dark:hover:border-cyan-500/40 px-3 py-1.5 rounded-full whitespace-nowrap text-ink-soft transition-all duration-200 shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-4 bg-paper-card border-t border-slate-200 dark:border-white/10 flex items-center gap-3"
          >
            <button
              type="button"
              onClick={toggleRecording}
              className={`p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-center ${
                isRecording
                  ? "bg-rose-500/20 border-rose-400 text-rose-500 animate-pulse"
                  : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-ink-soft hover:text-primary dark:hover:text-cyan-300"
              }`}
              title={isRecording ? "Listening..." : "Click to speak"}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>

            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={
                isRecording
                  ? "Listening to your voice..."
                  : "Type your English response or paste text..."
              }
              className="flex-1 bg-paper border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary dark:focus:border-cyan-400 text-ink placeholder-ink-soft/60 transition-all"
            />

            <button
              type="submit"
              disabled={!inputVal.trim() || isTyping}
              className="px-5 py-3 rounded-xl bg-primary hover:bg-primary-dark disabled:bg-slate-200 dark:disabled:bg-white/5 disabled:text-ink-soft text-white text-sm font-semibold transition-all duration-200 active:scale-95 shadow-sm flex items-center gap-1.5"
            >
              <span>Send</span>
              <span>→</span>
            </button>
          </form>
        </div>

        {/* Analytics & Tips Column */}
        <div className="lg:col-span-4 space-y-6">
          <LiveMetrics
            messageCount={userTurnCount}
            grammarScore={96}
            vocabXP={earnedXP}
            activeLevel="Intermediate B2"
          />

          {/* Quick Learning Tip */}
          <div className="bg-paper-card border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-amber text-lg">✨</span>
              <h3 className="text-xs font-bold text-primary dark:text-cyan-300 uppercase tracking-wider">Coach Pro-Tip</h3>
            </div>
            <p className="text-xs text-ink-soft leading-relaxed">
              Try to incorporate cohesive linking words like <strong className="text-ink font-semibold">"Consequently"</strong>, <strong className="text-ink font-semibold">"Furthermore"</strong>, or <strong className="text-ink font-semibold">"In contrast"</strong> to sound more fluent.
            </p>
          </div>

          {/* Vocabulary Snapshot */}
          <div className="bg-paper-card border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-primary dark:text-cyan-300 uppercase tracking-wider">Recent Collocations</h3>
            <div className="flex flex-wrap gap-2">
              {["make progress", "unwind & recharge", "hectic schedule", "sensory details"].map((word, i) => (
                <span key={i} className="text-xs bg-primary/10 dark:bg-cyan-500/10 text-primary dark:text-cyan-300 font-medium px-2.5 py-1 rounded-lg border border-primary/20 dark:border-cyan-500/20">
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
