export type AnalyticsSnapshot = {
  version: 1;
  updatedAt: string;
  growthHistory: { week: string; score: number }[];
  skillScores: { skill: string; score: number }[];
  streakDays: number;
  modulesUsed: string[];
  recommendationAccuracy: number;
  weeklyActivity: { day: string; minutes: number }[];
};
