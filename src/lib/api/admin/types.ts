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

export interface CreateQuestionSetDto {
  name: string;
  description?: string;
  isActive?: boolean;
  questionIds: string[];
}

export interface UpdateQuestionSetDto {
  name?: string;
  description?: string;
  isActive?: boolean;
  questionIds?: string[];
}

