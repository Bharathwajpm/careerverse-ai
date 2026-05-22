import { ApiRequestError } from "@/lib/api";

const FRIENDLY: Record<number, string> = {
  400: "Please check your details and try again.",
  401: "Invalid email or password.",
  403: "You do not have permission to do that.",
  409: "An account with this email already exists.",
  429: "Too many attempts. Please wait a moment and try again.",
  503: "Sign-in service is temporarily unavailable.",
};

/**
 * Maps API and network errors to user-facing copy for auth flows.
 */
export function getAuthErrorMessage(err: unknown, fallback = "Something went wrong"): string {
  if (err instanceof ApiRequestError) {
    if (err.message && err.message !== "Request failed") {
      return err.message;
    }
    return FRIENDLY[err.status] ?? fallback;
  }
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return fallback;
}
