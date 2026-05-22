import path from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "./env.js";
import { initJsonStore, getStorePath } from "../storage/jsonStore.js";
import { seedDemoUser, logStorageInfo } from "../storage/seed.js";
import { pruneExpiredRefreshSessions } from "../repositories/refreshSession.repository.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultDataPath = path.join(__dirname, "../../data/store.json");

let initialized = false;

/**
 * Initialize local JSON persistence (no external database required).
 */
export async function connectDatabase() {
  if (initialized) return;

  const dataPath = env.DATA_PATH
    ? path.isAbsolute(env.DATA_PATH)
      ? env.DATA_PATH
      : path.resolve(process.cwd(), env.DATA_PATH)
    : defaultDataPath;

  await initJsonStore(dataPath);
  await pruneExpiredRefreshSessions();
  await seedDemoUser();
  logStorageInfo(getStorePath());
  initialized = true;
}

export async function disconnectDatabase() {
  initialized = false;
}
