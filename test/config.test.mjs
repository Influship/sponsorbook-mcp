import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import test from "node:test";
import { DEFAULT_MCP_URL, resolveMcpUrl } from "../src/config.mjs";

test("uses the hosted Sponsorbook endpoint by default", () => {
  assert.equal(resolveMcpUrl({}), DEFAULT_MCP_URL);
});

test("allows secure development endpoints and local HTTP", () => {
  assert.equal(
    resolveMcpUrl({ SPONSORBOOK_MCP_URL: "https://preview.example/mcp" }),
    "https://preview.example/mcp",
  );
  assert.equal(
    resolveMcpUrl({ SPONSORBOOK_MCP_URL: "http://localhost:3000/mcp" }),
    "http://localhost:3000/mcp",
  );
  assert.equal(
    resolveMcpUrl({ SPONSORBOOK_MCP_URL: "http://example.com/mcp" }),
    DEFAULT_MCP_URL,
  );
});

test("reports help and version without starting authentication", () => {
  const help = spawnSync(process.execPath, ["bin.mjs", "--help"], { encoding: "utf8" });
  assert.equal(help.status, 0);
  assert.match(help.stdout, /Sponsorbook MCP/);
  assert.doesNotMatch(help.stdout, /Clerk|API key/i);

  const version = spawnSync(process.execPath, ["bin.mjs", "--version"], {
    encoding: "utf8",
  });
  assert.equal(version.status, 0);
  assert.equal(version.stdout.trim(), "0.1.1");
});

test("package and registry metadata stay aligned", () => {
  const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  const server = JSON.parse(readFileSync(new URL("../server.json", import.meta.url), "utf8"));
  assert.equal(pkg.mcpName, server.name);
  assert.equal(pkg.version, server.version);
  assert.equal(server.packages[0].version, pkg.version);
  assert.equal(server.packages[0].identifier, pkg.name);
  assert.equal(server.remotes[0].url, DEFAULT_MCP_URL);
  assert.equal(pkg.dependencies["mcp-remote"], "0.2.4");
  assert.equal(pkg.engines.node, ">=20.18.1");
});
