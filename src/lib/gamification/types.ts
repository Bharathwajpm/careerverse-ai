export type BadgeId =
  | "first_assessment"
  | "mentor_starter"
  | "roadmap_builder"
  | "scholarship_scout"
  | "interview_rookie"
  | "finance_planner"
  | "streak_7"
  | "xp_500";

export type Badge = {
  id: BadgeId;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
};

export type LeaderboardEntry = {
  rank: number;
  name: string;
  xp: number;
  streak: number;
  isYou?: boolean;
};

export type GamificationState = {
  version: 1;
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string | null;
  badges: Badge[];
  recentRewards: { id: string; label: string; xp: number; at: string }[];
  pendingUnlock: BadgeId | null;
};
