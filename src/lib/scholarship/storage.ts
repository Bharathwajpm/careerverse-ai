import type { ScholarshipProfile } from "./types";

const SAVED_KEY = "cv_scholarship_saved";
const PROFILE_KEY = "cv_scholarship_profile";

const DEFAULT_PROFILE: ScholarshipProfile = {
  version: 1,
  state: "All India",
  caste: "general",
  income: "any",
  level: "UG",
};

export function loadSavedScholarshipIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SAVED_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveScholarshipIds(ids: string[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SAVED_KEY, JSON.stringify(ids));
}

export function toggleSavedScholarship(id: string): string[] {
  const current = loadSavedScholarshipIds();
  const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
  saveScholarshipIds(next);
  return next;
}

export function loadScholarshipProfile(): ScholarshipProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw) as ScholarshipProfile;
    return parsed?.version === 1 ? parsed : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveScholarshipProfile(profile: ScholarshipProfile): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
