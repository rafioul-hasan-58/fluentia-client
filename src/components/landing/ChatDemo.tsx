"use client";

import React, { useState } from "react";

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
    <div id="demo" className="bg-[#0b132b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-w-lg mx-auto transform hover:translate-y-[-2px] transition-transform duration-300 backdrop-blur-xl text-white">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 px-6 py-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl">
              🤖
            </div>
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-cyan-400 ring-2 ring-blue-900 animate-pulse" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white leading-tight">Fluentia Coach</div>
            <div className="text-[11px] text-cyan-200/80">Online & Ready to teach</div>
          </div>
        </div>
        <span className="text-[11px] font-semibold bg-white/10 px-2.5 py-1 rounded-full text-cyan-300 border border-cyan-400/20">
          Interactive Demo
        </span>
      </div>

      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto p-6 space-y-4 bg-[#030712]/60">
        {chatHistory.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${
              msg.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            <div className="text-[10px] text-slate-400 mb-1 px-1">
              {msg.sender === "user" ? "You" : "Fluentia Tutor"}
            </div>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-tr-none shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                  : "bg-[#111827] border border-white/10 text-slate-100 rounded-tl-none shadow-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex flex-col items-start">
            <div className="text-[10px] text-slate-400 mb-1 px-1">Fluentia Tutor</div>
            <div className="bg-[#111827] border border-white/10 rounded-2xl rounded-tl-none px-4 py-3 text-sm flex gap-1.5 items-center">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-[#0b132b] flex items-center gap-3">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type a response (e.g. 'I had a good day!')"
          className="flex-grow bg-[#030712] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-400 text-white placeholder-slate-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!userInput.trim() || isTyping}
          className="h-11 w-11 rounded-xl bg-primary hover:bg-primary-dark disabled:bg-white/5 disabled:text-slate-600 text-white flex items-center justify-center font-bold transition-all duration-200 active:scale-95 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
          aria-label="Send message"
        >
          →
        </button>
      </form>
    </div>
  );
}
