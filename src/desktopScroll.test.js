import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const styles =
  readFileSync(`${process.cwd()}/src/styles.css`, "utf8") +
  "\n" +
  readFileSync(`${process.cwd()}/src/davinciEditor.css`, "utf8");

describe("desktop editor layout scrolling", () => {
  it("does not trap the editor in a fixed-height desktop viewport", () => {
    expect(styles).toMatch(/body\s*\{[^}]*overflow:\s*auto/s);
    expect(styles).toMatch(/\.davinci-shell\s*\{[^}]*min-height:\s*100vh/s);
    expect(styles).toMatch(/\.davinci-shell\s*\{[^}]*height:\s*auto/s);
    expect(styles).toMatch(/\.davinci-shell\s*\{[^}]*overflow:\s*visible/s);
    expect(styles).toMatch(/\.editor-workspace\s*\{[^}]*min-height:\s*100vh/s);
    expect(styles).toMatch(/\.editor-workspace\s*\{[^}]*overflow:\s*visible/s);
    expect(styles).toMatch(/\.editor-sidebar\s*\{[^}]*overflow-y:\s*auto/s);
  });
});
