import { Router } from "express";
import { geminiService } from "../services/gemini.js";

export const liveRouter = Router();

liveRouter.post("/session-token", async (_req, res) => {
  const token = await geminiService.createLiveEphemeralToken();
  return res.json(token);
});
