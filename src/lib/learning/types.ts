export type Course = {
  id: string;
  title: string;
  provider: string;
  duration: string;
  level: "beginner" | "intermediate" | "advanced";
  progress: number;
  category: string;
  url?: string;
};

export type CertRecommendation = {
  id: string;
  name: string;
  provider: string;
  relevance: number;
  hours: number;
};

export type YoutubeResource = {
  id: string;
  title: string;
  channel: string;
  duration: string;
  views: string;
  topic: string;
  videoId: string;
};

export type DailyGoal = {
  id: string;
  label: string;
  targetMinutes: number;
  completedMinutes: number;
  done: boolean;
};

export type PlannerBlock = {
  id: string;
  day: string;
  title: string;
  minutes: number;
  done: boolean;
};

export type LearningData = {
  version: 1;
  courses: Course[];
  bookmarks: string[];
  dailyGoals: DailyGoal[];
  planner: PlannerBlock[];
  lastStudyDate: string | null;
  streakDays: number;
};
