import assert from "node:assert/strict";
import test from "node:test";
import { detectRisk } from "../src/safety/detectRisk.js";

test("detectRisk returns crisis for direct self-harm language", () => {
  const result = detectRisk("I want to kill myself");
  assert.equal(result.status, "crisis");
});

test("detectRisk returns elevated for overwhelm language", () => {
  const result = detectRisk("I feel overwhelmed and I can't cope");
  assert.equal(result.status, "elevated");
});

test("detectRisk returns ok for neutral reflection", () => {
  const result = detectRisk("I had a long study day and felt tired");
  assert.equal(result.status, "ok");
});

