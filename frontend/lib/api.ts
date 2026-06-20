import type { CompanionMessage, CopingExercise, JournalAnalysis, JournalEntry, SafetyStatus } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

async function postJson<TResponse>(path: string, body: unknown): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<TResponse>;
}

export async function analyzeJournal(input: {
  text: string;
  examType?: string;
  quickMood?: number;
}): Promise<{
  analysis: JournalAnalysis;
  safety: { status: SafetyStatus; message?: string };
}> {
  return postJson("/api/analyze", input);
}

export async function sendCompanionMessage(input: {
  message: string;
  recentEntries: JournalEntry[];
  recentMessages: CompanionMessage[];
}): Promise<{
  reply: { text: string };
  safety: { status: SafetyStatus; message?: string };
}> {
  return postJson("/api/companion/respond", input);
}

export async function generateExercise(input: {
  currentAnalysis: JournalAnalysis;
  userRequest?: string;
}): Promise<{
  exercise: CopingExercise;
}> {
  return postJson("/api/exercise", input);
}

export async function createLiveSessionToken(): Promise<{
  token: string;
}> {
  return postJson("/api/live/session-token", {});
}
