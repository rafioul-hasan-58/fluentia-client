import {
  TeachGrammarRequest,
  TeachGrammarResponse,
  SkillsListResponse,
  SkillSummary,
  GrammarSkillPreset,
} from "@/types/grammar";
import { getApiBaseUrl } from "./config";

export const DEFAULT_GRAMMAR_PRESETS: GrammarSkillPreset[] = [
  {
    slug: "first_conditional",
    name: "First Conditional",
    category: "conditionals",
    cefr: "A2",
    icon: "🌱",
    samplePrompts: [
      "When should I use will vs would?",
      "Explain the structure: If + present simple, will + verb",
      "Give me 5 practical daily examples of first conditional",
      "What are the most common mistakes learners make?",
    ],
  },
  {
    slug: "second_conditional",
    name: "Second Conditional",
    category: "conditionals",
    cefr: "B1",
    icon: "💭",
    samplePrompts: [
      "How is second conditional different from first conditional?",
      "Why do we say 'If I were you' instead of 'If I was you'?",
      "Explain hypothetical and imaginary future scenarios",
      "Give me sample questions with 'What would you do if...?'",
    ],
  },
  {
    slug: "third_conditional",
    name: "Third Conditional",
    category: "conditionals",
    cefr: "B2",
    icon: "⏳",
    samplePrompts: [
      "How do I express regrets about the past?",
      "Explain the formula: If + past perfect, would have + past participle",
      "What are common third conditional mistakes in IELTS speaking?",
    ],
  },
  {
    slug: "present_perfect",
    name: "Present Perfect",
    category: "verb_tenses",
    cefr: "B1",
    icon: "🔗",
    samplePrompts: [
      "When do I use 'since' vs 'for' in Present Perfect?",
      "What is the difference between Past Simple and Present Perfect?",
      "Explain 'have been to' vs 'have gone to'",
    ],
  },
  {
    slug: "passive_voice",
    name: "Passive Voice",
    category: "voice",
    cefr: "B1",
    icon: "🔄",
    samplePrompts: [
      "When should I use passive voice in academic writing?",
      "How do I convert active sentences to passive correctly?",
      "Explain passive with modal verbs (can be done, should be made)",
    ],
  },
  {
    slug: "relative_clauses",
    name: "Relative Clauses",
    category: "clauses",
    cefr: "B1",
    icon: "🧩",
    samplePrompts: [
      "When should I use 'who', 'which', and 'that'?",
      "What is the difference between defining and non-defining relative clauses?",
      "When can I omit the relative pronoun?",
    ],
  },
  {
    slug: "past_perfect",
    name: "Past Perfect",
    category: "verb_tenses",
    cefr: "B2",
    icon: "⏪",
    samplePrompts: [
      "When do I need Past Perfect instead of Past Simple?",
      "How do time conjunctions like 'by the time' work with Past Perfect?",
      "Give me storytelling examples with Past Perfect",
    ],
  },
  {
    slug: "gerunds_and_infinitives",
    name: "Gerunds & Infinitives",
    category: "verb_patterns",
    cefr: "B2",
    icon: "🎯",
    samplePrompts: [
      "Which verbs are followed by gerunds vs infinitives?",
      "Why does 'remember to do' differ from 'remember doing'?",
      "Explain prepositions followed by gerunds",
    ],
  },
  {
    slug: "modal_verbs_obligation",
    name: "Modal Verbs of Obligation",
    category: "modals",
    cefr: "A2",
    icon: "⚖️",
    samplePrompts: [
      "What is the nuance difference between 'must' and 'have to'?",
      "When should I use 'should' vs 'ought to'?",
      "Explain prohibited actions using 'must not'",
    ],
  },
  {
    slug: "present_continuous",
    name: "Present Continuous",
    category: "verb_tenses",
    cefr: "A1",
    icon: "⚡",
    samplePrompts: [
      "When do we use Present Continuous for future plans?",
      "What are stative verbs that cannot be used in continuous form?",
      "Compare Present Simple vs Present Continuous habits",
    ],
  },
  {
    slug: "past_simple",
    name: "Past Simple",
    category: "verb_tenses",
    cefr: "A2",
    icon: "📜",
    samplePrompts: [
      "What are irregular past tense verbs patterns?",
      "How to form negative and question sentences with 'did'?",
      "Explain pronunciation of '-ed' endings (/t/, /d/, /ɪd/)",
    ],
  },
  {
    slug: "present_simple",
    name: "Present Simple",
    category: "verb_tenses",
    cefr: "A1",
    icon: "☀️",
    samplePrompts: [
      "Rules for third person singular '-s' and '-es'",
      "How to use adverbs of frequency (always, often, rarely)",
      "Daily routines and general truths explained",
    ],
  },
];

/**
 * Call the Grammar Teach API endpoint: POST /api/v1/grammar/teach
 */
export async function teachGrammar(
  request: TeachGrammarRequest
): Promise<TeachGrammarResponse> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/grammar/teach`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      skillSlug: request.skillSlug,
      userPrompt: request.userPrompt?.trim() || "Teach me this grammar rule",
    }),
  });

  if (!res.ok) {
    let errorMessage = `Server error (status ${res.status})`;
    try {
      const errJson = await res.json();
      if (errJson.message) {
        errorMessage = Array.isArray(errJson.message)
          ? errJson.message.join(", ")
          : errJson.message;
      }
    } catch {
      // ignore
    }
    throw new Error(errorMessage);
  }

  const data: TeachGrammarResponse = await res.json();
  return data;
}

/**
 * Fetch all available skills from the database: GET /api/v1/skills
 */
export async function fetchSkills(): Promise<SkillSummary[]> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}/skills`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      const json: SkillsListResponse = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch {
    // ignore
  }

  return DEFAULT_GRAMMAR_PRESETS.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    cefr: p.cefr,
  }));
}


