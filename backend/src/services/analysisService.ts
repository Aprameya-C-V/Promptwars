import { journalAnalysisSchema } from "../schemas/contracts.js";
import { GEMINI_TEXT_MODEL } from "../config/models.js";
import { buildAnalyzePrompt } from "../prompts/analyze.js";
import { geminiService } from "./gemini.js";

export async function analyzeJournal(input: {
  text: string;
  examType?: string;
  quickMood?: number;
}) {
  return geminiService.generateStructured({
    model: GEMINI_TEXT_MODEL,
    prompt: buildAnalyzePrompt(input),
    schema: journalAnalysisSchema
  });
}
