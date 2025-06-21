#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write

const GITMOJI_URL =
  "https://raw.githubusercontent.com/carloscuesta/gitmoji/master/packages/gitmojis/src/gitmojis.json";
const OUTPUT_PATH = "./gitmojis.json";
const CACHE_INFO_PATH = "./gitmoji-cache.json";
const CACHE_DURATION_MS = 1000 * 60 * 60 * 24;

const cacheInfo = await (async () => {
  try {
    return JSON.parse(await Deno.readTextFile(CACHE_INFO_PATH));
  } catch {
    return null;
  }
})();

if (cacheInfo && (Date.now() - cacheInfo.lastFetch) < CACHE_DURATION_MS) {
  const existingData = await (async () => {
    try {
      return await Deno.readTextFile(OUTPUT_PATH);
    } catch {
      return null;
    }
  })();
  if (existingData) {
    const existingHash = Array.from(
      new Uint8Array(
        await crypto.subtle.digest(
          "SHA-256",
          new TextEncoder().encode(existingData),
        ),
      ),
    )
      .map((b) => b.toString(16).padStart(2, "0")).join("");
    if (existingHash === cacheInfo.hash) Deno.exit(0);
  }
}

const data = await (await fetch(GITMOJI_URL)).text();
const hash = Array.from(
  new Uint8Array(
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(data)),
  ),
)
  .map((b) => b.toString(16).padStart(2, "0")).join("");

if (cacheInfo?.hash === hash) {
  await Deno.writeTextFile(
    CACHE_INFO_PATH,
    JSON.stringify({
      lastFetch: Date.now(),
      hash,
      size: new TextEncoder().encode(data).length,
    }),
  );
  Deno.exit(0);
}

JSON.parse(data);
await Deno.writeTextFile(OUTPUT_PATH, data);
await Deno.writeTextFile(
  CACHE_INFO_PATH,
  JSON.stringify({
    lastFetch: Date.now(),
    hash,
    size: new TextEncoder().encode(data).length,
  }),
);
