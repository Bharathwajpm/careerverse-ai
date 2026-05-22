import type { Badge, GamificationState } from "./types";

const KEY = "cv_gamification";

const BADGE_DEFS: Omit<Badge, "unlockedAt">[] = [
  { id: "first_assessment", name: "Self-Discovery", description: "Complete career assessment", icon: "🧠" },
  { id: "mentor_starter", name: "Mentor Bond", description: "Send your first mentor message", icon: "🤖" },
  { id: "roadmap_builder", name: "Pathfinder", description: "Generate a career roadmap", icon: "🗺️" },
  { id: "scholarship_scout", name: "Grant Scout", description: "Save 3 scholarships", icon: "🎓" },
  { id: "interview_rookie", name: "Stage Ready", description: "Finish a mock interview", icon: "🎤" },
  { id: "finance_planner", name: "Budget Boss", description: "Set up finance dashboard", icon: "💰" },
  { id: "streak_7", name: "Week Warrior", description: "7-day activity streak", icon: "🔥" },
  { id: "xp_500", name: "Rising Star", description: "Earn 500 XP", icon: "⭐" },
];

export function defaultGamification(): GamificationState {
  return {
    version: 1,
    xp: 120,
    level: 2,
    streakDays: 1,
    lastActiveDate: new Date().toISOString().slice(0, 10),
    badges: BADGE_DEFS.map((b) => ({ ...b, unlockedAt: null })),
    recentRewards: [],
    pendingUnlock: null,
  };
}

export function loadGamification(): GamificationState {
  if (typeof window === "undefined") return defaultGamification();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultGamification();
    const parsed = JSON.parse(raw) as GamificationState;
    if (parsed?.version !== 1) return defaultGamification();
    const defs = BADGE_DEFS.map((d) => {
      const existing = parsed.badges.find((b) => b.id === d.id);
      return existing ?? { ...d, unlockedAt: null };
    });
    return { ...parsed, badges: defs };
  } catch {
    return defaultGamification();
  }
}

export function saveGamification(state: GamificationState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
}

export function xpForLevel(level: number): number {
  return level * 200;
}

export function levelFromXp(xp: number): number {
  let level = 1;
  let need = 200;
  let remaining = xp;
  while (remaining >= need && level < 50) {
    remaining -= need;
    level += 1;
    need = level * 200;
  }
  return level;
}

export function mockLeaderboard(selfName: string, selfXp: number, selfStreak: number) {
  const pool = [
    { name: "Priya S.", xp: 1840, streak: 14 },
    { name: "Rahul M.", xp: 1620, streak: 11 },
    { name: "Ananya K.", xp: 1480, streak: 9 },
    { name: selfName, xp: selfXp, streak: selfStreak, isYou: true },
    { name: "Vikram T.", xp: 920, streak: 6 },
    { name: "Sneha R.", xp: 880, streak: 5 },
  ];
  return pool
    .sort((a, b) => b.xp - a.xp)
    .map((e, i) => ({ rank: i + 1, ...e }));
}
