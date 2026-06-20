import type { CompanionMessage, CopingExercise, JournalAnalysis, JournalEntry, SafetyStatus } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
const REQUEST_TIMEOUT_MS = 30000;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number | null
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function postJson<TResponse>(path: string, body: unknown): Promise<TResponse> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as
        | { error?: { message?: string } }
        | null;
      throw new ApiError(
        payload?.error?.message ?? `Request failed with status ${response.status}`,
        response.status
      );
    }

    return response.json() as Promise<TResponse>;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("The request timed out. Please try again.", null);
    }
    throw new ApiError("Unable to reach Hesychia. Check your connection and try again.", null);
  } finally {
    window.clearTimeout(timeout);
  }
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

export async function createLiveSessionToken(input: {
  recentEntries: JournalEntry[];
}): Promise<{
  token: string;
}> {
  return postJson("/api/live/session-token", input);
}
