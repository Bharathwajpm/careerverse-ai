import type { InterviewSession, InterviewState } from "./types";

const KEY = "cv_interview_state";

const DEFAULT: InterviewState = {
  version: 1,
  sessions: [],
  streakDays: 0,
  lastPracticeDate: null,
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function loadInterviewState(): InterviewState {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw) as InterviewState;
    return parsed?.version === 1 ? parsed : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

export function saveInterviewState(state: InterviewState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
}

export function addInterviewSession(session: InterviewSession): InterviewState {
  const state = loadInterviewState();
  const today = todayKey();
  let streak = state.streakDays;
  if (state.lastPracticeDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yKey = yesterday.toISOString().slice(0, 10);
    streak = state.lastPracticeDate === yKey ? streak + 1 : 1;
  }
  const next: InterviewState = {
    ...state,
    sessions: [session, ...state.sessions].slice(0, 20),
    streakDays: streak,
    lastPracticeDate: today,
  };
  saveInterviewState(next);
  return next;
}
