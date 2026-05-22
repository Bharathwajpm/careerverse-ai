const ACCESS_TOKEN_KEY = "cv_access_token";
const REMEMBER_ME_KEY = "cv_remember_me";
const SAVED_EMAIL_KEY = "cv_saved_email";

export type AuthPersistence = "local" | "session";

function storageFor(persistence: AuthPersistence): Storage | null {
  if (typeof window === "undefined") return null;
  return persistence === "local" ? window.localStorage : window.sessionStorage;
}

export function getRememberMe(): boolean {
  if (typeof window === "undefined") return true;
  const v = window.localStorage.getItem(REMEMBER_ME_KEY);
  return v !== "0";
}

export function setRememberMe(remember: boolean): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REMEMBER_ME_KEY, remember ? "1" : "0");
}

export function getAuthPersistence(): AuthPersistence {
  return getRememberMe() ? "local" : "session";
}

/**
 * Stores the JWT in localStorage (remember me) or sessionStorage (browser session only).
 */
export function setAccessToken(token: string, persistence?: AuthPersistence): void {
  const mode = persistence ?? getAuthPersistence();
  const primary = storageFor(mode);
  const other = storageFor(mode === "local" ? "session" : "local");
  if (!primary) return;
  primary.setItem(ACCESS_TOKEN_KEY, token);
  other?.removeItem(ACCESS_TOKEN_KEY);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    window.sessionStorage.getItem(ACCESS_TOKEN_KEY) ??
    window.localStorage.getItem(ACCESS_TOKEN_KEY)
  );
}

export function clearAccessToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function getSavedEmail(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(SAVED_EMAIL_KEY) ?? "";
}

export function setSavedEmail(email: string): void {
  if (typeof window === "undefined") return;
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) {
    window.localStorage.removeItem(SAVED_EMAIL_KEY);
    return;
  }
  window.localStorage.setItem(SAVED_EMAIL_KEY, trimmed);
}

/** Clears client credentials (refresh cookie cleared by `/auth/logout`). */
export function clearAllStoredAuth(): void {
  clearAccessToken();
}
