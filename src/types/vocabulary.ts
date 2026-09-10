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

export interface VocabularyItem {
  id: string;
  word: string;
  meaning: string;
  banglaMeaning: string;
  partOfSpeech: PartOfSpeech;
  collocations: string[];
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
  isFavourate?: boolean;
  isFavorite?: boolean;
  masteryLevel?: number; // 0 to 100 percentage or 1-5 rating
  createdAt: string;
  updatedAt: string;
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
