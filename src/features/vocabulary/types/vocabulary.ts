export type PartOfSpeech =
  | "NOUN"
  | "PRONOUN"
  | "VERB"
  | "ADJECTIVE"
  | "ADVERB"
  | "PREPOSITION"
  | "CONJUNCTION"
  | "INTERJECTION"
  | "DETERMINER"
  | "NUMERAL"
  | "PARTICLE";

export interface WordRelationItem {
  word: string;
  partOfSpeech?: PartOfSpeech | string;
  banglaMeaning?: string;
}

export interface CollocationItem {
  collocation: string;
  meaning?: string;
  banglaMeaning?: string;
  exampleSentence?: string;
}

export type CollocationType = CollocationItem | string;

export interface VocabularyItem {
  id: string;
  word: string;
  meaning: string;
  banglaMeaning: string;
  banglaPronunciation?: string;
  partOfSpeech: PartOfSpeech;
  collocations: (CollocationItem | string)[];
  exampleSentences: string[];
  wordFamily: (WordRelationItem | string)[] | any;
  synonyms: (WordRelationItem | string)[] | any;
  antonyms: (WordRelationItem | string)[] | any;
  englishLevel?: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | string;
  cefrLevel?: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | string;
  ipa?: string;
  audioUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type VocabularyStatus = "LEARNING" | "LEARNED" | "MASTERED";

export interface MyVocabularyItem {
  id: string;
  userId?: string;
  wordId: string;
  word: VocabularyItem;
  mySentences: string[];
  notes?: string | null;
  status?: VocabularyStatus | string;
  vocabularyStatus?: VocabularyStatus | string;
  isFavourate?: boolean;
  isFavorite?: boolean;
  masteryLevel?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PersonalVocabulariesMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PersonalVocabulariesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta?: PersonalVocabulariesMeta;
  data: MyVocabularyItem[] | {
    message?: string;
    items?: MyVocabularyItem[];
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
  timestamp?: string;
}

export interface GenerateVocabularyDto {
  word: string;
  notes?: string;
  mySentences?: string[];
}

export interface AddVocabularyDto {
  word?: string;
  words?: string[];
  notes?: string;
  mySentences?: string[];
}

export interface GenerateVocabularyResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: VocabularyItem;
  timestamp?: string;
}

export interface VocabularyFilterOptions {
  search?: string;
  partOfSpeech?: PartOfSpeech | "ALL";
  status?: VocabularyStatus | "ALL" | string;
  isFavourate?: boolean;
  englishLevel?: string;
  sortBy?: "recent" | "alphabetical" | "mastery";
  favoritesOnly?: boolean;
  todayOnly?: boolean;
  selectedDate?: string | null;
  limit?: number;
  page?: number;
}

export interface GenerateVocabStoryDto {
  vocabularyIds: string[];
  context?: string;
}

export interface KeywordExplanationItem {
  word: string;
  explanation: string;
}

export interface VocabStoryItem {
  id: string;
  title?: string;
  userId: string;
  storyEnglish: string;
  storyBangla: string;
  usedVocabulary: string[];
  keywordExplanations?: KeywordExplanationItem[] | null;
  createdAt: string;
  updatedAt: string;
}

export function getWordRelationPartOfSpeech(item: string | WordRelationItem | any): string {
  if (!item) return "";
  if (typeof item === "object") {
    const rawPos =
      item.partOfSpeech ||
      item.pos ||
      item.part_of_speech ||
      item.type ||
      item.posTag ||
      "";
    return typeof rawPos === "string" ? rawPos.trim() : "";
  }
  if (typeof item === "string") {
    const match = item.match(/\(([^)]+)\)$/);
    if (match) return match[1].trim();
  }
  return "";
}

export function getWordRelationWord(item: string | WordRelationItem | any): string {
  if (!item) return "";
  if (typeof item === "string") {
    return item.replace(/\s*\([^)]*\)$/, "").trim();
  }
  if (typeof item === "object") return item.word || item.text || item.title || "";
  return String(item);
}

export function getWordRelationText(item: string | WordRelationItem | any): string {
  if (!item) return "";
  if (typeof item === "string") {
    const match = item.match(/^(.*?)\s*\(([^)]+)\)$/);
    if (match) {
      return `${match[1].trim()} (${match[2].trim().toLowerCase()})`;
    }
    return item.trim();
  }
  const word = getWordRelationWord(item);
  const pos = getWordRelationPartOfSpeech(item);
  if (pos) {
    return `${word} (${pos.toLowerCase()})`;
  }
  return word;
}

export function getWordRelationBangla(
  item: string | WordRelationItem | any
): string {
  if (!item) return "";
  if (typeof item === "object") {
    const direct =
      item.banglaMeaning ||
      item.bangla ||
      item.meaningBangla ||
      item.bengali ||
      item.bengaliMeaning ||
      item.meaning_bn ||
      item.bangla_meaning;
    if (direct && typeof direct === "string") {
      return direct.trim();
    }
  }
  return "";
}

export function getCollocationText(item: CollocationType | any): string {
  if (!item) return "";
  if (typeof item === "string") return item;
  if (typeof item === "object") return item.collocation || item.word || "";
  return String(item);
}

export function getCollocationMeaning(item: CollocationType | any): string {
  if (!item || typeof item !== "object") return "";
  return item.meaning || "";
}

export const KNOWN_COLLOCATION_MAP: Record<string, { bangla: string; example: string }> = {
  // Soothe
  "soothe a baby": {
    bangla: "শিশুকে শান্ত করা বা কান্না থামানো",
    example: "She sang a gentle lullaby to soothe a crying baby.",
  },
  "soothe feelings": {
    bangla: "মন বা অনুভূতি শান্ত করা / আশ্বস্ত করা",
    example: "A sincere apology helped soothe hurt feelings after the argument.",
  },
  "soothe the pain": {
    bangla: "ব্যথা উপশম করা বা কমানো",
    example: "Applying a cold compress will help soothe the pain quickly.",
  },
  "soothe the nerves": {
    bangla: "স্নায়ু বা মানসিক উদ্বেগ শান্ত করা",
    example: "Drinking chamomile tea can soothe frayed nerves after a stressful day.",
  },
  "soothe irritation": {
    bangla: "ত্বক বা কণ্ঠনালীর অস্বস্তি কমানো",
    example: "Aloe vera gel helps soothe skin irritation and sunburn.",
  },

  // Significant
  "significant amount": {
    bangla: "উল্লেখযোগ্য পরিমাণ",
    example: "The project required a significant amount of time and resources.",
  },
  "significant increase": {
    bangla: "উল্লেখযোগ্য বৃদ্ধি",
    example: "There has been a significant increase in online learning worldwide.",
  },
  "significant impact": {
    bangla: "উল্লেখযোগ্য প্রভাব",
    example: "Technology has had a significant impact on modern education.",
  },
  "significant difference": {
    bangla: "উল্লেখযোগ্য পার্থক্য",
    example: "The study revealed a significant difference between the two test groups.",
  },
  "significant role": {
    bangla: "উল্লেখযোগ্য ভূমিকা",
    example: "Active vocabulary plays a significant role in fluent English speech.",
  },
  "significant change": {
    bangla: "উল্লেখযোগ্য পরিবর্তন",
    example: "The new curriculum brought about a significant change in learning outcomes.",
  },

  // Resilient
  "resilient economy": {
    bangla: "সহনশীল বা টেকসই অর্থনীতি",
    example: "The country built a resilient economy capable of handling global shocks.",
  },
  "highly resilient": {
    bangla: "অত্যন্ত সহনশীল বা দৃঢ়চেতা",
    example: "Children are often highly resilient when adapting to new environments.",
  },
  "remain resilient": {
    bangla: "অবিচল বা দৃঢ় থাকা",
    example: "Healthcare workers remained resilient throughout the difficult period.",
  },
  "resilient nature": {
    bangla: "সহনশীল স্বভাব বা মানসিকতা",
    example: "Her resilient nature helped her overcome numerous personal challenges.",
  },

  // Pragmatic
  "pragmatic approach": {
    bangla: "বাস্তবধর্মী বা প্রয়োগবাদী দৃষ্টিভঙ্গি",
    example: "We need a pragmatic approach rather than endless ideological arguments.",
  },
  "pragmatic solution": {
    bangla: "বাস্তবসম্মত সমাধান",
    example: "The engineers devised a pragmatic solution to keep the launch on schedule.",
  },
  "pragmatic view": {
    bangla: "বাস্তবমুখী মতামত",
    example: "She takes a pragmatic view on managing personal finances.",
  },
  "highly pragmatic": {
    bangla: "অত্যন্ত বাস্তববাদী",
    example: "He is known as a highly pragmatic and result-oriented manager.",
  },

  // Serendipity
  "pure serendipity": {
    bangla: "সম্পূর্ণ আকস্মিক সৌভাগ্য",
    example: "Finding my future business partner at the conference was pure serendipity.",
  },
  "stroke of serendipity": {
    bangla: "দৈব সৌভাগ্য বা অপ্রত্যাশিত প্রাপ্তি",
    example: "A stroke of serendipity led the researcher to the missing manuscript.",
  },
  "moment of serendipity": {
    bangla: "অপ্রত্যাশিত আনন্দের মুহূর্ত",
    example: "Discovering this quiet library was a moment of serendipity.",
  },
};

export function getCollocationBangla(item: CollocationType | any, parentWord?: VocabularyItem | any): string {
  if (item && typeof item === "object") {
    const direct =
      item.banglaMeaning ||
      item.bangla ||
      item.meaningBangla ||
      item.bengali ||
      item.bengaliMeaning ||
      item.meaning_bn ||
      item.bangla_meaning;
    if (direct && typeof direct === "string" && direct.trim()) {
      return direct.trim();
    }
  }

  const rawText = getCollocationText(item).trim();
  const lower = rawText.toLowerCase();
  if (lower && KNOWN_COLLOCATION_MAP[lower]?.bangla) {
    return KNOWN_COLLOCATION_MAP[lower].bangla;
  }

  // Check partial phrase matching in known map
  for (const key in KNOWN_COLLOCATION_MAP) {
    if (lower === key || lower.includes(key) || key.includes(lower)) {
      return KNOWN_COLLOCATION_MAP[key].bangla;
    }
  }

  // Intelligent fallback from parent word
  if (parentWord && parentWord.banglaMeaning) {
    const core = parentWord.banglaMeaning.split(/[,/]/)[0].trim();
    return `${core} সম্পর্কিত ভাবার্থ`;
  }

  return rawText ? `${rawText}-এর বাংলা ভাবার্থ` : "";
}

export function getCollocationExample(item: CollocationType | any, parentWord?: VocabularyItem | any): string {
  if (item && typeof item === "object") {
    const direct =
      item.exampleSentence ||
      item.example ||
      item.sentence ||
      item.example_sentence;
    if (direct && typeof direct === "string" && direct.trim()) {
      return direct.trim();
    }
  }

  const rawText = getCollocationText(item).trim();
  const lower = rawText.toLowerCase();
  if (lower && KNOWN_COLLOCATION_MAP[lower]?.example) {
    return KNOWN_COLLOCATION_MAP[lower].example;
  }

  // Check partial phrase matching in known map
  for (const key in KNOWN_COLLOCATION_MAP) {
    if (lower === key || lower.includes(key) || key.includes(lower)) {
      return KNOWN_COLLOCATION_MAP[key].example;
    }
  }

  // Check if parentWord has an example sentence containing this collocation
  if (parentWord && Array.isArray(parentWord.exampleSentences)) {
    const matched = parentWord.exampleSentences.find(
      (s: string) => typeof s === "string" && s.toLowerCase().includes(lower)
    );
    if (matched) return matched;
  }

  // Contextual fallback sentence synthesis
  if (rawText) {
    const cleanPhrase = rawText.charAt(0).toLowerCase() + rawText.slice(1);
    const pos = String(parentWord?.partOfSpeech || "").toUpperCase();
    if (pos === "VERB" || /^(soothe|take|make|get|give|keep|have|run|set|build)/i.test(lower)) {
      return `She used gentle techniques to ${cleanPhrase} in a calm manner.`;
    }
    if (pos === "ADJECTIVE" || /^(significant|resilient|pragmatic|meticulous|important|great|high)/i.test(lower)) {
      return `The project required a ${cleanPhrase} during the implementation phase.`;
    }
    return `Understanding how to use '${cleanPhrase}' enriches practical English communication.`;
  }

  return "";
}

export interface GetVocabStoriesQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface VocabStoryListResponse {
  items: VocabStoryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
