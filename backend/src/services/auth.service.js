import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";
import { signAccessToken } from "./accessToken.service.js";
import * as refreshSvc from "./refreshSession.service.js";
import { sendPasswordResetEmail } from "./email.service.js";
import { randomUrlToken, sha256Hex } from "../utils/tokenCrypto.js";
import {
  createUser,
  findUserByEmail,
  findUserByGoogleOrEmail,
  findUserById,
  findUserByPasswordResetToken,
  toPublicUser,
  updateUser,
} from "../repositories/user.repository.js";

const oauthClient = env.GOOGLE_CLIENT_ID ? new OAuth2Client(env.GOOGLE_CLIENT_ID) : null;

function refreshTtlMs() {
  return env.JWT_REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000;
}

/**
 * @param {{ name: string; email: string; password: string }} body
 * @param {import('express').Request} req
 */
export async function registerUser(body, req) {
  const passwordHash = await bcrypt.hash(body.password, env.BCRYPT_SALT_ROUNDS);
  const email = body.email.toLowerCase().trim();
  try {
    const user = await createUser({
      name: body.name,
      email,
      passwordHash,
    });
    const refreshRaw = await refreshSvc.issueRefreshSession(user.id, req, refreshTtlMs());
    const token = signAccessToken(user.id);
    return { user: toPublicUser(user), token, refreshRaw };
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === 11000) {
      throw new AppError("An account with this email already exists", 409);
    }
    throw err;
  }
}

/**
 * @param {{ email: string; password: string }} body
 * @param {import('express').Request} req
 */
export async function loginUser(body, req) {
  const user = findUserByEmail(body.email, { includePassword: true });
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }
  if (!user.passwordHash) {
    throw new AppError("This account uses Google sign-in", 401);
  }
  const ok = await bcrypt.compare(body.password, user.passwordHash);
  if (!ok) {
    throw new AppError("Invalid email or password", 401);
  }
  const refreshRaw = await refreshSvc.issueRefreshSession(user.id, req, refreshTtlMs());
  const token = signAccessToken(user.id);
  return { user: toPublicUser(user), token, refreshRaw };
}

/**
 * @param {string} idToken
 * @param {import('express').Request} req
 */
export async function loginOrRegisterWithGoogle(idToken, req) {
  if (!oauthClient || !env.GOOGLE_CLIENT_ID) {
    throw new AppError("Google sign-in is not configured on the server", 503);
  }
  const ticket = await oauthClient.verifyIdToken({
    idToken,
    audience: env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload?.email || !payload.sub) {
    throw new AppError("Invalid Google credential", 401);
  }
  const email = payload.email.toLowerCase();
  let user = findUserByGoogleOrEmail(payload.sub, email);
  if (!user) {
    user = await createUser({
      name: (payload.name || email.split("@")[0]).slice(0, 120),
      email,
      googleId: payload.sub,
    });
  } else if (!user.googleId) {
    user = (await updateUser(user.id, { googleId: payload.sub })) ?? user;
  }
  const refreshRaw = await refreshSvc.issueRefreshSession(user.id, req, refreshTtlMs());
  const token = signAccessToken(user.id);
  return { user: toPublicUser(user), token, refreshRaw };
}

/**
 * @param {import('express').Request} req
 */
export async function refreshAccessToken(req) {
  const raw = req.cookies?.[env.REFRESH_COOKIE_NAME];
  if (typeof raw !== "string" || !raw) {
    throw new AppError("No refresh session", 401);
  }
  const found = await refreshSvc.findActiveRefreshSession(raw);
  if (!found) {
    throw new AppError("Invalid or expired refresh session", 401);
  }
  const user = findUserById(found.userId);
  if (!user) {
    throw new AppError("User not found", 401);
  }
  const newRaw = await refreshSvc.rotateRefreshSession(found.session, req, refreshTtlMs());
  const token = signAccessToken(user.id);
  return { token, refreshRaw: newRaw };
}

/**
 * @param {import('express').Request} req
 */
export async function logoutSession(req) {
  const raw = req.cookies?.[env.REFRESH_COOKIE_NAME];
  if (typeof raw === "string" && raw) {
    await refreshSvc.revokeRefreshSessionByRaw(raw);
  }
}

/**
 * @param {{ email: string }} body
 */
export async function requestPasswordReset(body) {
  const user = findUserByEmail(body.email);
  if (!user) {
    return { sent: false };
  }
  const raw = randomUrlToken();
  await updateUser(user.id, {
    passwordResetTokenHash: sha256Hex(raw),
    passwordResetExpires: new Date(
      Date.now() + env.PASSWORD_RESET_EXPIRES_MIN * 60 * 1000,
    ).toISOString(),
  });
  const resetUrl = `${env.APP_PUBLIC_URL.replace(/\/$/, "")}/reset-password?token=${raw}`;
  await sendPasswordResetEmail({ to: user.email, resetUrl, name: user.name });
  return { sent: true };
}

/**
 * @param {{ token: string; password: string }} body
 */
export async function resetPasswordWithToken(body) {
  const tokenHash = sha256Hex(body.token);
  const user = findUserByPasswordResetToken(tokenHash);
  if (!user) {
    throw new AppError("Invalid or expired reset link", 400);
  }
  const passwordHash = await bcrypt.hash(body.password, env.BCRYPT_SALT_ROUNDS);
  await updateUser(user.id, {
    passwordHash,
    passwordResetTokenHash: undefined,
    passwordResetExpires: undefined,
  });
  await refreshSvc.revokeAllForUser(user.id);
}
