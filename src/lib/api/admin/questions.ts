import { getApiBaseUrl } from "../config";
import { LevelTestQuestion, LevelTestQuestionSet } from "@/types/level-test";
import { CreateLevelTestQuestionDto, CreateQuestionSetDto, UpdateQuestionSetDto } from "./types";
import { MOCK_LEVEL_TEST_QUESTIONS, MOCK_LEVEL_TEST_SETS } from "./mocks";

/**
 * Normalizes backend question payload
 */
export function normalizeQuestionItem(item: any): LevelTestQuestion {
  const options = Array.isArray(item.questionOptions)
    ? item.questionOptions.map((opt: any) => ({
      id: opt.id || `opt-${Math.random()}`,
      content: opt.content || opt.text || "",
      isCorrect: Boolean(opt.isCorrect),
    }))
    : [];

  return {
    id: item.id || `q-${Date.now()}`,
    question: item.question || "",
    passage: item.passage || null,
    sectionType: (item.sectionType || "GRAMMAR").toUpperCase() as any,
    level: (item.level || "A1").toUpperCase(),
    difficulty: (item.difficulty || "EASY").toUpperCase(),
    answer: item.answer || (options.find((o: any) => o.isCorrect)?.content || options[0]?.content || ""),
    explanation: item.explanation || "",
    questionOptions: options,
  };
}

/**
 * Fetches questions for admin management with live backend endpoint and fallback
 */
export async function fetchAdminLevelTestQuestions(query?: {
  page?: number;
  limit?: number;
  sectionType?: string;
  level?: string;
  difficulty?: string;
  search?: string;
}): Promise<{
  items: LevelTestQuestion[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("fluentia_auth_token") : null;
    const headers: Record<string, string> = { Accept: "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const params = new URLSearchParams();
    if (query?.page) params.append("page", String(query.page));
    if (query?.limit) params.append("limit", String(query.limit));
    if (query?.sectionType && query.sectionType !== "ALL") params.append("sectionType", query.sectionType);
    if (query?.level && query.level !== "ALL") params.append("level", query.level);
    if (query?.difficulty && query.difficulty !== "ALL") params.append("difficulty", query.difficulty);
    if (query?.search) params.append("search", query.search);

    const url = `${getApiBaseUrl()}/level-test-questions?${params.toString()}`;
    const res = await fetch(url, { headers, cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      const rawData = json.data || json;
      const rawItems = rawData.items || (Array.isArray(rawData) ? rawData : []);
      if (Array.isArray(rawItems) && rawItems.length > 0) {
        const items = rawItems.map(normalizeQuestionItem);
        return {
          items,
          total: rawData.total ?? items.length,
          page: rawData.page ?? (query?.page || 1),
          limit: rawData.limit ?? (query?.limit || 5),
          totalPages: rawData.totalPages ?? 1,
        };
      }
    }
  } catch (err) {
    console.warn("Could not fetch live level test questions, using fallback", err);
  }

  // Filter fallback
  let filtered = [...MOCK_LEVEL_TEST_QUESTIONS];
  if (query?.sectionType && query.sectionType !== "ALL") {
    filtered = filtered.filter((q) => q.sectionType?.toUpperCase() === query.sectionType?.toUpperCase());
  }
  if (query?.level && query.level !== "ALL") {
    filtered = filtered.filter((q) => q.level?.toUpperCase() === query.level?.toUpperCase());
  }
  if (query?.difficulty && query.difficulty !== "ALL") {
    filtered = filtered.filter((q) => q.difficulty?.toUpperCase() === query.difficulty?.toUpperCase());
  }
  if (query?.search) {
    const q = query.search.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        (item.explanation && item.explanation.toLowerCase().includes(q)) ||
        item.id.toLowerCase().includes(q)
    );
  }

  const page = query?.page || 1;
  const limit = query?.limit || 10;
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return {
    items: paginated,
    total,
    page,
    limit,
    totalPages,
  };
}

/**
 * Creates a new question in the question bank via live backend POST /level-test-questions
 */
export async function createAdminQuestionApi(
  dto: CreateLevelTestQuestionDto
): Promise<{ success: boolean; data?: LevelTestQuestion; message?: string }> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("fluentia_auth_token") : null;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${getApiBaseUrl()}/level-test-questions`, {
      method: "POST",
      headers,
      body: JSON.stringify(dto),
    });

    const json = await res.json().catch(() => ({}));

    if (res.ok) {
      const createdItem = json.data || json;
      return {
        success: true,
        data: createdItem ? normalizeQuestionItem(createdItem) : undefined,
        message: json.message || "Question created successfully in repository.",
      };
    }

    return {
      success: false,
      message: json.message || `Failed to create question (Status: ${res.status})`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Network error while creating question.",
    };
  }
}

/**
 * Updates an existing question in the question bank via live backend PATCH /level-test-questions/:id
 */
export async function updateAdminQuestionApi(
  questionId: string,
  dto: Partial<CreateLevelTestQuestionDto>
): Promise<{ success: boolean; data?: LevelTestQuestion; message?: string }> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("fluentia_auth_token") : null;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${getApiBaseUrl()}/level-test-questions/${questionId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(dto),
    });

    const json = await res.json().catch(() => ({}));

    if (res.ok) {
      const updatedItem = json.data || json;
      return {
        success: true,
        data: updatedItem ? normalizeQuestionItem(updatedItem) : undefined,
        message: json.message || "Question updated successfully.",
      };
    }

    return {
      success: false,
      message: json.message || `Failed to update question (Status: ${res.status})`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Network error while updating question.",
    };
  }
}

/**
 * Deletes a question from the repository via DELETE /level-test-questions/:id
 */
export async function deleteAdminQuestionApi(
  questionId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("fluentia_auth_token") : null;
    const headers: Record<string, string> = { Accept: "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${getApiBaseUrl()}/level-test-questions/${questionId}`, {
      method: "DELETE",
      headers,
    });

    if (res.ok) {
      const json = await res.json().catch(() => ({}));
      return { success: true, message: json.message || "Question deleted successfully." };
    }
    const errJson = await res.json().catch(() => ({}));
    return { success: false, message: errJson.message || "Failed to delete question." };
  } catch (err: any) {
    return { success: false, message: err.message || "Network error while deleting question." };
  }
}

/**
 * Normalizes backend question set payload
 */
export function normalizeQuestionSet(item: any): LevelTestQuestionSet {
  const rawQuestions = item.questions || item.levelTestQuestions || [];
  return {
    id: item.id || `set-${Date.now()}`,
    name: item.name || "Untitled Set",
    description: item.description || null,
    isActive: Boolean(item.isActive),
    questionsCount: typeof item.questionsCount === "number" ? item.questionsCount : Array.isArray(rawQuestions) ? rawQuestions.length : 0,
    attemptsCount: typeof item.attemptsCount === "number" ? item.attemptsCount : 0,
    questions: Array.isArray(rawQuestions) && rawQuestions.length > 0 ? rawQuestions.map(normalizeQuestionItem) : undefined,
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
  };
}

/**
 * Fetches all question sets
 */
export async function fetchAdminQuestionSets(query?: {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}): Promise<{
  items: LevelTestQuestionSet[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("fluentia_auth_token") : null;
    const headers: Record<string, string> = { Accept: "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const params = new URLSearchParams();
    if (query?.page) params.append("page", String(query.page));
    if (query?.limit) params.append("limit", String(query.limit));
    if (query?.search) params.append("search", query.search);
    if (query?.isActive !== undefined) params.append("isActive", String(query.isActive));

    const url = `${getApiBaseUrl()}/level-test-questions/sets/get-all?${params.toString()}`;
    const res = await fetch(url, { headers, cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      const rawData = json.data || json;
      const rawItems = rawData.items || (Array.isArray(rawData) ? rawData : []);
      if (Array.isArray(rawItems)) {
        const items = rawItems.map(normalizeQuestionSet);
        return {
          items,
          total: rawData.total ?? items.length,
          page: rawData.page ?? (query?.page || 1),
          limit: rawData.limit ?? (query?.limit || 10),
          totalPages: rawData.totalPages ?? 1,
        };
      }
    }
  } catch (err) {
    console.warn("Could not fetch live level test sets, using fallback", err);
  }

  // Fallback
  let filtered = [...MOCK_LEVEL_TEST_SETS];
  if (query?.search) {
    const q = query.search.toLowerCase();
    filtered = filtered.filter(
      (s) => s.name.toLowerCase().includes(q) || (s.description && s.description.toLowerCase().includes(q))
    );
  }
  if (query?.isActive !== undefined) {
    filtered = filtered.filter((s) => s.isActive === query.isActive);
  }
  const page = query?.page || 1;
  const limit = query?.limit || 10;
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return {
    items: paginated,
    total,
    page,
    limit,
    totalPages,
  };
}

/**
 * Fetches a single question set by ID with all questions populated
 */
export async function fetchAdminQuestionSetById(
  setId: string
): Promise<{ success: boolean; data?: LevelTestQuestionSet; message?: string }> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("fluentia_auth_token") : null;
    const headers: Record<string, string> = { Accept: "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${getApiBaseUrl()}/level-test-questions/sets/${setId}`, {
      headers,
      cache: "no-store",
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok && json.data) {
      return {
        success: true,
        data: normalizeQuestionSet(json.data),
        message: json.message,
      };
    }
    return {
      success: false,
      message: json.message || "Failed to load question set details",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Network error loading question set details",
    };
  }
}

/**
 * Creates a new Question Set via POST /level-test-questions/create-set
 */
export async function createAdminQuestionSetApi(
  dto: CreateQuestionSetDto
): Promise<{ success: boolean; data?: LevelTestQuestionSet; message?: string }> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("fluentia_auth_token") : null;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${getApiBaseUrl()}/level-test-questions/create-set`, {
      method: "POST",
      headers,
      body: JSON.stringify(dto),
    });

    const json = await res.json().catch(() => ({}));

    if (res.ok) {
      const created = json.data || json;
      return {
        success: true,
        data: created ? normalizeQuestionSet(created) : undefined,
        message: json.message || "Question set created successfully!",
      };
    }

    return {
      success: false,
      message: json.message || `Failed to create question set (Status: ${res.status})`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Network error while creating question set.",
    };
  }
}

/**
 * Updates an existing Question Set via PATCH /level-test-questions/sets/:id
 */
export async function updateAdminQuestionSetApi(
  setId: string,
  dto: UpdateQuestionSetDto
): Promise<{ success: boolean; data?: LevelTestQuestionSet; message?: string }> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("fluentia_auth_token") : null;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${getApiBaseUrl()}/level-test-questions/sets/${setId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(dto),
    });

    const json = await res.json().catch(() => ({}));

    if (res.ok) {
      const updated = json.data || json;
      return {
        success: true,
        data: updated ? normalizeQuestionSet(updated) : undefined,
        message: json.message || "Question set updated successfully.",
      };
    }

    return {
      success: false,
      message: json.message || `Failed to update question set (Status: ${res.status})`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Network error while updating question set.",
    };
  }
}

/**
 * Deletes a Question Set via DELETE /level-test-questions/sets/:id
 */
export async function deleteAdminQuestionSetApi(
  setId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("fluentia_auth_token") : null;
    const headers: Record<string, string> = { Accept: "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${getApiBaseUrl()}/level-test-questions/sets/${setId}`, {
      method: "DELETE",
      headers,
    });

    if (res.ok) {
      const json = await res.json().catch(() => ({}));
      return { success: true, message: json.message || "Question set deleted successfully." };
    }
    const errJson = await res.json().catch(() => ({}));
    return { success: false, message: errJson.message || "Failed to delete question set." };
  } catch (err: any) {
    return { success: false, message: err.message || "Network error while deleting question set." };
  }
}

/**
 * Toggles Question Set Active status
 */
export async function toggleAdminQuestionSetStatusApi(
  setId: string,
  isActive: boolean
): Promise<{ success: boolean; data?: LevelTestQuestionSet; message?: string }> {
  return updateAdminQuestionSetApi(setId, { isActive });
}

