import type { JournalAnalysis } from "../types/contracts.js";

export function buildExercisePrompt(input: {
  currentAnalysis: JournalAnalysis;
  userRequest?: string;
}) {
  return `
You are generating a short coping exercise for an exam student.

Rules:
- create one exercise only,
- keep it short and actionable,
- avoid medical or therapeutic claims,
- tailor it to the student's current state,
- optimize for immediate usefulness.

Current state:
- moodScore: ${input.currentAnalysis.moodScore}
- energyLevel: ${input.currentAnalysis.energyLevel}
- primaryEmotion: ${input.currentAnalysis.primaryEmotion}
- stressTriggers: ${input.currentAnalysis.stressTriggers.join(", ")}
- hiddenPattern: ${input.currentAnalysis.hiddenPattern ?? "none"}
- urgency: ${input.currentAnalysis.urgency}

User request:
${input.userRequest ?? "No additional request"}
`.trim();
}

