import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("responsive CSS contracts", () => {
  it("keeps compact action labels on one line", async () => {
    const css = await readFile(resolve("src/styles.css"), "utf8");

    expect(css).toMatch(/\.compact-action\s*{[^}]*white-space:\s*nowrap/s);
  });
});
