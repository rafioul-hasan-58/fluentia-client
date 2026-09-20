import { PartOfSpeech } from "@/types";

export const POS_COLORS: Record<
  PartOfSpeech,
  { bg: string; text: string; border: string; label: string }
> = {
  NOUN: {
    bg: "bg-blue-500/10 dark:bg-blue-500/20",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/30",
    label: "Noun",
  },
  VERB: {
    bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/30",
    label: "Verb",
  },
  ADJECTIVE: {
    bg: "bg-purple-500/10 dark:bg-purple-500/20",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-500/30",
    label: "Adjective",
  },
  ADVERB: {
    bg: "bg-amber-500/10 dark:bg-amber-500/20",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/30",
    label: "Adverb",
  },
  PREPOSITION: {
    bg: "bg-cyan-500/10 dark:bg-cyan-500/20",
    text: "text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-500/30",
    label: "Preposition",
  },
  CONJUNCTION: {
    bg: "bg-pink-500/10 dark:bg-pink-500/20",
    text: "text-pink-600 dark:text-pink-400",
    border: "border-pink-500/30",
    label: "Conjunction",
  },
  PRONOUN: {
    bg: "bg-indigo-500/10 dark:bg-indigo-500/20",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-500/30",
    label: "Pronoun",
  },
  INTERJECTION: {
    bg: "bg-rose-500/10 dark:bg-rose-500/20",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-500/30",
    label: "Interjection",
  },
  DETERMINER: {
    bg: "bg-teal-500/10 dark:bg-teal-500/20",
    text: "text-teal-600 dark:text-teal-400",
    border: "border-teal-500/30",
    label: "Determiner",
  },
  NUMERAL: {
    bg: "bg-orange-500/10 dark:bg-orange-500/20",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-500/30",
    label: "Numeral",
  },
  PARTICLE: {
    bg: "bg-slate-500/10 dark:bg-slate-500/20",
    text: "text-slate-600 dark:text-slate-400",
    border: "border-slate-500/30",
    label: "Particle",
  },
};

export const ALL_POS_OPTIONS: PartOfSpeech[] = [
  "NOUN",
  "VERB",
  "ADJECTIVE",
  "ADVERB",
  "PREPOSITION",
  "CONJUNCTION",
  "PRONOUN",
  "INTERJECTION",
  "DETERMINER",
  "NUMERAL",
  "PARTICLE",
];

//  Highlights a collocation phrase inside an example sentence for enhanced visual learning

export function highlightPhrase(sentence: string, phrase: string) {
  if (!phrase || !phrase.trim() || !sentence) return sentence;
  const escaped = phrase.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = sentence.split(regex);
  if (parts.length === 1) return sentence;
  return parts.map((part, i) =>
    part.toLowerCase() === phrase.trim().toLowerCase() ? (
      <span
        key={i}
        className="font-semibold text-indigo-600 dark:text-indigo-400 underline decoration-indigo-300 dark:decoration-indigo-700 underline-offset-2 not-italic"
      >
        {part}
      </span>
    ) : (
      part
    )
  );
}