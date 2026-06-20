import { Router } from "express";
import { analyzeRequestSchema } from "../schemas/contracts.js";
import { detectRisk } from "../safety/detectRisk.js";
import { analyzeJournal } from "../services/analysisService.js";

export const analyzeRouter = Router();

analyzeRouter.post("/", async (req, res) => {
  const input = analyzeRequestSchema.parse(req.body);
  const safety = detectRisk(input.text);

  if (safety.status === "crisis") {
    return res.json({
      analysis: {
        moodScore: input.quickMood ?? 1,
        energyLevel: "low",
        primaryEmotion: "distressed",
        stressTriggers: ["immediate emotional crisis"],
        hiddenPattern: null,
        urgency: "high",
        supportiveSummary: "Normal AI reflection is paused because immediate human support matters more right now."
      },
      safety
    });
  }

  const analysis = await analyzeJournal(input);
  return res.json({ analysis, safety });
});

