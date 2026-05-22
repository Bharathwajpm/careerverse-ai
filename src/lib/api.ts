import { getAccessToken, getAuthPersistence, setAccessToken } from "@/lib/auth-storage";

import { env } from "@/lib/env";

const API_BASE = env.apiUrl;

export type PublicUser = { id: string; name: string; email: string };

export class ApiRequestError extends Error {
  readonly status: number;
  readonly errors: unknown;

  constructor(message: string, status: number, errors?: unknown) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.errors = errors;
  }
}

type ApiEnvelope<T> =
  | { success: true; data: T }
  | { success: false; message: string; errors?: unknown };

const REFRESH_PATH = "/api/v1/auth/refresh";

function skipRefreshForPath(path: string) {
  return (
    path.includes("/auth/refresh") ||
    path.includes("/auth/login") ||
    path.includes("/auth/register") ||
    path.includes("/auth/google") ||
    path.includes("/auth/forgot-password") ||
    path.includes("/auth/reset-password") ||
    path.includes("/auth/logout")
  );
}

let refreshLock: Promise<boolean> | null = null;

export function tryRefreshAccessToken(): Promise<boolean> {
  if (refreshLock) return refreshLock;
  const p = (async () => {
    try {
      const res = await fetch(`${API_BASE}${REFRESH_PATH}`, {
        method: "POST",
        credentials: "include",
      });
      const body = (await res.json().catch(() => ({}))) as ApiEnvelope<{
        token?: string;
        accessToken?: string;
      }>;
      if (!res.ok || !body || typeof body !== "object" || body.success === false) return false;
      if (!("data" in body) || !body.data) return false;
      const token = body.data.token ?? body.data.accessToken;
      if (typeof token !== "string" || !token) return false;
      setAccessToken(token, getAuthPersistence());
      return true;
    } catch {
      return false;
    }
  })();
  refreshLock = p;
  void p.finally(() => {
    refreshLock = null;
  });
  return p;
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit & { json?: unknown; _retry?: boolean } = {},
): Promise<T> {
  const { json, _retry, ...restInit } = init;
  const headers = new Headers(restInit.headers);
  if (json !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  const token = typeof window !== "undefined" ? getAccessToken() : null;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...restInit,
    credentials: "include",
    headers,
    body: json !== undefined ? JSON.stringify(json) : restInit.body,
  });

  if (res.status === 401 && !_retry && !skipRefreshForPath(path)) {
    const refreshed = await tryRefreshAccessToken();
    if (refreshed) {
      return apiFetch<T>(path, { ...init, _retry: true });
    }
  }

  let body: unknown = {};
  try {
    body = await res.json();
  } catch {
    body = {};
  }

  const payload = body as ApiEnvelope<T>;

  if (!res.ok || !payload || typeof payload !== "object" || payload.success === false) {
    const fail = payload as { success?: false; message?: string; errors?: unknown };
    const message =
      typeof fail.message === "string" ? fail.message : res.statusText || "Request failed";
    throw new ApiRequestError(message, res.status, fail.errors);
  }

  return payload.data;
}

export const authApi = {
  register: (body: { name: string; email: string; password: string }) =>
    apiFetch<{ user: PublicUser; token: string; accessToken: string }>("/api/v1/auth/register", {
      method: "POST",
      json: body,
    }),

  login: (body: { email: string; password: string }) =>
    apiFetch<{ user: PublicUser; token: string; accessToken: string }>("/api/v1/auth/login", {
      method: "POST",
      json: body,
    }),

  google: (body: { credential: string }) =>
    apiFetch<{ user: PublicUser; token: string; accessToken: string }>("/api/v1/auth/google", {
      method: "POST",
      json: body,
    }),

  logout: () =>
    apiFetch<{ ok: boolean }>("/api/v1/auth/logout", {
      method: "POST",
    }),

  me: () => apiFetch<{ user: PublicUser }>("/api/v1/auth/me", { method: "GET" }),

  forgotPassword: (body: { email: string }) =>
    apiFetch<{ ok: boolean; message?: string }>("/api/v1/auth/forgot-password", {
      method: "POST",
      json: body,
    }),

  resetPassword: (body: { token: string; password: string }) =>
    apiFetch<{ ok: boolean; message?: string }>("/api/v1/auth/reset-password", {
      method: "POST",
      json: body,
    }),
};
