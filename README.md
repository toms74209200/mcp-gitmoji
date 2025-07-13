# mcp-gitmoji

Model Context Protocol(MCP) server for gitmoji.dev.

This server provides gitmoji emojis with their descriptions in a paginated
format.

## Requirements

- [Deno](https://deno.land/) 2.0.0 or later (recommended)

## Usage

```bash
deno run --allow-net jsr:@toms/mcp-gitmoji
```

For Visual Studio Code:

**`mcp.json`**

```json
{
  "servers": {
    "gitmoji-mcp": {
      "type": "stdio",
      "command": "deno",
      "args": [
        "run",
        "jsr:@toms/mcp-gitmoji"
      ]
    }
  }
}
```

## Features

- List gitmoji emojis with descriptions (paginated)
- Search gitmoji by description or emoji
- Based on [gitmoji.dev](https://gitmoji.dev/) standard

## Development

- Deno
- [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/typescript-sdk)
- [zod](https://github.com/colinhacks/zod)

## License

[MIT License](LICENSE)

## Author

[toms74209200](https://github.com/toms74209200)
