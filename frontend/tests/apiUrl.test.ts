import assert from "node:assert/strict";
import test from "node:test";
import { buildApiUrl, normalizeApiBaseUrl } from "../lib/apiUrl";

test("API base URLs remove all trailing slashes", () => {
  assert.equal(
    normalizeApiBaseUrl("https://promptwars-backend.vercel.app///"),
    "https://promptwars-backend.vercel.app"
  );
});

test("API paths are joined with exactly one slash", () => {
  assert.equal(
    buildApiUrl("https://promptwars-backend.vercel.app/", "/api/analyze"),
    "https://promptwars-backend.vercel.app/api/analyze"
  );
  assert.equal(
    buildApiUrl("http://localhost:4000", "health"),
    "http://localhost:4000/health"
  );
});
