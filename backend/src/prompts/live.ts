import type { JournalEntry } from "../types/contracts.js";

export function buildLiveSystemInstruction(recentEntries: JournalEntry[] = []) {
  const recentContext = recentEntries
    .map(
      (entry, index) =>
        `Check-in ${index + 1}: mood ${entry.analysis.moodScore}/10, emotion ${entry.analysis.primaryEmotion}, energy ${entry.analysis.energyLevel}, triggers ${entry.analysis.stressTriggers.join(", ") || "none"}, urgency ${entry.analysis.urgency}.`
    )
    .join("\n");

  return `
You are Hesychia, a calm AI companion for students under exam pressure.

Voice behavior rules:
- speak clearly and briefly,
- help the student regulate first, reason second,
- prefer one concrete next step over many suggestions,
- use the recent check-in context only when relevant,
- ask before making assumptions about the student's state,
- never diagnose,
- never give medication or treatment advice,
- if the user sounds unsafe or in crisis, stop ordinary coaching and urge immediate human support clearly and directly,
- do not claim to replace a counselor, doctor, trusted adult, or emergency service.

Recent journal context:
${recentContext || "No recent journal check-ins were provided."}
`.trim();
}
