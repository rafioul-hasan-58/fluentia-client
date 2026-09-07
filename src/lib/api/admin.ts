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

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  role: "ADMIN" | "USER" | "STUDENT" | "TEACHER";
  level: string;
  targetLevel?: string | null;
  provider: "email" | "google";
  testsTaken: number;
  lastActive: string;
  createdAt: string;
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
    id: "att-101",
    userName: "Elena Rostova",
    userEmail: "elena.rostova@gmail.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    score: 17,
    totalQuestions: 20,
    percentage: 85,
    cefrLevel: "C1",
    timeSpentSeconds: 492,
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    sectionBreakdown: {
      grammar: { correct: 7, total: 8, percentage: 87.5 },
      vocabulary: { correct: 6, total: 7, percentage: 85.7 },
      reading: { correct: 4, total: 5, percentage: 80.0 },
    },
    summary: "Demonstrates strong grasp of complex clause structures and academic vocabulary with nuanced comprehension.",
    strengths: ["Subjunctive mood", "Idiomatic collocations", "Inference analysis"],
    weaknesses: ["Mixed conditionals with inversion"],
  },
  {
    id: "att-102",
    userName: "Carlos Mendez",
    userEmail: "carlos.mendez@outlook.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    score: 13,
    totalQuestions: 20,
    percentage: 65,
    cefrLevel: "B2",
    timeSpentSeconds: 540,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    sectionBreakdown: {
      grammar: { correct: 5, total: 8, percentage: 62.5 },
      vocabulary: { correct: 5, total: 7, percentage: 71.4 },
      reading: { correct: 3, total: 5, percentage: 60.0 },
    },
    summary: "Good functional fluency and conversational vocabulary with occasional struggles on inverted sentences.",
    strengths: ["Everyday prepositions", "Reading speed", "Common phrasal verbs"],
    weaknesses: ["Past perfect continuous", "Passive reporting verbs"],
  },
  {
    id: "att-103",
    userName: "Aisha Al-Mansoor",
    userEmail: "aisha.mansoor@techcorp.ae",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    score: 19,
    totalQuestions: 20,
    percentage: 95,
    cefrLevel: "C2",
    timeSpentSeconds: 410,
    createdAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    sectionBreakdown: {
      grammar: { correct: 8, total: 8, percentage: 100 },
      vocabulary: { correct: 7, total: 7, percentage: 100 },
      reading: { correct: 4, total: 5, percentage: 80.0 },
    },
    summary: "Exceptional mastery of syntactic subtleties and high-level lexical items across all sections.",
    strengths: ["Advanced inversion", "Nuanced idioms", "Precision tone analysis"],
    weaknesses: ["Complex contextual inference nuance"],
  },
  {
    id: "att-104",
    userName: "Kenji Sato",
    userEmail: "kenji.sato@kyoto-u.ac.jp",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    score: 9,
    totalQuestions: 20,
    percentage: 45,
    cefrLevel: "A2",
    timeSpentSeconds: 610,
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    sectionBreakdown: {
      grammar: { correct: 4, total: 8, percentage: 50.0 },
      vocabulary: { correct: 3, total: 7, percentage: 42.8 },
      reading: { correct: 2, total: 5, percentage: 40.0 },
    },
    summary: "Developing foundational English with a clear understanding of basic present and past simple tenses.",
    strengths: ["Subject-verb agreement", "Basic adjectives", "Simple sentences"],
    weaknesses: ["Dependent prepositions", "Irregular past participles", "Complex paragraphs"],
  },
  {
    id: "att-105",
    userName: "Sarah Jenkins",
    userEmail: "s.jenkins@london.edu",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    score: 15,
    totalQuestions: 20,
    percentage: 75,
    cefrLevel: "B2",
    timeSpentSeconds: 480,
    createdAt: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    sectionBreakdown: {
      grammar: { correct: 6, total: 8, percentage: 75.0 },
      vocabulary: { correct: 5, total: 7, percentage: 71.4 },
      reading: { correct: 4, total: 5, percentage: 80.0 },
    },
    summary: "Solid upper-intermediate comprehension with consistent scores across grammar and reading.",
    strengths: ["Relative clauses", "Contextual vocabulary", "Skimming & scanning"],
    weaknesses: ["Collocations with 'do' vs 'make'"],
  },
];

export const MOCK_ADMIN_USERS: AdminUserRecord[] = [
  {
    id: "usr-1",
    name: "Rafioul Hasan Sourav",
    email: "sourob@fluentia.ai",
    avatar: null,
    role: "ADMIN",
    level: "C2 Mastery",
    targetLevel: "C2",
    provider: "google",
    testsTaken: 12,
    lastActive: "Just now",
    createdAt: "2026-01-10T10:00:00Z",
  },
  {
    id: "usr-2",
    name: "Elena Rostova",
    email: "elena.rostova@gmail.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    role: "USER",
    level: "C1 Advanced",
    targetLevel: "C2",
    provider: "google",
    testsTaken: 3,
    lastActive: "12m ago",
    createdAt: "2026-02-14T08:30:00Z",
  },
  {
    id: "usr-3",
    name: "Carlos Mendez",
    email: "carlos.mendez@outlook.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    role: "STUDENT",
    level: "B2 Upper Intermediate",
    targetLevel: "C1",
    provider: "email",
    testsTaken: 2,
    lastActive: "45m ago",
    createdAt: "2026-02-18T14:15:00Z",
  },
  {
    id: "usr-4",
    name: "Aisha Al-Mansoor",
    email: "aisha.mansoor@techcorp.ae",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "USER",
    level: "C2 Mastery",
    targetLevel: "C2",
    provider: "google",
    testsTaken: 4,
    lastActive: "1h ago",
    createdAt: "2026-01-22T19:00:00Z",
  },
  {
    id: "usr-5",
    name: "Kenji Sato",
    email: "kenji.sato@kyoto-u.ac.jp",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    role: "STUDENT",
    level: "A2 Elementary",
    targetLevel: "B2",
    provider: "email",
    testsTaken: 1,
    lastActive: "3h ago",
    createdAt: "2026-03-01T06:45:00Z",
  },
  {
    id: "usr-6",
    name: "Sarah Jenkins",
    email: "s.jenkins@london.edu",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    role: "USER",
    level: "B2 Upper Intermediate",
    targetLevel: "C1",
    provider: "google",
    testsTaken: 5,
    lastActive: "5h ago",
    createdAt: "2026-01-05T12:00:00Z",
  },
  {
    id: "usr-7",
    name: "Dev Administrator",
    email: "admin@fluentia.ai",
    avatar: null,
    role: "ADMIN",
    level: "C2 Mastery",
    targetLevel: "C2",
    provider: "email",
    testsTaken: 18,
    lastActive: "Yesterday",
    createdAt: "2026-01-01T00:00:00Z",
  },
];
