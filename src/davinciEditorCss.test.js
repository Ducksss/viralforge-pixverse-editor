import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const styles = readFileSync(`${process.cwd()}/src/davinciEditor.css`, "utf8");

const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

const extractSelectors = (css) => {
  const selectors = [];
  let chunkStart = 0;

  for (let index = 0; index < css.length; index += 1) {
    const char = css[index];

    if (char === "{") {
      const rawSelector = css.slice(chunkStart, index).trim();
      chunkStart = index + 1;

      if (!rawSelector || rawSelector.startsWith("@")) {
        continue;
      }

      for (const selector of rawSelector.split(",")) {
        const trimmed = selector.trim();

        if (trimmed) {
          selectors.push(trimmed);
        }
      }
    }

    if (char === "}") {
      chunkStart = index + 1;
    }
  }

  return selectors;
};

describe("DaVinci editor stylesheet scoping", () => {
  it("keeps local NLE rules scoped away from the campaign workspace", () => {
    const selectors = extractSelectors(stripComments(styles));
    const unscopedSelectors = selectors.filter((selector) => {
      return !(
        selector.startsWith(".davinci-shell") ||
        selector.startsWith("body:has(.davinci-shell)") ||
        selector.startsWith(".davinci-drag-overlay")
      );
    });

    expect(unscopedSelectors).toEqual([]);
    expect(styles).not.toMatch(/(^|})\s*body\s*\{/);
    expect(styles).not.toMatch(/(^|})\s*\*\s*\{/);
    expect(styles).not.toMatch(/(^|})\s*\.(editor-sidebar|editor-topbar|panel-header|assistant-panel|timeline-panel)\s*\{/);
  });
});
