import { env } from "../config/env.js";

export function setRefreshCookie(res, rawToken) {
  const maxAge = env.JWT_REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000;
  res.cookie(env.REFRESH_COOKIE_NAME, rawToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api",
    maxAge,
  });
}

/**
 * @param {import('express').Request} req
 */
export function readRefreshCookie(req) {
  const name = env.REFRESH_COOKIE_NAME;
  const v = req.cookies?.[name];
  return typeof v === "string" && v.length > 0 ? v : null;
}

export function clearRefreshCookie(res) {
  res.clearCookie(env.REFRESH_COOKIE_NAME, { path: "/api" });
}
