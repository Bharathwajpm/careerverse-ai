import { randomUUID } from "node:crypto";
import { getStore, withStore } from "../storage/jsonStore.js";

/**
 * @typedef {Object} RefreshSessionRecord
 * @property {string} id
 * @property {string} userId
 * @property {string} tokenHash
 * @property {string} expiresAt
 * @property {string | null} revokedAt
 * @property {string} [userAgent]
 * @property {string} [ip]
 * @property {string} createdAt
 * @property {string} updatedAt
 */

function nowIso() {
  return new Date().toISOString();
}

/**
 * @param {{ userId: string; tokenHash: string; expiresAt: Date; userAgent?: string; ip?: string }} input
 * @returns {Promise<RefreshSessionRecord>}
 */
export async function createRefreshSession(input) {
  const ts = nowIso();
  /** @type {RefreshSessionRecord} */
  const session = {
    id: randomUUID(),
    userId: input.userId,
    tokenHash: input.tokenHash,
    expiresAt: input.expiresAt.toISOString(),
    revokedAt: null,
    userAgent: input.userAgent,
    ip: input.ip,
    createdAt: ts,
    updatedAt: ts,
  };

  await withStore((data) => {
    data.refreshSessions.push(session);
  });

  return session;
}

/**
 * @param {string} tokenHash
 * @returns {RefreshSessionRecord | null}
 */
export function findActiveRefreshSessionByHash(tokenHash) {
  const now = Date.now();
  const session = getStore().refreshSessions.find((s) => {
    if (s.tokenHash !== tokenHash || s.revokedAt) return false;
    return new Date(s.expiresAt).getTime() > now;
  });
  return session ? { ...session } : null;
}

/**
 * @param {string} sessionId
 * @returns {Promise<RefreshSessionRecord | null>}
 */
export async function revokeRefreshSession(sessionId) {
  let revoked = null;
  await withStore((data) => {
    const idx = data.refreshSessions.findIndex((s) => s.id === sessionId && !s.revokedAt);
    if (idx === -1) return;
    const next = {
      ...data.refreshSessions[idx],
      revokedAt: nowIso(),
      updatedAt: nowIso(),
    };
    data.refreshSessions[idx] = next;
    revoked = { ...next };
  });
  return revoked;
}

/**
 * @param {string} tokenHash
 * @returns {Promise<boolean>}
 */
export async function revokeRefreshSessionByHash(tokenHash) {
  const session = getStore().refreshSessions.find((s) => s.tokenHash === tokenHash && !s.revokedAt);
  if (!session) return false;
  await revokeRefreshSession(session.id);
  return true;
}

/**
 * @param {string} userId
 * @returns {Promise<number>}
 */
export async function revokeAllRefreshSessionsForUser(userId) {
  let count = 0;
  const ts = nowIso();
  await withStore((data) => {
    data.refreshSessions = data.refreshSessions.map((s) => {
      if (s.userId !== userId || s.revokedAt) return s;
      count += 1;
      return { ...s, revokedAt: ts, updatedAt: ts };
    });
  });
  return count;
}

/**
 * Remove expired sessions (housekeeping, optional).
 */
export async function pruneExpiredRefreshSessions() {
  const now = Date.now();
  await withStore((data) => {
    data.refreshSessions = data.refreshSessions.filter(
      (s) => new Date(s.expiresAt).getTime() > now,
    );
  });
}
