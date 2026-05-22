import jwt from "jsonwebtoken";
import { verifyAccessToken } from "../services/accessToken.service.js";
import { AppError } from "../utils/AppError.js";
import { findUserById } from "../repositories/user.repository.js";

/**
 * Requires `Authorization: Bearer <token>`. Attaches `req.user` with id, email, name.
 */
export async function authRequired(req, _res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw new AppError("Authentication required", 401);
    }
    const token = header.slice(7);
    const { sub } = verifyAccessToken(token);
    const user = findUserById(sub);
    if (!user) {
      throw new AppError("User no longer exists", 401);
    }
    req.user = { id: user.id, email: user.email, name: user.name };
    next();
  } catch (err) {
    if (err instanceof AppError) return next(err);
    if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
      return next(new AppError("Invalid or expired token", 401));
    }
    next(err);
  }
}
