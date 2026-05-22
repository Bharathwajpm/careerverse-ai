export const ASSESSMENT_DOMAINS = [
  "analytical",
  "creative",
  "leadership",
  "communication",
  "empathy",
  "systems",
] as const;

export type AssessmentDomain = (typeof ASSESSMENT_DOMAINS)[number];

export type LikertValue = 1 | 2 | 3 | 4 | 5;

export type AssessmentQuestion = {
  id: string;
  text: string;
  emoji: string;
  primary: AssessmentDomain;
  secondary?: AssessmentDomain;
};

export type DomainScore = {
  domain: AssessmentDomain;
  label: string;
  score: number;
};

export type CareerMatch = {
  id: string;
  title: string;
  compatibility: number;
  summary: string;
  strengths: string[];
  growthAreas: string[];
};

export type PersonalityProfile = {
  archetype: string;
  tagline: string;
  traits: string[];
  summary: string;
};

export type AssessmentResult = {
  version: 1;
  completedAt: string;
  answers: Record<string, LikertValue>;
  domainScores: DomainScore[];
  radarData: { domain: string; score: number; fullMark: number }[];
  topMatches: CareerMatch[];
  personality: PersonalityProfile;
  aiNarrative: string;
  progressPercent: number;
};

export type AssessmentProgress = {
  currentIndex: number;
  answers: Record<string, LikertValue>;
  startedAt: string;
  updatedAt: string;
};
