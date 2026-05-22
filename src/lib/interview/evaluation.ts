import { loadAssessmentResult } from "@/lib/assessment/storage";
import type { InterviewMode, InterviewScores } from "./types";

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

export function evaluateInterview(
  mode: InterviewMode,
  answerLength: number,
  durationSeconds: number,
  questionsCount: number,
): {
  scores: InterviewScores;
  feedback: string[];
  highlights: string[];
  improvements: string[];
} {
  const seed = hashSeed(`${mode}-${answerLength}-${durationSeconds}`);
  const base = 62 + (seed % 28);

  const confidence = Math.min(95, base + (answerLength > 80 ? 8 : 0) + (durationSeconds > 120 ? 5 : 0));
  const clarity = Math.min(94, base + 4 + (seed % 10));
  const technicalDepth =
    mode === "technical"
      ? Math.min(96, base + (answerLength > 120 ? 12 : 4))
      : Math.min(88, base);
  const communication = Math.min(95, base + 6);
  const structure = Math.min(92, base + (questionsCount >= 3 ? 7 : 2));
  const overall = Math.round(
    (confidence + clarity + technicalDepth + communication + structure) / 5,
  );

  const scores: InterviewScores = {
    overall,
    confidence,
    clarity,
    technicalDepth,
    communication,
    structure,
  };

  const assessment = loadAssessmentResult();
  const careerHint = assessment?.topMatches[0]?.title ?? "your target role";

  const feedback = [
    `**Demo evaluation** — CareerVerse analyzed pacing, structure, and keyword density for a ${mode} loop.`,
    `Overall readiness for **${careerHint}** interviews: **${overall}/100**. Confidence tracked at **${confidence}%** via simulated vocal and posture signals.`,
    answerLength < 60
      ? "Answers were brief. Expand with STAR examples and one metric per story."
      : "Good answer length. Next, tighten intros to under 90 seconds per question.",
  ];

  const highlights = [
    confidence >= 75 ? "Strong projected confidence under pressure" : "Calm delivery baseline detected",
    structure >= 70 ? "Answers followed a clear beginning–middle–end" : "Willingness to engage all prompts",
    mode === "technical" && technicalDepth >= 75
      ? "Technical vocabulary aligned with mid-level IC expectations"
      : "Professional tone suitable for stakeholder interviews",
  ];

  const improvements = [
    clarity < 80 ? "Reduce filler words; pause instead of 'um'" : "Add one more concrete metric per story",
    mode === "technical"
      ? "Practice whiteboard-style trade-off summaries out loud"
      : "Prepare 3 behavioral stories mapped to leadership principles",
    "Re-run a session in 48 hours to measure score delta",
  ];

  return { scores, feedback, highlights, improvements };
}
