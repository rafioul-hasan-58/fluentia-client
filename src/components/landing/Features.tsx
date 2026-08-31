import React from "react";

interface FeatureCard {
  title: string;
  description: string;
  icon: string;
  color: string;
  badge: string;
}

const FEATURE_CARDS: FeatureCard[] = [
  {
    title: "Grammar Master",
    description: "Get real-time sentence restructuring and grammatical corrections with clear, friendly rules.",
    icon: "✍️",
    color: "bg-primary-light/40 border-primary/20 text-primary",
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
    color: "bg-primary-light/40 border-primary/20 text-primary",
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

export function Features() {
  return (
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
          {FEATURE_CARDS.map((card, i) => (
            <div
              key={i}
              className="bg-paper border border-ink/10 rounded-2xl p-6 space-y-6 hover:shadow-md hover:border-primary/30 transition-all duration-300 flex flex-col justify-between"
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
              <div className="pt-4 border-t border-ink/5 flex items-center justify-between text-xs font-semibold text-primary group cursor-pointer">
                <span>Explore Module</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
