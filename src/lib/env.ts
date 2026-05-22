/**
 * Centralized Vite environment variables (client-safe only).
 * Never put secrets here — only `VITE_*` keys are exposed to the browser.
 */
function read(key: keyof ImportMetaEnv): string {
  const value = import.meta.env[key];
  return typeof value === "string" ? value.trim() : "";
}

export const env = {
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  mode: import.meta.env.MODE,
  apiUrl: read("VITE_API_URL"),
  googleClientId: read("VITE_GOOGLE_CLIENT_ID"),
  devApiProxy: read("VITE_DEV_API_PROXY") || "http://127.0.0.1:5000",
} as const;

export function requireGoogleClientId(): string | null {
  return env.googleClientId || null;
}
