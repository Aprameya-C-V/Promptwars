import type { JournalEntry } from "./types";

export type TriggerSummary = {
  label: string;
  events: number;
  percentage: number;
};

export type TrendSummary = {
  entries: JournalEntry[];
  averageMood: number | null;
  averageEnergy: number | null;
  moodChange: number | null;
  triggerSummaries: TriggerSummary[];
  hiddenPatterns: string[];
};

const energyScores = {
  low: 3,
  medium: 6,
  high: 9
} as const;

export function summarizeTrends(
  entries: JournalEntry[],
  days: 7 | 30,
  now = new Date()
): TrendSummary {
  const cutoff = now.getTime() - days * 24 * 60 * 60 * 1000;
  const filtered = entries
    .filter((entry) => {
      const timestamp = Date.parse(entry.createdAt);
      return Number.isFinite(timestamp) && timestamp >= cutoff && timestamp <= now.getTime();
    })
    .sort((left, right) => Date.parse(left.createdAt) - Date.parse(right.createdAt));

  if (!filtered.length) {
    return {
      entries: [],
      averageMood: null,
      averageEnergy: null,
      moodChange: null,
      triggerSummaries: [],
      hiddenPatterns: []
    };
  }

  const averageMood =
    filtered.reduce((total, entry) => total + entry.analysis.moodScore, 0) / filtered.length;
  const averageEnergy =
    filtered.reduce((total, entry) => total + energyScores[entry.analysis.energyLevel], 0) /
    filtered.length;
  const moodChange =
    filtered.length > 1
      ? filtered.at(-1)!.analysis.moodScore - filtered[0]!.analysis.moodScore
      : null;

  const triggerCounts = new Map<string, { label: string; events: number }>();
  for (const entry of filtered) {
    for (const trigger of entry.analysis.stressTriggers) {
      const key = trigger.trim().toLocaleLowerCase();
      if (!key) continue;
      const current = triggerCounts.get(key);
      triggerCounts.set(key, {
        label: current?.label ?? trigger.trim(),
        events: (current?.events ?? 0) + 1
      });
    }
  }

  const maximumTriggerCount = Math.max(1, ...Array.from(triggerCounts.values(), (item) => item.events));
  const triggerSummaries = Array.from(triggerCounts.values())
    .sort((left, right) => right.events - left.events || left.label.localeCompare(right.label))
    .slice(0, 5)
    .map((trigger) => ({
      ...trigger,
      percentage: Math.round((trigger.events / maximumTriggerCount) * 100)
    }));

  const hiddenPatterns = Array.from(
    new Set(
      filtered
        .map((entry) => entry.analysis.hiddenPattern?.trim())
        .filter((pattern): pattern is string => Boolean(pattern))
    )
  ).slice(-4);

  return {
    entries: filtered,
    averageMood,
    averageEnergy,
    moodChange,
    triggerSummaries,
    hiddenPatterns
  };
}
