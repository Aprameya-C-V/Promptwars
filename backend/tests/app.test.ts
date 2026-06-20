import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import test from "node:test";
import { createApp } from "../src/app.js";

async function withServer(
  run: (baseUrl: string) => Promise<void>
) {
  const server = createApp().listen(0);
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address() as AddressInfo;

  try {
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

test("health endpoint reports service readiness without exposing secrets", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.service, "hesychia-backend");
    assert.equal(typeof body.geminiConfigured, "boolean");
    assert.equal(JSON.stringify(body).includes("GEMINI_API_KEY"), false);
  });
});

test("companion crisis response bypasses model generation", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/companion/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "I want to kill myself",
        recentEntries: [],
        recentMessages: []
      })
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.safety.status, "crisis");
    assert.match(body.reply.text, /human support|trusted person|emergency/i);
  });
});

test("invalid companion payload returns a structured 400", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/companion/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "" })
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.error.message, "Invalid request payload");
    assert.ok(body.error.details);
  });
});

test("unknown routes return 404 and security headers", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/missing`);
    const body = await response.json();

    assert.equal(response.status, 404);
    assert.equal(body.error.message, "Route not found");
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.equal(response.headers.get("x-frame-options"), "DENY");
  });
});
