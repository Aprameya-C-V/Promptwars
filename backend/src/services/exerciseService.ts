import { copingExerciseSchema } from "../schemas/contracts.js";
import { GEMINI_TEXT_MODEL } from "../config/models.js";
import { buildExercisePrompt } from "../prompts/exercise.js";
import { geminiService } from "./gemini.js";

export async function generateExercise(input: {
  currentAnalysis: any;
  userRequest?: string;
}) {
  return geminiService.generateStructured({
    model: GEMINI_TEXT_MODEL,
    prompt: buildExercisePrompt(input),
    schema: copingExerciseSchema
  });
}
