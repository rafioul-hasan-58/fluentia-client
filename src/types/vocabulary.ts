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

export interface PersonalVocabulariesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    message?: string;
    items: MyVocabularyItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
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
  sortBy?: "recent" | "alphabetical" | "mastery";
  favoritesOnly?: boolean;
  todayOnly?: boolean;
  selectedDate?: string | null;
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

export function getWordRelationText(item: string | WordRelationItem | any): string {
  if (!item) return "";
  if (typeof item === "string") return item;
  if (typeof item === "object") {
    if (item.partOfSpeech) {
      return `${item.word} (${item.partOfSpeech.toLowerCase()})`;
    }
    return item.word || "";
  }
  return String(item);
}

export function getWordRelationWord(item: string | WordRelationItem | any): string {
  if (!item) return "";
  if (typeof item === "string") return item;
  if (typeof item === "object") return item.word || "";
  return String(item);
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

export function getCollocationBangla(item: CollocationType | any): string {
  if (!item || typeof item !== "object") return "";
  return item.banglaMeaning || "";
}

export function getCollocationExample(item: CollocationType | any): string {
  if (!item || typeof item !== "object") return "";
  return item.exampleSentence || "";
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
