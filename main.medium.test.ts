import { expect, test } from "vitest";

test(
  "when listing gitmoji then returns paginated results",
  async () => {
    const command = new Deno.Command("deno", {
      args: ["run", "-A", "--no-check", `${Deno.cwd()}/main.ts`],
      stdin: "piped",
      stdout: "piped",
      stderr: "piped",
    });
    const child = command.spawn();

    const writer = child.stdin.getWriter();
    const reader = child.stdout.pipeThrough(new TextDecoderStream())
      .getReader();

    await writer.write(new TextEncoder().encode(
      JSON.stringify({
        jsonrpc: "2.0",
        id: "init-1",
        method: "initialize",
        params: {
          protocolVersion: "2025-06-18",
          capabilities: {},
          clientInfo: { name: "test-client-stdio", version: "0.0.1" },
        },
      }) + "\n",
    ));

    const readLines = async () => {
      const line = await reader.read();
      if (line.done) {
        return;
      }
      try {
        return JSON.parse(line.value);
      } catch {
        return await readLines();
      }
    };

    await readLines();

    await writer.write(new TextEncoder().encode(
      JSON.stringify({
        jsonrpc: "2.0",
        method: "initialized",
        params: {},
      }) + "\n",
    ));

    await writer.write(new TextEncoder().encode(
      JSON.stringify({
        jsonrpc: "2.0",
        id: "call-1",
        method: "tools/call",
        params: {
          name: "list_gitmoji",
          arguments: { page: 1, limit: 5 },
        },
      }) + "\n",
    ));

    const actual = await readLines();

    const text = actual.result.content[0].text;
    expect(text).toContain("🎨 :art:");
    expect(text).toContain("Improve structure");
    expect(text).toContain("Total: 74 items");

    await writer.close();
    child.kill("SIGTERM");
    await child.status;
  },
  1000,
);

test(
  "when searching for bug then returns matching gitmoji",
  async () => {
    const command = new Deno.Command("deno", {
      args: ["run", "-A", "--no-check", `${Deno.cwd()}/main.ts`],
      stdin: "piped",
      stdout: "piped",
      stderr: "piped",
    });
    const child = command.spawn();

    const writer = child.stdin.getWriter();
    const reader = child.stdout.pipeThrough(new TextDecoderStream())
      .getReader();

    await writer.write(new TextEncoder().encode(
      JSON.stringify({
        jsonrpc: "2.0",
        id: "init-1",
        method: "initialize",
        params: {
          protocolVersion: "2025-06-18",
          capabilities: {},
          clientInfo: { name: "test-client-stdio", version: "0.0.1" },
        },
      }) + "\n",
    ));

    const readLines = async () => {
      const line = await reader.read();
      if (line.done) {
        return;
      }
      try {
        return JSON.parse(line.value);
      } catch {
        return await readLines();
      }
    };

    await readLines();

    await writer.write(new TextEncoder().encode(
      JSON.stringify({
        jsonrpc: "2.0",
        method: "initialized",
        params: {},
      }) + "\n",
    ));

    await writer.write(new TextEncoder().encode(
      JSON.stringify({
        jsonrpc: "2.0",
        id: "call-1",
        method: "tools/call",
        params: {
          name: "search_gitmoji",
          arguments: { query: "bug" },
        },
      }) + "\n",
    ));

    const actual = await readLines();

    const text = actual.result.content[0].text;
    expect(text).toContain("🐛 :bug:");
    expect(text).toContain("Fix a bug");

    await writer.close();
    child.kill("SIGTERM");
    await child.status;
  },
  1000,
);

test(
  "when searching for nonexistent term then returns empty results",
  async () => {
    const command = new Deno.Command("deno", {
      args: ["run", "-A", "--no-check", `${Deno.cwd()}/main.ts`],
      stdin: "piped",
      stdout: "piped",
      stderr: "piped",
    });
    const child = command.spawn();

    const writer = child.stdin.getWriter();
    const reader = child.stdout.pipeThrough(new TextDecoderStream())
      .getReader();

    await writer.write(new TextEncoder().encode(
      JSON.stringify({
        jsonrpc: "2.0",
        id: "init-1",
        method: "initialize",
        params: {
          protocolVersion: "2025-06-18",
          capabilities: {},
          clientInfo: { name: "test-client-stdio", version: "0.0.1" },
        },
      }) + "\n",
    ));

    const readLines = async () => {
      const line = await reader.read();
      if (line.done) {
        return;
      }
      try {
        return JSON.parse(line.value);
      } catch {
        return await readLines();
      }
    };

    await readLines();

    await writer.write(new TextEncoder().encode(
      JSON.stringify({
        jsonrpc: "2.0",
        method: "initialized",
        params: {},
      }) + "\n",
    ));

    await writer.write(new TextEncoder().encode(
      JSON.stringify({
        jsonrpc: "2.0",
        id: "call-1",
        method: "tools/call",
        params: {
          name: "search_gitmoji",
          arguments: { query: "nonexistent" },
        },
      }) + "\n",
    ));

    const actual = await readLines();

    const text = actual.result.content[0].text;
    expect(text).toContain("Found: 0 items");

    await writer.close();
    child.kill("SIGTERM");
    await child.status;
  },
  1000,
);

test("when passing invalid tool name then returns error message", async () => {
  const command = new Deno.Command("deno", {
    args: ["run", "-A", "--no-check", `${Deno.cwd()}/main.ts`],
    stdin: "piped",
    stdout: "piped",
    stderr: "piped",
  });
  const child = command.spawn();

  const writer = child.stdin.getWriter();
  const reader = child.stdout.pipeThrough(new TextDecoderStream())
    .getReader();

  await writer.write(new TextEncoder().encode(
    JSON.stringify({
      jsonrpc: "2.0",
      id: "init-1",
      method: "initialize",
      params: {
        protocolVersion: "2025-06-18",
        capabilities: {},
        clientInfo: { name: "test-client-stdio", version: "0.0.1" },
      },
    }) + "\n",
  ));

  const readLines = async () => {
    const line = await reader.read();
    if (line.done) {
      return;
    }
    try {
      return JSON.parse(line.value);
    } catch {
      return await readLines();
    }
  };

  await readLines();

  await writer.write(new TextEncoder().encode(
    JSON.stringify({
      jsonrpc: "2.0",
      method: "initialized",
      params: {},
    }) + "\n",
  ));

  await writer.write(new TextEncoder().encode(
    JSON.stringify({
      jsonrpc: "2.0",
      id: "call-1",
      method: "tools/call",
      params: {
        name: "invalid-tool",
        arguments: {},
      },
    }) + "\n",
  ));

  const actual = await readLines();

  expect(actual.result).toBeDefined();
  expect(actual.result.isError).toBe(true);
  if (!Array.isArray(actual.result.content)) {
    throw new Error("Expected content to be an array");
  }
  expect(actual.result.content[0].text).toContain("MCP error -32602");
  expect(actual.result.content[0].text).toContain("invalid-tool");

  await writer.close();
  child.kill("SIGTERM");
  await child.status;
}, 1000);
