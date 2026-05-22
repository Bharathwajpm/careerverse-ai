import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const boolish = z
  .string()
  .optional()
  .transform((v) => v === "1" || v === "true");

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  /** Path to JSON store file (default: backend/data/store.json) */
  DATA_PATH: z.string().optional().default(""),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  /** Short-lived access JWT (e.g. 15m, 1h). Legacy `JWT_EXPIRES_IN` still supported as fallback. */
  JWT_ACCESS_EXPIRES_IN: z.string().optional(),
  JWT_EXPIRES_IN: z.string().optional(),
  JWT_REFRESH_EXPIRES_DAYS: z.coerce.number().min(1).max(90).default(7),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(10).max(14).default(12),
  CORS_ORIGIN: z
    .string()
    .default("http://localhost:5173")
    .transform((s) =>
      s
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean),
    ),
  REFRESH_COOKIE_NAME: z.string().default("cv_refresh"),
  APP_PUBLIC_URL: z.string().url().default("http://localhost:5173"),
  PASSWORD_RESET_EXPIRES_MIN: z.coerce.number().int().min(15).max(1440).default(60),
  GOOGLE_CLIENT_ID: z.string().optional().default(""),
  SMTP_HOST: z.string().optional().default(""),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_SECURE: boolish,
  SMTP_USER: z.string().optional().default(""),
  SMTP_PASS: z.string().optional().default(""),
  EMAIL_FROM: z.string().min(1).default("noreply@example.com"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const d = parsed.data;
const JWT_ACCESS_EXPIRES_IN = d.JWT_ACCESS_EXPIRES_IN ?? d.JWT_EXPIRES_IN ?? "15m";

export const env = {
  ...d,
  JWT_ACCESS_EXPIRES_IN,
};

if (env.NODE_ENV === "production" && env.JWT_SECRET.length < 32) {
  console.warn("Warning: JWT_SECRET should be at least 32 characters in production.");
}

if (env.NODE_ENV === "development" && env.JWT_SECRET === "change-me-to-a-long-random-secret-in-production") {
  console.info("[env] Using default JWT_SECRET for local development.");
}
