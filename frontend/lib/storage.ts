import type { CompanionMessage, CopingExercise, JournalEntry } from "./types";

const STORAGE_KEYS = {
  journalEntries: "hesychia.journalEntries",
  companionMessages: "hesychia.companionMessages",
  latestExercise: "hesychia.latestExercise"
} as const;

function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  loadJournalEntries(): JournalEntry[] {
    return safeRead(STORAGE_KEYS.journalEntries, []);
  },
  saveJournalEntries(entries: JournalEntry[]) {
    safeWrite(STORAGE_KEYS.journalEntries, entries);
  },
  loadCompanionMessages(): CompanionMessage[] {
    return safeRead(STORAGE_KEYS.companionMessages, []);
  },
  saveCompanionMessages(messages: CompanionMessage[]) {
    safeWrite(STORAGE_KEYS.companionMessages, messages);
  },
  loadLatestExercise(): CopingExercise | null {
    return safeRead(STORAGE_KEYS.latestExercise, null);
  },
  saveLatestExercise(exercise: CopingExercise | null) {
    safeWrite(STORAGE_KEYS.latestExercise, exercise);
  }
};

