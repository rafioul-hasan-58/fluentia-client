"use client";

import React, { useState } from "react";
import Image from "next/image";

interface Message {
  sender: "ai" | "user";
  text: string;
}

export function ChatDemo() {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([
    {
      sender: "ai",
      text: "Hello! I am your Fluentia AI English Coach. Let's practice. How was your day today?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMsg = userInput;
    setChatHistory((prev) => [...prev, { sender: "user", text: userMsg }]);
    setUserInput("");
    setIsTyping(true);

    setTimeout(() => {
      let aiFeedback = "";
      const lower = userMsg.toLowerCase();
      if (lower.includes("good") || lower.includes("fine")) {
        aiFeedback =
          "Great to hear that! 'My day was good' is common, but you could also say 'It has been quite productive!' or 'I had a wonderful day.' Let's try describing one thing you did today using a new phrase!";
      } else {
        aiFeedback =
          "Interesting! Tell me more about it. By the way, your sentence structure looks correct. If you want to sound more natural, you could also say: 'It was a bit challenging, but I managed.'";
      }

      setChatHistory((prev) => [...prev, { sender: "ai", text: aiFeedback }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div id="demo" className="bg-paper-card border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden max-w-lg mx-auto transform hover:translate-y-[-2px] transition-all duration-300 backdrop-blur-xl text-ink">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-900 dark:to-indigo-900 px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-white/10 text-white">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-white/20 p-1 flex items-center justify-center backdrop-blur-md border border-white/20">
              <Image
                src="/logo.png"
                alt="Fluentia Coach"
                width={32}
                height={32}
                className="object-contain w-full h-full"
              />
            </div>
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-cyan-400 ring-2 ring-blue-700 animate-pulse" />
          </div>
          <div>
            <div className="text-sm font-semibold font-brand text-white leading-tight">Fluentia Coach</div>
            <div className="text-[11px] text-cyan-200/90">Online & Ready to teach</div>
          </div>
        </div>
        <span className="text-[11px] font-semibold bg-white/20 px-2.5 py-1 rounded-full text-white border border-white/20">
          Interactive Demo
        </span>
      </div>

      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto p-6 space-y-4 bg-paper/50">
        {chatHistory.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${
              msg.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            <div className="flex items-center gap-1.5 text-[10px] text-ink-soft mb-1 px-1">
              {msg.sender === "ai" && (
                <div className="relative w-3.5 h-3.5 rounded-full overflow-hidden shrink-0">
                  <Image
                    src="/logo.png"
                    alt="Fluentia"
                    width={14}
                    height={14}
                    className="object-contain w-full h-full"
                  />
                </div>
              )}
              <span className="font-brand font-semibold">{msg.sender === "user" ? "You" : "Fluentia Tutor"}</span>
            </div>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-primary text-white rounded-tr-none shadow-sm dark:shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                  : "bg-paper-card border border-slate-200 dark:border-white/10 text-ink rounded-tl-none shadow-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1.5 text-[10px] text-ink-soft mb-1 px-1">
              <div className="relative w-3.5 h-3.5 rounded-full overflow-hidden shrink-0">
                <Image
                  src="/logo.png"
                  alt="Fluentia"
                  width={14}
                  height={14}
                  className="object-contain w-full h-full"
                />
              </div>
              <span className="font-brand font-semibold text-primary dark:text-cyan-300">Fluentia Tutor</span>
            </div>
            <div className="bg-paper-card border border-slate-200 dark:border-white/10 rounded-2xl rounded-tl-none px-4 py-3 text-sm flex gap-1.5 items-center">
              <span className="w-2 h-2 bg-primary dark:bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-primary dark:bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-primary dark:bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSend} className="p-3.5 border-t border-slate-200 dark:border-white/10 bg-paper-card">
        <div className="flex items-center bg-paper border border-slate-200 dark:border-white/10 rounded-full pl-4 pr-1.5 py-1 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-xs">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type a response (e.g. 'I had a good day!')"
            className="flex-grow bg-transparent text-sm focus:outline-none text-ink placeholder-ink-soft/60 pr-2"
          />
          <button
            type="submit"
            disabled={!userInput.trim() || isTyping}
            className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-200 disabled:to-slate-300 dark:disabled:from-white/10 dark:disabled:to-white/5 disabled:text-ink-soft text-white flex items-center justify-center font-bold transition-all duration-200 active:scale-90 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/40 shrink-0"
            aria-label="Send message"
          >
            <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
