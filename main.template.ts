#!/usr/bin/env -S deno run --allow-all

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

type GitmojiItem = {
  emoji: string;
  entity: string;
  code: string;
  description: string;
  name: string;
  semver: string | null;
};

%GITMOJI_DATA_PLACEHOLDER%

const server = new McpServer({
  name: "mcp-gitmoji",
  version: "0.1.0",
});

server.registerTool(
  "list_gitmoji",
  {
    title: "List Gitmoji",
    description: "List all available gitmoji emojis with their descriptions",
    inputSchema: {
      page: z.number().default(1),
      limit: z.number().default(10),
    },
  },
  ({ page = 1, limit = 10 }) => {
    const offset = (page - 1) * Math.min(limit, 50);
    const gitmojis = GITMOJI_DATA.gitmojis;
    const total = gitmojis.length;
    const paginatedItems = gitmojis.slice(offset, offset + limit);

    const formatItem = (item: GitmojiItem) =>
      `${item.emoji} ${item.code} - ${item.description}`;

    const content = [
      `Gitmoji List (Page ${page}/${
        Math.ceil(total / limit)
      }) - Total: ${total} items`,
      "",
      ...paginatedItems.map(formatItem),
      "",
      `Showing ${paginatedItems.length} of ${total} items`,
    ].join("\n");

    return {
      content: [{
        type: "text",
        text: content,
      }],
    };
  },
);

server.registerTool(
  "search_gitmoji",
  {
    title: "Search Gitmoji",
    description: "Search gitmoji by keyword in description or code",
    inputSchema: {
      query: z.string(),
    },
  },
  ({ query }) => {
    const searchTerm = query.toLowerCase();
    const filtered = GITMOJI_DATA.gitmojis.filter(
      (item: GitmojiItem) =>
        item.description.toLowerCase().includes(searchTerm) ||
        item.code.toLowerCase().includes(searchTerm) ||
        item.name.toLowerCase().includes(searchTerm),
    );

    const formatItem = (item: GitmojiItem) =>
      `${item.emoji} ${item.code} - ${item.description}`;

    const content = [
      `Search Results for "${query}" - Found: ${filtered.length} items`,
      "",
      ...filtered.map(formatItem),
    ].join("\n");

    return {
      content: [{
        type: "text",
        text: content,
      }],
    };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
