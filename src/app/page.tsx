"use client";

import React, { useState } from "react";

export default function LandingPage() {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "ai",
      text: "Hello! I am your Fluentia AI English Coach. Let's practice. How was your day today?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Add user message
    const userMsg = userInput;
    setChatHistory((prev) => [...prev, { sender: "user", text: userMsg }]);
    setUserInput("");
    setIsTyping(true);

    // Simulate AI feedback response after 1.5 seconds
    setTimeout(() => {
      let aiFeedback = "";
      if (userMsg.toLowerCase().includes("good") || userMsg.toLowerCase().includes("fine")) {
        aiFeedback = "Great to hear that! 'My day was good' is standard, but you can also say 'It has been quite productive!' or 'I had a wonderful day.' Let's try to describe one thing you did today using one of these phrases!";
      } else {
        aiFeedback = "Interesting! Tell me more about it. By the way, your sentence structure looks correct. If you want to sound more natural, you could also say: 'It was a bit challenging, but I managed.'";
      }

      setChatHistory((prev) => [
        ...prev,
        { sender: "ai", text: aiFeedback },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const featureCards = [
    {
      title: "Grammar Master",
      description: "Get real-time sentence restructuring and grammatical corrections with clear, friendly rules.",
      icon: "✍️",
      color: "bg-jade-light/40 border-jade/20 text-jade",
      badge: "Grammar",
    },
    {
      title: "Active Speaking",
      description: "Talk to our patient AI persona, check your pronunciation, and gain fluid confidence.",
      icon: "🗣️",
      color: "bg-amber-light border-amber/20 text-amber",
      badge: "Speaking",
    },
    {
      title: "IELTS Preparation",
      description: "Simulate speaking and writing tests and receive instant band evaluations based on official criteria.",
      icon: "🎯",
      color: "bg-jade-light/40 border-jade/20 text-jade",
      badge: "IELTS",
    },
    {
      title: "Vocabulary Builder",
      description: "Learn idioms, collocations, and vocabulary that fit naturally into your own conversations.",
      icon: "📚",
      color: "bg-amber-light border-amber/20 text-amber",
      badge: "Vocabulary",
    },
  ];

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col font-sans selection:bg-jade-light selection:text-jade-dark">
      {/* Navigation */}
      <header className="sticky top-0 z-40 bg-paper/85 backdrop-blur-md border-b border-ink/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-jade flex items-center justify-center text-paper font-display font-bold text-xl shadow-md shadow-jade/10">
              F
            </div>
            <span className="font-display text-2xl font-bold tracking-tight text-ink">
              Fluentia
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-soft">
            <a href="#features" className="hover:text-jade transition-colors">Features</a>
            <a href="#demo" className="hover:text-jade transition-colors">Interactive Demo</a>
            <a href="#about" className="hover:text-jade transition-colors">How it Works</a>
          </nav>

          <div>
            <a
              href="#demo"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-jade hover:bg-jade-dark text-paper text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow hover:scale-[1.02]"
            >
              Start Free Practice
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
          {/* Subtle background glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-jade-light/40 rounded-full blur-[100px] -z-10" />

          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Text Area */}
              <div className="lg:col-span-6 space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-jade-light text-jade-dark text-xs font-semibold tracking-wide border border-jade/10">
                  <span className="flex h-2 w-2 rounded-full bg-jade animate-pulse" />
                  AI-Powered English Tutor
                </div>

                <h1 className="font-display text-5xl sm:text-6xl font-bold leading-[1.1] text-ink tracking-tight">
                  Speak English with <span className="underline decoration-jade decoration-wavy underline-offset-4">absolute</span> confidence.
                </h1>

                <p className="text-lg text-ink-soft leading-relaxed max-w-lg">
                  Fluentia is your patient, personalized companion. Master natural pronunciation, writing clarity, vocabulary depth, and test prep through context-rich conversation.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <a
                    href="#demo"
                    className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-jade hover:bg-jade-dark text-paper font-semibold text-base transition-all duration-200 shadow-md shadow-jade/10 hover:scale-[1.02]"
                  >
                    Try the Demo
                  </a>
                  <a
                    href="#features"
                    className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-paper hover:bg-ink/5 text-ink font-semibold text-base border border-ink/10 transition-all duration-200"
                  >
                    Explore Features
                  </a>
                </div>

                <div className="pt-4 flex items-center gap-6 text-xs text-ink-soft border-t border-ink/5">
                  <div className="flex items-center gap-2">
                    <span className="text-jade text-base">✓</span> No credit card required
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-jade text-base">✓</span> Instant sentence correction
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-jade text-base">✓</span> Powered by Next.js 15
                  </div>
                </div>
              </div>

              {/* Graphical Chat Experience Box */}
              <div id="demo" className="lg:col-span-6">
                <div className="bg-paper border border-ink/10 rounded-2xl shadow-xl overflow-hidden max-w-lg mx-auto transform hover:translate-y-[-4px] transition-transform duration-300">
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
                      Lesson 1: Warmup
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
                          <span className="w-2 h-2 bg-ink/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-ink/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-ink/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
                    >
                      →
                    </button>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Feature Cards Section */}
        <section id="features" className="py-24 border-t border-ink/5 bg-paper/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
              <h2 className="font-display text-4xl font-bold tracking-tight text-ink">
                Personalized practice for every skill
              </h2>
              <p className="text-ink-soft text-base leading-relaxed">
                Fluentia covers all aspects of language acquisition. We provide structured learning and analytical corrections so you never repeat the same mistakes twice.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featureCards.map((card, i) => (
                <div
                  key={i}
                  className="bg-paper border border-ink/10 rounded-2xl p-6 space-y-6 hover:shadow-md hover:border-jade/30 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-3xl">{card.icon}</div>
                      <span className="text-[11px] font-semibold tracking-wider uppercase bg-ink/5 px-2.5 py-1 rounded-md text-ink-soft">
                        {card.badge}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-ink">
                      {card.title}
                    </h3>
                    <p className="text-sm text-ink-soft leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-ink/5 flex items-center justify-between text-xs font-semibold text-jade group cursor-pointer">
                    <span>Explore Module</span>
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Highlight Callout */}
        <section className="bg-jade-light/30 border-y border-jade/10 py-16">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
            <h3 className="font-display text-3xl font-bold text-ink">
              Ready to take your English to the next level?
            </h3>
            <p className="text-ink-soft max-w-lg mx-auto text-sm leading-relaxed">
              Start engaging in guided daily conversations and receive structured, actionable reports highlighting your progress, lexical range, and grammatical accuracy.
            </p>
            <div>
              <a
                href="#demo"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-jade hover:bg-jade-dark text-paper font-semibold text-sm transition-all duration-200 shadow-md shadow-jade/15 hover:scale-[1.02]"
              >
                Launch Learning Console
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-paper border-t border-ink/5 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-jade flex items-center justify-center text-paper font-display font-bold text-base">
              F
            </div>
            <span className="font-display text-lg font-bold text-ink">
              Fluentia
            </span>
          </div>
          
          <div className="text-xs text-ink-soft/75">
            © {new Date().getFullYear()} Fluentia App. All rights reserved. Built for Fluentia Client.
          </div>
        </div>
      </footer>
    </div>
  );
}
