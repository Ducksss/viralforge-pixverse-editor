import "@testing-library/jest-dom/vitest";

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
    }
  };
};

const mockLocalStorage = createMockStorage();
const mockSessionStorage = createMockStorage();

delete globalThis.localStorage;
delete globalThis.sessionStorage;

Object.defineProperty(globalThis, "localStorage", {
  value: mockLocalStorage,
  writable: true,
  configurable: true
});

Object.defineProperty(globalThis, "sessionStorage", {
  value: mockSessionStorage,
  writable: true,
  configurable: true
});

if (typeof window !== "undefined") {
  delete window.localStorage;
  delete window.sessionStorage;
  Object.defineProperty(window, "localStorage", {
    value: mockLocalStorage,
    writable: true,
    configurable: true
  });
  Object.defineProperty(window, "sessionStorage", {
    value: mockSessionStorage,
    writable: true,
    configurable: true
  });
}



