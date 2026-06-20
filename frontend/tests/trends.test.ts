import assert from "node:assert/strict";
import test from "node:test";
import { summarizeTrends } from "../lib/trends";
import type { JournalEntry } from "../lib/types";

function entry(
  id: string,
  day: number,
  moodScore: number,
  triggers: string[],
  hiddenPattern: string | null,
  energyLevel: "low" | "medium" | "high" = "medium"
): JournalEntry {
  return {
    id,
    createdAt: new Date(Date.UTC(2026, 5, day)).toISOString(),
    rawText: "Journal text",
    analysis: {
      moodScore,
      energyLevel,
      primaryEmotion: "anxious",
      stressTriggers: triggers,
      hiddenPattern,
      urgency: "medium",
      supportiveSummary: "Keep the next step small."
    }
  };
}

test("trend summaries use only entries inside the selected period", () => {
  const summary = summarizeTrends(
    [
      entry("old", 1, 3, ["Sleep"], null),
      entry("recent", 19, 7, ["Mocks"], "Mock days increase pressure.")
    ],
    7,
    new Date(Date.UTC(2026, 5, 20))
  );

  assert.deepEqual(summary.entries.map((item) => item.id), ["recent"]);
  assert.equal(summary.averageMood, 7);
});

test("trend summaries calculate mood direction and recurring triggers", () => {
  const summary = summarizeTrends(
    [
      entry("one", 16, 4, ["Sleep", "Mocks"], "Late sleep lowers stability.", "low"),
      entry("two", 18, 7, ["sleep"], "Late sleep lowers stability.", "high")
    ],
    30,
    new Date(Date.UTC(2026, 5, 20))
  );

  assert.equal(summary.averageMood, 5.5);
  assert.equal(summary.averageEnergy, 6);
  assert.equal(summary.moodChange, 3);
  assert.deepEqual(summary.triggerSummaries[0], {
    label: "Sleep",
    events: 2,
    percentage: 100
  });
  assert.deepEqual(summary.hiddenPatterns, ["Late sleep lowers stability."]);
});

test("empty periods return explicit empty metrics", () => {
  const summary = summarizeTrends([], 30, new Date(Date.UTC(2026, 5, 20)));
  assert.equal(summary.averageMood, null);
  assert.deepEqual(summary.triggerSummaries, []);
});
