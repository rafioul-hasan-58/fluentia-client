import { getApiBaseUrl } from "./config";
import { LevelTestQuestion } from "@/types/level-test";

export interface AdminStats {
  totalLearners: number;
  newLearnersThisMonth: number;
  totalTestsEvaluated: number;
  testsEvaluatedToday: number;
  averageScorePercentage: number;
  averageCEFR: string;
  activeSessions: number;
  cefrDistribution: {
    level: string;
    label: string;
    count: number;
    percentage: number;
    color: string;
  }[];
  sectionAccuracy: {
    section: string;
    accuracy: number;
    totalAnswered: number;
  }[];
}

export interface RecentTestAttempt {
  id: string;
  userName: string;
  userEmail: string;
  avatar?: string | null;
  score: number;
  totalQuestions: number;
  percentage: number;
  cefrLevel: string;
  timeSpentSeconds: number;
  createdAt: string;
  sectionBreakdown: {
    grammar?: { correct: number; total: number; percentage: number };
    vocabulary?: { correct: number; total: number; percentage: number };
    reading?: { correct: number; total: number; percentage: number };
  };
  summary?: string;
  strengths?: string[];
  weaknesses?: string[];
}

export interface UserProfileDetails {
  id?: string;
  userId?: string;
  estimatedCEFR?: string | null;
  targetLevel?: string | null;
  nativeLanguage?: string | null;
  learningGoals?: string[];
  dailyGoalMinutes?: number;
  streakDays?: number;
  lastActiveAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface AdminUserRecord {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  avatar?: string | null;
  role: "ADMIN" | "USER";
  level: string;
  proficiencyLevel?: string;
  targetLevel?: string | null;
  provider: "email" | "google";
  testsTaken: number;
  isSuspended: boolean;
  lastActive: string;
  createdAt: string;
  updatedAt?: string;
  profile?: UserProfileDetails | null;
}

export const MOCK_ADMIN_STATS: AdminStats = {
  totalLearners: 1284,
  newLearnersThisMonth: 184,
  totalTestsEvaluated: 4920,
  testsEvaluatedToday: 87,
  averageScorePercentage: 68.5,
  averageCEFR: "B2 Upper Intermediate",
  activeSessions: 42,
  cefrDistribution: [
    { level: "A1", label: "Beginner", count: 154, percentage: 12, color: "#94a3b8" },
    { level: "A2", label: "Elementary", count: 231, percentage: 18, color: "#38bdf8" },
    { level: "B1", label: "Intermediate", count: 410, percentage: 32, color: "#818cf8" },
    { level: "B2", label: "Upper Intermediate", count: 308, percentage: 24, color: "#a855f7" },
    { level: "C1", label: "Advanced", count: 128, percentage: 10, color: "#ec4899" },
    { level: "C2", label: "Mastery", count: 53, percentage: 4, color: "#f59e0b" },
  ],
  sectionAccuracy: [
    { section: "Grammar & Structure", accuracy: 64, totalAnswered: 3840 },
    { section: "Vocabulary & Idioms", accuracy: 72, totalAnswered: 3840 },
    { section: "Reading Comprehension", accuracy: 81, totalAnswered: 1920 },
  ],
};

export const MOCK_RECENT_SUBMISSIONS: RecentTestAttempt[] = [
  {
    id: "6a9efdf630080295fc0bcddd",
    userName: "Hasan Mahmod",
    userEmail: "hasanmahod2004@gmail.com",
    avatar: null,
    score: 13,
    totalQuestions: 20,
    percentage: 65,
    cefrLevel: "B1",
    timeSpentSeconds: 480,
    createdAt: "2026-09-07T18:09:58.802Z",
    sectionBreakdown: {
      grammar: { correct: 5, total: 8, percentage: 62.5 },
      vocabulary: { correct: 5, total: 7, percentage: 71.4 },
      reading: { correct: 3, total: 5, percentage: 60.0 },
    },
    summary: "Solid intermediate command of practical vocabulary with steady progress in grammatical structures.",
    strengths: ["Everyday vocabulary", "Direct sentence patterns"],
    weaknesses: ["Complex conditional clauses", "Dependent prepositions"],
  },
  {
    id: "6a9ef81830080295fc0bcdc6",
    userName: "Foysal Islam",
    userEmail: "foysalislam5547@gmail.com",
    avatar: null,
    score: 0,
    totalQuestions: 20,
    percentage: 0,
    cefrLevel: "A1",
    timeSpentSeconds: 120,
    createdAt: "2026-09-07T17:44:56.224Z",
    sectionBreakdown: {
      grammar: { correct: 0, total: 8, percentage: 0 },
      vocabulary: { correct: 0, total: 7, percentage: 0 },
      reading: { correct: 0, total: 5, percentage: 0 },
    },
    summary: "Initial placement diagnostic. Recommends starting with fundamental vocabulary and basic sentence structures.",
    strengths: ["Willingness to learn"],
    weaknesses: ["Basic verb conjugations", "Core noun vocabulary"],
  },
  {
    id: "6a9ef7193377b2e3c5627ed3",
    userName: "Rafioul Hasan Prodhan",
    userEmail: "rafioulhasan2@gmail.com",
    avatar: "https://medsyst.s3.eu-north-1.amazonaws.com/avatars/1788710141329-e7bc5d0551a2f421.jfif",
    score: 6,
    totalQuestions: 20,
    percentage: 30,
    cefrLevel: "A2",
    timeSpentSeconds: 520,
    createdAt: "2026-09-07T17:40:41.990Z",
    sectionBreakdown: {
      grammar: { correct: 2, total: 8, percentage: 25.0 },
      vocabulary: { correct: 2, total: 7, percentage: 28.5 },
      reading: { correct: 2, total: 5, percentage: 40.0 },
    },
    summary: "Elementary proficiency. Developing understanding of basic sentence patterns with strong potential for B1 progression.",
    strengths: ["Simple present tense", "Basic reading comprehension"],
    weaknesses: ["Past simple irregular verbs", "Prepositions of place"],
  },
  {
    id: "6a9eef7ed491df94ad4a7be4",
    userName: "Rafioul Hasan Prodhan",
    userEmail: "rafioulhasan2@gmail.com",
    avatar: "https://medsyst.s3.eu-north-1.amazonaws.com/avatars/1788710141329-e7bc5d0551a2f421.jfif",
    score: 1,
    totalQuestions: 5,
    percentage: 20,
    cefrLevel: "A1",
    timeSpentSeconds: 95,
    createdAt: "2026-09-07T17:08:14.796Z",
    sectionBreakdown: {
      grammar: { correct: 1, total: 2, percentage: 50.0 },
      vocabulary: { correct: 0, total: 2, percentage: 0 },
      reading: { correct: 0, total: 1, percentage: 0 },
    },
    summary: "Preliminary short diagnostic test session.",
    strengths: ["Basic pronoun usage"],
    weaknesses: ["Vocabulary breadth"],
  },
];

export const MOCK_ADMIN_USERS: AdminUserRecord[] = [
  {
    id: "6a9f026e38a959b4a85efc06",
    name: "Fluentia Admin",
    firstName: "Fluentia",
    lastName: "Admin",
    email: "admin@gmail.com",
    avatar: null,
    role: "ADMIN",
    level: "A2 Elementary",
    proficiencyLevel: "A2",
    targetLevel: null,
    provider: "email",
    testsTaken: 0,
    isSuspended: false,
    lastActive: "Just now",
    createdAt: "2026-09-07T18:29:02.473Z",
    updatedAt: "2026-09-07T18:48:42.172Z",
    profile: null,
  },
  {
    id: "6a9efded30080295fc0bcddc",
    name: "Hasan Mahmod",
    firstName: "Hasan",
    lastName: "Mahmod",
    email: "hasanmahod2004@gmail.com",
    avatar: null,
    role: "USER",
    level: "B1 Intermediate",
    proficiencyLevel: "B1",
    targetLevel: null,
    provider: "google",
    testsTaken: 1,
    isSuspended: false,
    lastActive: "15m ago",
    createdAt: "2026-09-07T18:09:49.128Z",
    updatedAt: "2026-09-07T18:48:42.172Z",
    profile: {
      id: "6a9efdf830080295fc0bcdf2",
      userId: "6a9efded30080295fc0bcddc",
      estimatedCEFR: "B1",
      targetLevel: null,
      nativeLanguage: null,
      learningGoals: [],
      dailyGoalMinutes: 15,
      streakDays: 0,
      lastActiveAt: "2026-09-07T18:09:59.768Z",
      createdAt: "2026-09-07T18:09:59.769Z",
      updatedAt: "2026-09-07T18:09:59.769Z",
    },
  },
  {
    id: "6a9ef9f5edfbc889ec95f120",
    name: "Fluentia Admin",
    firstName: "Fluentia",
    lastName: "Admin",
    email: "adminfluentia@gmail.com",
    avatar: null,
    role: "ADMIN",
    level: "A2 Elementary",
    proficiencyLevel: "A2",
    targetLevel: null,
    provider: "email",
    testsTaken: 0,
    isSuspended: false,
    lastActive: "Just now",
    createdAt: "2026-09-07T17:52:53.030Z",
    updatedAt: "2026-09-07T18:48:42.172Z",
    profile: null,
  },
  {
    id: "6a9ef7043377b2e3c5627ed2",
    name: "Farhanamito",
    firstName: "Farhanamito",
    lastName: "",
    email: "farhanamito54@gmail.com",
    avatar: null,
    role: "USER",
    level: "A2 Elementary",
    proficiencyLevel: "A2",
    targetLevel: null,
    provider: "google",
    testsTaken: 0,
    isSuspended: false,
    lastActive: "1h ago",
    createdAt: "2026-09-07T17:40:20.817Z",
    updatedAt: "2026-09-07T18:48:42.172Z",
    profile: null,
  },
  {
    id: "6a9ef56e3377b2e3c5627ed1",
    name: "Foysal Islam",
    firstName: "Foysal",
    lastName: "Islam",
    email: "foysalislam5547@gmail.com",
    avatar: null,
    role: "USER",
    level: "A1 Beginner",
    proficiencyLevel: "A1",
    targetLevel: null,
    provider: "google",
    testsTaken: 1,
    isSuspended: false,
    lastActive: "1h ago",
    createdAt: "2026-09-07T17:33:34.460Z",
    updatedAt: "2026-09-07T18:48:42.172Z",
    profile: {
      id: "6a9ef81930080295fc0bcddb",
      userId: "6a9ef56e3377b2e3c5627ed1",
      estimatedCEFR: "A1",
      targetLevel: null,
      nativeLanguage: null,
      learningGoals: [],
      dailyGoalMinutes: 15,
      streakDays: 0,
      lastActiveAt: "2026-09-07T17:44:57.202Z",
      createdAt: "2026-09-07T17:44:57.203Z",
      updatedAt: "2026-09-07T17:44:57.203Z",
    },
  },
  {
    id: "6a9d8f0f223b54c7a20fb01c",
    name: "Rafioul Hasan Sourob",
    firstName: "Rafioul",
    lastName: "Hasan Sourob",
    email: "rafioulhasan@gmail.com",
    avatar: null,
    role: "USER",
    level: "A2 Elementary",
    proficiencyLevel: "A2",
    targetLevel: null,
    provider: "email",
    testsTaken: 0,
    isSuspended: false,
    lastActive: "Yesterday",
    createdAt: "2026-09-06T16:04:31.902Z",
    updatedAt: "2026-09-07T18:48:42.172Z",
    profile: null,
  },
  {
    id: "6a96da820a2010ee88950305",
    name: "Rafioul Hasan Prodhan",
    firstName: "Rafioul",
    lastName: "Hasan Prodhan",
    email: "rafioulhasan2@gmail.com",
    avatar: "https://medsyst.s3.eu-north-1.amazonaws.com/avatars/1788710141329-e7bc5d0551a2f421.jfif",
    role: "USER",
    level: "A2 Elementary",
    proficiencyLevel: "A2",
    targetLevel: "B2",
    provider: "email",
    testsTaken: 2,
    isSuspended: false,
    lastActive: "1h ago",
    createdAt: "2026-09-01T14:00:34.016Z",
    updatedAt: "2026-09-07T18:48:42.172Z",
    profile: {
      id: "6a9d8cd5223b54c7a20fb01b",
      userId: "6a96da820a2010ee88950305",
      estimatedCEFR: "A2",
      targetLevel: "B2",
      nativeLanguage: "Bengali",
      learningGoals: ["Speaking", "Grammar", "Business English"],
      dailyGoalMinutes: 15,
      streakDays: 0,
      lastActiveAt: "2026-09-07T17:40:42.970Z",
      createdAt: null,
      updatedAt: "2026-09-07T17:40:42.972Z",
    },
  },
];

export const MOCK_ALL_SUBMISSIONS: RecentTestAttempt[] = [
  ...MOCK_RECENT_SUBMISSIONS,
];

/**
 * Format relative ISO timestamp helper
 */
function formatRelativeTime(isoString?: string | null): string {
  if (!isoString) return "Recently";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 0) return "Just now";
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return "Just now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  } catch {
    return isoString || "Recently";
  }
}

/**
 * Normalizes raw backend user item into AdminUserRecord
 */
export function normalizeUserItem(item: any): AdminUserRecord {
  const fName = item.firstName || "";
  const lName = item.lastName || "";
  const fullName =
    item.fullName ||
    (fName || lName ? `${fName} ${lName}`.trim() : item.name || "Learner");

  const proficiency = item.proficiency || {};
  const profLevel = proficiency.level || item.profile?.estimatedCEFR || item.level || "A1";
  const profLabel =
    proficiency.label ||
    (typeof item.level === "string" && item.level.includes(" ")
      ? item.level
      : `${profLevel} Elementary`);

  const testsCount =
    typeof item.testsCount === "number"
      ? item.testsCount
      : typeof item.testsTaken === "number"
        ? item.testsTaken
        : parseInt(String(item.testsTaken || "0"), 10) || 0;

  const authProvider = String(item.authProvider || item.provider || "EMAIL").toLowerCase();
  const profile = item.profile || null;

  return {
    id: item.id || `usr-${Date.now()}`,
    name: fullName,
    firstName: item.firstName || "",
    lastName: item.lastName || "",
    email: item.email || "",
    avatar: item.profileImage || item.avatar || null,
    role: item.role === "ADMIN" ? "ADMIN" : "USER",
    level: profLabel,
    proficiencyLevel: profLevel,
    targetLevel: profile?.targetLevel || item.targetLevel || null,
    provider: authProvider === "google" ? "google" : "email",
    testsTaken: testsCount,
    isSuspended: Boolean(item.isSuspended),
    lastActive: formatRelativeTime(item.lastActive || item.updatedAt || item.createdAt),
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
    profile: profile
      ? {
        id: profile.id,
        userId: profile.userId,
        estimatedCEFR: profile.estimatedCEFR,
        targetLevel: profile.targetLevel,
        nativeLanguage: profile.nativeLanguage,
        learningGoals: Array.isArray(profile.learningGoals) ? profile.learningGoals : [],
        dailyGoalMinutes: profile.dailyGoalMinutes ?? 15,
        streakDays: profile.streakDays ?? 0,
        lastActiveAt: profile.lastActiveAt,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      }
      : null,
  };
}

/**
 * Normalizes raw backend test attempt item into RecentTestAttempt
 */
function normalizeSubmissionItem(item: any): RecentTestAttempt {
  const learner = item.learner || {};
  const fName = learner.firstName || "";
  const lName = learner.lastName || "";
  const fullName = learner.fullName || (fName || lName ? `${fName} ${lName}`.trim() : item.userName || "Learner");

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
    avatar: learner.profileImage || item.avatar || null,
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

/**
 * Sorts users so that ADMINs are always at the top of the list
 */
export function sortUsersWithAdminsFirst(users: AdminUserRecord[]): AdminUserRecord[] {
  return [...users].sort((a, b) => {
    // 1. Role priority: ADMIN always first
    const aIsAdmin = a.role?.toUpperCase() === "ADMIN";
    const bIsAdmin = b.role?.toUpperCase() === "ADMIN";
    if (aIsAdmin && !bIsAdmin) return -1;
    if (!aIsAdmin && bIsAdmin) return 1;

    // 2. Active status priority: active before suspended
    if (!a.isSuspended && b.isSuspended) return -1;
    if (a.isSuspended && !b.isSuspended) return 1;

    // 3. Newest first (createdAt)
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateB - dateA;
  });
}

/**
 * Fetches users directory from backend with fallback
 */
export async function fetchAdminUsers(query?: {
  page?: number;
  limit?: number;
  role?: string;
  isSuspended?: boolean | "ALL";
  search?: string;
}): Promise<{ items: AdminUserRecord[]; total: number; page: number; limit: number; totalPages: number }> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("fluentia_auth_token") : null;
    const headers: Record<string, string> = { Accept: "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const params = new URLSearchParams();
    if (query?.page) params.append("page", String(query.page));
    if (query?.limit) params.append("limit", String(query.limit));
    if (query?.role && query.role !== "ALL") params.append("role", query.role);
    if (typeof query?.isSuspended === "boolean") params.append("isSuspended", String(query.isSuspended));
    if (query?.search) params.append("search", query.search);

    const url = `${getApiBaseUrl()}/users?${params.toString()}`;
    const res = await fetch(url, { headers, cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      const rawData = json.data || json;
      const rawItems = rawData.items || (Array.isArray(rawData) ? rawData : []);
      if (Array.isArray(rawItems) && rawItems.length > 0) {
        const items = sortUsersWithAdminsFirst(rawItems.map(normalizeUserItem));
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
    console.warn("Could not fetch live users directory, using fallback", err);
  }

  // Filter fallback
  let filtered = sortUsersWithAdminsFirst([...MOCK_ADMIN_USERS]);
  if (query?.role && query.role !== "ALL") {
    filtered = filtered.filter((u) => u.role.toUpperCase() === query.role?.toUpperCase());
  }
  if (typeof query?.isSuspended === "boolean") {
    filtered = filtered.filter((u) => u.isSuspended === query.isSuspended);
  }
  if (query?.search) {
    const q = query.search.toLowerCase();
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q)
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
 * Toggles or updates user suspension status
 */
export async function toggleUserSuspensionApi(
  userId: string,
  isSuspended?: boolean
): Promise<{ success: boolean; data?: any; message?: string }> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("fluentia_auth_token") : null;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const body = typeof isSuspended === "boolean" ? JSON.stringify({ isSuspended }) : undefined;

    // First try standard toggle endpoint
    let res = await fetch(`${getApiBaseUrl()}/users/${userId}/toggle-suspend`, {
      method: "PATCH",
      headers,
      body,
    });

    // If 404, fallback to /users/:id
    if (!res.ok && res.status === 404) {
      res = await fetch(`${getApiBaseUrl()}/users/${userId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(typeof isSuspended === "boolean" ? { isSuspended } : {}),
      });
    }

    if (res.ok) {
      const json = await res.json();
      const message = json.message || json.data?.message || "User status updated successfully";
      return { success: true, data: json.data, message };
    }
    const errJson = await res.json().catch(() => ({}));
    return { success: false, message: errJson.message || "Failed to toggle user suspension." };
  } catch (err: any) {
    return { success: false, message: err.message || "Network error while updating suspension." };
  }
}

/**
 * Updates a user's role (ADMIN | USER)
 */
export async function updateUserRoleApi(
  userId: string,
  role: "ADMIN" | "USER"
): Promise<{ success: boolean; data?: any; message?: string }> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("fluentia_auth_token") : null;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${getApiBaseUrl()}/users/${userId}/role`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ role }),
    });

    if (res.ok) {
      const json = await res.json();
      return { success: true, data: json.data, message: json.message };
    }
    const errJson = await res.json().catch(() => ({}));
    return { success: false, message: errJson.message || "Failed to update user role." };
  } catch (err: any) {
    return { success: false, message: err.message || "Network error while updating user role." };
  }
}

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

export const MOCK_LEVEL_TEST_QUESTIONS: LevelTestQuestion[] = [
  {
    id: "6a9eb72a0991ecb104b57f7b",
    question: "My sister's daughter is my ___.",
    passage: null,
    sectionType: "VOCABULARY",
    level: "A1",
    difficulty: "EASY",
    answer: "niece",
    explanation: 'A "niece" is the daughter of one\'s brother or sister.',
    questionOptions: [
      { id: "6a9eb843af983cad3033354a", content: "niece" },
      { id: "6a9eb843af983cad3033354b", content: "nephew" },
      { id: "6a9eb843af983cad3033354c", content: "aunt" },
      { id: "6a9eb843af983cad3033354d", content: "cousin" },
    ],
  },
  {
    id: "6a9eb7120991ecb104b57f67",
    question: "There is ___ fresh orange on the dining table.",
    passage: null,
    sectionType: "GRAMMAR",
    level: "A1",
    difficulty: "EASY",
    answer: "a",
    explanation: 'The indefinite article "a" is used before singular countable nouns modified by words beginning with a consonant sound ("fresh").',
    questionOptions: [
      { id: "6a9eb7e8af983cad3033353a", content: "a" },
      { id: "6a9eb7e8af983cad3033353b", content: "an" },
      { id: "6a9eb7e8af983cad3033353c", content: "many" },
      { id: "6a9eb7e8af983cad3033353d", content: "some" },
    ],
  },
  {
    id: "6a9eb6ee0991ecb104b57f49",
    question: "Can you please shut the ___? The cold wind is blowing into the room.",
    passage: null,
    sectionType: "VOCABULARY",
    level: "A1",
    difficulty: "EASY",
    answer: "window",
    explanation: 'A "window" is an opening in a wall fitted with glass that can be shut to block outdoor wind.',
    questionOptions: [
      { id: "6a9eb7c6af983cad30333522", content: "window" },
      { id: "6a9eb7c6af983cad30333523", content: "table" },
      { id: "6a9eb7c6af983cad30333524", content: "chair" },
      { id: "6a9eb7c6af983cad30333525", content: "floor" },
    ],
  },
  {
    id: "6a9eb6ec0991ecb104b57f35",
    question: "Yesterday, David ___ an apple and a sandwich for his lunch.",
    passage: null,
    sectionType: "GRAMMAR",
    level: "A1",
    difficulty: "EASY",
    answer: "ate",
    explanation: '"Ate" is the past simple form of the irregular verb "eat", required by the past time marker "yesterday".',
    questionOptions: [
      { id: "6a9eb7b5af983cad30333512", content: "ate" },
      { id: "6a9eb7b5af983cad30333513", content: "eat" },
      { id: "6a9eb7b5af983cad30333514", content: "eats" },
      { id: "6a9eb7b5af983cad30333515", content: "eating" },
    ],
  },
  {
    id: "6a9eb6e40991ecb104b57f17",
    question: "What does Marco enjoy doing during his free time on weekends?",
    passage: "Hello! My name is Marco. I am twenty-five years old and I work as a graphic designer in Milan. On weekends, I love riding my bicycle in the park and cooking Italian dinners for my close friends.",
    sectionType: "READING",
    level: "A1",
    difficulty: "EASY",
    answer: "Riding his bicycle and cooking dinners for friends",
    explanation: 'The text states that on weekends Marco loves "riding my bicycle in the park and cooking Italian dinners for my close friends".',
    questionOptions: [
      { id: "6a9eb79caf983cad303334fa", content: "Riding his bicycle and cooking dinners for friends" },
      { id: "6a9eb79caf983cad303334fb", content: "Designing graphics at the downtown office" },
      { id: "6a9eb79caf983cad303334fc", content: "Playing competitive sports in a national tournament" },
      { id: "6a9eb79caf983cad303334fd", content: "Working as a chef at a busy Italian restaurant" },
    ],
  },
  {
    id: "6a9eb6bc0991ecb104b57ef9",
    question: "They ___ watch television in the afternoon because they have sports practice.",
    passage: null,
    sectionType: "GRAMMAR",
    level: "A1",
    difficulty: "EASY",
    answer: "don't",
    explanation: '"Don\'t" (do not) is the standard present simple negative auxiliary used with plural subject pronouns like "they".',
    questionOptions: [
      { id: "6a9eb77eaf983cad303334e2", content: "don't" },
      { id: "6a9eb77eaf983cad303334e3", content: "doesn't" },
      { id: "6a9eb77eaf983cad303334e4", content: "isn't" },
      { id: "6a9eb77eaf983cad303334e5", content: "aren't" },
    ],
  },
  {
    id: "6a9eb6a20991ecb104b57ee5",
    question: "I always eat breakfast in the ___ before I leave for work.",
    passage: null,
    sectionType: "VOCABULARY",
    level: "A1",
    difficulty: "EASY",
    answer: "morning",
    explanation: "Breakfast is the first meal of the day, traditionally eaten in the morning.",
    questionOptions: [
      { id: "6a9eb76faf983cad303334d2", content: "morning" },
      { id: "6a9eb76faf983cad303334d3", content: "night" },
      { id: "6a9eb76faf983cad303334d4", content: "evening" },
      { id: "6a9eb76faf983cad303334d5", content: "midnight" },
    ],
  },
  {
    id: "6a9eb6970991ecb104b57ed1",
    question: "She ___ from Spain and lives in Madrid.",
    passage: null,
    sectionType: "GRAMMAR",
    level: "A1",
    difficulty: "EASY",
    answer: "is",
    explanation: '"Is" is the correct third-person singular present form of the verb "to be" for the subject pronoun "she".',
    questionOptions: [
      { id: "6a9eb75caf983cad303334c2", content: "is" },
      { id: "6a9eb75caf983cad303334c3", content: "are" },
      { id: "6a9eb75caf983cad303334c4", content: "am" },
      { id: "6a9eb75caf983cad303334c5", content: "be" },
    ],
  },
  {
    id: "6a9eb72d0991ecb104b57f85",
    question: "If it rains heavily tomorrow afternoon, we ___ our hiking trip in the mountains.",
    passage: null,
    sectionType: "GRAMMAR",
    level: "A2",
    difficulty: "MEDIUM",
    answer: "will cancel",
    explanation: 'The first conditional ("If + present simple, will + base verb") expresses a real and probable future condition and its result.',
    questionOptions: [
      { id: "6a9eb86caf983cad30333552", content: "will cancel" },
      { id: "6a9eb86caf983cad30333553", content: "canceled" },
      { id: "6a9eb86caf983cad30333554", content: "would cancel" },
      { id: "6a9eb86caf983cad30333555", content: "cancel" },
    ],
  },
  {
    id: "6a9eb71c0991ecb104b57f6c",
    question: "We don't have ___ fresh milk left in the refrigerator, so I need to go to the grocery store.",
    passage: null,
    sectionType: "GRAMMAR",
    level: "A2",
    difficulty: "EASY",
    answer: "any",
    explanation: '"Any" is the appropriate quantifier in negative sentences when referring to uncountable nouns like "milk".',
    questionOptions: [
      { id: "6a9eb7e9af983cad3033353e", content: "any" },
      { id: "6a9eb7e9af983cad3033353f", content: "some" },
      { id: "6a9eb7e9af983cad30333540", content: "many" },
      { id: "6a9eb7e9af983cad30333541", content: "a few" },
    ],
  },
  {
    id: "6a9eb7010991ecb104b57f53",
    question: "What action are building residents instructed to take before Thursday morning?",
    passage: "Attention Residents: The property maintenance staff will inspect water pipes in all units this Thursday between 9:00 AM and 1:00 PM. Please ensure that kitchen sinks and bathroom plumbing fixtures are completely clear and accessible. Water utility services will be temporarily shut off during this four-hour inspection window.",
    sectionType: "READING",
    level: "A2",
    difficulty: "MEDIUM",
    answer: "Ensure kitchen sinks and bathroom areas are clear and accessible",
    explanation: 'The notice explicitly instructs residents to "ensure that kitchen sinks and bathroom plumbing fixtures are completely clear and accessible".',
    questionOptions: [
      { id: "6a9eb7d7af983cad3033352a", content: "Ensure kitchen sinks and bathroom areas are clear and accessible" },
      { id: "6a9eb7d7af983cad3033352b", content: "Repair their own leaking pipes before the inspectors arrive" },
      { id: "6a9eb7d7af983cad3033352c", content: "Vacate their apartments for the remainder of the calendar week" },
      { id: "6a9eb7d7af983cad3033352d", content: "Pay an emergency plumbing fee directly to building management" },
    ],
  },
  {
    id: "6a9eb6ec0991ecb104b57f3a",
    question: "Please remember to ___ your winter jacket before stepping outside; the temperature is below zero.",
    passage: null,
    sectionType: "VOCABULARY",
    level: "A2",
    difficulty: "MEDIUM",
    answer: "put on",
    explanation: 'The phrasal verb "put on" means to dress oneself in clothing or outerwear.',
    questionOptions: [
      { id: "6a9eb7b8af983cad30333516", content: "put on" },
      { id: "6a9eb7b8af983cad30333517", content: "take off" },
      { id: "6a9eb7b8af983cad30333518", content: "give up" },
      { id: "6a9eb7b8af983cad30333519", content: "turn down" },
    ],
  },
  {
    id: "6a9eb6e50991ecb104b57f21",
    question: "This new laptop model is ___ than the desktop computer I bought three years ago.",
    passage: null,
    sectionType: "GRAMMAR",
    level: "A2",
    difficulty: "MEDIUM",
    answer: "much faster",
    explanation: '"Much faster" correctly applies the comparative form "faster" intensified by the adverb "much". "More faster" is a double comparative and ungrammatical.',
    questionOptions: [
      { id: "6a9eb7a9af983cad30333502", content: "much faster" },
      { id: "6a9eb7a9af983cad30333503", content: "more faster" },
      { id: "6a9eb7a9af983cad30333504", content: "fastest" },
      { id: "6a9eb7a9af983cad30333505", content: "as fast" },
    ],
  },
  {
    id: "6a9eb6c80991ecb104b57f08",
    question: "The morning train was delayed, so the platform was ___ with commuters waiting to board.",
    passage: null,
    sectionType: "VOCABULARY",
    level: "A2",
    difficulty: "EASY",
    answer: "crowded",
    explanation: '"Crowded" describes a place that is packed with a large number of people.',
    questionOptions: [
      { id: "6a9eb78caf983cad303334ee", content: "crowded" },
      { id: "6a9eb78caf983cad303334ef", content: "empty" },
      { id: "6a9eb78caf983cad303334f0", content: "quiet" },
      { id: "6a9eb78caf983cad303334f1", content: "narrow" },
    ],
  },
  {
    id: "6a9eb6ad0991ecb104b57eef",
    question: "According to the notice, what new services can community library visitors access today?",
    passage: "Community libraries are changing. Today, visitors can do much more than borrow printed books. Many branches now offer free high-speed internet access, digital audiobooks, quiet study rooms, and weekly workshops on computer programming and creative writing.",
    sectionType: "READING",
    level: "A2",
    difficulty: "EASY",
    answer: "Attend educational workshops and use free internet",
    explanation: 'The text states that libraries now offer "free high-speed internet access" and "weekly workshops on computer programming and creative writing".',
    questionOptions: [
      { id: "6a9eb77caf983cad303334da", content: "Attend educational workshops and use free internet" },
      { id: "6a9eb77caf983cad303334db", content: "Purchase brand new laptops at discounted prices" },
      { id: "6a9eb77caf983cad303334dc", content: "Only borrow physical hardcover novels" },
      { id: "6a9eb77caf983cad303334dd", content: "Enroll in official university degree programs" },
    ],
  },
  {
    id: "6a9eb6a00991ecb104b57edb",
    question: "While Sarah was reading a book, her brother ___ video games in the living room.",
    passage: null,
    sectionType: "GRAMMAR",
    level: "A2",
    difficulty: "EASY",
    answer: "was playing",
    explanation: 'The past continuous "was playing" is used to describe an ongoing action occurring simultaneously with another past continuous action ("was reading").',
    questionOptions: [
      { id: "6a9eb75faf983cad303334ca", content: "was playing" },
      { id: "6a9eb75faf983cad303334cb", content: "plays" },
      { id: "6a9eb75faf983cad303334cc", content: "is playing" },
      { id: "6a9eb75faf983cad303334cd", content: "has played" },
    ],
  },
  {
    id: "6a9eb7360991ecb104b57f8a",
    question: "During the interview, the journalist asked the author where ___ the inspiration for his historical novel.",
    passage: null,
    sectionType: "GRAMMAR",
    level: "B1",
    difficulty: "MEDIUM",
    answer: "he had found",
    explanation: 'Reported questions follow affirmative statement word order (subject + verb) with tense backshift to the past perfect ("he had found").',
    questionOptions: [
      { id: "6a9eb86eaf983cad30333556", content: "he had found" },
      { id: "6a9eb86eaf983cad30333557", content: "had he found" },
      { id: "6a9eb86eaf983cad30333558", content: "did he find" },
      { id: "6a9eb86eaf983cad30333559", content: "he has found" },
    ],
  },
  {
    id: "6a9eb7210991ecb104b57f71",
    question: "What is a primary environmental advantage of vertical farming described in the text?",
    passage: "Urban vertical farming is revolutionizing food production across metropolitan areas. By cultivating crops in stacked vertical layers inside climate-controlled indoor facilities, these automated operations consume up to 90% less water than conventional outdoor agriculture. Furthermore, because crops grow in sterile environments shielded from adverse weather and insects, vertical farms require virtually no chemical pesticides, supplying fresh produce directly to urban markets with minimal transportation emissions.",
    sectionType: "READING",
    level: "B1",
    difficulty: "MEDIUM",
    answer: "It drastically reduces water consumption and eliminates the need for chemical pesticides",
    explanation: "The text highlights that vertical farms use up to 90% less water and require virtually no chemical pesticides compared to traditional farming.",
    questionOptions: [
      { id: "6a9eb80aaf983cad30333542", content: "It drastically reduces water consumption and eliminates the need for chemical pesticides" },
      { id: "6a9eb80aaf983cad30333543", content: "It depends entirely on natural open-air rainfall and seasonal weather patterns" },
      { id: "6a9eb80aaf983cad30333544", content: "It relies on international shipping routes to transport harvested food" },
      { id: "6a9eb80aaf983cad30333545", content: "It replaces all traditional rural farms with heavy industrial manufacturing plants" },
    ],
  },
  {
    id: "6a9eb7030991ecb104b57f58",
    question: "The research department decided to ___ a comprehensive market survey before releasing the product.",
    passage: null,
    sectionType: "VOCABULARY",
    level: "B1",
    difficulty: "MEDIUM",
    answer: "conduct",
    explanation: 'The established standard collocation for organizing and administering research or an investigation is to "conduct a survey".',
    questionOptions: [
      { id: "6a9eb7d8af983cad3033352e", content: "conduct" },
      { id: "6a9eb7d8af983cad3033352f", content: "compose" },
      { id: "6a9eb7d8af983cad30333530", content: "attract" },
      { id: "6a9eb7d8af983cad30333531", content: "invent" },
    ],
  },
  {
    id: "6a9eb6ed0991ecb104b57f3f",
    question: "The ancient medieval fortress ___ by thousands of international tourists each summer.",
    passage: null,
    sectionType: "GRAMMAR",
    level: "B1",
    difficulty: "MEDIUM",
    answer: "is visited",
    explanation: 'The present simple passive ("is visited") is used for routine or recurring facts where the object is the focus of the sentence.',
    questionOptions: [
      { id: "6a9eb7b9af983cad3033351a", content: "is visited" },
      { id: "6a9eb7b9af983cad3033351b", content: "was visited" },
      { id: "6a9eb7b9af983cad3033351c", content: "visits" },
      { id: "6a9eb7b9af983cad3033351d", content: "has visited" },
    ],
  },
];

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
  const limit = query?.limit || 5;
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

export interface CreateLevelTestQuestionDto {
  question: string;
  passage?: string | null;
  sectionType: "GRAMMAR" | "VOCABULARY" | "READING" | "SPEAKING" | string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | string;
  difficulty: "EASY" | "MEDIUM" | "HARD" | string;
  answer: string;
  explanation?: string;
  options: Array<{
    id?: string;
    content: string;
    isCorrect: boolean;
  }>;
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

