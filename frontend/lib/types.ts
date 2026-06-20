export type SafetyStatus = "ok" | "elevated" | "crisis";
export type EnergyLevel = "low" | "medium" | "high";
export type UrgencyLevel = "low" | "medium" | "high";
export type ExamType = "NEET" | "JEE" | "CUET" | "CAT" | "GATE" | "UPSC" | "OTHER";

export type JournalAnalysis = {
  moodScore: number;
  energyLevel: EnergyLevel;
  primaryEmotion: string;
  stressTriggers: string[];
  hiddenPattern: string | null;
  urgency: UrgencyLevel;
  supportiveSummary: string;
};

export type JournalEntry = {
  id: string;
  createdAt: string;
  examType?: ExamType;
  rawText: string;
  quickMood?: number;
  analysis: JournalAnalysis;
};

export type CompanionMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
  createdAt: string;
};

export type CopingExercise = {
  id: string;
  title: string;
  goal: string;
  durationMinutes: number;
  steps: string[];
  whyThisHelps: string;
};

