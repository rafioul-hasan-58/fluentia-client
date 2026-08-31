import React from "react";
import { ChatDemo } from "./ChatDemo";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-light/40 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <div className="lg:col-span-6 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-light text-primary-dark text-xs font-semibold tracking-wide border border-primary/10">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              AI-Powered English Tutor
            </div>

            <h1 className="font-display text-5xl sm:text-6xl font-bold leading-[1.1] text-ink tracking-tight">
              Speak English with{" "}
              <span className="underline decoration-primary decoration-wavy underline-offset-4">
                absolute
              </span>{" "}
              confidence.
            </h1>

            <p className="text-lg text-ink-soft leading-relaxed max-w-lg">
              Fluentia is your patient, personalized companion. Master natural
              pronunciation, writing clarity, vocabulary depth, and test prep
              through context-rich conversation.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href="#demo"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-base transition-all duration-200 shadow-md shadow-primary/10 hover:scale-[1.02]"
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

            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-ink-soft border-t border-ink/5">
              <div className="flex items-center gap-2">
                <span className="text-primary text-base font-bold">✓</span> No credit card required
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary text-base font-bold">✓</span> Instant sentence correction
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary text-base font-bold">✓</span> Powered by Next.js 15
              </div>
            </div>
          </div>

          {/* Interactive Chat Widget Preview */}
          <div className="lg:col-span-6">
            <ChatDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
