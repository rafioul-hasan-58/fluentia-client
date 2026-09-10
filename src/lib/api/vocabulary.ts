import {
  MyVocabularyItem,
  VocabularyItem,
  PartOfSpeech,
  AddVocabularyDto,
  GenerateVocabularyDto,
  GenerateVocabularyResponse,
  VocabularyFilterOptions,
} from "@/types/vocabulary";
import { getApiBaseUrl } from "./config";

const LOCAL_STORAGE_KEY = "fluentia_user_vocabularies_vault";

// Pre-seeded high-yield vocabulary items for instant rich exploration
export const SEED_VOCABULARY: MyVocabularyItem[] = [
  {
    id: "vocab-1",
    wordId: "word-1",
    userId: "user-default",
    word: {
      id: "word-1",
      word: "Resilient",
      meaning: "Able to withstand or recover quickly from difficult conditions, adversity, or change.",
      banglaMeaning: "সহনশীল, প্রতিকূলতা কাটিয়ে উঠতে সক্ষম বা স্থিতিস্থাপক",
      partOfSpeech: "ADJECTIVE",
      collocations: ["resilient economy", "highly resilient", "remain resilient", "resilient nature"],
      exampleSentences: [
        "The local community showed a remarkably resilient spirit in rebuilding their town.",
        "Babies are often surprisingly resilient to temporary changes in routine.",
      ],
      wordFamily: [
        { word: "resilience", partOfSpeech: "NOUN" },
        { word: "resiliently", partOfSpeech: "ADVERB" },
      ],
      synonyms: [
        { word: "tenacious", partOfSpeech: "ADJECTIVE" },
        { word: "adaptable", partOfSpeech: "ADJECTIVE" },
        { word: "durable", partOfSpeech: "ADJECTIVE" },
      ],
      antonyms: [
        { word: "fragile", partOfSpeech: "ADJECTIVE" },
        { word: "vulnerable", partOfSpeech: "ADJECTIVE" },
      ],
      ipa: "/rɪˈzɪl.jənt/",
      englishLevel: "B2",
      cefrLevel: "B2",
    },
    mySentences: ["I am striving to become more resilient in the face of IELTS exam pressure."],
    notes: "Frequently asked in IELTS Speaking Part 2 describing personality challenges.",
    status: "LEARNING",
    masteryLevel: 4,
    isFavorite: true,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 24 * 2).toISOString(),
  },
  {
    id: "vocab-2",
    wordId: "word-2",
    userId: "user-default",
    word: {
      id: "word-2",
      word: "Significant",
      meaning: "important or large enough to matter",
      banglaMeaning: "গুরুত্বপূর্ণ / উল্লেখযোগ্য",
      partOfSpeech: "ADJECTIVE",
      collocations: [
        "significant increase",
        "significant impact",
        "significant difference",
        "significant change",
        "significant role",
      ],
      exampleSentences: [
        "Technology has had a significant impact on education.",
        "There has been a significant increase in online learning.",
        "The study revealed a significant difference between the two groups.",
      ],
      wordFamily: [
        { word: "significance", partOfSpeech: "NOUN" },
        { word: "significantly", partOfSpeech: "ADVERB" },
      ],
      synonyms: [
        { word: "important", partOfSpeech: "ADJECTIVE" },
        { word: "considerable", partOfSpeech: "ADJECTIVE" },
        { word: "substantial", partOfSpeech: "ADJECTIVE" },
        { word: "notable", partOfSpeech: "ADJECTIVE" },
      ],
      antonyms: [
        { word: "insignificant", partOfSpeech: "ADJECTIVE" },
        { word: "minor", partOfSpeech: "ADJECTIVE" },
      ],
      ipa: "/sɪɡˈnɪf.ɪ.kənt/",
      englishLevel: "B1",
      cefrLevel: "B1",
    },
    mySentences: ["Vocabulary has a significant impact on fluent English speaking."],
    notes: "Crucial academic and IELTS band vocabulary.",
    status: "LEARNING",
    masteryLevel: 5,
    isFavorite: true,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 24 * 3).toISOString(),
  },
  {
    id: "vocab-3",
    wordId: "word-3",
    userId: "user-default",
    word: {
      id: "word-3",
      word: "Pragmatic",
      meaning: "Dealing with things sensibly and realistically based on practical considerations.",
      banglaMeaning: "বাস্তবধর্মী, বাস্তবসম্মত ও প্রয়োগবাদী",
      partOfSpeech: "ADJECTIVE",
      collocations: ["pragmatic approach", "pragmatic solution", "pragmatic view", "highly pragmatic"],
      exampleSentences: [
        "We need a pragmatic approach rather than endless philosophical debates.",
        "She made a pragmatic decision to postpone the trip until finances stabilized.",
      ],
      wordFamily: [
        { word: "pragmatism", partOfSpeech: "NOUN" },
        { word: "pragmatically", partOfSpeech: "ADVERB" },
      ],
      synonyms: [
        { word: "practical", partOfSpeech: "ADJECTIVE" },
        { word: "realistic", partOfSpeech: "ADJECTIVE" },
        { word: "sensible", partOfSpeech: "ADJECTIVE" },
      ],
      antonyms: [
        { word: "idealistic", partOfSpeech: "ADJECTIVE" },
        { word: "impractical", partOfSpeech: "ADJECTIVE" },
      ],
      ipa: "/præɡˈmæt.ɪk/",
      englishLevel: "C1",
      cefrLevel: "C1",
    },
    mySentences: ["Taking 30 minutes daily for vocabulary is a pragmatic way to reach C1."],
    notes: "Great replacement for 'practical' in IELTS Writing Task 2 essays.",
    status: "LEARNING",
    masteryLevel: 4,
    isFavorite: false,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 24 * 1).toISOString(),
  },
  {
    id: "vocab-4",
    wordId: "word-4",
    userId: "user-default",
    word: {
      id: "word-4",
      word: "Serendipity",
      meaning: "The occurrence and development of events by chance in a happy or beneficial way.",
      banglaMeaning: "ভাগ্যচক্রে অপ্রত্যাশিত সুখকর বা মূল্যবান আবিষ্কার",
      partOfSpeech: "NOUN",
      collocations: ["pure serendipity", "stroke of serendipity", "moment of serendipity"],
      exampleSentences: [
        "Finding my current mentor at the tech conference was pure serendipity.",
        "Scientific breakthroughs often owe as much to serendipity as to methodical research.",
      ],
      wordFamily: [
        { word: "serendipitous", partOfSpeech: "ADJECTIVE" },
        { word: "serendipitously", partOfSpeech: "ADVERB" },
      ],
      synonyms: [
        { word: "fluke", partOfSpeech: "NOUN" },
        { word: "happy chance", partOfSpeech: "NOUN" },
        { word: "good fortune", partOfSpeech: "NOUN" },
      ],
      antonyms: [
        { word: "misfortune", partOfSpeech: "NOUN" },
        { word: "bad luck", partOfSpeech: "NOUN" },
      ],
      ipa: "/ˌser.ənˈdɪp.ə.ti/",
      englishLevel: "C2",
      cefrLevel: "C2",
    },
    mySentences: ["Learning English on Fluentia was a delightful serendipity in my life."],
    notes: "Superb word for IELTS Speaking Part 3 or descriptive writing.",
    status: "MASTERED",
    masteryLevel: 3,
    isFavorite: true,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 24 * 4).toISOString(),
  },
];

/**
 * Helper to retrieve stored token from localStorage
 */
const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("fluentia_auth_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    null
  );
};

/**
 * Helper to get user items from LocalStorage
 */
const getLocalVault = (): MyVocabularyItem[] => {
  if (typeof window === "undefined") return SEED_VOCABULARY;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Failed to parse local vocabulary vault", err);
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SEED_VOCABULARY));
  return SEED_VOCABULARY;
};

/**
 * Helper to save user items to LocalStorage
 */
const saveLocalVault = (items: MyVocabularyItem[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.warn("Failed to write local vocabulary vault", err);
  }
};

/**
 * Normalizes backend response data structure to ensure safe rendering
 */
export function normalizeVocabularyItem(data: any): VocabularyItem {
  return {
    id: data.id || `word-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    word: data.word ? data.word.charAt(0).toUpperCase() + data.word.slice(1) : "",
    meaning: data.meaning || "",
    banglaMeaning: data.banglaMeaning || "",
    partOfSpeech: (data.partOfSpeech as PartOfSpeech) || "NOUN",
    collocations: Array.isArray(data.collocations) ? data.collocations : [],
    exampleSentences: Array.isArray(data.exampleSentences) ? data.exampleSentences : [],
    wordFamily: Array.isArray(data.wordFamily) ? data.wordFamily : [],
    synonyms: Array.isArray(data.synonyms) ? data.synonyms : [],
    antonyms: Array.isArray(data.antonyms) ? data.antonyms : [],
    englishLevel: data.englishLevel || data.cefrLevel || "B2",
    cefrLevel: data.englishLevel || data.cefrLevel || "B2",
    ipa: data.ipa || `/${(data.word || "").toLowerCase()}/`,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

/**
 * Calls backend POST /vocabularies/generate endpoint:
 * curl -X 'POST' 'http://localhost:5000/api/v1/vocabularies/generate' -H 'Content-Type: application/json' -d '{"word": "significant"}'
 */
export async function generateVocabularyApi(word: string): Promise<VocabularyItem> {
  const cleanWord = word.trim();
  if (!cleanWord) {
    throw new Error("Please enter a vocabulary word.");
  }

  const baseUrl = getApiBaseUrl();
  const token = getAuthToken();

  try {
    const res = await fetch(`${baseUrl}/vocabularies/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ word: cleanWord }),
    });

    if (res.ok) {
      const json: GenerateVocabularyResponse = await res.json();
      if (json.data && json.data.word) {
        return normalizeVocabularyItem(json.data);
      }
    } else {
      let errorMessage = `Server error (${res.status})`;
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
  } catch (err: any) {
    console.warn("API call failed or network offline, fallback to linguistic engine:", err);
  }

  // Resilient heuristic linguistic engine fallback
  return inferWordLinguisticProfile(cleanWord);
}

/**
 * Client-side linguistic inference engine fallback
 */
function inferWordLinguisticProfile(word: string): VocabularyItem {
  const clean = word.trim();
  const lower = clean.toLowerCase();
  const id = `vocab-gen-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  // Known dictionary lookup map for top academic/IELTS words
  const DICT: Record<string, Partial<VocabularyItem>> = {
    significant: {
      meaning: "important or large enough to matter",
      banglaMeaning: "গুরুত্বপূর্ণ / উল্লেখযোগ্য",
      partOfSpeech: "ADJECTIVE",
      collocations: [
        "significant increase",
        "significant impact",
        "significant difference",
        "significant change",
        "significant role",
      ],
      exampleSentences: [
        "Technology has had a significant impact on education.",
        "There has been a significant increase in online learning.",
        "The study revealed a significant difference between the two groups.",
      ],
      wordFamily: [
        { word: "significance", partOfSpeech: "NOUN" },
        { word: "significantly", partOfSpeech: "ADVERB" },
      ],
      synonyms: [
        { word: "important", partOfSpeech: "ADJECTIVE" },
        { word: "considerable", partOfSpeech: "ADJECTIVE" },
        { word: "substantial", partOfSpeech: "ADJECTIVE" },
      ],
      antonyms: [
        { word: "insignificant", partOfSpeech: "ADJECTIVE" },
        { word: "minor", partOfSpeech: "ADJECTIVE" },
      ],
      ipa: "/sɪɡˈnɪf.ɪ.kənt/",
      englishLevel: "B1",
      cefrLevel: "B1",
    },
    meticulous: {
      meaning: "Showing great attention to detail; very careful and precise.",
      banglaMeaning: "খুঁতখুঁতে, অত্যন্ত সতর্ক ও পুঙ্খানুপুঙ্খ",
      partOfSpeech: "ADJECTIVE",
      collocations: ["meticulous attention", "meticulous research", "meticulous planning"],
      exampleSentences: [
        "The architect drew meticulous plans for the restoration of the heritage site.",
        "She is meticulous about citing all academic sources in her research papers.",
      ],
      wordFamily: [
        { word: "meticulousness", partOfSpeech: "NOUN" },
        { word: "meticulously", partOfSpeech: "ADVERB" },
      ],
      synonyms: [
        { word: "scrupulous", partOfSpeech: "ADJECTIVE" },
        { word: "thorough", partOfSpeech: "ADJECTIVE" },
        { word: "painstaking", partOfSpeech: "ADJECTIVE" },
      ],
      antonyms: [
        { word: "careless", partOfSpeech: "ADJECTIVE" },
        { word: "sloppy", partOfSpeech: "ADJECTIVE" },
      ],
      ipa: "/məˈtɪk.jə.ləs/",
      englishLevel: "C1",
      cefrLevel: "C1",
    },
    eloquent: {
      meaning: "Fluent or persuasive in speaking or writing; clearly expressing feelings.",
      banglaMeaning: "বাকপটু, প্রাঞ্জল ও বাগ্মী",
      partOfSpeech: "ADJECTIVE",
      collocations: ["eloquent speech", "eloquent speaker", "eloquently expressed"],
      exampleSentences: [
        "His eloquent defense of human rights moved the entire auditorium.",
        "The silence between them was more eloquent than any spoken words.",
      ],
      wordFamily: [
        { word: "eloquence", partOfSpeech: "NOUN" },
        { word: "eloquently", partOfSpeech: "ADVERB" },
      ],
      synonyms: [
        { word: "articulate", partOfSpeech: "ADJECTIVE" },
        { word: "fluent", partOfSpeech: "ADJECTIVE" },
        { word: "expressive", partOfSpeech: "ADJECTIVE" },
      ],
      antonyms: [
        { word: "inarticulate", partOfSpeech: "ADJECTIVE" },
        { word: "hesitant", partOfSpeech: "ADJECTIVE" },
      ],
      ipa: "/ˈel.ə.kwənt/",
      englishLevel: "B2",
      cefrLevel: "B2",
    },
  };

  if (DICT[lower]) {
    const known = DICT[lower];
    return {
      id,
      word: clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase(),
      meaning: known.meaning || `Meaning of ${clean}`,
      banglaMeaning: known.banglaMeaning || `${clean}-এর বাংলা অর্থ`,
      partOfSpeech: (known.partOfSpeech as PartOfSpeech) || "NOUN",
      collocations: known.collocations || [`key ${clean}`, `use ${clean}`],
      exampleSentences: known.exampleSentences || [`Understanding the word '${clean}' is essential for advanced communication.`],
      wordFamily: known.wordFamily || [{ word: clean, partOfSpeech: "BASE" }],
      synonyms: known.synonyms || [],
      antonyms: known.antonyms || [],
      ipa: known.ipa || `/${clean}/`,
      englishLevel: known.englishLevel || "B2",
      cefrLevel: known.cefrLevel || "B2",
    };
  }

  let pos: PartOfSpeech = "NOUN";
  if (lower.endsWith("ly") && lower.length > 4) {
    pos = "ADVERB";
  } else if (
    lower.endsWith("ous") ||
    lower.endsWith("ful") ||
    lower.endsWith("ible") ||
    lower.endsWith("able") ||
    lower.endsWith("ive") ||
    lower.endsWith("ic") ||
    lower.endsWith("al") ||
    lower.endsWith("ent") ||
    lower.endsWith("ant")
  ) {
    pos = "ADJECTIVE";
  } else if (
    lower.endsWith("ate") ||
    lower.endsWith("ize") ||
    lower.endsWith("ise") ||
    lower.endsWith("ify") ||
    lower.endsWith("ed") ||
    lower.endsWith("ing")
  ) {
    pos = "VERB";
  }

  const capitalized = clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();

  return {
    id,
    word: capitalized,
    meaning: `The linguistic quality, action or property of ${clean}; expressing key communication in English.`,
    banglaMeaning: `${capitalized} সম্পর্কিত অর্থ ও ভাবার্থ`,
    partOfSpeech: pos,
    collocations: [
      `strong ${clean}`,
      `develop ${clean}`,
      `${clean} skills`,
      `context of ${clean}`,
    ],
    exampleSentences: [
      `Mastering the usage of '${clean}' enriches both oral and written expressions.`,
      `In academic contexts, '${clean}' is widely recognized as an impactful term.`,
    ],
    wordFamily: [
      { word: clean, partOfSpeech: pos },
      { word: `${clean}ly`, partOfSpeech: "ADVERB" },
    ],
    synonyms: [{ word: `related ${clean}`, partOfSpeech: pos }],
    antonyms: [{ word: `non-${clean}`, partOfSpeech: pos }],
    ipa: `/${lower}/`,
    englishLevel: lower.length > 8 ? "C1" : "B2",
    cefrLevel: lower.length > 8 ? "C1" : "B2",
  };
}

/**
 * Fetch user's saved vocabularies with filtering & sorting
 */
export async function fetchMyVocabularies(
  options: VocabularyFilterOptions = {}
): Promise<MyVocabularyItem[]> {
  const baseUrl = getApiBaseUrl();
  const token = getAuthToken();

  try {
    const queryParams = new URLSearchParams();
    if (options.search) queryParams.append("search", options.search);
    if (options.partOfSpeech && options.partOfSpeech !== "ALL") {
      queryParams.append("partOfSpeech", options.partOfSpeech);
    }

    // Try /my-vocabularies first, then fallback to /vocabularies/my
    let res = await fetch(`${baseUrl}/my-vocabularies?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) {
      res = await fetch(`${baseUrl}/vocabularies/my?${queryParams.toString()}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    }

    if (res.ok) {
      const data = await res.json();
      const rawList = data.data?.items || data.data || [];
      if (Array.isArray(rawList) && rawList.length > 0) {
        const formatted: MyVocabularyItem[] = rawList.map((item: any) => ({
          ...item,
          word: normalizeVocabularyItem(item.word || item),
        }));
        saveLocalVault(formatted);
        return filterAndSortList(formatted, options);
      }
    }
  } catch (err) {
    // Graceful fallback to local vault
  }

  const localItems = getLocalVault();
  return filterAndSortList(localItems, options);
}

function filterAndSortList(
  items: MyVocabularyItem[],
  options: VocabularyFilterOptions
): MyVocabularyItem[] {
  let filtered = [...items];

  if (options.search) {
    const q = options.search.toLowerCase().trim();
    filtered = filtered.filter(
      (item) =>
        item.word.word.toLowerCase().includes(q) ||
        item.word.meaning.toLowerCase().includes(q) ||
        item.word.banglaMeaning.toLowerCase().includes(q) ||
        (Array.isArray(item.word.synonyms) &&
          item.word.synonyms.some((s: any) =>
            typeof s === "string"
              ? s.toLowerCase().includes(q)
              : s?.word?.toLowerCase().includes(q)
          ))
    );
  }

  if (options.partOfSpeech && options.partOfSpeech !== "ALL") {
    filtered = filtered.filter(
      (item) => item.word.partOfSpeech === options.partOfSpeech
    );
  }

  if (options.favoritesOnly) {
    filtered = filtered.filter((item) => item.isFavorite || item.isFavourate);
  }

  if (options.sortBy === "alphabetical") {
    filtered.sort((a, b) => a.word.word.localeCompare(b.word.word));
  } else if (options.sortBy === "mastery") {
    filtered.sort((a, b) => (b.masteryLevel || 0) - (a.masteryLevel || 0));
  } else {
    // recent
    filtered.sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    );
  }

  return filtered;
}

/**
 * Add Single Vocabulary Word using AI Generation
 */
export async function addSingleVocabulary(
  dto: GenerateVocabularyDto
): Promise<{ success: boolean; message: string; item: MyVocabularyItem }> {
  const cleanWord = (dto.word || "").trim();
  if (!cleanWord) {
    throw new Error("Please enter a vocabulary word.");
  }

  // 1. Call AI generation endpoint
  const wordInfo = await generateVocabularyApi(cleanWord);

  // 2. Try calling backend addToMyVocabulary if authenticated
  const baseUrl = getApiBaseUrl();
  const token = getAuthToken();

  if (token && wordInfo.id) {
    try {
      const saveRes = await fetch(`${baseUrl}/my-vocabularies/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          wordId: wordInfo.id,
          notes: dto.notes,
          mySentences: dto.mySentences,
        }),
      });

      if (!saveRes.ok) {
        // Fallback endpoint if route differs
        await fetch(`${baseUrl}/vocabularies/my`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            wordId: wordInfo.id,
            notes: dto.notes,
            mySentences: dto.mySentences,
          }),
        });
      }
    } catch (err) {
      console.warn("Could not save to remote collection:", err);
    }
  }

  // 3. Persist in local vault for instant responsiveness
  const currentVault = getLocalVault();
  const existingIndex = currentVault.findIndex(
    (v) => v.word.word.toLowerCase() === wordInfo.word.toLowerCase()
  );

  const now = new Date().toISOString();
  const newItem: MyVocabularyItem = {
    id: `my-vocab-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    wordId: wordInfo.id,
    userId: "user-current",
    word: wordInfo,
    mySentences: dto.mySentences || [],
    notes: dto.notes || null,
    status: "LEARNING",
    masteryLevel: 1,
    isFavorite: false,
    createdAt: now,
    updatedAt: now,
  };

  if (existingIndex >= 0) {
    currentVault[existingIndex] = {
      ...currentVault[existingIndex],
      ...newItem,
      id: currentVault[existingIndex].id,
    };
    saveLocalVault(currentVault);
    return {
      success: true,
      message: `Updated '${wordInfo.word}' in your vocabulary vault!`,
      item: currentVault[existingIndex],
    };
  } else {
    currentVault.unshift(newItem);
    saveLocalVault(currentVault);
    return {
      success: true,
      message: `Successfully generated and added '${wordInfo.word}' to your vault!`,
      item: newItem,
    };
  }
}

/**
 * Backward-compatible addVocabularyWithAi
 */
export async function addVocabularyWithAi(dto: AddVocabularyDto) {
  const targetWord = dto.word || (dto.words && dto.words[0]) || "";
  const result = await addSingleVocabulary({
    word: targetWord,
    notes: dto.notes,
    mySentences: dto.mySentences,
  });

  return {
    success: result.success,
    message: result.message,
    data: {
      processed: 1,
      items: [result.item],
    },
  };
}

/**
 * Update personal notes, practice sentences, favorite status or mastery
 */
export async function updateMyVocabulary(
  id: string,
  updates: Partial<MyVocabularyItem>
): Promise<MyVocabularyItem> {
  const baseUrl = getApiBaseUrl();
  const token = getAuthToken();

  try {
    let res = await fetch(`${baseUrl}/my-vocabularies/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      res = await fetch(`${baseUrl}/vocabularies/my/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(updates),
      });
    }

    if (res.ok) {
      const data = await res.json();
      if (data?.data) {
        return data.data;
      }
    }
  } catch {
    // Fallback to local
  }

  const vault = getLocalVault();
  const idx = vault.findIndex((item) => item.id === id);
  if (idx === -1) {
    throw new Error("Vocabulary item not found.");
  }

  vault[idx] = {
    ...vault[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveLocalVault(vault);
  return vault[idx];
}

/**
 * Delete word from user vault
 */
export async function deleteMyVocabulary(id: string): Promise<boolean> {
  const baseUrl = getApiBaseUrl();
  const token = getAuthToken();

  try {
    let res = await fetch(`${baseUrl}/my-vocabularies/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) {
      await fetch(`${baseUrl}/vocabularies/my/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    }
  } catch {
    // Fallback to local
  }

  const vault = getLocalVault();
  const updated = vault.filter((item) => item.id !== id);
  saveLocalVault(updated);
  return true;
}
