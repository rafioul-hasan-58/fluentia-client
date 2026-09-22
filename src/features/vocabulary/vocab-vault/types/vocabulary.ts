import { IMeta } from "@/types/utils";

export type { IMeta };

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

export interface VerbForms {
  v1: string; // Base / Present Form (e.g., fly, soothe, go)
  v2: string; // Past Simple Form (e.g., flew, soothed, went)
  v3: string; // Past Participle Form (e.g., flown, soothed, gone)
}

export interface VocabularyItem {
  id: string;
  word: string;
  meaning: string;
  banglaMeaning: string;
  banglaPronunciation?: string;
  partOfSpeech: PartOfSpeech;
  verbForms?: VerbForms;
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
  isFavorite?: boolean;
  masteryLevel?: number;
  createdAt: string;
  updatedAt: string;
}
export interface IFetchVocabulariesResult {
  data: MyVocabularyItem[];
  meta: IMeta
}

export interface PersonalVocabulariesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta?: IMeta
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
  isFavorite?: boolean;
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

export const COMMON_IRREGULAR_VERBS: Record<
  string,
  { v2: string; v3: string }
> = {
  arise: { v2: "arose", v3: "arisen" },
  awake: { v2: "awoke", v3: "awoken" },
  be: { v2: "was/were", v3: "been" },
  bear: { v2: "bore", v3: "born/borne" },
  beat: { v2: "beat", v3: "beaten" },
  become: { v2: "became", v3: "become" },
  begin: { v2: "began", v3: "begun" },
  bend: { v2: "bent", v3: "bent" },
  bet: { v2: "bet", v3: "bet" },
  bind: { v2: "bound", v3: "bound" },
  bite: { v2: "bit", v3: "bitten" },
  bleed: { v2: "bled", v3: "bled" },
  blow: { v2: "blew", v3: "blown" },
  break: { v2: "broke", v3: "broken" },
  breed: { v2: "bred", v3: "bred" },
  bring: { v2: "brought", v3: "brought" },
  broadcast: { v2: "broadcast", v3: "broadcast" },
  build: { v2: "built", v3: "built" },
  burn: { v2: "burned/burnt", v3: "burned/burnt" },
  burst: { v2: "burst", v3: "burst" },
  buy: { v2: "bought", v3: "bought" },
  cast: { v2: "cast", v3: "cast" },
  catch: { v2: "caught", v3: "caught" },
  choose: { v2: "chose", v3: "chosen" },
  cling: { v2: "clung", v3: "clung" },
  come: { v2: "came", v3: "come" },
  cost: { v2: "cost", v3: "cost" },
  creep: { v2: "crept", v3: "crept" },
  cut: { v2: "cut", v3: "cut" },
  deal: { v2: "dealt", v3: "dealt" },
  dig: { v2: "dug", v3: "dug" },
  do: { v2: "did", v3: "done" },
  draw: { v2: "drew", v3: "drawn" },
  dream: { v2: "dreamed/dreamt", v3: "dreamed/dreamt" },
  drink: { v2: "drank", v3: "drunk" },
  drive: { v2: "drove", v3: "driven" },
  eat: { v2: "ate", v3: "eaten" },
  fall: { v2: "fell", v3: "fallen" },
  feed: { v2: "fed", v3: "fed" },
  feel: { v2: "felt", v3: "felt" },
  fight: { v2: "fought", v3: "fought" },
  find: { v2: "found", v3: "found" },
  flee: { v2: "fled", v3: "fled" },
  fly: { v2: "flew", v3: "flown" },
  forbid: { v2: "forbade", v3: "forbidden" },
  forget: { v2: "forgot", v3: "forgotten" },
  forgive: { v2: "forgave", v3: "forgiven" },
  freeze: { v2: "froze", v3: "frozen" },
  get: { v2: "got", v3: "got/gotten" },
  give: { v2: "gave", v3: "given" },
  go: { v2: "went", v3: "gone" },
  grow: { v2: "grew", v3: "grown" },
  hang: { v2: "hung", v3: "hung" },
  have: { v2: "had", v3: "had" },
  hear: { v2: "heard", v3: "heard" },
  hide: { v2: "hid", v3: "hidden" },
  hit: { v2: "hit", v3: "hit" },
  hold: { v2: "held", v3: "held" },
  hurt: { v2: "hurt", v3: "hurt" },
  keep: { v2: "kept", v3: "kept" },
  kneel: { v2: "knelt", v3: "knelt" },
  know: { v2: "knew", v3: "known" },
  lay: { v2: "laid", v3: "laid" },
  lead: { v2: "led", v3: "led" },
  learn: { v2: "learned/learnt", v3: "learned/learnt" },
  leave: { v2: "left", v3: "left" },
  lend: { v2: "lent", v3: "lent" },
  let: { v2: "let", v3: "let" },
  lie: { v2: "lay", v3: "lain" },
  light: { v2: "lit", v3: "lit" },
  lose: { v2: "lost", v3: "lost" },
  make: { v2: "made", v3: "made" },
  mean: { v2: "meant", v3: "meant" },
  meet: { v2: "met", v3: "met" },
  mistake: { v2: "mistook", v3: "mistaken" },
  overcome: { v2: "overcame", v3: "overcome" },
  pay: { v2: "paid", v3: "paid" },
  prove: { v2: "proved", v3: "proven/proved" },
  put: { v2: "put", v3: "put" },
  quit: { v2: "quit", v3: "quit" },
  read: { v2: "read", v3: "read" },
  ride: { v2: "rode", v3: "ridden" },
  ring: { v2: "rang", v3: "rung" },
  rise: { v2: "rose", v3: "risen" },
  run: { v2: "ran", v3: "run" },
  say: { v2: "said", v3: "said" },
  see: { v2: "saw", v3: "seen" },
  seek: { v2: "sought", v3: "sought" },
  sell: { v2: "sold", v3: "sold" },
  send: { v2: "sent", v3: "sent" },
  set: { v2: "set", v3: "set" },
  sew: { v2: "sewed", v3: "sewn/sewed" },
  shake: { v2: "shook", v3: "shaken" },
  shine: { v2: "shone", v3: "shone" },
  shoot: { v2: "shot", v3: "shot" },
  show: { v2: "showed", v3: "shown/showed" },
  shrink: { v2: "shrank", v3: "shrunk" },
  shut: { v2: "shut", v3: "shut" },
  sing: { v2: "sang", v3: "sung" },
  sink: { v2: "sank", v3: "sunk" },
  sit: { v2: "sat", v3: "sat" },
  sleep: { v2: "slept", v3: "slept" },
  slide: { v2: "slid", v3: "slid" },
  speak: { v2: "spoke", v3: "spoken" },
  spend: { v2: "spent", v3: "spent" },
  spill: { v2: "spilled/spilt", v3: "spilled/spilt" },
  split: { v2: "split", v3: "split" },
  spread: { v2: "spread", v3: "spread" },
  spring: { v2: "sprang", v3: "sprung" },
  stand: { v2: "stood", v3: "stood" },
  steal: { v2: "stole", v3: "stolen" },
  stick: { v2: "stuck", v3: "stuck" },
  strike: { v2: "struck", v3: "struck" },
  swear: { v2: "swore", v3: "sworn" },
  sweep: { v2: "swept", v3: "swept" },
  swim: { v2: "swam", v3: "swum" },
  swing: { v2: "swung", v3: "swung" },
  take: { v2: "took", v3: "taken" },
  teach: { v2: "taught", v3: "taught" },
  tear: { v2: "tore", v3: "torn" },
  tell: { v2: "told", v3: "told" },
  think: { v2: "thought", v3: "thought" },
  throw: { v2: "threw", v3: "thrown" },
  understand: { v2: "understood", v3: "understood" },
  upset: { v2: "upset", v3: "upset" },
  wake: { v2: "woke", v3: "woken" },
  wear: { v2: "wore", v3: "worn" },
  win: { v2: "won", v3: "won" },
  withdraw: { v2: "withdrew", v3: "withdrawn" },
  write: { v2: "wrote", v3: "written" },
};

/**
 * Resolves verb forms (V1, V2, V3) for a vocabulary item.
 * Supports explicit backend verbForms { v1, v2, v3 }, dictionary lookup for irregular verbs,
 * and morphological conjugation for regular verbs.
 */
export function getVerbForms(
  item: VocabularyItem | any,
  fallbackBaseWord?: string
): VerbForms | null {
  if (!item && !fallbackBaseWord) return null;

  // 1. Direct verbForms object if already populated
  const explicit = item?.verbForms || item?.forms;
  if (explicit && (explicit.v1 || explicit.v2 || explicit.v3)) {
    return {
      v1: explicit.v1 || explicit.base || explicit.present || item?.word || fallbackBaseWord || "",
      v2: explicit.v2 || explicit.past || "",
      v3: explicit.v3 || explicit.pastParticiple || explicit.participle || "",
    };
  }

  // 2. Validate part of speech is VERB (or explicitly requested)
  const pos = String(item?.partOfSpeech || "").toUpperCase();
  const isVerb =
    pos === "VERB" ||
    (item?.wordFamily &&
      Array.isArray(item.wordFamily) &&
      item.wordFamily.some((wf: any) => getWordRelationPartOfSpeech(wf).toUpperCase() === "VERB"));

  if (!isVerb && pos && pos !== "ALL") {
    return null;
  }

  // 3. Extract clean base word
  const rawWord = String(item?.word || fallbackBaseWord || "").trim();
  if (!rawWord) return null;
  const base = rawWord.toLowerCase();

  // 4. Irregular verbs lookup
  if (COMMON_IRREGULAR_VERBS[base]) {
    const ir = COMMON_IRREGULAR_VERBS[base];
    return {
      v1: rawWord,
      v2: ir.v2,
      v3: ir.v3,
    };
  }

  // 5. Regular verbs morphological conjugation
  let v2: string;
  let v3: string;

  // Ends in 'e' -> + 'd' (e.g. soothe -> soothed, love -> loved)
  if (base.endsWith("e")) {
    v2 = `${base}d`;
    v3 = `${base}d`;
  }
  // Ends in consonant + 'y' -> -y + 'ied' (e.g. study -> studied, cry -> cried)
  else if (/[^aeiou]y$/i.test(base)) {
    const stem = base.slice(0, -1);
    v2 = `${stem}ied`;
    v3 = `${stem}ied`;
  }
  // CVC doubling check (e.g. stop -> stopped, plan -> planned, grab -> grabbed, drop -> dropped)
  else if (
    /^[bcdfghjklmnpqrstvwxyz]*[aeiou][bcdfghjklmnpqrstvz]$/i.test(base) &&
    !/[wxy]$/i.test(base) &&
    base.length >= 3 &&
    base.length <= 6
  ) {
    const lastChar = base.slice(-1);
    v2 = `${base}${lastChar}ed`;
    v3 = `${base}${lastChar}ed`;
  }
  // Standard regular suffix + 'ed'
  else {
    v2 = `${base}ed`;
    v3 = `${base}ed`;
  }

  return {
    v1: rawWord,
    v2,
    v3,
  };
}

