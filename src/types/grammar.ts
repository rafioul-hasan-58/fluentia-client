export interface ExampleItem {
  sentence: string;
  note: string;
}

export interface GrammarLesson {
  title: string;
  rule: string;
  examples: ExampleItem[];
  commonMistakes: string[];
}

export interface SkillSummary {
  id?: string;
  slug: string;
  name: string;
  category?: string;
  cefr?: string;
  parentId?: string | null;
}

export interface TeachGrammarData {
  sessionId: string;
  skill: {
    slug: string;
    name: string;
  };
  lesson: GrammarLesson;
}

export interface TeachGrammarRequest {
  skillSlug: string;
  userPrompt?: string;
}

export interface TeachGrammarResponse {
  success: boolean;
  statusCode: number;
  data: TeachGrammarData;
  timestamp: string;
  message?: string;
}

export interface SkillsListResponse {
  success: boolean;
  statusCode: number;
  data: SkillSummary[];
  timestamp: string;
}

export interface GrammarSkillPreset {
  slug: string;
  name: string;
  category: string;
  cefr: string;
  icon?: string;
  samplePrompts: string[];
}

export interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text?: string;
  timestamp: string;
  lessonData?: TeachGrammarData;
  isError?: boolean;
}
