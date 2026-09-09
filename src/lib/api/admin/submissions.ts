import { getApiBaseUrl, resolveImageUrl } from "../config";
import { RecentTestAttempt } from "./types";
import { MOCK_ALL_SUBMISSIONS } from "./mocks";

/**
 * Normalizes raw backend test attempt item into RecentTestAttempt
 */
export function normalizeSubmissionItem(item: any): RecentTestAttempt {
  const learner = item.learner || {};
  const fName = learner.firstName || "";
  const lName = learner.lastName || "";
  const fullName = learner.fullName || (fName || lName ? `${fName} ${lName}`.trim() : item.userName || "Learner");

  const rawLearnerAvatar =
    learner.profileImage ||
    learner.avatar ||
    learner.profileImageUrl ||
    learner.avatarUrl ||
    learner.image ||
    learner.imageUrl ||
    learner.picture ||
    learner.photo ||
    learner.profile?.profileImage ||
    item.avatar ||
    item.profileImage ||
    item.profileImageUrl ||
    null;

  const resolvedLearnerAvatar = resolveImageUrl(rawLearnerAvatar);

  const scoreObj = item.score || {};
  const correct = scoreObj.correct ?? item.score ?? 0;
  const total = scoreObj.total ?? item.totalQuestions ?? 20;
  const percentage = scoreObj.percentage ?? item.percentage ?? (total > 0 ? Math.round((correct / total) * 100) : 0);

  const durationObj = item.duration || {};
  const timeSpentSeconds = durationObj.timeSpentSeconds ?? item.timeSpentSeconds ?? 0;

  const rawBd = item.sectionBreakdown || {};
  const grammar = rawBd.grammar || { correct: 0, total: 0, percentage: 0 };
  const vocabulary = rawBd.vocabulary || { correct: 0, total: 0, percentage: 0 };
  const reading = rawBd.reading || { correct: 0, total: 0, percentage: 0 };

  const aiAnalysis = item.aiAnalysis || {};

  const formatAnalysisItem = (val: any): string => {
    if (!val) return "";
    if (typeof val === "string") return val;
    if (typeof val === "object") {
      if (val.area && val.description) {
        return `${val.area}: ${val.description}${val.evidence ? ` (Evidence: ${val.evidence})` : ""}`;
      }
      if (val.description) return val.description;
      if (val.area) return val.area;
      if (val.title) return val.description ? `${val.title}: ${val.description}` : val.title;
      return Object.values(val)
        .filter((v) => typeof v === "string")
        .join(" - ");
    }
    return String(val);
  };

  const rawStrengths = Array.isArray(item.strengths)
    ? item.strengths
    : Array.isArray(aiAnalysis.strengths)
      ? aiAnalysis.strengths
      : [];

  const rawWeaknesses = Array.isArray(item.weaknesses)
    ? item.weaknesses
    : Array.isArray(aiAnalysis.weaknesses)
      ? aiAnalysis.weaknesses
      : [];

  const rawSummary =
    typeof item.summary === "string"
      ? item.summary
      : typeof aiAnalysis.summary === "string"
        ? aiAnalysis.summary
        : typeof aiAnalysis.summary === "object" && aiAnalysis.summary?.description
          ? aiAnalysis.summary.description
          : "Placement evaluation completed successfully.";

  return {
    id: item.id || `att-${Date.now()}`,
    userName: fullName,
    userEmail: learner.email || item.userEmail || "",
    avatar: resolvedLearnerAvatar,
    score: correct,
    totalQuestions: total,
    percentage,
    cefrLevel: item.cefrRating || item.cefrLevel || item.estimatedLevel || "B1",
    timeSpentSeconds,
    createdAt: item.createdAt || new Date().toISOString(),
    sectionBreakdown: {
      grammar: {
        correct: grammar.correct || 0,
        total: grammar.total || 0,
        percentage: grammar.percentage || 0,
      },
      vocabulary: {
        correct: vocabulary.correct || 0,
        total: vocabulary.total || 0,
        percentage: vocabulary.percentage || 0,
      },
      reading: {
        correct: reading.correct || 0,
        total: reading.total || 0,
        percentage: reading.percentage || 0,
      },
    },
    summary: rawSummary,
    strengths: rawStrengths.map(formatAnalysisItem).filter(Boolean),
    weaknesses: rawWeaknesses.map(formatAnalysisItem).filter(Boolean),
  };
}

/**
 * Fetches recent submissions from backend with fallback
 */
export async function fetchRecentSubmissions(limit = 10): Promise<RecentTestAttempt[]> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("fluentia_auth_token") : null;
    const headers: Record<string, string> = { Accept: "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const url = `${getApiBaseUrl()}/level-test-questions/submissions?page=1&limit=${limit}`;
    const res = await fetch(url, { headers, cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      const rawItems = json.data?.items || json.items || (Array.isArray(json.data) ? json.data : null);
      if (Array.isArray(rawItems) && rawItems.length > 0) {
        return rawItems.map(normalizeSubmissionItem);
      }
    }
  } catch (err) {
    console.warn("Could not fetch live recent submissions, using fallback", err);
  }
  return MOCK_ALL_SUBMISSIONS.slice(0, limit);
}

/**
 * Fetches all submissions from backend with fallback
 */
export async function fetchAllSubmissions(query?: {
  page?: number;
  limit?: number;
  level?: string;
  search?: string;
}): Promise<{ items: RecentTestAttempt[]; total: number; totalPages: number }> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("fluentia_auth_token") : null;
    const headers: Record<string, string> = { Accept: "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const params = new URLSearchParams();
    if (query?.page) params.append("page", String(query.page));
    if (query?.limit) params.append("limit", String(query.limit));
    if (query?.level && query.level !== "ALL") params.append("level", query.level);
    if (query?.search) params.append("search", query.search);

    const url = `${getApiBaseUrl()}/level-test-questions/submissions?${params.toString()}`;
    const res = await fetch(url, { headers, cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      const rawItems = json.data?.items || json.items || (Array.isArray(json.data) ? json.data : null);
      if (Array.isArray(rawItems) && rawItems.length > 0) {
        const items = rawItems.map(normalizeSubmissionItem);
        return {
          items,
          total: json.data?.total || json.total || items.length,
          totalPages: json.data?.totalPages || json.totalPages || 1,
        };
      }
    }
  } catch (err) {
    console.warn("Could not fetch live submissions list, using fallback", err);
  }

  // Filter fallback
  let filtered = [...MOCK_ALL_SUBMISSIONS];
  if (query?.level && query.level !== "ALL") {
    filtered = filtered.filter((i) => i.cefrLevel.toUpperCase() === query.level?.toUpperCase());
  }
  if (query?.search) {
    const q = query.search.toLowerCase();
    filtered = filtered.filter(
      (i) =>
        i.userName.toLowerCase().includes(q) ||
        i.userEmail.toLowerCase().includes(q) ||
        i.id.toLowerCase().includes(q)
    );
  }

  return {
    items: filtered,
    total: filtered.length,
    totalPages: 1,
  };
}

/**
 * Fetches submission details by ID
 */
export async function fetchSubmissionById(id: string): Promise<RecentTestAttempt | null> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("fluentia_auth_token") : null;
    const headers: Record<string, string> = { Accept: "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const url = `${getApiBaseUrl()}/level-test-questions/submissions/${id}`;
    const res = await fetch(url, { headers, cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      const rawItem = json.data || json;
      if (rawItem && rawItem.id) {
        return normalizeSubmissionItem(rawItem);
      }
    }
  } catch (err) {
    console.warn(`Could not fetch submission ${id}, using local search`, err);
  }

  const found = MOCK_ALL_SUBMISSIONS.find((i) => i.id === id);
  return found || null;
}
