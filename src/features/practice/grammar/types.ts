export interface SubSkill {
  slug: string;
  name: string;
  cefr: string | null;
}

export interface SkillCategory {
  slug: string;
  name: string;
  category: string;
  children: SubSkill[];
}

export type SkillTree = SkillCategory[];

export interface StartPracticeParams {
  categorySlug: string;
  subSkillSlug: string;
}

export interface DropdownOption {
  value: string;
  label: string;
  badge?: string | null;
  description?: string;
}
