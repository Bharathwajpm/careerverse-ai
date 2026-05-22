import { DEFAULT_COURSES } from "./catalog";
import type { DailyGoal, LearningData, PlannerBlock } from "./types";

const KEY = "cv_learning_data";

const DEFAULT_GOALS: DailyGoal[] = [
  { id: "g1", label: "Watch lecture / tutorial", targetMinutes: 45, completedMinutes: 0, done: false },
  { id: "g2", label: "Practice problems", targetMinutes: 30, completedMinutes: 0, done: false },
  { id: "g3", label: "Review notes", targetMinutes: 15, completedMinutes: 0, done: false },
];

const DEFAULT_PLANNER: PlannerBlock[] = [
  { id: "p1", day: "Mon", title: "DSA practice", minutes: 60, done: false },
  { id: "p2", day: "Tue", title: "Course module", minutes: 45, done: false },
  { id: "p3", day: "Wed", title: "Project sprint", minutes: 90, done: false },
  { id: "p4", day: "Thu", title: "Mock interview", minutes: 30, done: false },
  { id: "p5", day: "Fri", title: "Cert prep", minutes: 45, done: false },
];

const DEFAULT: LearningData = {
  version: 1,
  courses: DEFAULT_COURSES,
  bookmarks: [],
  dailyGoals: DEFAULT_GOALS,
  planner: DEFAULT_PLANNER,
  lastStudyDate: null,
  streakDays: 0,
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function loadLearningData(): LearningData {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw) as LearningData;
    return parsed?.version === 1 ? parsed : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

export function saveLearningData(data: LearningData): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(data));
}

export function recordStudyActivity(data: LearningData): LearningData {
  const today = todayKey();
  if (data.lastStudyDate === today) return data;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yKey = yesterday.toISOString().slice(0, 10);
  const streak = data.lastStudyDate === yKey ? data.streakDays + 1 : 1;
  return { ...data, lastStudyDate: today, streakDays: streak };
}
