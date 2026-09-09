export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type TestSectionType = "GRAMMAR" | "VOCABULARY" | "READING" | string;
export type QuestionDifficulty = "EASY" | "MEDIUM" | "HARD" | string;

export interface QuestionOption {
  id: string;
  content: string;
  isCorrect?: boolean;
}

export interface LevelTestQuestion {
  id: string;
  question: string;
  passage?: string | null;
  sectionType: TestSectionType;
  level: CEFRLevel | string;
  difficulty: QuestionDifficulty;
  answer?: string;
  explanation?: string;
  createdAt?: string;
  updatedAt?: string;
  questionOptions: QuestionOption[];
}

export interface LevelTestResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: LevelTestQuestion[];
}

export interface UserAnswerRecord {
  questionId: string;
  selectedOptionContent: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface QuestionAnswerPair {
  question: string;
  answer: string;
}

export interface LevelTestSubmissionItem {
  questionId: string;
  answerOptionId: string;
  selectedOptionId?: string;
  userAnswer?: string;
}

export interface LevelTestAnswerItem {
  questionId: string;
  answerOptionId: string;
  selectedOptionId?: string;
  userAnswer?: string;
}

export interface SubmitLevelTestPayload {
  answers: LevelTestAnswerItem[];
  timeSpentSeconds: number;
}

export interface SectionBreakdownItem {
  correct: number;
  total: number;
  percentage: number;
}

export interface LevelTestSectionStats {
  grammar?: SectionBreakdownItem;
  vocabulary?: SectionBreakdownItem;
  reading?: SectionBreakdownItem;
  [key: string]: SectionBreakdownItem | undefined;
}

export interface AnalysisStrength {
  area: string;
  description: string;
  evidence?: string;
}

export interface AnalysisWeakness {
  area: string;
  description: string;
  errorPattern?: string;
  recommendation?: string;
}

export interface AnalysisSectionBreakdownItem {
  level: string;
  scoreText: string;
  analysis: string;
}

export interface AnalysisLearningRoadmapStep {
  step: number;
  title: string;
  focusArea: string;
  description: string;
  suggestedSkills: string[];
}

export interface LevelTestAnalysis {
  estimatedLevel: string;
  cefrScore: number;
  summary: string;
  strengths: AnalysisStrength[];
  weaknesses: AnalysisWeakness[];
  sectionBreakdown: Record<string, AnalysisSectionBreakdownItem>;
  learningRoadmap: AnalysisLearningRoadmapStep[];
}

export interface EvaluatedQuestion {
  questionId: string;
  number: number;
  question: string;
  passage?: string | null;
  sectionType: string;
  level: string;
  difficulty: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

export interface LevelTestEvaluationData {
  attemptId: string | null;
  score: number;
  totalQuestions: number;
  percentage: number;
  sectionBreakdown: LevelTestSectionStats;
  analysis: LevelTestAnalysis;
  questions: EvaluatedQuestion[];
}

export interface SubmitLevelTestResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: LevelTestEvaluationData;
  timestamp?: string;
}

