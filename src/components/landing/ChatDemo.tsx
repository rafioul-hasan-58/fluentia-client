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
    <div id="demo" className="bg-paper border border-ink/10 rounded-2xl shadow-xl overflow-hidden max-w-lg mx-auto transform hover:translate-y-[-4px] transition-transform duration-300">
      {/* Chat Header */}
      <div className="bg-jade px-6 py-4 flex items-center justify-between border-b border-jade-dark/20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-paper/10 flex items-center justify-center text-xl">
              🤖
            </div>
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-jade" />
          </div>
          <div>
            <div className="text-sm font-semibold text-paper leading-tight">Fluentia Coach</div>
            <div className="text-[11px] text-paper/80">Online & Ready to teach</div>
          </div>
        </div>
        <span className="text-[11px] font-semibold bg-jade-dark px-2.5 py-1 rounded-full text-paper/90">
          Interactive Demo
        </span>
      </div>

      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto p-6 space-y-4 bg-[#fbfbf8]/50">
        {chatHistory.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${
              msg.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            <div className="text-[10px] text-ink-soft/75 mb-1 px-1">
              {msg.sender === "user" ? "You" : "Fluentia Tutor"}
            </div>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-jade text-paper rounded-tr-none shadow-sm"
                  : "bg-paper border border-ink/10 text-ink rounded-tl-none shadow-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex flex-col items-start">
            <div className="text-[10px] text-ink-soft/75 mb-1 px-1">Fluentia Tutor</div>
            <div className="bg-paper border border-ink/10 rounded-2xl rounded-tl-none px-4 py-3 text-sm flex gap-1.5 items-center">
              <span className="w-2 h-2 bg-ink/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-ink/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-ink/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-ink/10 bg-paper flex items-center gap-3">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type a response (e.g. 'I had a good day!')"
          className="flex-grow bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-jade/50 text-ink placeholder-ink-soft/60 transition-colors"
        />
        <button
          type="submit"
          disabled={!userInput.trim() || isTyping}
          className="h-11 w-11 rounded-xl bg-jade hover:bg-jade-dark disabled:bg-ink/10 disabled:text-ink-soft text-paper flex items-center justify-center font-bold transition-all duration-200 active:scale-95 shadow-sm"
          aria-label="Send message"
        >
          →
        </button>
      </form>
    </div>
  );
}
