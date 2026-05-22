import { AppError } from "../utils/AppError.js";
import { env } from "../config/env.js";

/**
 * Centralized JSON error responses. Operational `AppError` messages are safe to expose.
 */
export function errorHandler(err, req, res, _next) {
  let statusCode = 500;
  let message = "Internal server error";
  let details;
  let isOperational = false;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
    isOperational = err.isOperational;
  } else if (err instanceof SyntaxError && err.status === 400) {
    statusCode = 400;
    message = "Invalid JSON body";
    isOperational = true;
  } else if (
    typeof err === "object" &&
    err !== null &&
    "type" in err &&
    err.type === "entity.parse.failed"
  ) {
    statusCode = 400;
    message = "Invalid JSON body";
    isOperational = true;
  } else if (
    typeof err === "object" &&
    err !== null &&
    "statusCode" in err &&
    typeof err.statusCode === "number" &&
    err.statusCode >= 400 &&
    err.statusCode < 500
  ) {
    statusCode = err.statusCode;
    message = typeof err.message === "string" ? err.message : "Bad request";
    isOperational = true;
  }

  if (!isOperational || statusCode >= 500) {
    console.error(`[${req.method}] ${req.path}`, err);
  }

  const body = {
    success: false,
    message,
  };

  if (details !== undefined) {
    body.errors = details;
  }

  if (env.NODE_ENV === "development" && !isOperational) {
    body.stack = err.stack;
  }

  res.status(statusCode).json(body);
}
