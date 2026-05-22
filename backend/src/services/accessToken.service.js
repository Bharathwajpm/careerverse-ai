import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

/**
 * @param {string} userId
 */
export function signAccessToken(userId) {
  return jwt.sign({ sub: userId, typ: "access" }, env.JWT_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES_IN });
}

/**
 * @param {string} token
 * @returns {{ sub: string }}
 */
export function verifyAccessToken(token) {
  const payload = jwt.verify(token, env.JWT_SECRET);
  if (typeof payload !== "object" || !payload || typeof payload.sub !== "string") {
    throw new jwt.JsonWebTokenError("Invalid access token payload");
  }
  if ("typ" in payload && payload.typ != null && payload.typ !== "access") {
    throw new jwt.JsonWebTokenError("Invalid token type");
  }
  return { sub: payload.sub };
}
