"use client";

import React, { useState } from "react";

export interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
  feedback?: {
    correction?: string;
    explanation?: string;
    betterAlternatives?: string[];
    vocabularyScore?: number;
  };
  audioAvailable?: boolean;
}

export function MessageBubble({ message }: { message: ChatMessage }) {
  const [showFeedback, setShowFeedback] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    setTimeout(() => setIsPlayingAudio(false), 2500);
  };

  const isUser = message.sender === "user";

  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} space-y-2 group`}>
      {/* Sender Header */}
      <div className="flex items-center gap-2 px-1 text-[11px] text-slate-400">
        <span>{isUser ? "You" : "Fluentia AI Coach"}</span>
        <span>•</span>
        <span>{message.timestamp}</span>
      </div>

      {/* Main Bubble */}
      <div
        className={`max-w-[88%] md:max-w-[78%] rounded-2xl p-4 text-sm leading-relaxed transition-all shadow-sm ${
          isUser
            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-tr-none shadow-[0_0_20px_rgba(37,99,235,0.3)]"
            : "bg-[#111827] border border-white/10 text-slate-100 rounded-tl-none shadow-md"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>

        {/* Audio Speaker Button for AI */}
        {!isUser && (
          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={handlePlayAudio}
              className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              <svg className={`w-4 h-4 ${isPlayingAudio ? "animate-pulse text-amber" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z" />
              </svg>
              <span>{isPlayingAudio ? "Playing audio..." : "Listen to pronunciation"}</span>
            </button>

            {message.feedback && (
              <button
                onClick={() => setShowFeedback(!showFeedback)}
                className="text-[11px] font-semibold text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
              >
                <span>{showFeedback ? "Hide Analysis" : "Show Analysis"}</span>
                <span className="text-[9px]">{showFeedback ? "▲" : "▼"}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* AI Structured Feedback Card */}
      {!isUser && message.feedback && showFeedback && (
        <div className="max-w-[88%] md:max-w-[78%] bg-blue-950/40 border border-blue-500/30 rounded-xl p-3.5 space-y-2.5 text-xs">
          <div className="flex items-center justify-between font-semibold text-cyan-300">
            <div className="flex items-center gap-1.5">
              <span>💡</span>
              <span>Language Coaching Notes</span>
            </div>
            {message.feedback.vocabularyScore && (
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
                +{message.feedback.vocabularyScore} Fluency XP
              </span>
            )}
          </div>

          {message.feedback.explanation && (
            <p className="text-slate-300 leading-relaxed">
              {message.feedback.explanation}
            </p>
          )}

          {message.feedback.betterAlternatives && (
            <div className="space-y-1 pt-1.5 border-t border-blue-500/20">
              <span className="text-[11px] font-semibold text-slate-200">More natural expressions:</span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-300 pl-1">
                {message.feedback.betterAlternatives.map((alt, idx) => (
                  <li key={idx} className="hover:text-cyan-300 transition-colors cursor-pointer">
                    <span className="font-medium text-white italic">"{alt}"</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
