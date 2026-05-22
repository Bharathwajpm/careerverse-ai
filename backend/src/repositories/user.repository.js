import { randomUUID } from "node:crypto";
import { getStore, withStore } from "../storage/jsonStore.js";

/**
 * @typedef {Object} UserRecord
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} [passwordHash]
 * @property {string} [googleId]
 * @property {string} [passwordResetTokenHash]
 * @property {string} [passwordResetExpires]
 * @property {string} createdAt
 * @property {string} updatedAt
 */

function nowIso() {
  return new Date().toISOString();
}

/**
 * @param {UserRecord} user
 * @param {{ includeSecrets?: boolean }} [opts]
 */
export function toPublicUser(user, opts = {}) {
  const { includeSecrets = false } = opts;
  const base = {
    id: user.id,
    name: user.name,
    email: user.email,
  };
  if (!includeSecrets) return base;
  return {
    ...base,
    passwordHash: user.passwordHash,
    googleId: user.googleId,
    passwordResetTokenHash: user.passwordResetTokenHash,
    passwordResetExpires: user.passwordResetExpires,
  };
}

/**
 * @param {string} id
 * @param {{ includePassword?: boolean; includeReset?: boolean }} [opts]
 * @returns {UserRecord | null}
 */
export function findUserById(id, opts = {}) {
  const user = getStore().users.find((u) => u.id === id);
  if (!user) return null;
  if (!opts.includePassword && !opts.includeReset) {
    return { ...user, passwordHash: undefined };
  }
  return { ...user };
}

/**
 * @param {string} email
 * @param {{ includePassword?: boolean }} [opts]
 * @returns {UserRecord | null}
 */
export function findUserByEmail(email, opts = {}) {
  const normalized = email.toLowerCase().trim();
  const user = getStore().users.find((u) => u.email === normalized);
  if (!user) return null;
  if (!opts.includePassword) {
    return { ...user, passwordHash: undefined };
  }
  return { ...user };
}

/**
 * @param {string} googleId
 * @param {string} email
 * @returns {UserRecord | null}
 */
export function findUserByGoogleOrEmail(googleId, email) {
  const normalized = email.toLowerCase().trim();
  const user = getStore().users.find(
    (u) => u.googleId === googleId || u.email === normalized,
  );
  return user ? { ...user } : null;
}

/**
 * @param {Omit<UserRecord, 'id' | 'createdAt' | 'updatedAt'> & Partial<Pick<UserRecord, 'id'>>} input
 * @returns {Promise<UserRecord>}
 */
export async function createUser(input) {
  const email = input.email.toLowerCase().trim();
  if (getStore().users.some((u) => u.email === email)) {
    const err = new Error("Duplicate email");
    /** @type {Error & { code: number }} */ (err).code = 11000;
    throw err;
  }
  if (input.googleId && getStore().users.some((u) => u.googleId === input.googleId)) {
    const err = new Error("Duplicate googleId");
    /** @type {Error & { code: number }} */ (err).code = 11000;
    throw err;
  }

  const ts = nowIso();
  /** @type {UserRecord} */
  const user = {
    id: input.id ?? randomUUID(),
    name: input.name.trim(),
    email,
    passwordHash: input.passwordHash,
    googleId: input.googleId,
    passwordResetTokenHash: input.passwordResetTokenHash,
    passwordResetExpires: input.passwordResetExpires,
    createdAt: ts,
    updatedAt: ts,
  };

  await withStore((data) => {
    data.users.push(user);
  });

  return { ...user, passwordHash: undefined };
}

/**
 * @param {string} id
 * @param {Partial<Pick<UserRecord, 'name' | 'googleId' | 'passwordHash' | 'passwordResetTokenHash' | 'passwordResetExpires'>>} patch
 * @returns {Promise<UserRecord | null>}
 */
export async function updateUser(id, patch) {
  let updated = null;
  await withStore((data) => {
    const idx = data.users.findIndex((u) => u.id === id);
    if (idx === -1) return;
    const current = data.users[idx];
    const next = {
      ...current,
      ...patch,
      updatedAt: nowIso(),
    };
    if (patch.passwordResetTokenHash === undefined && "passwordResetTokenHash" in patch) {
      delete next.passwordResetTokenHash;
    }
    if (patch.passwordResetExpires === undefined && "passwordResetExpires" in patch) {
      delete next.passwordResetExpires;
    }
    data.users[idx] = next;
    updated = { ...next };
  });
  return updated;
}

/**
 * @param {string} tokenHash
 * @returns {UserRecord | null}
 */
export function findUserByPasswordResetToken(tokenHash) {
  const now = Date.now();
  const user = getStore().users.find((u) => {
    if (!u.passwordResetTokenHash || !u.passwordResetExpires) return false;
    if (u.passwordResetTokenHash !== tokenHash) return false;
    return new Date(u.passwordResetExpires).getTime() > now;
  });
  return user ? { ...user } : null;
}
