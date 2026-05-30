import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("responsive CSS contracts", () => {
  it("keeps compact action labels on one line", async () => {
    const css = await readFile(resolve("src/styles.css"), "utf8");

    expect(css).toMatch(/\.compact-action\s*{[^}]*white-space:\s*nowrap/s);
  });

  it("keeps campaign header actions from wrapping in the topbar", async () => {
    const css = await readFile(resolve("src/styles.css"), "utf8");

    expect(css).toMatch(/\.campaign-quick-actions\s*{[^}]*flex:\s*0\s+0\s+auto/s);
    expect(css).toMatch(/\.campaign-header-action\s*{[^}]*white-space:\s*nowrap/s);
  });

  it("lets the topbar title shrink before fixed action controls", async () => {
    const css = await readFile(resolve("src/styles.css"), "utf8");

    expect(css).toMatch(/\.topbar\s*{[^}]*display:\s*flex/s);
    expect(css).toMatch(/\.project-title\s*{[^}]*flex:\s*1\s+1\s+0/s);
    expect(css).toMatch(/\.topbar-actions\s*{[^}]*flex:\s*0\s+0\s+auto/s);
  });

  it("compresses lower-priority topbar metadata on medium screens", async () => {
    const css = await readFile(resolve("src/styles.css"), "utf8");

    expect(css).toMatch(/@media\s*\(max-width:\s*1280px\)\s*{[\s\S]*?\.saved-state strong\s*{[^}]*display:\s*none/s);
    expect(css).toMatch(/@media\s*\(max-width:\s*1280px\)\s*{[\s\S]*?\.profile-chip\s*{[^}]*grid-template-columns:\s*30px\s+14px/s);
  });
});
