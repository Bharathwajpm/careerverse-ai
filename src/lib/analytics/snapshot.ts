import { loadAssessmentResult } from "@/lib/assessment/storage";
import { loadInterviewState } from "@/lib/interview/storage";
import { loadLearningData } from "@/lib/learning/storage";
import { loadFinanceData } from "@/lib/finance/storage";
import type { AnalyticsSnapshot } from "./types";

const WEEKS = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];

export function buildAnalyticsSnapshot(): AnalyticsSnapshot {
  const assessment = loadAssessmentResult();
  const interviews = loadInterviewState();
  const learning = loadLearningData();
  const finance = loadFinanceData();

  const baseScore = assessment
    ? Math.round(
        assessment.domainScores.reduce((s, d) => s + d.score, 0) / assessment.domainScores.length,
      )
    : 55;

  const growthHistory = WEEKS.map((week, i) => ({
    week,
    score: Math.min(98, baseScore - 12 + i * 4 + (interviews.sessions.length > 0 ? 2 : 0)),
  }));

  const skillScores = assessment
    ? assessment.domainScores.map((d) => ({ skill: d.label, score: d.score }))
    : [
        { skill: "Analytical", score: 62 },
        { skill: "Creative", score: 58 },
        { skill: "Leadership", score: 54 },
        { skill: "Communication", score: 60 },
        { skill: "Empathy", score: 56 },
        { skill: "Systems", score: 59 },
      ];

  const modulesUsed: string[] = [];
  if (assessment) modulesUsed.push("Assessment");
  if (interviews.sessions.length) modulesUsed.push("Interviews");
  if (learning.courses.some((c) => c.progress > 0)) modulesUsed.push("Learning");
  if (finance.expenses.length) modulesUsed.push("Finance");

  const streakDays = Math.max(learning.streakDays, interviews.streakDays);

  const weeklyActivity = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => ({
    day,
    minutes: 20 + ((baseScore + i * 7) % 50) + (learning.dailyGoals[i % 3]?.completedMinutes ?? 0),
  }));

  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    growthHistory,
    skillScores,
    streakDays,
    modulesUsed,
    recommendationAccuracy: assessment?.topMatches[0]?.compatibility ?? 72,
    weeklyActivity,
  };
}
