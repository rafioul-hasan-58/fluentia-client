import React from "react";
import Link from "next/link";

interface FeatureCard {
  title: string;
  description: string;
  icon: string;
  color: string;
  badge: string;
  href: string;
}

const FEATURE_CARDS: FeatureCard[] = [
  {
    title: "Grammar Master",
    description: "Get real-time sentence restructuring and grammatical corrections with clear, friendly rules.",
    icon: "✍️",
    color: "bg-blue-500/10 border-blue-500/30 text-primary dark:text-blue-300",
    badge: "Grammar AI",
    href: "/dashboard/chat",
  },
  {
    title: "Active Speaking",
    description: "Talk to our patient AI persona, check your pronunciation, and gain fluid confidence.",
    icon: "🗣️",
    color: "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-300",
    badge: "Speaking",
    href: "/dashboard/chat",
  },
  {
    title: "IELTS Preparation",
    description: "Simulate speaking and writing tests and receive instant band evaluations based on official criteria.",
    icon: "🎯",
    color: "bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-300",
    badge: "IELTS 8.0+",
    href: "/dashboard/chat",
  },
  {
    title: "Vocabulary Builder",
    description: "Learn idioms, collocations, and vocabulary that fit naturally into your own conversations.",
    icon: "📚",
    color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-300",
    badge: "Vocabulary",
    href: "/dashboard/vocabulary",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 border-t border-slate-200 dark:border-white/10 bg-paper dark:bg-[#060b19] text-ink transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink">
            Personalized practice for every skill
          </h2>
          <p className="text-ink-soft text-sm sm:text-base leading-relaxed">
            Fluentia covers all aspects of language acquisition. We provide structured learning and analytical corrections so you never repeat the same mistakes twice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURE_CARDS.map((card, i) => (
            <Link
              key={i}
              href={card.href}
              className="bg-paper-card border border-slate-200 dark:border-white/10 rounded-2xl p-6 space-y-6 hover:shadow-lg dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-primary transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-3xl group-hover:scale-110 transition-transform duration-200">{card.icon}</div>
                  <span className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border ${card.color}`}>
                    {card.badge}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-ink group-hover:text-primary dark:group-hover:text-cyan-300 transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-ink-soft leading-relaxed">
                  {card.description}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-xs font-semibold text-primary dark:text-blue-400 group-hover:text-primary-dark dark:group-hover:text-cyan-300">
                <span>Explore Module</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
