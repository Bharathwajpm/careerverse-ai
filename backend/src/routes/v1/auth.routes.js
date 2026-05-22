import { Router } from "express";
import * as authController from "../../controllers/auth.controller.js";
import { validateBody } from "../../middleware/validateRequest.js";
import {
  registerBodySchema,
  loginBodySchema,
  googleBodySchema,
  forgotPasswordBodySchema,
  resetPasswordBodySchema,
} from "../../validation/auth.validation.js";
import { authRequired } from "../../middleware/authRequired.js";
import { authBurstLimiter, authStrictLimiter } from "../../middleware/rateLimiters.js";

const router = Router();

router.post(
  "/register",
  authBurstLimiter,
  authStrictLimiter,
  validateBody(registerBodySchema),
  authController.register,
);
router.post("/login", authBurstLimiter, authStrictLimiter, validateBody(loginBodySchema), authController.login);
router.post(
  "/google",
  authBurstLimiter,
  authStrictLimiter,
  validateBody(googleBodySchema),
  authController.google,
);
router.post("/refresh", authBurstLimiter, authController.refresh);
router.post("/logout", authController.logout);
router.post(
  "/forgot-password",
  authBurstLimiter,
  authStrictLimiter,
  validateBody(forgotPasswordBodySchema),
  authController.forgotPassword,
);
router.post(
  "/reset-password",
  authBurstLimiter,
  authStrictLimiter,
  validateBody(resetPasswordBodySchema),
  authController.resetPassword,
);
router.get("/me", authRequired, authController.me);

export default router;
