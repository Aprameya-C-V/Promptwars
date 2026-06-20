import assert from "node:assert/strict";
import test from "node:test";
import type { VoiceSessionMessage } from "../lib/live/session";
import { mergeTranscriptMessage } from "../lib/live/transcript";
import { hasImmediateRiskLanguage } from "../lib/safety";

function message(
  role: VoiceSessionMessage["role"],
  text: string,
  final = false
): VoiceSessionMessage {
  return { role, text, final, timestamp: new Date(0).toISOString() };
}

test("streaming transcript chunks merge into the current speaker turn", () => {
  const first = mergeTranscriptMessage([], message("assistant", "Take "));
  const second = mergeTranscriptMessage(first, message("assistant", "one breath.", true));

  assert.equal(second.length, 1);
  assert.equal(second[0]?.text, "Take one breath.");
  assert.equal(second[0]?.final, true);
});

test("speaker changes create a new transcript turn", () => {
  const messages = mergeTranscriptMessage(
    [message("user", "I feel stuck.", true)],
    message("assistant", "Let us shrink the task.", true)
  );

  assert.equal(messages.length, 2);
  assert.equal(messages[1]?.role, "assistant");
});

test("transcript history is bounded", () => {
  let messages: VoiceSessionMessage[] = [];
  for (let index = 0; index < 50; index += 1) {
    messages = mergeTranscriptMessage(
      messages,
      message(index % 2 ? "assistant" : "user", String(index), true),
      10
    );
  }

  assert.equal(messages.length, 10);
  assert.equal(messages[0]?.text, "40");
});

test("direct self-harm language is detected in voice transcripts", () => {
  assert.equal(hasImmediateRiskLanguage("I want to kill myself"), true);
  assert.equal(hasImmediateRiskLanguage("I am stressed about tomorrow's exam"), false);
});
