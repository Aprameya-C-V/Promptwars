import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { exerciseRequestSchema } from "../schemas/contracts.js";
import { generateExercise } from "../services/exerciseService.js";

export const exerciseRouter = Router();

exerciseRouter.post("/", asyncHandler(async (req, res) => {
  const input = exerciseRequestSchema.parse(req.body);
  const exercise = await generateExercise(input);
  return res.json({ exercise });
}));
