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

export interface VocabularyItem {
  id: string;
  word: string;
  meaning: string;
  banglaMeaning: string;
  partOfSpeech: PartOfSpeech;
  collocations: string[];
  exampleSentences: string[];
  wordFamily: string[];
  synonyms: string[];
  antonyms: string[];
  ipa?: string;
  cefrLevel?: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | string;
  audioUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type VocabularyStatus = "LEARNING" | "MASTERED" | "REVIEWING";

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

export interface AddVocabularyDto {
  words: string[];
  notes?: string;
  mySentences?: string[];
}

export interface AddVocabularyResponseItem {
  word: string;
  status: "success" | "exists" | "error";
  data?: MyVocabularyItem;
  message?: string;
}

export interface AddVocabularyResponse {
  success: boolean;
  message: string;
  data: {
    processed: number;
    items: MyVocabularyItem[];
    failedWords?: string[];
  };
}

export interface VocabularyFilterOptions {
  search?: string;
  partOfSpeech?: PartOfSpeech | "ALL";
  sortBy?: "recent" | "alphabetical" | "mastery";
  favoritesOnly?: boolean;
}
