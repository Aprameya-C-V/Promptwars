import "dotenv/config";
import cors from "cors";
import express from "express";
import { analyzeRouter } from "./routes/analyze.js";
import { companionRouter } from "./routes/companion.js";
import { exerciseRouter } from "./routes/exercise.js";
import { liveRouter } from "./routes/live.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import { env } from "./config/env.js";

const app = express();
const port = env.PORT;
const allowedOrigin = env.ALLOWED_ORIGIN;

app.use(
  cors({
    origin: allowedOrigin
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "hesychia-backend" });
});

app.use("/api/analyze", analyzeRouter);
app.use("/api/companion", companionRouter);
app.use("/api/exercise", exerciseRouter);
app.use("/api/live", liveRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Hesychia backend listening on port ${port}`);
});
