export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type TestSectionType = "GRAMMAR" | "VOCABULARY" | "READING";
export type QuestionDifficulty = "EASY" | "MEDIUM" | "HARD";

export interface QuestionOption {
  id: string;
  content: string;
}

export interface LevelTestQuestion {
  id: string;
  question: string;
  passage?: string | null;
  sectionType: TestSectionType;
  level: CEFRLevel;
  difficulty: QuestionDifficulty;
  answer: string;
  explanation: string;
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
