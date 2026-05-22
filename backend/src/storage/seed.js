import bcrypt from "bcrypt";
import { env } from "../config/env.js";
import { getStore } from "./jsonStore.js";
import { createUser, findUserByEmail } from "../repositories/user.repository.js";

const DEMO_EMAIL = "demo@careerverse.local";
const DEMO_PASSWORD = "DemoPass123!";
const DEMO_NAME = "Demo User";

/**
 * Ensures a known demo account exists for local development.
 */
export async function seedDemoUser() {
  if (env.NODE_ENV === "test") return;

  const existing = findUserByEmail(DEMO_EMAIL);
  if (existing) return;

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, env.BCRYPT_SALT_ROUNDS);
  await createUser({
    name: DEMO_NAME,
    email: DEMO_EMAIL,
    passwordHash,
  });

  console.info(`[seed] Demo user ready — ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
}

export function logStorageInfo(dataPath) {
  const users = getStore().users.length;
  const sessions = getStore().refreshSessions.length;
  console.info(`[storage] JSON store at ${dataPath} (${users} users, ${sessions} refresh sessions)`);
}
