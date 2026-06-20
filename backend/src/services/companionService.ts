import { z } from "zod";
import { GEMINI_TEXT_MODEL } from "../config/models.js";
import { buildCompanionPrompt } from "../prompts/companion.js";
import { geminiService } from "./gemini.js";

const companionReplySchema = z.object({
  text: z.string().min(1).max(600)
});

export async function generateCompanionReply(input: {
  message: string;
  recentEntries: any[];
  recentMessages: any[];
}) {
  return geminiService.generateStructured({
    model: GEMINI_TEXT_MODEL,
    prompt: buildCompanionPrompt(input),
    schema: companionReplySchema
  });
}
