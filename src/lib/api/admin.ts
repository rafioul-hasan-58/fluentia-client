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

    const body = JSON.stringify(typeof isSuspended === "boolean" ? { isSuspended } : {});
    
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
        body,
      });
    }

    if (res.ok) {
      const json = await res.json();
      return { success: true, data: json.data, message: json.message };
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
 * Fetches user details by ID
 */
export async function fetchUserDetailsApi(userId: string): Promise<AdminUserRecord | null> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("fluentia_auth_token") : null;
    const headers: Record<string, string> = { Accept: "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${getApiBaseUrl()}/users/${userId}`, { headers });
    if (res.ok) {
      const json = await res.json();
      const rawData = json.data || json;
      if (rawData && rawData.id) {
        return normalizeUserItem(rawData);
      }
    }
  } catch (err) {
    console.warn(`Could not fetch details for user ${userId}`, err);
  }

  const found = MOCK_ADMIN_USERS.find((u) => u.id === userId);
  return found || null;
}


