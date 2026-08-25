export const DEFAULT_MCP_URL = "https://app.sponsorbook.io/mcp";

function isAllowedDevelopmentUrl(value) {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    if (url.protocol === "https:") return true;
    return (
      url.protocol === "http:" &&
      (url.hostname === "localhost" || url.hostname === "127.0.0.1")
    );
  } catch {
    return false;
  }
}

export function resolveMcpUrl(environment = process.env) {
  return isAllowedDevelopmentUrl(environment.SPONSORBOOK_MCP_URL)
    ? environment.SPONSORBOOK_MCP_URL
    : DEFAULT_MCP_URL;
}
