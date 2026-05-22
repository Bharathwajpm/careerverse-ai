import type { AppNotification, NotificationState } from "./types";

const KEY = "cv_notifications";

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function loadNotificationState(): NotificationState {
  if (typeof window === "undefined") {
    return { version: 1, items: [], lastSchedulerRun: null };
  }
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return seedNotifications();
    const parsed = JSON.parse(raw) as NotificationState;
    if (parsed?.version !== 1 || !Array.isArray(parsed.items)) return seedNotifications();
    return parsed;
  } catch {
    return seedNotifications();
  }
}

export function saveNotificationState(state: NotificationState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
}

export function seedNotifications(): NotificationState {
  const now = new Date();
  const items: AppNotification[] = [
    {
      id: uid(),
      kind: "scholarship",
      title: "NSP deadline in 5 days",
      body: "National Scholarship Portal — verify documents before cutoff.",
      href: "/dashboard/scholarships",
      createdAt: new Date(now.getTime() - 3600000).toISOString(),
      read: false,
    },
    {
      id: uid(),
      kind: "roadmap",
      title: "Roadmap phase due",
      body: "Complete “Cloud foundations” milestones this week.",
      href: "/dashboard/roadmaps",
      createdAt: new Date(now.getTime() - 7200000).toISOString(),
      read: false,
    },
    {
      id: uid(),
      kind: "achievement",
      title: "Badge unlocked: First interview",
      body: "You completed your first mock interview session.",
      href: "/dashboard/rewards",
      createdAt: new Date(now.getTime() - 86400000).toISOString(),
      read: true,
    },
  ];
  const state: NotificationState = { version: 1, items, lastSchedulerRun: null };
  saveNotificationState(state);
  return state;
}

export function addNotification(
  state: NotificationState,
  input: Omit<AppNotification, "id" | "createdAt" | "read"> & { read?: boolean },
): NotificationState {
  const item: AppNotification = {
    id: uid(),
    createdAt: new Date().toISOString(),
    read: input.read ?? false,
    ...input,
  };
  const next = { ...state, items: [item, ...state.items].slice(0, 80) };
  saveNotificationState(next);
  return next;
}

export function markRead(state: NotificationState, id: string): NotificationState {
  const next = {
    ...state,
    items: state.items.map((n) => (n.id === id ? { ...n, read: true } : n)),
  };
  saveNotificationState(next);
  return next;
}

export function markAllRead(state: NotificationState): NotificationState {
  const next = { ...state, items: state.items.map((n) => ({ ...n, read: true })) };
  saveNotificationState(next);
  return next;
}

export function removeNotification(state: NotificationState, id: string): NotificationState {
  const next = { ...state, items: state.items.filter((n) => n.id !== id) };
  saveNotificationState(next);
  return next;
}

export function unreadCount(state: NotificationState): number {
  return state.items.filter((n) => !n.read).length;
}
