import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { liveSessionRequestSchema } from "../schemas/contracts.js";
import { geminiService } from "../services/gemini.js";

export const liveRouter = Router();

liveRouter.post("/session-token", asyncHandler(async (req, res) => {
  const input = liveSessionRequestSchema.parse(req.body);
  const token = await geminiService.createLiveEphemeralToken(input.recentEntries);
  return res.json(token);
}));
