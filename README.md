# Sponsorbook MCP

Research YouTube sponsors from Claude, Codex, Cursor, and other MCP clients.

Sponsorbook MCP lets your agent find sponsors, inspect the videos and creators behind each relationship, explore similar brands, manage research lists, and work with verified contacts.

## What you can do

- Find sponsor brands by name, domain, language, recency, volume, and typical views.
- Inspect a brand's sponsorship history and the supporting video evidence.
- Explore creators a brand sponsors and brands with overlapping creator relationships.
- Search YouTube channels and see which brands have sponsored them.
- Create lists, save brands, and attach research notes.
- View masked contacts, explicitly reveal a stored email, or request a contact when none exists.

## Connect

Sponsorbook MCP requires a Sponsorbook Pro workspace.

### Remote MCP

Use the hosted endpoint when your client supports remote MCP with authentication:

```text
https://app.sponsorbook.io/mcp
```

### Local MCP configuration

For clients that launch a local MCP command:

```json
{
  "mcpServers": {
    "sponsorbook": {
      "command": "npx",
      "args": ["-y", "@sponsorbook/mcp"]
    }
  }
}
```

Your browser opens on the first connection so you can sign in and choose your Sponsorbook workspace. Later connections reuse that authorization.

## Requirements

- Node.js 20.18.1 or newer for the local package
- A Sponsorbook Pro workspace

## How it works

The package is a small open-source bridge for MCP clients that launch local commands. Sponsorbook's hosted MCP server performs the research and applies the same workspace permissions, contact reveal rules, and catalogue limits as the web app.

The hosted server and Sponsorbook catalogue are separate from this repository.

## Development

```sh
npm install
npm test
npm run test:live
```

Set `SPONSORBOOK_MCP_URL` to an HTTPS endpoint, or to an HTTP localhost endpoint, when testing another Sponsorbook deployment.

## Security

Please report vulnerabilities through [GitHub private vulnerability reporting](https://github.com/Influship/sponsorbook-mcp/security/advisories/new).

## Licence

[MIT](LICENSE)
