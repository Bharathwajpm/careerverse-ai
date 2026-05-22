import { z } from "zod";

/** Strong enough for production without blocking common memorable phrases */
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128)
  .regex(/[A-Za-z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const registerBodySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Invalid email").max(254),
  password: passwordSchema,
});

export const loginBodySchema = z.object({
  email: z.string().trim().email("Invalid email").max(254),
  password: z.string().min(1, "Password is required").max(128),
});

export const googleBodySchema = z.object({
  credential: z.string().min(20, "Missing Google credential"),
});

export const forgotPasswordBodySchema = z.object({
  email: z.string().trim().email("Invalid email").max(254),
});

export const resetPasswordBodySchema = z.object({
  token: z.string().min(32, "Invalid reset token"),
  password: passwordSchema,
});
