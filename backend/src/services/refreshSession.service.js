import {
  createRefreshSession,
  findActiveRefreshSessionByHash,
  revokeAllRefreshSessionsForUser,
  revokeRefreshSession,
  revokeRefreshSessionByHash,
} from "../repositories/refreshSession.repository.js";
import { randomRefreshToken, sha256Hex } from "../utils/tokenCrypto.js";

export function hashRefreshToken(raw) {
  return sha256Hex(raw);
}

/**
 * @param {string} userId
 * @param {import('express').Request} req
 * @param {number} ttlMs
 * @returns {Promise<string>} raw refresh token
 */
export async function issueRefreshSession(userId, req, ttlMs) {
  const raw = randomRefreshToken();
  const tokenHash = hashRefreshToken(raw);
  await createRefreshSession({
    userId,
    tokenHash,
    expiresAt: new Date(Date.now() + ttlMs),
    userAgent:
      typeof req.headers["user-agent"] === "string"
        ? req.headers["user-agent"].slice(0, 512)
        : undefined,
    ip: req.ip || req.socket?.remoteAddress || undefined,
  });
  return raw;
}

/**
 * @param {string} rawToken
 * @returns {Promise<{ session: import('../repositories/refreshSession.repository.js').RefreshSessionRecord; userId: string } | null>}
 */
export async function findActiveRefreshSession(rawToken) {
  const tokenHash = hashRefreshToken(rawToken);
  const session = findActiveRefreshSessionByHash(tokenHash);
  if (!session) return null;
  return { session, userId: session.userId };
}

/**
 * @param {import('../repositories/refreshSession.repository.js').RefreshSessionRecord} session
 * @param {import('express').Request} req
 * @param {number} ttlMs
 */
export async function rotateRefreshSession(session, req, ttlMs) {
  await revokeRefreshSession(session.id);
  return issueRefreshSession(session.userId, req, ttlMs);
}

export async function revokeRefreshSessionByRaw(rawToken) {
  const tokenHash = hashRefreshToken(rawToken);
  return revokeRefreshSessionByHash(tokenHash);
}

export async function revokeAllForUser(userId) {
  await revokeAllRefreshSessionsForUser(userId);
}
