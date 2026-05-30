import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const styles = readFileSync(`${process.cwd()}/src/davinciEditor.css`, "utf8");

describe("desktop editor layout scrolling", () => {
  it("keeps the DaVinci workspace fixed while scrolling dense panels internally", () => {
    expect(styles).toMatch(/\.davinci-shell\s*\{[^}]*min-height:\s*100vh/s);
    expect(styles).toMatch(/@media\s*\(min-width:\s*1181px\)\s*\{[\s\S]*body:has\(\.davinci-shell\)\s*\{[^}]*overflow:\s*hidden/s);
    expect(styles).toMatch(/@media\s*\(min-width:\s*1181px\)\s*\{[\s\S]*\.davinci-shell\s*\{[^}]*height:\s*100vh/s);
    expect(styles).toMatch(/\.davinci-shell \.davinci-editor-grid\s*\{[^}]*height:\s*100%/s);
    expect(styles).toMatch(/\.davinci-shell \.editor-sidebar\s*\{[^}]*overflow-y:\s*auto/s);
    expect(styles).toMatch(/\.davinci-shell \.media-grid,[\s\S]*?\.davinci-shell \.music-list\s*\{[^}]*overflow-y:\s*auto/s);
    expect(styles).toMatch(/\.davinci-shell \.timeline-track-items,[\s\S]*?\.davinci-shell \.overlay-bed\s*\{[^}]*overflow-x:\s*auto/s);
  });
});
