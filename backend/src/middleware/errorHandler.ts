import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

function publicError(error: unknown) {
  if (error instanceof Error && error.message === "GEMINI_API_KEY is not configured") {
    return {
      status: 503,
      message: "AI service is not configured"
    };
  }

  if (error instanceof Error && error.message === "Origin is not allowed") {
    return {
      status: 403,
      message: "Origin is not allowed"
    };
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    (error.status === 400 || error.status === 413)
  ) {
    return {
      status: error.status,
      message: error.status === 413 ? "Request payload is too large" : "Invalid JSON payload"
    };
  }

  return {
    status: 502,
    message: "The AI service could not complete the request"
  };
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: {
        message: "Invalid request payload",
        details: error.flatten()
      }
    });
  }

  const exposed = publicError(error);
  if (process.env.NODE_ENV !== "test") console.error(error);
  res.status(exposed.status).json({
    error: {
      message: exposed.message
    }
  });
}
