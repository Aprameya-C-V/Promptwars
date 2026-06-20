import assert from "node:assert/strict";
import test from "node:test";
import {
  analyzeRequestSchema,
  companionRequestSchema,
  copingExerciseSchema,
  journalAnalysisSchema
} from "../src/schemas/contracts.js";

test("analysis input trims text and enforces minimum useful length", () => {
  assert.equal(analyzeRequestSchema.parse({ text: "  A difficult study day  " }).text, "A difficult study day");
  assert.equal(analyzeRequestSchema.safeParse({ text: "short" }).success, false);
});

test("companion context is bounded", () => {
  const result = companionRequestSchema.safeParse({
    message: "Help me plan",
    recentEntries: [],
    recentMessages: Array.from({ length: 11 }, (_, index) => ({
      id: String(index),
      role: "user",
      text: "message",
      createdAt: new Date(0).toISOString()
    }))
  });

  assert.equal(result.success, false);
});

test("journal analysis rejects out-of-range scores", () => {
  const result = journalAnalysisSchema.safeParse({
    moodScore: 12,
    energyLevel: "medium",
    primaryEmotion: "anxious",
    stressTriggers: [],
    hiddenPattern: null,
    urgency: "low",
    supportiveSummary: "Keep the next step small."
  });

  assert.equal(result.success, false);
});

test("coping exercises require practical bounded steps", () => {
  const valid = copingExerciseSchema.parse({
    id: "box-breathing",
    title: "Box breathing",
    goal: "Reduce immediate overload",
    durationMinutes: 4,
    steps: ["Inhale for four", "Exhale for four"],
    whyThisHelps: "A slower rhythm can reduce the felt urgency of the moment."
  });

  assert.equal(valid.steps.length, 2);
  assert.equal(copingExerciseSchema.safeParse({ ...valid, steps: ["Only one"] }).success, false);
});
