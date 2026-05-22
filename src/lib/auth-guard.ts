import { isRedirect, redirect } from "@tanstack/react-router";
import { authApi, tryRefreshAccessToken } from "@/lib/api";
import { clearAllStoredAuth, getAccessToken } from "@/lib/auth-storage";

async function ensureAccessToken(): Promise<boolean> {
  if (getAccessToken()) return true;
  return tryRefreshAccessToken();
}

/**
 * Ensures a valid session before entering protected UI.
 * Throws `redirect({ to: '/login' })` when the user cannot be authenticated.
 */
export async function assertAuthenticated(): Promise<void> {
  if (typeof window === "undefined") return;

  const hasToken = await ensureAccessToken();
  if (!hasToken) {
    throw redirect({
      to: "/login",
      search: { redirect: getCurrentPath() },
    });
  }

  try {
    await authApi.me();
  } catch {
    clearAllStoredAuth();
    const refreshed = await tryRefreshAccessToken();
    if (!refreshed) {
      throw redirect({
        to: "/login",
        search: { redirect: getCurrentPath() },
      });
    }
    try {
      await authApi.me();
    } catch {
      clearAllStoredAuth();
      throw redirect({
        to: "/login",
        search: { redirect: getCurrentPath() },
      });
    }
  }
}

/**
 * Redirects authenticated users away from guest-only pages (login, signup).
 */
export async function assertGuest(): Promise<void> {
  if (typeof window === "undefined") return;

  const hasToken = await ensureAccessToken();
  if (!hasToken) return;

  try {
    await authApi.me();
    throw redirect({ to: "/dashboard" });
  } catch (err) {
    if (isRedirect(err)) throw err;
    clearAllStoredAuth();
  }
}

function getCurrentPath(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const path = window.location.pathname + window.location.search;
  if (path.startsWith("/login") || path.startsWith("/signup")) return undefined;
  return path || undefined;
}
