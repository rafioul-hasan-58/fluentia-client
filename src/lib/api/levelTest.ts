import { getApiBaseUrl } from "./config";
import {
  LevelTestQuestion,
  LevelTestResponse,
  LevelTestSubmissionItem,
  QuestionAnswerPair,
  SubmitLevelTestPayload,
} from "@/types/level-test";

/**
 * Fallback questions in case the backend has zero seeded records or server is offline
 */
const SAMPLE_FALLBACK_QUESTIONS: LevelTestQuestion[] = [
  {
    id: "fb-1",
    question: "She ___ from Spain and lives in Madrid.",
    passage: null,
    sectionType: "GRAMMAR",
    level: "A1",
    difficulty: "EASY",
    answer: "is",
    explanation:
      '"Is" is the correct third-person singular present form of the verb "to be" for the subject pronoun "she".',
    questionOptions: [
      { id: "fb-opt-1", content: "is" },
      { id: "fb-opt-2", content: "are" },
      { id: "fb-opt-3", content: "am" },
      { id: "fb-opt-4", content: "be" },
    ],
  },
  {
    id: "fb-2",
    question:
      "The team had to ___ the meeting until next Tuesday because the project manager was unwell.",
    passage: null,
    sectionType: "VOCABULARY",
    level: "B1",
    difficulty: "MEDIUM",
    answer: "postpone",
    explanation:
      '"Postpone" means to delay an event to a later date, matching the context of moving the meeting "until next Tuesday".',
    questionOptions: [
      { id: "fb-opt-5", content: "postpone" },
      { id: "fb-opt-6", content: "cancel" },
      { id: "fb-opt-7", content: "reject" },
      { id: "fb-opt-8", content: "dismiss" },
    ],
  },
  {
    id: "fb-3",
    question: "If I ___ more time, I would travel around Europe this summer.",
    passage: null,
    sectionType: "GRAMMAR",
    level: "B1",
    difficulty: "MEDIUM",
    answer: "had",
    explanation:
      "In the Second Conditional (unreal present/future), the if-clause uses the past simple tense (had).",
    questionOptions: [
      { id: "fb-opt-9", content: "have" },
      { id: "fb-opt-10", content: "had" },
      { id: "fb-opt-11", content: "would have" },
      { id: "fb-opt-12", content: "had had" },
    ],
  },
  {
    id: "fb-4",
    question:
      "Despite the severe storm, the rescue team ___ to reach all stranded mountaineers.",
    passage: null,
    sectionType: "VOCABULARY",
    level: "B2",
    difficulty: "MEDIUM",
    answer: "managed",
    explanation:
      '"Managed to [verb]" means succeeding in doing something difficult through effort.',
    questionOptions: [
      { id: "fb-opt-13", content: "succeeded" },
      { id: "fb-opt-14", content: "managed" },
      { id: "fb-opt-15", content: "achieved" },
      { id: "fb-opt-16", content: "fulfilled" },
    ],
  },
];

/**
 * Fetches the 40-question placement test set from the Backend API
 */
export async function fetchGeneralLevelTestQuestions(
  limit: number = 40
): Promise<LevelTestQuestion[]> {
  try {
    const url = `${getApiBaseUrl()}/level-test-questions/test-set?limit=${limit}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch level test questions.`);
    }

    const json: LevelTestResponse = await response.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data;
    }

    console.warn("Backend returned empty questions list, using fallback set.");
    return SAMPLE_FALLBACK_QUESTIONS;
  } catch (error: any) {
    console.error("Error fetching level test questions:", error);
    // Return sample questions on network failure so user can still test UI
    return SAMPLE_FALLBACK_QUESTIONS;
  }
}

/**
 * Submits the user's completed test answers formatted as SubmitLevelTestPayload
 */
export async function submitLevelTestAnswers(
  submissionPayload: SubmitLevelTestPayload | LevelTestSubmissionItem[] | QuestionAnswerPair[] | any,
  endpointUrl?: string
): Promise<any> {
  const url = endpointUrl || `${getApiBaseUrl()}/level-test-questions/evaluate`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(submissionPayload),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: Failed to submit level test answers.`);
  }

  return response.json();
}
