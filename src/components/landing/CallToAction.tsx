import React from "react";

export function CallToAction() {
  return (
    <section id="cta" className="bg-jade-light/30 border-y border-jade/10 py-16">
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
  );
}
