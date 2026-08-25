#!/usr/bin/env node

import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import process from "node:process";
import { DEFAULT_MCP_URL, resolveMcpUrl } from "./src/config.mjs";

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  process.stdout.write(`Sponsorbook MCP

Usage:
  sponsorbook-mcp [mcp-remote options]

Connects your MCP client to ${DEFAULT_MCP_URL}.
Your browser opens on the first connection so you can sign in to Sponsorbook.
`);
  process.exit(0);
}

if (args.includes("--version") || args.includes("-v")) {
  const require = createRequire(import.meta.url);
  const metadata = require("./package.json");
  process.stdout.write(`${metadata.version}\n`);
  process.exit(0);
}

const require = createRequire(import.meta.url);
const mcpRemote = require.resolve("mcp-remote/dist/proxy.js");
const child = spawn(process.execPath, [mcpRemote, resolveMcpUrl(), ...args], {
  stdio: "inherit",
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal));
}

child.on("error", () => {
  process.stderr.write("Sponsorbook MCP could not start. Reinstall the package and try again.\n");
  process.exitCode = 1;
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exitCode = code ?? 1;
});
