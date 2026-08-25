import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_MCP_URL } from "../src/config.mjs";

test("production publishes OAuth resource metadata", async () => {
  const metadataUrl = new URL("/.well-known/oauth-protected-resource/mcp", DEFAULT_MCP_URL);
  const response = await fetch(metadataUrl, { signal: AbortSignal.timeout(10_000) });
  assert.equal(response.status, 200);
  const metadata = await response.json();
  assert.equal(metadata.resource, "https://app.sponsorbook.io");
  assert.ok(Array.isArray(metadata.authorization_servers));
  assert.ok(metadata.authorization_servers.length > 0);
});

test("production challenges unauthenticated MCP requests", async () => {
  const response = await fetch(DEFAULT_MCP_URL, {
    method: "POST",
    headers: {
      Accept: "application/json, text/event-stream",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2025-11-25",
        capabilities: {},
        clientInfo: { name: "sponsorbook-mcp-smoke", version: "0.1.1" },
      },
    }),
    signal: AbortSignal.timeout(10_000),
  });
  assert.equal(response.status, 401);
  assert.match(response.headers.get("www-authenticate") ?? "", /resource_metadata=/);
  const body = await response.json();
  assert.equal(body.error, "invalid_token");
});
