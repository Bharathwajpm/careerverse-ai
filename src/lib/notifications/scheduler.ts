import { loadSavedScholarshipIds } from "@/lib/scholarship/storage";
import { loadRoadmapProgress } from "@/lib/roadmap/storage";
import { loadInterviewState } from "@/lib/interview/storage";
import { loadLearningData } from "@/lib/learning/storage";
import type { SchedulerPrefs } from "./types";
import { addNotification, loadNotificationState, saveNotificationState } from "./storage";
import { awardXp } from "@/lib/gamification/engine";

const MIN_INTERVAL_MS = 60_000;

function hasRecentTitle(state: ReturnType<typeof loadNotificationState>, title: string, hours = 12) {
  const cutoff = Date.now() - hours * 3600000;
  return state.items.some((n) => n.title === title && new Date(n.createdAt).getTime() > cutoff);
}

export function runNotificationScheduler(prefs: SchedulerPrefs): ReturnType<typeof loadNotificationState> {
  let state = loadNotificationState();
  const last = state.lastSchedulerRun ? new Date(state.lastSchedulerRun).getTime() : 0;
  if (Date.now() - last < MIN_INTERVAL_MS) return state;

  if (prefs.scholarshipReminders) {
    const saved = loadSavedScholarshipIds();
    if (saved.length > 0 && !hasRecentTitle(state, "Saved scholarship check-in")) {
      state = addNotification(state, {
        kind: "scholarship",
        title: "Saved scholarship check-in",
        body: `You have ${saved.length} saved grant(s). Review eligibility updates.`,
        href: "/dashboard/scholarships",
      });
    } else if (!hasRecentTitle(state, "Explore new scholarships")) {
      state = addNotification(state, {
        kind: "scholarship",
        title: "Explore new scholarships",
        body: "3 grants match your profile this week — open Scholarship Intelligence.",
        href: "/dashboard/scholarships",
      });
    }
  }

  if (prefs.roadmapReminders) {
    const progress = loadRoadmapProgress();
    const incomplete = progress
      ? Object.values(progress.milestoneStatus).filter((s) => s !== "done").length
      : 0;
    if (incomplete > 0 && !hasRecentTitle(state, "Roadmap milestone nudge")) {
      state = addNotification(state, {
        kind: "roadmap",
        title: "Roadmap milestone nudge",
        body: `${incomplete} phase(s) still in progress. Log 30 minutes today.`,
        href: "/dashboard/roadmaps",
      });
    }
  }

  if (prefs.achievementAlerts) {
    const interviews = loadInterviewState();
    const learning = loadLearningData();
    if (interviews.sessions.length >= 2 && !hasRecentTitle(state, "Interview streak bonus")) {
      state = addNotification(state, {
        kind: "achievement",
        title: "Interview streak bonus",
        body: "Multi-session practice unlocked +50 XP.",
        href: "/dashboard/rewards",
      });
      awardXp(50, "Interview streak");
    }
    if (learning.streakDays >= 3 && !hasRecentTitle(state, "Learning streak")) {
      state = addNotification(state, {
        kind: "achievement",
        title: "Learning streak",
        body: `${learning.streakDays}-day study streak — keep momentum!`,
        href: "/dashboard/learning",
      });
    }
  }

  state = { ...state, lastSchedulerRun: new Date().toISOString() };
  saveNotificationState(state);
  return state;
}
