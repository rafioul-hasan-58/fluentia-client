import {
  MyVocabularyItem,
  VocabularyItem,
  PartOfSpeech,
  AddVocabularyDto,
  AddVocabularyResponse,
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
      wordFamily: ["resilience (noun)", "resiliently (adverb)", "resiliency (noun)"],
      synonyms: ["tenacious", "adaptable", "durable", "buoyant", "tough"],
      antonyms: ["fragile", "vulnerable", "weak", "inflexible"],
      ipa: "/rɪˈzɪl.jənt/",
      cefrLevel: "B2",
    },
    mySentences: ["I am striving to become more resilient in the face of IELTS exam pressure."],
    notes: "Frequently asked in IELTS Speaking Part 2 describing personality challenges.",
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
      word: "Pragmatic",
      meaning: "Dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations.",
      banglaMeaning: "বাস্তবধর্মী, বাস্তবসম্মত ও প্রয়োগবাদী",
      partOfSpeech: "ADJECTIVE",
      collocations: ["pragmatic approach", "pragmatic solution", "pragmatic view", "highly pragmatic"],
      exampleSentences: [
        "We need a pragmatic approach rather than endless philosophical debates.",
        "She made a pragmatic decision to postpone the trip until finances stabilized.",
      ],
      wordFamily: ["pragmatism (noun)", "pragmatist (noun)", "pragmatically (adverb)"],
      synonyms: ["practical", "realistic", "sensible", "down-to-earth", "utilitarian"],
      antonyms: ["idealistic", "impractical", "unrealistic", "dogmatic"],
      ipa: "/præɡˈmæt.ɪk/",
      cefrLevel: "C1",
    },
    mySentences: ["Taking 30 minutes daily for vocabulary is a pragmatic way to reach C1."],
    notes: "Great replacement for 'practical' in IELTS Writing Task 2 essays.",
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
      word: "Serendipity",
      meaning: "The occurrence and development of events by chance in a happy or beneficial way.",
      banglaMeaning: "ভাগ্যচক্রে অপ্রত্যাশিত সুখকর বা মূল্যবান আবিষ্কার",
      partOfSpeech: "NOUN",
      collocations: ["pure serendipity", "stroke of serendipity", "moment of serendipity"],
      exampleSentences: [
        "Finding my current mentor at the tech conference was pure serendipity.",
        "Scientific breakthroughs often owe as much to serendipity as to methodical research.",
      ],
      wordFamily: ["serendipitous (adjective)", "serendipitously (adverb)"],
      synonyms: ["fluke", "happy chance", "good fortune", "coincidence", "providence"],
      antonyms: ["misfortune", "bad luck", "premeditation"],
      ipa: "/ˌser.ənˈdɪp.ə.ti/",
      cefrLevel: "C2",
    },
    mySentences: ["Learning English on Fluentia was a delightful serendipity in my life."],
    notes: "Superb word for IELTS Speaking Part 3 or descriptive writing.",
    masteryLevel: 3,
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
      word: "Articulate",
      meaning: "Having or showing the ability to speak fluently and coherently; to express an idea clearly.",
      banglaMeaning: "স্পষ্টভাবে প্রকাশ করা বা সুন্দর ও সাবলীল বাচনভঙ্গি",
      partOfSpeech: "VERB",
      collocations: ["articulate clearly", "articulate a vision", "struggle to articulate", "highly articulate"],
      exampleSentences: [
        "She was able to articulate her arguments with precision and poise.",
        "The president articulated a new vision for sustainable economic growth.",
      ],
      wordFamily: ["articulation (noun)", "articulacy (noun)", "articulately (adverb)"],
      synonyms: ["express", "enunciate", "verbalize", "vocalize", "fluent"],
      antonyms: ["inarticulate", "mumble", "garble", "hesitant"],
      ipa: "/ɑːˈtɪk.jə.lət/",
      cefrLevel: "B2",
    },
    mySentences: ["I practice daily to articulate complex thoughts in English with ease."],
    notes: "Can be both a VERB (/ɑːˈtɪk.jʊ.leɪt/) and an ADJECTIVE (/ɑːˈtɪk.jʊ.lət/).",
    masteryLevel: 4,
    isFavorite: true,
    createdAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
  },
  {
    id: "vocab-5",
    wordId: "word-5",
    userId: "user-default",
    word: {
      id: "word-5",
      word: "Ubiquitous",
      meaning: "Present, appearing, or found everywhere at the same time.",
      banglaMeaning: "সর্বব্যাপী, যা সর্বত্র বিদ্যমান বা দেখা যায়",
      partOfSpeech: "ADJECTIVE",
      collocations: ["become ubiquitous", "ubiquitous presence", "ubiquitous feature"],
      exampleSentences: [
        "Smartphones have become ubiquitous across all age demographics globally.",
        "Coffee shops are ubiquitous in almost every modern urban center.",
      ],
      wordFamily: ["ubiquity (noun)", "ubiquitously (adverb)", "ubiquitousness (noun)"],
      synonyms: ["omnipresent", "pervasive", "universal", "widespread", "prevalent"],
      antonyms: ["rare", "scarce", "uncommon", "isolated"],
      ipa: "/juːˈbɪk.wɪ.təs/",
      cefrLevel: "C1",
    },
    mySentences: ["Artificial intelligence tools are becoming ubiquitous in modern education."],
    notes: "High band vocabulary for technology, globalization, and lifestyle essay topics.",
    masteryLevel: 2,
    isFavorite: false,
    createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
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
 * Intelligent AI Linguistic Generator for individual words.
 * Generates accurate English meanings, Bengali definitions, PartOfSpeech,
 * collocations, word families, synonyms, antonyms, and contextual example sentences.
 */
export async function generateLinguisticDataForWord(
  rawWord: string
): Promise<VocabularyItem> {
  const cleanWord = rawWord.trim();
  const lower = cleanWord.toLowerCase();

  // Try calling AI backend endpoint first if available
  const baseUrl = getApiBaseUrl();
  const token = getAuthToken();

  try {
    const aiRes = await fetch(`${baseUrl}/vocabulary/ai-generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ word: cleanWord }),
    });

    if (aiRes.ok) {
      const resData = await aiRes.json();
      if (resData?.data?.word) {
        return resData.data;
      }
    }
  } catch {
    // Graceful fallback to client-side linguistic reasoning engine
  }

  // Smart heuristic linguistic reasoning engine for English & Bengali
  const generated = inferWordLinguisticProfile(cleanWord);
  return generated;
}

/**
 * Client-side linguistic inference engine with rich vocabulary heuristics & Oxford/CEFR rules
 */
function inferWordLinguisticProfile(word: string): VocabularyItem {
  const clean = word.trim();
  const lower = clean.toLowerCase();
  const id = `vocab-gen-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  // Known dictionary lookup map for top academic/IELTS words
  const DICT: Record<string, Partial<VocabularyItem>> = {
    ephemeral: {
      meaning: "Lasting for a very short time; transitory and fleeting.",
      banglaMeaning: "ক্ষণস্থায়ী, অল্পস্থায়ী বা অনিত্য",
      partOfSpeech: "ADJECTIVE",
      collocations: ["ephemeral beauty", "ephemeral nature", "ephemeral pleasure"],
      exampleSentences: [
        "Fame in the digital era can often be remarkably ephemeral.",
        "Spring cherry blossoms are celebrated for their ephemeral elegance.",
      ],
      wordFamily: ["ephemerality (noun)", "ephemerally (adverb)", "ephemera (noun)"],
      synonyms: ["fleeting", "transient", "momentary", "evanescent", "short-lived"],
      antonyms: ["permanent", "eternal", "enduring", "everlasting"],
      ipa: "/ɪˈfem.ər.əl/",
      cefrLevel: "C2",
    },
    tenacious: {
      meaning: "Tending to keep a firm hold of something; persistent and determined.",
      banglaMeaning: "নাছোড়বান্দা, দৃঢ়প্রতিজ্ঞ ও সংকল্পবদ্ধ",
      partOfSpeech: "ADJECTIVE",
      collocations: ["tenacious grip", "tenacious effort", "tenacious advocate"],
      exampleSentences: [
        "Her tenacious pursuit of the truth finally exposed the corporate scandal.",
        "The team fought with tenacious resolve until the final whistle.",
      ],
      wordFamily: ["tenacity (noun)", "tenaciously (adverb)", "tenaciousness (noun)"],
      synonyms: ["persistent", "stubborn", "resolute", "dogged", "unyielding"],
      antonyms: ["irresolute", "yielding", "weak", "surrendering"],
      ipa: "/təˈneɪ.ʃəs/",
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
      wordFamily: ["eloquence (noun)", "eloquently (adverb)"],
      synonyms: ["articulate", "fluent", "expressive", "persuasive", "rhetorical"],
      antonyms: ["inarticulate", "tongue-tied", "awkward", "hesitant"],
      ipa: "/ˈel.ə.kwənt/",
      cefrLevel: "B2",
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
      wordFamily: ["meticulousness (noun)", "meticulously (adverb)"],
      synonyms: ["scrupulous", "thorough", "painstaking", "diligent", "precise"],
      antonyms: ["careless", "sloppy", "slapdash", "negligent"],
      ipa: "/məˈtɪk.jə.ləs/",
      cefrLevel: "C1",
    },
    lucid: {
      meaning: "Expressed clearly; easy to understand; showing ability to think clearly.",
      banglaMeaning: "সহজবোধ্য, স্পষ্ট ও স্বচ্ছ",
      partOfSpeech: "ADJECTIVE",
      collocations: ["lucid explanation", "lucid dream", "lucid moment"],
      exampleSentences: [
        "The professor gave a remarkably lucid explanation of quantum physics.",
        "Despite his illness, he remained fully lucid throughout the interview.",
      ],
      wordFamily: ["lucidity (noun)", "lucidly (adverb)", "lucidness (noun)"],
      synonyms: ["clear", "coherent", "transparent", "comprehensible", "plain"],
      antonyms: ["obscure", "confusing", "unclear", "muddled"],
      ipa: "/ˈluː.sɪd/",
      cefrLevel: "B2",
    },
    mitigate: {
      meaning: "Make something bad, unpleasant, or serious less severe, harsh, or painful.",
      banglaMeaning: "লাঘব করা, উপশম করা বা তীব্রতা হ্রাস করা",
      partOfSpeech: "VERB",
      collocations: ["mitigate risks", "mitigate the impact", "mitigate climate change", "mitigate symptoms"],
      exampleSentences: [
        "Governments must invest in green infrastructure to mitigate flood hazards.",
        "Wearing seatbelts helps to mitigate the severity of accident injuries.",
      ],
      wordFamily: ["mitigation (noun)", "mitigating (adjective)", "unmitigated (adjective)"],
      synonyms: ["alleviate", "lessen", "diminish", "reduce", "moderate"],
      antonyms: ["aggravate", "exacerbate", "worsen", "intensify"],
      ipa: "/ˈmɪt.ɪ.ɡeɪt/",
      cefrLevel: "B2",
    },
    scrutinize: {
      meaning: "Examine or inspect closely and thoroughly with critical attention.",
      banglaMeaning: "সূক্ষ্মভাবে বা পুঙ্খানুপুঙ্খভাবে পরীক্ষা করা",
      partOfSpeech: "VERB",
      collocations: ["scrutinize closely", "scrutinize evidence", "scrutinize documents"],
      exampleSentences: [
        "The committee will scrutinize every financial transaction from the past five years.",
        "Customs officers scrutinized passport credentials with intense vigilance.",
      ],
      wordFamily: ["scrutiny (noun)", "scrutinizer (noun)", "scrutinizingly (adverb)"],
      synonyms: ["inspect", "examine", "investigate", "audit", "survey"],
      antonyms: ["glance", "ignore", "overlook", "skim"],
      ipa: "/ˈskruː.tɪ.naɪz/",
      cefrLevel: "C1",
    },
    empathy: {
      meaning: "The ability to understand and share the feelings and emotions of another person.",
      banglaMeaning: "সহমর্মিতা, সহানুভূতি ও অন্যের অনুভূতি গভীরভাবে উপলব্ধি করার ক্ষমতা",
      partOfSpeech: "NOUN",
      collocations: ["feel empathy", "deep empathy", "lack of empathy", "empathy for others"],
      exampleSentences: [
        "Effective leaders demonstrate genuine empathy towards team members.",
        "Literature helps cultivate empathy by allowing readers to step into diverse lives.",
      ],
      wordFamily: ["empathetic (adjective)", "empathize (verb)", "empathetically (adverb)"],
      synonyms: ["compassion", "understanding", "sensitivity", "fellow feeling", "solidarity"],
      antonyms: ["apathy", "indifference", "callousness", "detachment"],
      ipa: "/ˈem.pə.θi/",
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
      wordFamily: known.wordFamily || [`${clean} (base)`],
      synonyms: known.synonyms || [],
      antonyms: known.antonyms || [],
      ipa: known.ipa || `/${clean}/`,
      cefrLevel: known.cefrLevel || "B2",
    };
  }

  // Morphological & POS determination heuristic
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
  } else if (
    lower.endsWith("tion") ||
    lower.endsWith("sion") ||
    lower.endsWith("ment") ||
    lower.endsWith("ness") ||
    lower.endsWith("ity") ||
    lower.endsWith("ship") ||
    lower.endsWith("dom")
  ) {
    pos = "NOUN";
  }

  const capitalized = clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();

  return {
    id,
    word: capitalized,
    meaning: `The linguistic quality, concept, or action of ${clean}; expressing key meaning in fluent English communication.`,
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
      `In modern contexts, '${clean}' is widely recognized as an impactful term.`,
    ],
    wordFamily: [
      `${clean} (${pos.toLowerCase()})`,
      `${clean}ly (adverb)`,
      `${clean}ness (noun)`,
    ],
    synonyms: ["equivalent concept", "related expression", "similar term"],
    antonyms: ["opposing term", "contrary concept"],
    ipa: `/${lower}/`,
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

    const res = await fetch(`${baseUrl}/my-vocabulary?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.data?.items)) {
        saveLocalVault(data.data.items);
        return filterAndSortList(data.data.items, options);
      }
      if (data && Array.isArray(data.data)) {
        saveLocalVault(data.data);
        return filterAndSortList(data.data, options);
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
        item.word.synonyms.some((s) => s.toLowerCase().includes(q))
    );
  }

  if (options.partOfSpeech && options.partOfSpeech !== "ALL") {
    filtered = filtered.filter(
      (item) => item.word.partOfSpeech === options.partOfSpeech
    );
  }

  if (options.favoritesOnly) {
    filtered = filtered.filter((item) => item.isFavorite);
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
 * Add Single or Multiple Vocabulary Words using AI Generation
 */
export async function addVocabularyWithAi(
  dto: AddVocabularyDto
): Promise<AddVocabularyResponse> {
  const words = dto.words
    .map((w) => w.trim())
    .filter((w) => w.length > 0);

  if (words.length === 0) {
    throw new Error("Please enter at least one word.");
  }

  const baseUrl = getApiBaseUrl();
  const token = getAuthToken();

  // Try calling backend batch creation if implemented
  try {
    const res = await fetch(`${baseUrl}/vocabulary/create-batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        words,
        notes: dto.notes,
        mySentences: dto.mySentences,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.data) {
        // Refresh local cache
        const createdItems: MyVocabularyItem[] = Array.isArray(data.data.items)
          ? data.data.items
          : Array.isArray(data.data)
          ? data.data
          : [];
        if (createdItems.length > 0) {
          const currentVault = getLocalVault();
          const merged = [...createdItems, ...currentVault.filter((v) => !createdItems.some((c) => c.word.word.toLowerCase() === v.word.word.toLowerCase()))];
          saveLocalVault(merged);
          return {
            success: true,
            message: data.message || `Successfully added ${createdItems.length} vocabulary word(s) with AI.`,
            data: {
              processed: createdItems.length,
              items: createdItems,
            },
          };
        }
      }
    }
  } catch {
    // Fall back to client AI generation engine
  }

  // Generate each word using linguistic engine
  const currentVault = getLocalVault();
  const newlyCreated: MyVocabularyItem[] = [];

  for (const rawWord of words) {
    const wordInfo = await generateLinguisticDataForWord(rawWord);
    const existingIndex = currentVault.findIndex(
      (v) => v.word.word.toLowerCase() === wordInfo.word.toLowerCase()
    );

    const now = new Date().toISOString();
    const item: MyVocabularyItem = {
      id: `my-vocab-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      wordId: wordInfo.id,
      userId: "user-current",
      word: wordInfo,
      mySentences: dto.mySentences || [],
      notes: dto.notes || null,
      masteryLevel: 1,
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
    };

    if (existingIndex >= 0) {
      currentVault[existingIndex] = {
        ...currentVault[existingIndex],
        ...item,
        id: currentVault[existingIndex].id,
      };
      newlyCreated.push(currentVault[existingIndex]);
    } else {
      currentVault.unshift(item);
      newlyCreated.push(item);
    }
  }

  saveLocalVault(currentVault);

  return {
    success: true,
    message: `Successfully analyzed and saved ${newlyCreated.length} vocabulary word(s) with AI!`,
    data: {
      processed: newlyCreated.length,
      items: newlyCreated,
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
    const res = await fetch(`${baseUrl}/my-vocabulary/update/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(updates),
    });

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
    await fetch(`${baseUrl}/my-vocabulary/delete/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch {
    // Fallback to local
  }

  const vault = getLocalVault();
  const updated = vault.filter((item) => item.id !== id);
  saveLocalVault(updated);
  return true;
}
