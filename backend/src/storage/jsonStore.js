import fs from "node:fs/promises";
import path from "node:path";
import { AppError } from "../utils/AppError.js";

/** @typedef {{ users: import('../repositories/user.repository.js').UserRecord[]; refreshSessions: import('../repositories/refreshSession.repository.js').RefreshSessionRecord[] }} StoreData */

const EMPTY_STORE = /** @type {StoreData} */ ({ users: [], refreshSessions: [] });

/** @type {StoreData | null} */
let store = null;
/** @type {string | null} */
let storePath = null;
/** @type {Promise<void>} */
let writeChain = Promise.resolve();

/**
 * Load or create the JSON store file. Safe to call once at startup.
 * @param {string} dataFilePath
 */
export async function initJsonStore(dataFilePath) {
  storePath = path.resolve(dataFilePath);
  await fs.mkdir(path.dirname(storePath), { recursive: true });

  try {
    const raw = await fs.readFile(storePath, "utf8");
    const parsed = JSON.parse(raw);
    store = normalizeStore(parsed);
  } catch (err) {
    if (/** @type {NodeJS.ErrnoException} */ (err).code === "ENOENT") {
      store = structuredClone(EMPTY_STORE);
      await persistStore();
      return;
    }
    if (err instanceof SyntaxError) {
      const backup = `${storePath}.corrupt-${Date.now()}.json`;
      try {
        await fs.rename(storePath, backup);
      } catch {
        /* ignore */
      }
      console.warn(`[storage] Corrupt store backed up; starting fresh (${backup})`);
      store = structuredClone(EMPTY_STORE);
      await persistStore();
      return;
    }
    throw err;
  }
}

/**
 * @param {unknown} parsed
 * @returns {StoreData}
 */
function normalizeStore(parsed) {
  if (!parsed || typeof parsed !== "object") {
    throw new AppError("Invalid store file format", 500);
  }
  const data = /** @type {Record<string, unknown>} */ (parsed);
  return {
    users: Array.isArray(data.users) ? data.users : [],
    refreshSessions: Array.isArray(data.refreshSessions) ? data.refreshSessions : [],
  };
}

/**
 * @returns {StoreData}
 */
export function getStore() {
  if (!store) {
    throw new Error("JSON store not initialized — call initJsonStore() first");
  }
  return store;
}

/**
 * Run a synchronous mutation and persist to disk (serialized writes).
 * @template T
 * @param {(data: StoreData) => T} mutator
 * @returns {Promise<T>}
 */
export async function withStore(mutator) {
  const data = getStore();
  const result = mutator(data);
  await persistStore();
  return result;
}

async function persistStore() {
  if (!store || !storePath) return;
  const target = storePath;
  const payload = JSON.stringify(store, null, 2);
  const run = async () => {
    const tmp = `${target}.tmp`;
    await fs.writeFile(tmp, payload, "utf8");
    await fs.rename(tmp, target);
  };
  writeChain = writeChain.then(run, run);
  await writeChain;
}

export function getStorePath() {
  return storePath;
}
