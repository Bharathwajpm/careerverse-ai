import { loadAssessmentResult } from "@/lib/assessment/storage";
import { loadInterviewState } from "@/lib/interview/storage";
import { loadSavedScholarshipIds } from "@/lib/scholarship/storage";
import type { BadgeId, GamificationState } from "./types";
import { levelFromXp, loadGamification, saveGamification, xpForLevel } from "./storage";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function recordStreak(state: GamificationState): GamificationState {
  const today = todayKey();
  if (state.lastActiveDate === today) return state;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yKey = yesterday.toISOString().slice(0, 10);
  const streakDays = state.lastActiveDate === yKey ? state.streakDays + 1 : 1;
  return { ...state, streakDays, lastActiveDate: today };
}

function unlockBadge(state: GamificationState, id: BadgeId): GamificationState {
  const badge = state.badges.find((b) => b.id === id);
  if (!badge || badge.unlockedAt) return state;
  const badges = state.badges.map((b) =>
    b.id === id ? { ...b, unlockedAt: new Date().toISOString() } : b,
  );
  return { ...state, badges, pendingUnlock: id };
}

function addReward(state: GamificationState, label: string, xp: number): GamificationState {
  const entry = { id: `${Date.now()}`, label, xp, at: new Date().toISOString() };
  return {
    ...state,
    recentRewards: [entry, ...state.recentRewards].slice(0, 12),
  };
}

export function awardXp(amount: number, label: string): GamificationState {
  let state = recordStreak(loadGamification());
  const xp = state.xp + amount;
  const level = levelFromXp(xp);
  state = { ...state, xp, level };
  state = addReward(state, label, amount);
  if (xp >= 500) state = unlockBadge(state, "xp_500");
  if (state.streakDays >= 7) state = unlockBadge(state, "streak_7");
  saveGamification(state);
  return state;
}

export function syncGamificationFromModules(): GamificationState {
  let state = loadGamification();
  if (loadAssessmentResult()) state = unlockBadge(state, "first_assessment");
  if (loadInterviewState().sessions.length > 0) state = unlockBadge(state, "interview_rookie");
  if (loadSavedScholarshipIds().length >= 3) state = unlockBadge(state, "scholarship_scout");
  saveGamification(state);
  return state;
}

export function clearPendingUnlock(): GamificationState {
  const state = { ...loadGamification(), pendingUnlock: null };
  saveGamification(state);
  return state;
}

export function progressToNextLevel(xp: number, level: number) {
  const currentFloor = Array.from({ length: Math.max(0, level - 1) }).reduce<number>(
    (sum, _, i) => sum + (i + 1) * 200,
    0,
  );
  const need = xpForLevel(level);
  const inLevel = xp - currentFloor;
  return Math.min(100, Math.round((inLevel / need) * 100));
}
