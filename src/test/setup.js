import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

vi.mock("@remotion/player", () => ({
  Player: ({ className, inputProps }) => (
    React.createElement(
      "div",
      { className, "data-testid": "remotion-player" },
      `Remotion viewer ${inputProps?.project?.aspectRatio || ""}`,
    )
  ),
}));

Object.defineProperty(HTMLMediaElement.prototype, "play", {
  configurable: true,
  value: vi.fn(() => Promise.resolve()),
});

Object.defineProperty(HTMLMediaElement.prototype, "pause", {
  configurable: true,
  value: vi.fn(),
});
