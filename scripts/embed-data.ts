#!/usr/bin/env -S deno run --allow-read --allow-write

const GITMOJI_DATA_PATH = "./gitmojis.json";
const TEMPLATE_PATH = "./main.template.ts";
const OUTPUT_PATH = "./main.ts";

const embedData = async () => {
  const gitmojiData = await (async () => {
    try {
      return await Deno.readTextFile(GITMOJI_DATA_PATH);
    } catch (error) {
      console.error(`Error reading gitmoji data: ${error.message}`);
      return null;
    }
  })();

  if (!gitmojiData) {
    Deno.exit(1);
  }

  const parsedData = (() => {
    try {
      return JSON.parse(gitmojiData);
    } catch (error) {
      console.error(`Error parsing gitmoji JSON: ${error.message}`);
      return null;
    }
  })();

  if (!parsedData) {
    Deno.exit(1);
  }

  const gitmojiConstant = `export const GITMOJI_DATA = ${
    JSON.stringify(parsedData, null, 2)
  } as const;`;

  const template = await (async () => {
    try {
      return await Deno.readTextFile(TEMPLATE_PATH);
    } catch (error) {
      console.error(`Error reading template: ${error.message}`);
      return null;
    }
  })();

  if (!template) {
    Deno.exit(1);
  }

  const output = template.replace(
    "{{GITMOJI_DATA_PLACEHOLDER}}",
    gitmojiConstant,
  );

  const writeResult = await (async () => {
    try {
      await Deno.writeTextFile(OUTPUT_PATH, output);
      return true;
    } catch (error) {
      console.error(`Error writing output file: ${error.message}`);
      return false;
    }
  })();

  if (!writeResult) {
    Deno.exit(1);
  }

  console.log(`Successfully embedded gitmoji data into ${OUTPUT_PATH}`);
};

if (import.meta.main) {
  await embedData();
}
