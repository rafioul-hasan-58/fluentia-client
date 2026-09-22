import {
  getCollocationBangla,
  getCollocationExample,
  getCollocationText,
  getVerbForms,
  MyVocabularyItem,
  VocabularyFilterOptions,
} from "../types/vocabulary";

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
      banglaPronunciation: "রেজিলিয়েন্ট",
      partOfSpeech: "ADJECTIVE",
      collocations: [
        {
          collocation: "resilient economy",
          banglaMeaning: "সহনশীল অর্থনীতি",
          exampleSentence: "The country built a resilient economy capable of withstanding global shocks.",
        },
        {
          collocation: "highly resilient",
          banglaMeaning: "অত্যন্ত সহনশীল",
          exampleSentence: "Children are often highly resilient when facing change.",
        },
        {
          collocation: "remain resilient",
          banglaMeaning: "অবিচল বা দৃঢ় থাকা",
          exampleSentence: "The medical team remained resilient during the crisis.",
        },
        {
          collocation: "resilient nature",
          banglaMeaning: "সহনশীল স্বভাব বা মানসিকতা",
          exampleSentence: "Her resilient nature helped her overcome numerous challenges.",
        },
      ],
      exampleSentences: [
        "The local community showed a remarkably resilient spirit in rebuilding their town.",
        "Babies are often surprisingly resilient to temporary changes in routine.",
      ],
      wordFamily: [
        { word: "resilience", partOfSpeech: "NOUN", banglaMeaning: "স্থিতিস্থাপকতা বা সহনশীলতা" },
        { word: "resiliently", partOfSpeech: "ADVERB", banglaMeaning: "সহনশীলভাবে" },
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
      englishLevel: "B2",
      cefrLevel: "B2",
    },
    mySentences: ["I am striving to become more resilient in the face of IELTS exam pressure."],
    notes: "Frequently asked in IELTS Speaking Part 2 describing personality challenges.",
    vocabularyStatus: "LEARNING",
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
      banglaPronunciation: "সিগনিফিক্যান্ট",
      partOfSpeech: "ADJECTIVE",
      collocations: [
        {
          collocation: "significant amount",
          banglaMeaning: "উল্লেখযোগ্য পরিমাণ",
          exampleSentence: "The project required a significant amount of time and resources.",
        },
        {
          collocation: "significant increase",
          banglaMeaning: "উল্লেখযোগ্য বৃদ্ধি",
          exampleSentence: "There has been a significant increase in online learning worldwide.",
        },
        {
          collocation: "significant impact",
          banglaMeaning: "উল্লেখযোগ্য প্রভাব",
          exampleSentence: "Technology has had a significant impact on modern education.",
        },
        {
          collocation: "significant difference",
          banglaMeaning: "উল্লেখযোগ্য পার্থক্য",
          exampleSentence: "The study revealed a significant difference between the two test groups.",
        },
        {
          collocation: "significant role",
          banglaMeaning: "উল্লেখযোগ্য ভূমিকা",
          exampleSentence: "Active vocabulary plays a significant role in fluent English communication.",
        },
      ],
      exampleSentences: [
        "Technology has had a significant impact on education.",
        "There has been a significant increase in online learning.",
        "The study revealed a significant difference between the two groups.",
      ],
      wordFamily: [
        { word: "significance", partOfSpeech: "NOUN", banglaMeaning: "তাৎপর্য বা গুরুত্ব" },
        { word: "significantly", partOfSpeech: "ADVERB", banglaMeaning: "উল্লেখযোগ্যভাবে" },
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
      englishLevel: "B1",
      cefrLevel: "B1",
    },
    mySentences: ["Vocabulary has a significant impact on fluent English speaking."],
    notes: "Crucial academic and IELTS band vocabulary.",
    vocabularyStatus: "LEARNING",
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
      banglaPronunciation: "প্র্যাগম্যাটিক",
      partOfSpeech: "ADJECTIVE",
      collocations: [
        {
          collocation: "pragmatic approach",
          banglaMeaning: "বাস্তবধর্মী বা প্রয়োগবাদী দৃষ্টিভঙ্গি",
          exampleSentence: "We need a pragmatic approach rather than endless philosophical debates.",
        },
        {
          collocation: "pragmatic solution",
          banglaMeaning: "বাস্তবসম্মত সমাধান",
          exampleSentence: "The engineers devised a pragmatic solution to keep the project on track.",
        },
        {
          collocation: "pragmatic view",
          banglaMeaning: "বাস্তবমুখী মতামত",
          exampleSentence: "She holds a pragmatic view on personal financial planning.",
        },
        {
          collocation: "highly pragmatic",
          banglaMeaning: "অত্যন্ত বাস্তববাদী",
          exampleSentence: "His leadership style is highly pragmatic and result-oriented.",
        },
      ],
      exampleSentences: [
        "We need a pragmatic approach rather than endless philosophical debates.",
        "She made a pragmatic decision to postpone the trip until finances stabilized.",
      ],
      wordFamily: [
        { word: "pragmatism", partOfSpeech: "NOUN", banglaMeaning: "বাস্তববাদ বা প্রয়োগবাদ" },
        { word: "pragmatically", partOfSpeech: "ADVERB", banglaMeaning: "বাস্তবধর্মীভাবে" },
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
      englishLevel: "C1",
      cefrLevel: "C1",
    },
    mySentences: ["Taking 30 minutes daily for vocabulary is a pragmatic way to reach C1."],
    notes: "Great replacement for 'practical' in IELTS Writing Task 2 essays.",
    vocabularyStatus: "LEARNING",
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
      banglaPronunciation: "সেরেন্ডিপিটি",
      partOfSpeech: "NOUN",
      collocations: [
        {
          collocation: "pure serendipity",
          banglaMeaning: "সম্পূর্ণ আকস্মিক সৌভাগ্য",
          exampleSentence: "Finding my future co-founder at the conference was pure serendipity.",
        },
        {
          collocation: "stroke of serendipity",
          banglaMeaning: "দৈব সৌভাগ্য বা অপ্রত্যাশিত প্রাপ্তি",
          exampleSentence: "A stroke of serendipity led the researcher to discover the rare artifact.",
        },
        {
          collocation: "moment of serendipity",
          banglaMeaning: "অপ্রত্যাশিত আনন্দের মুহূর্ত",
          exampleSentence: "Discovering this quiet library was a moment of serendipity.",
        },
      ],
      exampleSentences: [
        "Finding my current mentor at the tech conference was pure serendipity.",
        "Scientific breakthroughs often owe as much to serendipity as to methodical research.",
      ],
      wordFamily: [
        { word: "serendipitous", partOfSpeech: "ADJECTIVE", banglaMeaning: "অপ্রত্যাশিত সৌভাগ্যপূর্ণ" },
        { word: "serendipitously", partOfSpeech: "ADVERB", banglaMeaning: "দৈবক্রমে বা অপ্রত্যাশিতভাবে" },
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
      englishLevel: "C2",
      cefrLevel: "C2",
    },
    mySentences: ["Learning English on Fluentia was a delightful serendipity in my life."],
    notes: "Superb word for IELTS Speaking Part 3 or descriptive writing.",
    vocabularyStatus: "MASTERED",
    masteryLevel: 3,
    isFavorite: true,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 24 * 4).toISOString(),
  },
  {
    id: "vocab-5",
    wordId: "word-5",
    userId: "user-default",
    word: {
      id: "word-5",
      word: "Soothe",
      meaning: "Gently calm a person or their feelings, or relieve pain, distress, or discomfort.",
      banglaMeaning: "শান্ত করা, প্রশমিত করা বা ব্যথা-বেদনা উপশম করা",
      banglaPronunciation: "সুদ",
      partOfSpeech: "VERB",
      verbForms: {
        v1: "soothe",
        v2: "soothed",
        v3: "soothed",
      },
      collocations: [
        {
          collocation: "soothe a baby",
          banglaMeaning: "শিশুকে শান্ত করা বা কান্না থামানো",
          exampleSentence: "She sang a gentle lullaby to soothe a crying baby.",
        },
        {
          collocation: "soothe feelings",
          banglaMeaning: "মন বা অনুভূতি শান্ত করা / আশ্বস্ত করা",
          exampleSentence: "A sincere apology helped soothe hurt feelings after the argument.",
        },
        {
          collocation: "soothe the pain",
          banglaMeaning: "ব্যথা উপশম করা বা কমানো",
          exampleSentence: "Applying a cold compress will help soothe the pain quickly.",
        },
        {
          collocation: "soothe the nerves",
          banglaMeaning: "স্নায়ু বা মানসিক উদ্বেগ শান্ত করা",
          exampleSentence: "Drinking chamomile tea can soothe frayed nerves after a stressful day.",
        },
        {
          collocation: "soothe irritation",
          banglaMeaning: "ত্বক বা কণ্ঠনালীর অস্বস্তি কমানো",
          exampleSentence: "Aloe vera gel helps soothe skin irritation and sunburn.",
        },
      ],
      exampleSentences: [
        "The mother rocked the baby gently to soothe her to sleep.",
        "A warm bath can help soothe tired muscles after strenuous exercise.",
        "His reassuring words did much to soothe the anxious crowd.",
      ],
      wordFamily: [
        { word: "soothing", partOfSpeech: "ADJECTIVE", banglaMeaning: "শান্তিদায়ক" },
        { word: "soothingly", partOfSpeech: "ADVERB", banglaMeaning: "শান্তিদায়কভাবে" },
      ],
      synonyms: [
        { word: "calm", partOfSpeech: "VERB" },
        { word: "comfort", partOfSpeech: "VERB" },
        { word: "relieve", partOfSpeech: "VERB" },
        { word: "pacify", partOfSpeech: "VERB" },
      ],
      antonyms: [
        { word: "irritate", partOfSpeech: "VERB" },
        { word: "aggravate", partOfSpeech: "VERB" },
        { word: "upset", partOfSpeech: "VERB" },
      ],
      englishLevel: "B2",
      cefrLevel: "B2",
    },
    mySentences: ["Listening to soft acoustic music helps soothe my mind after intensive study."],
    notes: "Essential IELTS vocabulary for emotions, health, and wellbeing topics.",
    vocabularyStatus: "LEARNING",
    masteryLevel: 4,
    isFavorite: false,
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 24 * 1).toISOString(),
  },
];

const LOCAL_STORAGE_KEY = "fluentia_user_vocabularies_vault";

// Helper to retrieve stored token from localStorage
export const getAuthToken = (): string | null => {
    if (typeof window === "undefined") return null;
    return (
        localStorage.getItem("fluentia_auth_token") ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        null
    );
};


// Helper to get user items from LocalStorage
export const getLocalVault = (): MyVocabularyItem[] => {
  if (typeof window === "undefined") return SEED_VOCABULARY;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Upgrade legacy cached items if they lack rich collocation details (e.g. for Significant or Soothe)
        let hasUpgraded = false;
        const upgraded = parsed.map((item: MyVocabularyItem) => {
          if (!item || !item.word) return item;

          const seedMatch = SEED_VOCABULARY.find(
            (s) => s.word?.word?.toLowerCase() === item.word?.word?.toLowerCase()
          );

          const hasUnenrichedCollocations =
            !item.word.collocations ||
            item.word.collocations.length === 0 ||
            item.word.collocations.some(
              (c: any) =>
                typeof c === "string" ||
                !c.banglaMeaning ||
                !c.exampleSentence
            );

          if (seedMatch && seedMatch.word.collocations && hasUnenrichedCollocations) {
            hasUpgraded = true;
            return {
              ...item,
              word: {
                ...item.word,
                collocations: seedMatch.word.collocations,
              },
            };
          }

          if (hasUnenrichedCollocations && Array.isArray(item.word.collocations)) {
            hasUpgraded = true;
            const enriched = item.word.collocations.map((c: any) => {
              const text = getCollocationText(c);
              const bangla = getCollocationBangla(c, item.word);
              const example = getCollocationExample(c, item.word);
              return {
                collocation: text,
                banglaMeaning: bangla,
                exampleSentence: example,
              };
            });
            return {
              ...item,
              word: {
                ...item.word,
                collocations: enriched,
              },
            };
          }

          // Ensure verbs always have verbForms
          if (
            (item.word.partOfSpeech === "VERB" || (seedMatch && seedMatch.word.partOfSpeech === "VERB")) &&
            !item.word.verbForms
          ) {
            hasUpgraded = true;
            return {
              ...item,
              word: {
                ...item.word,
                verbForms: seedMatch?.word.verbForms || getVerbForms(item.word) || undefined,
              },
            };
          }

          return item;
        });

        if (hasUpgraded) {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(upgraded));
        }
        return upgraded;
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
export const saveLocalVault = (items: MyVocabularyItem[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.warn("Failed to write local vocabulary vault", err);
  }
};

export function filterAndSortList(
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
        (item.word.banglaPronunciation &&
          item.word.banglaPronunciation.toLowerCase().includes(q)) ||
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

  if (options.status && options.status !== "ALL") {
    filtered = filtered.filter(
      (item) => item.vocabularyStatus === options.status
    );
  }

  if (options.englishLevel && options.englishLevel !== "ALL") {
    filtered = filtered.filter(
      (item) =>
        (item.word.englishLevel &&
          item.word.englishLevel.toUpperCase() === options.englishLevel?.toUpperCase()) ||
        (item.word.cefrLevel &&
          item.word.cefrLevel.toUpperCase() === options.englishLevel?.toUpperCase())
    );
  }

  if (options.favoritesOnly || options.isFavorite === true) {
    filtered = filtered.filter((item) => item.isFavorite);
  } else if (options.isFavorite === false) {
    filtered = filtered.filter((item) => !item.isFavorite);
  }

  if (options.selectedDate) {
    const targetDate = options.selectedDate;
    filtered = filtered.filter((item) => {
      const dateStr = item.createdAt || item.updatedAt;
      if (!dateStr) return false;
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return false;
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}` === targetDate;
    });
  }

  if (options.todayOnly) {
    const today = new Date();
    filtered = filtered.filter((item) => {
      const dateStr = item.createdAt || item.updatedAt;
      if (!dateStr) return false;
      const d = new Date(dateStr);
      return (
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate()
      );
    });
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