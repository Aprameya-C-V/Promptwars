import assert from "node:assert/strict";
import test from "node:test";
import { decodeBase64ToPcm16, float32ToPcm16Base64 } from "../lib/live/audio";

test("PCM conversion clamps float samples and preserves little-endian values", () => {
  const encoded = float32ToPcm16Base64(new Float32Array([-2, -1, 0, 0.5, 1, 2]));
  const decoded = decodeBase64ToPcm16(encoded);

  assert.deepEqual(Array.from(decoded), [-32768, -32768, 0, 16383, 32767, 32767]);
});

test("empty audio chunks round-trip safely", () => {
  const encoded = float32ToPcm16Base64(new Float32Array());
  assert.equal(encoded, "");
  assert.equal(decodeBase64ToPcm16(encoded).length, 0);
});
