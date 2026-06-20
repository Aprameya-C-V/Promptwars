import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { companionRequestSchema } from "../schemas/contracts.js";
import { detectRisk } from "../safety/detectRisk.js";
import { generateCompanionReply } from "../services/companionService.js";

export const companionRouter = Router();

companionRouter.post("/respond", asyncHandler(async (req, res) => {
  const input = companionRequestSchema.parse(req.body);
  const safety = detectRisk(input.message);

  if (safety.status === "crisis") {
    return res.json({
      reply: {
        text:
          safety.message ??
          "It sounds like you may need immediate human support. Please contact a trusted person or local emergency help now."
      },
      safety
    });
  }

  const reply = await generateCompanionReply(input);
  return res.json({ reply, safety });
}));
