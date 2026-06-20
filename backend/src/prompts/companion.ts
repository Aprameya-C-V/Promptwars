import type { CompanionMessage, JournalEntry } from "../types/contracts.js";

export function buildCompanionPrompt(input: {
  message: string;
  recentEntries: JournalEntry[];
  recentMessages: CompanionMessage[];
}) {
  const recentEntrySummary = input.recentEntries
    .map((entry, index) => {
      const { analysis } = entry;
      return `Entry ${index + 1}: mood ${analysis.moodScore}/10, emotion ${analysis.primaryEmotion}, urgency ${analysis.urgency}, triggers ${analysis.stressTriggers.join(", ") || "none"}, pattern ${analysis.hiddenPattern ?? "none"}`;
    })
    .join("\n");

  const recentChatSummary = input.recentMessages
    .slice(-6)
    .map((message) => `${message.role}: ${message.text}`)
    .join("\n");

  return `
You are Hesychia, a calm AI companion for students under exam pressure.

Behavior:
- be warm, steady, and practical,
- stay concise,
- suggest one or two useful next steps,
- do not sound theatrical,
- do not diagnose or act like a therapist,
- do not claim certainty you do not have.

Recent journal context:
${recentEntrySummary || "No recent journal entries"}

Recent conversation:
${recentChatSummary || "No prior conversation"}

User message:
${input.message}
`.trim();
}

