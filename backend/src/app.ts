import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import { analyzeRouter } from "./routes/analyze.js";
import { companionRouter } from "./routes/companion.js";
import { exerciseRouter } from "./routes/exercise.js";
import { liveRouter } from "./routes/live.js";

function isAllowedOrigin(origin: string | undefined) {
  if (!origin) return true;
  return env.ALLOWED_ORIGINS.includes(origin);
}

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("Permissions-Policy", "camera=(), geolocation=()");
    next();
  });
  app.use(
    cors({
      origin(origin, callback) {
        callback(isAllowedOrigin(origin) ? null : new Error("Origin is not allowed"), true);
      },
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type"],
      maxAge: 86400
    })
  );
  app.use(express.json({ limit: "64kb" }));

  app.get("/health", (_req, res) => {
    res.json({
      ok: true,
      service: "hesychia-backend",
      geminiConfigured: Boolean(env.GEMINI_API_KEY)
    });
  });

  app.use("/api/analyze", analyzeRouter);
  app.use("/api/companion", companionRouter);
  app.use("/api/exercise", exerciseRouter);
  app.use("/api/live", liveRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

export const app = createApp();

export default app;
