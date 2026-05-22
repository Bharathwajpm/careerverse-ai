import { buildAnalyticsSnapshot } from "./snapshot";
import type { AnalyticsSnapshot } from "./types";

const KEY = "cv_analytics_snapshot";

export function loadAnalyticsSnapshot(): AnalyticsSnapshot {
  if (typeof window === "undefined") return buildAnalyticsSnapshot();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      const fresh = buildAnalyticsSnapshot();
      saveAnalyticsSnapshot(fresh);
      return fresh;
    }
    const parsed = JSON.parse(raw) as AnalyticsSnapshot;
    if (parsed?.version !== 1) {
      const fresh = buildAnalyticsSnapshot();
      saveAnalyticsSnapshot(fresh);
      return fresh;
    }
    const rebuilt = buildAnalyticsSnapshot();
    return { ...parsed, ...rebuilt, updatedAt: new Date().toISOString() };
  } catch {
    return buildAnalyticsSnapshot();
  }
}

export function saveAnalyticsSnapshot(snapshot: AnalyticsSnapshot): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(snapshot));
}

export function refreshAnalytics(): AnalyticsSnapshot {
  const snap = buildAnalyticsSnapshot();
  saveAnalyticsSnapshot(snap);
  return snap;
}
