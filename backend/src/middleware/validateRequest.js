import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";

/**
 * Validates `req.body` and replaces it with the parsed result.
 * @param {import('zod').ZodTypeAny} schema
 */
export function validateBody(schema) {
  return (req, _res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return next(new AppError("Validation failed", 400, err.flatten()));
      }
      next(err);
    }
  };
}
