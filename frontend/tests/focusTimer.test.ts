import assert from "node:assert/strict";
import test from "node:test";
import { FOCUS_DURATION_SECONDS, formatTimer } from "../lib/focusTimer";

test("focus timer starts at exactly 25 minutes", () => {
  assert.equal(FOCUS_DURATION_SECONDS, 1500);
  assert.equal(formatTimer(FOCUS_DURATION_SECONDS), "25:00");
});

test("focus timer formatting clamps invalid negative time", () => {
  assert.equal(formatTimer(61), "01:01");
  assert.equal(formatTimer(-5), "00:00");
});
