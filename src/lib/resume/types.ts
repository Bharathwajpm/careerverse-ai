export type ResumeAnalysisResult = {
  version: 1;
  fileName: string;
  analyzedAt: string;
  atsScore: number;
  atsGrade: "A" | "B" | "C" | "D";
  sections: {
    formatting: number;
    keywords: number;
    impact: number;
    length: number;
    readability: number;
  };
  chartData: { name: string; score: number; fullMark: number }[];
  keywords: KeywordMatch[];
  skillGaps: SkillGap[];
  recommendations: ResumeRecommendation[];
  aiFeedback: string;
};

export type KeywordMatch = {
  term: string;
  found: boolean;
  importance: "high" | "medium" | "low";
  category: string;
};

export type SkillGap = {
  skill: string;
  priority: "critical" | "recommended" | "optional";
  reason: string;
};

export type ResumeRecommendation = {
  id: string;
  title: string;
  impact: "high" | "medium" | "low";
  category: "content" | "format" | "keywords" | "structure";
  detail: string;
};
