import type { CareerRoadmap, RoadmapProgress, RoadmapTrackId } from "./types";

const ROADMAP_KEY = "cv_career_roadmap";
const PROGRESS_KEY = "cv_roadmap_progress";

export function loadRoadmap(): CareerRoadmap | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ROADMAP_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CareerRoadmap;
    return parsed?.version === 1 ? parsed : null;
  } catch {
    return null;
  }
}

export function saveRoadmap(roadmap: CareerRoadmap): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ROADMAP_KEY, JSON.stringify(roadmap));
}

export function loadRoadmapProgress(): RoadmapProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RoadmapProgress;
    return parsed?.version === 1 ? parsed : null;
  } catch {
    return null;
  }
}

export function saveRoadmapProgress(progress: RoadmapProgress): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function createEmptyProgress(trackId: RoadmapTrackId): RoadmapProgress {
  return {
    version: 1,
    trackId,
    milestoneStatus: {},
    skillCompleted: {},
    projectCompleted: {},
    updatedAt: new Date().toISOString(),
  };
}

export function clearRoadmapData(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ROADMAP_KEY);
  window.localStorage.removeItem(PROGRESS_KEY);
}
