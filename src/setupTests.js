import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Unmount React trees after each test, as react-testing-library requires.
afterEach(() => {
  cleanup();
});

// Throw exceptions of console error messages
beforeEach(() => {
  console.error = vi.fn((error) => {
    throw new Error(error);
  });
});

const warn = console.warn;

function logWarning(...warnings) {
  const [warning] = warnings;
  if (
    warning.includes("componentWillMount has been renamed") ||
    warning.includes("componentWillReceiveProps has been renamed") ||
    warning.includes("componentWillUpdate has been renamed")
  ) {
    return;
  }
  warn(...warnings);
}

console.warn = logWarning;
