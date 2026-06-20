import type { SafetyStatus } from "../types/contracts.js";

const crisisPatterns = [
  /\bkill myself\b/i,
  /\bend my life\b/i,
  /\bsuicid(?:e|al)\b/i,
  /\bself harm\b/i,
  /\bhurt myself\b/i,
  /\bdon't want to live\b/i
];

const elevatedPatterns = [
  /\bpanic\b/i,
  /\bburn(?:ed)? out\b/i,
  /\bcan't cope\b/i,
  /\bbreaking down\b/i,
  /\boverwhelmed\b/i
];

export function detectRisk(text: string): { status: SafetyStatus; message?: string } {
  if (crisisPatterns.some((pattern) => pattern.test(text))) {
    return {
      status: "crisis",
      message:
        "It sounds like you may be in immediate distress. Please reach out to a trusted person or local emergency support right now."
    };
  }

  if (elevatedPatterns.some((pattern) => pattern.test(text))) {
    return {
      status: "elevated",
      message: "You sound under heavy strain. Let's keep the response focused and practical."
    };
  }

  return { status: "ok" };
}

