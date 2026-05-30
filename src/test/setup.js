import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

const createMockStorage = () => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    key: (index) => Object.keys(store)[index] || null,
    get length() {
      return Object.keys(store).length;
    },
  };
};

const mockLocalStorage = createMockStorage();
const mockSessionStorage = createMockStorage();

delete globalThis.localStorage;
delete globalThis.sessionStorage;

Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: mockLocalStorage,
  writable: true,
});

Object.defineProperty(globalThis, "sessionStorage", {
  configurable: true,
  value: mockSessionStorage,
  writable: true,
});

if (typeof window !== "undefined") {
  delete window.localStorage;
  delete window.sessionStorage;
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: mockLocalStorage,
    writable: true,
  });
  Object.defineProperty(window, "sessionStorage", {
    configurable: true,
    value: mockSessionStorage,
    writable: true,
  });
}

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
