export type InterviewMode = "technical" | "hr";

export type InterviewPhase = "setup" | "live" | "evaluating" | "results";

export type InterviewQuestion = {
  id: string;
  text: string;
  mode: InterviewMode;
  difficulty: "easy" | "medium" | "hard";
  tip: string;
};

export type InterviewScores = {
  overall: number;
  confidence: number;
  clarity: number;
  technicalDepth: number;
  communication: number;
  structure: number;
};

export type InterviewSession = {
  id: string;
  mode: InterviewMode;
  completedAt: string;
  durationSeconds: number;
  questionsAnswered: number;
  scores: InterviewScores;
  feedback: string[];
  highlights: string[];
  improvements: string[];
};

export type InterviewState = {
  version: 1;
  sessions: InterviewSession[];
  streakDays: number;
  lastPracticeDate: string | null;
};
