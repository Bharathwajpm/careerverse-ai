import { defaultSettings } from "./defaults";
import type { UserSettings } from "./types";

const KEY = "cv_user_settings";

export function loadUserSettings(fallbackName?: string, fallbackEmail?: string): UserSettings {
  if (typeof window === "undefined") {
    return defaultSettings(fallbackName, fallbackEmail);
  }
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultSettings(fallbackName, fallbackEmail);
    const parsed = JSON.parse(raw) as UserSettings;
    if (parsed?.version !== 1) return defaultSettings(fallbackName, fallbackEmail);
    return parsed;
  } catch {
    return defaultSettings(fallbackName, fallbackEmail);
  }
}

export function saveUserSettings(settings: UserSettings): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(settings));
}

export function clearUserSettings(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
