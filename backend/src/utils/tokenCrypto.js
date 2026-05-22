import crypto from "crypto";

export function randomUrlToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function sha256Hex(value) {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

export function randomRefreshToken() {
  return crypto.randomBytes(48).toString("base64url");
}
